[yyl-server](../README.md) / [Exports](../modules.md) / YServer

# Class: YServer

## Table of contents

### Constructors

- [constructor](yserver.md#constructor)

### Properties

- [app](yserver.md#app)
- [config](yserver.md#config)
- [cwd](yserver.md#cwd)
- [env](yserver.md#env)
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

\+ **new YServer**(`op`: [*YServerOption*](../interfaces/yserveroption.md)): [*YServer*](yserver.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [*YServerOption*](../interfaces/yserveroption.md) |

**Returns:** [*YServer*](yserver.md)

Defined in: [server.ts:62](https://github.com/yyl-team/yyl-server/blob/036ab4d/src/server.ts#L62)

## Properties

### app

• `Optional` **app**: *Express*

Defined in: [server.ts:33](https://github.com/yyl-team/yyl-server/blob/036ab4d/src/server.ts#L33)

___

### config

• **config**: *Required*<LocalserverConfig\>

配置

Defined in: [server.ts:47](https://github.com/yyl-team/yyl-server/blob/036ab4d/src/server.ts#L47)

___

### cwd

• **cwd**: *string*

Defined in: [server.ts:44](https://github.com/yyl-team/yyl-server/blob/036ab4d/src/server.ts#L44)

___

### env

• **env**: Env= {}

Defined in: [server.ts:42](https://github.com/yyl-team/yyl-server/blob/036ab4d/src/server.ts#L42)

___

### log

• **log**: *Logger*<keyof LoggerType\>

日志输出

Defined in: [server.ts:38](https://github.com/yyl-team/yyl-server/blob/036ab4d/src/server.ts#L38)

___

### lrServer

• `Optional` **lrServer**: *any*

Defined in: [server.ts:35](https://github.com/yyl-team/yyl-server/blob/036ab4d/src/server.ts#L35)

___

### option

• **option**: *Required*<[*YServerSetting*](../interfaces/yserversetting.md)\>

option

Defined in: [server.ts:59](https://github.com/yyl-team/yyl-server/blob/036ab4d/src/server.ts#L59)

___

### server

• `Optional` **server**: *Server*

Defined in: [server.ts:34](https://github.com/yyl-team/yyl-server/blob/036ab4d/src/server.ts#L34)

## Methods

### abort

▸ **abort**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Defined in: [server.ts:245](https://github.com/yyl-team/yyl-server/blob/036ab4d/src/server.ts#L245)

___

### livereload

▸ **livereload**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Defined in: [server.ts:262](https://github.com/yyl-team/yyl-server/blob/036ab4d/src/server.ts#L262)

___

### start

▸ **start**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Defined in: [server.ts:113](https://github.com/yyl-team/yyl-server/blob/036ab4d/src/server.ts#L113)
