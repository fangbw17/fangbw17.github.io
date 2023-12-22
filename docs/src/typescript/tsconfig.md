# tsconfig

`tsconfig.json` 是 TypeScript 的配置文件，一般放在项目的根目录。如果项目是 JavaScript，但想用 TypeScript 处理，那么配置文件的名字是 `jsconfig.json`，跟 `tsconfig` 的写法是一样的。
`tsconfig.json` 主要供 `tsc` 编译器使用，可以使用 命令行参数 `-- project` 或 `-p` 来指定 `tsconfig.json` 的位置。

```shell
tsc -p ./xxx/xxx.json
# 或 指定目录
tsc -p ./xxx
```

若没有指定配置文件的位置，则会在当前目录下搜索 `tsconfig.json` 文件，不存在，则向上搜索，直到找到为止。
配置文件可以不必手写，使用 tsc 命令的 `--init` 参数自动生成

```shell
tsc --init
```

`tsc -- init` 会生成一些默认配置。
也可以使用一些配置好的文件，npm 的 `@tsconfig` 名称空间下面有很多模块，都是写好的配置文件，比如 `@tsconfig/recommended` 和 `@tsconfig/node16`

```shell
npm install --save-dev @tsconfig/node16
# 或
yarn add --dev @tsconfig/node16
```

安装完成以后，可以在 `tsconfig.json` 里面引用，相当于继承了设置

```json
{
    "extends": "@tsconfig/node16/tsconfig.json"
}
```

`tsconfig.json` 一级属性并不多，大部分都是在 `compilerOptions` 属性的二级属性。

## exclude

`exclude` 是一个数组，必须与 `include` 属性一起使用，用来从编译列表中去除指定的文件，支持通配符。

```json
{
    "include": ["**/*"],
    "exclude": ["src/utils/xx.ts"]
}
```

## extends

`extends` 一般用来继承另一个配置文件。如果项目有多个配置，可以把共同的配置写成 `tsconfig.base.json`，其他的配置文件继承该文件。

```json
{
    "extends": "../tsconfig.base.json"
}
```

如果指定的路径不是以 `./` 或 `../` 开头，那么将在 `node_modules` 目录下查找指定的配置文件。
编译器会先加载 `extends` 指定的 `tsconfig.json`，然后加载当前的 `tsconfig.json`。如果有重名的属性，后者会覆盖前者。

## files

`files` 指定编译的文件列表，如果其中有一个文件不存在，就会报错。

```json
{
    "files": ["a.ts", "b.ts"]
}
```

`files` 是一个数组，排在前面的文件先编译，即从左到右编译。该属性必须逐一列出文件，不支持文件匹配。
文件较多时，使用 `include` 和 `exclude` 属性比较合适。

## include

include 属性指定编译的文件列表，即支持文件名，也支持通配符。

-   `?`: 指代单个字符
-   `*`: 指代任意字符，
-   `**`: 指定任意目录层级

```json
{
    "include": ["src/**/*", "tests/**/*"]
}
```

如果不指定文件后缀名，默认是 `.ts`、`.tsx` 和 `.d.ts` 文件。若开启了 `allowJs`，那么还包括 `.js` 和 `.jsx`

## references

`references` 是一个数组。主要用于将大型项目拆分成更小的部分构建，这样做，可以缩短构建时间，强制组件之间的逻辑分离，并以新的更好的方式组织代码。

```json
{
    "references": [{ "path": "../pkg1" }, { "path": "../pkg2/tsconfig.json" }]
}
```

引用底层项目的 `tsconfig.json` 必须启用 `composite` 属性。

```json
{
    "compilerOptions": {
        "composite": true
    }
}
```

## compilerOptions

设置编译的行为，不设置的情况 TypeScript 有默认的设置。
主要分为下面几类

-   类型检查（Type Checking）
-   模块（Modules）
-   发射（Emit）
-   JavaScript 支持（JavaScript Support）
-   编辑支持（Editor Support）
-   操作约束（Interop Constraints）
-   向后兼容（Backwards Compatibility）
-   语言与环境（Language and Environment）
-   编译器诊断（Compiler Diagnostics）
-   项目（Projects）
-   输出格式（Output Formatting）
-   完整性（Completeness）
-   命令行（Command line）
-   观察选项（Watch Options）

### 类型检查（Type Checking）

#### allowUnreachableCode

是否允许存在不可能会执行的代码。有三种值：

-   undefined：默认值，编辑器警告
-   true：忽略不会执行的代码
-   false：报错

::: tip
不会影响由于类型分析而无法访问的代码错误
:::

#### allowUnusedLabels

是否允许未使用的代码标签。有三种值：

-   undefined：默认值，编辑器警告
-   true：忽略
-   false：报错

#### alwaysStrict

`alwaysStrict` 执行 ECMAScript 严格模式（"use strict"）

#### exactOptionalPropertyTypes

可选属性不能赋值为 `undefined`

```typescript
// 开启 exactOptionalPropertyTypes
interface UserDefaults {
    colorThemeOverride?: "dark" | "light";
}
let userDefaults: UserDefaults = {
    colorThemeOverride: "dark",
};

// 报错
userDefaults.colorThemeOverride = undefined;
```

