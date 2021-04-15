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

#### Parameters:

Name | Type |
:------ | :------ |
`op` | [*YServerOption*](../interfaces/yserveroption.md) |

**Returns:** [*YServer*](yserver.md)

Defined in: [server.ts:63](https://github.com/jackness1208/yyl-server/blob/6004737/src/server.ts#L63)

## Properties

### app

• `Optional` **app**: *Express*

Defined in: [server.ts:34](https://github.com/jackness1208/yyl-server/blob/6004737/src/server.ts#L34)

___

### config

• **config**: *Required*<LocalserverConfig\>

配置

Defined in: [server.ts:48](https://github.com/jackness1208/yyl-server/blob/6004737/src/server.ts#L48)

___

### cwd

• **cwd**: *string*

Defined in: [server.ts:45](https://github.com/jackness1208/yyl-server/blob/6004737/src/server.ts#L45)

___

### env

• **env**: Env

Defined in: [server.ts:43](https://github.com/jackness1208/yyl-server/blob/6004737/src/server.ts#L43)

___

### log

• **log**: *Logger*<keyof SeedEventName\>

日志输出

Defined in: [server.ts:39](https://github.com/jackness1208/yyl-server/blob/6004737/src/server.ts#L39)

___

### lrServer

• `Optional` **lrServer**: *any*

Defined in: [server.ts:36](https://github.com/jackness1208/yyl-server/blob/6004737/src/server.ts#L36)

___

### option

• **option**: *Required*<[*YServerSetting*](../interfaces/yserversetting.md)\>

option

Defined in: [server.ts:60](https://github.com/jackness1208/yyl-server/blob/6004737/src/server.ts#L60)

___

### server

• `Optional` **server**: *Server*

Defined in: [server.ts:35](https://github.com/jackness1208/yyl-server/blob/6004737/src/server.ts#L35)

## Methods

### abort

▸ **abort**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Defined in: [server.ts:246](https://github.com/jackness1208/yyl-server/blob/6004737/src/server.ts#L246)

___

### livereload

▸ **livereload**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Defined in: [server.ts:263](https://github.com/jackness1208/yyl-server/blob/6004737/src/server.ts#L263)

___

### start

▸ **start**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Defined in: [server.ts:114](https://github.com/jackness1208/yyl-server/blob/6004737/src/server.ts#L114)
