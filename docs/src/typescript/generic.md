# 泛型

## 简介

泛型可以理解为一种抽象类型，主要是在入参类型与返回类型建立一一对应的关系。在调用时确定类型，而不是在定义时确定类型。

```typescript
{
    function getName(name: string): string {
        return name;
    }

    console.log(getName("tom"));

    function getSomething<T>(some: T): T {
        return some;
    }
    console.log(getSomething("tom"));
    console.log(getSomething(20));
}
```

上面示例中，函数名后面的 `<T>` 就是类型参数，参数要放在一对尖括号（`<>`）里面。函数调用时可以省略类型参数，Typescript 会自行推断出来类型，但是某些复杂场景还是需要明确类型参数。

```typescript
{
    function comb<T>(a: T[], b: T[]): T[] {
        return a.concat(b);
    }

    console.log(comb([1, 2], ["1", "2"])); // 报错
    console.log(comb<number | string>([1, 2], ["1", "2"])); // 正确
}
```

类型参数的命名，可以随便取，但是必须是合法的标识符。一般，类型参数采用大写字母，大多数使用 `T` （type 的第一个字母）作为类型参数的名字。如果有多个，T、U、V 等，参数之间使用逗号分隔

## 泛型的写法

泛型主要用在四个场合：函数、接口、类和别名。

### 泛型函数

```typescript
// 函数声明
function getSomething<T>(some: T): T {
    return some;
}

// 函数表达式
// 写法一
let getSomething: <T>(some: T) => T = <T>(some: T) => some;
// 写法二
let getSomething: { <T>(arg: T): T } = <T>(some: T) => some;
```

### 泛型接口

```typescript
// 写法一
interface Some<Type> {
    contents: Type;
}

let so: Some<string>;

// 写法二
interface Some {
    <Type>(so: Type): Type;
}

function print<Type>(so: Type): Type {
    return so;
}

let so: Some = print;
```

写法一定义的类型参数，在整个接口中都可以使用，写法二定义的类型参数只能在定义的方法中使用。

使用泛型接口时，需要给出类型参数的值。

```typescript
interface Sum<T> {
    add(a: T, b: T): T;
}

class A implements Sum<number> {
    add(a: number, b: number): number {
        return a + b;
    }
}

const a = new A();
console.log(a.add(1, 2));
```

### 类泛型

示例中，类型参数定义在 `Frame` 类的后面。继承泛型时，需要明确类型参数。

```typescript
class Frame<P, S> {
    point: P;
    size: S;
}

class view extends Frame<[number, number], [number, number]> {}

// 类泛型的表达式写法
const Container = class<T> {
    constructor(private readonly data: T) {}
};

const a = new Container<boolean>(true);
const b = new Container<number>(0);
```

### 类型别名泛型

type 命令定义的类型别名，也可以使用泛型

```typescript
type MyType<T> = T | undefined | null;
```

上面示例中，`MyType<T>` 是一个泛型，只要传入一个类型，就可以得到这个类型与 `undefined` 和 `null` 的一个联合类型。

```typescript
type MyMap<T> = { value: T };

const a: MyMap<number> = { value: 0 };
const b: MyMap<string> = { value: "b" };
type MyTree<T> = {
    value: T;
    left: MyTree<T> | null;
    right: MyTree<T> | null;
};
```

### 类型参数的默认值

类型参数是可以设置默认值的。

```typescript
function getFirst<T = string>(arr: T[]): T {
    return arr[0];
}

getFirst<number>([1, 2, 3]); // 正确
getFirst([1, 2, 3]); // 正确
getFirst(["1", "2", "3"]); //正确
```

上面调用时省略类型参数时，Typescript 会认为 `T` 等于 `string`，但是，因为 Typescript 会从实际参数推断出 `T` 的值，从而覆盖掉默认值。

类型参数的默认值，往往用在类中。

```typescript
class Generic<T = string> {
    list: T[] = [];

    add(t: T) {
        this.list.push(t);
    }
}

const g1 = new Generic();
g1.add(1); // 报错
g1.add("he"); // 正确

const g2 = new Generic<number>();
g2.add(2); // 正确
g2.add("he"); // 错误
```

上面示例中，示例 `g1` 未指定参数类型，则使用默认的参数类型 `string`，故 `g1.add(1)` 报错。而在 `g2` 中指定了参数类型，所以结果相反。

::: tip
类型参数的默认值等同于是可选参数。多个类型参数时，有默认值的类型参数（可选参数）必须在必选参数之后

```typescript
// 错误
function getPersonInfo<T = number, U>() {}

// 正确
function getPersonInfo<T, U = number>() {}
```

:::

### 数组泛型

```typescript
let arr: Array<number> = [1, 2, 3];
let arr1: number[] = [1, 2, 3];
```

在 TypeScript 内部， `Array` 是一个泛型接口。

```typescript
interface Array<Type> {
    length: number;

    pop(): Type | undefined;

    push(...items: Type[]): number;

    // ...
}
```

### 类型参数的约束

```typescript
function compare<T>(a: T, b: T) {
    if (a.length > b.length) {
        return a;
    }

    return b;
}
```

像上面示例中，直接访问 `length` 属性就会报错，因为声明函数中不确定泛型 `T` 是否有 `length` 属性。如果不满足这个条件，是会报错的。

```typescript
function comp<T extends { length: number }>(a: T, b: T): T {
    if (a.length > b.length) {
        return a;
    }
    return b;
}

comp([1, 2], [2, 3]); // 正确
comp(["1"], ["23", "4"]); // 正确
comp(1, [2, 2]); // 报错
```

上面示例中， `T extends { length: number }` 就是约束条件，表示类型参数 T 必须满足 `{ length: number }`，否则就会报错。

::: tip
泛型有一些使用注意点。

(1) 尽量少用泛型，泛型虽然灵活，但是会加大代码的复杂性，使其变得难读。

(2) 类型参数越少越好

(3) 类型参数需要出现两次

```typescript
function greet<str extends string>(s: str) {
    console.log("hello " + s);
}

function greet(s: string) {
    console.log("hello " + s);
}
```

(4) 泛型可以嵌套
类型参数可以是另一个泛型

```typescript
type MyType<T> = T | null;
type MyTree<T> = T | undefined;
type Tree<T> = MyType<MyTree<T>>;
```

:::
