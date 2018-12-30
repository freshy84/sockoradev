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
        $sortColumn = array('order_name', 'lineitems.title', 'id', 'id', 'id', 'id', 'quantity');
        $query = new LineItems;
        $query = $query->with('properties');
        $query = $query->join('orders', 'orders.id', 'lineitems.i_order_id');
        
        if(isset($data['v_order_id']) && $data['v_order_id'] != '') {
            $query = $query->where('orders.order_number', 'LIKE',  '%'. $data['v_order_id']. '%');
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

        $query = $query->select('lineitems.*', 'orders.id as order_id', 'orders.name as order_name');
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
            $returnData[$key][$index++] = $val['order_name'];
            $returnData[$key][$index++] = $val['title'];
            
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

            $returnData[$key][$index++] = ltrim($image, ', ');
            $returnData[$key][$index++] = $text;
            $returnData[$key][$index++] = $color;
            $returnData[$key][$index++] = $noOfFaces;
            $returnData[$key][$index++] = $val['quantity'];
            $returnData[$key][$index++] = '';
        }

        $return_data['data'] = $returnData;
        $return_data['recordsTotal'] = $arrOrders['total'];
        $return_data['recordsFiltered'] = $arrOrders['total'];
        $return_data['data_array'] = $arrOrders['data'];

        // return response()->json($return_data);
        return $return_data;
        
    }

}