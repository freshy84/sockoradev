<?php
error_reporting(E_ALL | E_STRICT);
require('UploadHandler.php');
if(isset($_SERVER['SERVER_PORT']) and $_SERVER['SERVER_PORT'] == '443') {
    $URL = "https://".$_SERVER['HTTP_HOST'];
} else {
    $URL = "http://".$_SERVER['HTTP_HOST'];
}
$button_name = $_REQUEST['button_name'];

$options = array('upload_dir' => $_SERVER['DOCUMENT_ROOT'].'/files/temp/',
     'upload_url' => $_REQUEST['SITE_URL'].'files/temp/',
     'script_url'=> $_REQUEST['SITE_URL'].'assets/plugins/jquery-file-upload/server/php/index.php'
);
if($button_name != ''){
   $options['param_name'] = $button_name;
}

if(isset($_POST['accept_file_types']) && $_POST['accept_file_types'] != "")
{
    $options['accept_file_types'] = $_POST['accept_file_types'];   
}

$upload_handler = new UploadHandler($options);
/*
error_reporting(E_ALL | E_STRICT);
require('UploadHandler.php');
$upload_handler = new UploadHandler();*/
