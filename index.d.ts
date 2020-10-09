/// <reference types="@types/connect" />
import { LocalserverConfig, ProxyConfig } from 'yyl-config-types'

import createServer = require("connect");

type Log = (type: string, args: any[]) => any;
type AnyObj = { [key:string]: any};
type App = createServer.Server

interface Commit {
  hostname?: string;
  /** 静态资源域名，若没有则会取 hostname */
  staticHost?: string;
  /** html域名，若没有则会取 hostname */
  mainHost?: string;
}


interface ServerOption {
  /** connect 对象绑定 第三方 */
  appWillMount?: (app: App) => Promise<any>
  appDidMount?: (app: App) => Promise<any>
}

/** server 相关 */
declare class Server {
  constructor({ log: Tlog, env: anyObj, config: LocalserverConfig, cwd: string, option: ServerOption })
  /** 启动 */
  start(): Promise<any>;
  /** 停止 - 一般用于 unit-test */
  abort(): Promise<any>;
  /** 主动热更新 */
  livereload(): Promise<any>;
  /** 初始化后的配置 */
  config: LocalserverConfig;
  /** express or connect 对象 */
  app: App;
  /** server 对象 */
  server: any;
  /** 热更新服务对象 */
  lrServer: any;
  option: ServerOption;
  /** connect 对象绑定 第三方 */
  appWillMount?: (app: App) => Promise<any>;
  /** connect 对象绑定 第三方 */
  appDidMount?: (app: App) => Promise<any>;
}

/** 代理相关 */
declare class Proxy {
  constructor({ log: Tlog, env: AnyObj, config: ProxyConfig})
  /** 清除 本地缓存 */
  static clean(): Promise<any>;
  /** 启动 */
  start(): Promise<any>;
  /** 停止 */
  abort(): Promise<any>;
}

/** 执行者 包含 server & proxy */
declare class Runner {
  /** 清除 本地缓存 */
  static clean(): Promise<any>;
  constructor({ log: Log, env: AnyObj, config: YylConfig, cwd: string, serverOption: ServerOption })
  /** 启动 */
  start(): Promise<any>;
  /** 停止 */
  abort(): Promise<any>;
  /** 触发热更新 */
  livereload(): Promise<any>;
}

export {
  Server,
  Proxy,
  Runner
}