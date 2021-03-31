[yyl-server](../README.md) / [Exports](../modules.md) / YProxy

# Class: YProxy

## Table of contents

### Constructors

- [constructor](yproxy.md#constructor)

### Properties

- [config](yproxy.md#config)
- [log](yproxy.md#log)
- [server](yproxy.md#server)

### Methods

- [abort](yproxy.md#abort)
- [start](yproxy.md#start)
- [certClean](yproxy.md#certclean)
- [clean](yproxy.md#clean)

## Constructors

### constructor

\+ **new YProxy**(`op`: [*YProxyOption*](../interfaces/yproxyoption.md)): [*YProxy*](yproxy.md)

#### Parameters:

Name | Type |
:------ | :------ |
`op` | [*YProxyOption*](../interfaces/yproxyoption.md) |

**Returns:** [*YProxy*](yproxy.md)

Defined in: [proxy.ts:88](https://github.com/jackness1208/yyl-server/blob/4a70c7c/src/proxy.ts#L88)

## Properties

### config

• **config**: *Required*<ProxyConfig\>

Defined in: [proxy.ts:74](https://github.com/jackness1208/yyl-server/blob/4a70c7c/src/proxy.ts#L74)

___

### log

• **log**: *Logger*<keyof SeedEventName\>

日志输出

Defined in: [proxy.ts:86](https://github.com/jackness1208/yyl-server/blob/4a70c7c/src/proxy.ts#L86)

___

### server

• `Optional` **server**: *ProxyServer*

Defined in: [proxy.ts:83](https://github.com/jackness1208/yyl-server/blob/4a70c7c/src/proxy.ts#L83)

## Methods

### abort

▸ **abort**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Defined in: [proxy.ts:306](https://github.com/jackness1208/yyl-server/blob/4a70c7c/src/proxy.ts#L306)

___

### start

▸ **start**(): *Promise*<unknown\>

**Returns:** *Promise*<unknown\>

Defined in: [proxy.ts:121](https://github.com/jackness1208/yyl-server/blob/4a70c7c/src/proxy.ts#L121)

___

### certClean

▸ `Static`**certClean**(`op?`: [*StaticFnOption*](../interfaces/staticfnoption.md)): *Promise*<void\>

清理证书

#### Parameters:

Name | Type |
:------ | :------ |
`op?` | [*StaticFnOption*](../interfaces/staticfnoption.md) |

**Returns:** *Promise*<void\>

Defined in: [proxy.ts:59](https://github.com/jackness1208/yyl-server/blob/4a70c7c/src/proxy.ts#L59)

___

### clean

▸ `Static`**clean**(`op?`: [*StaticFnOption*](../interfaces/staticfnoption.md)): *Promise*<void\>

清理缓存

#### Parameters:

Name | Type |
:------ | :------ |
`op?` | [*StaticFnOption*](../interfaces/staticfnoption.md) |

**Returns:** *Promise*<void\>

Defined in: [proxy.ts:45](https://github.com/jackness1208/yyl-server/blob/4a70c7c/src/proxy.ts#L45)
