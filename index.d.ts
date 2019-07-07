import { start } from "repl";

type Tlog = (type: string, args: any[]) => any;
type anyObj = { [key:string]: any};
type TonInitMiddleWare = (app: any, port: number) => any;

interface IServerConfig {
  port?: number;
  root?: string;
  lrPort?: number;
  livereload?: boolean;
  serverAddress?: string,
  onInitMiddleWare?: TonInitMiddleWare,
  mockRoot?: string;
}

interface IProxyConfig {
  port?: number;
  localRemote?: anyObj,
  https?: boolean,
  homePage?: string,
  ignores?: string[]
}

declare class Server {
  constructor({ log: Tlog, env: anyObj, config: IServerConfig, cwd: string})
  start(): Promise<any>;
  abort(): Promise<any>;
  livereload(): Promise<any>;
}

declare class Proxy {
  constructor({ log: Tlog, env: anyObj, config: IProxyConfig})
  start(): Promise<any>;
  abort(): Promise<any>;
  clean(): Promise<any>;
}

export {
  Server,
  Proxy
}