	function Observer(data){
		this.data = data;
		this.walk(data);
	}

	Observer.prototype = {
		walk: function(data){
			var _this = this;
			Object.keys(data).forEach(function(key){
				_this.convert(key, data[key]);
			})
		},
		convert: function(key, val){
			this.defineReactive(this.data, key, val)
		},
    /* -------------设置属性为访问器--------------- */
		defineReactive:function(data, key, val){
			var dep = new Dep();
			var childObj = observer(val);//监听子属性

			Object.defineProperty(data, key, {
				enumerable: true, // 可枚举
				configurable: false,  //不能再define
				set: function(newVal){
					if (newVal == val) {return}
					val = newVal;
					//若新的值为obj 进行监听
					childObj = observer(newVal);
					//通知订阅者
					dep.notify();
				},
				get: function(){
				//由于需要在闭包内添加watcher 所以通过Dep定义一个全局target属性 暂存watcher
					Dep.target && dep.depend();
					return val;
				}
			})
		}
	}

	/* -------------数据监听器--------------- */
	function observer(data){
		if (!data || typeof data !== 'object'){
			return;
		}
		return new Observer(data);
	}

	var uid = 0;

    /* -------------主题对象--------------- */
	function Dep(){
		this.id = uid++;
		this.subs = [];
	}
	Dep.prototype = {
		addSub: function(sub){
			this.subs.push(sub);
		},
		notify: function(){
			this.subs.forEach(function(sub){
				sub.update();
			})
		},
		depend: function(){
			Dep.target.addDep(this);
		},
		removeSub: function(sub){
			var index = this.subs.indexOf(sub);
			if (index != -1) {
				this.sub.splice(index, 1);
			}
		}
	}
	Dep.target = null;
