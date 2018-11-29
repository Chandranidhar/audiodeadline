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

$data = json_decode(file_get_contents("php://input"));  // function is used to encode a value to JSON format.
$data_string = json_encode($data);     // function to convert the JSON encoded string into appropriate PHP data type
$d=http_build_query($data);
$ch = curl_init("https://graph.facebook.com/".$data->pageid."?access_token=".$data->token."&fields=feed{message,message_tags,status_type,type,full_picture,link,name,picture,source,story,caption,comments,shares,likes},limit=500");
//echo "https://graph.facebook.com/".$data->pageid."?access_token=".$data->token."&fields=feed{message,message_tags,status_type,type,full_picture,link,name,picture,source,story,caption,comments,shares,likes},limit=500";
//exit;
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response= curl_exec($ch);
$dataval=(json_decode($response));

echo "<pre>";
print_r($dataval);
echo "</pre>";
//print_r($dataval->data);
$tokenVal=json_decode($response);
//$tokenVal1['token']=$tokenVal->access_token;
echo json_encode($dataval->data);
