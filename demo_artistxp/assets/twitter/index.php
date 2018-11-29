<?php
/**
 * Created by PhpStorm.
 * User: KTA-PC 21
 * Date: 4/14/15
 * Time: 2:24 PM
 */
/*session_destroy();
print_r(($_SESSION['oauth_token']));
exit;*/
$CONSUMER_KEY = $_GET["consumer_key"];
$CONSUMER_SECRET = $_GET["consumer_secret"];
/*echo $CONSUMER_KEY;
echo "<br/>";
echo $CONSUMER_SECRET;
echo "<br/>";*/

$x= require_once('../twitter/codebird-php-develop/src/codebird.php');   //ask
\Codebird\Codebird::setConsumerKey('fhwawEUbSsyNG8L5667cmZpYZ','nHxQhn3ApgpNxYRIDfE5rBuL2U4fmLzVMBxBTls5CLOJz4fnKv'); // static, see 'Using multiple Codebird instances'
$cb = \Codebird\Codebird::getInstance();

//var_dump($cb);
//var_dump($x);
//$logid = $_GET["id"];
session_start();
//unset($_SESSION['oauth_token']);
//exit;
//print_r(isset($_SESSION['oauth_token']));
//print_r(($_SESSION['oauth_token']));


if( (strlen($_GET["id"])>5)){
    $_SESSION['loginid'] = $_GET["id"];
    //exit;
    //  print_r('yeah');
};

//print_r($_SESSION['getid']);
if (! isset($_SESSION['oauth_token'])) {
   // print_r('hi');
    // get the request token
    // echo "get the request token";
    $reply = $cb->oauth_requestToken(array(
        //'oauth_callback' => 'http://' . $_SERVER['HTTP_HOST'] . '/index.php'
        'oauth_callback' => 'http://demo.artistxp.com/assets/twitter/index.php'
    ));
   //  print_R($reply);
   //  exit;
    // store the token
    $cb->setToken($reply->oauth_token, $reply->oauth_token_secret);         //short-term token
    $_SESSION['oauth_token'] = $reply->oauth_token;
    $_SESSION['oauth_token_secret'] = $reply->oauth_token_secret;
    $_SESSION['oauth_verify'] = true;

    // redirect to auth website
    $auth_url = $cb->oauth_authorize(); //ask
/*    print_r($reply);
    print_r($auth_url);
    exit;*/
    header('Location: ' . $auth_url);
    die();

} elseif (isset($_GET['oauth_verifier']) && isset($_SESSION['oauth_verify'])) {
    // verify the token
   //  echo "verify the token";
    $cb->setToken($_SESSION['oauth_token'], $_SESSION['oauth_token_secret']);  //after authorisation,                                                                               long term token
    unset($_SESSION['oauth_verify']); //ask

    // get the access token
    $reply = $cb->oauth_accessToken(array(
        'oauth_verifier' => $_GET['oauth_verifier']
    ));

    // store the token (which is different from the request token!)
    $_SESSION['oauth_token'] = $reply->oauth_token;
    $_SESSION['oauth_token_secret'] = $reply->oauth_token_secret;
/*print_r($_SESSION['oauth_token']);echo "<br>";
print_r($_SESSION['oauth_token_secret']);echo "<br>";*/
    // send to same URL, without oauth GET parameters
    header('Location: ' . basename(__FILE__));
    die();
}

/*print_r($_SESSION['oauth_token']); echo '<br>';
print_r($_SESSION['oauth_token_secret']); echo '<br>';
print_r($_SESSION['oauth_verify']); echo '<br>';*/

//print_r($_SESSION['getid']);
// assign access token on each page load
$cb->setToken($_SESSION['oauth_token'], $_SESSION['oauth_token_secret']);
//print_r($_SESSION['oauth_token']);
// print_r($cb);


$twitter_token = $_SESSION['oauth_token'];
$twitter_token_secret = $_SESSION['oauth_token_secret'];

/*


echo 'twitter token--     '.$twitter_token;
echo '<br>';
echo 'twitter_token_secret--    '.$twitter_token_secret;
exit;*/
//echo $twitter_token."<br>";
//echo $twitter_token_secret;
//$reply = $cb->account_settings();
//exit;
//print_r($reply->screen_name);
//unset($_SESSION['oauth_token']);


/*$reply = $cb->users_show(array(
    'screen_name'=>$reply->screen_name));
print_r($reply->profile_image_url);*/

//echo "http://influxiq.com:3015/twitter?oauth_token=".$twitter_token.'&oauth_token_secret='.$twitter_token_secret.'&logid ='.$logid;
//print_r($_SESSION['getid']);
$headers = [];
//print_r("http://influxiq.com:3015/twitter?oauth_token=".$twitter_token.'&oauth_token_secret='.$twitter_token_secret.'&logid='.$_SESSION['loginid']);
/*echo "http://audiodeadline.com:3008/twitter?oauth_token=".$twitter_token.'&oauth_token_secret='.$twitter_token_secret.'&logid='.$_SESSION['loginid'];
exit;*/

//$reply = $cb->users_show(array('screen_name'=>'GargiRo38390587'));
//$reply = $cb->collections_list(array('screen_name'=>'GargiRo38390587','user_id','1036947658676432896'));
//print_r($reply);



$curl = curl_init();
curl_setopt_array($curl, array(
   /* CURLOPT_URL => "http://influxiq.com:3015/twitter?oauth_token=".$twitter_token.'&oauth_token_secret='.$twitter_token_secret.'&logid='.$_SESSION['loginid'],*/
    CURLOPT_URL => "http://audiodeadline.com:3008/twitter?oauth_token=".$twitter_token.'&oauth_token_secret='.$twitter_token_secret.'&logid='.$_SESSION['loginid'],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "GET",
));

curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
$response = curl_exec($curl);
$err = curl_error($curl);
unset($_SESSION['oauth_token']);
//echo "<br>";
//print_r($err);
//print_r($response);
//exit;