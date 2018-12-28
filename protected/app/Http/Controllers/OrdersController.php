<?php
namespace App\Http\Controllers;
use Hash, Mail, Session, Redirect, Validator, Excel, Cookie, DB, Config;
use App\Models\Users, App\Models\Shops;
use Illuminate\Http\Request;
use OhMyBrew\BasicShopifyAPI;

class OrdersController extends Controller {
    
    public function getIndex()
    {     
        $auth_user = auth()->guard('admin')->user();
        return View('orders.index',array('title' => 'Orders List', 'auth_user' => $auth_user));
    }
    
    public function anyListAjax(Request $request) {
        $return_data = [];
        $return_data['recordsTotal'] = 0;
        $return_data['recordsFiltered'] = 0;
        $return_data['data'] = [];

        $data = $request->all();        
        $shop = Shops::where('shopify_domain', env('SHOPIFY_DOMAIN'))->first();
        if($shop) {
            $api = new BasicShopifyAPI();
            $api->setShop(env('SHOPIFY_DOMAIN'));
            $api->setAccessToken($shop->shopify_token);

            $rec_per_page = REC_PER_PAGE;
            if(isset($data['length'])){
                if($data['length'] == '-1') {
                    $rec_per_page = '';
                } else {
                    $rec_per_page = $data['length'];
                }
            }
            
            // $page = isset($data['page']) && $data['page'] > 0 ? $data['page'] : 1;
            
            // $totalOrders = $api->rest('GET', '/admin/orders/count.json');
            // $request = $api->rest('GET', '/admin/orders.json?limit='. $rec_per_page .'&page='.$page.'&fields=id,email,name,order_number,line_items');
            
            $orderApiUrl = '/admin/orders.json?status=any&fields=id,email,name,order_number,line_items';
            $request = $api->rest('GET',  $orderApiUrl);
        

            if(isset($request->body->orders) && count($request->body->orders) > 0) {
                $returnData = array();
                $arrayIndex = 0;
                foreach($request->body->orders as $key => $val) {
                    if((isset($data['v_order_id']) && $data['v_order_id'] !== '' && str_replace('#', '', $data['v_order_id']) == $val->order_number) || !isset($data['v_order_id'])) {
                        foreach ($val->line_items as $i => $v) {
                            $image = '';
                            $text = '';
                            $color = '';
                            
                            if(isset($data['v_line_item']) && !preg_match("/".$data['v_line_item']."/i", $v->title)) {
                                continue;
                            }
                            foreach ($v->properties as $k1 => $v1) {
                                if($v1->name == 'Color' || $v1->name == 'color') {
                                    $color = $v1->value;
                                } else if($v1->name == 'Text' || $v1->name == 'text') {
                                    $text = $v1->value;
                                } else if(preg_match("/image/i", $v1->name)) {
                                    $image = '<a href="'.$v1->value.'" target="_blank">Full URL</a>';
                                }
                            }
                        
                            if(isset($data['v_text']) && !preg_match("/".$data['v_text']."/i", $text)) {
                                continue;
                            }

                            if(isset($data['v_color']) && !preg_match("/".$data['v_color']."/i", $color)) {
                                continue;
                            }

                            $index = 0;                
                            $returnData[$arrayIndex][$index++] = $val->name;
                            $returnData[$arrayIndex][$index++] = $v->title;

                            $returnData[$arrayIndex][$index++] = $image;
                            $returnData[$arrayIndex][$index++] = $text;
                            $returnData[$arrayIndex][$index++] = $color;
                            $returnData[$arrayIndex][$index++] = '';
                                        
                            // $action = '<div class="actions"><a class="edit btn default btn-xs black" rel="'.$val->id.'" href="'.SITE_URL.'users/edit/'.$val->id.'" title="Edit"><i class="fa fa-edit"></i></a>';
                            // $action .= '<a href="javascript:;" id="delete_record" rel="'.$val['id'].'" delete-url="'.SITE_URL.'users/delete/'.$val['id'].'" class="btn default btn-xs black delete" title="Delete"><i class="icon-trash"></i> </a>';

                            // $returnData[$arrayIndex][$index++] = $action;

                            $arrayIndex++;

                        }
                    }                
                }
            }
            
            $totalRecord = count($returnData); 
            $return_data['recordsTotal'] = $totalRecord;
            $return_data['recordsFiltered'] = $totalRecord;

            
            // $return_data['recordsTotal'] = $totalOrders->body->count;
            // $return_data['recordsFiltered'] = $totalOrders->body->count;
            
            $start = $rec_per_page * ($data['page'] - 1);
            $return_data['data'] = array_slice($returnData, $start, $rec_per_page);
        }
        
        return $return_data;
    }
    
   
    public function anyEdit(Request $request, $id) {
        $current_user = auth()->guard('admin')->user();
        if($request->all())
        {
            $inputs = $request->all();
            $records = Users::find($id);
            $validator = Validator::make($request->all(), array(
              "v_email" =>'required|unique:users,v_email,' .$id. ',id'));
            if ($validator->fails()) {
                return $validator->errors();
            } else{
    			$records->v_email = trim($inputs['v_email']);
                $records->v_firstname = trim($inputs['v_firstname']);
                $records->v_lastname = trim($inputs['v_lastname']);
                $records->e_status = trim($inputs['e_status']);
                // checking two passwords
     			if($inputs['password'] != "" && $inputs['cpassword'] != "" && $inputs['password'] == $inputs['cpassword']) {
    				$records->password = Hash::make($inputs['password']);
    			}
                if($records->save()){
					Session::flash('success-message', trans('messages.admin_user_edit'));
                    return '';
                }
            } 
        } else{
            if($id != $current_user->id){
				$records = Users::find($id);
                if($records || !empty($records)){
                    return View('users.edit',array('records' => $records, 'title' => 'Edit User'));
                }
            } else {
                return Redirect(SITE_URL.'users');
            }
        }
         return Redirect(SITE_URL.'users');
    }

    public function postChangeStatus(Request $request) {
        $data = $request->all();
        if(!empty($data)){
            $user = Users::find($data['id']);
            $user->e_status = $data['data'];
            $user->e_user_type = $data['e_user_type'];

            if($user->save()){
                return 'TRUE';

            } else {
                return 'FALSE';
            }
        }
        return "TRUE";
    }
    
    public function getDelete($id) {
        $user = Users::find($id);
        if(!empty($user)) {
            if($user->delete()){
                return 'TRUE';
            } else {
                return 'FALSE';
            }
        } else {
            return 'FALSE';
        }
    }

    public function postBulkAction(Request $request) {
        $data = $request->all();
        if(count($data) > 0) {
            if($data['action'] == 'Active') {
                if(Users::whereIn('id', $data['ids'])->update(array('e_status' => '1'))){
                    return 'TRUE';

                } else { return 'FALSE'; }     

            } else if ($data['action'] == 'Inactive') {
                if(Users::whereIn('id', $data['ids'])->update(array('e_status' => '0'))){
                    return 'TRUE';

                } else { return 'FALSE'; }                

            } else if ($data['action'] == 'Delete') {
                $user_data = Users::whereIn('id', array_values($data['ids']))->delete();                
                
                return 'TRUE';
            }
        }
    }
}