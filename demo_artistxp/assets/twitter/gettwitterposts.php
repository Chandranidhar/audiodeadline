<?php
/**
 * Created by PhpStorm.
 * User: InfluxIQ09
 * Date: 11/14/2018
 * Time: 4:03 PM
 */
header('Content-type: text/html');
header('Access-Control-Allow-Origin: *');  //I have also tried the * wildcard and get the same response
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Content-Range, Content-Disposition, Content-Description');

$CONSUMER_KEY = $_GET["consumer_key"];
$CONSUMER_SECRET = $_GET["consumer_secret"];
//echo $_GET['scrn_name'];
$x= require_once('../twitter/codebird-php-develop/src/codebird.php');   //ask
\Codebird\Codebird::setConsumerKey('fhwawEUbSsyNG8L5667cmZpYZ','nHxQhn3ApgpNxYRIDfE5rBuL2U4fmLzVMBxBTls5CLOJz4fnKv'); // static, see 'Using multiple Codebird instances'

$cb = \Codebird\Codebird::getInstance();
$oauth_token = $_GET["oauth_token"];
$oauth_token_secret = $_GET["oauth_token_secret"];

/*echo $oauth_token;
echo "<br>";
echo $oauth_token_secret;
echo "<br>";
echo $CONSUMER_KEY;
echo "<br>";
echo $CONSUMER_SECRET;
exit;*/
// assign access token on each page load
$cb->setToken($oauth_token,$oauth_token_secret);

//print_r($cb);
$reply1 = $cb->account_settings();
$scrn_name=$reply1->screen_name;
/*echo "<pre>";
print_r($reply1);
echo "<pre>";
exit;*/
require_once 'twitteroauth.php';

/*$CONSUMER_KEY = "fhwawEUbSsyNG8L5667cmZpYZ";
$CONSUMER_SECRET = "nHxQhn3ApgpNxYRIDfE5rBuL2U4fmLzVMBxBTls5CLOJz4fnKv";
$oauth_token = '1036947658676432896-iEYa2ZfTjaOMm5M1RoUlSlNe2FElkV';
$oauth_token_secret = 'LLIB224NXYJoKbHTWK6oJslz9rFPNDSbkEypC3Wy44Dlm';*/

$connection = new TwitterOAuth($CONSUMER_KEY, $CONSUMER_SECRET, $oauth_token, $oauth_token_secret); //ask
session_start();
$content = $connection->get('account/verify_credentials');
$reply = $connection->get('users/show',array(
   /* 'screen_name'=>'GargiRo38390587'));*/
    'screen_name'=>$scrn_name));
/*echo "<pre>";
print_r($reply);
echo "<pre>";
exit;*/

if(@$_GET['sess']==0) {
    unset($_SESSION['since_id']);
    //echo "unset";
}
if(isset($_SESSION['since_id']))
{
    $reply = $connection->get('statuses/user_timeline',array('screen_name'=>$scrn_name,
        'count'=>300 ,
        'max_id' => $_SESSION['since_id']));
}
else $reply = $connection->get('statuses/user_timeline',array('screen_name'=>$scrn_name,
    'count'=>100
));
/*echo "<pre>";
print_r($reply);
echo "</pre>";
echo '<br>';
exit;*/

$html='';

set_time_limit(0);
foreach(($reply) as $property => $value) {
    //$id=number_format($value->id,0,'','');
    $id=$value->id;
  //  if($id!=636335431664070656 && $id!= 751023259194241024 && $id!= 735119021851303936){
        $replyembed = $connection->get('statuses/oembed',array('id'=>$id));
        if(@$_SESSION['since_id']!=$id)
            $html.= $replyembed->html;
        if($id>0) $sinceid=$id;
  //  }
}
/*<div indexnew.php?sess=1>Load More</div>*/

echo $html;
$_SESSION['since_id']=$sinceid;
