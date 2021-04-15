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

#### Parameters:

Name | Type |
:------ | :------ |
`op` | [*RunnerOption*](../interfaces/runneroption.md) |

**Returns:** [*Runner*](runner.md)

Defined in: [runner.ts:42](https://github.com/jackness1208/yyl-server/blob/6004737/src/runner.ts#L42)

## Properties

### homePage

• **homePage**: *string*= ''

主页

Defined in: [runner.ts:42](https://github.com/jackness1208/yyl-server/blob/6004737/src/runner.ts#L42)

___

### option

• **option**: *Required*<[*RunnerOption*](../interfaces/runneroption.md)\>

Defined in: [runner.ts:25](https://github.com/jackness1208/yyl-server/blob/6004737/src/runner.ts#L25)

___

### proxy

• `Optional` **proxy**: [*YProxy*](yproxy.md)

反向代理 entance

Defined in: [runner.ts:40](https://github.com/jackness1208/yyl-server/blob/6004737/src/runner.ts#L40)

___

### server

• `Optional` **server**: [*YServer*](yserver.md)

本地服务 entance

Defined in: [runner.ts:38](https://github.com/jackness1208/yyl-server/blob/6004737/src/runner.ts#L38)

## Methods

### abort

▸ **abort**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Defined in: [runner.ts:178](https://github.com/jackness1208/yyl-server/blob/6004737/src/runner.ts#L178)

___

### livereload

▸ **livereload**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Defined in: [runner.ts:189](https://github.com/jackness1208/yyl-server/blob/6004737/src/runner.ts#L189)

___

### start

▸ **start**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Defined in: [runner.ts:167](https://github.com/jackness1208/yyl-server/blob/6004737/src/runner.ts#L167)

___

### clean

▸ `Static`**clean**(`op?`: [*StaticFnOption*](../interfaces/staticfnoption.md)): *Promise*<void\>

#### Parameters:

Name | Type |
:------ | :------ |
`op?` | [*StaticFnOption*](../interfaces/staticfnoption.md) |

**Returns:** *Promise*<void\>

Defined in: [runner.ts:20](https://github.com/jackness1208/yyl-server/blob/6004737/src/runner.ts#L20)
