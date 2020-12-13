const LANG = {
  RUNNER: {
    CONFIG_NOT_SET: '缺少配置参数 { config }'
  },
  SERVER: {
    START_BEGIN: '启动 本地服务',
    START_FINISHED: '启动 本地服务 完成',
    START_ERROR: '启动 本地服务失败',

    ABORT_BEGIN: '终止 本地服务 开始',
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
}

module.exports = LANG
