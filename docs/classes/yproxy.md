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

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [*YProxyOption*](../interfaces/yproxyoption.md) |

**Returns:** [*YProxy*](yproxy.md)

Defined in: [proxy.ts:87](https://github.com/yyl-team/yyl-server/blob/036ab4d/src/proxy.ts#L87)

## Properties

### config

• **config**: *Required*<ProxyConfig\>

Defined in: [proxy.ts:73](https://github.com/yyl-team/yyl-server/blob/036ab4d/src/proxy.ts#L73)

___

### log

• **log**: *Logger*<keyof LoggerType\>

日志输出

Defined in: [proxy.ts:85](https://github.com/yyl-team/yyl-server/blob/036ab4d/src/proxy.ts#L85)

___

### server

• `Optional` **server**: *ProxyServer*

Defined in: [proxy.ts:82](https://github.com/yyl-team/yyl-server/blob/036ab4d/src/proxy.ts#L82)

## Methods

### abort

▸ **abort**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Defined in: [proxy.ts:305](https://github.com/yyl-team/yyl-server/blob/036ab4d/src/proxy.ts#L305)

___

### start

▸ **start**(): *Promise*<unknown\>

**Returns:** *Promise*<unknown\>

Defined in: [proxy.ts:120](https://github.com/yyl-team/yyl-server/blob/036ab4d/src/proxy.ts#L120)

___

### certClean

▸ `Static` **certClean**(`op?`: [*StaticFnOption*](../interfaces/staticfnoption.md)): *Promise*<void\>

清理证书

#### Parameters

| Name | Type |
| :------ | :------ |
| `op?` | [*StaticFnOption*](../interfaces/staticfnoption.md) |

**Returns:** *Promise*<void\>

Defined in: [proxy.ts:58](https://github.com/yyl-team/yyl-server/blob/036ab4d/src/proxy.ts#L58)

___

### clean

▸ `Static` **clean**(`op?`: [*StaticFnOption*](../interfaces/staticfnoption.md)): *Promise*<void\>

清理缓存

#### Parameters

| Name | Type |
| :------ | :------ |
| `op?` | [*StaticFnOption*](../interfaces/staticfnoption.md) |

**Returns:** *Promise*<void\>

Defined in: [proxy.ts:44](https://github.com/yyl-team/yyl-server/blob/036ab4d/src/proxy.ts#L44)
