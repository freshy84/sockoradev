<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Hash, Mail, Validator,Excel,Cookie,Auth,Session,DB,URL;
use App\Models\Users, App\Models\EmailTemplate, App\Models\Shops;


class AuthenticateController extends Controller {


    public function checkDB(Request $request) {
        $shop = new Shops();
        $shop->shopify_domain = 'sockora-dev.myshopify.com';
        $shop->shopify_token = '78214cf97ff0385b14b6183f5fac50ce';
        $shop->created_at =  '2018-12-22 12:00:30';
        $shop->updated_at = '2018-12-22 12:07:13';
        $shop->grandfathered = 0;
        $shop->deleted_at = null;
        $shop->namespace = null;
        $shop->plan_id = null;
        $shop->freemium = 0;
        if($shop->save()) {
            echo 'saved';
        } else {
            echo 'not saved';
        }
        exit;
        //INSERT INTO `shops` (`id`, `shopify_domain`, `shopify_token`, `created_at`, `updated_at`, `grandfathered`, `deleted_at`, `namespace`, `plan_id`, `freemium`) VALUES (1, 'sockora-dev.myshopify.com', '78214cf97ff0385b14b6183f5fac50ce', '2018-12-22 12:00:30', '2018-12-22 12:07:13', 0, NULL, NULL, NULL, 0);
    }

    public function orderWebhook(Request $request) {
        $data = $request->all();
        
        file_put_contents(TEMP_IMG_PATH.'res1.txt', 'Date - '. date('Y-m-d h-i-s A') .'\n\n\n'.print_r($data, true));
        file_put_contents(TEMP_IMG_PATH.'res2.txt', print_r(file_get_contents('php://input'), true));

        Mail::raw(print_r($data, true), function($message)  {
            $message->to('raghavrangani@gmail.com');
        });

        return 'Done';
    }
    
    public function index(Request $request) {
        $data = $request->all();
        if ($data) {
            $remember = isset($data ['remember']) ? true : false;

            if ($remember) {
                Session::put('remember', 'yes');
            }

            if(!isset($data['v_email']) || !isset($data['password'])) {
                Session::remove('msg');
                Session::flash('message', ERR_PWS);
                return redirect()->to('/');
            }

            $admindata = auth()->guard('admin')->attempt(['v_email' => $data['v_email'], 'password' => $data['password'], 'e_status' => '1'], $remember);

            if (!empty($admindata)) {
                return redirect()->to('/dashboard');
                
            } else {
                Session::remove('msg');
                Session::flash('message', ERR_PWS);
                return redirect()->to('/login');
            }
        }

        return view('authenticate.login', array('title' => 'Login'));
    }

    public function dashboard(){
        $responseData = array();
        $responseData['User'] = Users::count();
        return view('authenticate.dashboard', array('title' => 'Dashboard','responseData' => $responseData));
	}

    public function logout(){
        auth()->guard('admin')->logout();
        Session::remove('admin_logged_id');
        Session::remove('admin_array');
        Session::flash('msg', "You are successfully logged out.");
        return redirect()->to('/');
    }

    public function randomPassword() {
	    $alphabet = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
	    $pass = array();
	    $alphaLength = strlen($alphabet) - 1;
	    for ($i = 0; $i < 60; $i++) {
	        $n = rand(0, $alphaLength);
	        $pass[] = $alphabet[$n];
	    }
	    return implode($pass);
	}

