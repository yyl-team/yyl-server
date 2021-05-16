import path from 'path'
import fs from 'fs'
import chalk from 'chalk'
import util from 'yyl-util'
import extOs from 'yyl-os'
import extFs from 'yyl-fs'
import { URL } from 'url'
import AnyProxy, { ProxyOptions, ProxyServer } from 'anyproxy'
import request from 'request'
import { ProxyConfig, Env, Logger } from 'yyl-config-types'

import { LANG, PROXY_CACHE_PATH, PROXY_CRET_PATH } from './const'

const hideProtocol = function (str: string) {
  if (typeof str === 'string') {
    return str.replace(/^http[s]?:/, '')
  } else {
    return str
  }
}

export interface LocalRemote {
  [remoteUrl: string]: string
}

export interface YProxyOption {
  env?: Env
  config?: ProxyConfig
  logger?: Logger
}

export type YProxyProperty = Required<YProxyOption>

export interface MatchItem {
  prefix: string
  result: string
}

export interface StaticFnOption {
  logger?: Logger
}
export class YProxy {
  /** 清理缓存 */
  static async clean(op?: StaticFnOption) {
    const iLog = op?.logger || (() => undefined)
    if (fs.existsSync(PROXY_CACHE_PATH)) {
      iLog('msg', 'info', [`${LANG.PROXY.CLEAN_CACHE_START}: ${chalk.yellow(PROXY_CACHE_PATH)}`])
      const files = await extFs.removeFiles(PROXY_CACHE_PATH)
      iLog('msg', 'success', [
        `${LANG.PROXY.CLEAN_CACHE_FINISHED}, total ${chalk.yellow(`${files.length}`)} files`
      ])
    } else {
      iLog('msg', 'success', [LANG.PROXY.CLEAN_CACHE_FINISHED_EMPTY])
    }
  }

  /** 清理证书 */
  static async certClean(op?: StaticFnOption) {
    const iLog = op?.logger || (() => undefined)
    if (fs.existsSync(PROXY_CRET_PATH)) {
      iLog('msg', 'info', [`${LANG.PROXY.CLEAN_CERT_START}: ${chalk.yellow(PROXY_CRET_PATH)}`])
      const files = await extFs.removeFiles(PROXY_CRET_PATH)

      iLog('msg', 'success', [
        `${LANG.PROXY.CLEAN_CERT_FINISHED}, total ${chalk.yellow(`${files.length}`)} files`
      ])
      iLog('msg', 'success', [LANG.PROXY.CERT_REINSTALL])
    } else {
      iLog('msg', 'success', [LANG.PROXY.CLEAN_CERT_FINISHED])
    }
  }

  config: Required<ProxyConfig> = {
    port: 8887,
    webPort: 8886,
    localRemote: {},
    https: false,
    homePage: '',
    ignores: []
  }

  server?: ProxyServer

  /** 日志输出 */
  log: Logger = (type, args1, args2) => {
    console.log(type, args1, args2)
  }

  constructor(op: YProxyOption) {
    const { env, config, logger } = op
    if (config) {
      this.config = Object.assign(this.config, config)
    }

    if (env?.proxy && env?.proxy !== true) {
      this.config.port = env?.proxy
      this.config.webPort = env?.proxy - 1
    }
    if (env?.https) {
      this.config.https = true
    }

    //  http map 转成 https
    if (this.config.https) {
      const { localRemote } = this.config
      const iLocalRemote: LocalRemote = {}
      Object.keys(localRemote).forEach((key) => {
        const iKey = hideProtocol(key)
        iLocalRemote[`http:${iKey}`] = localRemote[key]
        iLocalRemote[`https:${iKey}`] = localRemote[key]
      })
      this.config.localRemote = iLocalRemote
    }

    if (logger) {
      this.log = logger
    }
  }

