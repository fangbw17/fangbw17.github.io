# 模块

什么是模块？包含 import 或 export 语句的文件就是一个模块。如果文件不包含 export 语句，就是一个全局的脚本文件。
模块内部的变量、函数、类等只在内部可见，想在外部可见必须使用 export 暴露出去。而外部想使用必须使用 import 导入。

### tip

如果一个文件不包含 export 语句，但是想当做一个模块使用，可以在脚本头部添加下面语句

```typescript
export {};
```

上面语句不产生任何实际作用，但是文件会被当做模块处理。

###

Typescript 除了支持 ES6 后的模块语法，还可以允许输出和输入类型

```typescript
export type Bool = true | false;
// 等价于下面两行
type MyBool = true | false;
export { MyBool };
```

上面示例想在别的文件中使用可以 通过 import 导入。

```typescript
import { MyBool } from "./a";
let foo: MyBool = false;
```

`./a` 指定被导入的文件相对于导入文件的相对路径，上面示例是当前文件夹下的 `a` 文件。Typescript 允许导入时省略文件格式，会自动将 `./a` 定位到 `./a.ts`。

## import type

在 Typescript 中，import type 可以导入一个类型的声明。允许在不引入整个模块的情况下，使用该模块中的类型。可以提高编译速度和避免命名空间冲突。

```typescript
// a.ts
export interface Pe {
    name: string;
}

// b.ts
import type { Pe } from "./a";
import { type Pe } from "./a";

// 两种写法都可以，第一种 type 是作用于整个 {}，而第二种 type 只作用于 Pe
```

## importsNotUsedAsValues 编译配置

TypeScript 的输入/输出语句编译成 JavaScript 时是怎样的呢？
TypeScript 提供了 `importsNotUsedAsValues` 编译配置项

-   `remove`：这是默认值，自动删除输入类型的 import 语句
-   `preserve`：保留输入类型的 import 语句。
-   `error`：保留输入类型的 import 语句 （与 `preserve` 相同），但是必须写成 `import type` 的形式，否则报错。

## CommonJS 模块

CommonJS 是 Node.js 环境下的格式，与 ES 模块不兼容

### CJS 下的 import

```typescript
// 方式一
import fs = require("fs");
// 方式二
import * as fs from "fs";
const code = fs.readFileSync("hello.ts", "utf8");

// 导出
let obj = { foo: 123 };
export = obj;

import obj = require("./a");
console.log(obj.foo);
```

上面示例中，使用的是 `import =` 形式 或者 `import * as [接口名] from '模块文件'`

## 模块定位

```typescript
import { A } from "./a";
import * as fs from "fs";
```

像上述俩种导入是如何定位到模块所在位置的呢。
模块定位与编译参数有关 `moduleResolution`，用来指定具体使用哪一种定位算法。常用的算法有两种 `Classic` 和 `Node`。
如果没有指定 `moduleResolution`，那么算法和另一个配置项 `module` 有关。当 `module` 是 `commonjs` 时，`moduleResolution` 的值就是 `Node`，其他情况下(es2015/esnext/amd/system/umd)就采用 `Classic` 算法

### 相对模块，非相对模块

加载模块分为相对和非相对两种。

-   相对模块指的是路径以 `/`、`./`、'../' 开头的模块；
    ```typescript
    import { A } from "./a";
    ```
-   非相对模块指的是不带路径信息的模块，由 `baseUrl` 属性或模块映射而确定的，通常用于加载外部模块。

    ```typescript
    import fs from "fs";
    ```

### Classic 方法

Classic 方法是以当前脚本为基准的。

-   当是相对模块时，会在当前导入的脚本所在目录查找被导入文件。
-   非相对模块时，以当前脚本作为起点，一层层向上查找目录。

### Node 方法

Node 方法是模拟 Node.js 的模块加载方法，也就是 `require()` 实现方法。

相对模块：

-   在当前目录查找是否包含 `x.ts`、`x.tsx`、`x.d.ts`。如果不存在就执行下一步
-   当前目录是否存在子目录 `x`，子目录中的 `package.json` 文件是否有 `types` 字段指定了模块入口文件，没有就执行下一步。
-   当前子目录 `x` 中是否存在 `index.ts`、`index.tsx`、`index.d.ts`。不存在则报错。

非相对模块：

-   当前目录的子目录 `node_modules` 是否包含 `x.ts`、`x.tsx`、`x.d.ts`。
-   当前目录的子目录 `node_modules`，是否存在文件 `package.json`，该文件的 `types` 字段是否指定了入口文件，如果是的就加载该文件。
-   当前目录的子目录 `node_modules` 里面，是否包含子目录 `@types` ，在该目录中查找文件 `x.d.ts`。
-   当前目录的子目录 `node_modules` 里面，是否包含子目录 `x`，在该目录中查找 `index.ts`、`index.tsx`、`index.d.ts`。
-   进入上一层目录，重复上面 4 步，直到找到为止。

### 路径映射

可以在 tsconfig.json 中手动指定脚本模块

```json
{
    "compilerOptions": {
        "baseUrl": "", // 基准目录
        "paths": {
            // 指定非相对路径的模块与实际脚本的映射
            "jquery": ["node_modules/jquery/dist/jquery"]
        },
        "rootDirs": ["src/view", "src/package", "src/#{locale}"] // 指定模块定位时必须查找的其他目录
    }
}
```

### 编译过程

模块定位的过程可以通过 tsc 命令加上 `--tranceResolution` 参数，能够在编译时在命令行显示模块定位的步骤。

```shell
tsc --tranceResolution
```

### --noResolve

使用 --noResolve 参数后只会从命令行传入的模块定位。

```typescript
import * as A from "moduleA";
import * as B from "moduleB";
```

```shell
tsc person.ts moduleA.ts --noResolve
```
使用了 `--noResolve` 参数后，上述代码可以定位到 `moduleA.ts`，但是无法定位到 `moduleB`。
