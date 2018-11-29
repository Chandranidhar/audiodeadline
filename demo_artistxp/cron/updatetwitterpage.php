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

echo "<pre>";
$res=json_decode($response1);
print_r(($res->item));
echo "</pre>";

$data=$res->item;
foreach ($data as $val){

    $curl12 = curl_init();

    curl_setopt_array($curl12, array(
        CURLOPT_URL => 'https://demo.artistxp.com/assets/twitter/gettwitterposts.php?oauth_token='.$val->twitter_oauth_token.'&oauth_token_secret='.$val->twitter_oauth_token_secret.'&consumer_key=fhwawEUbSsyNG8L5667cmZpYZ&consumer_secret=nHxQhn3ApgpNxYRIDfE5rBuL2U4fmLzVMBxBTls5CLOJz4fnKv&sess=0',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
    ));


    curl_setopt($curl12, CURLOPT_HTTPHEADER, $headers);
    $responset = curl_exec($curl12);
    $err1 = curl_error($curl12);

    echo "<pre>";
    print_r($responset);
    echo "</pre>";
    if(strlen($responset)>30) {

        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, "http://audiodeadline.com:3008/updateusertwiiterfeed");
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS,
            http_build_query(array('id' => $val->_id, 'feed' => $responset)));

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