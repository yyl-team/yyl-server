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

declare class Server {
  constructor({ log: Tlog, env: anyObj, config: IServerConfig})
  start(): Promise<any>;
  abort(): Promise<any>;
  livereload(): Promise<any>;
}

export {
  Server
}