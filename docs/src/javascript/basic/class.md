# Class

`class` ES6 中提出的，用于创建对象的模板，为对象提供了属性和方法。JS 中的 `class` 是建立在**原型**的基础上的。同时提供了一些 `class` 独有的语法和语义。

## 类的定义

类是一种特殊的函数，定义类时需要使用 `class` 关键字。类的定义有两种形式：声明和表达式。

```js
class Animal {}

let Animal = class {};

console.log(typeof Animal); // function
console.log(Animal === Animal.prototype.constructor); // true
console.log(Object.getOwnPropertyNames(Animal.prototype)); // [ 'constructor' ]
```

### 类主体

类主体通过大括号 `{}` 定义，类主体内部可以定义属性和方法。类主体内部的代码会自动进入严格模式。
类元素有以下特征：

- 种类：字段、方法、getter/setter、计算属性
- 位置：类实例或类本身
- 可见性：公有或私有

```js
class Animal {
  // 字段
  // 公有字段
  username;
  //  私有字段
  #gender;
  // 公有静态字段
  static staticName = "static-name";
  // 私有静态字段
  static #staticGender = "unknow";
  constructor({ username, age, gender }) {
    this.username = username;
    this.age = age;
    this.#gender = gender;
  }

  get gender() {
    return this.#gender;
  }

  set setAge(value) {
    this.age = value;
  }

  // 方法
  method() {
    console.log("方法");
  }

  #privateMethod() {
    console.log("私有方法");
  }

  static staticMethod() {
    console.log("静态方法");
  }

  static #staticPrivateMethod() {
    console.log("静态私有方法");
  }
}

const animal = new Animal({ username: "tom", age: 20, gender: "male" });
console.log(animal.username); // tom
console.log(animal.age); // 20
console.log(animal.gender); // male

animal.method(); // 方法
Animal.staticMethod(); // 静态方法
```

### 不同点

`class` 本质还是函数，类的所有方法都定义在类的 `prototype` 属性上。与构造函数大部分都一致，但是也有一些不同之处:

```js
class AnimalClass {
  name;
  constructor(name) {
    this.name = name;
  }
  sayHi() {
    console.log(`hi, my name is ${this.name}`);
  }
  static sayHi() {
    console.log("hi");
  }
}

function AnimalFn(name) {
  this.name = name;
}
AnimalFn.prototype.sayHi = function () {
  console.log(`hi, my name is ${this.name}`);
};
AnimalFn.sayHi = function () {
  console.log("hi");
};

console.log("--- class ---");
console.log(AnimalClass()); // TypeError: Class constructor AnimalClass cannot be invoked without 'new'
const animalClass = new AnimalClass();
for (const k in animalClass) {
  console.log(k); // name
}

console.log("--- function ---");
const animalFn = new AnimalFn();
for (const k in animalFn) {
  console.log(k); // name, sayHi
}
```

1. 通过 `class` 创建的函数具有特殊的内部属性标记 `[[IsClassConstructor]]: true`。且与构造函数不同，必须使用 `new` 来调用，否则会报错。
2. `class` 内部的方法不可枚举。
3. 类总是使用 `use strict`。类构造中的所有代码都将自动进入严格模式。

## 类继承

通过关键字 `extends` 扩展另一个类

```js
class Animal {}

class Rabbit extends Animal {}
class Rabbit extends class {} {}
class Rabbit extends null {}
```

通过 `extends` 关键字可以继承另一个类，子类可以继承父类的属性和方法，也可以重写父类的方法。

:::tip 继承 null
`null` 是一个特殊的对象，它没有任何属性和方法。使用类继承 null 时，必须手动实现 `constructor`，并且**不能调用**`super()`

```js
class Animal extends null {
  constructor() {
    // super(); // TypeError: super() is not allowed in a null context
    return Object.create(null);
  }
}

const animal = new Animal();
console.log(animal instanceof Animal); // false
console.log(Object.getPrototypeOf(animal)); // null
```

### constructor

派生类若显式创建了 `constructor`，那么需要在 `constructor` 中调用 `super()`，即调用 **基类（父类）** 的构造函。且一定要在使用 `this` 之前调用。

- 若单独创建基类实例，那么 `new` 关键字会创建一个空对象，并将这个空对象赋值给 `this`。
- 若创建派生类实例，那么 `new `不会执行上面的操作，而是期望基类的 `constructor` 来完成此操作。

```js
class Animal {
  name = "animal";

  constructor() {
    console.log(this.name);
  }
}

class Rabbit extends Animal {
  name = "rabbit";
}

new Animal(); // animal
new Rabbit(); // animal
```

在派生类执行 `constructor` 之前，会先执行基类的 `constructor`。而 `Rabbit` 的字段 `name` 还未被赋值（在 super 后赋值），所以此时输出的是 **animal**

::: tip [[HomeObject]]
HomeObject 是一个指针，`Super` 实际就是指向这个属性。[HomeObject](https://zh.javascript.info/class-inheritance)
:::

## 总结

在类声明或类表达式被求值，会按照如下顺序执行：

### 类初始化正确顺序：

1. **`extends` 子句求值**

   - 若有 `extends`，先求值其表达式，结果必须是构造函数或 `null`，否则抛出 `TypeError`。

2. **处理 `constructor` 方法**

   - 若未显式定义，使用默认构造函数 `constructor(...args) { super(...args); }`（基类为 `constructor() {}`）。此步骤不可观察。

3. **类元素按声明顺序处理（关键修正）**

   - **字段名（键）的求值**：

     - 所有字段（实例/静态字段，公有/私有）的 **键名（key）** 按声明顺序求值。
     - 若键是计算属性（如 `[expr]`），`expr` 在此刻求值（使用类外部作用域的 `this`）。
     - ❗ **此时不计算字段值（初始化器）**，仅确定键名。

   - **方法/访问器安装**：
     - 方法和访问器（公有/私有）按声明顺序安装到原型或类本身。
     - 公有方法/访问器：非静态的绑定到 `prototype`，静态的绑定到类自身。
     - 私有方法/访问器：保存到内部槽，后续绑定到实例（不可观察）。

4. **字段初始化器求值（关键修正）**

   - **静态字段（公有/私有）**：

     - 按声明顺序 **立即求值初始化器**，`this` 指向类本身，结果直接设置到类上。

   - **实例字段（公有/私有）**：
     - 初始化器 **不在此阶段求值**，而是保存起来。
     - 它们会在实例化时执行（在基类 `super()` 调用后，构造函数主体执行前）。

5. **类初始化完成**

   - 类可作为构造函数使用。
