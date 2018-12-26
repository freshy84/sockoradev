<!-- BEGIN HEADER -->
<div class="page-header navbar navbar-fixed-top">
    <!-- BEGIN HEADER INNER -->
    <div class="page-header-inner">
        <!-- BEGIN LOGO -->
        <div class="page-logo logo_dis">
            <span class="log_title">{{ SITE_NAME }}</span>
        </div>
        <!-- END LOGO -->
        <!-- BEGIN RESPONSIVE MENU TOGGLER -->
        <a href="javascript:;" class="menu-toggler responsive-toggler" data-toggle="collapse" data-target=".navbar-collapse">
        </a>
        <!-- END RESPONSIVE MENU TOGGLER -->
        <!-- BEGIN TOP NAVIGATION MENU -->
        <div class="top-menu">
            <ul class="nav navbar-nav pull-right">
                <!-- BEGIN USER LOGIN DROPDOWN -->
                <!-- DOC: Apply "dropdown-dark" class after below "dropdown-extended" to change the dropdown styte -->

                <li class="dropdown dropdown-user">
                    <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                        <img alt="" style="width:29px" class="img-circle" src="<?php
                        if (File::exists(USER_PROFILE_THUMB_IMAGE_PATH . Auth::guard('admin')->user()->v_profile_image) && Auth::guard('admin')->user()->v_profile_image != '') {
                            echo SITE_URL . USER_PROFILE_THUMB_IMAGE_PATH . Auth::guard('admin')->user()->v_profile_image;
                        } else {
                            echo SITE_URL . 'assets/img/default-image.png';
                        }
                        ?>"/>
                        <span class="username username-hide-mobile" id="name">{{ Auth::guard('admin')->user()->v_firstname }} {{ Auth::guard('admin')->user()->v_lastname }}</span>
                        <i class="fa fa-angle-down"></i>
                    </a>
                    <ul class="dropdown-menu dropdown-menu-default">
                        <li>
                            <a href="<?php echo SITE_URL . "my_profile"; ?>">
                                <i class="icon-user"></i> My Profile </a>
                        </li>
                        <li class="divider">
                        </li>
                        <li>
                            <a href="<?php echo SITE_URL . "logout"; ?>">
                                <i class="icon-key"></i> Logout </a>
                        </li>
                    </ul>
                </li>                
            </ul>
        </div>
        <!-- END TOP NAVIGATION MENU -->
    </div>
    <!-- END HEADER INNER -->
</div>
<!-- END HEADER -->
<div class="clearfix">
</div>