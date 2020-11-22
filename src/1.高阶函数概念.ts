// promise 都是基于回调模式的

// 高阶函数 1.如果函数的参数是一个函数 2.函数返回了一个函数

// 基于原来的代码来扩展
declare global {
    type Callback = () => void;
    type ReturnFn = (...args:any[]) => void; 
    // 接口的合并
    interface Function{
        before(fn: Callback):ReturnFn;
    }
}

Function.prototype.before = function (fn) {
	// 这里的this
	return (...args) => {
		fn(); // 先调用before方法
		this(...args); // 再调用原有的core方法
	};
};

function core(...args) {
	console.log('core...',...args);
}

let fn = core.before(() => {
	console.log('before core ...');
});

fn(1, 2, 3);

export {}