# 原型和原型链

JavaScript 是一种基于对象设计的语言，但是和传统的面向对象语言不同，JavaScript 中的对象是基于原型的，而不是基于类的。因为在最初 JavaScript 的设计初衷是为了实现简单的网页交互，然而又因为 JavaScript 中所有的数据类型都是对象（Brendan Eich 受到其他面向对象编程语言的影响），所以 JavaScript 需要一种机制来实现对象之间的继承。

在其他面向对象语言中，继承是通过类来实现的，使用关键字 new Class() 调用类的构造函数来创建一个新的对象。
而在 JavaScript 中，继承是通过原型来实现的，使用关键字 new Function() 调用函数来创建一个新的对象。

## [[prototype]] 和 \_\_proto\_\_

在 JavaScript 中，每个对象都有一个内部属性 `[[prototype]]`，这个属性指向该对象的原型对象。那么 `__proto__` 又是什么呢？在早期的 JavaScript 规范中，并没有提供原型对象的访问方式，无法获取到`[[prototype]]`。于是许多浏览器引擎实现了这种访问方式 `__proto__` 。它和 `[[prototype]]` 是等价的，是 `[[prototype]]` 的 **getter/setter**， 但是在规范中，`__proto__` 是一个非标准的属性，不应该被使用。

```js
{
  const animal = {
    name: "animal",
  };

  const rabbit = {
    __proto__: animal,
  };

  const rabbit2 = {
    __proto__: true,
  };

  console.log(rabbit.name); // animal
  console.log(rabbit2.name); // undefined
}
```

![图-1](/assets/img/javascript/prototype/prototype-1.png)

如图所示，`rabbit` 对象的 `__proto__` 属性指向 `animal` 对象，所以 `rabbit` 对象可以访问到 `animal` 对象的属性和方法。

::: tip
`__proto__` 只能是一个对象或者 **null**，其他类型的都会被忽略
:::

我们刚刚说过，`__proto__` 是 `[[prototype]]` 的 **getter/setter**，那么 如何使用 `[[prototype]]` 呢？

```js
{
  const animal = {
    name: "animal",
  };

  const rabbit = {};

  Object.setPrototypeOf(rabbit, animal);

  console.log(rabbit.name); // animal

  console.log(rabbit.__proto__ === animal); // true

  console.log(Object.getPrototypeOf(rabbit) === animal); // true
}
```

由上面的示例可见，我们可以通过 `Object.setPrototypeOf` 方法来设置 `[[prototype]]`，也可以通过 `Object.getPrototypeOf` 方法来获取 `[[prototype]]`。同时，`[[prototype]]` 和 `__proto__` 都是等于 `animal` 的。

### for...in

`for...in` 循环会遍历对象的所有可枚举属性，包括原型上的属性。

```js
const animal = {
  name: "animal",
};

const rabbit = {
  jumps: true,
};

// Object.keys 只返回自身的属性
console.log(Object.keys(rabbit)); // ['jumps']

// for...in 会便利自己以及继承的属性
for (const k in rabbit) {
  console.log(k); // jumps，然后是 name
}
```

如果并不想遍历原型上的属性，我们可以使用 `obj.hasOwnProperty` 或者 `Object.hasOwn` 方法来判断属性是否是自身的属性。

```js
for (const k in rabbit) {
  let isOwn = rabbit.hasOwnProperty(k); // Object.hasOwn(rabbit, k);
  console.log(`${k}：${isOwn ? "自生属性" : "继承属性"}`);
}
```

注意，这里可以看到 `rabbit` 调用了 `hasOwnProperty`，这是从哪里来的呢？这个咱们稍后再解答。  
那么为什么 `for...in` 遍历时没有 `hasOwnProperty` 呢？  
首先 `for...in` 的定义是遍历对象的所有可枚举属性，而 `hasOwnProperty` 没有被遍历出来，是因为它是一个不可枚举的属性(`enumerable: false`)。

### 小结

- 在 JavaScript 中，每个对象都有一个内部属性 `[[prototype]]`，这个属性指向该对象的原型对象。
- `__proto__` 是 `[[prototype]]` 的 **getter/setter**，但是在规范中，`__proto__` 是一个非标准的属性，不应该被使用。
- 如果访问对象中没有的属性或方法，那么会从该对象的原型对象中查找
- `for...in` 是可以遍历对象自身和继承的属性

<!--
```js
function createPerson(age, name) {
  return {
    age: age,
    name: name,
  };
}

const person1 = createPerson(18, "Tom");
const person2 = createPerson(19, "Jerry");
```

在上面示例中，我们定义了一个函数 createPerson，它接受两个参数 age 和 name，返回一个对象。
这样，我们就可以通过调用 createPerson 函数来创建多个对象，而不需要重复编写相同的代码。
如果我们想再定义一些方法和属性呢？

```js
function createPerson(age, name) {
  return {
    age: age,
    name: name,
    sayHello: function () {
      console.log("Hello, my name is " + this.name);
    },
  };
}

const person1 = createPerson(18, "Tom");
const person2 = createPerson(19, "Jerry");
```

![图-1](/assets/img/javascript/prototype/prototype-1.png)

