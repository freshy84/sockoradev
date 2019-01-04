<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddNewImageFieldLineItem extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement('ALTER TABLE lineitems CHANGE v_image v_image TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL');
        DB::statement('ALTER TABLE lineitems CHANGE v_psd_file v_psd_file TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL');

        Schema::table('lineitems', function(Blueprint $t) {
            $t->text('v_new_image')->nullable()->default(null)->add();
            $t->text('v_new_psd_file')->nullable()->default(null)->add();
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
