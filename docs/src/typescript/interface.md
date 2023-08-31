# interface

## 简介

interface 是对象的模板，是一种类型或方法的集合。

```typescript
interface Person {
    firstName: string;
    lastName: string;
    age: number;
}
const p1: Person = {
    firstName: "Aaron",
    lastName: "Hanks",
    age: 20,
};
type P = Person["age"]; // number
```

上面示例中，可以通过方括号取出某个属性的类型。 `Person['age']` 返回 `age` 的类型，即 `string`

interface 有 5 中形式来描述内部结构

-   对象属性
-   对象的属性索引
-   对象方法
-   函数
-   构造函数

### 对象属性

```typescript
// 属性
interface MyProperty {
    name: string;
    address?: string;
    readonly gender: number;
}
```

上面示例中, 定义了三个属性：`name`、`address` 和 `gender`，通常书写形式都是在属性名后使用冒号，属性之间可以使用分号或者逗号分割，最后一个属性的分号或逗号可以省略。

其中 `name` 是可读写的属性，而 `address` 是可选的属性（存在或不存在），在属性名后添加一个问号, 而 `gender` 是只读的，使用 `readonly` 修饰符。

### 属性索引

```typescript
interface MyPropertyIndex {
    [prop: string]: string;
}
```

属性索引中，属性名的类型有三种：`string`、`number` 和 `symbol` 三种类型.
一个接口中，最多只能定义一个字符串索引。字符串索引会约束所有属性名为字符串的属性

```typescript
interface MyPropertyIndex {
    name: number; // 报错
    [prop: string]: string;
}
```

上面示例中，属性索引指定了所有名称为字符串的属性，它们的属性值必须是 `string`，属性 `name` 的值类型是 `number`，就会报错。

在 interface 中同时定义字符串索引和数值索引，那么数值索引的优先级低于字符串索引，即字符串索引才会生效。因为在 `js` 中，数值属性名最终都是自动转成字符串属性名

```typescript
interface MyPropertyIndex {
    [prop: number]: number; // 报错
    [prop: string]: string;
}
```

上面示例中，数值索引的属性值类型与字符串索引不一致，会报错。

### 对象的方法

对象写法如下：

```typescript
interface MyPropertyObj {
    f(x: boolean): string;
    f: (x: boolean) => string;
    f: { (x: boolean): string };
}
```

### 类型方法重载

```typescript
interface MyFuncOverride {
    f(): number;
    f(x: boolean): string;
    f(x: number, y: number): number;
}
```

上面示例中方法重载没有给出具体的实现，定义方法时无法使用重载的语法。所以在使用该接口声明变量时，只能在外部实现。

```typescript
function func(): number;
function func(x: boolean): string;
function func(x: number, y: number): number;
function func(x?: boolean | number, y?: number): string | number {
    const defaultValue = 1;
    if (x === undefined && y === undefined) {
        return defaultValue;
    }
    if (typeof x === "boolean" && y === undefined) return "1";
    if (typeof x === "number" && typeof y === "number") return 2;
    throw new Error("wrong parameters");
}

const fn: MyFuncOverride = {
    f: func,
};
```

### 函数

```typescript
interface MyPropertyFunc {
    (x: number, y: number): number;
}
const myFunc: MyPropertyFunc = (x, y) => x + y;
```

### 构造函数

```typescript
interface MyPropertyConstructor {
    new (name: string): void;
}
```

## interface 继承

interface 可以继承其他类型。使用关键字 `extends` 继承

### 继承 interface

```typescript
interface Car {
    brand: string;
}

interface People {
    staff: number;
}

interface Ford extends Car, People {
    country: string;
}

const f: Ford = {
    country: "USA",
    brand: "ford",
    staff: 100000,
};
```

`Ford` 继承了 `Car` 和 `People`，从而获得了 `brand` 和 `staff` 属性

```typescript
interface Foo {
    id: string;
}
// 报错
interface Bar extends Foo {
    id: number;
}
```

继承时子接口存在同名属性，那么子接口会覆盖父接口的属性。
但是当子接口的属性值类型与父接口不同时，会报错

### 继承 type

```typescript
type Country = {
    name: string;
    capital: string;
};

// 正确
interface CountryWithPop extends Country {
    population: number;
}

type MyNumber = number;
// 报错
interface Contry extends MyNumber {}
```

继承 `type` 时，只能是对象。如果 `type` 不是对象，那么 `interface` 是无法继承的。

