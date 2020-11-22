// Promise 最重要的核心就是解决了 1.异步并发问题 2.回调地狱问题,回调函数

const fs = require('fs'); // 读取文件

interface IPerson {
    age: number,
    name: string,
}

function after(times, callback) {   // 高阶函数,可以暂存变量
    let obj = {} as IPerson;
    return function(key:string,val: number | string) {
        obj[key] = val;
        --times == 0 && callback(obj);
    }
}

let fn = after(2,(obj)=>{
    console.log(obj);
});

fs.readFile('./age.txt','utf8',(err,data)=>{
    fn('age',data);
});
fs.readFile('./name.txt','utf8',(err,data)=>{
   fn('name',data);
});
export {};