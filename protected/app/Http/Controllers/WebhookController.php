<?php
namespace App\Http\Controllers;
use Hash, Mail, Session, Redirect, Validator, Excel, Cookie, DB, Config;
use App\Models\Products, App\Models\Shops, App\Models\Orders, App\Models\LineItems, App\Models\LineItemProperty;
use Illuminate\Http\Request;
use OhMyBrew\BasicShopifyAPI;

class WebhookController extends Controller {
    
    public function shopifyWebhook(Request $request) {
        file_put_contents(TEMP_IMG_PATH.'res1.txt', print_r($request->all(), true));
        file_put_contents(TEMP_IMG_PATH.'res2.txt', print_r(file_get_contents('php://input'), true));

        return 'SUCCESS';
    }

    public function saveProducts() {
        $shop = Shops::where('shopify_domain', env('SHOPIFY_DOMAIN'))->first();
        if($shop) {
            $api = new BasicShopifyAPI();
            $api->setShop(env('SHOPIFY_DOMAIN'));
            $api->setAccessToken($shop->shopify_token);
            $products = $api->rest('GET',  '/admin/products.json');

            if($products->body->products) {
                foreach($products->body->products as $product) {
                    $images = [];
                    foreach ($product->images as $image) {
                        $images[] = ['id' => $image->id, 'src' => $image->src];
                    }
                    
                    $new = new Products;
                    $new->product_id = $product->id;
                    $new->title = $product->title;
                    $new->body_html = $product->body_html;
                    $new->vendor = $product->vendor;
                    $new->tags = $product->tags;
                    $new->images = json_encode($images);
                    $new->image = isset($product->image->src) ? $product->image->src : null;
                    
                    $new->published_at = strtotime($product->published_at) > 0 ? date('Y-m-d H:i:s', strtotime($product->published_at)) : null;
                    $new->created_at = strtotime($product->published_at) > 0 ? date('Y-m-d H:i:s', strtotime($product->created_at)) : null;
                    $new->updated_at = strtotime($product->published_at) > 0 ? date('Y-m-d H:i:s', strtotime($product->updated_at)) : null;
                    
                    $new->save();
                }
            }

            echo 'success.';
            
        }
    }

    public function saveOrders() {
        $shop = Shops::where('shopify_domain', env('SHOPIFY_DOMAIN'))->first();
        if($shop) {
            $api = new BasicShopifyAPI();
            $api->setShop(env('SHOPIFY_DOMAIN'));
            $api->setAccessToken($shop->shopify_token);
            $orders = $api->rest('GET',  '/admin/orders.json?status=any&limit=250');

            if($orders->body->orders) {
                foreach($orders->body->orders as $order) {   
                    $new = Orders::where('order_id', $order->id)->first();
                    if(!$new) {
                        $new = new Orders;            
                    }                                   
                   
                    $new->order_id = $order->id;
                    $new->email = $order->email;
                    $new->name = $order->name;
                    $new->order_number = $order->order_number;
                    $new->number = $order->number;
                    $new->note = $order->note;
                    $new->token = $order->token;
                    $new->total_price = $order->total_price;
                    $new->subtotal_price = $order->subtotal_price;
                    $new->total_tax = $order->total_tax;
                    $new->total_discounts = $order->total_discounts;
                    $new->total_line_items_price = $order->total_line_items_price;
                    $new->cancel_reason = $order->cancel_reason;                                       
                    $new->cancelled_at = strtotime($order->cancelled_at) > 0 ? date('Y-m-d H:i:s', strtotime($order->cancelled_at)) : null;
                    $new->closed_at = strtotime($order->closed_at) > 0 ? date('Y-m-d H:i:s', strtotime($order->closed_at)) : null;
                    $new->created_at = strtotime($order->created_at) > 0 ? date('Y-m-d H:i:s', strtotime($order->created_at)) : null;
                    $new->updated_at = strtotime($order->updated_at) > 0 ? date('Y-m-d H:i:s', strtotime($order->updated_at)) : null;
                    
                    if($new->save()) {
                        foreach($order->line_items as $line_item) {
                            $new1 = LineItems::where('line_item_id', $line_item->id)->first();
                            if(!$new1) {
                                $new1 = new LineItems;            
                            }                            
                            $new1->line_item_id = $line_item->id;
                            $new1->i_order_id = $new->id;
                            $new1->title = $line_item->title;
                            $new1->name = $line_item->name;
                            $new1->quantity = $line_item->quantity;
                            $new1->price = $line_item->price;
                            $new1->total_discount = $line_item->total_discount;
                            
                            if($new1->save()){
                                LineItemProperty::where('i_lineitem_id', $new1->id)->delete();
                                foreach ($line_item->properties as $property) {
                                    $new2 = new LineItemProperty;
                                    $new2->i_lineitem_id = $new1->id;
                                    $new2->name = $property->name;
                                    $new2->value = $property->value;
                                    $new2->save();
                                }
                            }
                        }
                    }
                }
            }

            echo 'success.';
            
        }
    }

