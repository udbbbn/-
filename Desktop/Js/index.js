$("#Nav li").bind("click", function(){

})

function Drag(x, y){
	this.x = x;
	this.y = y;
	this.init();
}
Drag.prototype = {
	init: function(){
		$("body")[0].offsetWidth / 2
	}
}
var arr = [2, 6, 3, 9, 1, 6];

arr.sort(function(cur, nex) {
    return cur - nex
})