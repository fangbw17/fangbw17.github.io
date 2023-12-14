# 类型映射

映射指的是将一种类型按照映射规则，转换成另一种类型。

```typescript
{
    type T = {
        foo: string;
        bar: string;
    };

    type U = {
        foo: string;
        bar: string;
    };

    type Z = {
        [prop in keyof T]: string;
    };
}
```

上面 `Z` 通过 `[prop in keyof T]` 来获取 `T` 中的所有属性名，将所有属性的类型设置为 `string`

将属性改成可选属性

```typescript
type A = {
    a: string;
    b: number;
};

type B = {
    [prop in keyof A]?: A[prop];
};
```

## 映射修饰符

```typescript
type T = {
    foo?: string;
    readonly bar: string;
};

type B = {
    [prop in keyof T]: T[prop];
};
```

如何将上面示例的可选和只读去掉呢？TypeScript 提供了 2 个映射修饰符：`+` 和 `-`。

```typescript
type T = {
    foo?: string;
    readonly bar: string;
};

type B = {
    -readonly [prop in keyof T]-?: T[prop];
};
```

通过设置 `-readonly` 和 `-?` 将只读和可选去掉。而 `+readonly` 和 `+?` 是可以将只读和可选添加上。

## 键名重映射

### 语法

TypeScript 4.1 引入了键名重映射，允许改变键名。

```typescript
type T = {
    foo: number;
    bar: number;
};

type B = {
    [p in keyof A as `${p}ID`]: number;
};

// 等同于
type BB = {
    fooID: number;
    barID: number;
};
```

示例中通过键名重映射后 `BB` 中每一个属性名都添加了 `ID`。使用的语法就是 `as + ${prop}xxx`

### 属性过滤

```typescript
type Person = {
    name: string;
    age: number;
    gender: boolean;
};

type NewPerson = {
    [prop in keyof Person as Person[prop] extends boolean
        ? never
        : prop]: Person[prop];
};
```

`as Person[prop] extends boolean ? never : prop` 使用了 extends 三目运算，如果属性的类型是布尔值则改为 `never`，即这个属性名不存在。

### 联合类型的映射

```typescript
type S = {
    kind: "square";
    x: number;
    y: number;
};

type C = {
    kind: "circle";
    radius: number;
};

type MyEvents<Events extends { kind: string }> = {
    [E in Events as E["kind"]]: (event: E) => void;
};

type Config = MyEvents<S | C>;
// 等同于
type Config = {
    square: (event: S) => void;
    circle: (event: C) => void;
};
```
