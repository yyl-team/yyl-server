[yyl-server](../README.md) / [Exports](../modules.md) / YServer

# Class: YServer

## Table of contents

### Constructors

- [constructor](yserver.md#constructor)

### Properties

- [app](yserver.md#app)
- [config](yserver.md#config)
- [cwd](yserver.md#cwd)
- [log](yserver.md#log)
- [lrServer](yserver.md#lrserver)
- [option](yserver.md#option)
- [server](yserver.md#server)

### Methods

- [abort](yserver.md#abort)
- [livereload](yserver.md#livereload)
- [start](yserver.md#start)

## Constructors

### constructor

\+ **new YServer**(`op`: [_YServerOption_](../interfaces/yserveroption.md)): [_YServer_](yserver.md)

#### Parameters:

| Name | Type                                              |
| :--- | :------------------------------------------------ |
| `op` | [_YServerOption_](../interfaces/yserveroption.md) |

**Returns:** [_YServer_](yserver.md)

Defined in: [server.ts:60](https://github.com/jackness1208/yyl-server/blob/4a70c7c/src/server.ts#L60)

## Properties

### app

• `Optional` **app**: _Express_

Defined in: [server.ts:34](https://github.com/jackness1208/yyl-server/blob/4a70c7c/src/server.ts#L34)

---

### config

• **config**: _Required_<LocalserverConfig\>

配置

Defined in: [server.ts:46](https://github.com/jackness1208/yyl-server/blob/4a70c7c/src/server.ts#L46)

---

### cwd

• **cwd**: _string_

Defined in: [server.ts:43](https://github.com/jackness1208/yyl-server/blob/4a70c7c/src/server.ts#L43)

---

### log

• **log**: _Logger_<keyof SeedEventName\>

日志输出

Defined in: [server.ts:39](https://github.com/jackness1208/yyl-server/blob/4a70c7c/src/server.ts#L39)

---

### lrServer

• `Optional` **lrServer**: _any_

Defined in: [server.ts:36](https://github.com/jackness1208/yyl-server/blob/4a70c7c/src/server.ts#L36)

---

### option

• **option**: _Required_<[_YServerSetting_](../interfaces/yserversetting.md)\>

option

Defined in: [server.ts:57](https://github.com/jackness1208/yyl-server/blob/4a70c7c/src/server.ts#L57)

---

### server

• `Optional` **server**: _Server_

Defined in: [server.ts:35](https://github.com/jackness1208/yyl-server/blob/4a70c7c/src/server.ts#L35)

## Methods

### abort

▸ **abort**(): _Promise_<void\>

**Returns:** _Promise_<void\>

Defined in: [server.ts:222](https://github.com/jackness1208/yyl-server/blob/4a70c7c/src/server.ts#L222)

---

### livereload

▸ **livereload**(): _Promise_<void\>

**Returns:** _Promise_<void\>

Defined in: [server.ts:239](https://github.com/jackness1208/yyl-server/blob/4a70c7c/src/server.ts#L239)

---

### start

▸ **start**(): _Promise_<void\>

**Returns:** _Promise_<void\>

Defined in: [server.ts:103](https://github.com/jackness1208/yyl-server/blob/4a70c7c/src/server.ts#L103)
