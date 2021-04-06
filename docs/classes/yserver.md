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

\+ **new YServer**(`op`: [*YServerOption*](../interfaces/yserveroption.md)): [*YServer*](yserver.md)

#### Parameters:

Name | Type |
:------ | :------ |
`op` | [*YServerOption*](../interfaces/yserveroption.md) |

**Returns:** [*YServer*](yserver.md)

Defined in: [server.ts:60](https://github.com/jackness1208/yyl-server/blob/2a2aa3d/src/server.ts#L60)

## Properties

### app

• `Optional` **app**: *Express*

Defined in: [server.ts:34](https://github.com/jackness1208/yyl-server/blob/2a2aa3d/src/server.ts#L34)

___

### config

• **config**: *Required*<LocalserverConfig\>

配置

Defined in: [server.ts:46](https://github.com/jackness1208/yyl-server/blob/2a2aa3d/src/server.ts#L46)

___

### cwd

• **cwd**: *string*

Defined in: [server.ts:43](https://github.com/jackness1208/yyl-server/blob/2a2aa3d/src/server.ts#L43)

___

### log

• **log**: *Logger*<keyof SeedEventName\>

日志输出

Defined in: [server.ts:39](https://github.com/jackness1208/yyl-server/blob/2a2aa3d/src/server.ts#L39)

___

### lrServer

• `Optional` **lrServer**: *any*

Defined in: [server.ts:36](https://github.com/jackness1208/yyl-server/blob/2a2aa3d/src/server.ts#L36)

___

### option

• **option**: *Required*<[*YServerSetting*](../interfaces/yserversetting.md)\>

option

Defined in: [server.ts:57](https://github.com/jackness1208/yyl-server/blob/2a2aa3d/src/server.ts#L57)

___

### server

• `Optional` **server**: *Server*

Defined in: [server.ts:35](https://github.com/jackness1208/yyl-server/blob/2a2aa3d/src/server.ts#L35)

## Methods

### abort

▸ **abort**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Defined in: [server.ts:222](https://github.com/jackness1208/yyl-server/blob/2a2aa3d/src/server.ts#L222)

___

### livereload

▸ **livereload**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Defined in: [server.ts:239](https://github.com/jackness1208/yyl-server/blob/2a2aa3d/src/server.ts#L239)

___

### start

▸ **start**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Defined in: [server.ts:103](https://github.com/jackness1208/yyl-server/blob/2a2aa3d/src/server.ts#L103)
