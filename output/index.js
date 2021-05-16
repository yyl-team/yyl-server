/*!
 * yyl-server cjs 1.0.6
 * (c) 2020 - 2021 
 * Released under the MIT License.
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var url = require('url');
var extOs = require('yyl-os');
var path = require('path');
var chalk = require('chalk');
var serveIndex = require('serve-index');
var serveFavicon = require('serve-favicon');
var serveStatic = require('serve-static');
var livereload = require('connect-livereload');
var rp = require('request-promise');
var fs = require('fs');
var http = require('http');
var express = require('express');
var util = require('yyl-util');
var extFs = require('yyl-fs');
var AnyProxy = require('anyproxy');
var request = require('request');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var extOs__default = /*#__PURE__*/_interopDefaultLegacy(extOs);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);
var serveIndex__default = /*#__PURE__*/_interopDefaultLegacy(serveIndex);
var serveFavicon__default = /*#__PURE__*/_interopDefaultLegacy(serveFavicon);
var serveStatic__default = /*#__PURE__*/_interopDefaultLegacy(serveStatic);
var livereload__default = /*#__PURE__*/_interopDefaultLegacy(livereload);
var rp__default = /*#__PURE__*/_interopDefaultLegacy(rp);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var http__default = /*#__PURE__*/_interopDefaultLegacy(http);
var express__default = /*#__PURE__*/_interopDefaultLegacy(express);
var util__default = /*#__PURE__*/_interopDefaultLegacy(util);
var extFs__default = /*#__PURE__*/_interopDefaultLegacy(extFs);
var AnyProxy__default = /*#__PURE__*/_interopDefaultLegacy(AnyProxy);
var request__default = /*#__PURE__*/_interopDefaultLegacy(request);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const LANG = {
    RUNNER: {
        CONFIG_NOT_SET: '缺少配置参数 { config }'
    },
    SERVER: {
        START_BEGIN: '启动 本地服务',
        START_FINISHED: '启动 本地服务 完成',
        START_ERROR: '启动 本地服务失败',
        ABORT_BEGIN: '终止 本地服务 开始',
        ABORT_FAIL: '终止 本地服务 失败',
        ABORT_FINISHED: '终止 本地服务 完成',
        PORT_OCCUPIED: '端口 已被占用',
        ENTRY_NOT_EXISTS: '项目服务入口 (config.entry) 路径不存在',
        USE_PROJECT_SERVER: '使用 项目本地服务',
        USE_BASE_SERVER: '使用 自带本地服务',
        NOT_EXPORT_APP: '本地项目入口 (config.entry) 没有 返回 服务句柄',
        USE_MORK: '使用 mock',
        REQUEST_LIVERELOAD_START: '请求 页面刷新 开始',
        REQUEST_LIVERELOAD_FINISHED: '请求 页面刷新 完成',
        REQUEST_LIVERELOAD_FAIL: '请求 页面刷新 失败'
    },
    PROXY: {
        CLEAN_CACHE_START: '开始 清除 本地代理缓存',
        CLEAN_CACHE_FINISHED: '清除 本地代理缓存 完成',
        CLEAN_CACHE_FINISHED_EMPTY: '清除 本地代理缓存完成，缓存目录不存在',
        CLEAN_CERT_START: '开始 重置 anyproxy 证书',
        CLEAN_CERT_FINISHED: '重置 anyproxy 证书 完成',
        CERT_REINSTALL: '请重新安装证书',
        REQUEST_ERROR: '请求发生错误',
        START_BEGIN: '启动 anyproxy',
        START_FINISHED: '启动 anyproxy 完成',
        USE_HTTPS: '使用 https',
        GENERATE_ROOT_CA_FINISHED: '本地证书创建 完成',
        CA_PATH: 'CA证书 目录',
        GENERATE_ROOT_CA_ERROR: '本地证书创建发生 错误'
    },
    INFO: {
        SERVER_PATH: 'server path      ',
        SERVER_ADDRESS: 'server address   ',
        SERVER_LR_PORT: 'server lr port   ',
        PROXY_UI_ADDRESS: 'proxy ui address ',
        PROXY_PORT: 'proxy server port',
        PROXY_MAP: 'proxy map        '
    }
};
const USERPROFILE = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'] || '';
const PROXY_CACHE_PATH = util__default['default'].path.join(USERPROFILE, '.anyproxy/cache');
const PROXY_CRET_PATH = util__default['default'].path.join(USERPROFILE, '.anyproxy/certificates');

