
;(function($){
    $.fn.Paging = function(el, num, pagenum, page, cb){
var PageNum = 0; // 全局变量 当前页
var Index = 0; //全局变量 索引
var Pageall = 0; //全局变量 总页数
/*
 **  @param {element} el 需要插入分页控件的位置
 **  @param {number} num 数据的数量
 **  @param {number} pagenum 一页中数据量的多少
 **  @param {number} page 显示当前是第几页
 **  @param {function} cb 回调函数
 */
var PPage = function() {
    PageNum = page; //获取当前页面
    Index = page - 1; //获取当前页码的索引
    var i = 1 //用于循环
    var _el = $(el)[0]; //获取需要插入分页控件的元素
    var _pagen = Math.ceil(num / pagenum); //获取总页数，数据的数量/一页中的数量，向上取整
    Pageall = _pagen; //获取总页数
    //判断总页数是否大于10
    if (_pagen > 10) { //如果总页数大于10页
        _pagen = 10; //则让总页数等于10
    }
    //判断是否拥有分页控件
    if (_el.getElementsByClassName('Paging')[0]) {
        return false; //有的话就不添加新的分页控件
    }
    var _page = $("<div class='Paging'></div>");
    $(_el).append(_page);//创建分页控件的整体部分
    var _pagenode = $("<div class='PagingParent'></div>")
    $(_page).append(_pagenode);//创建分页控件的父级
    var _home = $("<div class='page' title='首页' pid='1'>首页</div>")[0];
    _home.pid = 1;
    _home.onclick = function() {
        FPage(this, PageNum, _pagen)
    }//创建分页的首页功能
    $(_pagenode).append(_home)

    var _prePage = $("<div class='page' title='上一页' pid='3'>上一页</div>")[0];
    _prePage.pid = 3;
    _prePage.onclick = function() {
        FPage(this, PageNum, _pagen)
    }//创建分页的上一页功能
    $(_pagenode).append(_prePage)


    var _pagenum = $("<div style='float:left'></div>");
    $(_pagenode).append(_pagenum)//创建中间页码数的整体
    for (i; i < _pagen + 1; i++) { //循环有多少个页码，并且进行创建
        var _pageOne = $("<div class='list'>" + i + "</div>")[0];
        _pageOne.pid = 5;
        _pageOne.onclick = function() {
            FPage(this, PageNum, _pagen)
        }// 创建中间的页码数
        $(_pagenum).append(_pageOne)
    }


    var _nextPage = $("<div class='page' title='下一页'>下一页</div>")[0];
    _nextPage.pid = 4;
    _nextPage.onclick = function() {
        FPage(this, PageNum, _pagen)
    }//创建下一页功能
    $(_pagenode).append(_nextPage)


    var _endPage = $("<div class='page' title='尾页'>尾页</div>")[0];
    _endPage.pid = 2;
    _endPage.onclick = function() {
        FPage(this, PageNum, _pagen)
    }//创建尾页功能
    $(_pagenode).append(_endPage)

    var _pages = $("<div></div>"); //创建跳转页面的整体
    $(_page).append(_pages)

    var _pagesk = $("<div></div>"); //创建跳转页面的父级
    $(_pages).append(_pagesk)

    var _span = $("<span style='float:left;line-height:50px;margin-right:10px;'>到</span>"); //创建跳转元素
    $(_pagesk).append(_span)

    var _pagejump = $("<div></div>"); //创建页码输入框的父级
    $(_pagesk).append(_pagejump)

    var _a = $("<input class='classinput' type='text' style='float:left;width:50px;height:50px;border:1px solid #2d9bef;margin-right:10px;text-align: center;' />");//创建页码输入框
    $(_pagejump).append(_a)

    var _b = $("<span style='float:left;line-height:50px;margin-right:10px;'>页</span>");//创建跳转元素
    $(_pagesk).append(_b)

    var _c = $("<div class='page'>确定</div>")[0];//创建跳转元素
    _c.pid = 6;
    _c.onclick = function() {
        FPage(this, PageNum, _pagen)
    }//创建确定按钮
    $(_pages).append(_c)

    if (PageNum < _pagen + 1) { //获取当前页面是否小于总页数
        var _list = $(".list"); //获取所有的中间页码数
        for (var j = 1; j < _list.length + 1; j++) { //循环所有的中间页码数
            if (PageNum == j) { //判断当前页码数是否等于中间页码数的一个
                _list[PageNum - 1].style.backgroundColor = "#2d9bef"; //如果是 改变页码数的样式
            }
        }
    }
    var _keypage = $(".classinput")[0]; //获取输入框的元素
    _keypage.onkeyup = function() { //做一个键盘按下的功能
        if (event.keyCode == "13") { //判断是否是回车键
            $(".page")[4].onclick(); //执行确认按钮的功能
        }
    }
}
PPage(el, num, pagenum, page, cb); // 执行函数 
/*
 **  作用：用于首页 上一页 下一页 尾页 输入框跳转 点击中间页码数的功能实现
 **  @param {element} el 获取当前元素
 **  @param {number} page 当前页数
 **  @param {number} pagen 总页数
 */
var FPage = function(el, page, pagen) {
    var _list = $(".list"); //获取当前所有的中间页码元素
    for (var i = 0; i < _list.length; i++) { //循环所有的中间页码元素
        _list[i].style.backgroundColor = ""; //清空所有页码的点击样式
    }
    if (el.pid == 1) { //pid为1时，执行首页的功能
        if (Index == 0) { Index++ } //判断当前索引是否为0，如果是 则执行索引++
        if (page > 1) { //判断当前页数是否大于1
            _list[0].style.backgroundColor = "#2d9bef"; //获取第一个页码点击样式
            Index = 0; //获取索引为0
            PageNum = 1 //获取当前页数为1
            Pagefun(PageNum); //执行页码跳转功能
            return
        }
        _list[--Index].style.backgroundColor = "#2d9bef"; //如果小于1，则不进行页码跳转
    } else if (el.pid == 2) { //pid为2时，执行尾页功能
        if (page < Pageall) { //判断当前页码是否小于总页数
            Index = pagen; //获取索引值为总页数
            PageNum = Pageall //获取全局变量的当前页为总页数
            Pagefun(PageNum); //执行页码跳转功能
            return
        } else {
            _list[Index].style.backgroundColor = "#2d9bef"; //如果当前页码不小于总页数，则不执行页码跳转
        }
    } else if (el.pid == 3) { //pid为3时，执行上一页功能
        if (Index > 0) { //判断当前索引是否大于0
            _list[--Index].style.backgroundColor = "#2d9bef"; //获取当前页的上一个页码的点击样式
            PageNum--; //并且当前页减一
            Pagefun(PageNum); //执行页码跳转功能
            return
        } else { // 判断第一页
            _list[Index].style.backgroundColor = "#2d9bef"; //获取第一页的点击样式
        }
    } else if (el.pid == 4) { //pid为4时，执行下一页功能
        if (PageNum < Pageall) { //判断当前页码是否小于总页数
            _list[++Index].style.backgroundColor = "#2d9bef"; //获取当前页的下一个页码的点击样式
            PageNum++; //并且当前页码加一
            Pagefun(PageNum); //执行页码跳转功能
            return
        } else { // 判断最后一页
            _list[Index].style.backgroundColor = "#2d9bef"; //获取最后一页的点击样式
        }
    } else if (el.pid == 5) { //pid为5时，执行点击中间页码跳转功能
        Pagefun(el); //执行页码跳转功能
        return
    } else if (el.pid == 6) { //pid为6时，执行输入框功能
        var _input = $(".classinput")[0]; //获取输入框的元素
        var _number = new RegExp("^[0-9]*$") //写一个正则表达式，只能够输入数字
        if (_input.value.match(_number)) { //判断输入的是否是数字
            if (_input.value >= 1 && _input.value <= Pageall) { //判断输入的数字是否大于等于1，并且，输入的数字小于等于总页数
                PageNum = _input.value; //输入的值为当前页码数
                Pagefun(PageNum); //执行页码跳转功能
            } else { //如果输入的不是数字
                U.Alert("无效的输入"); //则弹窗提示
                _list[Index].style.backgroundColor = "#2d9bef"; //并且点击样式不改变
            }
        }
    }
}
/*
 **  作用：用于首页、上一页、下一页、尾页、输入框、点击页码进行页码跳转的功能
 **  @param {element} el  当前页码数
 */
var Pagefun = function(el) {
    var _list = $(".list"); //获取所有的中间页码数
    var elNum = parseInt(el.innerHTML) || el; // 获取当前点击页码
    for (var i = 0; i < _list.length; i++) { //循环所有的中间页码数
        _list[i].style.backgroundColor = ""; //清空所有的中间页码数的点击样式
    }
    var _listLength = Math.ceil(_list.length / 2); // 获取页码长度的一半
    var Index; // 记录点击时的页码的索引
    var preIndex = Index; // 上一个页码索引
    var difference = null; // 计算当前页码跟所点击的页码的差异


    var lastPage = parseInt($(".list")[$(".list").length - 1].innerText); // 当前页码的最后一个数的页码
    //判断当前点击页码是否小于页码长度的一半，或者当前点击页码大于当前页码的最后一个数的页码减去页码长度的一半并且当前点击页码小于等于总页码数
    if (!(elNum < _listLength || (elNum > Pageall - _listLength && elNum <= Pageall))) { //这里有个取反
        // 点击页码中间以后的页码处理 例如 1 2 3 4 .... 8 9 则 5以后的页码点击处理事件
        //判断当前页码的最后一个数除以当前点击页码，向上取整，是否小于当前页码的最后一个数减去当前点击页码，并且索引值不为0
        if (!(Math.ceil(lastPage / elNum) < lastPage - elNum) && Index != 0) { //这里有一个取反
            difference = elNum - parseInt(_list[_listLength - 1].innerText); // 计算差异
            [].__proto__.forEach.apply($(".list"), [function(value, index, ar) { //forEach循环数组，循环所有获取到的中间页码数，并且获取数组中的每一个元素的索引
                value.innerText = parseInt(value.innerText) + difference; // 跟中间的值进行比较
            }])
            Index = _listLength - 1; // 记录索引
        } else {
            // 向页码中间以前的页码点击处理事件
            difference = elNum - parseInt(_list[_listLength - 1].innerText); //计算当前页码跟所点击的页码的差异
            [].__proto__.forEach.apply($(".list"), [function(value, index, ar) { //forEach循环数组，循环所有获取到的中间页码数，并且获取数组中的每一个元素的索引
                value.innerText = parseInt(value.innerText) + difference; // 跟中间的值进行比较
            }])
            Index = _listLength - 1; // 记录索引
        }
    } else if (elNum > Pageall - _listLength && elNum <= Pageall) { // 最大页码设置
        difference = Pageall - elNum;
        [].__proto__.forEach.apply($(".list"), [function(value, index, ar) { //forEach循环数组，循环所有获取到的中间页码数，并且获取数组中的每一个元素的索引
            value.innerText = Pageall + 1 - ar.length + index; // 跟中间的值进行比较
        }])
    } else if (elNum < _listLength) { // 最小页码设置
        [].__proto__.forEach.apply($(".list"), [function(value, index, ar) { //forEach循环数组，循环所有获取到的中间页码数，并且获取数组中的每一个元素的索引
            value.innerText = index + 1; // 跟中间的值进行比较
        }])
    }
    // 页码点击处理事件
    [].__proto__.forEach.apply(_list, [function(value, index, ar) { //forEach循环数组，循环所有获取到的中间页码数，并且获取数组中的每一个元素的索引
        if (parseInt(value.innerHTML) == elNum) { //判断循环出来的元素的值是否为当前点击页码
            Index = index;
        } //获取索引
    }])
    Index = Index; //获取当前索引
    PageNum = elNum; // 修改当前页数
    _list[Index].style.backgroundColor = "#2d9bef"; //更改当前索引的点击样式
}
}})(jQuery)