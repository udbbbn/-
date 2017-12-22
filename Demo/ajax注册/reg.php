<?php  
header("Content-Type:text/plain;charset=uft-8");
//判断接受的数据中的value是否正确

//连接数据库		php5.5以上版本mysql已被mysqli替换  ？？？
require '../mysql_init.php';//require()语句包括并运行指定文件。
$conn=mysqli_connect($mysql_server_name,$mysql_username,$mysql_password,$mysql_datebase) or die("error connecting");//连接数据库
// mysqli_query("set name 'uft-8'");//数据库输出编码
// mysql_select_db($mysql_datebase);//打开数据库
$result = mysqli_query($conn,"select * from reg");			
//mysqli_query(connection,query,resultmode) 针对数据库查询 
//resultmode默认可不填 query规定查询的字符串 即sql语句

// $sql = "select * from test";//sql语句
// $result = mysqli_query($conn,$sql);
$res = array();
while ($row = mysqli_fetch_assoc($result)) {			//从结果中取得数据作为关联数组
	$res[] = $row;
}
mysqli_free_result($result);			//释放空间


// $res = mysqli_fetch_array($result);
// echo $res; 
// echo报错 但实际上是有值的
//判断输入的值跟数据库中的值是否相同
$name = (array_keys($_POST)[0]);	//返回(数组)中的key
//该用前端js判断
// if ($name == 'username' || $name == 'Email') {
for ($i=0; $i < count($res); $i++) {				//count(数组) 获取数组的长度
	if ($_POST[$name] == $res[$i][$name]) {
		echo "已存在";
	}
	// else {
// $all = $_POST[$name];		//获取POST过来的值
// $arr = array();				//创建临时数组
// $arr[] = $all;				//将数值赋数组
// foreach ($arr as $key => $value) {			//替换key值  
// 	$arr[$name] = $value;
// 	unset($arr[$key]);				//废除原有key值
// }
// $resu = mysqli_query($conn,"insert into Reg (username) values ('$all')");
// if ($resu) {
// 	echo "成功";
// }
// else {echo "失败";return;}
// }
		return;
// }
}
// mysqli_query($conn,"insert into Reg (username,sex,Email,password) values ('$name')")
// for ($i=0; $i < $res; $i++) { 
// 	# code...
// }

?>