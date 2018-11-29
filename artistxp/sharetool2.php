<?php
error_reporting(E_ALL);

$type=$_REQUEST['type'];
$actual_link = "https://artistxp.com";
$actual_link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";


$description ='ARTISTXP IS A NEW AND EXCITING SOCIAL EXPERIENCE BRINGING ARTISTS WORKING IN ENTERTAINMENT TOGETHER WITH THEIR FANS.';
$title='Welcome to the Artist Experience Social Network.';
$image='https://audiodeadline.com/assets/images/'.$_REQUEST['image'];

?>
    <script type="text/javascript">
        setTimeout(function () {
            window.location.href=("https://artistxp.com/signup/<?php echo $_REQUEST['username']; ?>/<?php echo $_REQUEST['media_id']; ?>");
        },100);
    </script>

    <!doctype html>
    <html>
    <head>

        <!--for fb-->
        <meta property="og:title" content="<?php echo $title; ?>" />
        <meta property="fb:app_id" content="906815096194208" />
        <meta property="og:description" content="<?php echo $description; ?>" />
        <meta property="og:url" content="<?php echo $actual_link; ?>" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="<?php echo $image; ?>" />

        <!--for twitter-->
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="<?php echo $title; ?>" />
        <meta property="twitter:description" content="<?php echo $description; ?>" />
        <meta property="twitter:url" content="<?php echo $actual_link; ?>" />
        <meta property="twitter:image" content="<?php echo $image; ?>" />
        <style>
            /*--------------------------loader------------------------------*/

            .loder_body{ width: 100%; height: 100vh;  position: fixed; left: 0; top: 0; background-color: #COCAD; z-index: 99;}


            .loder_wrapper{width: 300vh; height: 100vh; display: table-cell; text-align: center; vertical-align: middle;}

            .loader {
                border: 16px solid #3C4C59;
                border-top: 16px solid #017EDA;
                border-radius: 50%;
                width: 120px;
                height: 120px;
                animation: spin 2s linear infinite;
                margin: 0 auto;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

        </style>

    </head>

    <body>
    <!--<img src="<\?php echo $image; ?>">-->
    <div class="loder_body">
        <div class="loder_wrapper">
            <div class="loader"></div>
        </div>
    </div>
    </body>
    </html>

<?php
function Redirect($url, $permanent = false)
{
    header('Location: ' . $url, true, $permanent ? 301 : 302);

    exit();
}


if (!strpos($_SERVER["HTTP_USER_AGENT"], "facebookexternalhit/")  && !strpos($_SERVER["HTTP_USER_AGENT"], "Facebot") ) {
    //Redirect('https://audiodeadline.com/signup/'.$_REQUEST['username'], true);

}
?>