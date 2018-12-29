<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class LineItems extends Model {
    
    protected $table = 'lineitems';
    public $timestamps = false;
    

    public function properties() {
        return $this->hasMany('App\Models\LineItemProperty', 'i_lineitem_id');
    }

    public function order() {
        return $this->hasOne('App\Models\Orders', 'id', 'i_order_id');
    }
}
?>