如上图所示，通过 `craetePerson` 函数定义的对象，可以看到 `person1` 和 `person2` 除了有 age 和 name 属性，还有 sayHello 方法。
但是如果我们有更多的对象，它们的 sayHello 方法都是相同的，那么就会有很多重复的代码。
为了避免这种重复的代码，我们可以再改进一下实现方式：

```js
function Person(age, name) {
  this.age = age;
  this.name = name;
}

Person.prototype.sayHello = function () {
  console.log("Hello, my name is " + this.name);
};

// 实现箭头函数定义原型方法会报错，因为箭头函数没有自己的 this，this 会指向全局对象，
// Person.prototype.sayHello = () => {
//   console.log("Hello, my name is " + this.name);
// };

const person1 = new Person(18, "Tom");
const person2 = new Person(19, "Jerry");

person1.sayHello(); // Hello, my name is Tom
person2.sayHello(); // Hello, my name is Jerry
```

我们通过 new 关键字调用 Person 函数来创建一个新的对象，在构造函数调用阶段，构造函数会生成一个 `prototype` 属性，该属性是一个具有 `constructor` 属性和其他若干方法、属性的对象。
如下图所示：
![图-2](/assets/img/javascript/prototype/prototype-2.png)

::: tip
构造函数和普通函数并无区别，只是在调用时使用了 new 关键字。但是一般约定俗成的，构造函数的命名**首字母大写**。
:::

## \_\_proto\_\_ 和 [[Prototype]]

在上面的示例中，我们看到了变量 `person1` 和 `person2` 都可以调用 `sayHellow` 方法，但是 `sayHellow` 方法是定义在 **Person** 的 **prototype** 属性上的。那么是怎么访问到呢？

在 JavaScript 中，对象都有一个隐藏属性 `[[Prototype]]`, 这个属性只能是对象或者 **null** -->

## F.prototype

函数一般都会有一个 `prototype` 对象属性，对象内部有一个 `constructor(指向构造函数)` 和若干属性方法。当我们通过 `new Function`，或者 `new Class` 来创建一个对象（实例）时，会将对象的`[[Prototype]]`指向 `F.prototype` 所引用的对象。

```js
let animal = {
  name: "animal",
};

function Rabbit(name) {
  this.name = name;
}

Rabbit.prototype = animal;

const rabbit = new Rabbit("white rabbit");
```

![图-2](/assets/img/javascript/prototype/prototype-2.png)
如图所示 `rabbit` 的 `[[Prototype]]` 指向 `Rabbit.prototype` 所引用的对象 `animal`。

```js
let animal = {
  name: "animal",
};

function Rabbit(name) {
  this.name = name;
}

Rabbit.prototype = animal;
const whiteRabbit = new Rabbit("white rabbit");

Rabbit.prototype = {
  eats: true,
};
const blackRabbit = new Rabbit("black rabbit");

console.log(whiteRabbit.eats); // undefined
console.log(blackRabbit.eats); // true
```

由上面的示例可见，当 `Rabbit.prototype` 变化时，通过构造函数创建的对象的 `[[Prototype]]` 也会变化。而已存在的对象仍然保持旧有的值。

## 原型链

在上面的示例中，我们提到了 `obj.hasOwnProperty`，那么这个方法是从哪里来的呢？

```js
let animal = {
  food: true,
};

function Rabbit(name) {
  this.name = name;
}

Rabbit.prototype = animal;

const rabbit = new Rabbit("white rabbit");

console.log(rabbit.hasOwnProperty("name")); // true
console.log(rabbit.hasOwnProperty("food")); // false
```

字面量对象 `animal` 实际上是 `new Object` 的实例，所以 `animal` 的 `__proto__` 属性指向 `Object.prototype` 对象。

所以当我们调用 `hasOwnProperty` 方法时，会从 `rabbit` 对象自身中查找，若未查找到，则会在原型对象（`animal`）中查找，若 `animal` 中也未查找到，则会从 `animal.__proto__` 所指向的原型对象（`Object.prototype`）中查找，若在 `Object.prototype` 中也未查找到，则会返回 **undefined（Object.prototype.\_\_proto\_\_ 指向的原型对象是 null）**。而这整个查找过程就是原型链。
![图-3](/assets/img/javascript/prototype/prototype-3.png)

让我们再看看其他内建对象的原型链：

```js
let arr = [1, 2, 3];

console.log(arr.__proto__ === Array.prototype); // true
console.log(arr.__proto__.__proto__ === Object.prototype); // true
console.log(arr.__proto__.__proto__.__proto__ === null); // true

let age = 20;
console.log(age.__proto__ === Number.prototype); // true
console.log(age.__proto__.__proto__ === Object.prototype); // true
console.log(age.__proto__.__proto__.__proto__ === null); // true

let F = function () {};
let f = new F();
console.log(f.__proto__ === F.prototype); // true
console.log(f.__proto__.__proto__ === Object.prototype); // true
console.log(f.__proto__.__proto__.__proto__ === null); // true

// 函数在 JavaScript 中也是对象，所以函数也有原型链
console.log(F.__proto__ === Function.prototype); // true
console.log(F.__proto__.__proto__ === Object.prototype); // true
console.log(F.__proto__.__proto__.__proto__ === null); // true
```

如图所示，所有内建对象的最终原型都是 `Object.prototype`。
![图-4](/assets/img/javascript/prototype/prototype-4.png)

::: tip
