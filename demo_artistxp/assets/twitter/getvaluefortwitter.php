<?php
/**
 * Created by PhpStorm.
 * User: KTA-PC 21
 * Date: 4/14/15
 * Time: 2:24 PM
 */
header('Content-type: text/html');
header('Access-Control-Allow-Origin: * ');  //I have also tried the * wildcard and get the same response
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Content-Range, Content-Disposition, Content-Description');


/*$logid = $_GET["id"];*/
$oauth_token = $_GET["oauth_token"];
$oauth_token_secret = $_GET["oauth_token_secret"];
/*$oauth_token = '824863785709998081-pTQDQS10IkGfJKWxlzYH90xaVKraISZ';
$oauth_token_secret = 'Fhhxu2qdAwD3VJxCv9DlJdV260USTVp8Url1BY8WZXuJe';*/
/*echo $oauth_token."<br>";
echo $oauth_token_secret."<br>";
echo $logid."<br>";*/

$x= require_once('../twitter/codebird-php-develop/src/codebird.php');
\Codebird\Codebird::setConsumerKey('fhwawEUbSsyNG8L5667cmZpYZ','nHxQhn3ApgpNxYRIDfE5rBuL2U4fmLzVMBxBTls5CLOJz4fnKv'); // static, see 'Using multiple Codebird instances'

$cb = \Codebird\Codebird::getInstance();


// assign access token on each page load
$cb->setToken($oauth_token,$oauth_token_secret);

 //print_r($cb);
$reply = $cb->account_settings();
$scrn_name=$reply->screen_name;
/*print_r($reply);
print_r($reply->screen_name);*/


/*  SHOW YOUR PROFILE NAMES

  $reply = $cb->users_show(array(
    'screen_name'=>$reply->screen_name));
$arr['name'] = $reply->screen_name;
$arr['image'] = $reply->profile_image_url;
print_r(json_encode($arr));
*/


/*  POST A COMMENT

$linkval = 'This is a new post,.. '. ' '. 'https://media.gettyimages.com/photos/is-it-delicious-picture-id1007786322';
$params1 = array(
    'status' => $linkval
    // 'status' => 'hiiiiiiiiiiii'
);
$reply = $cb->statuses_update($params1);
print_r($reply);
*/



/*   GET lists/statuses

$reply1 = $cb->lists_statuses(array(
    'slug'=>'test','owner_screen_name'=>'GargiRo38390587','owner_id'=>'1036947658676432896'));
print_r($reply1);
*/


/*GET OWN POSTS*/
/*
$reply = $cb->get('users/show',array(
    'screen_name'=>'GargiRo38390587'));*/
/*echo $scrn_name;exit;*/
?>

    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>ArtistXP Twitter</title>
        <script type="text/javascript " src="../js/jquery-1.11.0.js"></script>
        <script type="text/javascript " src="../js/responsee.js"></script>
        <script type="text/javascript">
    $(function()
    {
        $("#tweets").empty();
        $.ajax({
             url: "gettwitterposts.php?sess=0&scrn_name=<?php echo $scrn_name?>", //consumerkey,secret,oath_token,oath_tokensecret
                async:false,
                success: function(result){

        $("#tweets").append(result);
        jQuery('#loading').fadeOut(2000);

    }});

            $('#loadmore').click(function()
            {
                jQuery('#loading').show();
                $.ajax({
                    url: "gettwitterposts.php?sess=1&scrn_name=<?php echo $scrn_name?>",
                    async:false,
                    success: function(result){

                $("#tweets").append(result);
                jQuery('#loading').fadeOut(2000);

            }});
            });
        });
    </script>

    <div id="tweets">
    </div>
    <div id="loadmore">Load More</div>
<?php
exit;










require_once 'twitteroauth.php';
$CONSUMER_KEY = "fhwawEUbSsyNG8L5667cmZpYZ";
$CONSUMER_SECRET = "nHxQhn3ApgpNxYRIDfE5rBuL2U4fmLzVMBxBTls5CLOJz4fnKv";


$connection = new TwitterOAuth($CONSUMER_KEY, $CONSUMER_SECRET, $oauth_token, $oauth_token_secret);
session_start();
$content = $connection->get('account/verify_credentials');
$reply = $connection->get('users/show',array(
    'screen_name'=>$scrn_name));


if(@$_GET['sess']==0) {
    unset($_SESSION['since_id']);
    //echo "unset";
}
if(isset($_SESSION['since_id']))
{
    $reply = $connection->get('statuses/user_timeline',array('screen_name'=>$scrn_name,
        'count'=>30 ,
        'max_id' => $_SESSION['since_id']));
}
else $reply = $connection->get('statuses/user_timeline',array('screen_name'=>$scrn_name,
    'count'=>11
));
/*echo "<pre>";
print_r($reply);
echo "</pre>";
echo '<br>';*/
set_time_limit(0);
foreach(($reply) as $property => $value) {
    //$id=number_format($value->id,0,'','');
    $id=$value->id;
    if($id!=636335431664070656 && $id!= 751023259194241024 && $id!= 735119021851303936){
        $replyembed = $connection->get('statuses/oembed',array('id'=>$id));
        if(@$_SESSION['since_id']!=$id)
            echo $replyembed->html;
        if($id>0) $sinceid=$id;
    }
}
/*<div indexnew.php?sess=1>Load More</div>*/


$_SESSION['since_id']=$sinceid;


?>