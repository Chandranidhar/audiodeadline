<?php
/**
 * Created by PhpStorm.
 * User: Debasis Kar
 * Date: 15-11-2018
 * Time: 01:05
 */

if(!isset($_GET['userid'])) {
    $auth_url = 'https://www.instagram.com/oauth/authorize/?client_id=6c979874a1ee4410b442540bcdc3c8b2&redirect_uri=http://demo.artistxp.com/instagram/instaredirect.php?userid='.$_GET['id'].'&response_type=token&id=' . $_GET['id'];
    header('Location: ' . $auth_url);
    die();
}
// redirect to auth website
/*$auth_url = 'https://www.instagram.com/oauth/authorize/?client_id=6c979874a1ee4410b442540bcdc3c8b2&redirect_uri=http://demo.artistxp.com/instagram/instaredirect.php&response_type=token';
header('Location: ' . $auth_url);*/
/*print_r($_REQUEST);
echo "</br>";
print_r($_GET['access_token']);
echo "</br>";*/

if($_GET['access_token']!=null){

    $headers = [];
    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_URL => 'https://api.instagram.com/v1/users/self/?access_token='.$_GET['access_token'],
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
    /* echo "<pre>";
    print_r(json_decode($response));
    echo "</pre>";*/
    $res = json_decode($response);
    /*echo ($res->data->id);
    echo ($res->data->username);
    echo ($res->data->full_name);
    //echo ($res->data->counts);
    echo ($res->data->counts->followed_by);*/








//echo 'http://audiodeadline.com:3008/usergetinstatoken?access_token='.$_GET['access_token'].'&followers_count='.$res->data->counts->followed_by.'&userid='.$_GET['userid'].'&fullname='.$res->data->full_name.'&instausername='.$res->data->username.'&instauserid='.$res->data->id; //exit;

    $curl1 = curl_init();
    curl_setopt_array($curl1, array(
        CURLOPT_URL => 'http://audiodeadline.com:3008/usergetinstatoken?access_token='.$_GET['access_token'].'&followers_count='.$res->data->counts->followed_by.'&userid='.$_GET['userid'].'&fullname='.$res->data->id.'&instausername='.$res->data->username.'&instauserid='.$res->data->id,
//         CURLOPT_URL => "http://audiodeadline.com:3008/twitter?oauth_token=".$twitter_token.'&oauth_token_secret='.$twitter_token_secret.'&logid='.$_SESSION['loginid'],

        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
    ));

    curl_setopt($curl1, CURLOPT_HTTPHEADER, $headers);
    $response = curl_exec($curl1);
    $err = curl_error($curl1);
   /* echo "<pre>";
    print_r(json_decode($response));
    echo "</pre>";
    $res = json_decode($response);
    echo 66;



    exit;*/



    $curl2 = curl_init();

    curl_setopt_array($curl2, array(
        CURLOPT_URL => 'https://api.instagram.com/v1/users/'.$res->data->id.'self/?access_token='.$_GET['access_token'],
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

    /*echo "<pre>";
    print_r(json_decode($response1));
    echo "</pre>";*/
}



?>

<script>
    //alert(window.location.href);
    if(window.location.href.indexOf('#access')>0){
        //alert(window.location.href.split('#access_token='));
        window.location.href=window.location.href.replace("#access_token=",'&access_token=');
    }

</script>
