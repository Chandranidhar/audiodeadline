<?php


$curl2 = curl_init();

curl_setopt_array($curl2, array(
    CURLOPT_URL => 'http://audiodeadline.com:3008/twitterfeedusers',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "GET",
));

curl_setopt($curl2, CURLOPT_HTTPHEADER, $headers);
$response1 = curl_exec($curl2);
$err1 = curl_error($curl2);

$res=json_decode($response1);
/*echo "<pre>";
$res=json_decode($response1);
print_r(($res->item));
echo "</pre>";*/
$data=$res->item;
$x= require_once('../assets/twitter/codebird-php-develop/src/codebird.php');   //ask
\Codebird\Codebird::setConsumerKey('fhwawEUbSsyNG8L5667cmZpYZ','nHxQhn3ApgpNxYRIDfE5rBuL2U4fmLzVMBxBTls5CLOJz4fnKv'); // static, see 'Using multiple Codebird instances'
var_dump($x);
echo 9;
foreach ($data as $val){

    //require_once('../assets/twitter')


    $cb = \Codebird\Codebird::getInstance();
    echo $oauth_token = $val->twitter_oauth_token;
    echo $oauth_token_secret = $val->twitter_oauth_token_secret;


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
    //$reply1 = $cb->account_settings();
    $reply1 = $cb->followers_list();
    echo "<pre>";
    print_r(count($reply1->users));
    echo "</pre>";

    $followers_count = count($reply1->users);


    if(3==3) {

        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, "http://audiodeadline.com:3008/updateusertwiiterfollowercount");
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS,
            http_build_query(array('id' => $val->_id, 'followers_count' => $followers_count)));

// In real life you should use something like:
// curl_setopt($ch, CURLOPT_POSTFIELDS,
//          http_build_query(array('postvar1' => 'value1')));

// Receive server response ...
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $server_output = curl_exec($ch);
        print_r($server_output);

        curl_close($ch);
    }

}

//https://demo.artistxp.com/assets/twitter/gettwitterposts.php?oauth_token=1036947658676432896-iEYa2ZfTjaOMm5M1RoUlSlNe2FElkV&oauth_token_secret=LLIB224NXYJoKbHTWK6oJslz9rFPNDSbkEypC3Wy44Dlm&consumer_key=fhwawEUbSsyNG8L5667cmZpYZ&consumer_secret=nHxQhn3ApgpNxYRIDfE5rBuL2U4fmLzVMBxBTls5CLOJz4fnKv&sess=0

$to = "chandrani.influxiq@gmail.com";
$subject = "This is subject".time();

$message = "<b>This is HTML message.</b>";
$message .= "<h1>This is headline.</h1>".$response1;

$header = "From:support@audiodeadline.com \r\n";
/*$header .= "Cc:afgh@somedomain.com \r\n";*/
$header .= "MIME-Version: 1.0\r\n";
$header .= "Content-type: text/html\r\n";

$retval = mail ($to,$subject,$message,$header);

if( $retval == true ) {
    echo "Message sent successfully...";
}else {
    echo "Message could not be sent...";
}