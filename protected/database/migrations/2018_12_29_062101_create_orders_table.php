<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->increments('id');
            $table->bigInteger('order_id');
            $table->string('email', 255);
            $table->string('name', 255);
            $table->integer('order_number');
            $table->integer('number');
            $table->text('note');
            $table->string('token', 255);
            $table->decimal('total_price', 10, 2);
            $table->decimal('subtotal_price', 10, 2);
            $table->decimal('total_tax', 10, 2);
            $table->decimal('total_discounts', 10, 2);
            $table->decimal('total_line_items_price', 10, 2);
            $table->string('cancel_reason', 500);
            $table->dateTime('cancelled_at')->nullable();
            $table->dateTime('closed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('orders');
    }
}
