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

在项目中 JavaScript 和 TypeScript 文件扩展名一般是 `.js|.ts|.tsx|.jsx` 等，如果导入的文件不是这种后缀名，那么将会以 `{file.basename}.d.{extension}` 的形式查找该路径的声明文件。

```css
.cookie-banner {
    display: none;
}
```

```typescript
declare const css: {
    cookieBanner: string;
};
export default css;
```

```typescript
import styles from "./app.css";
styles.cookieBanner;
```

#### allowImportingTsExtensions

允许导入 TypeScript 的扩展文件：`.ts|.mts|.tsx`。只有当 `--noEmit` 或 `--emitDeclarationOnly` 开启时才有效，因为文件导入路径还需要被构建工具进行处理后才能正常使用。

#### allowUmdGlobalAccess

允许从内部模块文件访问作为全局变量的 _UMD_ 导出。

#### baseUrl

设置 TypeScript 项目的基准目录。由于默认是以 tsconfig.json 的位置作为基准目录，所以一般不需要使用该属性。

#### customConditions

可以设置一些附加条件，当 TypeScript 从 `package.json` 的 `exports` 或 `imports` 字段解析时，这些条件将添加到解析器默认使用的现有条件中。

#### module

指定编译产物的模块格式。默认值与 `target` 属性有关。如果 `target` 是 `ES6` 以下，则默认值是 `commonjs`，否则是 `ES6/ES2015`

#### moduleResolution

指定模块解析策略，即如何查找模块，有四种值。

-   node：采用 Node.js 的 CommonJS 语法
-   node16|nodenext：采用 Node.js 的 ECMAScript 语法
-   classic：TypeScript 1.6 之前的语法，新项目不建议使用。
-   bundler：TypeScript 5.0 新增的选项，表示当前代码被其他打包器处理（Webpack、Vite、esbuild、Parcel、rollup、swc），要求 `module` 设为 `es2015` 及以上版本。
    `moduleResolution` 的默认值与 `module` 属性有关，如果 `module` 为 `AMD`、`UMD`、`System` 或 `ES6/ES2015`，默认值为 `classic`。如果是 `node16` 或 `nodenext`，默认值为这两个。其他情况下，默认值为 `Node`

#### moduleSuffixes

提供一种方法覆盖解析模块时要搜索的文件名后缀列表

```json
{
    "compilerOptions": {
        "moduleSuffixes": [".ios", ".native", ""]
    }
}
```

```typescript
import * as foo from "./foo";
```

TypeScript 将查找相关文件 `./foo.ios.ts`、`./foo.native.ts`，最后是`./foo.ts`

#### noResolve

开启的情况下忽略三斜杠引用（///）；既不会导致添加新文件，也不会更改所提供文件的顺序。

#### paths

设置模块名和模块路径的映射，也就是 TypeScript 如何导入 `require` 或 imports 语句加载的模块。
`paths` 是基于 `baseUrl` 加载的，所以必须设置 `baseUrl`。

```json
{
    "baseUrl": "./",
    "path": {
        "jquery": ["./vendor/jquery/dist/jquery"],
        "app/*": ["./src/app/*"],
        "@": "src/"
    }
}
```

#### resolveJsonModule

开启该设置允许导入带有 `.json` 扩展名的模块，这是节点项目中的常见做法。
TypeScript 默认不支持解析 JSON 文件

```json
{
    "compilerOptions": {
        "resolveJsonModule": true
    }
}
```

```typescript
// 开启 resolveJsonModule 的情况下正确
import settings from "./settins.json";
```

#### resolvePackageJsonExports & resolvePackageJsonImports

启用该配置后，import 来自 node*modules 中的模块时，TypeScript 会去解析模块对应的 package.json 中的 exports 和 imports 字段。
::: tip
\_moduleResolution* 选项设置为 `node16`、`nodenext` 和 `bundler` 时，上述两个配置默认是开启的。
:::

#### rootDir

设置源码根目录，只要和编译后的脚本结构有关。`rootDir` 对应目录下的所有脚本，会成为输出目录里面的顶层脚本。

```
MyProj
├── tsconfig.json
├── core
│   ├── a.ts
│   ├── b.ts
│   ├── sub
│   │   ├── c.ts
├── types.d.ts
```

rootDir 的推断值是所有非声明输入文件的最长公共路径，上面示例是 `core/`。
如果设置的 outDir 是 dist，那么结构如下：

