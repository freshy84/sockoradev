<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function cropImages($base64img, $x, $y, $w, $h, $path, $thumb_path) {
        $v_random_image = time() . '-' . str_random(6);

        $base64img = substr(strstr($base64img, ','), 1);

        $tmpFile = $v_random_image . '.png';
        $targ_w = $targ_h = 150;
        $jpeg_quality = 90;
        $img_src = base64_decode($base64img);
        $file = $path . $tmpFile;
        file_put_contents($file, $img_src);

        $img_r = imagecreatefromstring($img_src);
        $dst_r = ImageCreateTrueColor($targ_w, $targ_h);
        imagecopyresampled($dst_r, $img_r, 0, 0, $x, $y, $targ_w, $targ_h, $w, $h);
        header('Content-type: image/jpeg');
        ob_start();
        imagejpeg($dst_r, null, $jpeg_quality);
        $image_data = ob_get_contents();
        ob_end_clean();
        $fileThumb = $thumb_path . $tmpFile;

        file_put_contents($fileThumb, $image_data);

        return $tmpFile;
    }
    
    public function downloadImage($source_folder, $url) {
        $filename = basename($url);
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch,CURLOPT_USERAGENT,'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13');
        $html = curl_exec($ch);
        $content = curl_exec($ch);       
        
        $fp = fopen($source_folder.$filename, "w");
        fwrite($fp, $content);
        fclose($fp);
        curl_close($ch);
        return $filename;
    }

    public function makeThumbnail($filename, $source_folder, $thumb_folder, $thumb_width = 50, $thumb_height = 50) {
        if(file_exists($source_folder.$filename)) {
            $source_image = $source_folder.$filename;
            //folder path setup
            $thumb_path = $thumb_folder;
            
            $thumbnail = $thumb_path.$filename;
            list($width, $height) = getimagesize($source_image);
            if (($width / $height) < ($thumb_width / $thumb_height)) {
                $thumb_width = ceil($thumb_height * $width / $height);
            }/*  else {
                if (($width / $height) > ($thumb_width / $thumb_height)) {
                    $thumb_height = ceil($thumb_width * $height / $width);
                }
            } */
            
            $thumb_create = imagecreatetruecolor($thumb_width, $thumb_height);
            $file_ext = pathinfo($filename, PATHINFO_EXTENSION);
            switch($file_ext){
                case 'jpg':
                    $source = imagecreatefromjpeg($source_image);
                    break;
                case 'jpeg':
                    $source = imagecreatefromjpeg($source_image);
                    break;
        
                case 'png':
                    $source = imagecreatefrompng($source_image);
                    break;
                case 'gif':
                    $source = imagecreatefromgif($source_image);
                    break;
                default:
                    $source = imagecreatefromjpeg($source_image);
            }
        
            imagecopyresized($thumb_create,$source,0,0,0,0,$thumb_width,$thumb_height,$width,$height);
            switch($file_ext){
                case 'jpg' || 'jpeg':
                    imagejpeg($thumb_create,$thumbnail,100);
                    break;
                case 'png':
                    imagepng($thumb_create,$thumbnail,100);
                    break;
        
                case 'gif':
                    imagegif($thumb_create,$thumbnail,100);
                    break;
                default:
                    imagejpeg($thumb_create,$thumbnail,100);
            }

            return $filename;
        }
        return '';
    }        
    
    public function delete_directory($dirname) {
        if (is_dir($dirname)) {
            $dir_handle = opendir($dirname);
        }

        if (!$dir_handle) {
            return false;
        }
        while($file = readdir($dir_handle)) {
            if ($file != "." && $file != "..") {
                if (!is_dir($dirname."/".$file)) {
                    unlink($dirname."/".$file);
                }  else {
                    $this->delete_directory($dirname.'/'.$file);
                }
            }
        }
        closedir($dir_handle);
        rmdir($dirname);
        return true;
    }
}
