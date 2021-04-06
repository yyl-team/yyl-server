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

\+ **new YProxy**(`op`: [_YProxyOption_](../interfaces/yproxyoption.md)): [_YProxy_](yproxy.md)

#### Parameters:

| Name | Type                                            |
| :--- | :---------------------------------------------- |
| `op` | [_YProxyOption_](../interfaces/yproxyoption.md) |

**Returns:** [_YProxy_](yproxy.md)

Defined in: [proxy.ts:88](https://github.com/jackness1208/yyl-server/blob/4a70c7c/src/proxy.ts#L88)

## Properties

### config

• **config**: _Required_<ProxyConfig\>

Defined in: [proxy.ts:74](https://github.com/jackness1208/yyl-server/blob/4a70c7c/src/proxy.ts#L74)

---

### log

• **log**: _Logger_<keyof SeedEventName\>

日志输出

Defined in: [proxy.ts:86](https://github.com/jackness1208/yyl-server/blob/4a70c7c/src/proxy.ts#L86)

---

### server

• `Optional` **server**: _ProxyServer_

Defined in: [proxy.ts:83](https://github.com/jackness1208/yyl-server/blob/4a70c7c/src/proxy.ts#L83)

## Methods

### abort

▸ **abort**(): _Promise_<void\>

**Returns:** _Promise_<void\>

Defined in: [proxy.ts:306](https://github.com/jackness1208/yyl-server/blob/4a70c7c/src/proxy.ts#L306)

---

### start

▸ **start**(): _Promise_<unknown\>

**Returns:** _Promise_<unknown\>

Defined in: [proxy.ts:121](https://github.com/jackness1208/yyl-server/blob/4a70c7c/src/proxy.ts#L121)

---

### certClean

▸ `Static`**certClean**(`op?`: [_StaticFnOption_](../interfaces/staticfnoption.md)): _Promise_<void\>

清理证书

#### Parameters:

| Name  | Type                                                |
| :---- | :-------------------------------------------------- |
| `op?` | [_StaticFnOption_](../interfaces/staticfnoption.md) |

**Returns:** _Promise_<void\>

Defined in: [proxy.ts:59](https://github.com/jackness1208/yyl-server/blob/4a70c7c/src/proxy.ts#L59)

---

### clean

▸ `Static`**clean**(`op?`: [_StaticFnOption_](../interfaces/staticfnoption.md)): _Promise_<void\>

清理缓存

#### Parameters:

| Name  | Type                                                |
| :---- | :-------------------------------------------------- |
| `op?` | [_StaticFnOption_](../interfaces/staticfnoption.md) |

**Returns:** _Promise_<void\>

Defined in: [proxy.ts:45](https://github.com/jackness1208/yyl-server/blob/4a70c7c/src/proxy.ts#L45)
