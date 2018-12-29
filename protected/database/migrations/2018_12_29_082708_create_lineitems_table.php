<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLineitemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('lineitems', function (Blueprint $table) {
            $table->increments('id');
            $table->bigInteger('line_item_id');
            $table->integer('i_order_id');
            $table->string('title', 500);
            $table->string('name', 500);
            $table->integer('quantity');
            $table->decimal('price', 10, 2);
            $table->decimal('total_discount', 10, 2);
            $table->string('vendor', 500);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('lineitems');
    }
}
