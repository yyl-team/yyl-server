/// <reference types="node" />
import { Env, LocalserverConfig } from 'yyl-config-types';
import http from 'http';
import { Express } from 'express';
import { Logger } from 'yyl-seed-base';
export interface YServerSetting {
    appWillMount?: (app: Express) => Promise<any>;
    appDidMount?: (app: Express) => Promise<any>;
}
export interface YServerOption {
    cwd?: string;
    logger?: Logger;
    env?: Env;
    config?: LocalserverConfig;
    option?: YServerSetting;
}
export declare class YServer {
    app?: Express;
    server?: http.Server;
    lrServer?: any;
    /** 日志输出 */
    log: Logger;
    env: Env;
    cwd: string;
    /** 配置 */
    config: Required<LocalserverConfig>;
    /** option */
    option: Required<YServerSetting>;
    constructor(op: YServerOption);
    start(): Promise<void>;
    abort(): Promise<void>;
    livereload(): Promise<void>;
}
