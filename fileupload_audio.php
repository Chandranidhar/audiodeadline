<?php
header('Content-type: text/html');
header('Access-Control-Allow-Origin: * ');
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Content-Range, Content-Disposition, Content-Description');

ini_set('post_max_size', '256M');
ini_set('upload_max_filesize', '256M');
ini_set('max_input_time', '500');
ini_set('max_execution_time ', '500');
set_time_limit(0);

$data = array('error_code'=>1,'msg'=>'File Upload Error Occured! Try Again.');

//echo json_encode($_REQUEST);
$file = './nodeserver/uploads/audio/'.$_REQUEST['user_id']."/";
if(!is_dir($file))                  //checks if the directory exists
{
//    echo ("$file is a directory");
    mkdir($file, 0777, true);                   // function to make directory
}



if(isset($_FILES['file'])){
    if($_FILES['file']['error'] == 0){
        $filename = $_FILES['file']['name'];
        $basename = pathinfo($filename , PATHINFO_FILENAME);
        $ext = pathinfo($filename ,  PATHINFO_EXTENSION);
        $basename = str_replace(' ','',$basename);    //replacing whitespaces in basename
        $basename = strtolower($basename);              //converting basename in lowercase
        $basename = $basename.'-'.time();               //adding time with basename
        $newfilename = $basename.'.'.$ext;
        $fileserver = $file.$newfilename;
        if(move_uploaded_file($_FILES['file']['tmp_name'],$fileserver)){
            $data = array('error_code'=>0,'filename'=>$newfilename);
        }
        else{
            $data = array('error_code'=>0,'error'=> $_FILES["file"]["error"]);

        }
    }
    else{
        $data = array('error_code'=>1,'msg'=>json_encode($_FILES));
    }
}else{

    $data = array('error_code'=>1,'msg'=>json_encode($_FILES['file']['error']));
}

echo json_encode($data);