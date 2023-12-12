# 类型运算符

## keyof

keyof 是一个单目运算符，接受一个对象类型作为参数，返回该对象的所有键名组成的联合类型。

```typescript
type MyObj = {
    name: string;
    age: number;
};

type keys = keyof MyObj;
```
