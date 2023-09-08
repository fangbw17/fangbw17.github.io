# class

类（class）是面向对象编程的基本概念，封装了属性与方法。

## 简介

一般情况下，属性在最顶部声明

```typescript
class Rect {
    x;
    y = 0;
    width: number;
    height: number;
}
```

上面示例中，`x` 没有声明类型, 类型推断为 `any`, `y` 也没有声明类型，但是赋值了， `ts` 会根据值自行推断属性的类型，
`width` 和 `height` 的类型是 `number`。

`js` 有一个配置项 `strictPropertyInitialization`，设置为 `true` （默认是打开的）会检查属性是否设置了初始值，没有会报错。如果不希望出现报错（开启上述配置项的情况下），可以使用非空断言。

```typescript
class Point {
    x: number = 0;
    y!: number;
}
```

上面示例中，属性 `y` 没有初始值，但是在属性名后面添加了感叹号，表示这个属性肯定不会为空，所以 `ts` 就不报错了

### readonly 修饰符

属性名前面添加上 `readonly` 修饰符，表示该属性是只读的。

```typescript
class Person {
    readonly name = "Aaron";
}

const p = new Person();
p.name = "p";
```

上面示例中，属性 `name` 前面添加了修饰符 `readonly`，后续修改属性就会报错，但是在构造方法里面是可以赋值的。

```typescript
class Person {
    readonly name: string = "Aaron";
    readonly age: number;
    constructor() {
        this.name = "p"; // 正确
        this.age = 20; // 正确
    }
}
```

### 方法的类型

类的方法就是普通函数，类型声明方法与函数一致

```typescript
class Rect {
    x!: number;
    y!: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    getPoint() {
        return [this.x, this.y];
    }
}
```

上面示例中，构造方法和普通方法 `getPoint` 都注明了参数类型，但是省略了返回值类型，`ts` 可以推断出来。类的方法和函数一样，可以使用参数默认值，以及函数重载。

```typescript
class Rect {
    constructor(x: number, y: string);
    constructor(s: string);
    constructor(xs: number | string, y?: string) {}
}
```

构造方法不能声明返回值，默认是返回实例对象的。

### 访问器方法

访问器方法指的是读写某个属性的方法，包括取值器（getter）和 存储器 (setter) 两种方法。取值器读取属性，存储器写入属性。

```typescript
class Rect {
    _x: number = 0;
    get x() {
        return this._x;
    }

    set x(val) {
        this._x = val;
    }
}
```

上面示例中，`get x()` 是取值器，其中 `get` 是关键词，`x` 是属性名。外部读取 `x` 属性时，示例对象会自动调用这个方法，该方法的返回值是 `_x` 属性的值. `set x(val)` 是存储器，其中 `set` 是关键词， `x` 是属性名。外部写入 `x` 属性时，示例对象会自动调用这个方法，并将所赋的值作为函数参数传入。

`ts` 对访问器有以下规则:

1.  如果某个属性只有 `get` 方法，没有 `set` 方法，那么该属性自动成为只读属性。

```typescript
class Rect {
    _x: number = 0;
    get x() {
        return this._x;
    }
}

const rect = new Rect();
rect.x = 20; // 报错
```

2. `ts` 5.1 版本之前，`set` 方法的参数类型必须兼容 `get` 方法的返回值类型，否则报错。

```typescript
class Person {
    _name = "";
    get name(): string {
        // 报错
        return this._name;
    }
    set name(value: number) {
        this._name = String(value);
    }
}
```

上面示例中，`get` 方法的返回值类型是 `string`，`set` 方法的参数类型 `number` 不兼容，会报错，需要改成下面这样。

```typescript
class Person {
    _name = "";
    get name(): string {
        return this._name;
    }
    set name(value: number | string) {
        this._name = String(value);
    }
}
```

3. `get` 和 `set` 的可访问性必须一致，要么都公开，要么都私有。

### 属性索引

类允许定义属性索引。

```typescript
class Person {
    [prop: string]: boolean | ((prop: string) => boolean);

    get(name: string) {
        return this[name] as boolean;
    }
}
```

上面示例中，`[prop: string]` 表示所有属性名类型为字符串的属性，值要么是布尔值，要么是返回布尔值的函数。

::: tip
由于 `class` 的方法也是一种属性（属性值为函数的属性），所以属性索引的类型定义也要涵盖方法。如果一个对象同时定义了属性索引和方法，那么前者必须包含后者

```typescript
class Person {
    [prop: string]: boolean;
    name() {
        // 报错
        return "tom";
    }
}

class Person {
    [prop: string]: boolean | (() => string);
    name() {
        // 正确
        return "tom";
    }
}
```

