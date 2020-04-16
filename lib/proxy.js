/* eslint-disable node/prefer-global/url */
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const extFs = require('yyl-fs')
// const print = require('yyl-print');
const util = require('yyl-util')
const extOs = require('yyl-os')
const { URL } = require('url')
const http = require('http')
const AnyProxy = require('anyproxy')
const USERPROFILE =
  process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME']
const PROXY_CACHE_PATH = util.path.join(USERPROFILE, '.anyproxy/cache')
const LANG = require('../lang/index')

const hideProtocol = function (str) {
  if (typeof str === 'string') {
    return str.replace(/^http[s]?:/, '')
  } else {
    return str
  }
}

class YProxy {
  static async clean() {
    const { log } = this
    const iLog = log || (() => undefined)
    if (fs.existsSync(PROXY_CACHE_PATH)) {
      iLog('info', [
        `${LANG.PROXY.CLEAN_CACHE_START}: ${chalk.yellow(PROXY_CACHE_PATH)}`
      ])
      const files = await extFs.removeFiles(PROXY_CACHE_PATH)
      iLog('success', [
        `${LANG.PROXY.CLEAN_CACHE_FINISHED}, total ${chalk.yellow(
          files.length
        )} files`
      ])
    } else {
      iLog('success', [LANG.PROXY.CLEAN_CACHE_FINISHED_EMPTY])
    }
  }
  constructor({ log, config, env }) {
    const iLog = log || (() => undefined)
    const iConfig = Object.assign(
      {
        port: 8887,
        webPort: 8886,
        localRemote: {},
        https: false,
        homePage: '',
        ignores: []
      },
      config
    )

    if (env.proxy && env.proxy !== true) {
      iConfig.port = env.proxy
      iConfig.webPort = `${env.proxy - 1}`
    }
    if (env.https) {
      iConfig.https = true
    }

    //  http map 转成 https
    if (iConfig.https) {
      const { localRemote } = iConfig
      const iLocalRemote = {}
      Object.keys(localRemote).forEach((key) => {
        const iKey = hideProtocol(key)
        iLocalRemote[`http:${iKey}`] = localRemote[key]
        iLocalRemote[`https:${iKey}`] = localRemote[key]
      })
      iConfig.localRemote = iLocalRemote
    }

    // 赋值
    this.config = iConfig
    this.log = iLog
  }
  async start() {
    const { log, config } = this
    const self = this
    log('info', [LANG.PROXY.START_BEGIN])
    if (!(await extOs.checkPort(config.port))) {
      throw new Error(
        `${LANG.SERVER.PORT_OCCUPIED}: ${chalk.yellow(config.port)}`
      )
    }
    await YProxy.clean()
    if (config.https) {
      log('success', [LANG.PROXY.USE_HTTPS])
      if (!AnyProxy.utils.certMgr.ifRootCAFileExists()) {
        await util.makeAwait((next) => {
          AnyProxy.utils.certMgr.generateRootCA((error, keyPath) => {
            log('info', [LANG.PROXY.GENERATE_ROOT_CA_FINISHED])
            // let users to trust this CA before using proxy
            if (!error) {
              const certDir = path.dirname(keyPath)
              log('success', [
                LANG.PROXY.GENERATE_ROOT_CA_FINISHED,
                chalk.yellow.bold(certDir)
              ])
              extOs.openPath(certDir)
            } else {
              log('error', [LANG.PROXY.GENERATE_ROOT_CA_ERROR, error])
            }
            next()
          })
        })
      }
    }

    const proxyOpts = {
      port: config.port,
      // gui
      webInterface: {
        enable: true,
        webPort: config.webPort
      },
      rule: {
        async beforeSendRequest(req) {
          const { localRemote, ignores } = config
          if (typeof localRemote !== 'object') {
            return
          }

          const iUrl = hideProtocol(req.url)

          let isIgnore = false
          if (ignores && ignores.length) {
            ignores.forEach((key) => {
              const v1 = hideProtocol(key)
              if (iUrl === v1) {
                isIgnore = true
              }
            })
          }

          if (isIgnore) {
            return null
          }

          const matches = []
          let proxyUrl = null
          Object.keys(localRemote).forEach((key) => {
            const v1 = hideProtocol(key)
            if (iUrl.substr(0, v1.length) === v1) {
              matches.push({
                prefix: v1,
                result: util.path.join(localRemote[key], iUrl.substr(v1.length))
              })
            }
          })

          if (matches.length) {
            matches.sort((a, b) => {
              return b.prefix.length - a.prefix.length
            })
            proxyUrl = matches[0].result
          }

          if (proxyUrl) {
            return await util.makeAwait((next) => {
              const vOpts = new URL(proxyUrl)
              vOpts.method = req.requestOptions.method
              vOpts.headers = req.requestOptions.headers
              if (vOpts.methd !== 'GET') {
                vOpts.body = req.requestData
              }
              const vRequest = http.request(vOpts, (vRes) => {
                if (/^404|405$/.test(vRes.statusCode)) {
                  next(null)
                }
                vRes.on('error', () => {})
                next({
                  protocol: vOpts.protocol,
                  requestOptions: vOpts
                })
                return vRequest.abort()
              })
              vRequest.on('error', () => {
                next()
              })
              if (vOpts.body) {
                vRequest.write(vOpts.body)
              }
              vRequest.end()
            })
          } else {
            return null
          }
        },
        beforeSendResponse(req, res) {
          if (path.extname(req.url) === '.tpl') {
            const newRes = res.response
            newRes.header['Content-Type'] = 'text/html; charset=UTF-8'
            newRes.header['Access-Control-Allow-Origin'] = '*'
            newRes.header['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
            newRes.header['Access-Control-Allow-Headers'] =
              'X-PINGOTHER, Content-Type'
            return Promise.resolve({
              response: newRes
            })
          } else {
            return Promise.resolve(null)
          }
        }
      },
      throttle: 10000,
      forceProxyHttps: config.https ? true : false,
      wsIntercept: true,
      silent: true
    }

    if (!(await extOs.checkPort(proxyOpts.webInterface.webPort))) {
      throw new Error(
        `${LANG.SERVER.PORT_OCCUPIED}: ${chalk.yellow(
          proxyOpts.webInterface.webPort
        )}`
      )
    }

    return await util.makeAwait((next) => {
      const server = new AnyProxy.ProxyServer(proxyOpts)

      const uiAddress = `http://${extOs.LOCAL_IP}:${proxyOpts.webInterface.webPort}/`
      const port = config.port

      server.on('ready', () => {
        log('success', [
          `${LANG.INFO.PROXY_UI_ADDRESS}: ${chalk.yellow.bold(uiAddress)}`
        ])
        log('success', [`${LANG.INFO.PROXY_PORT}: ${chalk.yellow.bold(port)}`])
        Object.keys(config.localRemote).forEach((key) => {
          log('success', [
            `${LANG.INFO.PROXY_MAP}: ${chalk.cyan(key)} => ${chalk.yellow.bold(
              config.localRemote[key]
            )}`
          ])
        })
        log('success', [LANG.PROXY.START_FINISHED])
        next(config)
      })

      server.on('error', (e) => {
        throw e
      })

      server.start()

      self.server = server
    })
  }
  async abort() {
    const { server } = this
    const self = this
    if (server) {
      server.close()
      self.server = null
    }
    await util.waitFor(2000)
  }
}

module.exports = YProxy