/** 默认端口 */
const DEFAULT_PORT = 5000;
class YServer {
    constructor(op) {
        /** 日志输出 */
        this.log = (type, args1, args2) => {
            console.log(type, args1, args2);
        };
        this.env = {};
        this.cwd = process.cwd();
        /** 配置 */
        this.config = {
            root: process.cwd(),
            port: DEFAULT_PORT,
            lrPort: +`${DEFAULT_PORT}1`,
            livereload: false,
            serverAddress: `http://${extOs__default['default'].LOCAL_IP}:${DEFAULT_PORT}`,
            mockRoot: path__default['default'].resolve(process.cwd(), 'mock'),
            entry: '',
            proxies: []
        };
        /** option */
        this.option = {
            appWillMount: () => Promise.resolve(undefined),
            appDidMount: () => Promise.resolve(undefined)
        };
        const { config, env, cwd, option, logger } = op;
        if (logger) {
            this.log = logger;
        }
        if (config) {
            this.config = Object.assign(this.config, config);
        }
        if (env) {
            this.env = env;
        }
        if (cwd) {
            this.cwd = cwd;
        }
        if (config === null || config === void 0 ? void 0 : config.root) {
            this.config.root = path__default['default'].resolve(this.cwd, config.root);
            this.config.mockRoot = path__default['default'].resolve(this.cwd, 'mock');
        }
        if (config === null || config === void 0 ? void 0 : config.mockRoot) {
            this.config.mockRoot = path__default['default'].resolve(this.cwd, config.mockRoot);
        }
        if (config === null || config === void 0 ? void 0 : config.entry) {
            if (typeof (config === null || config === void 0 ? void 0 : config.entry) === 'string') {
                this.config.entry = path__default['default'].resolve(this.cwd, config.entry);
            }
            else {
                this.config.entry = config.entry;
            }
        }
        if (env === null || env === void 0 ? void 0 : env.port) {
            this.config.port = env.port;
            this.config.lrPort = +`${env.port}1`;
            this.config.serverAddress = `http://${extOs__default['default'].LOCAL_IP}:${env.port}`;
        }
        if (env === null || env === void 0 ? void 0 : env.path) {
            this.config.root = path__default['default'].resolve(this.config.root, env.path);
        }
        if (option) {
            this.option = Object.assign(this.option, option);
        }
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const { config, log, option, env } = this;
            log('msg', 'info', [LANG.SERVER.START_BEGIN]);
            if (!(yield extOs__default['default'].checkPort(config.port))) {
                throw new Error(`${LANG.SERVER.PORT_OCCUPIED}: ${chalk__default['default'].yellow(`${config.port}`)}`);
            }
            let app = express__default['default']();
            if (config.entry) {
                if (typeof config.entry === 'string') {
                    // entry 是路径的情况
                    const entryPath = path__default['default'].resolve(config.root, config.entry);
                    if (fs__default['default'].existsSync(entryPath)) {
                        try {
                            app = require(entryPath);
                        }
                        catch (er) {
                            log('msg', 'error', [`${LANG.SERVER.START_ERROR}: ${chalk__default['default'].yellow(config.entry)}`, er]);
                            throw er;
                        }
                        log('msg', 'info', [`${LANG.SERVER.USE_PROJECT_SERVER}: ${chalk__default['default'].yellow(config.entry)}`]);
                        // 兼容 this.server
                    }
                    else {
                        log('msg', 'error', [`${LANG.SERVER.ENTRY_NOT_EXISTS}: ${config.entry}`]);
                    }
                }
                else {
                    // entry 是函数的情况
                    try {
                        app = config.entry({ env });
                    }
                    catch (er) {
                        log('msg', 'error', [`${LANG.SERVER.START_ERROR}`, er]);
                        throw er;
                    }
                    log('msg', 'info', [`${LANG.SERVER.USE_PROJECT_SERVER}`]);
                }
                if (!app || typeof app.use !== 'function') {
                    log('msg', 'warn', [`${LANG.SERVER.NOT_EXPORT_APP}`]);
                    log('msg', 'success', [LANG.SERVER.START_FINISHED]);
                    return;
                }
                if (option && option.appWillMount) {
                    yield option.appWillMount(app);
                }
            }
            else {
                log('msg', 'info', [LANG.SERVER.USE_BASE_SERVER]);
                if (option && option.appWillMount) {
                    yield option.appWillMount(app);
                }
                // 执行 post 请求本地服务器时处理
                app.use((req, res, next) => {
                    if (req.method === 'POST') {
                        const filePath = path__default['default'].join(config.root, new url.URL(req.url).pathname);
                        if (fs__default['default'].existsSync(filePath)) {
                            res.write(fs__default['default'].readFileSync(filePath));
                        }
                        else {
                            res.statusCode = 404;
                        }
                        res.end();
                    }
                    else {
                        next();
                    }
                });
                // ico
                app.use(serveFavicon__default['default'](path__default['default'].join(__dirname, '../assets/favicon.ico')));
                // header
                app.use(serveStatic__default['default'](config.root, {
                    setHeaders: function (res, iPath) {
                        if (path__default['default'].extname(iPath) === '.tpl') {
                            res.setHeader('Content-Type', 'text/html; charset=UTF-8');
                        }
                        res.setHeader('Cache-Control', 'no-cache');
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.setHeader('Expires', 0);
                        res.setHeader('Pragma', 'no-cache');
                    }
                }));
                app.use(serveIndex__default['default'](config.root));
                const server = http__default['default'].createServer(app);
                server.on('error', (err) => {
                    log('msg', 'error', [err]);
                    throw err;
                });
                yield new Promise((resolve, reject) => {
                    server.on('error', (er) => {
                        reject(er);
                    });
                    server.listen(config.port, () => {
                        resolve(config);
                    });
                });
                this.server = server;
                log('msg', 'success', [`${LANG.INFO.SERVER_PATH}: ${chalk__default['default'].yellow.bold(config.root)}`]);
                log('msg', 'success', [
                    `${LANG.INFO.SERVER_ADDRESS}: ${chalk__default['default'].yellow.bold(config.serverAddress)}`
                ]);
            }
            // livereload
            if (config.livereload) {
                if (!(yield extOs__default['default'].checkPort(config.lrPort))) {
                    throw new Error(`${LANG.SERVER.PORT_OCCUPIED}: ${chalk__default['default'].yellow(`${config.lrPort}`)}`);
                }
                app.use(livereload__default['default']({
                    port: config.lrPort,
                    src: `//${extOs__default['default'].LOCAL_IP}:${config.lrPort}/livereload.js?snipver=1`
                }));
                log('msg', 'success', [
                    `${LANG.INFO.SERVER_LR_PORT}: ${chalk__default['default'].yellow.bold(`${config.lrPort}`)}`
                ]);
            }
            if (option && option.appDidMount) {
                yield option.appDidMount(app);
            }
            this.app = app;
            log('msg', 'info', [LANG.SERVER.START_FINISHED]);
        });
    }
    abort() {
        return __awaiter(this, void 0, void 0, function* () {
            const { log, server } = this;
            if (server) {
                log('msg', 'info', [LANG.SERVER.ABORT_BEGIN]);
                yield new Promise((resolve, reject) => {
                    server === null || server === void 0 ? void 0 : server.close((err) => {
                        if (err) {
                            log('msg', 'warn', [LANG.SERVER.ABORT_FAIL, (err === null || err === void 0 ? void 0 : err.message) || err]);
                        }
                        else {
                            log('msg', 'info', [LANG.SERVER.ABORT_FINISHED]);
                        }
                        resolve(undefined);
                    });
                });
            }
        });
    }
    livereload() {
        return __awaiter(this, void 0, void 0, function* () {
            const { config, log } = this;
            const { lrPort, livereload } = config;
            if (livereload) {
                log('msg', 'info', [LANG.SERVER.REQUEST_LIVERELOAD_START]);
                const reloadPath = `http://${extOs__default['default'].LOCAL_IP}:${lrPort}/changed?files=1`;
                try {
                    yield rp__default['default'](reloadPath);
                    log('msg', 'info', [LANG.SERVER.REQUEST_LIVERELOAD_FINISHED]);
                }
                catch (er) {
                    log('msg', 'warn', [`${LANG.SERVER.REQUEST_LIVERELOAD_FAIL}: ${er.message}`]);
                }
            }
        });
    }
}

