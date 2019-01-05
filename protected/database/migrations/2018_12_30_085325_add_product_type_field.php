<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddProductTypeField extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('products', function(Blueprint $t) {
            $t->string('product_type', 500)->nullable()->default(null)->after('image')->add();
        });  
        
        Schema::table('lineitems', function(Blueprint $t) {
            $t->bigInteger('product_id')->after('i_order_id')->add();
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
