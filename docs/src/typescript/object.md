# 对象

```typescript
const obj: {
    x: number;
    y: number;
} = { x: 1, y: 1 };

const obj1 = { x: 1, y: 1 };
```

上面示例中，对象 `obj` 的类型写在变量名后面，使用大括号描述，内部声明属性名和类型。也可以省略类型，`ts` 会推断出类型

```typescript
const obj: {
    x: number;
    y: number;
} = { x: 1, y: 1 };

const obj1: {
    x: number;
    y: number;
} = { x: 1, y: 1 };
```

属性可以用分号或者逗号结尾。
最后一个属性后面，可以写分号或逗号，也可以不写。

对象声明了属性类型和数量后，赋值时不能缺少或多余指定属性，也不能改变类型。

```typescript
type MyObj = {
    x: number;
    y: number;
};

const obj1: MyObj = { x: 1 }; // 报错
const obj2: MyObj = { x: 1, y: 1, z: 1 }; // 报错
const obj3: MyObj = { x: 1, y: "2" }; // 报错
```

上面示例 变量 `obj1` 缺少了属性 `y`，变量 `obj2` 多出了属性 `z`，都会报错。变量 `obj3` 的属性 `y` 类型赋值为字符串

类型声明中存在的属性不能删除，修改值可以

```typescript
const myUser = {
    name: "Sabrina",
};

delete myUser.name; // 报错
myUser.name = "CCC"; // 正确
```

对象的方法使用函数类型描述

```typescript
const obj: {
    x: number;
    y: number;
    add(x: number, y: number): number;
} = {
    x: 1,
    y: 1,
    add(x, y) {
        return x + y;
    },
};
```

对象类型可以使用方括号读取属性的类型。

```typescript
type User = {
    name: string;
    age: number;
};
type Name = User["name"]; // string
```

## 可选属性

在对象中声明的属性如果是可选的，则需要在变量名后添加 `?`

```typescript
const obj: {
    x: number;
    y?: number;
} = { x: 1 };
```

上面示例中，属性 `y` 是可选的。
可选属性等同于允许赋值为 `undefined`，下面两种写法等同有效

```typescript
type User = {
    firstName: string;
    lastName?: string;
};

type User = {
    firstName: string;
    lastName?: string | undefined;
};
```

`ts` 提供编译设置 `ExactOptionalPropertyTypes` 和 `strictNullChecks`，同时打开这两个设置，可选属性就不能设置为 `undefined`。

```typescript
type User = {
    firstName: string;
    lastName?: string;
};

type User = {
    firstName: string;
    lastName?: string | undefined;
};

// 打开 ExactOptionalPropertyTypes 和 strictNullChecks
const obj: User = { firstName: "1", lastName: undefined }; // 报错
```

::: warning

```typescript
const obj: { x: number; y?: number } = { x: 1 };
const obj1: { x: number; y: number | undefined } = { x: 1 };
这两种写法不等效，`obj1` 中属性 `y` 不能省略
```

:::

## 只读属性

属性名前面加上 `readonly` 关键字，表示属性只读

```typescript
interface MyInterface {
    readonly age: number;
}

const person: MyInterface = { age: 20 };
person.age = 33; // 报错
```

声明的基本数据类型的变量前使用 `readonly` 不可更改变量的值。
声明的引用数据类型的变量前使用 `readonly` 不可更改变量本身，但是可以更改引用类型内部的属性值

```typescript
const tom: Person = {
    name: "tome",
    age: 29,
    initAddress: {
        province: "hubei",
        city: "wuhan",
        detail: "xxx",
    },
};
tom.initAddress.province = "beijing"; // 可以修改
tom.initAddress = {
    // 报错
    province: "beijing",
    city: "beijing",
    detail: "xxx",
};
```

::: warning

```typescript
interface Person {
    name: string;
    age: number;
}

interface ReadonlyPerson {
    readonly name: string;
    readonly age: number;
}

let p1: Person = {
    name: "tom",
    age: 30,
};
let p2: ReadonlyPerson = p1;

p1.age = 40;
console.log(p2.age); // 40
```

需要注意的是，如果一个只读类型的变量引用了另外一个读写的对象，当可写变量修改属性值时，只读变量也会同步修改

