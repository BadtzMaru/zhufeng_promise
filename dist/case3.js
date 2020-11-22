const Promise = require('./bundle');

let promise = new Promise((resolve, reject) => {
	resolve('ok');
}).then(
	(data) => {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve('xx');
			}, 1000);
		});
	},
	(err) => {}
);

let promise2 = promise.then((data) => {
	console.log(data);
});
