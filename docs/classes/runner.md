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

Defined in: runner.ts:41

## Properties

### homePage

• **homePage**: *string*= ''

主页

Defined in: runner.ts:41

___

### option

• **option**: *Required*<[*RunnerOption*](../interfaces/runneroption.md)\>

Defined in: runner.ts:24

___

### proxy

• `Optional` **proxy**: [*YProxy*](yproxy.md)

反向代理 entance

Defined in: runner.ts:39

___

### server

• `Optional` **server**: [*YServer*](yserver.md)

本地服务 entance

Defined in: runner.ts:37

## Methods

### abort

▸ **abort**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Defined in: runner.ts:177

___

### livereload

▸ **livereload**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Defined in: runner.ts:188

___

### start

▸ **start**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Defined in: runner.ts:166

___

### clean

▸ `Static`**clean**(`op?`: [*StaticFnOption*](../interfaces/staticfnoption.md)): *Promise*<void\>

#### Parameters:

Name | Type |
:------ | :------ |
`op?` | [*StaticFnOption*](../interfaces/staticfnoption.md) |

**Returns:** *Promise*<void\>

Defined in: runner.ts:19
