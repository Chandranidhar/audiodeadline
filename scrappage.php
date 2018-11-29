<?php

header('Content-type: text/html');
header('Access-Control-Allow-Origin: * ');  //I have also tried the * wildcard and get the same response
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Content-Range, Content-Disposition, Content-Description');

set_time_limit(0);


$get_url = $_REQUEST["url"];


$ch = curl_init();
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_URL, $get_url);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
$html = curl_exec($ch);
curl_close($ch);

$title = '';


$doc = new DOMDocument();
@$doc->loadHTML($html);
$nodes = $doc->getElementsByTagName('title');

//get and display what you need:
$title = $nodes->item(0)->nodeValue;
$description = '';
$image = array();

$metas = $doc->getElementsByTagName('meta');

for ($i = 0; $i < $metas->length; $i++)
{
    $meta = $metas->item($i);
    if($meta->getAttribute('property') == 'og:title')
        $title = $meta->getAttribute('content');
    if($meta->getAttribute('name') == 'description')
        $description = $meta->getAttribute('content');
    if($meta->getAttribute('property') == 'og:description')
        $description = $meta->getAttribute('content');
    if($meta->getAttribute('name') == 'keywords')
        $keywords = $meta->getAttribute('content');
    if($meta->getAttribute('property') == 'og:image'){
        if(filter_var($meta->getAttribute('content'), FILTER_VALIDATE_URL)) {
            list($width, $height, $type, $attr) = getimagesize($meta->getAttribute('content'));

            //if ($width > 100 && $height > 100)
                $image[] = $meta->getAttribute('content');
        }
    }
    if($meta->getAttribute('property') == 'twitter:image'){
        if(filter_var($meta->getAttribute('content'), FILTER_VALIDATE_URL)) {
            list($width, $height, $type, $attr) = getimagesize($meta->getAttribute('content'));

            //if ($width > 100 && $height > 100)
                $image[] = $meta->getAttribute('content');
        }
    }
    if($meta->getAttribute('property') == 'og:image:url'){
        if(filter_var($meta->getAttribute('content'), FILTER_VALIDATE_URL)) {
            list($width, $height, $type, $attr) = getimagesize($meta->getAttribute('content'));

            //if ($width > 100 && $height > 100)
                $image[] = $meta->getAttribute('content');
        }
    }

}


$allImages = $doc->getElementsByTagName('img');

for ($i = 0; $i < $allImages->length; $i++)
{
    $allImage = $allImages->item($i);
    if(filter_var($allImage->getAttribute('src'), FILTER_VALIDATE_URL)) {
        list($width, $height, $type, $attr) = getimagesize($allImage->getAttribute('src'));

        //if ($width > 100 && $height > 100)
            $image[] = $allImage->getAttribute('src');
    }else{
        if (strpos($allImage->getAttribute('src'), 'data:image') === false) {
            $base_url = parse_url($get_url);
            $temp_imgsrc = ltrim($allImage->getAttribute('src'), "~/");
            $temp_imgsrc = ltrim($allImage->getAttribute('src'), "/");
            $img_src = $base_url['scheme'].'://'.$base_url['host'].'/'.$temp_imgsrc;

            list($width, $height, $type, $attr) = getimagesize($img_src);

            if ($width > 100 && $height > 100)
                $image[] = $img_src;
        }

    }


    if(count($image) > 3)
        break;


}


echo json_encode(array('title'=>$title,'description'=>$description,'images'=>$image))


//}
?>