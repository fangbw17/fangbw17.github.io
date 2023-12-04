# 类型断言

未明确声明的变量类型，TypeScript 会进行类型推断，然而未必会是准确的。

```typescript
type T = "a" | "b" | "c";
let foo = "a"; // string 类型

let bar: T = foo; // 报错
```

`foo` 的类型是 `string`，而 `bar` 是 `'a'|'b'|'c'`，前者应该是后者的父类型，父类型无法赋值给子类型。
**类型断言** 在 TypeScript 中是允许开发者明确的指出变量是什么类型。一旦指定了类型，那么 TypeScript 就不会再对该变量进行类型推断。将类型的校验交给开发者来维护管理。

```typescript
type T = "a" | "b" | "c";
let foo = "a"; // string 类型

let bar: T = foo as T; // 正确
```

类型断言有两种语法

```typescript
// 语法一: <类型>值
<Type>value;
// 语法二： 值 as 类型
value as Type;

{
    type T = "a" | "b";
    let foo = "a";
    let bar1: T = <T>foo;
    let bar2: T = foo as T;
}
```

上面是两种类型断言的语法，语法一是因为跟 JSX 语法冲突，使用时必须关闭 TypeScript 的 React 支持，否则会无法识别。所以一般使用语法二。

## 类型断言的使用条件

类型断言并不是可以任意使用的。

```typescript
const n = 1;
const m: string = n as string; // 报错
```

变量 `n` 是数值类型，使用类型断言转化成字符串类型时，TypeScript 会报错。
`value as Type`（类型断言）必须满足 `value` 是 `Type` 的子类型，或者 `Type` 是 `value` 的子类型。类型断言要求实际的类型与断言的类型兼容（集合关系），可以是一个父集，也可以是一个子集。但是不能是一个完全无关的类型。

::: tip
如果非要进行完全无关的类型断言，可以先进行 unknown 或 any 转换，再转换想要的类型。因为 unknown 或 any 是包含所有子集。

```typescript
const n = 1;
const m1: string = n as unknown as string; // 正确
const m2: string = n as any as string; // 正确
```

:::

## as const

```typescript
let l1 = "JavaScript";

const l2 = "JavaScript";

type Lang = "JavaScript" | "Typescript";
function toast(s: Lang) {}
toast(l1); // 报错
toast(l2); // 正确
```

上面示例中，`l1` 和 `l2` 的值都是 **JavaScript**， 但是 `toast(l1)` 报错了。因为 `let` 声明的变量在 Typescript 中默认推断为 字符串类型（string），而 const 被推断为 字符常量，即 `l1` 是 `l2` 的父集，在 `toast` 方法中参数类型限定为了 **字符的联合类型**，那么 `l1` 此时就会报错。
有两种解决方式

-   将 `let` 改成 `const`
-   添加 `as const`, 将字符串类型改成值类型

```typescript
let l1 = "JavaScript"; // 错误
const l1 = "JavaScript"; // 正确
let l1 = "JavaScript" as const; // 正确

const l2 = "JavaScript";

type Lang = "JavaScript" | "Typescript";
function toast(s: Lang) {}
toast(l1);
toast(l2);
```

::: tip

-   使用了 `as const` 断言之后，不能再改变值了。

```typescript
let l1 = "JavaScript" as const;
l1 = "Typescript"; // 报错
```

-   `as const` 只能用于字面量，不能用于变量、表达式

```typescript
let l1 = "JavaScript";
let l2 = l1 as const; // 报错
let l3 = (l1 + "test") as const; // 报错
```

`as const` 相当于是将变量的类型范围缩小了，变成了不可变的类型。
:::

## 非空断言

对于部分变量可能存在空值的情况（`undefined` 或 `null`），TypeScript 提供了非空断言，即确保这些变量不为空的情况下添加 `!`。

```typescript
const root = document.getElementById("app");
root.addEventListener("click", () => {}); // 报错
```

`getElementById` 方法可能会返回 null，所以变量 `root` 可能没有值。

```typescript
const root = document.getElementById("app")!;
root!.addEventListener("click", () => {});
```

可以在赋值阶段直接添加`!`，那么 root 的类型就不会是 null。也可以在使用阶段使用 `!`，此时 root 的类型还是存在 null。

::: tip
非空断言必须开发者确保是有值的情况下使用，否则容易在运行时报错。比较保险的方式还是手动检查是否为空

```typescript
const root = document.getElementById("app");
if (root !== null) {
    root.addEventListener("click", () => {});
}
```

:::
非空断言还可以在类的属性中使用（属性初始化）。

```typescript
class Person {
    name: string; // 报错
    age!: number; // 正常
}
```

name 会报错，因为没有初始化，而 `age` 使用了非空断言，明确告知 TypeScript 后续会有值。所以 TypeScript 就不校验了。**必须开始了编译选项 `strictNullChecks` 时才会进行初始化是否赋值的校验，否则 `name` 未赋值 TypeScript 也不会报错**

## 断言函数

断言函数是一种特殊的函数，用于保证函数参数是否符合预期要求，如果不符合则抛出错误，终止程序。反之不进行任何操作，程序继续执行

### 断言函数普通写法

```typescript
const a: string | number = 10;

function calc(s: string | number): number {
    isNumber(s);
    const b = 2;
    return (a as number) + b;
}

function isNumber(value: unknown): void {
    if (typeof value !== "number") throw new Error("value is not a number");
}
calc(a);
```

上面示例中 `isNumber` 方法用于判断入参是否是数值类型。如果不是数值类型则抛出异常。上面这种写法无法很直观的通过入参和返回值分辨出 `isNumber` 是一个断言函数。

### 断言函数标准写法

在 TypeScript 3.7 中引入了新的类型写法。

```typescript
const a: string | number = 10;

function calc(s: string | number): number {
    isNumber(s);
    const b = 2;
    return (a as number) + b;
}

function isNumber(value: unknown): asserts value is number {
    if (typeof value !== "number") throw new Error("value is not a number");
}
calc(a);
```

`asserts value is number` 描述了入参 `value` 是否是数值，其中 `asserts` 和 `is` 是关键字，`value` 是参数名，`number` 是预期的类型。
::: tip
`asserts value is number` 是不足以判断参数是哪种类型的。即具体的实现还需要在内部检查。

若上述的 `if (typeof value !== "number")` 改成 `if (typeof value !== "string")`， 那么哪怕 `asserts value is number`，只要 if 判断满足，那么整个断言函数仍然是通过的。
:::

### 断言函数的简写形式

如果要断言某个参数一定为真（不等于 `false`、`undefined` 和 `null`）。可以使用简写形式

```typescript
function haveValue(arg: unknown): asserts arg {}
```

`asserts arg` 表示参数 `arg` 一定为真（`true`）。同样的，参数为真的校验需要开发者自己实现。

```typescript
function haveValue(arg: unknown): asserts arg {
    if (!arg) {
        throw new Error("arg must be a valid value");
    }
}
```

### 断言函数参数非空

如果要断言参数非空，可以使用类型 `NonNullable`

```typescript
function assertsNoNull<T>(value: T): asserts value is NonNullable<T> {
    if (value !== undefined || value !== null) {
        throw new Error("value is not defined");
    }
}
```

### 断言函数表达式

```typescript
// 写法一
const isString = (arg: unknown): asserts arg is string => {
    if (typeof arg !== "string") {
        throw new Error("value is not a string");
    }
};
// 写法二
type AssertsIsString = (arg: unknown) => asserts arg is string;
const isString: AssertsIsString = (arg) => {
    if (typeof arg !== "string") {
        throw new Error("value is not a string");
    }
};
```
