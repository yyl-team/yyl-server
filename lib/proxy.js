const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const extFs = require('yyl-fs');
// const print = require('yyl-print');
const util = require('yyl-util');
const extOs = require('yyl-os');
const { URL } = require('url');
const http = require('http');
const AnyProxy = require('anyproxy');
const USERPROFILE = process.env[process.platform == 'win32'? 'USERPROFILE': 'HOME'];
const PROXY_CACHE_PATH =  util.path.join(USERPROFILE, '.anyproxy/cache');

const hideProtocol = function (str) {
  if (typeof str === 'string') {
    return str.replace(/^http[s]?:/, '');
  } else {
    return str;
  }
};

class YProxy {
  log(type, args) {
    console.log(type, args);
  }
  constructor({ log, config, env }) {
    if (log) {
      this.log = log;
    }
    this.config = Object.assign({
      port: 8887,
      localRemote: {},
      https: false,
      homePage: '',
      ignores: []
    }, config);

    if (env.proxy && env.proxy !== true) {
      this.config.port = env.proxy;
    }
  }
  async start() {
    const { log, config } = this;
    const self = this;
    log('info', ['proxy start begin']);
    if (!await extOs.checkPort(config.port)) {
      throw new Error(`port ${chalk.yellow(config.port)} is occupied, please check`);
    }
    await this.clean();
    if (config.https) {
      log('success', `use ${chalk.yellow.bold('https')}`);
      if (!AnyProxy.utils.certMgr.ifRootCAFileExists()) {
        await util.makeAwait((next) => {
          AnyProxy.utils.certMgr.generateRootCA((error, keyPath) => {
            log('info', ['generateRootCA finished']);
            // let users to trust this CA before using proxy
            if (!error) {
              const certDir = path.dirname(keyPath);
              log('success', ['The cert is generated at', chalk.yellow.bold(certDir)]);
              extOs.openPath(certDir);
            } else {
              log('error', ['error when generating rootCA', error]);
            }
            next();
          });
        });
      }
    }

    const proxyOpts = {
      port: config.port,
      // gui
      webInterface: {
        enable: true,
        webPort: 5001
      },
      rule: {
        async beforeSendRequest(req) {
          const { localRemote, ignores } = config;
          if (typeof localRemote !== 'object') {
            return;
          }

          const iUrl = hideProtocol(req.url);

          let isIgnore = false;
          if (ignores && ignores.length) {
            ignores.forEach((key) => {
              const v1 = hideProtocol(key);
              if (iUrl === v1) {
                isIgnore = true;
              }
            });
          }

          if (isIgnore) {
            return null;
          }

          let proxyUrl = null;
          Object.keys(localRemote).forEach((key) => {
            const v1 = hideProtocol(key);
            if (iUrl.substr(0, v1.length) === v1) {
              proxyUrl = util.path.join(localRemote[key], iUrl.substr(v1.length));
            }
          });

          if (proxyUrl) {
            return await util.makeAwait((next) => {
              const vOpts = new URL(proxyUrl);
              vOpts.method = req.requestOptions.method;
              vOpts.headers = req.requestOptions.headers;
              if (vOpts.methd !== 'GET') {
                vOpts.body = req.requestData;
              }
              const vRequest = http.request(vOpts, (vRes) => {
                if (/^404|405$/.test(vRes.statusCode)) {
                  next(null);
                }
                vRes.on('error', () => {});
                next({
                  protocol: vOpts.protocol,
                  requestOptions: vOpts
                });
                return vRequest.abort();
              });
              vRequest.on('error', () => {
                next();
              });
              if (vOpts.body) {
                vRequest.write(vOpts.body);
              }
              vRequest.end();
            });
          } else {
            return null;
          }
        },
        beforeSendResponse(req, res) {
          if (path.extname(req.url) === '.tpl') {
            const newRes = res.response;
            newRes.header['Content-Type'] = 'text/html; charset=UTF-8';
            newRes.header['Access-Control-Allow-Origin'] = '*';
            newRes.header['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS';
            newRes.header['Access-Control-Allow-Headers'] = 'X-PINGOTHER, Content-Type';
            return Promise.resolve({
              response: newRes
            });
          } else {
            return Promise.resolve(null);
          }
        }
      },
      throttle: 10000,
      forceProxyHttps: config.https ? true: false,
      wsIntercept: true,
      silent: true
    };

    if (!await extOs.checkPort(proxyOpts.webInterface.webPort)) {
      throw new Error(`port ${chalk.yellow(proxyOpts.webInterface.webPort)} is occupied, please check`);
    }

    return await util.makeAwait((next) => {
      const server = new AnyProxy.ProxyServer(proxyOpts);

      const uiAddress = `http://${extOs.LOCAL_IP}:${proxyOpts.webInterface.webPort}/`;
      const port = config.port;

      server.on('ready', () => {
        Object.keys(config.localRemote).forEach((key) => {
          log('success', [`proxy map: ${chalk.cyan(key)} => ${chalk.yellow.bold(config.localRemote[key])}`]);
        });
        log('success', [`proxy ui address : ${chalk.yellow.bold(uiAddress)}`]);
        log('success', [`proxy server port: ${chalk.yellow.bold(port)}`]);
        log('success', ['proxy start finished']);
        next(config);
      });

      server.on('error', (e) => {
        throw e;
      });

      server.start();

      self.server = server;
    });
  }
  abort() {
    const { server } = this;
    const self = this;
    return new Promise((next) => {
      if (server) {
        server.close();
        self.server = null;
      }
      next();
    });
  }
  async clean() {
    const { log } = this;
    if (fs.existsSync(PROXY_CACHE_PATH)) {
      log('info', [`clean proxy cache start, path: ${chalk.yellow(PROXY_CACHE_PATH)}`]);
      const files = await extFs.removeFiles(PROXY_CACHE_PATH);
      log('success', [`clean proxy cache finished, total ${chalk.yellow(files.length)} files`]);
    } else {
      log('success', ['clean proxy cache finished, proxy cache path not exists']);
    }
  }
}

module.exports = YProxy;