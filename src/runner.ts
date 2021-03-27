import { URL } from 'url'
import extOs from 'yyl-os'
import { CommitConfig, Env, YylConfig } from 'yyl-config-types'

import { LANG, Logger } from './const'
import { YServer, YServerSetting } from './server'
import { YProxy, StaticFnOption, LocalRemote } from './proxy'

export interface RunnerOption {
  yylConfig?: YylConfig
  env: Env
  logger: Logger
  cwd: string
  serverOption: YServerSetting
  ignoreServer: boolean
}

export class Runner {
  static async clean(op: StaticFnOption) {
    await YProxy.clean(op)
    await YProxy.certClean(op)
  }

  option: Required<RunnerOption> = {
    yylConfig: {},
    env: {},
    logger: () => undefined,
    cwd: process.cwd(),
    serverOption: {
      appWillMount: () => Promise.resolve(undefined),
      appDidMount: () => Promise.resolve(undefined)
    },
    ignoreServer: false
  }

  /** 本地服务 entance */
  server?: YServer
  /** 反向代理 entance */
  proxy?: YProxy
  /** 主页 */
  homePage: string = ''

  constructor(op: RunnerOption) {
    const { yylConfig, env, logger, cwd, serverOption, ignoreServer } = op

    // 赋值
    if (yylConfig) {
      this.option.yylConfig = {
        ...this.option.yylConfig,
        ...yylConfig
      }
    }

    if (env) {
      this.option.env = {
        ...this.option.env,
        ...env
      }
    }

    if (logger) {
      this.option.logger = logger
    }

    if (cwd) {
      this.option.cwd = cwd
    }

    if (serverOption) {
      this.option.serverOption = {
        ...this.option.serverOption,
        ...serverOption
      }
    }

    if (ignoreServer !== undefined) {
      this.option.ignoreServer = ignoreServer
    }

    const { localserver, proxy, commit } = this.option.yylConfig

    let oriServerPort = 0

    // 本地服务 初始化
    if (localserver && !this.option.ignoreServer) {
      if (this.option.env.port) {
        if (localserver.port) {
          oriServerPort = localserver.port
        }
        localserver.port = this.option.env.port
      }
      this.server = new YServer({
        cwd: this.option.cwd,
        logger: this.option.logger,
        config: localserver,
        env: this.option.env,
        option: this.option.serverOption
      })
      const { serverAddress } = this.server.config
    }

    if (proxy && this.option.env.proxy) {
      const serverPort = localserver?.port || 5000
      proxy.localRemote = {
        ...proxy.localRemote
      }

      const formatLocalServer = (str: string) => {
        if (typeof str === 'string') {
          return str
            .replace(`127.0.0.1:${oriServerPort}`, `${extOs.LOCAL_IP}:${serverPort}`)
            .replace(`localhost:${oriServerPort}`, `${extOs.LOCAL_IP}:${serverPort}`)
            .replace('127.0.0.1:', `${extOs.LOCAL_IP}:`)
            .replace('localhost:', `${extOs.LOCAL_IP}:`)
        } else {
          return str
        }
      }

      Object.keys(proxy.localRemote).forEach((key: keyof LocalRemote) => {
        if (proxy.localRemote) {
          proxy.localRemote[key] = formatLocalServer(proxy.localRemote[key])
        }
      })

      // commit.hostname 映射
      if (commit && localserver && localserver.port) {
        ;['hostname', 'staticHost', 'mainHost'].forEach((key) => {
          const iKey = key as keyof Pick<CommitConfig, 'hostname' | 'mainHost' | 'staticHost'>
          if (!commit[iKey] || commit[iKey] === '/') {
            return
          }
          if (commit[iKey]) {
            const localHostname = `${commit[iKey]}`.replace(/[\\/]$/, '').replace(/^https?:/, '')

            const urlObj = new URL(`http:${localHostname}`)
            if (proxy.localRemote) {
              proxy.localRemote[
                `http://${urlObj.hostname}${urlObj.pathname}`
              ] = `http://${extOs.LOCAL_IP}:${localserver.port}${urlObj.pathname}`
            }
          }
        })
      }

      this.proxy = new YProxy({
        config: proxy,
        logger: this.option.logger,
        env: this.option.env
      })

      const { homePage } = this.proxy.config
      if (homePage) {
        this.homePage = homePage
      }
    }
  }

  async start() {
    const { server, proxy } = this
    if (server) {
      await server.start()
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
