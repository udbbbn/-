/**
 * promise源码分析
 * 本demo 学习至 https://github.com/xieranmaya/blog/issues/3
 * @authors Your Name (you@example.org)
 * @date    2017-11-30 09:01:45
 * @version $Id$
 */

// promise构造函数
function Promise(exec) {
	var self = this;
	self.status = 'pending'; // promise当前状态
	self.data = undefined; // promise当前的值
	self.onResolvedCallback = []; // resolve resolve回调函数集
	self.onRejectedCallback = []; // resolve reject回调函数集

	function resolve(val) {
		if (val instanceof Promise) {
			return val.then(resolve, reject)
		}
		setTimeout(function() {
			if (self.status === "pending") {
				// 更改状态 赋值 并执行回调函数
				self.status = 'resolved';
				self.data = val;
				for (var i = 0; i < self.onResolvedCallback.length; i++) {
					self.onResolvedCallback[i](val);
				};
			};
		});
	}

	function reject(val) {
		setTimeout(function() {
			if (self.status === "pending") {
				// 更改状态 赋值 并执行回调函数
				self.status = 'rejected';
				self.data = val;
				// 若该数组为空 则表示其错误没有函数可以处理
				// 这时候需要让开发者发现
				if (self.onRejectedCallback.length === 0) {
					console.error(val)
				}
				for (var i = 0; i < self.onRejectedCallback.length; i++) {
					self.onRejectedCallback[i](val);
				};
			};
		});
	}

	// 考虑到执行exec的过程可能会出错 
	// 使用try catch 保证出错后执行reject
	try {
		exec(resolve, reject); // 执行exec并传入相应参数
	} catch (e) {
		reject(e)
	}
}

/*
	详见 promise A+规范 http://malcolmyu.github.io/malnote/2015/06/12/Promises-A-Plus/
resolvePromise函数即为根据x的值来决定promise2的状态的函数
也即标准中的[Promise Resolution Procedure](https://promisesaplus.com/#point-47)
x为`promise2 = promise1.then(onResolved, onRejected)`里`onResolved/onRejected`的返回值
`resolve`和`reject`实际上是`promise2`的`executor`的两个实参，因为很难挂在其它的地方，所以一并传进来。
相信各位一定可以对照标准把标准转换成代码，这里就只标出代码在标准中对应的位置，只在必要的地方做一些解释
*/
function resolvePromise(promise2, x, resolve, reject) {
	var then;
	var thenCalledOrThrow = false;

	if (promise2 === x) { // 对应标准2.3.1节
		return reject(new TypeError('Chaining cycle detected for promise!'))
	}

	if (x instanceof Promise) { // 对应标准2.3.2节
		// 如果x的状态还没有确定，那么它是有可能被一个thenable决定最终状态和值的
		// 所以这里需要做一下处理，而不能一概的以为它会被一个“正常”的值resolve
		if (x.status === 'pending') {
			x.then(function(value) {
				resolvePromise(promise2, value, resolve, reject)
			}, reject)
		} else { // 但如果这个Promise的状态已经确定了，那么它肯定有一个“正常”的值，而不是一个thenable，所以这里直接取它的状态
			x.then(resolve, reject)
		}
		return
	}

	if ((x !== null) && ((typeof x === 'object') || (typeof x === 'function'))) { // 2.3.3
		try {

			// 2.3.3.1 因为x.then有可能是一个getter，这种情况下多次读取就有可能产生副作用
			// 即要判断它的类型，又要调用它，这就是两次读取
			then = x.then
			if (typeof then === 'function') { // 2.3.3.3
				then.call(x, function rs(y) { // 2.3.3.3.1
					if (thenCalledOrThrow) return // 2.3.3.3.3 即这三处谁选执行就以谁的结果为准
					thenCalledOrThrow = true
					return resolvePromise(promise2, y, resolve, reject) // 2.3.3.3.1
				}, function rj(r) { // 2.3.3.3.2
					if (thenCalledOrThrow) return // 2.3.3.3.3 即这三处谁选执行就以谁的结果为准
					thenCalledOrThrow = true
					return reject(r)
				})
			} else { // 2.3.3.4
				resolve(x)
			}
		} catch (e) { // 2.3.3.2
			if (thenCalledOrThrow) return // 2.3.3.3.3 即这三处谁选执行就以谁的结果为准
			thenCalledOrThrow = true
			return reject(e)
		}
	} else { // 2.3.4
		resolve(x)
	}
}

// then方法接收两个参数 onResolved onRejected 
// 分别为Promise成功或失败的回调
Promise.prototype.then = function(onResolved, onRejected) {
	var self = this;
	var promise2;

	// 根据标准 如果then的 参数不是function 则忽略
	onResolved = typeof onResolved === "function" ? onResolved : function(val) {
		return val
	};
	// 最后的函数作用为 值穿透 将then默认参数往后抛
	onRejected = typeof onRejected === "function" ? onRejected : function(rea) {
		throw rea
	};

	if (self.status === "resolved") {
		// 如果promise1(此处为this/self)的状态是resolved 则调用onResolved
		// 考虑到可能throw 故使用try catch
		return promise2 = new Promise(function(resolve, reject) {
			setTimeout(function() {
				try {
					var x = onResolved(self.data);
					resolvePromise(promise2, x, resolve, reject);
					// if (x instanceof Promise) {
					// 	// 如果onresolved的返回值是一个promise对象 直接取其结果
					// 	x.then(resolve, reject)
					// };
					// resolve(x); // 否则以它的返回值作为promise2的结果
				} catch (e) {
					reject(e); // 如果出错 以捕获到的结果作为promise2的结果
				}
			})
		})
	};

	if (self.status === "rejected") {
		return promise2 = new Promise(function(resolve, reject) {
			setTimeout(function() {
				try {
					var x = onRejected(self.data);
					resolvePromise(promise2, x, resolve, reject);
					// if (x instanceof Promise) {
					// 	x.then(resolve, reject);
					// };
				} catch (e) {
					reject(e);
				}
			})
		})
	};

	if (self.status === "pending") {
		// 如果当时的promise还处于pending状态 只能等promise状态确定后才能处理
		// 所以我们需要把我们的处理作为callback放入promise1的回调函数中
		// 此处不需要异步 因为函数势必会被resolve或reject调用
		return promise2 = new Promise(function(resolve, reject) {
			self.onResolvedCallback.push(function(val) {
				try {
					var x = onResolved(self.data);
					resolvePromise(promise2, x, resolve, reject);
					// if (x instanceof Promise) {
					// 	x.then(resolve, reject);
					// };
				} catch (e) {
					reject(e);
				}
			})

			self.onRejectedCallback.push(function(reason) {
				try {
					var x = onRejected(reason)
					resolvePromise(promise2, x, resolve, reject)
				} catch (r) {
					reject(r)
				}
			})
		})
	};
};

// 为了下文方便 实现catch方法
Promise.prototype.catch = function(onRejected) {
	return this.then(null, onRejected);
};

Promise.cancel = Promise.stop = function() {
	return new Promise(function() {})
}

Promise.prototype.done = function() {
	return this.catch(function(e) { // 此处一定要确保这个函数不能再出错
		console.error(e)
	})
}

Promise.deferred = Promise.defer = function() {
	var dfd = {}
	dfd.promise = new Promise(function(resolve, reject) {
		dfd.resolve = resolve
		dfd.reject = reject
	})
	return dfd
}