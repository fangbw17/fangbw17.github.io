# 函数
函数的类型声明需要给出参数的类型及返回值的类型
```typescript
function foo(text: string): void {
  console.log('hello ', text)
}
```
上面示例中，函数 `foo` 在声明时，给出参数 `text` 的类型 (`string`)，以及返回值的类型 (`void`)。

如果不指定参数类型，如 `text` 的类型， **ts** 会推断参数类型，如果缺乏足够的信息，会推断为 any。

无返回值值的情况下通常可以省略 void，**ts** 可以推断出来。
```typescript
function foo(text) {
  console.log('hello ', text)
}
```
上面示例中，没有 `return` 语句，**ts** 会推断出 `foo` 没有返回值

变量赋值为函数有俩种写法：
```typescript
// 方式一
const foo = function(text: string) {
  console.log('hello ', text)
}

// 方式二
const foo:
 (text: string) => void 
 = function(text) {
  console.log('hello ', text)
 }
```
当多个函数使用同一种类型时，可以使用 `type` 为函数类型定义一个别名，便于指定给其他变量。
```typescript
type MyFunc = (text: string) => void

const foo: MyFunc = function(text) {
  console.log('hello ', text)
}
```
上面示例中，`type` 命令为函数类型定义了一个别名 `MyFunc`，方便后续使用。

函数的实际参数个数，可以少于类型指定的参数个数，但是不能多。
```typescript
type MyFunc = (name: string, address: string) => void

const foo: MyFunc = function(name) {
  console.log(`the person name is ${name}`);
} // 正确

const foo1: MyFunc = function(name, address, age) {
  console.log(`the person name is ${name}`); // 报错
}
```
因为在 `JavaScript` 函数在声明时会有多余的参数，实际使用时可以只传入一部分参数。如 `forEach`

如果一个变量要套用另一个函数类型，可以使用 `typeof` 运算符
```typescript
function add(
  x: number,
  y: number
) {
  return x + y
}

const myAdd: typeof add = function(x, y) {
  return x + y
}
```