:::

只读声明方式除了使用 `readonly` 关键字，还可以使用只读断言 `as const`

```typescript
const tom = {
    name: "tom",
} as const;
tom.name = "tomm"; // 报错
```

`as const` 属于 `ts` 的类型推断，如果变量名明确的指定了读写，那么优先级是高于 `ts` 的类型推断的。

```typescript
const tom: { name: string } = {
    name: "tom",
} as const;

tom.name = "tomm";
```

## 属性名的索引类型

若对象的数据过多，逐个声明类型会显得很繁琐。某些情况下也不确定对象内部有多少属性，如外部 API 返回的对象，此时 `ts` 允许采用属性名表达式的写法来描述类型，称为"属性名的索引类型"

```typescript
type MyObj = {
    [property: string]: string;
};
const obj: MyObj = {
    foo: "a",
    bar: "b",
    baz: "c",
};
```

上面示例中，类型 `MyObj` 的属性名类型就采用了表达式形式，方括号中的 `property` 表示属性名，这个是可以随便起的，它的类型是 `string`，即属性名类型为 `string`。也就是说，不管这个对象有多少属性，只要属性名是字符串，值也是字符串，就符合这个类型声明。

在 JavaScript 对象的属性名的类型有三种，除了 `string`，还有 `number` 和 `symbol`

```typescript
type NumberType = {
    [property: number]: string;
};
type SymbolType = {
    [property: symbol]: string;
};
const arr: NumberType = ["1", "2", "3"];
const arr1: NumberType = {
    0: "1",
    1: "2",
    2: "3",
};

const sym: SymbolType = {
    [Symbol(0)]: "1",
    [Symbol(1)]: "2",
    [Symbol(2)]: "3",
};
```

对象可以同时存在多种类型的属性名索引，但是，多种索引发生冲突时，必须服从字符串，因为在 JavaScript 语言内部，所有的数值属性名都会自动转为字符串属性名。比如同时由数值索引和字符串索引

```typescript
type MyType = {
    [x: number]: boolean; // 报错
    foo: boolean; // 报错
    [x: string]: string;
};
```

::: warning

属性索引写法不宜声明数组，采用这种方式声明数组，就不能使用各种数组方法以及`length`属性，因为类型里面没有定义。

```typescript
type MyArr = {
    [prototype: number]: number;
};
const obj: MyArr = [1, 2, 3];
obj.length; // 报错
```

:::

## 解构赋值

解构赋值用于直接从对象中提取属性

```javascript
const { id, name, price } = {
    id: "1",
    name: "tom",
    price: 20,
};
```

上面示例是在 `js` 中的解构，花括号中的属性名与对象中的属性名同名。在 `ts` 中的写法如下

```typescript
const {
    id,
    name,
    price,
}: {
    id: string;
    name: string;
    price: number;
} = {
    id: "1",
    name: "tom",
    price: 20,
};
```

## 结构类型原则

`ts` 类型系统关注的是对象结构，而不是具体实现。只要对象具有相同的属性、方法和数量，就可以被认为是相同类型的。

```typescript
interface Person {
    name: string;
    age: number;
}

class MyPerson {
    name: string;
    age: number;
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
}

let p1 = new MyPerson("tom", 20);
let p2: Person = p1;
```

## 弱类型检测

因为结构类型原则，当某个对象中所有的属性都是可选时，任意一个对象都满足结构类型原则

```typescript
let p1: { name?: string; age?: number } = {}; // 不报错

let p2: { detail: string } = {
    detail: "xxx",
};
p1 = p2 // 报错
```
`ts` 2.4 引入了 "弱类型检测"，`p2` 和 `p1` 没有相同的属性，就会报错。"弱类型检测" 要求对象中至少要有一个可选属性存在。

## 空对象
在 `js` 中经常会这样声明变量
```javascript
const p1 = {}
p1.name = 'tom'
```
但是上面这样分布操作在 `ts` 中是不允许的，必须生成时声明属性
```typescript
const p1 = {
  name: ''
}`
p1.name = 'tom'
```
如果想强制使用没有任何属性的对象，可以使用以下写法
```typescript
interface NoProp {
  [prop: string]: never
}
const a: NoProp = {}
```