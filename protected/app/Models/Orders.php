<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Orders extends Model {
    
    protected $table = 'orders';
    
    public function line_items() {
        return $this->hasMany('App\Models\LineItems', 'i_order_id');
    }
}
?>