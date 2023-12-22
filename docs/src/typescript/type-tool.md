# 类型工具

TypeScript 提供了十多个内置的 `类型工具`，用来方便地处理各种类型，以及生成新的类型。

## `Awaited<Type>`

`Awaited<Type>` 返回 Promise 的返回值类型，可以多重 Promise 的返回值嵌套

```typescript
// string
type A = Awaited<Promise<string>>;

// number
type A = Awaited<Promise<Promise<number>>>;

// number | string
type A = Awaited<number | Promise<string>>;
```

当类型参数是联合类型的时候，基础类型会原样返回，最终得到就是 `number | string`

## `Partial<Type>`

`Partial<Type>` 可以将类型的所有属性设置为可选的，返回一个表示给定类型的所有子集类型

```typescript
interface Person {
    name: string;
    age: number;
}

// { name?: string|undefined, age: string|undefined }
type OptionPerson = Partial<Person>;

function updatePerson(p: Person, fields: Partial<Person>) {
    return { ...p, ...fields };
}

const p1 = {
    name: "Tom",
    age: 20,
};

const p2 = updatePerson(p1, {
    age: 22,
});

// Partial 实现
type PartialCopy<T> = {
    [P in keyof T]+?: T[p];
};
```

## `Required<Type>`

构造一个类型，其中包含设置为必需的 `Type` 的所有属性，与 `Partial` 相反。

```typescript
// Required
{
    interface Person {
        name?: string;
        age?: number;
    }

    // { name: string, age: number }
    type RequiredPerson = Required<Person>;

    const p1: Person = { name: "tom" }; // 正常
    const p2: RequiredPerson = { name: "aaron" }; // 报错，缺少 age

    // Required 实现
    type RequiredCopy<T> = {
        [P in keyof T]-?: T[P];
    };
}
```

## `Readonly<Type>`

构造一个类型，将类型参数 `Type` 中的所有属性设置为只读。

```typescript
interface Person {
    name: string;
    age: number;
}
const p1: Person = { name: "tom", age: 20 };
p1.age = 21;
console.log(p1); // { name: "tom", age: 20 }

const p2: Readonly<Person> = { name: "tom", age: 20 };
p2.age = 21; // 报错

// Readonly 实现
type ReadonlyCopy<T> = {
    +readonly [P in keyof T]: T[P];
};

const p3: ReadonlyCopy<Person> = { name: "tom", age: 20 };
p3.age = 21; // 报错
```

## `ReadonlyArray<Type>`

`ReadonlyArray<Type>` 用来生成一个只读的数组类型。

```typescript
const values: ReadonlyArray<string> = ["a", "b", "c"];
values[0] = "x"; // 报错
values.push("s"); // 报错
values.splice(1, 1); // 报错
values.pop(); // 报错

// ReadonlyArray 实现
interface ReadonlyArrayCopy<T> {
    readonly length: number;
    readonly [prop: number]: T;
}
```

## `Record<Keys, Type>`

构造一种对象类型，属性键为 `Keys`，属性值为 `Type`。适用于将一种类型的属性映射到另一种类型

```typescript
interface Person {
    name: string;
    age: number;
}

type PersonName = "tom" | "aaron";
const persons: Record<PersonName, Person> = {
    tom: { name: "Tom", age: 20 },
    aaron: { name: "Aaron", age: 21 },
};

// Record 实现
type RecordCopy<U extends string | number | symbol, T> = {
    [P in U]: T;
};
const newP: RecordCopy<PersonName, Person> = {
    tom: { name: "Tom", age: 20 },
    aaron: { name: "Aaron", age: 21 },
};
```

## `Pick<Type, Keys>`

Type 是一个对象类型，Keys 是字符串文字或字符串文字的并集。`Pick<Type, Keys>` 返回 Type 中根据 Keys 匹配到的新属性构造成一个对象返回。

```typescript
interface Point {
    x: number;
    y: number;
}

type P1 = Pick<Point, "x">; // { x: number }
type P2 = Pick<Point, "y">; // { y: number }
type P3 = Pick<Point, "x" | "y">; // { x: number, y: number }
const p: P3 = {
    x: 20,
    y: 20,
};
```

若 Keys 存在 Type 中没有的键名，那么会报错

```typescript
interface Point {
    x: number;
    y: number;
}
// 报错
type P4 = Pick<Point, "z">;

// Pick 实现
type PickCopy<T, K extends keyof T> = {
    [P in K]: T[P];
};
```

## `Omit<Type, Keys>`

与 Pick 相反，根据 Keys 删除 Type 中存在的键值对

```typescript
interface Point {
    x: number;
    y: number;
}
type P1 = Omit<Point, "x">; // { y: number }
type P2 = Omit<Point, "y">; // { x: number }
type P3 = Omit<Point, "x" | "y">; // {  }
type P4 = Omit<Point, "z">; // { x: number, y: number }

// Omit 实现
type OmitCopy<T, K extends string | number | symbol> = {
    [P in Exclude<keyof T, K>]: T[P];
};
```