  async start() {
    const { log, config } = this
    const self = this
    log('msg', 'info', [LANG.PROXY.START_BEGIN])
    if (!(await extOs.checkPort(config.port))) {
      throw new Error(`${LANG.SERVER.PORT_OCCUPIED}: ${chalk.yellow(`${config.port}`)}`)
    }
    await YProxy.clean({ logger: log })

    if (config.https) {
      log('msg', 'success', [LANG.PROXY.USE_HTTPS])
      if (!AnyProxy.utils.certMgr.ifRootCAFileExists()) {
        await util.makeAwait((next) => {
          AnyProxy.utils.certMgr.generateRootCA((error, keyPath) => {
            log('msg', 'info', [LANG.PROXY.GENERATE_ROOT_CA_FINISHED])
            // let users to trust this CA before using proxy
            if (!error) {
              const certDir = path.dirname(keyPath)
              log('msg', 'success', [
                LANG.PROXY.GENERATE_ROOT_CA_FINISHED,
                chalk.yellow.bold(certDir)
              ])
              extOs.openPath(certDir)
            } else {
              log('msg', 'error', [LANG.PROXY.GENERATE_ROOT_CA_ERROR, error])
            }
            next()
          })
        })
      }
    }

    const proxyOpts: ProxyOptions = {
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

          const matches: MatchItem[] = []
          let proxyUrl: string = ''
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
            return await new Promise((resolve) => {
              const vOpts: any = new URL(proxyUrl)
              vOpts.method = req.requestOptions.method
              vOpts.headers = req.requestOptions.headers
              if (vOpts.methd !== 'GET') {
                vOpts.body = req.requestData
              }
              const vParam = {
                uri: proxyUrl,
                method: req.requestOptions.method,
                headers: req.requestOptions.headers,
                body: undefined
              }
              if (vParam.method !== 'GET') {
                vParam.body = req.requestData.toString()
              }
              request(
                {
                  uri: proxyUrl,
                  method: req.requestOptions.method,
                  headers: req.requestOptions.headers,
                  encoding: null
                },
                (err, vRes) => {
                  if (err) {
                    log('msg', 'warn', [`${proxyUrl} - ${LANG.PROXY.REQUEST_ERROR}:`, err])
                    resolve(null)
                  } else if (/^404|405$/.test(`${vRes.statusCode}`)) {
                    resolve(null)
                  } else {
                    resolve({
                      response: {
                        statusCode: vRes.statusCode,
                        header: vRes.headers as Record<string, string>,
                        body: vRes.body
                      }
                    })
                  }
                }
              )
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
            newRes.header['Access-Control-Allow-Headers'] = 'X-PINGOTHER, Content-Type'
            return Promise.resolve({
              response: newRes
            })
          } else {
            return Promise.resolve(null)
          }
        }
      },
      throttle: 10000,
      forceProxyHttps: !!config.https,
      wsIntercept: true,
      silent: true
    }
    if (proxyOpts.webInterface?.webPort) {
      if (!(await extOs.checkPort(proxyOpts.webInterface.webPort))) {
        throw new Error(
          `${LANG.SERVER.PORT_OCCUPIED}: ${chalk.yellow(`${proxyOpts.webInterface.webPort}`)}`
        )
      }
    }

    return await new Promise((resolve) => {
      const server = new AnyProxy.ProxyServer(proxyOpts)

      const uiAddress = `http://${extOs.LOCAL_IP}:${proxyOpts.webInterface?.webPort}/`
      const port = config.port

      server.on('ready', () => {
        log('msg', 'success', [`${LANG.INFO.PROXY_UI_ADDRESS}: ${chalk.yellow.bold(uiAddress)}`])
        log('msg', 'success', [`${LANG.INFO.PROXY_PORT}: ${chalk.yellow.bold(`${port}`)}`])
        Object.keys(config.localRemote).forEach((key) => {
          log('msg', 'success', [
            `${LANG.INFO.PROXY_MAP}: ${chalk.cyan(key)} => ${chalk.yellow.bold(
              config.localRemote[key]
            )}`
          ])
        })
        log('msg', 'success', [LANG.PROXY.START_FINISHED])
        resolve(config)
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
      self.server = undefined
    }
    await util.waitFor(2000)
  }
}
