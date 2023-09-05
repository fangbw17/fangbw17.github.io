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

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    getPoint() {
        return [x, y];
    }
}
```
