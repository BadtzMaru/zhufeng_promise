'use strict';

// 1. promise 可以解决多个异步并行执行,最终得到所有的结果
// 2. 异步嵌套问题
// 核心的逻辑,解析x的类型来解析promise2是成功还是失败
function resolvePromise(promise2, x, resolve, reject) {
    // 判断 x 的值决定promise2的关系, 来判断有可能X是别人的promise,可能别人的promise会出问题
    if (x === promise2) {
        return reject(new TypeError('出错了'));
    }
    if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
        // 只有x是对象或者函数才有可能是promise
        var called_1 = false; // 表示没调用过成功和失败
        try {
            var then = x.then; // 取x上的then方法
            if (typeof then === 'function') {
                then.call(
                // x.then 如果这样写,还会走get方法
                x, function (y) {
                    // y 可能是一个promise,递归解析y的值,知道他是一个普通值为止
                    if (called_1)
                        return;
                    called_1 = true;
                    resolvePromise(promise2, y, resolve, reject);
                }, function (r) {
                    if (called_1)
                        return;
                    called_1 = true;
                    reject(r);
                });
            }
            else {
                resolve(x); // 普通对象
            }
        }
        catch (e) {
            if (called_1)
                return;
            called_1 = true;
            reject(e); // 走失败逻辑
        }
    }
    else {
        // 如果不是,那一定是一个普通值
        resolve(x);
    }
}
var Promise = /** @class */ (function () {
    function Promise(executor) {
        var _this = this;
        this.status = "PENDING" /* pending */; // 当前默认状态
        this.value = undefined; // 成功值
        this.reason = undefined; // 失败原因
        this.onResolveCallbacks = [];
        this.onRejectedCallbacks = [];
        var resolve = function (value) {
            if (_this.status === "PENDING" /* pending */) {
                _this.status = "FULFILLED" /* fulfilled */;
                _this.value = value;
                // 发布订阅模式
                _this.onResolveCallbacks.forEach(function (fn) { return fn(); });
            }
        };
        var reject = function (reason) {
            if (_this.status === "PENDING" /* pending */) {
                _this.status = "REJECTED" /* rejected */;
                _this.reason = reason;
                _this.onRejectedCallbacks.forEach(function (fn) { return fn(); });
            }
        };
        try {
            executor(resolve, reject);
        }
        catch (e) {
            reject(e);
        }
    }
    Promise.prototype.then = function (onFulfilled, onRejected) {
        var _this = this;
        onFulfilled =
            typeof onFulfilled === 'function' ? onFulfilled : function (val) { return val; };
        onRejected =
            typeof onRejected === 'function'
                ? onRejected
                : function (err) {
                    throw err;
                };
        // 每次调用then都产生一个全新的promise
        var promise2 = new Promise(function (resolve, reject) {
            if (_this.status === "FULFILLED" /* fulfilled */) {
                setTimeout(function () {
                    try {
                        var x = onFulfilled(_this.value); // x可能是promise
                        // resolve(x); // then的返回值作为下一次then的成功结果
                        resolvePromise(promise2, x, resolve, reject);
                    }
                    catch (e) {
                        reject(e);
                    }
                }, 0);
            }
            if (_this.status === "REJECTED" /* rejected */) {
                setTimeout(function () {
                    try {
                        var x = onRejected(_this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    }
                    catch (e) {
                        reject(e);
                    }
                }, 0);
            }
            if (_this.status === "PENDING" /* pending */) {
                setTimeout(function () {
                    _this.onResolveCallbacks.push(function () {
                        // 切片
                        // todo...额外的逻辑
                        try {
                            var x = onFulfilled(_this.value);
                            resolvePromise(promise2, x, resolve, reject);
                        }
                        catch (e) {
                            reject(e);
                        }
                    });
                    _this.onRejectedCallbacks.push(function () {
                        try {
                            var x = onRejected(_this.reason);
                            resolvePromise(promise2, x, resolve, reject);
                        }
                        catch (e) {
                            reject(e);
                        }
                    });
                }, 0);
            }
            resolve('ok');
        });
        return promise2;
    };
    Promise.prototype.catch = function (errFn) {
        return this.then(null, errFn);
    };
    return Promise;
}());
// -------------------------------------------------
Promise.deferred = function () {
    var dfd = {};
    dfd.promise = new Promise(function (resolve, reject) {
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
};

module.exports = Promise;
