<?php
/**
 * Created by PhpStorm.
 * User: INFLUXIQ-01
 * Date: 21-09-2018
 * Time: 11:23 AM
 */

header('Content-type: text/html');
header('Access-Control-Allow-Origin: * ');  //I have also tried the * wildcard and get the same response
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Content-Range, Content-Disposition, Content-Description');
error_reporting(E_ALL);

$data = json_decode(file_get_contents("php://input"));
$data_string = json_encode($data);
$d=http_build_query($data);
$ch = curl_init("https://graph.facebook.com/me/accounts?access_token=".$data->token."&fields=about,bio,general_info,is_owned,link,location,name,id,tasks,category,category_list,cover,picture,access_token,fan_count,new_like_count,limit=500");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response= curl_exec($ch);
$dataval=(json_decode($response));        // function to convert the JSON encoded string into appropriate PHP data type

//echo "<pre>";
//print_r($dataval);
//echo "</pre>";
//print_r($dataval->data);
$tokenVal=json_decode($response);
//$tokenVal1['token']=$tokenVal->access_token;
echo json_encode($dataval->data);       //function is used to encode a value to JSON format.
