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
        $sortColumn = array('order_name', 'v_title', 'id', 'id', 'id');
        $query = new LineItems;
        $query = $query->with('properties');
        $query = $query->join('orders', 'orders.id', 'lineitems.i_order_id');
        if(isset($data['v_order_id']) && $data['v_order_id'] != '') {
            $query = $query->where('v_order_id', 'LIKE',  '%'. $data['order_name']. '%');
        }
        if(isset($data['v_line_item']) && $data['v_line_item'] != '') {
            $query = $query->where('title', 'LIKE', '%'. $data['v_line_item']. '%');
        } 
        if(isset($data['v_text']) && $data['v_text'] != '') {
            $query = $query->whereHas('properties', function($q) use ($data) {
                $q->where('name', 'text')->where('value', $data['v_text']);
            });
        }

        if(isset($data['v_color']) && $data['v_color'] != '') {
            $query = $query->whereHas('properties', function($q) use ($data) {
                $q->where('name', 'color')->where('value', $data['v_color']);
            });
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
        if($sort_order != '' && $order_field != ''){
            $query = $query->orderBy($order_field, $sort_order);
		} else {
		      $query = $query->orderBy('order_name', 'desc');
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

            foreach ($val['properties'] as $k1 => $v1) {
                if($v1['name'] == 'Color' || $v1['name'] == 'color') {
                    $color = $v1['value'];
                } else if($v1['name'] == 'Text' || $v1['name'] == 'text') {
                    $text = $v1['value'];
                } else if(preg_match("/image/i", $v1['name'])) {
                    $image = '<a href="'.$v1['value'].'" target="_blank">Full URL</a>';
                }
            }

            $returnData[$key][$index++] = $image;
            $returnData[$key][$index++] = $text;
            $returnData[$key][$index++] = $color;
            $returnData[$key][$index++] = '';            
        }

        $return_data['data'] = $returnData;
        $return_data['recordsTotal'] = $arrOrders['total'];
        $return_data['recordsFiltered'] = $arrOrders['total'];
        $return_data['data_array'] = $arrOrders['data'];

        // return response()->json($return_data);
        return $return_data;
        
    }

    public function anyListAjax1(Request $request) {
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
    
}