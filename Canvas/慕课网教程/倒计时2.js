/**
 * 倒计时2
 * @authors Your Name (you@example.org)
 * @date    2017-11-07 09:36:00
 * @version $Id$
 */

let RADIUS = 8,
	MARGINTOP = 60,
	MARGINLEFT = 30;
// let endTime = new Date();
// 当前时间+一小时
// endTime.setTime(endTime.getTime() + 3600 * 1000);
let curShowTimeSeconds = 0;
let balls = [],
	WINDOW_WIDTH = 1024,
	WINDOW_HEIGHT = 768;
const colors = ['#33b5e5', '#0099cc', '#aa66cc', '#9933cc', "#99cc00", '#669900', '#ffbb33', '#ff8800', '#ff4444']

window.onload = function() {
	// 浏览器宽度*0.8
	WINDOW_WIDTH = document.documentElement.clientWidth * 0.95;
	WINDOW_HEIGHT = document.documentElement.clientHeight / 2;
	// 将浏览器宽度分成10等分
	MARGINLEFT = Math.round(WINDOW_WIDTH / 10);
	// 4/5 代表文字总共占用屏幕的宽度 108为每个数字距离左边距的总和
	// 得出的结果为R+1 所以最后-1
	RADIUS = Math.round(WINDOW_WIDTH * 4 / 5 / 108) - 1;
	MARGINTOP = Math.round(WINDOW_HEIGHT / 5);

	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');

	canvas.width = WINDOW_WIDTH;
	canvas.height = WINDOW_HEIGHT;

	curShowTimeSeconds = getCurrentShowTimeSeconds();
	setInterval(function() {
		render(context);
		update();
	}, 50)
}

// 返回当前时间跟指定时间之间相差的秒数
function getCurrentShowTimeSeconds() {
	let curTime = new Date(),
		// ret = endTime.getTime() - curTime.getTime();
		// ret = ~~(ret / 1000); // ~~ = Math.floor()
		ret = curTime.getHours() * 3600 + curTime.getMinutes() * 60 + curTime.getSeconds();

	// return ret >= 0 ? ret : 0;
	return ret
}

// 绘制 函数内部用秒为单位
function render(cxt) {
	// 清空画布
	cxt.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
	let hours = parseInt(curShowTimeSeconds / 3600),
		minutes = parseInt((curShowTimeSeconds - hours * 3600) / 60),
		seconds = curShowTimeSeconds % 60;

	renderDigit(MARGINLEFT, MARGINTOP, parseInt(hours / 10), cxt);
	// 15*(RADUIS+1) 原因是数组为7*10 数组中的一个数宽度为2*(半径+距离边框的长度)
	// 即2*((R = RADIUS)+1) 即14*(RADIUS+1) 但是为什么是15 因为要让边距宽一点故+1
	renderDigit(MARGINLEFT + 15 * (RADIUS + 1), MARGINTOP, parseInt(hours % 10), cxt);
	// 分号
	renderDigit(MARGINLEFT + 30 * (RADIUS + 1), MARGINTOP, 10, cxt);
	// 因为分号为4*10数组 所以一个数的宽度就为 2*4*(RADIUS+1) 最后+1让边距宽一点
	renderDigit(MARGINLEFT + 39 * (RADIUS + 1), MARGINTOP, parseInt(minutes / 10), cxt);
	// 使用% 求余 56 % 10 = 6
	renderDigit(MARGINLEFT + 54 * (RADIUS + 1), MARGINTOP, parseInt(minutes % 10), cxt);
	renderDigit(MARGINLEFT + 69 * (RADIUS + 1), MARGINTOP, 10, cxt);
	renderDigit(MARGINLEFT + 78 * (RADIUS + 1), MARGINTOP, parseInt(seconds / 10), cxt);
	renderDigit(MARGINLEFT + 93 * (RADIUS + 1), MARGINTOP, parseInt(seconds % 10), cxt);

	// 绘制小球掉落
	for (let i = 0; i < balls.length; i++) {
		cxt.fillStyle = balls[i].color;
		cxt.beginPath();
		cxt.arc(balls[i].x, balls[i].y, RADIUS, 0, 2 * Math.PI, true);
		cxt.closePath();
		cxt.fill();
	};
}

