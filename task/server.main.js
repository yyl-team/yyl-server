const util = require('yyl-util');
const extFs = require('yyl-fs');
const os = require('os');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const http = require('http');
const connect = require('connect');
const serveIndex = require('serve-index');
const serveStatic = require('serve-static');
const tinylr = require('tiny-lr');
const livereload = require('connect-livereload');

const proxy = require('./server.proxy.js');
const log = require('./server.log.js');
const fn = require('./server.fn.js');

const CWD = process.cwd();
const LOCAL_IP = (function() {
  var ipObj = os.networkInterfaces();
  var ipArr;
  for (var key in ipObj) {
    if (ipObj.hasOwnProperty(key)) {
      ipArr = ipObj[key];
      for (var fip, i = 0, len = ipArr.length; i < len; i++) {
        fip = ipArr[i];
        if (fip.family.toLowerCase() == 'ipv4' && !fip.internal) {
          return fip.address;
        }
      }
    }
  }
  return '127.0.0.1';
})();

const cache = {
  server: null,
  lrServer: null
};

const main = {
  async start(iEnv) {
    if (!iEnv.debug) {
      util.cleanScreen();
      log('info', ['local server init start']);
    }

    const config = await main.parseConfig(iEnv.config, iEnv);
    if (!await fn.checkPortUseage(config.localserver.port)) {
      throw `port ${chalk.yellow(config.localserver.port)} is occupied, please check`;
    }
    if (!fs.existsSync(config.localserver.root)) {
      extFs.mkdirSync(config.localserver.root);
    }

    log('success', `server path    : ${chalk.yellow(config.localserver.root)}`);
    log('success', `server address : ${chalk.yellow(config.localserver.address)}`);
    log('success', `server lr port : ${chalk.yellow(config.localserver.lrPort)}`);

    const app = connect();
    app.use(livereload({
      port: config.localserver.lrPort,
      src: `http://localhost:${config.localserver.lrPort}/livereload.js?snipver=1`
    }));

    // TODO mock 接入
    app.use(serveStatic(config.localserver.root, {
      'setHeaders': function(res) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    }));

    app.use(serveIndex(config.localserver.root));

    var server = http.createServer(app);
    var lrServer = tinylr();

    server.on('error', (err) => {
      throw err;
    });

    cache.server = server;
    cache.lrServer = lrServer;

    await fn.makeAwait((next, reject) => {
      server.listen(config.localserver.port, (err) => {
        if (err) {
          reject(err);
        }
        lrServer.listen(config.localserver.lrPort);
        if (!iEnv.silent && !iEnv.proxy) {
          util.openBrowser(config.localserver.address);
        }
        next(config);
      });
    });

    // init proxy
    await proxy.init(config.proxy);


    log('success', 'server start finished');
  },
  async abort() {
    if (cache.server) {
      await fn.makeAwait((next) => {
        cache.server.close(() => {
          cache.server = null;
          next();
        });
      });
    }

    if (cache.lrServer) {
      await fn.makeAwait((next) => {
        cache.lrServer.close();
        cache.lrServer = null;
        next();
      });
    }

    await proxy.abort();
  },
  parseConfig(configPath, iEnv) {
    let iPath;

    // default config
    let config = {
      localserver: {
        port: 5000,
        root: CWD,
        lrPort: 50001
      },
      proxy: {
        port: 8887,
        localRemote: {},
        ignores: []
      }
    };

    if (configPath) {
      if (fs.existsSync(configPath)) {
        iPath = configPath;
      } else {
        log('warn', `config path is not exists: ${configPath}`);
      }
    } else {
      [
        path.join(CWD, 'yys.config.js'),
        path.join(CWD, 'config.js')
      ].some((cPath) => {
        if (fs.existsSync(cPath)) {
          iPath = cPath;
          return true;
        }
      });
    }
    if (!iPath) {
      log('info', 'config path is not exists, use default config');
    } else {
      try {
        config = util.extend(true, config, require(iPath));
      } catch (er) {
        throw [`config parse error: ${iPath}`, er];
      }
    }

    config.localserver.address = `http://${LOCAL_IP}:${config.localserver.port}`;

    // 兼容 yyl 中的 config.js
    if (config && config.commit && config.commit.hostname) {
      if (!config.proxy.localRemote) {
        config.proxy.localRemote = {};
      }
      let key = config.commit.hostname.replace(/[\\/]$/, '');

      // 处理 hostname 中 不带 协议的情况
      if (/^[/]{2}\w/.test(key)) {
        key = `http:${key}`;
      }

      const val = util.joinFormat(`http://127.0.0.1:${config.localserver.port}`);
      config.proxy.localRemote[key] = val;
    }

    if (iEnv) {
      if (iEnv.path) {
        config.localserver.root = path.resolve(CWD, iEnv.path);
      }

      if (iEnv.port) {
        config.localserver.port = iEnv.port;
      }

      if (iEnv.lrPort) {
        config.localserver.lrPort = iEnv.lrPort;
      } else {
        config.localserver.lrPort = `${config.localserver.port}1`;
      }

      if (iEnv.proxy) {
        config.proxy.port = iEnv.port;
      }
    }

    return Promise.resolve(config);
  }
};

module.exports = main;
