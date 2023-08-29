# Symbols
ECMAScript 2015 加入了 `symbol` ，`symbol` 是基本数据，就像 `string` 和 `number` 一样。
`symbol` 通过 `Symbol` 构造函数创建

```typescript
// key 是可选的
let sym1 = Symbol()
let sym2 = Symbol('key')
// false, Symbol 创建的是唯一的
sym1 === sym2 
```