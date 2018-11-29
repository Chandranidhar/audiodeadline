<?php
/**
 * Created by PhpStorm.
 * User: Debasis Kar
 * Date: 18-10-2018
 * Time: 09:36
 */

//echo $_REQUEST['url'];
set_time_limit(0);


 $get_url = 'http://artistxp.com:3008/addlinkview?id='.$_REQUEST['url'].'&user_id='.$_REQUEST['user_id'];


$ch = curl_init();
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_URL, $get_url);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
$response = curl_exec($ch);
curl_close($ch);


$response=json_decode($response);
//echo "<pre>";
//print_r($response);
//print_r($response->status);
//print_r($response->item[0]->linkUrl);
//echo "</pre>";
//echo $response->items[0]['linkUrl'];
header('Location: '.$response->item[0]->linkUrl);