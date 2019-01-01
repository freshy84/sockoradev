<?php
namespace App\Http\Controllers;
use Hash, Mail, Session, Redirect, Validator, Excel, Cookie, DB, Config;
use App\Models\Orders, App\Models\Shops, App\Models\LineItems, App\Models\LineItemProperty;
use Illuminate\Http\Request;
use OhMyBrew\BasicShopifyAPI;

class OrdersController extends Controller {
    
    public function getIndex() {     
        $auth_user = auth()->guard('admin')->user();
        return View('orders.index',array('title' => 'Orders List', 'auth_user' => $auth_user));
    }
    
    public function anyListAjax(Request $request) {
        
        $data = $request->all();
        $sortColumn = array('order_name', 'lineitems.title', 'id', 'id', 'id', 'id', 'quantity', 'order_status');
        $query = new LineItems;
        $query = $query->with('properties');
        $query = $query->join('orders', 'orders.id', 'lineitems.i_order_id');
        
        if(isset($data['v_order_id']) && $data['v_order_id'] != '') {
            $query = $query->where('orders.order_number', 'LIKE',  '%'. str_replace('#', '', $data['v_order_id']). '%');
        }
        if(isset($data['e_status']) && $data['e_status'] != '') {
            $query = $query->where('orders.e_status', $data['e_status']);
        }
        if(isset($data['v_line_item']) && $data['v_line_item'] != '') {
            $query = $query->where('title', 'LIKE', '%'. $data['v_line_item']. '%');
        } 
        if(isset($data['v_text']) && $data['v_text'] != '') {
            $query = $query->whereHas('properties', function($q1) use ($data) {
                $q1->where('name', 'text')->where('value', $data['v_text']);
            });
        }
        if(isset($data['v_color']) && $data['v_color'] != '') {
            $query = $query->whereHas('properties', function($q2) use ($data) {
                $q2->where('name', 'color')->where('value', $data['v_color']);
            });
        }
        if(isset($data['i_no_of_faces']) && $data['i_no_of_faces'] != '') {
            $query = $query->whereHas('properties', function($q3) use ($data) {
                $q3->where('name', 'Number of Faces')->where('value', $data['i_no_of_faces']);
            });
        }
        if(isset($data['i_quantity_min']) && $data['i_quantity_min'] != '') {
            $query = $query->where('quantity', '>=', $data['i_quantity_min']);
        } 
        if(isset($data['i_quantity_max']) && $data['i_quantity_max'] != '') {
            $query = $query->where('quantity', '<=', $data['i_quantity_max']);
        } 

        $query = $query->select('lineitems.*', 'orders.id as order_id', 'orders.name as order_name', 'orders.e_status as order_status');
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
        if($order_field == 'order_name') {
            $query = $query->orderBy('order_name', $sort_order)->orderBy('title', 'asc');
        }
        if($sort_order != '' && $order_field != ''){
            $query = $query->orderBy($order_field, $sort_order);
		} else {
		    $query = $query->orderBy('order_name', 'desc')->orderBy('id', 'desc');
		}
        $orders = $query->paginate($rec_per_page);;
        $arrOrders = $orders->toArray();
        
        $returnData = [];
        foreach($arrOrders['data'] as $key => $val) {
            $index = 0;                
            // $returnData[$key][$index++] = '<span class="row-details row-details-close"></span>';
            $returnData[$key]['id'] = $val['id'];
            $returnData[$key]['order_id'] = $val['order_name'];
            $returnData[$key]['line_item_name'] = $val['title'];

            $v_image = '';
            if(file_exists(LINE_ITEM_FILES.$val['id'].'/'.$val['v_image']) && $val['v_image'] != '' && $val['v_image'] !== null) {
                $v_image = '<a class="fancybox" href="'.SITE_URL.LINE_ITEM_FILES.$val['id'].'/'.$val['v_image'].'"><img class="line-item-img" src="'.SITE_URL.LINE_ITEM_FILES.$val['id'].'/thumb/'.$val['v_image'].'" alt=""></a>';
            }

            $returnData[$key]['v_image'] = $v_image;

            $v_psd_file = '';
            if(file_exists(LINE_ITEM_FILES.$val['id'].'/'.$val['v_psd_file']) && $val['v_psd_file'] != '' && $val['v_psd_file'] !== null) {
                $imageName1 =  str_replace(explode('_', $val['v_psd_file'])[0].'_', '', $val['v_psd_file']);
                $v_psd_file = '<a class="" href="'.SITE_URL.LINE_ITEM_FILES.$val['id'].'/'.$val['v_psd_file'].'" download="'.$imageName1.'">'.$imageName1.'</a>';
            }           
            $returnData[$key]['v_psd_file'] = $v_psd_file;
            
            $image = '';
            $text = '';
            $color = '';
            $noOfFaces = 0;

            foreach ($val['properties'] as $k1 => $v1) {
                if($v1['name'] == 'Color' || $v1['name'] == 'color') {
                    $color = $v1['value'];
                } else if($v1['name'] == 'Text' || $v1['name'] == 'text') {
                    $text = $v1['value'];
                } else if(preg_match("/image/i", $v1['name'])) {
                    $image .= '<a class="mr5 fancybox" href="'.SITE_URL.LINE_ITEM_IMG.$v1['i_lineitem_id'].'/'.$v1['v_image_thumb'].'" data-fancybox-group="gallery" title="'.  $val['order_name'] . ' - ' .$val['title'] .'"><img class="line-item-img" src="'.SITE_URL.LINE_ITEM_IMG.$v1['i_lineitem_id'].'/thumb/'.$v1['v_image_thumb'].'" alt=""></a>';
                } else if(preg_match("/Number of Faces/i", $v1['name'])) {
                    $noOfFaces = $v1['value'];
                }
                
            }
            $status = ['New Order', 'Design Complete', 'Mock-up Sent', 'Redo', 'Approved'];
            $statusOption = '';
            foreach($status as $stat) {
                $statusOption .= '<option value="'.$stat.'" '. ($val['order_status'] == $stat ? 'selected=""' : '').'>'.$stat.'</option>';
            }
            $returnData[$key]['images'] = ltrim($image, ', ');
            $returnData[$key]['text'] = $text;
            $returnData[$key]['color'] = $color;
            $returnData[$key]['no_of_faces'] = $noOfFaces;
            $returnData[$key]['quantity'] = $val['quantity'];
            $returnData[$key]['order_status'] = '<select class="line-item-status order-id-'.$val['i_order_id'].'" rel="'.$val['i_order_id'].'">'. $statusOption .'</select>';
            $returnData[$key]['action'] = '';
        }

        $return_data['data'] = $returnData;
        $return_data['recordsTotal'] = $arrOrders['total'];
        $return_data['recordsFiltered'] = $arrOrders['total'];
        $return_data['data_array'] = $arrOrders['data'];

        // return response()->json($return_data);
        return $return_data;
        
    }