// 数据的改变
function update() {
	// 当前要变化的时间距离指定b时间的秒数
	let nextShowTimeSeconds = getCurrentShowTimeSeconds();

	// 下一个要变化的时间
	let nextHours = parseInt(nextShowTimeSeconds / 3600),
		nextMinutes = parseInt((nextShowTimeSeconds - nextHours * 3600) / 60),
		nextSeconds = nextShowTimeSeconds % 60;


	// 当前时间
	let curHours = parseInt(curShowTimeSeconds / 3600),
		curMinutes = parseInt((curShowTimeSeconds - curHours * 3600) / 60),
		curSeconds = curShowTimeSeconds % 60;

	// 判断秒数 若不相同 则改变curShowTimeSeconds值
	if (nextSeconds != curSeconds) {
		// 对小时十位是否变化的判断
		if (parseInt(curHours / 10) != parseInt(nextHours / 10)) {
			addBalls(MARGINLEFT + 0, MARGINTOP, parseInt(curHours / 10))
		};
		// 小时中的个位
		if (parseInt(curHours % 10) != parseInt(nextHours % 10)) {
			addBalls(MARGINLEFT + 15 * (RADIUS + 1), MARGINTOP, parseInt(curHours % 10))
		};
		// 分钟 中的十位
		if (parseInt(curMinutes / 10) != parseInt(nextMinutes / 10)) {
			addBalls(MARGINLEFT + 39 * (RADIUS + 1), MARGINTOP, parseInt(curMinutes / 10))
		};
		// 分钟 中的个位
		if (parseInt(curMinutes % 10) != parseInt(nextMinutes % 10)) {
			addBalls(MARGINLEFT + 54 * (RADIUS + 1), MARGINTOP, parseInt(curMinutes % 10))
		};
		// 秒钟 中的十位
		if (parseInt(curSeconds / 10) != parseInt(nextSeconds / 10)) {
			addBalls(MARGINLEFT + 78 * (RADIUS + 1), MARGINTOP, parseInt(curSeconds / 10))
		};
		// 秒钟 中的个位
		if (parseInt(curSeconds % 10) != parseInt(nextSeconds % 10)) {
			addBalls(MARGINLEFT + 93 * (RADIUS + 1), MARGINTOP, parseInt(curSeconds % 10))
		};

		curShowTimeSeconds = nextShowTimeSeconds;
	};
	updateBalls();
	console.log(balls.length)
}

// 对已经存在的小球进行状态的更新
function updateBalls() {
	for (var i = 0; i < balls.length; i++) {
		balls[i].x += balls[i].vx;
		balls[i].y += balls[i].vy;
		balls[i].vy += balls[i].g;

		// 碰撞检测 底部
		if (balls[i].y >= WINDOW_HEIGHT - RADIUS) {
			balls[i].y = WINDOW_HEIGHT - RADIUS;
			balls[i].vy = -balls[i].vy * 0.75;
		};
	};

	/* 性能优化 */
	// 判断小球是否还留在画布中
	let cnt = 0;
	for (let i = 0; i < balls.length; i++) {
		if (balls[i].x + RADIUS > 0 && balls[i].x - RADIUS < WINDOW_WIDTH) {
			// 还保留在画布中的小球会在数组的前面
			balls[cnt++] = balls[i];
		}
		// 若小球长度大于cnt 则删除balls末尾的值
	};
	// Math.min(300, cnt) 若显示在画布中的小球多余300 直接取300
	while (balls.length > Math.min(300, cnt)) {
		balls.pop();
	}
}

// 添加小球
function addBalls(x, y, num) {
	for (let i = 0; i < digit[num].length; i++) {
		for (let j = 0; j < digit[num][i].length; j++) {
			if (digit[num][i][j] == 1) {
				let Aball = {
					x: x + j * 2 * (RADIUS + 1) + (RADIUS + 1),
					y: y + i * 2 * (RADIUS + 1) + (RADIUS + 1),
					g: 1.5 + Math.random(), // 1.5- 2.5之间
					// Math.pow(x, y)表示 x的y次幂    0-1000之间 ceil向上取整
					vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 4,
					vy: -5,
					color: colors[~~(Math.random() * colors.length)]
				}

				balls.push(Aball);
			}
		}
	}

}

// 执行画的操作
function renderDigit(x, y, num, cxt) {
	cxt.fillStyle = "rgb(0, 102, 153)";
	for (let i = 0; i < digit[num].length; i++) {
		for (let j = 0; j < digit[num][i].length; j++) {
			if (digit[num][i][j] == 1) {
				cxt.beginPath();
				cxt.arc(x + j * 2 * (RADIUS + 1) + (RADIUS + 1), y + i * 2 * (RADIUS + 1) + (RADIUS + 1), RADIUS, 0, 2 * Math.PI);
				cxt.closePath();
				cxt.fill();
			};
		};
	};
}