const hideProtocol = function (str) {
    if (typeof str === 'string') {
        return str.replace(/^http[s]?:/, '');
    }
    else {
        return str;
    }
};
class YProxy {
    constructor(op) {
        this.config = {
            port: 8887,
            webPort: 8886,
            localRemote: {},
            https: false,
            homePage: '',
            ignores: []
        };
        /** 日志输出 */
        this.log = (type, args1, args2) => {
            console.log(type, args1, args2);
        };
        const { env, config, logger } = op;
        if (config) {
            this.config = Object.assign(this.config, config);
        }
        if ((env === null || env === void 0 ? void 0 : env.proxy) && (env === null || env === void 0 ? void 0 : env.proxy) !== true) {
            this.config.port = env === null || env === void 0 ? void 0 : env.proxy;
            this.config.webPort = (env === null || env === void 0 ? void 0 : env.proxy) - 1;
        }
        if (env === null || env === void 0 ? void 0 : env.https) {
            this.config.https = true;
        }
        //  http map 转成 https
        if (this.config.https) {
            const { localRemote } = this.config;
            const iLocalRemote = {};
            Object.keys(localRemote).forEach((key) => {
                const iKey = hideProtocol(key);
                iLocalRemote[`http:${iKey}`] = localRemote[key];
                iLocalRemote[`https:${iKey}`] = localRemote[key];
            });
            this.config.localRemote = iLocalRemote;
        }
        if (logger) {
            this.log = logger;
        }
    }
    /** 清理缓存 */
    static clean(op) {
        return __awaiter(this, void 0, void 0, function* () {
            const iLog = (op === null || op === void 0 ? void 0 : op.logger) || (() => undefined);
            if (fs__default['default'].existsSync(PROXY_CACHE_PATH)) {
                iLog('msg', 'info', [`${LANG.PROXY.CLEAN_CACHE_START}: ${chalk__default['default'].yellow(PROXY_CACHE_PATH)}`]);
                const files = yield extFs__default['default'].removeFiles(PROXY_CACHE_PATH);
                iLog('msg', 'success', [
                    `${LANG.PROXY.CLEAN_CACHE_FINISHED}, total ${chalk__default['default'].yellow(`${files.length}`)} files`
                ]);
            }
            else {
                iLog('msg', 'success', [LANG.PROXY.CLEAN_CACHE_FINISHED_EMPTY]);
            }
        });
    }
    /** 清理证书 */
    static certClean(op) {
        return __awaiter(this, void 0, void 0, function* () {
            const iLog = (op === null || op === void 0 ? void 0 : op.logger) || (() => undefined);
            if (fs__default['default'].existsSync(PROXY_CRET_PATH)) {
                iLog('msg', 'info', [`${LANG.PROXY.CLEAN_CERT_START}: ${chalk__default['default'].yellow(PROXY_CRET_PATH)}`]);
                const files = yield extFs__default['default'].removeFiles(PROXY_CRET_PATH);
                iLog('msg', 'success', [
                    `${LANG.PROXY.CLEAN_CERT_FINISHED}, total ${chalk__default['default'].yellow(`${files.length}`)} files`
                ]);
                iLog('msg', 'success', [LANG.PROXY.CERT_REINSTALL]);
            }
            else {
                iLog('msg', 'success', [LANG.PROXY.CLEAN_CERT_FINISHED]);
            }
        });
    }
    start() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { log, config } = this;
            const self = this;
            log('msg', 'info', [LANG.PROXY.START_BEGIN]);
            if (!(yield extOs__default['default'].checkPort(config.port))) {
                throw new Error(`${LANG.SERVER.PORT_OCCUPIED}: ${chalk__default['default'].yellow(`${config.port}`)}`);
            }
            yield YProxy.clean({ logger: log });
            if (config.https) {
                log('msg', 'success', [LANG.PROXY.USE_HTTPS]);
                if (!AnyProxy__default['default'].utils.certMgr.ifRootCAFileExists()) {
                    yield util__default['default'].makeAwait((next) => {
                        AnyProxy__default['default'].utils.certMgr.generateRootCA((error, keyPath) => {
                            log('msg', 'info', [LANG.PROXY.GENERATE_ROOT_CA_FINISHED]);
                            // let users to trust this CA before using proxy
                            if (!error) {
                                const certDir = path__default['default'].dirname(keyPath);
                                log('msg', 'success', [
                                    LANG.PROXY.GENERATE_ROOT_CA_FINISHED,
                                    chalk__default['default'].yellow.bold(certDir)
                                ]);
                                extOs__default['default'].openPath(certDir);
                            }
                            else {
                                log('msg', 'error', [LANG.PROXY.GENERATE_ROOT_CA_ERROR, error]);
                            }
                            next();
                        });
                    });
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
                    beforeSendRequest(req) {
                        return __awaiter(this, void 0, void 0, function* () {
                            const { localRemote, ignores } = config;
                            if (typeof localRemote !== 'object') {
                                return;
                            }
                            const iUrl = hideProtocol(req.url);
                            let isIgnore = false;
                            if (ignores && ignores.length) {
                                ignores.forEach((key) => {
                                    const v1 = hideProtocol(key);
                                    if (iUrl === v1) {
                                        isIgnore = true;
                                    }
                                });
                            }
                            if (isIgnore) {
                                return null;
                            }
                            const matches = [];
                            let proxyUrl = '';
                            Object.keys(localRemote).forEach((key) => {
                                const v1 = hideProtocol(key);
                                if (iUrl.substr(0, v1.length) === v1) {
                                    matches.push({
                                        prefix: v1,
                                        result: util__default['default'].path.join(localRemote[key], iUrl.substr(v1.length))
                                    });
                                }
                            });
                            if (matches.length) {
                                matches.sort((a, b) => {
                                    return b.prefix.length - a.prefix.length;
                                });
                                proxyUrl = matches[0].result;
                            }
                            if (proxyUrl) {
                                return yield new Promise((resolve) => {
                                    const vOpts = new url.URL(proxyUrl);
                                    vOpts.method = req.requestOptions.method;
                                    vOpts.headers = req.requestOptions.headers;
                                    if (vOpts.methd !== 'GET') {
                                        vOpts.body = req.requestData;
                                    }
                                    const vParam = {
                                        uri: proxyUrl,
                                        method: req.requestOptions.method,
                                        headers: req.requestOptions.headers,
                                        body: undefined
                                    };
                                    if (vParam.method !== 'GET') {
                                        vParam.body = req.requestData.toString();
                                    }
                                    request__default['default']({
                                        uri: proxyUrl,
                                        method: req.requestOptions.method,
                                        headers: req.requestOptions.headers,
                                        encoding: null
                                    }, (err, vRes) => {
                                        if (err) {
                                            log('msg', 'warn', [`${proxyUrl} - ${LANG.PROXY.REQUEST_ERROR}:`, err]);
                                            resolve(null);
                                        }
                                        else if (/^404|405$/.test(`${vRes.statusCode}`)) {
                                            resolve(null);
                                        }
                                        else {
                                            resolve({
                                                response: {
                                                    statusCode: vRes.statusCode,
                                                    header: vRes.headers,
                                                    body: vRes.body
                                                }
                                            });
                                        }
                                    });
                                });
                            }
                            else {
                                return null;
                            }
                        });
                    },
                    beforeSendResponse(req, res) {
                        if (path__default['default'].extname(req.url) === '.tpl') {
                            const newRes = res.response;
                            newRes.header['Content-Type'] = 'text/html; charset=UTF-8';
                            newRes.header['Access-Control-Allow-Origin'] = '*';
                            newRes.header['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS';
                            newRes.header['Access-Control-Allow-Headers'] = 'X-PINGOTHER, Content-Type';
                            return Promise.resolve({
                                response: newRes
                            });
                        }
                        else {
                            return Promise.resolve(null);
                        }
                    }
                },
                throttle: 10000,
                forceProxyHttps: !!config.https,
                wsIntercept: true,
                silent: true
            };
            if ((_a = proxyOpts.webInterface) === null || _a === void 0 ? void 0 : _a.webPort) {
                if (!(yield extOs__default['default'].checkPort(proxyOpts.webInterface.webPort))) {
                    throw new Error(`${LANG.SERVER.PORT_OCCUPIED}: ${chalk__default['default'].yellow(`${proxyOpts.webInterface.webPort}`)}`);
                }
            }
            return yield new Promise((resolve) => {
                var _a;
                const server = new AnyProxy__default['default'].ProxyServer(proxyOpts);
                const uiAddress = `http://${extOs__default['default'].LOCAL_IP}:${(_a = proxyOpts.webInterface) === null || _a === void 0 ? void 0 : _a.webPort}/`;
                const port = config.port;
                server.on('ready', () => {
                    log('msg', 'success', [`${LANG.INFO.PROXY_UI_ADDRESS}: ${chalk__default['default'].yellow.bold(uiAddress)}`]);
                    log('msg', 'success', [`${LANG.INFO.PROXY_PORT}: ${chalk__default['default'].yellow.bold(`${port}`)}`]);
                    Object.keys(config.localRemote).forEach((key) => {
                        log('msg', 'success', [
                            `${LANG.INFO.PROXY_MAP}: ${chalk__default['default'].cyan(key)} => ${chalk__default['default'].yellow.bold(config.localRemote[key])}`
                        ]);
                    });
                    log('msg', 'success', [LANG.PROXY.START_FINISHED]);
                    resolve(config);
                });
                server.on('error', (e) => {
                    throw e;
                });
                server.start();
                self.server = server;
            });
        });
    }
    abort() {
        return __awaiter(this, void 0, void 0, function* () {
            const { server } = this;
            const self = this;
            if (server) {
                server.close();
                self.server = undefined;
            }
            yield util__default['default'].waitFor(2000);
        });
    }
}

