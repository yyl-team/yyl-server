# 版本变更
## 0.1.8 (2019-08-07)
* [FIX] `proxy` `webPort` 从固定 `5001` 改为 跟随 `config.port` => `${config.port - 1}`

## 0.1.7 (2019-08-07)
* [EDIT] `proxy` `webPort` 从固定 `5001` 改为 跟随 `config.port` => `${config.port}1`

## 0.1.6 (2019-07-28)
* [FIX] 修复 new Server({cwd}) 传入 相对路径时 会出现报错的问题

## 0.1.5 (2019-07-11)
* [EDIT] 调整 proxy localRemote 匹配优先级

## 0.1.4 (2019-07-11)
* [FIX] `new Proxy().start` bugfix
* [ADD] 补充 test

## 0.1.3 (2019-07-10)
* [ADD] 新增 `Runner.clean()` 方法
* [ADD] 新增 `Proxy.clean()` 方法

## 0.1.2 (2019-07-10)
* [ADD] 新增 `Runner` 类

## 0.1.1 (2019-07-08)
* [ADD] 添加 `.npmignore`
## 0.1.0 (2019-07-08)
* [ADD] 诞生