开启 `exactOptionalPropertyTypes`，哪怕 `colorThemeOverride` 属性是可选的，也不能显式的赋值为 `undefined`

#### noFallthroughCasesInSwitch

在 `swith` 条件语句中 对没有 `break/return/throw` 的 case 语句报错。

```typescript
// 开启 noFallthroughCasesInSwitch
const a: number = 6;
switch (a) {
    case 0: // 报错
        console.log("even");
    case 1:
        console.log("odd");
        break;
}
```

#### noImplicitAny

是否允许 any 类型存在。

```typescript
// 报错
function foo(s) {
    console.log(s.substring(3));
}
foo(42);
```

#### noImplicitOverride

是否禁止隐式重写父类（基类）的成员。
当子类继承父类时，若隐式的重写某个成员，在调用的时候可能会导致一些意外的行为。开启了 `noImplicitOverride` 则会要求显示的使用 `override` 关键字来重写父类的成员，增加代码的可读性和可维护性，并减少潜在的错误。

```typescript
class Base {
    foo() {}

    bar() {}
}

class A extends Base {
    override foo() {}
}

class B extends Base {
    // 报错，缺少 override
    bar() {}
}
```

#### noImplicitReturns

是否需要确保所有情况下都必须有一个返回值

```typescript
// 启用 noImplicitReturns
function lookup(color: "blue" | "black"): string {
    if (color === "blue") {
        return "beats";
    } else {
        // 报错，else 分支没有 return
        ("bose");
    }
}
```

#### noImplicitThis

开启后，如果 this 隐私的显示为 any 类型，那么就会报错

```typescript
class Rectangle {
    width: number;
    height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    getAreaFunction() {
        return function () {
            return this.width * this.height;
        };
    }
}
```

this 的上下文位于 getAreaFunction，而不是 Rectangle

#### noPropertyAccessFromIndexSignature

```typescript
interface Game {
    name: "a" | "b" | "c";
    [key: string]: string;
}

const getGame = (g: Game) => {
    return g.text;
};
```

上面示例中，getGame 函数会返回一个值，接口 Game 中定义了一个 name 属性，和一个字符串索引。
所以 `g.text` 在编译阶段是成立的，但是在运行时，是不能确定 `g` 中是否存在属性 `text`。同时 TypeScript 会进行返回值的类型推断，倘若没有属性 `text`，那么会返回 `undefined`，可能就会造成潜在的风险。
为了避免这种情况，TypeScript 提供了 `noPropertyAccessFromIndexSignature`。 设置为 `true` 时，会抛出错误，必须通过 `[]` 来访问索引签名定义的属性，提供使用者该属性不一定存在。

#### noUncheckedIndexedAccess

是否在访问索引属性时自动添加上 `undefined`

```typescript
const arr = [1, 2, 3];
const x = arr[0]; // number | undfined
const y = arr[1000]; // number | undfined
```

#### noUnusedLocals

未使用的局部变量警告

```typescript
const createKeyboard = (s: number) => {
    // 警告
    const age = 20;
    return { age: s };
};
```

#### noUnusedParameters

函数参数未使用警告

#### strict

用来开启 TypeScript 的严格检查，默认是关闭的。
开启该选项，意味着一同开启了以下设置

-   alwaysStrict
-   strictNullChecks
-   strictBindCallApply
-   strictFunctionTypes
-   strictPropertyInitialization
-   noImplicitAny
-   noImplicitThis
-   useUnknownInCatchVariables

上述中的某一行也可以单独设置开启关闭。

#### strictBindCallApply

是否对函数 call、bind 和 apply 等内置方法的参数类型检查

```typescript
function fn(x: string) {
    return parseInt(x);
}

const n1 = fn.call(undefined, "10");
// 开启状态下报错，类型不对。未开启状态下类型是 any
const n2 = fn.call(undefined, false);
```

#### strictFunctionTypes

是否开启严格的函数检查。

```typescript
function fna(x: string) {
    console.log(x);
}

type Func = (ns: number | string) => void;

// 开启则报错，入参类型不一样。不开启忽略
let func: Func = fn;
```

#### strictNullChecks

是否开启空值检查。

#### strictPropertyInitialization

检查**类中声明的属性是否在构造函数中赋值**。

```typescript
class Person {
    name: string;

    constructor() {}
    // 属性“name”没有初始化表达式，且未在构造函数中明确赋值。
}
```

#### useUnknownInCatchVariables

允许在 `catch` 子句中奖变量类型从 any 更改为 unknown。

```typescript
try {
    throw 123;
} catch (e) {
    if (e instanceof Error) {
        // 通过 instanceof 确定 e 的具体类型
        console.log(e.message);
    }
}
```

### Modules

#### allowArbitraryExtensions


#### allowSyntheticDefaultImports

使用 `import` 名默认加载没有 `default` 输出的模块。

```typescript
//
import React from "react";
import * as React from "react";
```

#### allowJs

`allowJs` 允许 TypeScript 项目加载 JS 脚本。编译时，也会将 JS 文件，一起构建到输出目录中

```json
{
    "compilerOptions": {
        "allowJs": true
    }
}
```
