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

// 核心的逻辑,解析x的类型来解析promise2是成功还是失败
function resolvePromise(promise2, x, resolve, reject) {
	// 判断 x 的值决定promise2的关系, 来判断有可能X是别人的promise,可能别人的promise会出问题
	if (x === promise2) {
		return reject(new TypeError('出错了'));
	}

	if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
		// 只有x是对象或者函数才有可能是promise
		let called = false; // 表示没调用过成功和失败
		try {
			let then = x.then; // 取x上的then方法
			if (typeof then === 'function') {
				then.call(
					// x.then 如果这样写,还会走get方法
					x,
					(y) => {
						// y 可能是一个promise,递归解析y的值,知道他是一个普通值为止
						if (called) return;
						called = true;
						resolvePromise(promise2, y, resolve, reject);
					},
					(r) => {
						if (called) return;
						called = true;
						reject(r);
					}
				);
			} else {
				resolve(x); // 普通对象
			}
		} catch (e) {
			if (called) return;
			called = true;
			reject(e); // 走失败逻辑
		}
	} else {
		// 如果不是,那一定是一个普通值
		resolve(x);
	}
}

class Promise {
	static deferred;
	public status: STATUS;
	public value: any;
	public reason: any;
	public onResolveCallbacks: Function[];
	public onRejectedCallbacks: Function[];
	constructor(
		executor: (
			resolve: (value?: any) => void,
			reject: (reason?: any) => void
		) => void
	) {
		this.status = STATUS.pending; // 当前默认状态
		this.value = undefined; // 成功值
		this.reason = undefined; // 失败原因
		this.onResolveCallbacks = [];
		this.onRejectedCallbacks = [];
		const resolve = (value?: any) => {
			if (this.status === STATUS.pending) {
				this.status = STATUS.fulfilled;
				this.value = value;
				// 发布订阅模式
				this.onResolveCallbacks.forEach((fn) => fn());
			}
		};
		const reject = (reason?: any) => {
			if (this.status === STATUS.pending) {
				this.status = STATUS.rejected;
				this.reason = reason;
				this.onRejectedCallbacks.forEach((fn) => fn());
			}
		};
		try {
			executor(resolve, reject);
		} catch (e) {
			reject(e);
		}
	}
	then(onFulfilled?, onRejected?) {
		onFulfilled =
			typeof onFulfilled === 'function' ? onFulfilled : (val) => val;
		onRejected =
			typeof onRejected === 'function'
				? onRejected
				: (err) => {
						throw err;
				  };
		// 每次调用then都产生一个全新的promise
		let promise2 = new Promise((resolve, reject) => {
			if (this.status === STATUS.fulfilled) {
				setTimeout(() => {
					try {
						let x = onFulfilled(this.value); // x可能是promise
						// resolve(x); // then的返回值作为下一次then的成功结果
						resolvePromise(promise2, x, resolve, reject);
					} catch (e) {
						reject(e);
					}
				}, 0);
			}
			if (this.status === STATUS.rejected) {
				setTimeout(() => {
					try {
						let x = onRejected(this.reason);
						resolvePromise(promise2, x, resolve, reject);
					} catch (e) {
						reject(e);
					}
				}, 0);
			}
			if (this.status === STATUS.pending) {
				setTimeout(() => {
					this.onResolveCallbacks.push(() => {
						// 切片
						// todo...额外的逻辑
						try {
							let x = onFulfilled(this.value);
							resolvePromise(promise2, x, resolve, reject);
						} catch (e) {
							reject(e);
						}
					});
					this.onRejectedCallbacks.push(() => {
						try {
							let x = onRejected(this.reason);
							resolvePromise(promise2, x, resolve, reject);
						} catch (e) {
							reject(e);
						}
					});
				}, 0);
			}
			resolve('ok');
		});
		return promise2;
	}
	catch(errFn) {
		return this.then(null, errFn);
	}
}

// -------------------------------------------------
Promise.deferred = function () {
	let dfd = {} as any;
	dfd.promise = new Promise((resolve, reject) => {
		dfd.resolve = resolve;
		dfd.reject = reject;
	});
	return dfd;
};

export default Promise;
