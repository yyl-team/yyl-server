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

Defined in: server.ts:59

## Properties

### app

• `Optional` **app**: *Express*

Defined in: server.ts:33

___

### config

• **config**: *Required*<LocalserverConfig\>

配置

Defined in: server.ts:45

___

### cwd

• **cwd**: *string*

Defined in: server.ts:42

___

### log

• **log**: Logger

日志输出

Defined in: server.ts:38

___

### lrServer

• `Optional` **lrServer**: *any*

Defined in: server.ts:35

___

### option

• **option**: *Required*<[*YServerSetting*](../interfaces/yserversetting.md)\>

option

Defined in: server.ts:56

___

### server

• `Optional` **server**: *Server*

Defined in: server.ts:34

## Methods

### abort

▸ **abort**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Defined in: server.ts:217

___

### livereload

▸ **livereload**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Defined in: server.ts:234

___

### start

▸ **start**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Defined in: server.ts:102