@extends('layouts.master')
@section('content')	
<div class="logo">
    <a href="{{ SITE_URL }}">
        <img src="{{ SITE_URL }}assets/img/logo.png" alt="" width="200" height="auto" />
    </a>
</div>

<div class="content">
    <form class="form-horizontal" action="<?php echo SITE_URL . 'reset-password/' . $record->v_reset_pass_token; ?>" id="reset_password" name="reset-form" method="POST">
        <h3 class="form-title">Reset your password here</h3>
        <?php
        $msg = Session::get('message');
        if ($msg) {
            ?>
            <div class="alert alert-danger">
                <button type="button" class="close" data-close="alert"></button>
                <span>{{ $msg}}</span>
            </div>
        <?php } ?>
        <div class="alert alert-success display-none">
            <button class="close" ></button>
            Your form validation is successful!
        </div>
        <input type="hidden" name="_token" value="{!! csrf_token() !!}"/>

        <!--div class="form-group">
            <label class="control-label col-md-5">Email: </span>
            </label>
            <div class="col-md-6">
                 <label class="control-label col-md-5" style="font-weight: bold;"> {{ $record->email_id }} </label>
            </div>
        </div-->
        <div class="form-group">
            <label class="control-label">Email: </label>
            <label class="control-label"><strong>{{ $record->v_email }} </strong></label>
            

        </div>

        <div class="form-group">
            <label class="control-label visible-ie8 visible-ie9">Password</label>
            <div class="input-icon">
                <i class="fa fa-lock"></i>
                <input class="form-control placeholder-no-fix required validate_password" type="password" autocomplete="off" placeholder="Password" id="password" name="password"/>
            </div>

        </div>
        <div class="form-group">
            <label class="control-label visible-ie8 visible-ie9">Confirm Password</label>
            <div class="input-icon">
                <i class="fa fa-lock"></i>
                <input class="form-control placeholder-no-fix required" type="password" autocomplete="off" ng-enter placeholder="Confirm Password" equalTo="#password" name="confirm_password"/>

            </div>
        </div>
        <div class="form-actions cf">
            <label class="checkbox">&nbsp;</label>
            <button type="submit" class="btn blue-madison pull-right" id="reset-btn">
                Change <i class="m-icon-swapright m-icon-white"></i>
            </button>
        </div>                   


    </form>
</div>

<div class="copyright">
    {{ date('Y')}} &copy; {{ SITE_NAME}}. All Rights Reserved.
</div> 
@stop