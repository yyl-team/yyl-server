const Server = require('./server');
const Proxy = require('./proxy');
const extOs = require('yyl-os');
const chalk = require('chalk');

class runner {
  static async clean() {
    await Proxy.clean();
  }
  constructor({ config, env, log, cwd }) {
    const iCwd = cwd || process.cwd();
    const iConfig = config;
    const iLog = log || (() => undefined);
    const { localserver, proxy, commit} = iConfig;
    let iServer;
    let iProxy;
    let iHomePage;
    if (!config) {
      throw new Error('{ config } is not defined');
    }
    if (localserver) {
      // server init
      iServer = new Server({
        cwd: iCwd,
        log: iLog,
        config: localserver,
        env
      });

      const { serverAddress } = iServer.config;
      iHomePage = serverAddress;
      iConfig.localserver = iServer.config;

      // proxy init
      if (proxy) {
        // localRemote 初始化
        if (!proxy.localRemote) {
          proxy.localRemote = {};
        }
        const { port } = localserver;
        const formatLocalServer = (str) => {
          if (typeof str === 'string') {
            return str
              .replace(`127.0.0.1:${port}`, `${extOs.LOCAL_IP}:${port}`)
              .replace(`127.0.0.1:${port}1`, `${extOs.LOCAL_IP}:${port}1`)
              .replace(`localhost:${port}`, `${extOs.LOCAL_IP}:${port}`);
          } else {
            return str;
          }
        };

        Object.keys(proxy.localRemote).forEach((key) => {
          proxy.localRemote[key] = formatLocalServer(proxy.localRemote[key]);
        });

        // commit.hostname 映射
        if (commit && port) {
          ['hostname', 'staticHost', 'mainHost'].forEach((key) => {
            if (!commit[key]) {
              return;
            }
            const localHostname = commit[key].replace(/[\\/]$/, '').replace(/^https?:/, '');
            proxy.localRemote[`http:${localHostname}/`] = `http://${extOs.LOCAL_IP}:${port}/`;
          });
        }

        iProxy = new Proxy({
          cwd: iCwd,
          log: iLog,
          config: proxy,
          env
        });

        const { homePage } = iProxy.config;
        if (homePage) {
          iHomePage = homePage;
        }
        iConfig.proxy = iProxy.config;
      }
    }

    // 赋值
    this.cwd = iCwd;
    this.server = iServer;
    this.proxy = iProxy;
    this.config = iConfig;
    this.homePage = iHomePage;
    this.log = iLog;
    this.env = env;
  }
  async start() {
    const { server, proxy } = this;
    if (server) {
      await server.start();
      this.app = server.app;
    }

    if (proxy) {
      await proxy.start();
    }
    // if (homePage && !env.silent) {
    //   await extOs.openBrowser(homePage);
    //   log('success', [`go to page       : ${chalk.yellow.bold(homePage)}`]);
    // }
  }
  async abort() {
    const { server, proxy } = this;
    if (server) {
      await server.abort();
    }

    if (proxy) {
      await proxy.abort();
    }
  }
  async livereload() {
    const { server } = this;
    if (server) {
      await server.livereload();
    }
  }
}

module.exports = runner;