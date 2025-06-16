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

::: tip 注意
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

## getPrototypeOf & setPrototypeOf

在上面我们提到了对象有一个内部属性 `[[prototype]]`，同时我们可以通过 `__proto__` 来访问它。但是我们不建议这样，这里是有一些历史原因的。

- 构造函数中的 `prototype` 属性自古以来就起作用，这是使用给定原型创建对象的最古老方式。
- 之后，在 2012 年，`ECMAScript` 标准中出现了 `Object.create`，提供了使用给定原型创建对象的能力，但是没有提供 **get/set** 原型的能力。于是，一些浏览器实现了**_非标准_**的 `__proto__` 访问器，给开发者提供更多的灵活性。
- 在 2015 年，`Object.getPrototypeOf` 和 `Object.setPrototypeOf` 被加入到标准中，提供了 `__proto__` 同样的功能，且符合标准规范。之后，`__proto__` 被加入到标准的附件 B 中，即：在非浏览器环境下，它的支持是可选的。
- 在 2022 年，`__proto__` 又从附录 B 中移除（仅在创建字面量对象时使用，作为 getter/setter 仍然不可使用，还在附录 B 中）

所以尽量使用 `Object.getPrototypeOf` 和 `Object.setPrototypeOf`，而不是 `__proto__`（在非浏览器环境下可能不支持）。

::: tip 如果非常关注速度，那么请不要修改已存在的 `[[prototype]]`
理论上来说，我们可以在任意时间修改一个对象的 `[[prototype]]`，但是这样做是非常危险的。因为这样做会改变对象的内部状态，从而影响到对象的行为。

而且，JavaScript 引擎内部对此是做了优化的，修改 `[[prototype]]` 会破坏这个行为。
:::

### 纯净的对象

通常创建一个对象，它会从原型中继承到很多方法，且显示设置 `__proto__` 的值为非对象和非 null，会被忽略。

```js
let animal = {
  __proto__: "animal",
  name: "animal",
};

console.log(animal.toString()); // [object Object]
console.log(animal.__proto__); // Object.prototype
```

如上所示，animal 显式指定了 `__proto__` 属性，然而得到值不是字符串，仍然指向 `Object.prototype`。
如果想自定义 `__proto__` 可以使用下面方式

```js
let animal = Object.create(null); // let animal = { __proto__: null };
animal.__proto__ = "animal";
console.log(animal.__proto__);
```

`Object.create(null)` 创建了一个空对象，对象的原型对象是 null

### 小结

1. 使用给定的原型创建对象，使用:

- 字面量语法: `{__proto__: ...}`
- Object.create(proto,[descriptors])

```js
let clone = Object.create(
  Object.getPrototypeOf(obj),
  Object.getOwnPropertyDescriptors(obj)
);
```
