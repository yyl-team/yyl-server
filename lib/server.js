const path = require('path');
const extOs = require('yyl-os');
const chalk = require('chalk');
const tinylr = require('tiny-lr');
const connect = require('connect');
const serveIndex = require('serve-index');
const serveStatic = require('serve-static');
const serveFavicon = require('serve-favicon');
const livereload = require('connect-livereload');
const request = require('yyl-request');
const { URL } = require('url');
const fs = require('fs');
const http = require('http');
const util = require('yyl-util');
const LANG = require('../lang/index');

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

    const defaultPort = 5000;
    this.config = Object.assign({
      port: defaultPort,
      root: root,
      lrPort: +`${defaultPort}1`,
      livereload: false,
      serverAddress: `http://${extOs.LOCAL_IP}:${defaultPort}`,
      onInitMiddleWare: undefined,
      entry: undefined,
      mockRoot: path.resolve(root, 'mock')
    }, config);

    this.config.root = path.resolve(root, this.config.root);
    if (this.config.entry) {
      this.config.entry = path.resolve(root, this.config.entry);
    }

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
    log('info', [LANG.SERVER.START_BEGIN]);
    if (!await extOs.checkPort(config.port)) {
      throw new Error(`${LANG.SERVER.PORT_OCCUPIED}: ${chalk.yellow(config.port)}`);
    }

    let app = undefined;

    if (config.entry) {
      if (fs.existsSync(config.entry)) {
        app = require(path.resolve(config.root, config.entry));
        log('info', [`${LANG.SERVER.USE_PROJECT_SERVER}: ${chalk.yellow(config.entry)}`]);
        if (!app || typeof app.use !== 'function') {
          log('warn', [LANG.SERVER.NOT_EXPORT_APP]);
          log('success', [LANG.SERVER.SERVER_START_FINISHED]);
          return;
        }
      } else {
        log('error', `${LANG.SERVER.ENTRY_NOT_EXISTS}: ${config.entry}`);
        return;
      }
    } else {
      log('info', [LANG.SERVER.USE_BASE_SERVER]);
      app = connect();

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

      log('success', [`${LANG.INFO.SERVER_PATH}: ${chalk.yellow.bold(config.root)}`]);
      log('success', [`${LANG.INFO.SERVER_ADDRESS}: ${chalk.yellow.bold(config.serverAddress)}`]);
    }

    // livereload
    if (config.livereload) {
      if (!await extOs.checkPort(config.lrPort)) {
        throw new Error(`${LANG.SERVER.PORT_OCCUPIED}: ${chalk.yellow(config.lrPort)}`);
      }
      lrServer = tinylr();
      app.use(livereload({
        port: config.lrPort,
        src: `//${extOs.LOCAL_IP}:${config.lrPort}/livereload.js?snipver=1`
      }));
      log('success', [`${LANG.INFO.SERVER_LR_PORT}: ${chalk.yellow.bold(config.lrPort)}`]);
    }

    if (typeof config.onInitMiddleWare === 'function') {
      await config.onInitMiddleWare(app, config.port);
    }

    this.lrServer = lrServer;
    this.app = app;
    log('info', [LANG.SERVER.START_FINISHED]);
  }
  async abort() {
    const self = this;
    const { log } = this;
    log('info', [LANG.SERVER.ABORT_BEGIN]);
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
    log('info', [LANG.SERVER.ABORT_FINISHED]);
  }
  async livereload() {
    const { config, log } = this;
    const { lrPort, livereload } = config;
    if (livereload) {
      log('info', [LANG.SERVER.REQUEST_LIVERELOAD_START]);
      const reloadPath = `http://${extOs.LOCAL_IP}:${lrPort}/changed?files=1`;
      try {
        await request(reloadPath);
        log('info', [LANG.SERVER.REQUEST_LIVERELOAD_FINISHED]);
      } catch (er) {
        log('warn', [`${LANG.SERVER.REQUEST_LIVERELOAD_FAIL}: ${er.message}`]);
      }
    }
  }
}

module.exports = YServer;