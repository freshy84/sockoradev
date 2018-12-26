@extends('layouts.default')
@section('content')
<style>
    .profile-userpic img{ border-radius: 0 !important; }
    .error-inner {color:red;}
    .duplicate-error{color:red;}
</style>
<script>


    $(document).ready(function () {


        general_char_count_textarea('welcometext', 250, 'txt-length-left');
        general_char_count_textarea('welcome_header', 50, 'welcome_header_left');
        general_char_count_textarea('contactus_text', 120, 'txt_contactus_text');

// welcome text function to count character
        $('#welcometext').keyup(function (event) {
            general_char_count_textarea('welcometext', 250, 'txt-length-left');
        });
        $('#welcometext').keypress(function (event) {
            general_char_count_textarea('welcometext', 250, 'txt-length-left');
        });

        $('#contactus_text').keyup(function (event) {
            general_char_count_textarea('contactus_text', 120, 'txt_contactus_text');
        });
        $('#contactus_text').keypress(function (event) {
            general_char_count_textarea('contactus_text', 120, 'txt_contactus_text');
        });

        $('#welcome_header').keyup(function (event) {
            general_char_count_textarea('welcome_header', 50, 'welcome_header_left');
        });
        $('#welcome_header').keypress(function (event) {
            general_char_count_textarea('welcome_header', 50, 'welcome_header_left');
        });



    });
</script>

<div class="page-content-wrapper">
    <div class="page-content" style="min-height:1100px">
        <div class="portlet box blue-madison">
            <div class="portlet-title">
                <div class="caption">
                    <i class="icon-settings"></i>App Setting Information
                </div>
            </div>
            <div class="portlet-body form">
                <div class="form-body">
                    <form role="form" action="{{action('AuthenticateController@AppSetting',array('langcode'=>$langCode))}}" name="update_setting" class="form-horizontal" id="update_setting" method="post" onsubmit="return false;">
                        {!! csrf_field() !!}
                        <div class="alert alert-success display-hide">
                            <span class="close" data-close="alert"></span>
                            Record has been successfully updated.
                        </div>
                        <div class="alert alert-danger display-hide">
                            <span class="close" data-close="alert"></span>
                            You have some form errors. Please check below.
                        </div>

                        <div class="form-group">
                            <label class="control-label col-md-2">
                                Privacy Policy <span class="redLabel">*</span>
                            </label>
                            <div class="col-md-9">
                                <textarea id="privacypolicy" name="privacypolicy" class="form-control ckeditor input-icon required" placeholder="Privacy Policy Description">         {{(!empty($responseData->privacypolicy)?$responseData->privacypolicy:'')}}
                                </textarea>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="control-label col-md-2">
                                About This App <span class="redLabel">*</span>
                            </label>
                            <div class="col-md-9">
                                <textarea id="aboutapp" name="aboutapp" class="form-control ckeditor input-icon required" placeholder="About App Description">
								   {{(!empty($responseData->aboutapp)?$responseData->aboutapp:'')}}
                                </textarea>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="control-label col-md-2">
                                Terms and Conditions <span class="redLabel">*</span>
                            </label>
                            <div class="col-md-9">
                                <textarea id="terms_condition" name="terms_condition" class="form-control ckeditor input-icon required" placeholder="Terms and Conditions Description">{{(!empty($responseData->terms_condition)?trim($responseData->terms_condition):'')}}</textarea>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="control-label col-md-2">
                                Welcome Text <span class="redLabel">*</span>
                            </label>
                            <div class="col-md-9">
                                <textarea id="welcometext" name="welcome_text" class="form-control required" placeholder="Welcome Text Description" maxlength="250" cols="2" rows="4"> {{(!empty($responseData->welcome_text)?$responseData->welcome_text:'')}} </textarea>
                                <span id="txt-length-left" class="help-block"> </span>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="control-label col-md-2">
                                Welcome Header <span class="redLabel">*</span>
                            </label>
                            <div class="col-md-9">
                                <input type="text" maxlength="50" id="welcome_header" name="welcome_header" class="form-control required" placeholder="Welcome Header" value="{{(isset($responseData->welcome_header) && !empty($responseData->welcome_header)?$responseData->welcome_header:'')}}"  >
                                <span id="welcome_header_left" class="help-block"></span>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="control-label col-md-2">
                                Contact Us Text<span class="redLabel">*</span>
                            </label>
                            <div class="col-md-9">
                                <textarea id="contactus_text" name="contactus_text" class="form-control required" placeholder="Welcome Text Description" maxlength="120" cols="2" rows="4">{{(isset($responseData->contactus_text) && !empty($responseData->contactus_text)?$responseData->contactus_text:'')}} </textarea>

                                <span id="txt_contactus_text" class="help-block"></span>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="control-label col-md-2">
                                Voucher Status <span class="redLabel">*</span>
                            </label>
                            <div class="col-md-9">
                                <select name="passcode_status" class="form-control">
                                    <option {{($Passcode->passcode_status == "Enabled")?"selected":'' }} value="Enabled">Enabled</option>
                                    <option  {{($Passcode->passcode_status == "Disabled")?"selected":'' }} value="Disabled">Disabled</option>
                                </select>
                            </div>

                        </div>

                        <div class="margiv-top-10 form-actions">
                            <div class="row">
                                <div class="col-md-offset-2 col-md-9">
                                    <button type="submit" class="btn blue-madison" id="profile-btn" >
                                        Save Changes
                                    </button>
                                    <a href="{{ SITE_URL }}{{$langCode}}/dashboard" class="btn default">Cancel </a>
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
    $(document).ready(function () {
        handleProfileForm();
    });
</script>
@stop
