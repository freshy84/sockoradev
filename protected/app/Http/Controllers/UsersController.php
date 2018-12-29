<?php
namespace App\Http\Controllers;
use Hash, Mail, Session, Redirect, Validator, Excel, Cookie, DB, Config;
use App\Models\Users;
use Illuminate\Http\Request;



class UsersController extends Controller {
    
    public function getIndex()
    {     
        $auth_user = auth()->guard('admin')->user();
        return View('users.index',array('title' => 'User List', 'auth_user' => $auth_user));
    }
    
    public function anyListAjax(Request $request) //User Listing
    {
        $auth_user = auth()->guard('admin')->user();
        $data = $request->all();
        $sortColumn = array('','v_firstname','v_lastname','v_email','e_status');
        $query = new Users;
	
        $query = $query->where("id","!=",$auth_user->id);
        if(isset($data['v_firstname']) && $data['v_firstname'] != '') {
            $query = $query->where('v_firstname', 'LIKE',  '%'. $data['v_firstname']. '%');
        }
        if(isset($data['v_lastname']) && $data['v_lastname'] != '') {
            $query = $query->where('v_lastname', 'LIKE', '%'. $data['v_lastname']. '%');
        } 
        if(isset($data['v_email']) && $data['v_email'] != '') {
            $query = $query->where('v_email', 'LIKE', '%'. $data['v_email']. '%');
        }
        if(isset($data['e_status']) && $data['e_status'] != '') {
            $query = $query->where('e_status', "=", $data['e_status']);
        }
        if(isset($data['e_user_type']) && $data['e_user_type'] != '') {
            $query = $query->where('e_user_type', "=", $data['e_user_type']);
        }

        $rec_per_page = REC_PER_PAGE;
        if(isset($data['length'])){
            if($data['length'] == '-1') {
                $rec_per_page = '';
            } else {
                $rec_per_page = $data['length'];
            }
        }

        $sort_order = $data['order']['0']['dir'];
        $order_field = $sortColumn[$data['order']['0']['column']];
        if($sort_order != '' && $order_field != ''){
            $query = $query->orderBy($order_field,$sort_order);
		} else {
		      $query = $query->orderBy('updated_at','desc');
		}
        $users = $query->paginate($rec_per_page);;
        $arrUsers = $users->toArray();
        $data = array();
        foreach($arrUsers['data'] as $key => $val) {
            $index = 0;
            if($val['id'] == $auth_user->id){ 
                    $chk_box = '';
            } else {
                $chk_box = '<input type="checkbox" name="id[]" value="'.$val['id'].'" class="delete_'.$val['id'].'">';
            }
            $data[$key][$index++] = $chk_box;
            $data[$key][$index++] = $val['v_firstname'];
            $data[$key][$index++] = $val['v_lastname'];
            $data[$key][$index++] = $val['v_email'];
            $data[$key][$index++] = $val['e_user_type'];
            $data[$key][$index++] = ($val['e_status'] ? 'Active' : 'Inactive');
            
            if($val['id'] != $auth_user->id){
                $action = '<div class="actions"><a class="edit btn default btn-xs black" rel="'.$val['id'].'" href="'.SITE_URL.'users/edit/'.$val['id'].'" title="Edit"><i class="fa fa-edit"></i> Edit</a>';
                $action .= '<a href="javascript:;" id="delete_record" rel="'.$val['id'].'" delete-url="'.SITE_URL.'users/delete/'.$val['id'].'" class="btn default btn-xs black delete" title="Delete"><i class="icon-trash"></i> Delete</a>';
            }
            
            $data[$key][$index++] = $action;
        }
        $return_data['data'] = $data;
        $return_data['recordsTotal'] = $arrUsers['total'];
        $return_data['recordsFiltered'] = $arrUsers['total'];        
        return $return_data;
    }
    
    public function getView($id) {
        $records = Users::find($id);
        if(!isset($records) && empty($records)){
           return Redirect(SITE_URL.'users');
        }
        $avilable_amount = $this->calc_credit_amount($id);
        return View('users.view', array('user' => $records));
    }

    public function anyAdd(Request $request) {
        $current_user = auth()->guard('admin')->user();
        $id = $current_user->id;
        if($request->all())
        {
            $inputs = $request->all();
            $records = new Users;
            $validator = Validator::make($request->all(), array(
                "v_email" => 'required|unique:users,v_email,NULL,id'));
            if ($validator->fails()) {
                return $validator->errors();
            } else{
    			$records->v_email = trim($inputs['v_email']);
                $records->v_firstname = trim($inputs['v_firstname']);
                $records->v_lastname = trim($inputs['v_lastname']);
                $records->e_status = trim($inputs['e_status']);
                $records->e_user_type = trim($inputs['e_user_type']);
                
    			if($inputs['password'] != "" && $inputs['cpassword'] != "" && $inputs['password'] == $inputs['cpassword']) {
    				$records->password = Hash::make($inputs['password']);
                }
                
                if($records->save()){
                    $id =  $records->id;
                    Session::flash('success-message', trans('messages.admin_user_add'));
                    return '';
                }
            }
        }else{
            return View('users.add',array('title' => 'Add User'));
        }
        return Redirect(SITE_URL.'users');  
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