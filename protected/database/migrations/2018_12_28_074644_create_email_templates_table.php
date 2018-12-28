<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEmailTemplatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('email_templates', function (Blueprint $table) {
            $table->increments('id');
            $table->string('v_title', 255);
            $table->string('v_subject', 255);
            $table->text('t_body');
            $table->integer('i_updated_by')->default(1);
            $table->timestamps();
        });

        DB::table('email_templates')->insert(
            array(
                'v_title' => 'Forgot Password Template', 
                'v_subject' => 'Forgot Password',
                't_body' => '<div class=\"body-wrap\" style=\"font-family:helvetica neue,helvetica,helvetica,arial,sans-serif; font-size:100%; line-height:1.6em; margin: 0 auto; width:100%; max-width: 600px;border: 2px #a0a0a0 solid;\">\r\n        <div style=\"padding:20px;\">\r\n            <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%\">\r\n                <tbody>\r\n                    <tr>\r\n                        <td>\r\n                            <center>[SITE_NAME]</center>\r\n                        </td>\r\n                    </tr>\r\n\r\n                </tbody>\r\n            </table>\r\n            <br>\r\n            <div class=\"content\" style=\"font-family: \'Helvetica Neue\', \'Helvetica\', Helvetica, Arial, sans-serif; font-size: 100%; line-height: 1.6em; display: block; max-width: 600px; padding: 0;\">\r\n                <table style=\"font-family:helvetica neue,helvetica,helvetica,arial,sans-serif; font-size:100%; line-height:1.6em; margin:0; padding:0; width:100%\">\r\n                    <tbody>\r\n                        <tr>\r\n                            <td>\r\n                                <p><strong>Hi [USERNAME],</strong></p>\r\n                                <p>The password reset request was submitted to your profile. Please click the link below in order to reset your password.</p>\r\n                                <p><a href=\"[LINK]\">[LINK]</a></p>                               \r\n                            </td>\r\n                        </tr>\r\n                    </tbody>\r\n                </table>\r\n            </div>\r\n        </div>\r\n        <div style=\"width:100%;background-color:#222328;padding: 10px;box-sizing: border-box;\">\r\n            <div>\r\n                <center><a href=\"[SITE_URL]\" target=\"_blank\" style=\"color:white;text-decoration: none;\">[SITE_NAME]</a><center>\r\n            </div>\r\n        </div>\r\n    </div>'
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
        Schema::dropIfExists('email_templates');
    }
}
