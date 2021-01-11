const url = require('url')
const Server = require('./server')
const Proxy = require('./proxy')
const extOs = require('yyl-os')
const LANG = require('../lang/index')

class runner {
  static async clean() {
    await Proxy.clean()
    await Proxy.certClean()
  }
  constructor({ config, env, log, cwd, serverOption, ignoreServer }) {
    const iCwd = cwd || process.cwd()
    const iConfig = config
    const iLog = log || (() => undefined)
    let { localserver, proxy, commit } = iConfig
    let oriLocalserverPort = 0
    let iServer
    let iProxy
    let iHomePage
    if (!config) {
      throw new Error(LANG.RUNNER.CONFIG_NOT_SET)
    }
    if (localserver && !ignoreServer) {
      // server init
      iServer = new Server({
        cwd: iCwd,
        log: iLog,
        config: localserver,
        option: serverOption,
        env
      })

      const { serverAddress } = iServer.config
      iHomePage = serverAddress
      iConfig.localserver = localserver = iServer.config
    } else {
      if (env.port) {
        oriLocalserverPort = localserver.port
        localserver.port = env.port
      }
    }
    // proxy init
    if (proxy && env.proxy) {
      // localRemote 初始化
      if (!proxy.localRemote) {
        proxy.localRemote = {}
      }
      const formatLocalServer = (str) => {
        if (typeof str === 'string') {
          return str
            .replace(`127.0.0.1:${oriLocalserverPort}`, `${extOs.LOCAL_IP}:${localserver.port}`)
            .replace(`localhost:${oriLocalserverPort}`, `${extOs.LOCAL_IP}:${localserver.port}`)
            .replace('127.0.0.1:', `${extOs.LOCAL_IP}:`)
            .replace('localhost:', `${extOs.LOCAL_IP}:`)
        } else {
          return str
        }
      }

      Object.keys(proxy.localRemote).forEach((key) => {
        proxy.localRemote[key] = formatLocalServer(proxy.localRemote[key])
      })

      // commit.hostname 映射
      if (commit && localserver && localserver.port) {
        ;['hostname', 'staticHost', 'mainHost'].forEach((key) => {
          if (!commit[key] || commit[key] === '/') {
            return
          }
          const localHostname = commit[key]
            .replace(/[\\/]$/, '')
            .replace(/^https?:/, '')

          const urlObj = url.parse(`http:${localHostname}`)
          proxy.localRemote[
            `http://${urlObj.hostname}${urlObj.pathname}`
          ] = `http://${extOs.LOCAL_IP}:${localserver.port}${urlObj.pathname}`
        })
      }

      iProxy = new Proxy({
        cwd: iCwd,
        log: iLog,
        config: proxy,
        env
      })

      const { homePage } = iProxy.config
      if (homePage) {
        iHomePage = homePage
      }
      iConfig.proxy = proxy = iProxy.config
    }

    // 赋值
    this.cwd = iCwd
    this.server = iServer
    this.proxy = iProxy
    this.config = iConfig
    this.homePage = iHomePage
    this.log = iLog
    this.env = env
  }
  async start() {
    const { server, proxy } = this
    if (server) {
      await server.start()
      this.app = server.app
    }

    if (proxy) {
      await proxy.start()
    }
  }
  async abort() {
    const { server, proxy } = this
    if (server) {
      await server.abort()
    }

    if (proxy) {
      await proxy.abort()
    }
  }
  async livereload() {
    const { server } = this
    if (server) {
      await server.livereload()
    }
  }
}

module.exports = runner
