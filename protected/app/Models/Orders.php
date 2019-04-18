<?php
namespace App\Models;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Model;

class Orders extends Model {

    use Notifiable;
    
    protected $table = 'orders';
    
    public function line_items() {
        return $this->hasMany('App\Models\LineItems', 'i_order_id');
    }

    public function routeNotificationForSlack() {
        return 'https://hooks.slack.com/services/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';
    }
}
?>