```
MyProj
├── dist
│   ├── a.js
│   ├── b.js
│   ├── sub
│   │   ├── c.js
```

假如希望 core 成为输出目录结构的一部分。通过在 `tsconfig.json` 中设置 `rootDir: "."`，TypeScript 将结构改为如下：

```
MyProj
├── dist
│   ├── core
│   │   ├── a.js
│   │   ├── b.js
│   │   ├── sub
│   │   │   ├── c.js
```

#### rootDirs

把多个不同目录，合并成一个虚拟目录，便于模块定位

```json
{
    "compilerOptions": {
        "rootDirs": ["bar", "foo"]
    }
}
```

示例中，rootDirs 将 `bar` 和 `foo` 组成一个虚拟目录

#### typeRoots

该配置设置类型模块所在的目录，默认情况下是 `node_modules/@types`，该目录下的模块会自动加入编译。而设置了 `typeRoots`，那么编译的就是该配置下指定的就是该文件夹下的模块。

```json
{
    "compilerOptions": {
        "typeRoots": ["./typings", "./vendor/types"]
    }
    // 数组中每个成员就是一个目录，它们的路径是相对于 tsconfig.json 位置
}
```

#### types

该配置设置类型模块是哪些，默认情况下是 `node_modules/@types` 下的所有模块。而设置了 `types`，那么就是指定了具体模块，比如：

```json
{
    "compilerOptions": {
        "types": ["node", "jest", "express"]
    }
}
```

仅会编译 `node_modules/@types` 下的 `node`、`jest` 和 `express` 模块，`node_modules/@types/*` 下的其他软件包将不包括在内。

### Emit

#### declaration

设置编译时是否为每个脚本生成类型声明文件 `.d.ts`。

#### declarationDir

设置生成的 `.d.ts` 文件所在的目录。

```json
{
    "compilerOptions": {
        "declaration": true,
        "declarationDir": "./types"
    }
}
```

#### declarationMap

设置生成的 `.d.ts` 类型声明文件的同时，还会生成对应的 Source Map 文件。

#### downlevelIteration

开启该设置即可在 低版本 es6 以下使用 `for / of`、`数组扩展([...a])`、`参数扩展(...args)` 和 `Symbol.iterator`。

#### emitBOM

设置是否在编译结果的文件头添加字节顺序标志 BOM，默认值是 `false`

#### emitDeclarationOnly

设置编译后只生成 `.d.ts` 文件，不生成 `.js` 文件。

#### importHelpers

该设置主要是 TypeScript 处理降级操作。如 TypeScript 使用一些辅助代码来执行扩展类、扩展数组或对象以及异步操作等操作。默认情况下，这些助手被插入到使用它们的文件中。如果在许多不同的模块中使用相同的帮助程序，可能会导致代码重复。
而如果 `importHelpers` 开启，这些辅助函数将从 `tslib` 模块导入。
当 `target` 设置的较低时，如 `ES5`，而代码中使用了较新的语法，可以开启 importHelpers 来编译降级，但是需要导入 `tslib`。

#### importsNotUsedAsValues

已弃用，使用 `verbatimModuleSyntax` 替代。
`importsNotUsedAsValues` 有 3 种值：

-   `remove`：删除仅引用类型的 import 语句的默认行为。
-   `preserve`：保留从未使用过值或类型的所有 import 语句。这可能会导致导入/副作用被保留。
-   `error`：保留所有导入（与保留选项相同），但当值导入仅用作类型时会出错。如果想确保没有值被意外导入，但仍然使副作用导入显式化，这可能很有用。

#### inlineSourceMap

设置后，TypeScript 将把源码映射内容嵌入到 `.js` 文件中，而不是编写 `.js.map` 文件。虽然会导致 JS 文件变大。但是某些场景下可能很方便。比如，想在不允许提供 `.map` 文件的 Web 服务器上调试 JS 文件。_与 sourceMap 互斥_

#### inlineSources

设置后，TypeScript 会将 .ts 文件的原始内容作为嵌入字符串包含到源映射中（使用源映射的 sourcesContent 属性）。

#### mapRoot

指定 `SourceMap` 文件的位置，而不是默认的生成位置。

```json
{
    "compilerOptions": {
        "sourceMap": true,
        "mapRoot": "https://my-website.com/debug/sourcemaps/"
    }
}
```

#### newLine

