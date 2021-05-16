import { ProxyServer } from 'anyproxy';
import { ProxyConfig, Env, Logger } from 'yyl-config-types';
export interface LocalRemote {
    [remoteUrl: string]: string;
}
export interface YProxyOption {
    env?: Env;
    config?: ProxyConfig;
    logger?: Logger;
}
export declare type YProxyProperty = Required<YProxyOption>;
export interface MatchItem {
    prefix: string;
    result: string;
}
export interface StaticFnOption {
    logger?: Logger;
}
export declare class YProxy {
    /** 清理缓存 */
    static clean(op?: StaticFnOption): Promise<void>;
    /** 清理证书 */
    static certClean(op?: StaticFnOption): Promise<void>;
    config: Required<ProxyConfig>;
    server?: ProxyServer;
    /** 日志输出 */
    log: Logger;
    constructor(op: YProxyOption);
    start(): Promise<unknown>;
    abort(): Promise<void>;
}
