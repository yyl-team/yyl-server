const httpProxy = require('http-proxy');
const chalk = require('chalk');
const http = require('http');
const url = require('url');
const AnyProxy = require('anyproxy');

const log = require('./server.log.js');
const fn = require('./server.fn.js');

const cache = {
  server: null,
  proxy: null
};

const proxy = {
  async init(op) {
    if (!await fn.checkPortUseage(op.port)) {
      throw `port ${chalk.yellow(op.port)} is occupied, please check`;
    }

    cache.proxy = new AnyProxy.ProxyServer({
      port: op.port,
      // gui
      webInterface: {
        enable: true,
        webPort: 8002
      },
      throttle: 10000,
      forceProxyHttps: false,
      wsIntercept: false,
      silent: true
    });

    cache.proxy.on('ready', () => {
      log('success', 'proxy server start');
      Object.keys(op.localRemote).forEach((key) => {
        log('success', `proxy map: ${chalk.cyan(key)} => ${chalk.yellow(op.localRemote[key])}`);
      });
      log('success', `proxy server port: ${chalk.yellow(op.port)}`);
    });

    cache.proxy.on('error', (e) => {
      console.log(JSON.stringify(e, null, ' '));
    });

    cache.proxy.start();



    // cache.proxy = httpProxy.createProxyServer({
    //   ws: true
    // });

    // cache.proxy.on('proxyRes', (proxyRes, req, res) => {
    //   if (res.shouldKeepAlive) {
    //     proxyRes.headers.connection = 'keep-alive';
    //   }
    // });

    // cache.proxy.on('error', (e) => {
    //   console.log(JSON.stringify(e, null, ' '));
    // });

    // cache.server = http.createServer((req, res) => {
    //   const iUrl = url.parse(req.url);
    //   console.log(`${iUrl.protocol}//${iUrl.hostname}:${iUrl.port}`);
    //   cache.proxy.web(req, res, {
    //     target: {
    //       host: iUrl.hostname,
    //       port: iUrl.port || 80,
    //       protocol: iUrl.protocol
    //     },
    //     changeOrigin: true
    //   });
    //   // TODO
    // });

    // cache.server.on('upgrade', (req, socket, head) => {
    //   req.headers.connection = 'upgrade';
    //   cache.proxy.ws(req, socket, head);
    // });


    // log('success', 'proxy server start');
    // Object.keys(op.localRemote).forEach((key) => {
    //   log('success', `proxy map: ${chalk.cyan(key)} => ${chalk.yellow(op.localRemote[key])}`);
    // });
    // log('success', `proxy server port: ${chalk.yellow(op.port)}`);

    // cache.server.listen(op.port);

    // return Promise.resolve(cache.server);
  },
  async abort() {
    if (cache.server) {
      await fn.makeAwait((next) => {
        cache.server.close(() => {
          cache.server = null;
          return next();
        });
      });
    }
  }
};

module.exports = proxy;