设置换行符为 `CRLF` （Windows）还是 `LF` （Linux）

#### noEmit

设置是否产生编译结果。如果不生成，TypeScript 编译就纯粹作为类型检查了。

#### noEmitHelpers

设置在编译结果文件不插入 TypeScript 辅助函数，而是通过外部引入辅助函数来解决，比如 `tslib`。

#### noEmitOnError

指定一旦编译报错，就不生成编译产物。

#### outDir

指定输出目录。若不指定，编译出来的 `.js` 文件存放在对应的 `.ts` 文件的相同位置。

#### outFile

设置将所有非模块的全局文件，编译在同一个文件里面。只有在 `module` 属性为 `None`、`System`、`AMD` 时才生效，并且不能用来打包 `CommonJS` 或 `ES6` 模块。

#### preserveConstEnums

将 `const enum` 结构保留下来，不替换成常量值。

#### preserveValueImports

已弃用，使用 `verbatimModuleSyntax` 替代。
某些场景下，TypeScript 不能检测到使用了 `import` 语法。如下，TypeScript 会判断这个 `import` 没用而去掉它，因为在 `eval` 中使用，TypeScript 没有办法判断是否使用了。

```typescript
import { Animal } from "./animal.js";
eval("console.log(new Animal().isDangerous)");
```

```vue
<script setup>
import { someFunc } from "./some-module.js";
</script>

<button @click="someFunc">Click</button>
```

#### removeComments

编译成 JavaScript 时是否删除所有注释。

#### sourceMap

设置编译时是否生成 `SourceMap` 文件。

#### sourceRoot

在 `SourceMap` 里面设置 TypeScript 源文件的位置。

```json
{
    "compilerOptions": {
        "sourceMap": true,
        "sourceRoot": "https://my-website.com/debug/source/"
    }
}
```

#### stripInternal

当开启该设置时，将停止为具有 `@internal` JSDoc 注释的代码生成声明。

### JavaScript Support

#### allowJs

`allowJs` 允许 TypeScript 项目加载 JS 脚本。编译时，也会将 JS 文件，一起构建到输出目录中

```json
{
    "compilerOptions": {
        "allowJs": true
    }
}
```

#### checkJs

`checkJS` 设置对 JS 文件同样进行类型检查。打开这个属性，也会自动打开 `allowJs`。它等同于在 JS 脚本的头部添加 `// @ts-check` 命令

#### maxNodeModuleJsDepth

在 `node_modules` 下搜索并加载 JavaScript 文件的最大依赖深度。仅当启用 `allowJs` 时才能使用此标志，如果您想让 `TypeScript` 为 `node_modules` 内的所有 JavaScript 推断类型，则可以使用此标志。默认值为 0

### Editor Support

#### disableSizeLimit

为了避免在处理非常大的 JavaScript 项目时可能出现的内存膨胀问题，TypeScript 将分配的内存量有一个上限。打开此标志将取消限制。

#### plugins

编辑器内运行的语言服务插件列表

### Interop Constraints

#### allowSyntheticDefaultImports

允许 import 命令默认加载没有 `default` 输出的模块。

```typescript
// 默认情况
import * as React from "react";
// 开启配置后
import React from "react";
```

#### esModuleInterop

该配置修复了一些 CommonJS 和 ES6 模块之间的兼容性问题。

```typescript
import * as moment from "moment";
moment();
```

上面示例中，根据 `ES6` 的规范，`import * as moment` 里面的 `moment` 是一个对象，不能当做函数调用。

```typescript
import moment from "moment";
moment();
```

改成这种就不会报错了。如果将上面的代码编译成 CommonJS 模块格式，打开 `esModuleInterop` 就会加入一些辅助函数，确保编译后的代码行为正确。

打开 `esModuleInterop`，将自动打开 `allowSyntheticDefaultImports`

#### forceConsistentCasingInFileNames

设置文件名是否大小写敏感，默认是开启的。

#### isolatedModules

设置如果当前 TypeScript 脚本作为单个模块编译，是否会因为缺少其他脚本的类型信息而报错，主要便于非官方的编译工具（比如 Babel）正确编译单个脚本。

#### preserveSymlinks

这个开关使用于 Node.js，当这个选项开启时，在进行模块和 package 解析时（例如使用 import 或者三斜杠语法）引用都是相对于符号链接文件的位置来解析的，而不是相对于符号链接所解析的路径。
