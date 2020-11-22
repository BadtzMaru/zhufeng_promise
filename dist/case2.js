// promise是支持链式调用的

// 1. 无论成功还是失败,都可以返回结果 (1. 出错了, 2.返回一个普通值(不是promise的值),就会作为下一次then的成功结果) 3. 是promise的情况(会采用返回的promise的状态)

// 1. 普通值 调用then方法会返回一个全新的promise(不能返回this)
const Promise = require('./bundle');

let promise2 = new Promise((resolve, reject) => {
	resolve('ok');
}).then(
	(data) => {
		return 1;
	},
	(err) => {
		throw new Error('错误');
	}
);

promise2.then(
	(data) => {
		console.log(data, '***');
	},
	(err) => {
		console.log(err, '---');
	}
);
