<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');  //I have also tried the * wildcard and get the same response
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Content-Range, Content-Disposition, Content-Description');


require_once ('../twitter/TwitterAPIExchange.php');


//echo 56;exit;
/** Set access tokens here - see: https://dev.twitter.com/apps/ **/
$settings = array(
    'oauth_access_token' => '1036947658676432896-pOeYABVIkqQuShGuN63g4QyoFbM15I',
    'oauth_access_token_secret' => 'Eyj76XXAvN3PLaY1DchS3CC4RWiBYAu0M66FjLzV13CHY',
    'consumer_key' => "fhwawEUbSsyNG8L5667cmZpYZ",
    'consumer_secret' => "nHxQhn3ApgpNxYRIDfE5rBuL2U4fmLzVMBxBTls5CLOJz4fnKv"
);




//echo "<pre>";

///echo 55;

$url = 'https://api.twitter.com/1.1/collections/list.json';
//$url = 'https://api.twitter.com/1.1/statuses/user_timeline.json';
$getfield = '?screen_name=GargiRo38390587&count=99';
$requestMethod = 'GET';
$twitter = new TwitterAPIExchange($settings);
$res= $twitter->setGetfield($getfield)
    ->buildOauth($url, $requestMethod)
    ->performRequest();
print_r(json_decode($res));
$resarr=json_decode($res);
$data['data']=$resarr;
echo json_encode($data);;
/*print_r($resarr->objects->timelines);
$timelinearr=$resarr->objects->timelines;
foreach ($timelinearr as $val){

    print_r($val->collection_url);
}*/
//echo "</pre>";
//echo 4;


?>