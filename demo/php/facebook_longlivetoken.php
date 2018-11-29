<?php
/**
 * Created by PhpStorm.
 * User: iftekar
 * Date: 30/5/17
 * Time: 1:33 PM
 */

header('Content-type: text/html');
header('Access-Control-Allow-Origin: * ');  //I have also tried the * wildcard and get the same response
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Content-Range, Content-Disposition, Content-Description');
error_reporting(E_ALL);

$data = json_decode(file_get_contents("php://input"));
//print_r(count($data));
//print_r($data);
//exit;
  //echo 5;
  $data_string = json_encode($data);
  $d=http_build_query($data);
  //echo $d;//exit;
  //echo "http://greenvalleyportal.com:3020/" . $_GET['q'].'&'.$d;

  $ch = curl_init("https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=".$data->appid."&client_secret=".$data->appsecret."&fb_exchange_token=".$data->token );
  curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
  //curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  /*curl_setopt($ch, CURLOPT_HTTPHEADER, array(
          'Content-Type: application/json',
          'Content-Length: ' . strlen($data))
  );*/

  //echo "https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&%20client_id=".$data->appid."&%20client_secret=.$data->appsecret.&%20fb_exchange_token=.$data->token.";
  $response= curl_exec($ch);

//echo 90;
  //print_r($response);

$tokenval = json_decode($response);
$tokenval1['token']=$tokenval->access_token;
//print_r($tokenval->access_token);
//print_r($tokenval);
echo json_encode($tokenval1);


  //exit;




//echo "</pre>";
