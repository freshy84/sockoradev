<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddLineItemStatusField extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('lineitems', function(Blueprint $t) {
            $t->enum('e_status', ['New Order', 'Design Complete', 'Mock-up Sent', 'Redo', 'Approved'])->default('New Order')->add();
        });
        Schema::table('orders', function(Blueprint $t) {
            $t->dropColumn('e_status');
        }); 
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
