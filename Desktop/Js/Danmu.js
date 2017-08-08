
function Flag(){
	this._cW = $(".Content_L_T")[0].offsetWidth;
	this._cH = $(".Content_L_T")[0].offsetHeight;
	this.init();
}
Flag.prototype = {
	init: function(){
		if (($('.Send').val()).replace(/\s+/g,'') == "") {
			alert('请输入弹幕');
			return;
		}
		this.create($('.Send').val());
	},
	/*****************创建弹幕****************/
	create: function(txt){
		Flag.target = $("<span>",{"innerHTML":txt}).appendTo($(".danmu")[0]).css("left",this._cW + 'px')[0];
		this.roll.call(Flag.target,{
			timing: ['linear','ease-out'][~~(Math.random() * 2)],
			color: '#' + (~~(Math.random() * (1 << 24))).toString(16),
			top: ~~(Math.random()*(this._cH - 30)),
			fontSize:~~(Math.random()*(18 - 12 + 1) + 12)
		});
		this.AddTitle($('.Send').val());
		$('.Send').val('');
	},
	/*****************弹幕滚动****************/
	roll: function(obj){
		obj.timing = obj.timing || "linear";
		this.style.color = obj.color || "#fff";
		this.style.top = (obj.top || 0) + "px";
		this.style.fontSize = obj.fontSize || 14;
		this._Left = parseInt(this.offsetLeft);
		this.timer = setInterval(function(){
			if (this._Left <= 25) {
				clearInterval(this.timer);
				this.parentNode.removeChild(this);
				return
			}
			switch(obj.timing){
				case 'linear':
					this._Left -= 2;
					break;
				case 'ease-out':
					this._Left += (0 - this._Left) * 0.01;
					break;
			}
			this.style.left = this._Left + "px";
		}.bind(this),10)
	},
	/*****************添加至弹幕栏****************/
	AddTitle: function(txt){
		var now = this.DateHandle();
		$("<li><p>"+ $("#nowTime").html() +"</p>" +
			"<p>"+ txt + "</p>" +
			"<p>"+ now +"</p></li>").appendTo($("ul")[0]);
		$('.Content_R_T span').text(parseInt($('.Content_R_T span').text()) + 1);
	},
	/*****************日期处理函数****************/
	DateHandle: function(){
		var _Date = new Date();
		var _DObj = {
			Date: _Date.getMonth() + 1,
			Day: _Date.getDate(),
			Hours: _Date.getHours(),
			Minutes: _Date.getMinutes()
		}
		for(var key in _DObj){
			if (_DObj[key] < 10) {
				_DObj[key] = "0" + _DObj[key];
			}
		}
		var result = _DObj.Date + "-" + _DObj.Day + " " + _DObj.Hours + ":" + _DObj.Minutes;
		return result
	}
}

function Send(){
	new Flag();
}

$(document).ready(function(){
	Init();
})

/*****************事件绑定****************/
function Init(){
	/*弹幕发送*/
	$('.Send').keydown(function(e){
		if (e.keyCode === 13) {
			Send();
		}
	});
	/*播放暂停*/
	$(".play_button").bind('click',function(){
		if ($("#video")[0].paused){
			$("#video")[0].play();
			$(".play_button i")[0].style.backgroundPosition = "-110px 0";
		}else{
			$("#video")[0].pause();
			$(".play_button i")[0].style.backgroundPosition = "-68px 0";
		}
	});
	/*音量*/
	$(".play_volume i").bind("click", function(){
		if ($("video").get(0).muted) {
			$(".play_volume").attr("title", "音量选择");
			$("video").get(0).muted = false;
			$(".play_volume i").get(0).style.backgroundPosition = "0px 0px";
		}else{
			$(".play_volume").attr("title", "音量关闭");
			$("video").get(0).muted = true;
			$(".play_volume i").get(0).style.backgroundPosition = "-21px 0";
		}
	});
	/*全屏*/
	$(".play_maxscreen").bind("click", function(){
		$("video").get(0).webkitRequestFullScreen();
	})
	/*弹幕开关*/
	$(".play_danmu i").bind("click", function(){
		if ($(".danmu").get(0).style.display == "none"){
			$(".danmu").get(0).style.display = "block";
			return
		}
		$(".danmu").get(0).style.display = "none";
	});
	$("video").bind("load", function(){
		Player.Init()
	})
}
var Player = {
	Init: function(){
		/*播放器初始化*/
		var allTime = Math.floor(($("video").get(0).duration / 60));
		$("#allTime").html(allTime);
	}
}