    public function forgot_password(Request $request) {
        $data = $request->all();
        if ($data && $request->has('v_email')) {
            $user= Users::where('v_email', '=', e(trim($data['v_email'])))->first();
            if(is_null($user) ) {
                Session::flash('message', INVALID_EMAIL); // Message of invalid email
                Session::set('FORGOTPASS_FLAG', '1');
                return redirect()->to('/');
            } else {
                $v_access_code= str_random(10);
                $user->v_reset_pass_token = $v_access_code; // random access_code
                if ($user->save()) {
                    $objEmailTemplate = EmailTemplate::find(1)->toArray();
                    $strTemplate = $objEmailTemplate['t_body'];
                    $strTemplate = str_replace('[SITE_NAME]', SITE_NAME, $strTemplate);
                    $strTemplate = str_replace('[SITE_URL]', SITE_URL, $strTemplate);
                    $strTemplate = str_replace('../', SITE_URL, $strTemplate);
                    $strTemplate = str_replace('[LINK]', SITE_URL.'reset-password/'.$v_access_code, $strTemplate);
                    $strTemplate = str_replace('[USERNAME]', $user->v_firstname." ".$user->v_lastname, $strTemplate);

                    // mail sent to user with new link
                    Mail::send('emails.auth.generate-email-template', array('strTemplate'=>$strTemplate), function($message) use ($user)
                    {
                      $message->from(CONTACT_EMAIL_ID);
                      $message->to($user->v_email);
                      $message->replyTo(CONTACT_EMAIL_ID);
                      $message->subject($user->v_subject);
                    });
                    Session::flash('msg', PWD_SENT);
                    Session::remove('FORGOTPASS_FLAG');
                    return redirect()->to('/');
                }
            }
        }
        exit;
    }

    public function reset_password(Request $request, $code)
	{
		$records = Users::where('v_reset_pass_token' , '=' , $code)->first();
        if( $records['v_reset_pass_token'] == ''){
            return redirect()->to('/');
        }
        $id = $records['id'];
        $rec = Users::find($id);
        if(request()->all()){
            $inputs = request()->all();
            if($inputs['password'] != "" && $inputs['confirm_password'] != "" && $inputs['password'] == $inputs['confirm_password']) {
                $rec->password = Hash::make($inputs['password']);
                $rec->v_reset_pass_token = '';
                $rec->save();
                Session::flash('msg', PASSWORD_SUCCESS);
                Session::remove('FORGOTPASS_FLAG');
                return redirect()->to('/');

            } else{
                Session::flash('message', 'Invalid Password');
            }
		}
        return View('authenticate.reset_password')->with('record' , $records)->with('title' , 'Reset Password');
	}

    public function my_profile(Request $request)
	{
        $records = auth()->guard('admin')->user();
        $id = $records['id'];
		if($request->all()) {
            $inputs = $request->all();

            $validator = Validator::make($inputs, array("v_email" =>'unique:users,v_email,' . $id . ''));
            if ($validator->fails()) {
                return json_encode($validator->errors());
            } else{
                $records->v_email = trim($inputs['v_email']);
                $records->v_firstname = trim($inputs['v_firstname']);
                $records->v_lastname = trim($inputs['v_lastname']);
    			if($inputs['password_new'] != "" && $inputs['password_retype'] != "" && $inputs['password_new'] == $inputs['password_retype']) {
    				$records->password = Hash::make($inputs['password_new']);
                    $records->remember_token = '';
    			}
                if (isset($inputs['imgbase64']) && $inputs['imgbase64'] != '') {
                    $profileImgPath = USER_PROFILE_IMAGE_PATH;
                    $profileImgThumbPath = USER_PROFILE_THUMB_IMAGE_PATH;
                    $imageName = $this->cropImages($inputs['imgbase64'], $inputs['x'], $inputs['y'], $inputs['h'], $inputs['w'], $profileImgPath, $profileImgThumbPath);
                    @unlink(USER_PROFILE_THUMB_IMAGE_PATH . $records->v_profile_image);
                    @unlink(USER_PROFILE_IMAGE_PATH . ($records->v_profile_image));
                    $records->v_profile_image = $imageName;

                } else {
                    $records->v_profile_image = '';
                }
                
    			if($records->save()){
                    return json_encode(['status' => 'TRUE', 'image' => $records->v_profile_image]);
                }
            }
		} else{
		      return View('authenticate.my_profile',array('title'=>'My Profile','records' => $records));
		}
	}

	public function check_base64_image($base64) {
        $img = imagecreatefromstring(base64_decode($base64));
        if (!$img) {
            return false;
        }
        imagepng($img, 'tmp.png');
        $info = getimagesize('tmp.png');
        unlink('tmp.png');
        if ($info[0] > 0 && $info[1] > 0 && $info['mime']) {
            return true;
        }
        return false;
    }

 }
