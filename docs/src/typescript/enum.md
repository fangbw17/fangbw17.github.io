# 枚举（Enum）

## 简介

实际开发场景中，经常需要定义一些常量

```typescript
const MALE = 1;
const FEMALE = 2;
const OTHER = 3;

enum Gender {
    Male = 1, // 1
    Female, // 2
    Other, // 3
}
```

像上面示例中，可以将常量定义在一个枚举中。Typescript 设计了 Enum 结构，用来将相关常量放在一个容器中，方便使用。

使用 Enum 的某个成员，可以像调用属性一样的写法。

```typescript
enum Gender {
    Male = 1, // 1
    Female, // 2
    Other, // 3
}

// 方式一
const g1 = Gender.Male;
// 方式二
const g2 = Gender["Male"];

const g3: Gender = Gender.Male;
const g4: number = Gender.Male;
```

Enum 本身也是一种类型。比如，上例中，变量 g3 和 g4 可以是 Gender，也可以是 `number`。

::: tip
Typescript 中 Enum 编译成 Javascript 之后本质上是一个对象属性，所以在使用时需要谨慎，避免重名等。
:::

```typescript
enum Gender {
    Male,
    Female,
    Other,
}

const Sex = {
    Male: 0,
    Female: 1,
    Other: 2,
} as const;

const x: Gender = 1;
if (x === Gender.Female) {
}
if (x === Sex.Female) {
}
```

上面示例中，由于对象 `Sex` 使用了 `as const` 断言，作用就是使其属性无法修改。这样 `Sex` 和 `Gender` 的行为就很类似了，所以完全可以使用 `Sex` 替代 `Gender`。

## Enum 成员的值

枚举中成员的值默认是从 0 开始依次递增的。

```typescript
enum Gender {
    Male, // 0
    Female, // 1
}
```

也可以显示的赋值。

-   成员的值可以是任意数值，但是不能是大整数（Bigint）
-   只设定一个成员的值，后续成员依次递增
-   成员值可以是计算式

```typescript
enum Gender {
    Male = 10,
    Female = 0.5,
    Other = 1n, // 报错
}

enum Gender {
    Male, // 0
    Female = 3, // 3
    Other, // 4
}

enum Gender {
    Male = 1 << 8,
    Female = Math.random(),
}
```

枚举的成员值是只读的，所以通常为了更加醒目，会在 `enum` 关键字前面添加 `const` 修饰，表示是常量，无法再重新赋值

```typescript
const enum Gender {
    Male = 10,
    Female = 0.5,
}

const x = Gender.Male;
const y = Gender.Female;

// 编译后
const x = 10; /* Gender.Male */
const y = 0.5; /* Gender.Female */
```

上面这种方式，由于添加了 `const` 修饰，所以 `enum` 编译成 javascript 后并没有生成对应的对象，而是把所有 Enum 成员出现的场合，替换成对应的常量。
如果希望编译后仍然是对象，那么可以在编译时打开 `preserveConstEnums` 编译选项

## 同名 Enum

多个同名的枚举是可以合并成为一个的，但是只能第一个声明的枚举中成员省略值

```typescript
enum Gender {
    Male,
}
enum Gender {
    Female = 1,
}
// 等同于
enum Gender {
    Male,
    Female = 1,
}
```

上面示例中，`Gender` 会合并成为一个。

::: tip
需要注意的几点

-   只能第一个声明的枚举中成员值省略， 后面是不能省略的。

```typescript
// 省略值
enum Gender {
    Male,
}
enum Gender {
    Female, // 报错
}
```

-   同名枚举的成员名不能相同

```typescript
enum Gender {
    Male,
}

enum Gender {
    Male = 1, // 报错
}
```

-   `const enum` 和 `enum` 不能混合使用

```typescript
// 正确
enum Gender {
    Male,
}
enum Gender {
    Female,
}

// 正确
const enum Gender {
    Male,
}
const enum Gender {
    Female,
}

// 错误
enum Gender {
    Male,
}
const enum Gender {
    Female,
}
```

:::
同名 Enum 的合并，最大用处就是补充外部定义的 Enum 结构。

## 字符串 Enum

枚举成员除了可以设置为数值，还能设置为字符串。

```typescript
enum Gender {
    Male = "Male",
    Female = "Female",
    Other = "Other",
}
```

字符串枚举要求成员必须显示的赋值，如果没有设置，默认为数值（也就是说枚举中数值和字符串是可以混用的），**但是在成员的值类型是字符串之后，后面的成员如果不显示设置类型则会报错。**

```typescript
enum Gender {
    Male, // 0
    Female = "Female",
    Other, // 报错
}
```

## keyof 运算符

keyof 运算符可以取出 Enum 结构的所有成员名，作为联合类型返回。

```typescript
enum MyEnum {
    A = "a",
    B = "b",
}

// 'A'|'B'
type Foo = keyof typeof MyEnum;
const a: Foo = "A";
const c: Foo = "C"; // 报错
```

`keyof typeof MyEnum` 可以取出 `MyEnum` 的所有成员名，所以类型 `Foo` 等同于联合类型 `'A'|'B'`。
::: tip
如果省略了 `typeof` 那么 `keyof MyEnum` 相当于 `keyof string`

```typescript
enum MyEnum {
    A = "a",
    B = "b",
}
const Foo = keyof MyEnum
const a: Foo = 'A'
//  const a: number | typeof Symbol.iterator | "toString" | "charAt" | "charCodeAt" | "concat" | "indexOf" | "lastIndexOf" | "localeCompare" | "match" | "replace" | "search" | "slice" | ... 36 more ... | "at"
```

类型 `Foo` 相当于类型 `string` 的所有原生属性名组成的联合类型。
因为 Enum 作为 TS 中的类型，本质上属于 `number` 或 `string` 的一种变体，而 `typeof MyEnum` 会将 `MyEnum` 当作一个值处理，从而先转为对象类型，就可以再用 `keyof` 运算符返回该对象的所有属性名。
如果要返回 Enum 所有的成员值，可以使用 `in` 运算符。

```typescript
enum MyEnum {
    A = "a",
    B = "b",
}

// { a: any, b: any }
type Foo = { [key in MyEnum]: any };
const a: Foo = { a: "a", b: 2 };
```

:::

## 反向映射

反向映射是指 Enum 中可以通过成员值获取成员名

```typescript
enum Gender {
    Male = 1, // 1
    Female, // 2
    Other, // 3
}
console.log(Gender[2]); // Female
```

上面示例中，Gender.Female 的值等于 3，从而可以从值 3 取到对应的成员名 `Female`, 这就是反向映射。
之所以能反射，是因为上面的代码会编译成下面 JS 代码。

```javascript
let Gender;
(function (Gender) {
    Gender[(Gender["Male"] = 1)] = "Male";
    Gender[(Gender["Female"] = 2)] = "Female";
    Gender[(Gender["Other"] = 3)] = "Other";
})(Gender || (Gender = {}));
console.log(Gender[2]);
```

上面代码中，实际进行了 2 次赋值。

```javascript
Gender[(Gender["Male"] = 1)] = "Male";

// 等同于
Gender["Male"] = 1;
Gender[1] = "Male";
```

::: tip
这种情况是只会发生在数值枚举中的，字符串枚举是不存在的，因为字符串只有 1 次赋值

```javascript
let Gender;
(function (Gender) {
    Gender["Male"] = "Male";
    Gender["Female"] = "Female";
    Gender["Other"] = "Other";
})(Gender || (Gender = {}));
```

:::
