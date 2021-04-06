[yyl-server](../README.md) / [Exports](../modules.md) / Runner

# Class: Runner

## Table of contents

### Constructors

- [constructor](runner.md#constructor)

### Properties

- [homePage](runner.md#homepage)
- [option](runner.md#option)
- [proxy](runner.md#proxy)
- [server](runner.md#server)

### Methods

- [abort](runner.md#abort)
- [livereload](runner.md#livereload)
- [start](runner.md#start)
- [clean](runner.md#clean)

## Constructors

### constructor

\+ **new Runner**(`op`: [_RunnerOption_](../interfaces/runneroption.md)): [_Runner_](runner.md)

#### Parameters:

| Name | Type                                            |
| :--- | :---------------------------------------------- |
| `op` | [_RunnerOption_](../interfaces/runneroption.md) |

**Returns:** [_Runner_](runner.md)

Defined in: [runner.ts:42](https://github.com/jackness1208/yyl-server/blob/4a70c7c/src/runner.ts#L42)

## Properties

### homePage

• **homePage**: _string_= ''

主页

Defined in: [runner.ts:42](https://github.com/jackness1208/yyl-server/blob/4a70c7c/src/runner.ts#L42)

---

### option

• **option**: _Required_<[_RunnerOption_](../interfaces/runneroption.md)\>

Defined in: [runner.ts:25](https://github.com/jackness1208/yyl-server/blob/4a70c7c/src/runner.ts#L25)

---

### proxy

• `Optional` **proxy**: [_YProxy_](yproxy.md)

反向代理 entance

Defined in: [runner.ts:40](https://github.com/jackness1208/yyl-server/blob/4a70c7c/src/runner.ts#L40)

---

### server

• `Optional` **server**: [_YServer_](yserver.md)

本地服务 entance

Defined in: [runner.ts:38](https://github.com/jackness1208/yyl-server/blob/4a70c7c/src/runner.ts#L38)

## Methods

### abort

▸ **abort**(): _Promise_<void\>

**Returns:** _Promise_<void\>

Defined in: [runner.ts:178](https://github.com/jackness1208/yyl-server/blob/4a70c7c/src/runner.ts#L178)

---

### livereload

▸ **livereload**(): _Promise_<void\>

**Returns:** _Promise_<void\>

Defined in: [runner.ts:189](https://github.com/jackness1208/yyl-server/blob/4a70c7c/src/runner.ts#L189)

---

### start

▸ **start**(): _Promise_<void\>

**Returns:** _Promise_<void\>

Defined in: [runner.ts:167](https://github.com/jackness1208/yyl-server/blob/4a70c7c/src/runner.ts#L167)

---

### clean

▸ `Static`**clean**(`op?`: [_StaticFnOption_](../interfaces/staticfnoption.md)): _Promise_<void\>

#### Parameters:

| Name  | Type                                                |
| :---- | :-------------------------------------------------- |
| `op?` | [_StaticFnOption_](../interfaces/staticfnoption.md) |

**Returns:** _Promise_<void\>

Defined in: [runner.ts:20](https://github.com/jackness1208/yyl-server/blob/4a70c7c/src/runner.ts#L20)
