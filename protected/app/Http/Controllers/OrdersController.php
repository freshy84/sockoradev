<?php
namespace App\Http\Controllers;
use Hash, Mail, Session, Redirect, Validator, Excel, Cookie, DB, Config;
use App\Models\Orders, App\Models\Shops, App\Models\LineItems, App\Models\LineItemProperty;
use Illuminate\Http\Request;
use OhMyBrew\BasicShopifyAPI;

class OrdersController extends Controller {
    
    public function getIndex() {
        return View('orders.index',array('title' => 'Orders List'));
    }
    
    public function anyListAjax(Request $request) {
        // DB::enableQueryLog();
        $authUser = auth()->guard('admin')->user();
        $data = $request->all();
        $sortColumn = array('order_name', 'order_name', 'lineitems.title', 'id', 'id', 'quantity', 'product_type', 'e_status');
        $query = new LineItems;
        $query = $query->with('properties');
        $query = $query->join('orders', 'orders.id', 'lineitems.i_order_id');
        $query = $query->join('products', 'products.product_id', 'lineitems.product_id');

        if(isset($data['v_order_id']) && $data['v_order_id'] != '') {
            $query = $query->where('orders.order_number', 'LIKE',  '%'. str_replace('#', '', $data['v_order_id']). '%');
        }
        if(isset($data['e_status']) && $data['e_status'] != '') {
            $query = $query->where('e_status', $data['e_status']);
        }
        if(isset($data['v_line_item']) && $data['v_line_item'] != '') {
            $query = $query->where('title', 'LIKE', '%'. $data['v_line_item']. '%');
        }
        if(isset($data['product_type']) && $data['product_type'] != '') {
            $query = $query->where('product_type', 'LIKE', '%'. $data['product_type']. '%');
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

        $query = $query->select('lineitems.*', 'orders.id as order_id', 'orders.name as order_name','products.product_type as product_type');
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
        $orders = $query->paginate($rec_per_page);
        // pr(DB::getQueryLog()); exit;
        $arrOrders = $orders->toArray();
        
        $returnData = [];
        foreach($arrOrders['data'] as $key => $val) {
            $index = 0;                
            // $returnData[$key][$index++] = '<span class="row-details row-details-close"></span>';
            $returnData[$key]['id'] = $val['id'];
            $returnData[$key]['order_id'] = $val['order_name'];
            $returnData[$key]['line_item_name'] = $val['title'];
            $returnData[$key]['product_type'] = $val['product_type'];

            $v_image = '';
            if($val['v_image'] != '' && $val['v_image'] !== null) {
                $images = json_decode($val['v_image'], true);
                $images = is_array($images) ? $images : [];

                foreach ($images as $k => $value) {
                    if(file_exists(LINE_ITEM_FILES.$val['id'].'/'.$value) && $value != '') {
                        $deleteHtml = '';

                        if(in_array($authUser->e_user_type, ['Admin', 'Manager'])) {
                            $deleteHtml = '<a href="javascript:;" class="delete-image" rel="'.$value.'" title="Delete"><i class="fa fa-times" aria-hidden="true"></i></a>';
                        }
                        
                        $v_image .= '<div class="mr5 image-item" style=""><a class="fancy-image" data-fancybox="line-item-images'.$val['id'].'" href="'.SITE_URL.LINE_ITEM_FILES.$val['id'].'/'.$value.'"><img class="line-item-img" src="'.SITE_URL.LINE_ITEM_FILES.$val['id'].'/thumb/'.$value.'" alt=""></a>'. $deleteHtml .'</div>';
                    }
                }
            }
            $returnData[$key]['v_image'] = $v_image;

            $new_image = '';
            if($val['v_new_image'] != '' && $val['v_new_image'] !== null) {
                $images = json_decode($val['v_new_image'], true);
                $images = is_array($images) ? $images : [];
                
                foreach ($images as $value) {
                    if(file_exists(LINE_ITEM_FILES.$val['id'].'/'.$value) && $value != '') {
                        $deleteHtml = '';

                        if(in_array($authUser->e_user_type, ['Admin', 'Manager'])) {
                            $deleteHtml = '<a href="javascript:;" class="delete-image" rel="'.$value.'" title="Delete"><i class="fa fa-times" aria-hidden="true"></i></a>';
                        }
                        $new_image .= '<div class="mr5 image-item"><a class="fancy-image" data-fancybox="line-item-new-images'.$val['id'].'" href="'.SITE_URL.LINE_ITEM_FILES.$val['id'].'/'.$value.'"><img class="line-item-img" src="'.SITE_URL.LINE_ITEM_FILES.$val['id'].'/thumb/'.$value.'" alt="">'.$deleteHtml.'</a></div>';
                    }
                }
            }

            $returnData[$key]['v_new_image'] = $new_image;

            $v_psd_file = '';            
            if($val['v_psd_file'] != '' && $val['v_psd_file'] !== null) {
                $psd_files = json_decode($val['v_psd_file'], true);
                $psd_files = is_array($psd_files) ? $psd_files : [];
                
                foreach($psd_files as $value) {                    
                     if(file_exists(LINE_ITEM_FILES.$val['id'].'/'.$value) && $value != '') {
                        $deleteHtml = '';
                        if(in_array($authUser->e_user_type, ['Admin', 'Manager'])) {
                            $deleteHtml = ' ( <a href="javascript:;" class="delete-psd" rel="'.$value.'" title="Delete"><i class="fa fa-times" aria-hidden="true"></i></a> )';
                        }

                        $imageName1 =  str_replace(explode('_', $value)[0].'_', '', $value);
                        $v_psd_file .= '<span class="psd-file-list"><a class="" href="'.SITE_URL.LINE_ITEM_FILES.$val['id'].'/'.$value.'" download="'.$imageName1.'">'.$imageName1.'</a>'. $deleteHtml.'</span>';                       
                    }          
                }
            }
            $returnData[$key]['v_psd_file'] = $v_psd_file;

            $new_psd_file = '';            
            if($val['v_new_psd_file'] != '' && $val['v_new_psd_file'] !== null) {
                $psd_files = json_decode($val['v_new_psd_file'], true);
                $psd_files = is_array($psd_files) ? $psd_files : [];
                
                foreach($psd_files as $value) {
                     if(file_exists(LINE_ITEM_FILES.$val['id'].'/'.$value) && $value != '') {
                        $deleteHtml = '';
                        if(in_array($authUser->e_user_type, ['Admin', 'Manager'])) {
                            $deleteHtml = ' ( <a href="javascript:;" class="delete-psd" rel="'.$value.'" title="Delete"><i class="fa fa-times" aria-hidden="true"></i></a> )';
                        }

                        $imageName1 =  str_replace(explode('_', $value)[0].'_', '', $value);
                        $new_psd_file .= '<span class="psd-file-list"><a class="" href="'.SITE_URL.LINE_ITEM_FILES.$val['id'].'/'.$value.'" download="'.$imageName1.'">'.$imageName1.'</a>'. $deleteHtml.'</span>';
                    }          
                }
            }

            $returnData[$key]['v_new_psd_file'] = ltrim($new_psd_file, ',');
            
            $image = '';
            $text = '';
            $color = '';
            $noOfFaces = '';

            foreach ($val['properties'] as $k1 => $v1) {
                if($v1['name'] == 'Color' || $v1['name'] == 'color') {
                    $color = $v1['value'];
                } else if($v1['name'] == 'Text' || $v1['name'] == 'text') {
                    $text = $v1['value'];
                } else if(preg_match("/image/i", $v1['name'])) {
                   $image .= '<a class="mr5" data-fancybox="gallery'.$v1['i_lineitem_id'].'" href="'.$v1['value'].'" data-fancybox-group="gallery" data-caption="'.  $val['order_name'] . ' - ' .$val['title'] .'"><img class="line-item-img" src="'.SITE_URL.LINE_ITEM_IMG.$v1['i_lineitem_id'].'/thumb/'.$v1['v_image_thumb'].'" alt=""></a>';
                } else if(preg_match("/Number of Faces/i", $v1['name'])) {
                    $noOfFaces = $v1['value'];
                }                
            }
            if(in_array($authUser->e_user_type, ['Admin', 'Designer', 'Manager'])) {
                $status = ['New Order', 'Design Complete', 'Mock-up Sent', 'Redo', 'Approved'];
                $statusOption = '<select class="line-item-status line-item-id-'.$val['id'].'" rel="'.$val['id'].'">';
                foreach($status as $stat) {
                    $statusOption .= '<option value="'.$stat.'" '. ($val['e_status'] == $stat ? 'selected=""' : '').'>'.$stat.'</option>';
                }
                $statusOption .= '</select>';
            } else {
                $statusOption = $val['e_status'];
            }

            $returnData[$key]['images'] = ltrim($image, ', ');
            $returnData[$key]['text'] = $text;
            $returnData[$key]['color'] = $color;
            $returnData[$key]['no_of_faces'] = $noOfFaces;
            $returnData[$key]['quantity'] = $val['quantity'];
            $returnData[$key]['line_item_status_html'] = $statusOption;
            $returnData[$key]['line_item_status'] = $val['e_status'];
            $returnData[$key]['user_type'] = $authUser->e_user_type;
            $returnData[$key]['designer_note'] = $val['v_designer_note'] !== null ? $val['v_designer_note'] : '';
        }

        $return_data['data'] = $returnData;
        $return_data['recordsTotal'] = $arrOrders['total'];
        $return_data['recordsFiltered'] = $arrOrders['total'];
        $return_data['data_array'] = $arrOrders['data'];

        // return response()->json($return_data);
        return $return_data;
        
    }

    public function changeLineItemStatus(Request $request) {
        $data = $request->all();
       
        if(isset($data['status']) && isset($data['line_item_id'])) {
            $order = LineItems::find($data['line_item_id']);
            if($order) {
                $order->e_status = $data['status'];
                $order->save();

                return 'TRUE';
            }
        }
        return 'FALSE';
    }
    public function updateDesignerNote(Request $request) {
            $data = $request->all();
        
            if(array_key_exists("note", $data) && isset($data['line_item_id'])) {
                $order = LineItems::find($data['line_item_id']);
                if($order) {
                    $order->v_designer_note = $data['note'];
                    $order->save();

                    return 'TRUE';
                }
            }
            return 'FALSE';
        }
    public function uploadLineitemIimage(Request $request) {
        $data = $request->all();
        $authUser = auth()->guard('admin')->user();
        if(isset($data['files']) && isset($data['lineItemId']) && isset($data['uploadType'])) {
            $files = $data['files'];
           
            $line_item = LineItems::where('id', $data['lineItemId'])->first();
            if($line_item) {
                $line_item_path = LINE_ITEM_FILES.$line_item->id;
                if (!file_exists($line_item_path)) {                                           
                    mkdir($line_item_path, 0777, true);
                    mkdir($line_item_path.'/thumb', 0777, true);
                }

                if($data['uploadType'] == 'NewImage' || $data['uploadType'] == 'NewPSD' ) {
                    if($line_item['e_status'] != 'Redo') {
                        return response()->json(['status' => 'FALSE', 'message' => 'Not allow to upload in '. $line_item['e_status'] . ' status.']);
                    }
                }
                
                if($data['uploadType'] == 'Image' || $data['uploadType'] == 'NewImage') {
                    $v_images = [];
                    $imageHtml = '';
                    $aclass = 'line-item-'.($data['uploadType'] == 'NewImage' ? 'new-' : '').'images'.$line_item->id;
                    foreach($files as $key => $file) {
                        $name = time().$key.'_'.$file->getClientOriginalName();
                        $file->move($line_item_path.'/', $name);
                        $imageName = $this->makeThumbnail($name,  $line_item_path.'/', $line_item_path.'/thumb/', 40, 40);                        
                        $v_images[] = $imageName;
                        $deleteHtml = '';

                        if(in_array($authUser->e_user_type, ['Admin', 'Manager'])) {
                            $deleteHtml = '<a href="javascript:;" class="delete-image" rel="'.$imageName.'" title="Delete"><i class="fa fa-times" aria-hidden="true"></i></a>';
                        }

                        $imageHtml .= '<div class="mr5 image-item" style=""> <a class="fancy-image" data-fancybox="'.$aclass.'" href="'.SITE_URL.$line_item_path.'/'. $imageName.'"><img class="line-item-img" src="'.SITE_URL.$line_item_path.'/thumb/'. $imageName.'" alt=""></a>'. $deleteHtml .'</div>';
                    }
                    
                    $oldImages = [];
                    if($data['uploadType'] == 'Image' ) {
                        if($line_item->v_image != null) {
                            $oldImages = json_decode($line_item->v_image, true);
                        }
                        if(!is_array($oldImages)) { $oldImages = []; }
                        $v_images = array_merge($oldImages, $v_images);
                        $line_item->v_image = json_encode($v_images);
                    } else {
                        if($line_item->v_new_image != null) {
                            $oldImages = json_decode($line_item->v_new_image, true);
                        }
                        if(!is_array($oldImages)) { $oldImages = []; }
                        $v_images = array_merge($oldImages, $v_images);
                        $line_item->v_new_image = json_encode($v_images);
                    }
                    $line_item->save();
                    
                    return response()->json(['status' => 'TRUE', 'image' => SITE_URL.$line_item_path.'/'. $imageName, 'imageHtml' =>  $imageHtml]);

                } else {
                    $imageHtml = '';
                    $v_images = [];

                    foreach($files as $key => $file) {
                        $imageName = time(). $key .'_'.$file->getClientOriginalName();
                        $file->move($line_item_path.'/', $imageName);  
                        $imageName1 =  str_replace(explode('_', $imageName)[0].'_', '', $imageName);
                        $v_images[] = $imageName;
                        $deleteHtml = '';
                        if(in_array($authUser->e_user_type, ['Admin', 'Manager'])) {
                            $deleteHtml = ' ( <a href="javascript:;" class="delete-psd" rel="'.$imageName.'" title="Delete"><i class="fa fa-times" aria-hidden="true"></i></a> )';
                        }
                        $imageHtml .= '<span class="psd-file-list"><a class="" href="'.SITE_URL.$line_item_path.'/'. $imageName.'" download="'.$imageName1.'">'.$imageName1.'</a>'.$deleteHtml.'</span>';
                    }

                    $oldFiles = [];
                    if($data['uploadType'] == 'PSD' ) {
                        if($line_item->v_psd_file != null) {
                            $oldFiles = json_decode($line_item->v_psd_file, true);
                        }
                        if(!is_array($oldFiles) || count($oldFiles) <= 0) { $oldFiles = []; $imageHtml = ltrim($imageHtml, ', ');}

                        $v_images = array_merge($oldFiles, $v_images);
                        $line_item->v_psd_file = json_encode($v_images);

                    } else {
                        if($line_item->v_new_psd_file !== null) {
                            $oldFiles = json_decode($line_item->v_new_psd_file, true);
                        }

                        if(!is_array($oldFiles)  || count($oldFiles) <= 0) { $oldFiles = []; $imageHtml = ltrim($imageHtml, ', ');}
                        $v_images = array_merge($oldFiles, $v_images);
                        $line_item->v_new_psd_file = json_encode($v_images);
                    }
                    $line_item->save();                   

                    return response()->json(['status' => 'TRUE', 'image' => SITE_URL.$line_item_path.'/'. $imageName, 'imageHtml' =>  $imageHtml]);
                }
            }
        }
        return response()->json(['status' => 'TRUE']);
    }

    public function deleteLineitemImage(Request $request) {
        $data = $request->all();
        $authUser = auth()->guard('admin')->user();
        if(in_array($authUser->e_user_type, ['Admin', 'Manager'])) {           
            if(isset($data['filename']) && $data['filename'] != '' && isset($data['lineItemId']) && isset($data['uploadType']) && $data['uploadType'] != '') {
                $line_item = LineItems::where('id', $data['lineItemId'])->first();
                if($line_item) {
                    if($data['uploadType'] == 'Image') {
                        $images = $line_item->v_image;                    
                        if($images !== null && $images != '') {
                            $images = json_decode($images, true);
                            $index = array_search($data['filename'], $images);
                            if(isset($images[$index])) {
                                unset($images[$index]);
                                @unlink(LINE_ITEM_FILES.$line_item->id.'/'.$data['filename']);
                                @unlink(LINE_ITEM_FILES.$line_item->id.'/thumb/'.$data['filename']);
                                $images = array_values($images);
                                $line_item->v_image = (count($images) > 0 ? json_encode($images) : null);
                                $line_item->save();
                                return response()->json(['status' => 'TRUE']);
                            }
                        }
                    } else if($data['uploadType'] == 'NewImage') {
                        $images = $line_item->v_new_image;
                        if($images !== null && $images != '') {
                            $images = json_decode($images, true);
                            $index = array_search($data['filename'], $images);
                            if(isset($images[$index])) {
                                unset($images[$index]);
                                unlink(LINE_ITEM_FILES.$line_item->id.'/'.$data['filename']);
                                @unlink(LINE_ITEM_FILES.$line_item->id.'/thumb/'.$data['filename']);
                                $images = array_values($images);
                                $line_item->v_new_image = count($images) > 0 ? json_encode($images) : null;
                                $line_item->save();
                                return response()->json(['status' => 'TRUE']);
                            }
                        }
                    } else if($data['uploadType'] == 'PSD') {
                        $images = $line_item->v_psd_file;
                        if($images !== null && $images != '') {
                            $images = json_decode($images, true);
                            $index = array_search($data['filename'], $images);
                            if(isset($images[$index])) {
                                unset($images[$index]);
                                unlink(LINE_ITEM_FILES.$line_item->id.'/'.$data['filename']);
                                $images = array_values($images);
                                $line_item->v_psd_file = count($images) > 0 ? json_encode($images) : null;
                                $line_item->save();
                                return response()->json(['status' => 'TRUE']);
                            }
                        }
                    } else if($data['uploadType'] == 'NewPSD') {
                        $images = $line_item->v_new_psd_file;
                        if($images !== null && $images != '') {
                            $images = json_decode($images, true);
                            $index = array_search($data['filename'], $images);
                            if(isset($images[$index])) {
                                unset($images[$index]);
                                unlink(LINE_ITEM_FILES.$line_item->id.'/'.$data['filename']);
                                $images = array_values($images);
                                $line_item->v_new_psd_file = count($images) > 0 ? json_encode($images) : null;
                                $line_item->save();
                                return response()->json(['status' => 'TRUE']);
                            }
                        }
                    }                
                }            
            }
            return response()->json(['status' => 'FALSE', 'message' => 'Something went wrong while deleting file. Please try again.']);            
        }
        return response()->json(['status' => 'FALSE', 'message' => 'You are not authorise to delete this file.']);
    }

}