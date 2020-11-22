const Promise = require('./bundle');
let promise = new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve('ok');
	}, 1000);
	// reject('fail');
});

promise.then(
	(data) => {
		console.log('success', data);
	},
	(err) => {
		console.log('faild', err);
	}
);