访问器方法和属性一致，不需要定义返回某种类型值的函数。

```typescript
class Person {
    [prop: string]: string;

    get name() {
        return "tom";
    }
}
```

:::

## class 和 interface

### implements

`interface` 接口和 `type` 别名，可以用对象的形式，为 `class` 设置一些属性或方法。

```typescript
interface Person {
    name: string;
    age: number;
}

type Person1 = {
    name: string;
    age: number;
};

class P implements Person {
    name = "";
    age = 0;
}
```

使用 `implements` 关键字满足上述 `interface` 或者 `type` 中定义的属性。

`interface` 只指定检查条件，不满足则报错。`interface` 并不能替代 `class` 自身的类型声明。

```typescript
interface A {
    get(name: string): boolean;
}

class B implements A {
    get(address) {
        console.log(address);
        return false;
    }
}
```

上面示例中，B 实现了 A，但是 A 中的声明不能代替 B，`get` 方法中参数 `address` 的类型是 `any`，不是 `string`。B 仍然需要声明参数 `address` 的类型。
::: tip
interface 描述的属性和方法的访问性都是公开的。在 interface 中不能定义私有的属性和方法。需要定义私有或者受保护的需要在 class 中定义。
:::

### 多实现

类是可以实现多个接口或者别名的，以逗号分隔

```typescript
interface I1 {}
interface I2 {}
interface I3 {}
type T1 = {};
type T2 = {};
type T3 = {};
class I implements I1, I2, I3 {}
class T implements T1, T2, T3 {}
```

当同时实现的接口或者别名过多时，使得代码难以管理。可以用类的继承或者接口的继承来替代

```typescript
class Country implements P {}

class China implements Country {}

interface Country {
    name: string;
}
interface China extends Country {
    people: number;
}
```

### 类与接口的合并

```typescript
interface Point {
    x: number;
}
class Point {
    y: number = 0;
}

const p = new Point();
p.x = 10;
p.y = 20;
```

在 `ts` 中不能出现同名的类，但是类与接口是可以同名的，类的实例会拥有同名类和接口的属性与方法。

## class 类型

### 实例类型

`ts` 类本身就是一种类型，代表该类的实例类型，而不是 class 自身类型

```typescript
class Person {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
}
const p: Person = new Person("tom");
```

上面示例中，定义了一个类 `Person`。类名就代表一种类型，实例对象 `p` 的类型就是 `Person`。
对于实现了接口的类，定义的变量既可以声明接口，也可以声明为类。

```typescript
interface Father {
    name: string;
}
class Son implements Father {
    name = "";
    age = 20;
}
const s1: Son = new Son();
const s2: Father = new Son();
s2.name = "tom";
console.log(s2); // Son { name: 'tom', age: 20 }
console.log(s2.name); // tom
console.log((s2 as Son).age); // 20
```

上面示例中，变量 `s2` 可以写成 `Son`，也可以写成 `Father`。区别在于 `Son`中如果定义了接口中没有的属性或者方法，那么变量 `s2` 无法访问这些属性和方法。

### 类的自身类型

要获取一个类的自身类型，可以使用 `typeof` 运算符。

```typescript
class Person {}
function createPerson(PersonClass: typeof Person): Person {
    return new PersonClass();
}
```

写成 `PersonClass: Person` 的话，传入的参数实际上是 `Person` 类的实例对象。如果想传入 `Person` 类自身，可以使用 `typeof`。

### 结构类型原则

class 也遵循“结构类型原则”。对象只要满足 class 的实例结构，就可以说是同一个类型。

```typescript
class Person {
    name = "tom";
    age = 20;
}

function fn(p: Person) {
    console.log(p.name);
}

const p = { name: "a", age: 18 };
fn(p);
```

上面示例中, 变量 `p` 满足 `Person` 类的结构，可以当做参数传入。
只要两者之前其中一种类型的结构满足另一种类型的结构，那么就可以认为是 “结构类型原则”。但是需要注意的是，只有大的包含小的，并不能用小的包含大的。比如下例：

```typescript
class Person {
    name = "tom";
    age = 20;
}
type P1 = { name: string };
type P2 = { name: string; age: number; address: string };
const p1: P1 = new Person(); // 正确
const p2: P2 = new Person(); // 错误
```

::: tip
“结构类型原则” 只检查实例成圆，不考虑静态成圆和构造方法。
如果类中存在私有成员或保护成员，那么确定兼容关系时，`ts` 要求私有成员和保护成员来自同一个类，即继承关系。

```typescript
// 情况一
class A {
    private name = "a";
}

class B extends A {}

const a: A = new B();

// 情况二
class A {
    protected name = "a";
}

class B extends A {
    protected name = "b";
}

const a: A = new B();
```

:::