### 继承 class

```typescript
class Point {
    x: number = 0;
    y: number = 0;
    isInPoint(): boolean {
        return false;
    }
}
class Size {
    width: number = 100;
    height: number = 100;
    getWidth(): number {
        return this.width;
    }
}

interface Rect extends Point, Size {
    isInRect(): boolean;
}

const rect: Rect = {
    x: 10,
    y: 20,
    height: 100,
    width: 100,
    isInPoint() {
        return false;
    },
    isInRect() {
        return true;
    },
    getWidth() {
        return this.width;
    },
};
```

上面示例中 `Rect` 继承了 `Point` 和 `Size`。变量 `rect` 就拥有了所有的属性和方法

## interface 合并

多个同名接口合并成一个接口

```typescript
interface Box {
    width: number;
    height: number;
}

interface Box {
    length: number;
}
const b: Box = {
    width: 10,
    height: 10,
    length: 5,
};
```

上面示例中变量 `b` 同时拥有了三个属性，这样设计主要是为了兼容 `js` 的行为。在 `js` 中尝尝会对某个对象添加额外的属性或方法。比如 `window` 下会挂载很多自定义的属性和方法。但是在 `ts` 中直接添加的话会编译报错。解决方法就是**_合并 `interface`_**。

接口合并时，同一个属性如果有多个声明，不能类型冲突

```typescript
interface Person {
    age: number;
}

interface Person {
    // 报错
    age: string;
}
```

后续声明的属性必须与之前声明的类型保持一致。

合并接口时，存在着同名方法不同类型声明，会发生函数重载。并且，后面定义的比前面定义的优先级高

```typescript
interface People {
    print(p: string): string;
}
interface People {
    print(p: number): number;
}
interface People {
    print(p: boolean): boolean;
}

// 等同于
interface People {
    print(p: boolean): boolean;
    print(p: number): number;
    print(p: string): string;
}
```

上面示例中 `People` 中 `print` 有不同的类型声明，会产生方法重载。越靠前的定义，优先级越低，排在越后面。比如 `print(p: number): number` 最先定义，就排在最后，会最后进行匹配。
这个规则有一些例外，就是同名方法中，参数如果是字面量，那么字面量的类型优先级更高。

```typescript
interface People {
    print(p: "string"): string;
}
interface People {
    print(p: number): number;
}
interface People {
    print(p: "string"): string;
    print(p: number): number;
}
```

如果声明的变量是一个联合类型，且存在着同名属性，那么属性的类型也是联合类型

```typescript
interface Circle {
    area: bigint;
}

interface Rectangle {
    area: number;
}

// bigint | number
const s: Circle | Rectangle = {
    area: 123,
};
```

## interface 和 type 的区别

`interface` 和 `type` 的作用类似，都可以表示对象类型。
在声明对象类型时既可以使用 `interface`，也可以用 `type`。两者相似之处是都可以声明对象结构

```typescript
type Person = {
    name: string;
    age: number;
};
interface Person {
    name: string;
    age: number;
}
```

1. `type` 能表示非对象类型，而 `interface` 只能表示对象类型（包括数组、函数等）

2. `interface` 可以继承其他类型，`type` 不支持继承。
   如果想让 `type` 支持添加属性的效果。可是使用 `&` 运算符

```typescript
type Animal = {
    name: string;
};
type Bear = Animal & {
    honey: boolean;
};
```

3. `type` 不能合并，而 `interface` 可以

```typescript
interface Person {
    name: string;
}
interface Person {
    age: number;
}
// 报错
type Person = { name: string };
type Person = { age: number };
```

4. `interface` 不能包含属性映射，`type` 可以。

```typescript
interface Point {
    x: number
    y: number
  }

  type PointC1 = {
    [Key in keyof Point]: Point[Key]
  }
  interface PointC2 {
    // 报错
    [Key in keyof Point]: Point[Key]
  }
```

5. `this` 关键字只能用于 `interface`

```typescript
interface Foo {
    add(num: number): this;
}

type Foo = {
    add(num: number): this;
};
```

6. `interface` 无法表达某些复杂类型（交叉类型和联合类型），但是 `type` 可以。

```typescript
type A = {};
type B = {};

type C = A | B;
type D = C & {
    name: string;
};
```
如果需要复杂的类型运算，那么最好使用 `type`。一般情况，`interface` 更灵活，便于扩充类型和自动合并。
