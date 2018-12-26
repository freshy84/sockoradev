@extends('layouts.default')
@section('content')	
<style>
    .profile-userpic img{ border-radius: 0 !important; }
    .error-inner {color:red;}
    .duplicate-error{color:red;}
</style>
<div class="page-content-wrapper">
    <div class="page-content my-profile" style="min-height:1100px">
        <div class="portlet box blue-madison">
    		<div class="portlet-title">
    			<div class="caption">
    				<i class="icon-user"></i>{{ $title }}
    			</div>
    		</div>
            <div class="portlet-body form">
                <div class="form-body">
                    <form role="form"  action="{{action('AuthenticateController@my_profile')}}" name="update_profile" class="form-horizontal" id="update_profile" method="post" onsubmit="return false;">
                        {!! csrf_field() !!}                       
                        <div class="alert alert-success display-hide">
                            <span class="close" data-close="alert"></span>
                            Your personal information has been successfully updated.
                        </div>
                        <div class="alert alert-danger display-hide">
                            <span class="close" data-close="alert"></span>
                            You have some form errors. Please check below.
                        </div>
                        <div class="form-group">
                            <label class="control-label col-md-3"> First Name<span class="redLabel">*</span></label>
                            <div class="col-md-4"><input type="text" value="{{ $records['v_firstname'] }}" name="v_firstname" placeholder="Your first name" class="form-control input-icon required aplha" id="v_firstname"/></div>
                        </div>
                        <div class="form-group">
                            <label class="control-label col-md-3">Last Name<span class="redLabel">*</span></label>
                            <div class="col-md-4"><input type="text" value="{{ $records['v_lastname'] }}" name="v_lastname" placeholder="Your last name" class="form-control input-icon required alpha" id="v_lastname"/></div>
                        </div>
                        <div class="form-group">
                            <label class="control-label col-md-3">Email<span class="redLabel">*</span></label>
                            <div class="col-md-4"><input type="text" name="v_email" placeholder="Your email id" value="{{ $records['v_email'] }}" class="form-control input-icon required email"/>
                             <div id="error_v_email" class="duplicate-error" style="display: none;">Email Id already exits.</div>
                             </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label col-md-3">Profile Picture
                            </label>
                            <div class="input-file-box col-md-8">
                                <div class="fileinput" data-provides="fileinput">

                                    <img  width="220px" src="<?php
                                    if (File::exists(USER_PROFILE_IMAGE_PATH . $records['v_profile_image']) && $records['v_profile_image'] != '') {
                                        echo SITE_URL . USER_PROFILE_IMAGE_PATH . $records['v_profile_image'];
                                    } else {
                                        echo SITE_URL.'assets/img/default-image.png';
                                    }
                                    ?>" class="img-responsive default_img_size" name="profileimg"  alt="" id="profile_pic" />

                                    <img  width="220px" src="{{ SITE_URL.'assets/img/default-image.png'}}" class="img-responsive default_img_size" id="defailt_profile_pic" style="display: none;"/>
                                </div>
                                <div class="clearfix"></div>
                                <div style="margin-top:20px">
                                    <button class="btn btn-default" type="button" id="file_trriger"><?php echo File::exists(USER_PROFILE_IMAGE_PATH . $records['v_profile_image']) && $records['v_profile_image'] != '' ? 'Change' : 'Select Image'; ?></button>  

                                    <button class="btn btn-default" type="button" id="remove_image" style="display: {{  File::exists(USER_PROFILE_IMAGE_PATH.$records['v_profile_image']) && $records['v_profile_image'] !='' ? 'inline-block' : 'none' }};">Remove</button> 
                                </div>


                                <input type="file" id="image_change" style="display: none;" />

                                <input type="hidden" id="user_profile_iamge" name="user_profile_iamge" value="<?php
                                if (File::exists(USER_PROFILE_IMAGE_PATH . $records['v_profile_image']) && $records['v_profile_image'] != '') {
                                    echo SITE_URL . USER_PROFILE_IMAGE_PATH . $records['v_profile_image'];
                                } else {
                                    echo '';
                                }
                                ?>"/>

                                <input type="hidden" id="default_img" name="default_img" value="<?php
                                if (File::exists(USER_PROFILE_IMAGE_PATH . $records['v_profile_image']) && $records['v_profile_image'] != '') {
                                    echo '0';
                                } else {
                                    echo '1';
                                }
                                ?>"/>
                                <input type="hidden" name="imgbase64" value=""  id="imgbase64" />
                                <input type="hidden" id="x" name="x" />
                                <input type="hidden" id="y" name="y" />
                                <input type="hidden" id="x2" name="x2" />
                                <input type="hidden" id="y2" name="y2" />
                                <input type="hidden" id="w" name="w" />
                                <input type="hidden" id="h" name="h" />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label col-md-3">Password</label>
                            <div class="col-md-4">
                                <input type="password" name="password_new" id="password_new" class="form-control password validate_password"/>
                                <br /> <span class="label label-sm label-danger">Note</span> Password will be changed only if entered.
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label col-md-3">Confirm Password</label>
                            <div class="col-md-4"><input type="password" name="password_retype" class="form-control input-icon password" id="password_retype"  equalTo="password_new"/></div>
                        </div>
                        <div class="margiv-top-10 form-actions">
                            <div class="row">
                                <div class="col-md-offset-3 col-md-9">
                                    <button type="submit" class="btn blue-madison" id="profile-btn" >
                                        Save Changes 
                                    </button>
                                    <a href="{{ SITE_URL }}dashboard" class="btn default">Cancel </a>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
      </div>
    </div>
</div>
<script>
$(document).ready(function(){
    handleProfileForm();
    $('#tab_2_visible').removeClass('tab_2_visible');
	var im = '<?php echo $records['v_profile_image']; ?>';
    if(im != ''){
        $('#up_img').hide();
        $('#change_img').show();
        $('#rmv_img').show();
    } else {
        $('#image_val').removeClass('thumbnail');
        $('#up_img').show();
        $('#change_img').hide();
        $('#rmv_img').hide();
      
    }
    $('#rmv_img').on('click',function(){
        $('#edit_img').hide();
        $('#up_img').show();
        $('#change_img').hide();
        $('#rmv_img').hide();
		$("#img_remove_flag").val("Yes");
    });
    $('#image_upload').on('change',function(){
        var t= $('#image_upload').val();
		 $('#image_val').addClass('thumbnail');
        if(t!= ''){
          $('#up_img').hide();
          $('#change_img').show();
          $('#rmv_img').show();
		  $("#img_remove_flag").val("");
        }        
        $("#img_div").attr('style',"display:block");
    });
});
</script>
@stop