// 1. promise 可以解决多个异步并行执行,最终得到所有的结果
// 2. 异步嵌套问题

// 1. 每个promise,都有三个状态, pending等待, resolve标识变成成功态 fulfilled, reject标识变成 rejected
// 2. 每个promise需要有一个then方法,传入两个参数, 一个是成功的回调, 另一个是失败的回调
// 3. new Promise() 会立即执行
// 4. 一旦成功就不能失败,一旦失败就不能成功
// 5. 当promise抛出异常后,也会走失败态

// let promise = new Promise((resolve, reject) => {
//     resolve('ok');
//     reject('fail');
// });

// promise.then((data) => {
//     console.log('success', data)
// },(err)=>{
//     console.log('faild',err);
// });

// 存放所需要的状态
const enum STATUS {
    pending = 'PENDING',
    fulfilled = 'FULFILLED',
    rejected = 'REJECTED',
}

class Promise {
    public status: STATUS;
    public value: any;
    public reason: any;
    public onResolveCallbacks: Function[];
    public onRejectedCallbacks: Function[];
    constructor(executor:(resolve:(value?:any)=>void,reject:(reason?:any)=>void)=>void) {
        this.status = STATUS.pending; // 当前默认状态
        this.value = undefined; // 成功值
        this.reason = undefined; // 失败原因
        this.onResolveCallbacks = [];
        this.onRejectedCallbacks = [];
        const resolve = (value?:any) => {
            if (this.status === STATUS.pending) {
                this.status = STATUS.fulfilled;
                this.value = value;
                // 发布订阅模式
                this.onResolveCallbacks.forEach(fn=>fn());
            }
        }
        const reject = (reason?:any) => {
            if (this.status === STATUS.pending) {
                this.status = STATUS.rejected;
                this.reason = reason;
                this.onRejectedCallbacks.forEach(fn=>fn());
            }
        }
        try{
            executor(resolve, reject);
        }catch(e){
            reject(e);
        }
    }
    then(onFulfilled,onRejected) {
        // 每次调用then都产生一个全新的promise
        return new Promise((resolve, reject) => {
            if (this.status === STATUS.fulfilled) {
                try{
                    let x = onFulfilled(this.value);
                    resolve(x); // then的返回值作为下一次then的成功结果
                }catch(e) {
                    reject(e);
                }
            }
            if (this.status === STATUS.rejected) {
                try{
                    let x = onRejected(this.reason);
                    resolve(x);
                } catch(e) {
                    reject(e);
                }
            }
            if (this.status === STATUS.pending) {
                this.onResolveCallbacks.push(()=>{ // 切片
                    // todo...额外的逻辑
                    try{
                        let x = onFulfilled(this.value);
                        resolve(x);
                    }catch(e){
                        reject(e)
                    }
                });
                this.onRejectedCallbacks.push(()=>{
                    try{
                        let x = onRejected(this.reason);
                        resolve(x);
                    }catch(e) {
                        reject(e);
                    }
                })
            }
            resolve('ok');
        });
    }
}

export default Promise;