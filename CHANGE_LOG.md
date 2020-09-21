# 版本变更
## 0.3.14 (2020-09-22)
* fix: 兼容 localserver 为空情况
## 0.3.13 (2020-08-31)
* fix: 兼容 `yyl server` 读取 `config.localserver.entry` 时, `options.appWillMount` 不会执行问题
## 0.3.12 (2020-08-28)
* fix: 修复 `yyl server` 读取 `config.localserver.entry` 时 出错时 错误信息显示不全问题

## 0.3.11 (2020-08-26)
* fix: 修复 `yyl server --port false` 时 会出现 proxy map port undefined 问题
## 0.3.10 (2020-07-08)
* feat: 更新 `anyrpoxy@4.1.13`
* feat: 更新 `node-easy-cert@1.3.2`

## 0.3.9 (2020-05-25)
* feat: upgrade `node-easy-cert@1.3.3`
* feat: 补充 `server clear` 新增 `cert` clean
* fix: 修复 anyproxy 在新版 osx 下 https 代理不了问题

## 0.3.8 (2020-04-16)
* fix: 修复 env.port 在 dev-server 启动时不生效的bug

## 0.3.7 (2020-04-16)
* feat: 调整开发配置
* feat: 当配置 env.port 时， 自动替换 proxy 中的默认 5000 端口
* fix: 修复 env.proxy === false 时 依然会启动 proxy

## 0.3.6 (2020-03-15)
* del: 去掉没用的参数

## 0.3.5 (2020-03-01)
* feat: 更新依赖

## 0.3.4 (2020-02-29)
* fix: 修复 配置 `ignoreServer` 后 连 proxy 都不会执行的问题

## 0.3.3 (2020-02-27)
* feat: 新增 `ignoreServer` 参数

## 0.3.2 (2020-02-26)
* feat: 新增 `Server(option)` 参数
* del: 去掉 `config.onWillInitMiddleWare` 方法

## 0.3.0 (2020-02-26)
* feat: 新增 `config.onWillInitMiddleWare` 接口
* feat: 调整 types 

## 0.2.0 (2019-09-12)
* feat: 新增 `config.server.entry` 参数，允许跳过 yyl-server 自带服务，直接用项目内自带的 server

## 0.1.8 (2019-08-07)
* fix: `proxy` `webPort` 从固定 `5001` 改为 跟随 `config.port` => `${config.port - 1}`

## 0.1.7 (2019-08-07)
* feat: `proxy` `webPort` 从固定 `5001` 改为 跟随 `config.port` => `${config.port}1`

## 0.1.6 (2019-07-28)
* fix: 修复 new Server({cwd}) 传入 相对路径时 会出现报错的问题

## 0.1.5 (2019-07-11)
* feat: 调整 proxy localRemote 匹配优先级

## 0.1.4 (2019-07-11)
* fix: `new Proxy().start` bugfix
* feat: 补充 test

## 0.1.3 (2019-07-10)
* [ADD] 新增 `Runner.clean()` 方法
* [ADD] 新增 `Proxy.clean()` 方法

## 0.1.2 (2019-07-10)
* [ADD] 新增 `Runner` 类

## 0.1.1 (2019-07-08)
* [ADD] 添加 `.npmignore`
## 0.1.0 (2019-07-08)
* [ADD] 诞生
