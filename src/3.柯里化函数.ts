// 柯里化函数

// 判断一个变量的类型
// 1. typeof 2. constructor 3. instanceof 4. Object.prototype.toString.call()

// function isType(val:unknown,typing:string) {
//     return Object.prototype.toString.call(val) === `[object ${typing}]`;
// }
// let r =  isType('hello','String');
// console.log(r);

// isString isNumber isBoolean

// function isType(typing:string) {
//     return function(val:unknown) {
//         return Object.prototype.toString.call(val) === `[object ${typing}]`
//     }
// }

// 柯里化的功能,就是让函数的功能更具体一些 (保留参数)
// 反柯里化,让函数的范围变大
// type ReturnFn = (val:unknown) => boolean;

// let utils:Record<string,ReturnFn> = {};

// ['String', 'Number', 'Boolean'].forEach(type=>{
//     utils['is'+type] = isType(type); // 闭包
// });
// console.log(utils.isString('hello'));
// console.log(utils.isNumber(123));


// 实现一个通用的柯里化函数,可以自动将一个函数转化成多次传参 lodash

const curring = (fn:Function) => {
    const exec = (sumArgs) => {
        console.log('fn.length: ',fn.length);
        return (sumArgs.length >= fn.length) ? fn(...sumArgs) : (...args) => exec([...sumArgs ,...args])
    };
    return exec([]);
}
// 函数的长度就是参数个数
function sum(a,b,c,d) {
    return a+b+c+d;
}
console.log(curring(sum)(1)(2,3)(4));

// function isType(typing:string,val:unknown) {
//     return Object.prototype.toString.call(val) === `[object ${typing}]`;
// }

// let isString = isType('String');
// let isNumber = isType('Number');

// 暂存变量