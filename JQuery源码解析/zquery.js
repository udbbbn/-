/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2017-08-16 10:34:06
 * @version $Id$
 */

(function(window, undefined) {

	var
	// 提前声明数组 字符串 obj
		core_obj = {},
		core_version = "0.1",
		core_array = [],

		// 初始化方法
		core_concat = core_array.concat,
		core_push = core_array.push,
		core_slice = core_array.slice,
		core_indexOf = core_array.indexOf,
		core_toString = core_obj.toString,
		core_hasOwn = core_obj.hasOwnProperty,
		core_trim = core_version.trim,

		zQuery = function(selector, context) {
			return new zQuery.fn.init(selector, context);
		}
	zQuery.prototype = zQuery.fn = {
		constructor: zQuery,
		// 构造器
		init: function(selector, context) {
			// 处理$("") $(null) $(undefined) $(false)
			if (!selector) {
				return this;
			};
			// 处理字符串
			if (typeof selector === "string") {
				this.length = 1;
				if (selector.charAt("#"))
					this[0] = document.getElementById(selector.split("#")[1]);
				this.selector = selector;
				this.context = document;
			};
			return this;
		},
		// 将dom元素集合加入到zQuery栈
		pushStack: function(elems) {
			var ret = zQuery.merge(this.constructor(), elems);
			// 用这个属性可以获取到上个zQuery对象
			ret.prevObject = this;
			ret.context = this.context;

			return ret;
		},
		// 获取栈内上一个对象
		end: function() {
			return this.prevObject || this.constructor(null);
		},
		each: function(callback, args) {
			return zQuery.each(this, callback, args);
		},
		length: 0,
		push: core_push,
		sort: [].sort,
		splice: [].splice
	}
	zQuery.fn.init.prototype = zQuery.fn;

	// 拓展方法 	暂未涉及到深拷贝
	zQuery.extend = zQuery.fn.extend = function() {
			var target = arguments[0] || {},
				length = arguments.length,
				i = 1,
				options, src, copy;

			//判断zQuery.extend(obj)情况 
			if (length === i) {
				target = this;
				--i;
			}

			// 添加属性到对象
			for (; i < length; i++) {
				if ((options = arguments[i]) != null) {
					for (name in options) {
						src = target[name];
						copy = options[name];
						target[name] = copy;
					}
				};
			};

		},

		zQuery.extend({
			// 判断类型
			type: function(obj) {
				if (obj == null) {
					return String(obj);
				};
				return typeof obj === "object" || typeof obj === "function" ?
					core_obj[core_toString.call(obj)] || 'object' :
					typeof obj;
			},
			// 判断类数组
			isArraylike: function(obj) {
				var length = obj.length,
					type = zQuery.type(obj);
				// return core_toString.call(v) === '[object Array]';
				return type === "array" || type !== "function" &&
					(length === 0 || typeof length === "number" && length > 0 && (length - 1) in obj);
			},
			// until暂未判断
			dir: function(elem, dir, until) {
				var matched = [],
					cur = elem[dir];

				while (cur && cur.nodeType !== 9) {
					if (until && cur != until) {
						break;
					};
					if (cur.nodeType === 1) {
						matched.push(cur);
					};
					cur = cur[dir];
				}
				return matched;
			}
		}),

		zQuery.extend({
			// 循环执行函数
			each: function(obj, callback, args) {
				var value, i = 0,
					length = obj.length,
					isArray = this.isArraylike(obj);

				if (isArray) {
					for (; i < length; i++) {
						value = callback.call(obj[i], i, obj[i]);
						if (value === false) {
							break
						};
					};
				} else {
					for (i in obj) {
						value = callback.call(obj[i], i, obj[i]);
						if (value === false) {
							break
						};
					}
				}
				return obj;
			},
			// 合并数组
			merge: function(first, second) {
				var j = first.length,
					l = second.length,
					i = 0;
				if (typeof l === "number") {
					for (; i < l; i++) {
						first[j++] = second[i]
					};
				} else {
					while (second[i] !== undefined) {
						first[j++] = second[i++]
					}
				};
				first.length = j;
				return first;
			},
			// 替换原生map方法
			map: function(elems, callback, arg) {
				var value,
					i = 0,
					length = elems.length,
					isArray = this.isArraylike(elems),
					ret = [];

				if (isArray) {
					for (; i < length; i++) {
						value = callback(elems[i], i, arg);
						if (value !== null) {
							ret.push(value);
						};
					};
				} else {
					for (i in elems) {
						value = callback(elems[i], i, arg);
						if (value !== null) {
							ret.push(value);
						};
					}
				};
				return ret;
			}
		})
		// 存储所有类型
	zQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
		core_obj["[object " + name + "]"] = name.toLowerCase();
	});
	zQuery.each({
		parent: function(elem) {
			var elem = elem.parentNode;
			return elem && elem.nodeType !== 11 ? elem : null;
		},
		parents: function(elem) {
			// var matched = [];
			// while ((elem = elem['parentNode']) && elem.nodeType !== 9) {
			// 	if (elem.nodeType === 1) {
			// 		matched.push(elem);
			// 	};
			// }
			// return matched;
			return zQuery.dir(elem, "parentNode")
		},
		parentsUntil: function(elem, until) {
			return zQuery.dir(ele, 'parentNode', until);
		}
	}, function(name, fn) {
		zQuery.fn[name] = function(until, selector) {
			var ret = zQuery.map(this, fn, until);
			return this.pushStack(ret);
		};
	})

	window.$ = window.zQuery = zQuery;
})(window)