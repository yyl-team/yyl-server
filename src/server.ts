/* eslint-disable no-unused-expressions */
import path from 'path'
import extOs from 'yyl-os'
import chalk from 'chalk'
import serveIndex from 'serve-index'
import serveFavicon from 'serve-favicon'
import serveStatic from 'serve-static'
import livereload from 'connect-livereload'

import { Env, LocalserverConfig } from 'yyl-config-types'
import rp from 'request-promise'
import { URL } from 'url'
import fs from 'fs'
import http from 'http'
import express, { Express } from 'express'
import { LANG, Logger } from './const'

export interface YServerSetting {
  appWillMount: (app: Express) => Promise<any>
  appDidMount: (app: Express) => Promise<any>
}
export interface YServerOption {
  cwd: string
  logger: Logger
  env: Env
  config: LocalserverConfig
  option: YServerSetting
}

/** 默认端口 */
const DEFAULT_PORT = 5000
export class YServer {
  app?: Express
  server?: http.Server
  lrServer?: any

  /** 日志输出 */
  log: Logger = (type, args) => {
    console.log(type, ...args)
  }

  cwd: string = process.cwd()

  /** 配置 */
  config: Required<LocalserverConfig> = {
    root: process.cwd(),
    port: DEFAULT_PORT,
    lrPort: +`${DEFAULT_PORT}1`,
    livereload: false,
    serverAddress: `http://${extOs.LOCAL_IP}:${DEFAULT_PORT}`,
    mockRoot: path.resolve(process.cwd(), 'mock'),
    entry: ''
  }

  /** option */
  option: Required<YServerSetting> = {
    appWillMount: () => Promise.resolve(undefined),
    appDidMount: () => Promise.resolve(undefined)
  }

  constructor(op: YServerOption) {
    const { config, env, cwd, option, logger } = op
    if (logger) {
      this.log = logger
    }

    if (config) {
      this.config = Object.assign(this.config, config)
    }

    if (cwd) {
      this.cwd = cwd
    }

    if (config.root) {
      this.config.root = path.resolve(this.cwd, config.root)
      this.config.mockRoot = path.resolve(this.cwd, 'mock')
    }
    if (config.mockRoot) {
      this.config.mockRoot = path.resolve(this.cwd, config.mockRoot)
    }

    if (config.entry) {
      this.config.entry = path.resolve(this.cwd, config.entry)
    }

    if (env.port) {
      this.config.port = env.port
      this.config.lrPort = +`${env.port}1`
      this.config.serverAddress = `http://${extOs.LOCAL_IP}:${env.port}`
    }

    if (env.path) {
      this.config.root = path.resolve(this.config.root, env.path)
    }

    if (option) {
      this.option = Object.assign(this.option, option)
    }
  }

  async start() {
    const { config, log, option } = this
    log('info', [LANG.SERVER.START_BEGIN])
    if (!(await extOs.checkPort(config.port))) {
      throw new Error(`${LANG.SERVER.PORT_OCCUPIED}: ${chalk.yellow(`${config.port}`)}`)
    }

    let app: Express = express()
    if (config.entry) {
      const entryPath = path.resolve(config.root, config.entry)
      if (fs.existsSync(entryPath)) {
        try {
          app = require(entryPath)
        } catch (er) {
          log('error', [`${LANG.SERVER.START_ERROR}: ${chalk.yellow(config.entry)}`, er])
          throw er
        }
        log('info', [`${LANG.SERVER.USE_PROJECT_SERVER}: ${chalk.yellow(config.entry)}`])
        if (!app || typeof app.use !== 'function') {
          log('warn', [`${LANG.SERVER.NOT_EXPORT_APP}: ${chalk.yellow(config.entry)}`])
          log('success', [LANG.SERVER.START_FINISHED])
          return
        }
        if (option && option.appWillMount) {
          await option.appWillMount(app)
        }
        // 兼容 this.server
      } else {
        log('error', [`${LANG.SERVER.ENTRY_NOT_EXISTS}: ${config.entry}`])
      }
    } else {
      log('info', [LANG.SERVER.USE_BASE_SERVER])
      if (option && option.appWillMount) {
        await option.appWillMount(app)
      }

      // 执行 post 请求本地服务器时处理
      app.use((req, res, next) => {
        if (req.method === 'POST') {
          const filePath = path.join(config.root, new URL(req.url).pathname)
          if (fs.existsSync(filePath)) {
            res.write(fs.readFileSync(filePath))
          } else {
            res.statusCode = 404
          }
          res.end()
        } else {
          next()
        }
      })

      // ico
      app.use(serveFavicon(path.join(__dirname, '../resource/favicon.ico')))

      // header
      app.use(
        serveStatic(config.root, {
          setHeaders: function (res, iPath) {
            if (path.extname(iPath) === '.tpl') {
              res.setHeader('Content-Type', 'text/html; charset=UTF-8')
            }
            res.setHeader('Cache-Control', 'no-cache')
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.setHeader('Expires', 0)
            res.setHeader('Pragma', 'no-cache')
          }
        })
      )

      app.use(serveIndex(config.root))

      const server = http.createServer(app)

      server.on('error', (err) => {
        log('error', [err])
        throw err
      })

      await new Promise((resolve, reject) => {
        server.on('error', (er) => {
          reject(er)
        })
        server.listen(config.port, () => {
          resolve(config)
        })
      })

      this.server = server

      log('success', [`${LANG.INFO.SERVER_PATH}: ${chalk.yellow.bold(config.root)}`])
      log('success', [`${LANG.INFO.SERVER_ADDRESS}: ${chalk.yellow.bold(config.serverAddress)}`])
    }

    // livereload
    if (config.livereload) {
      if (!(await extOs.checkPort(config.lrPort))) {
        throw new Error(`${LANG.SERVER.PORT_OCCUPIED}: ${chalk.yellow(`${config.lrPort}`)}`)
      }
      app.use(
        livereload({
          port: config.lrPort,
          src: `//${extOs.LOCAL_IP}:${config.lrPort}/livereload.js?snipver=1`
        })
      )
      log('success', [`${LANG.INFO.SERVER_LR_PORT}: ${chalk.yellow.bold(`${config.lrPort}`)}`])
    }

    if (option && option.appDidMount) {
      await option.appDidMount(app)
    }

    this.app = app
    log('info', [LANG.SERVER.START_FINISHED])
  }

  async abort() {
    const { log, server } = this
    if (server) {
      log('info', [LANG.SERVER.ABORT_BEGIN])
      await new Promise((resolve, reject) => {
        server?.close((err) => {
          if (err) {
            log('warn', [LANG.SERVER.ABORT_FAIL, err?.message || err])
          } else {
            log('info', [LANG.SERVER.ABORT_FINISHED])
          }
          resolve(undefined)
        })
      })
    }
  }

  async livereload() {
    const { config, log } = this
    const { lrPort, livereload } = config
    if (livereload) {
      log('info', [LANG.SERVER.REQUEST_LIVERELOAD_START])
      const reloadPath = `http://${extOs.LOCAL_IP}:${lrPort}/changed?files=1`
      try {
        await rp(reloadPath)
        log('info', [LANG.SERVER.REQUEST_LIVERELOAD_FINISHED])
      } catch (er) {
        log('warn', [`${LANG.SERVER.REQUEST_LIVERELOAD_FAIL}: ${er.message}`])
      }
    }
  }
}