class Runner {
    constructor(op) {
        this.option = {
            yylConfig: {},
            env: {},
            logger: () => undefined,
            cwd: process.cwd(),
            serverOption: {
                appWillMount: () => Promise.resolve(undefined),
                appDidMount: () => Promise.resolve(undefined)
            },
            ignoreServer: false
        };
        /** 主页 */
        this.homePage = '';
        const { yylConfig, env, logger, cwd, serverOption, ignoreServer } = op;
        // 赋值
        if (yylConfig) {
            this.option.yylConfig = Object.assign(Object.assign({}, this.option.yylConfig), yylConfig);
        }
        if (env) {
            this.option.env = Object.assign(Object.assign({}, this.option.env), env);
        }
        if (logger) {
            this.option.logger = logger;
        }
        if (cwd) {
            this.option.cwd = cwd;
        }
        if (serverOption) {
            this.option.serverOption = Object.assign(Object.assign({}, this.option.serverOption), serverOption);
        }
        if (ignoreServer !== undefined) {
            this.option.ignoreServer = ignoreServer;
        }
        const { localserver, proxy, commit } = this.option.yylConfig;
        let oriServerPort = 0;
        // 本地服务 初始化
        if (localserver && (!this.option.ignoreServer || !!localserver.entry)) {
            if (this.option.env.port) {
                if (localserver.port) {
                    oriServerPort = localserver.port;
                }
                localserver.port = this.option.env.port;
            }
            this.server = new YServer({
                cwd: this.option.cwd,
                logger: this.option.logger,
                config: localserver,
                env: this.option.env,
                option: this.option.serverOption
            });
            const { serverAddress } = this.server.config;
            this.homePage = serverAddress;
            this.option.yylConfig.localserver = Object.assign({}, this.server.config);
        }
        if (proxy && this.option.env.proxy) {
            const serverPort = (localserver === null || localserver === void 0 ? void 0 : localserver.port) || 5000;
            proxy.localRemote = Object.assign({}, proxy.localRemote);
            const formatLocalServer = (str) => {
                if (typeof str === 'string') {
                    return str
                        .replace(`127.0.0.1:${oriServerPort}`, `${extOs__default['default'].LOCAL_IP}:${serverPort}`)
                        .replace(`localhost:${oriServerPort}`, `${extOs__default['default'].LOCAL_IP}:${serverPort}`)
                        .replace('127.0.0.1:', `${extOs__default['default'].LOCAL_IP}:`)
                        .replace('localhost:', `${extOs__default['default'].LOCAL_IP}:`);
                }
                else {
                    return str;
                }
            };
            Object.keys(proxy.localRemote).forEach((key) => {
                if (proxy.localRemote) {
                    proxy.localRemote[key] = formatLocalServer(proxy.localRemote[key]);
                }
            });
            // commit.hostname 映射
            if (commit && localserver && localserver.port) {
                ['hostname', 'staticHost', 'mainHost'].forEach((key) => {
                    const iKey = key;
                    if (!commit[iKey] || commit[iKey] === '/') {
                        return;
                    }
                    if (commit[iKey]) {
                        const localHostname = `${commit[iKey]}`.replace(/[\\/]$/, '').replace(/^https?:/, '');
                        const urlObj = new url.URL(`http:${localHostname}`);
                        if (proxy.localRemote) {
                            proxy.localRemote[`http://${urlObj.hostname}${urlObj.pathname}`] = `http://${extOs__default['default'].LOCAL_IP}:${localserver.port}${urlObj.pathname}`;
                        }
                    }
                });
            }
            this.proxy = new YProxy({
                config: proxy,
                logger: this.option.logger,
                env: this.option.env
            });
            const { homePage } = this.proxy.config;
            if (homePage) {
                this.homePage = homePage;
            }
            this.option.yylConfig.proxy = Object.assign({}, this.proxy.config);
        }
    }
    static clean(op) {
        return __awaiter(this, void 0, void 0, function* () {
            yield YProxy.clean(op);
            yield YProxy.certClean(op);
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const { server, proxy } = this;
            if (server) {
                yield server.start();
            }
            if (proxy) {
                yield proxy.start();
            }
        });
    }
    abort() {
        return __awaiter(this, void 0, void 0, function* () {
            const { server, proxy } = this;
            if (server) {
                yield server.abort();
            }
            if (proxy) {
                yield proxy.abort();
            }
        });
    }
    livereload() {
        return __awaiter(this, void 0, void 0, function* () {
            const { server } = this;
            if (server) {
                yield server.livereload();
            }
        });
    }
}

exports.Runner = Runner;
exports.YProxy = YProxy;
exports.YServer = YServer;
