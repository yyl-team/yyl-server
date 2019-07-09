const path = require('path');
const extOs = require('yyl-os');
const chalk = require('chalk');
const tinylr = require('tiny-lr');
const connect = require('connect');
const serveIndex = require('serve-index');
const serveStatic = require('serve-static');
const serveFavicon = require('serve-favicon');
const livereload = require('connect-livereload');
const { URL } = require('url');
const fs = require('fs');
const http = require('http');
const util = require('yyl-util');

const mock = require('./mock');

require('http-shutdown').extend();

class YServer {
  log(type, args) {
    console.log(type, args);
  }
  // 初始化设置
  constructor({ log, config, env, cwd }) {
    if (log) {
      this.log = log;
    }

    let root = process.cwd();

    if (cwd) {
      root = cwd;
    }

    this.app = undefined;
    this.config = Object.assign({
      port: 5000,
      root: root,
      lrPort: 50001,
      livereload: false,
      serverAddress: `http://${extOs.LOCAL_IP}:5000`,
      onInitMiddleWare: undefined,
      mockRoot: path.join(root, 'mock')
    }, config);

    this.config.root = path.resolve(root, this.config.root);

    if (env.port) {
      this.config.port = env.port;
      this.config.lrPort = `${env.port}1`;
      this.config.serverAddress = `http://${extOs.Local_IP}:${env.port}`;
    }
    if (env.path) {
      this.config.root = path.resolve(this.config.root, env.path);
    }
  }
  async start() {
    const { config, log } = this;
    let lrServer = undefined;
    log('info', ['server start begin']);
    if (!await extOs.checkPort(config.port)) {
      throw new Error(`port ${chalk.yellow(config.port)} was occupied, please check`);
    }

    const app = connect();
    log('success', [`server path      : ${chalk.yellow.bold(config.root)}`]);
    log('success', [`server address   : ${chalk.yellow.bold(config.serverAddress)}`]);

    // livereload
    if (config.livereload) {
      if (!await extOs.checkPort(config.lrPort)) {
        throw new Error(`port ${chalk.yellow(config.lrPort)} was occupied, please check`);
      }
      lrServer = tinylr();
      app.use(livereload({
        port: config.lrPort,
        src: `//${extOs.LOCAL_IP}:${config.lrPort}/livereload.js?snipver=1`
      }));
      log('success', [`server lr port : ${chalk.yellow.bold(config.lrPort)}`]);
    }

    // mock
    const dbPath = path.join(config.mockRoot, 'db.json');
    const routesPath = path.join(config.mockRoot, 'routes.json');
    if (
      fs.existsSync(config.mockRoot) &&
      fs.existsSync(dbPath) &&
      fs.existsSync(routesPath)
    ) {
      app.use(mock({
        dbPath,
        routesPath
      }));
      log('info', ['use mock']);
    }

    // 执行 post 请求本地服务器时处理
    app.use((req, res, next) => {
      if (req.method == 'POST') {
        const filePath = path.join(config.root, new URL(req.url).pathname);
        if (fs.existsSync(filePath)) {
          res.write(fs.readFileSync(filePath));
        } else {
          res.statusCode = 404;
        }
        res.end();
      } else {
        next();
      }
    });

    // ico
    app.use(serveFavicon(path.join(__dirname, '../resource/favicon.ico')));

    // header
    app.use(serveStatic(config.root, {
      'setHeaders': function(res, iPath) {
        if (path.extname(iPath) === '.tpl') {
          res.setHeader('Content-Type', 'text/html; charset=UTF-8');
        }
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Expires', 0);
        res.setHeader('Pragma', 'no-cache');
      }
    }));

    app.use(serveIndex(config.root));

    if (typeof config.onInitMiddleWare === 'function') {
      await config.onInitMiddleWare(app, config.port);
    }

    const server = http.createServer(app).withShutdown();

    server.on('error', (err) => {
      log('error', [err]);
      throw err;
    });

    await util.makeAwait((next, reject) => {
      server.listen(config.port, (err) => {
        if (err) {
          return reject(err);
        }
        if (lrServer) {
          lrServer.listen(config.lrPort);
        }
        next(config);
      });
    });

    this.server = server;
    this.lrServer = lrServer;
    this.app = app;
    log('info', ['server start finished']);
  }
  async abort() {
    const self = this;
    const { log } = this;
    log('info', ['server abort begin']);
    if (self.server) {
      await util.makeAwait((next) => {
        self.server.shutdown(() => {
          self.server = null;
          next();
        });
      });
    }

    if (self.lrServer) {
      self.lrServer.close();
      self.lrServer = null;
    }
    log('info', ['server abort finished']);
  }
  async livereload() {
    // TODO
  }
}

module.exports = YServer;