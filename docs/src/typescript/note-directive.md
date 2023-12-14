# 注释指令

TypeScript 支持注释指令。注释指令指的是采用 JavaScript 双斜杠注释的形式，向编译器发出的命令。

## // @ts-nocheck

`// @ts-nocheck` 告诉编译器不对当前脚本进行类型检查，可以用于 TS 和 JS

```typescript
// @ts-nocheck
const a: string = "123";
const b = a;
```

## // @ts-check

与 @ts-nocheck 相反，对当前脚本进行类型检查。

```typescript
// @ts-check
const a: string = "123";
const b: number = a; // 报错
```

## // @ts-ignore

取消下一行代码的类型检查

```typescript
const a: string = "123";
// @ts-ignore
const b: number = a;
```

## // @ts-expect-error

当下一行有类型错误时，不处理，留给用户处理，主要用于测试用例。

```typescript
function fn(foo: string, bar: string) {
    function deal(arg: boolean) {}

    deal(typeof foo === "string");
    deal(typeof bar === "string");
    // do something
}

// @ts-expect-error
fn(123, 456);
```

上面调用 `fn` 传入数值类型，与参数类型不一致会报错，但是设置了 `@ts-expect-error`，则可以在 `fn` 内部处理。

如果下一行没有类型错误，// @ts-expect-error 则会显示一行提示

```typescript
const a = "123";
// @ts-expect-error
const b: string = a;
// 打印 Unused '@ts-expect-error' directive
```

## JSDoc

TypeScript 直接处理 JavaScript 文件时，若无法推断类型，会使用 JavaScript 里的 JSDoc 注释。

```javascript
/**
 */
function fn(str) {
    console.log(str);
}
```

### @typedef

@typedef 命令创建自定义类型

```javascript
/**
 * @typedef {(number | string)} T
 */
```

等同于 TypeScript 中的类型别名

```typescript
type T = number | string;
```

### @type

定义变量的类型

```javascript
/**
 * @type (string)
 */
let a;
// 将变量 a 定义为 string
```

### @param

定义函数参数的类型

```javascript
/**
 * @param { string } arg
 * @param { string } [str]
 */
function fn(arg, str) {}
// 可选参数 str 放在 方括号[]中
```

### @return/@returns

定义函数返回值的类型

```javascript
/**
 * @param { string } arg
 * @param { string } [str]
 * @return/@returns { number }
 */
function fn(arg, str) {
    return 0;
}
```

### @extends

用于定义继承的基类

```javascript
/**
 * @extends (Base)
 */
class Person extends Base {}
```

### @public/@protected/@private/@readonly

定义类的成员权限（公开、保护、私有、只读）

```typescript
class Base {
    /**
     * @public
     * @readonly
     */
    x = 0;

    /**
     *  @protected
     */
    y = 0;
}
```
