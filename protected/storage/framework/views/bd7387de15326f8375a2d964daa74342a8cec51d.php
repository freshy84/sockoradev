<?php $__env->startSection('content'); ?>	
<!-- BEGIN LOGO -->
<div class="logo">
    <a href="<?php echo e(SITE_URL); ?>">
        <img src="<?php echo e(SITE_URL); ?>img/logo.png" alt="" width="100" height="auto" />
    </a>
</div>
<!-- END LOGO -->
<div class="content">
    <form action="<?php echo e(action('AuthenticateController@index')); ?>" id="login-form" name="loginFrm" class="login-form" method="POST">
        <input type="hidden" name="_token" value="<?php echo csrf_token(); ?>"/>
        <h3 class="form-title">Login to your account</h3>
        <?php
        $msg = Session::get('message');
        if ($msg) {
            ?>
            <div class="alert alert-danger">
                <button type="button" class="close" data-close="alert"></button>
                <span><?php echo e($msg); ?></span>
            </div>

        <?php } ?>
        <?php
        $success_msg = Session::get('msg');
        if ($success_msg) {
            ?>
            <div class="alert alert-success">
                <button type="button" class="close" data-close="alert"></button>
                <?php echo e($success_msg); ?>

            </div>
        <?php } ?>
        <div class="form-group">
            <label class="control-label visible-ie8 visible-ie9">Email Id</label>
            <div class="input-icon">
                <i class="fa fa-user"></i>
                <input class="form-control placeholder-no-fix required email" type="text" autocomplete="off" placeholder="Username or Email" id="v_email" name="v_email" />
            </div>
        </div>
        <div class="form-group">
            <label class="control-label visible-ie8 visible-ie9">Password</label>
            <div class="input-icon">
                <i class="fa fa-lock"></i>
                <input class="form-control placeholder-no-fix required" type="password" autocomplete="off" placeholder="Password" name="password" id="password"/>
            </div>
        </div>
        <div class="form-actions clearfix">
            <label class="checkbox"><input type="checkbox" name="remember" value="1"/> Remember me </label>
            <button type="submit" class="btn blue-madison pull-right" id="login-btn" >
                Login <i class="m-icon-swapright m-icon-white"></i>
            </button>
        </div>
        <div class="forget-password"> 
            <h4>Forget your password ?</h4>
            <p>
                No worries, click <a href="javascript:void(0);" id="forget-password">
                    here </a>
                to reset your password.
            </p>
        </div>
    </form>
    <!-- END LOGIN FORM -->
    <!-- BEGIN FORGOT PASSWORD FORM -->
    <form action="<?php echo e(action('AuthenticateController@forgot_password')); ?>" id="forget-form" name="forget-pass-form" class="forget-form" method="POST">
        <?php echo csrf_field(); ?>

        <h3>Forget Password ?</h3>
        <p>
            Enter your e-mail address below to reset your password.
        </p>
        <?php
        $msg = Session::get('message');
        if ($msg) {
            ?>
            <div class="alert alert-danger">
                <button type="button" class="close" data-close="alert"></button>
                <span><?php echo e($msg); ?></span>
            </div>
        <?php } ?>
        <div class="form-group">
            <div class="input-icon">
                <i class="fa fa-envelope"></i>
                <input type="text" class="form-control placeholder-no-fix required email" name="v_email" placeholder="Email" autocomplete="off" id="forget_v_email" />
            </div>
        </div>
        <div class="form-actions">
            <button class="btn" id="back-btn" type="button">
                <i class="m-icon-swapleft"></i> Back </button>
            <button class="btn blue-madison pull-right" type="submit" id="forget_btn">
                Submit <i class="m-icon-swapright m-icon-white"></i>
            </button>
        </div>
    </form> 
    <!-- END FORGOT PASSWORD FORM -->
</div>
<!-- END LOGIN -->
<!-- BEGIN COPYRIGHT -->
<div class="copyright">
    <?php echo e(date('Y')); ?> &copy; <?php echo e(SITE_NAME); ?>. All Rights Reserved.
</div>
<!-- END COPYRIGHT -->
<?php $__env->stopSection(); ?>
<?php echo $__env->make('layouts.master', array_except(get_defined_vars(), array('__data', '__path')))->render(); ?>