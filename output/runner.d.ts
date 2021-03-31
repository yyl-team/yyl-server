import { Env, YylConfig } from 'yyl-config-types';
import { YServer, YServerSetting } from './server';
import { YProxy, StaticFnOption } from './proxy';
import { Logger } from 'yyl-seed-base';
export interface RunnerOption {
    yylConfig?: YylConfig;
    env?: Env;
    logger?: Logger;
    cwd?: string;
    serverOption?: YServerSetting;
    ignoreServer?: boolean;
}
export declare class Runner {
    static clean(op?: StaticFnOption): Promise<void>;
    option: Required<RunnerOption>;
    /** 本地服务 entance */
    server?: YServer;
    /** 反向代理 entance */
    proxy?: YProxy;
    /** 主页 */
    homePage: string;
    constructor(op: RunnerOption);
    start(): Promise<void>;
    abort(): Promise<void>;
    livereload(): Promise<void>;
}
