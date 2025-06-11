# ESLint

![介绍](/assets/img/intro.png)

## 1. 安装并使用

在命令行中安装并配置 ESLint:

```shell
npm init @eslint/config
```

**在安装 ESLint 之前确保存在 package.json 文件。**
package.json 可以手动创建文件，也可以通过 `npm init` 或 `yarn init` 来创建。

### 1.1 安装过程

在终端中输入 `npm init @eslint/config` 之后, 会出现如下过程:

- 使用 ESLint 做什么?
  - 仅检查语法
  - 检查语法并找出问题
  - 检查语法，找出问题并且修复代码样式
- 选择 JS 模块导入方式
  - ES6 的 import/export
  - CommonJS 的 require/exports
  - 其他
- 项目中使用了哪种框架？
  - React
  - Vue
  - 其他
- 是否使用 TS?
- 代码执行的宿主环境
  - 浏览器
  - node
- 使用哪种风格样式？
  - 主流样式
  - 通过回答问题形成一种风格
- 主流样式中的哪一种?
  - Airbnb
  - Standard
  - Google
  - XO
- 指定 ESLint 配置文件的类型
  - JavaScript
  - YAML
  - JSON
- 以上功能需要某些 npm 模块，是否安装
- 哪种方式安装？
  - npm
  - yarn
  - pnpm

### 1.2 使用

安装完成之后就可以简单使用：`npx eslint <filename/direction>` 或在 package.json 中配置

```JSON
    "eslint": "eslint <filename/direction>"
```

使用 `npx eslint ./src/index.js`，如下图所示：
![npx](/assets/img/npx-eslint.png)

1. `a` 未被使用
2. 结尾需要换行

使用 `npm run eslint`, 如下图所示

## 2 配置 ESLint

### 2.1 配置文件

ESLint 支持几种格式的配置文件：

**JavaScript** - 使用 `.eslintrc.js` 并导出包括配置的对象。
**JavaScript(ESM)** - 当在 JavaScript 包中运行 ESLint 时，且 `package.json` 中配置了 `"type": "module"` 时，使用 `.eslintrc.cjs`。
**YAML** - 使用 `.eslintrc.yaml` 或 `.eslintrc.yml` 来定义配置结构。
**JSON** - 使用 .eslintrc.json 来定义配置结构。
**package.json** - 在 `package.json` 文件中创建 eslintConfig 属性并在那里定义配置。

配置文件优先级：

1. .js
2. .cjs
3. .yaml
4. .yml
5. .json
6. package.json

### 2.2 使用配置文件

1. 使用 `.eslintrc.*` 和 `package.json` 文件。ESLint 会自动检查文件的目录寻找配置文件，在其直系父目录中寻找，直到文件系统的根目录 (/)、当前用户的主目录 (~/) 或指定 `root: true`。
2. 将配置文件保存在任意位置，使用 CLI 传参的形式

```shell
    eslint -c config.js index.js
```

`eslintrc` 配置主要分为以下几类：

- env: 指定的运行环境
- extends: 扩展配置文件，继承另一个配置文件的所有特征（包括规则、插件和语言选项），相当于规则集合
- globals: 执行过程中需要用到的额外全局变量
- rules: 启用额外的规则，扩展（或覆盖）规则集
- plugins: 第三方插件提供的规则，配置，环境等
- parserOptions: 解析选项
- parser: 解析器

### 2.2 配置语言选项

JavaScript 存在着多个版本，每个版本所支持的语法和全局变量略有不同。ESLint 会让指定项目中 JavaScript 所使用的语言选项。也可以在项目中使用插件扩展 ESLint 支持的语言选项。

常见的环境如下：

- browser - 浏览器全局变量
- node - node.js 的全局变量
- commonjs - commonjs 全局变量
- es6 - 添加所有除模块以外的 ECMAScript 2015 功能
- es2016~2022 - 添加所有 ECMAScript 2016~2022 的全局变量，并自动将解析器选项 ecmaVersion 设置为 7~13。

更加详细的环境查看[官网](https://eslint.org/docs/latest/use/configure/language-options)

#### 2.2.1 使用插件

如果想使用插件中的环境，在 plugins 中指定插件名称，然后在 evn 中设置没有前缀的插件名称，后面加上斜杠，再加上环境名称。

```javascript
{
    "plugins": ["example"],
    "env": {
        "example/custom": true
    }
}
```

### 2.3 配置全局变量

ESLint 在运行校验时依赖全局变量的。由于不同变量在不同的环境中可能不同，例如 JQuery 的 $，可能在校验时不会通过。这时就可以额外配置全局变量来设置。

```javascript
{
    "globals": {
        "$": "writable",
        "$$": "readonly"
    }
}
```

`writable` 允许在打码中覆盖 $, 重新给 $ 赋值，`readonly` 不允许覆盖 $$。
也可以在环境中禁用某些变量。如在 ES6 中禁用 Promise

```javascript
{
    "env": {
        "es6": true
    }
    "globals": {
        "Promise": "off"
    }
}
```

### 2.3 解析器选项

使用解析器可以指定想要的 JS 语言选项。env 启用指定版本语言的全局变量，parserOptions 启用指定版本语言的语法。如支持 ES6 语法不等于支持新的 ES6 全局变量。

```javascript
{
    "env": {
        "es6": true
    }
    "parserOptions": {
        "ecmaVersion": 6, // 指定版本
        "sourceType": "script" // script 默认值，或 module
        "allowReserved": false, // 允许使用保留字作为标识符
        "ecmaFeatures": {
            "globalReturn": true, // 允许全局范围内的 return 语句
            "impliedStrict": true, // 启用全局严格模式（如果es是5或更高版本）
            "jsx": true // 启用 jsx
        }
    },
}
```

### 2.4 配置规则

规则是 ESLint 的核心构建模块。校验代码语法是否符合期望，不符合期望改如何处理。ESLint 有很多的内置规则，还可以通过插件添加更多的规则。  
要改变规则的设置，可以把规则的值设置为以下一种：

- `"off"` 或 `0` - 关闭规则
- `warn` 或 `1` - 启用并视作警告（不影响退出）
- `error` 或 `2` - 启用并视作错误（触发时退出代码为 1）

```javascript
{
    "rules": {
        "eqeqeq": "off",
        "curly": "error",
        "quotes": ["error", "double"]
    }
}
```

### 2.5 配置解析器

默认情况下，ESLint 是使用 `ESPree` 作为解析器，可以在配置文件中指定使用不一样的解析器，只要解析器满足以下要求。

1. 必须是一个可以从使用解析器的配置文件中加载的 Node 模块。
2. 必须符合解析器接口

```javascript
{
    "parser": "esprima",
    "rules": {
        "semi": "error"
    }
}
```

### 2.6 忽略文件

可以在配置中指定忽略校验哪些文件或目录

```javascript
{
    "ignorePatterns": ["temp.js", "**/vendor/*.js"],
}
```

也可以在项目的根目录下创建 `.eslintignore`文件来配置忽略