    public function orderWebhook(Request $request) {
        $data = $request->all();

       /*  file_put_contents(TEMP_IMG_PATH.'res1.txt', print_r($data, true));
        file_put_contents(TEMP_IMG_PATH.'res2.txt', print_r(file_get_contents('php://input'), true));
        
        pr($data);
        exit; */

        if($data) {
            $order = Orders::where('order_id', $data['id'])->first();
            if(!$order) {
                $order = new Orders;            
            }
            
            $order->order_id = $data['id'];
            $order->email = $data['email'];
            $order->name = $data['name'];
            $order->order_number = $data['order_number'];
            $order->number = $data['number'];
            $order->note = $data['note'];
            $order->token = $data['token'];
            $order->total_price = $data['total_price'];
            $order->subtotal_price = $data['subtotal_price'];
            $order->total_tax = $data['total_tax'];
            $order->total_discounts = $data['total_discounts'];
            $order->total_line_items_price = $data['total_line_items_price'];
            $order->cancel_reason = $data['cancel_reason'];
            $order->cancelled_at = strtotime($data['cancelled_at']) > 0 ? date('Y-m-d H:i:s', strtotime($data['cancelled_at'])) : null;
            $order->closed_at = strtotime($data['closed_at']) > 0 ? date('Y-m-d H:i:s', strtotime($data['closed_at'])) : null;
            $order->created_at = strtotime($data['created_at']) > 0 ? date('Y-m-d H:i:s', strtotime($data['created_at'])) : null;
            $order->updated_at = strtotime($data['updated_at']) > 0 ? date('Y-m-d H:i:s', strtotime($data['updated_at'])) : null;
            
            if($order->save()) {
                foreach($data['line_items'] as $value) {
                    $line_item = LineItems::where('line_item_id', $value['id'])->first();
                    if(!$line_item) {
                        $line_item = new LineItems;            
                    }

                    $line_item->line_item_id = $value['id'];
                    $line_item->i_order_id = $order['id'];
                    $line_item->title = $value['title'];
                    $line_item->name = $value['name'];
                    $line_item->quantity = $value['quantity'];
                    $line_item->price = $value['price'];
                    $line_item->total_discount = $value['total_discount'];
                    
                    if($line_item->save()){
                        LineItemProperty::where('i_lineitem_id', $line_item->id)->delete();
                        foreach ($value['properties'] as $property) {
                            $new2 = new LineItemProperty;
                            $new2->i_lineitem_id = $line_item->id;
                            $new2->name = $property['name'];
                            $new2->value = $property['value'];
                            $new2->save();
                        }
                    }
                }
            }            
        }

        return 'Success';
    }

    public function productWebhook(Request $request) {
        $data = $request->all();
        if($data) {
            $product = Products::where('product_id', $data['id'])->first();
            if(!$product) {
                $product = new Products;            
            }
            
            $images = [];
            foreach ($data['images'] as $image) {
                $images[] = ['id' => $image['id'], 'src' => $image['src']];
            }            
            
            $product->product_id = $data['id'];
            $product->title = $data['title'];
            $product->body_html = $data['body_html'];
            $product->vendor = $data['vendor'];
            $product->tags = $data['tags'];
            $product->images = json_encode($images);
            $product->image = isset($data['image']['src']) ? $data['image']['src'] : null;        
            $product->published_at = strtotime($data['published_at']) > 0 ? date('Y-m-d H:i:s', strtotime($data['published_at'])) : null;
            $product->created_at = strtotime($data['created_at']) > 0 ? date('Y-m-d H:i:s', strtotime($data['created_at'])) : null;
            $product->updated_at = strtotime($data['updated_at']) > 0 ? date('Y-m-d H:i:s', strtotime($data['updated_at'])) : null;       
            
            $product->save();            
        }

        return 'Success';
    }

}