## `Exclude<UnionType, ExcludedMembers>`

`Exclude<UnionType, ExcludedMembers>` 用来从联合类型 `UnionType` 里面删除某些类型 `ExcludedMembers`, 组成一个新的类型返回

```typescript
type T1 = Exclude<"a" | "b" | "c", "a">; // "b" | "c"
type T2 = Exclude<"a" | "b" | "c", "a" | "b">; // "c"
type T3 = Exclude<string | number | (() => void), Function>; // "string" | "number"
type T4 = Exclude<string | number[], any[]>; // string
type T5 = Exclude<(() => void) | null, Function>; // null
type T6 = Exclude<200 | 400, 200 | 202>; // 400
type T7 = Exclude<number, boolean>; // number

// Exclude 实现
type ExcludeCopy<T, U> = T extends U ? never : T;
```

## Extract<Type, Union>

与 Exclude 相反，根据 Union 取出 Type 中存在的键值构造新类型

```typescript
type T1 = Extract<"a" | "b" | "c", "a">; // "a"
type T2 = Extract<"a" | "b" | "c", "a" | "b">; // "a" | "b"
type T3 = Extract<"a" | "b" | "c", "a" | "f">; // "a"
type T4 = Extract<string | number | (() => void), number | Function>; // number | (() => void)
type T5 = Extract<string | number[], any[]>; // number[]
type T6 = Extract<number, boolean>; // never

// Extract 实现
type ExtractCopy<T, U> = T extends U ? T : never;
```

## `NonNullable<Type>`

去除 Type 中的 null 和 undefined

```typescript
type T1 = NonNullable<10 | undefined | null>; // 10
type T2 = NonNullable<undefined | null>; // never

// NonNullable 实现
type NonNullableCopy<T> = T & {};
// T & {} 等同于 T & Object 的交叉类型。TypeScript 的非空值都属于 Object 的子类型，所以会返回自身。而 null 和 undefined 不属于 Object，返回 never
type NonNullableCopy<T> = T extends null | undefined ? never : T;
```

## `Parameters<Type>`

从函数类型 Type 里面提取参数类型，组成元组返回

```typescript
type T1 = Parameters<() => string>; // []
type T2 = Parameters<(s: string) => void>; // [s: string]
type T3 = Parameters<<T>(arg: T) => T>; // [arg: unknown]
type T4 = Parameters<(arg: { a: number; b: string }) => void>; // [arg: { a: number, b: string }]
```

上述都是函数，若不带参数的函数形式会报错，any 和 never 例外

```typescript
type T5 = Parameters<string>; // 报错
type T6 = Parameters<Function>; // 报错

type T7 = Parameters<never>; // never
type T8 = Parameters<any>; // unknown[]
```

`Parameters<Type>` 主要用于从外部模块提供的函数类型中，获取参数类型

```typescript
interface Person {
    name: string;
    age: number;
}

interface Address {
    country: string;
    province: string;
    city: string;
}

export function getPersonInfo(p: Person, address: Address): object {
    return { ...p, ...address };
}
// Parameters 拿到 getPersonInfo 函数的入参类型
type ArgT = Parameters<typeof getPersonInfo>; // [p: Pseron, address: Address]
// ReturnType 获取返回值
type ReturnT = ReturnType<typeof getPersonInfo>; // object

// Parameters 实现
type ParametersCopy<T extends (...args: any) => any> = T extends (
    ...args: infer P
) => any
    ? P
    : never;
```

## `ConstructorParameters<Type>`

获取构造函数中所有的参数类型，组成元组返回

```typescript
// [x: string, y: number]
type A = ConstructorParameters<new (x: string, y: number) => object>;
// [x?: string | undefined]
type B = ConstructorParameters<new (x?: string) => object>;

// 返回 TypeScript 的内置构造方法的参数
// string[]
type C = ConstructorParameters<FunctionConstructor>;
// [pattern: string | RegExp, flags?: string | undefined]
type D = ConstructorParameters<RegExpConstructor>;
// [message?: string | undefined]
type E = ConstructorParameters<ErrorConstructor>;
```

如果参数类型不是构造方法，则会报错。但是有两个是例外的：`any` 和 `never`

```typescript
// 报错
type F = ConstructorParameters<string>;
type G = ConstructorParameters<undefined>;
type H = ConstructorParameters<Function>;

// unknown[]
type I = ConstructorParameters<any>;
// never
type J = ConstructorParameters<never>;

// ConstructorParameters 实现
type ConstructorParametersCopy<T extends new (...args: any) => any> =
    T extends new (...args: infer P) => any ? P : never;
```

## `ReturnType<Type>`

