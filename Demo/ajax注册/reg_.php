<?php  
header("Content-Type:text/plain;charset=utf-8");

// foreach ($_POST as $key => $value) {
// 	print_r($value);
// }
$arr = array();
$arr[] = $_POST['date'];
$arr = (explode(',',$arr[0]));
require '../mysql_init.php';
$conn = mysqli_connect($mysql_server_name,$mysql_username,$mysql_password,$mysql_datebase);
$result = mysqli_query($conn,"insert into reg(username,dwe,Email,password) values ('$arr[0]','$arr[1]','$arr[2]','$arr[3]')");
mysqli_free_result($result);

?>