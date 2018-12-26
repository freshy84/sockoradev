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
}
