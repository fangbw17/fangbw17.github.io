---
title: 数据类型
---

# 数据类型

javascript 中有 8 中数据类型，可以分为两大类：基本数据类型和引用数据类型。

-   七种基本数据类型：
    -   布尔值（Boolean），分别为 false 和 true。
    -   数值（Number）, 整数或浮点数，例如：42 或者 3.14。
    -   字符串（String），表示一串文本值的字符序列，如 `"hello"`。
    -   Null，一个表示 null 的特殊关键字。
    -   undefined，和 null 一样是一个关键字，undefined 表示 **变量**未赋值时的值。
    -   高精度的整数 (BigInt)，可以安全的存储和操作大整数，甚至可以超过数字的安全整数限制。
    -   符号（Symbol）（ES6 中新添加的类型）。一种唯一标识且不可改变的数据类型。
-   引用类型（Object），包括 Object、Array、Function、Map 等，对象类型存储的是引用地址（内存地址）。

## undefined

undefined 类型只有一个字面值 `"undefined"`

```javascript
let message;
console.log(message == undefined); \\ true
console.log(typeof message); // undefined
console.log(typeof age); // undefined
```

通常情况下 undefined 被用在 var 和 let 声明的变量上，或者作为对象的字段值，对于声明的变量未初始化的值，默认会隐式的赋上 undefined。对于未声明的变量使用 typeof，也会是 undefined。

## Null

Null 类型也只有一个值 null。null 值表示一个空对象指针，所以使用 typeof 会返回 `'object'`

```javascript
let car = null;
console.log(typeof car); // "object"

// 对于保存对象值的变量，最好使用 null 来初始化，不要使用其他值，便于后续判断
if (!car) {
    console.log("car doesn't init");
}
```

::: tip
undefined 值是由 null 值派生过来的，所以表面上是相等的。但是两者在用途上是完全不一样的。

```javascript
console.log(null == undefined); // true
```

:::

## JS 类型转换

-   数值转换
-   字符串转换
-   布尔值转换

### 数值转换

数值转换有 3 种方式：Number()、parseInt()和 parseFloat()。Number()是转型函数，用于任何数据类型。后两个函数主要用于将字符串转换为数值。
Number() 函数转换规则如下：

-   布尔值：true 转换为 1，false 转换为 0。
-   数值：直接返回。
-   null：转换为 0。
-   undefined：返回 NaN。
-   NaN： 返回 NaN。
-   Infinity：返回 Infinity
-   -Infinity：返回-Infinity
-   字符串：
    -   如果字符串中只包含数值字符，则转换为十进制数值，前面的+/-符号保持原样，如果是非十进制数值，则转换为十进制。
    -   如果是空字符串，则返回 0
    -   如果是其他情况，则返回 NaN

```javascript
console.log(Number(true)); // 1
console.log(Number(false)); // 0
console.log(Number(null)); // 0
console.log(Number(undefined)); // NaN
console.log(Number(NaN)); // NaN
console.log(Number(Infinity)); // Infinity
console.log(Number(-Infinity)); // -Infinity
console.log(Number("")); // 0
console.log(Number("2.3")); // 2.3
console.log(Number("0xff")); // 255
console.log(Number("11aa")); // NaN
console.log(Number("22")); // 22
console.log(Number("aa")); // NaN
```

### 字符串转换

-   null：返回’null‘。
-   undefined: 返回'undefined'。
-   Boolean: true 返回'true'，false 返回 'false'。
-   数字转换遵循通用规则，极大极小的数字使用指数形式
-   对象类型转换时同样要先转换为原始值，调用 ToPimitive 转换

```javascript
console.log(String(true)); // 1
console.log(String(false)); // 0
console.log(String(null)); // 0
console.log(String(undefined)); // NaN
console.log(String(NaN)); // NaN
console.log(String(Infinity)); // Infinity
console.log(String(-Infinity)); // -Infinity
console.log(String(0)); // 0
console.log(String(2.3)); // 2.3
console.log(String(0xff)); // 255
console.log(String({ foo: 1 })); // [object Object]
console.log(String([1, 2, [3]])); // 1,2,3
console.log(String(() => {})); // () => {}
```

### 布尔转换

除了以下几种转换为 false，其他都转为 true

-   null
-   undefined
-   ""
-   0 | +0 | -0 | NaN

```javascript
console.log(Boolean(false)); // false
console.log(Boolean(null)); // false
console.log(Boolean(undefined)); // false
console.log(Boolean(NaN)); // false
console.log(Boolean(0)); // false
console.log(Boolean(Infinity)); // true
console.log(Boolean(-Infinity)); // true
console.log(Boolean(2.3)); // true
console.log(Boolean(0xff)); // true
console.log(Boolean(true)); // true
console.log(Boolean({ foo: 1 })); // true
console.log(Boolean([1, 2, [3]])); // true
console.log(Boolean(() => {})); // true
```

### toString

Object.prototype.toString()

toString() 方法返回一个字符串。每个对象都有 toString() 方法，当对象被表示为文本值或当以期望字符串的方式表示时，该方法会自动调用。

### valueOf

Object.prototype.valueOf()

valueOf() 返回指定对象的原始值。

-   String => 返回字符串值
-   Number => 返回数字值
-   Date => 返回一个数字（时间戳）
-   Boolean => 返回 true/false
-   Object => 返回 this

### Symbol.toPrimitive

除了 valueOf 和 toString 之外，还有 Symbol.toPrimitive，优先级最高

```javascript
const aa =
    1 +
    {
        [Symbol.toPrimitive]() {
            return 2;
        },
        valueOf() {
            return 3;
        },
        toString() {
            return "4";
        },
    };
console.log(aa); // 3
```

### ToPimitive

ToPimitive 主要用于转换对象类型，基本类型的数据不需要进行转换。 该函数接收两个参数，第一个参数是要转换的对象，第二个参数是以哪种基本数据类型转换，默认会转换成 number 类型（Date 对象转换为 string）

```javascript
/**
 * @obj 需要转换的对象
 * @type 期望转换为的原始数据类型，可选
 */
ToPrimitive(obj, type);
```

#### type 说明

-   type 为 string:
    1. 先调用 obj 的 toString 方法，如果为原始值，则 return，否则进行第二步；
    2. 调用 obj 的 valueOf 方法，如果为原始值，则 return，否则抛出 Type Error 异常;
-   type 为 number：
    1. 先调用 obj 的 valueOf 方法，如果为原始值，则 return， 否则进行第二步；
    2. 调用 obj 的 toString 方法，如果为原始值，则 return，否则抛出 Type Error 异常；
-   type 参数为空：
    1. 若对象为 Date，则 type 被设置为 string；
    2. 其他对象，type 被设置为 number