    public function changeOrderStatus(Request $request) {
        $data = $request->all();
       
        if(isset($data['status']) && isset($data['order_id'])) {
            $order = Orders::find($data['order_id']);
            if($order) {
                $order->e_status = $data['status'];
                $order->save();

                return 'TRUE';
            }
        }
        return 'FALSE';
    }

    public function uploadLineitemIimage(Request $request) {
        $data = $request->all();
        if(isset($data['image']) && count($data['image']) && isset($data['lineItemId']) && isset($data['uploadType'])) {
            $image = $data['image'];
            $line_item = LineItems::where('id', $data['lineItemId'])->first();
            if($line_item) {
                if($data['uploadType'] == 'Image') {
                    $line_item_path = LINE_ITEM_FILES.$line_item->id;
                    if (!file_exists($line_item_path)) {                                           
                        mkdir($line_item_path.'/thumb', 0777, true);
                    }
                    $name = time().'_'.$image->getClientOriginalName();
                    $image->move($line_item_path.'/', $name);  

                    $imageName = $this->makeThumbnail($name,  $line_item_path.'/', $line_item_path.'/thumb/', 40, 40);
                    
                    if($line_item->v_image != '' && $line_item->v_image !== null) {
                        @unlink($line_item_path.'/'.$line_item->v_image);
                    }
                    $line_item->v_image = $imageName;
                    $line_item->save();
                    return response()->json(['status' => 'TRUE', 'image' => SITE_URL.$line_item_path.'/'. $imageName, 'imageHtml' =>  '<a class="fancybox" href="'.SITE_URL.$line_item_path.'/'. $imageName.'"><img class="line-item-img" src="'.SITE_URL.$line_item_path.'/thumb/'. $imageName.'" alt=""></a>']);
                } else {
                    $line_item_path = LINE_ITEM_FILES.$line_item->id;
                    if (!file_exists($line_item_path)) {                                           
                        mkdir($line_item_path.'/thumb', 0777, true);
                    }
                    $imageName = time().'_'.$image->getClientOriginalName();
                    $image->move($line_item_path.'/', $imageName);  
                    
                    if($line_item->v_psd_file != '' && $line_item->v_psd_file !== null) {
                        @unlink($line_item_path.'/'.$line_item->v_psd_file);
                    }
                    $line_item->v_psd_file = $imageName;
                    $line_item->save();
                    $imageName1 =  str_replace(explode('_', $imageName)[0].'_', '', $imageName);

                    return response()->json(['status' => 'TRUE', 'image' => SITE_URL.$line_item_path.'/'. $imageName, 'imageHtml' =>  '<a class="" href="'.SITE_URL.$line_item_path.'/'. $imageName.'" download="'.$imageName1.'">'.$imageName1.'</a>']);
                }
            }
        }
        return response()->json(['status' => 'TRUE']);
    }

}