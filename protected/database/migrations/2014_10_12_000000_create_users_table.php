<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('v_firstname', 255);
            $table->string('v_lastname', 255);
            $table->string('v_email', 255)->unique();
            $table->string('password', 191);
            $table->enum('e_user_type', ['Admin','Manager','Designer','Customer Support']);
            $table->enum('e_status', ['1', '0'])->default('1');;
            $table->string('v_profile_image', 500)->nullable();
            $table->string('v_reset_pass_token', 255)->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        DB::table('users')->insert(
            array(
                'v_firstname' => 'Testing',
                'v_lastname' => 'Demo',
                'v_email' => 'testing.demo@gmail.com',
                'password' => '$2y$10$4gmEo0jda/T4TJvdGXufE.pkKYq5F2KnchfIP/Bv382udh2T7BiTC',
                'e_user_type' => 'Admin', 
                'v_profile_image' => '1545762781-8YCHUR.png',
                'e_status' => '1',
                'remember_token' => NULL,
                'v_reset_pass_token' => null
            )
        );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