返回函数的返回值类型，对于重载函数，将返回最后一个签名

```typescript
type T1 = ReturnType<() => string>; // string
type T2 = ReturnType<() => void>; // void
type T3 = ReturnType<() => () => number>; // () => number
type T4 = ReturnType<<T>() => T>; // unknown
type T5 = ReturnType<<T extends U, U extends number[]>() => T>; // number[]
```

如果参数类型不是构造方法，则会报错。但是有两个是例外的：`any` 和 `never`

```typescript
type T6 = ReturnType<string>; // 报错
type T7 = ReturnType<Function>; // 报错
type T8 = ReturnType<any>; // any
type T9 = ReturnType<never>; // never

// ReturnType 实现
type ReturnTypeCopy<T extends (...args: any) => any> = T extends (
    ...args: any
) => infer R
    ? R
    : never;
```

## `InstanceType<Type>`

构造一个由 Type 中构造函数的返回值类型（实例类型），构造函数时等同于 `ReturnType<Type>`

```typescript
type T1 = InstanceType<new () => string>; // string
type T2 = InstanceType<FunctionConstructor>; // Function
type T3 = InstanceType<RegExpConstructor>; // RegExp
type T4 = InstanceType<ErrorConstructor>; // Error

class P {
    name = "Aaron";
}

type T5 = InstanceType<typeof P>; // P
// 通过 typeof P 获取 P 的构造方法，然后 InstanceType 获取实例类型，即 C
```

如果参数类型不是构造方法，则会报错。但是有两个是例外的：`any` 和 `never`

```typescript
type T6 = InstanceType<string>; // 报错
type T7 = InstanceType<Function>; // 报错
type T8 = InstanceType<any>; // any
type T9 = InstanceType<never>; // never

// ReturnType 实现
type InstanceTypeCopy<T extends abstract new (...args: any) => any> =
    T extends abstract new (...args: any) => infer R ? R : any;
```

## `ThisParameterType<Type>`

获取函数类型的 this 参数类型，如函数没有 this 参数，则提取未知。

```typescript
function toHex(this: Number) {
    return this.toString(16);
}

function numberToString(n: number) {
    return toHex.apply(n);
}

type T = ThisParameterType<typeof toHex>; // number
type T1 = ThisParameterType<typeof numberToString>; // unknown

// ThisParameterTypeCopy 实现
type ThisParameterType<T> = T extends (this: infer U, ...args: never) => any
    ? U
    : unknown;
```

## `OmitThisParameter<Type>`

从函数类型 Type 中删除 this 参数，如果没有 this，则返回 Type

```typescript
function toHex(this: Number) {
    return this.toString(16);
}

type T = OmitThisParameter<typeof toHex>; // () => string
const fiveToHex: OmitThisParameter<typeof toHex> = toHex.bind(5); // () => string
console.log(fiveToHex());

// OmitThisParameter 实现
type OmitThisParameterCopy<T> = unknown extends ThisParameterType<T>
    ? T
    : T extends (...args: infer A) => infer R
    ? (...args: A) => R
    : T;
```

## `ThisType<Type>`

`ThisType<Type>` 不返回类型，只用来跟其他类型组成交叉类型。

```typescript
type ObjectDescriptor<D, M> = {
    data?: D;
    methods?: M & ThisType<D & M>;
};

function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
    let data: object = desc.data || {};
    let methods: object = desc.methods || {};
    return { ...data, ...methods } as D & M;
}

let obj = makeObject({
    data: { x: 0, y: 0 },
    methods: {
        moveBy(dx: number, dy: number) {
            this.x += dx;
            this.y += dy;
        },
    },
});

obj.x = 10;
obj.y = 20;
obj.moveBy(5, 5);
console.log(obj); // { x: 15, y: 25, moveBy: [Function: moveBy] }

// ThisType 实现
interface ThisTypeCopy<T> {}
```

上面示例中，makeObject 参数中的 methiods 对象具有包含 `ThisType<D & M>` 的上下文类型，因此 `methods` 对象是 `{ x: number, y: number } & { moveBy(dx: number, dy: number): void }` 。

## String

TypeScript 内置了一些字符串类型工具，用来处理字符串。定义在 TypeScript 的 `.d.ts` 里。

### `Uppercase<StringType>`

将字符串类型的每个字符转为大写。

```typescript
type A = "hello";
type B = Uppercase<A>;
```

### `Lowercase<StringType>`

将字符串类型的每个字符转为小写

```typescript
type A = "HELLO";
type B = Lowercase<A>;
```

### `Capitalize<StringType>`

将字符串的第一个字符转为大写

```typescript
type A = "hello";
type B = Capitalize<A>;
```

### `Uncapitalize<StringType>`

将字符串的第一个字符转为小写

```typescript
type A = "HELLO";
type B = Uncapitalize<A>;
```
