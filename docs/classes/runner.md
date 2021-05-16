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

\+ **new Runner**(`op`: [*RunnerOption*](../interfaces/runneroption.md)): [*Runner*](runner.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [*RunnerOption*](../interfaces/runneroption.md) |

**Returns:** [*Runner*](runner.md)

Defined in: [runner.ts:40](https://github.com/yyl-team/yyl-server/blob/b7b1b5d/src/runner.ts#L40)

## Properties

### homePage

• **homePage**: *string*= ''

主页

Defined in: [runner.ts:40](https://github.com/yyl-team/yyl-server/blob/b7b1b5d/src/runner.ts#L40)

___

### option

• **option**: *Required*<[*RunnerOption*](../interfaces/runneroption.md)\>

Defined in: [runner.ts:23](https://github.com/yyl-team/yyl-server/blob/b7b1b5d/src/runner.ts#L23)

___

### proxy

• `Optional` **proxy**: [*YProxy*](yproxy.md)

反向代理 entance

Defined in: [runner.ts:38](https://github.com/yyl-team/yyl-server/blob/b7b1b5d/src/runner.ts#L38)

___

### server

• `Optional` **server**: [*YServer*](yserver.md)

本地服务 entance

Defined in: [runner.ts:36](https://github.com/yyl-team/yyl-server/blob/b7b1b5d/src/runner.ts#L36)

## Methods

### abort

▸ **abort**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Defined in: [runner.ts:176](https://github.com/yyl-team/yyl-server/blob/b7b1b5d/src/runner.ts#L176)

___

### livereload

▸ **livereload**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Defined in: [runner.ts:187](https://github.com/yyl-team/yyl-server/blob/b7b1b5d/src/runner.ts#L187)

___

### start

▸ **start**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Defined in: [runner.ts:165](https://github.com/yyl-team/yyl-server/blob/b7b1b5d/src/runner.ts#L165)

___

### clean

▸ `Static` **clean**(`op?`: [*StaticFnOption*](../interfaces/staticfnoption.md)): *Promise*<void\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `op?` | [*StaticFnOption*](../interfaces/staticfnoption.md) |

**Returns:** *Promise*<void\>

Defined in: [runner.ts:18](https://github.com/yyl-team/yyl-server/blob/b7b1b5d/src/runner.ts#L18)
