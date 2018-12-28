<!DOCTYPE html>
<html lang="en">
    <!-- BEGIN HEAD -->
    <head>
        <meta charset="utf-8"/>
        <title><?php echo e($title); ?> | <?php echo e(SITE_NAME); ?></title>
        <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
        <meta http-equiv="Content-type" content="text/html; charset=utf-8">
        <meta content="" name="description"/>
        <meta content="" name="author"/>
        <!-- BEGIN GLOBAL MANDATORY STYLES -->
        <link href="http://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700&subset=all" rel="stylesheet" type="text/css"/>
        <link href="<?php echo e(ASSET_URL); ?>plugins/font-awesome/css/font-awesome.min.css<?php echo e(CSS_VERSION); ?>" rel="stylesheet" type="text/css"/>
        <link href="<?php echo e(ASSET_URL); ?>plugins/simple-line-icons/simple-line-icons.min.css<?php echo e(CSS_VERSION); ?>" rel="stylesheet" type="text/css"/>
        <link href="<?php echo e(ASSET_URL); ?>plugins/bootstrap/css/bootstrap.min.css<?php echo e(CSS_VERSION); ?>" rel="stylesheet" type="text/css"/>
        <link href="<?php echo e(ASSET_URL); ?>plugins/uniform/css/uniform.default.min.css<?php echo e(CSS_VERSION); ?>" rel="stylesheet" type="text/css"/>
        <link href="<?php echo e(ASSET_URL); ?>plugins/bootstrap-switch/css/bootstrap-switch.min.css<?php echo e(CSS_VERSION); ?>" rel="stylesheet" type="text/css"/>
        <!-- END GLOBAL MANDATORY STYLES -->
        <link href="<?php echo e(ASSET_URL); ?>css/lock.css<?php echo e(CSS_VERSION); ?>" rel="stylesheet" type="text/css"/>
        <!-- BEGIN THEME STYLES -->
        <link href="<?php echo e(ASSET_URL); ?>css/components.css<?php echo e(CSS_VERSION); ?>" id="style_components" rel="stylesheet" type="text/css"/>
        <link href="<?php echo e(ASSET_URL); ?>css/plugins.css<?php echo e(CSS_VERSION); ?>" rel="stylesheet" type="text/css"/>
        <link href="<?php echo e(ASSET_URL); ?>css/layout.css<?php echo e(CSS_VERSION); ?>" rel="stylesheet" type="text/css"/>
        <link id="style_color" href="<?php echo e(ASSET_URL); ?>css/themes/light.css<?php echo e(CSS_VERSION); ?>" rel="stylesheet" type="text/css"/>

        <link href="<?php echo e(ASSET_URL); ?>css/login3.css<?php echo e(CSS_VERSION); ?>" rel="stylesheet" type="text/css"/>
        <link href="<?php echo e(ASSET_URL); ?>css/custom.css<?php echo e(CSS_VERSION); ?>" rel="stylesheet" type="text/css"/>
        <link rel="stylesheet" type="text/css" href="<?php echo e(ASSET_URL); ?>plugins/fancybox/source/jquery.fancybox.css?v=2.1.2" media="screen" />
        <link rel="stylesheet" type="text/css" href="<?php echo e(ASSET_URL); ?>plugins/fancybox/source/helpers/jquery.fancybox-buttons.css?v=1.0.5" />
        <link rel="stylesheet" type="text/css" href="<?php echo e(ASSET_URL); ?>plugins/fancybox/source/helpers/jquery.fancybox-thumbs.css?v=1.0.7" />

        <!-- END THEME STYLES -->
        <link rel="shortcut icon" href="<?php echo e(ASSET_URL); ?>favicon.ico"/>

        <style>
            textarea:focus::-webkit-input-placeholder, input:focus::-webkit-input-placeholder  { opacity: 0;}
            /* Mozilla Firefox 4 to 18 */
            input:focus:-moz-placeholder {  opacity: 0;}
            /* Mozilla Firefox 19+ */
            input:focus::-moz-placeholder { opacity: 0; }
            /* Internet Explorer 10+ */
            input:focus:-ms-input-placeholder { opacity: 0;}
            textarea::-webkit-input-placeholder, input::-webkit-input-placeholder { color: #888;}
            input:-moz-placeholder { color: #888; }
            input::-moz-placeholder { color:#888; }
            input:-ms-input-placeholder { color: #888;}
        </style>
    </head>
    <!-- END HEAD -->
    <!-- BEGIN BODY -->
    <body class="page-header-fixed page-sidebar-closed-hide-logo page-quick-sidebar-over-content login">
        <!-- BEGIN PAGE SPINNER -->
        <div id="loading">
            <div class="loading-center">
                <div class="outer"></div>
                <div class="inner"></div>
            </div>
        </div>   
        <!-- END PAGE SPINNER -->

        <!-- BEGIN JAVASCRIPTS(Load javascripts at bottom, this will reduce page load time) -->
        <!-- BEGIN CORE PLUGINS -->
        <!--[if lt IE 9]>
        <script src="plugins/respond.min.js"></script>
        <script src="plugins/excanvas.min.js"></script>
        <![endif]-->
        <script src="<?php echo e(ASSET_URL); ?>plugins/jquery.min.js<?php echo e(JS_VERSION); ?>" type="text/javascript"></script>
        <script src="<?php echo e(ASSET_URL); ?>plugins/jquery-migrate.min.js<?php echo e(JS_VERSION); ?>" type="text/javascript"></script>
        <!-- IMPORTANT! Load jquery-ui-1.10.3.custom.min.js before bootstrap.min.js to fix bootstrap tooltip conflict with jquery ui tooltip -->
        <script src="<?php echo e(ASSET_URL); ?>plugins/jquery-ui/jquery-ui-1.10.3.custom.min.js<?php echo e(JS_VERSION); ?>" type="text/javascript"></script>
        <script src="<?php echo e(ASSET_URL); ?>plugins/bootstrap/js/bootstrap.min.js<?php echo e(JS_VERSION); ?>" type="text/javascript"></script>

        <script src="<?php echo e(ASSET_URL); ?>plugins/jquery-slimscroll/jquery.slimscroll.min.js<?php echo e(JS_VERSION); ?>" type="text/javascript"></script>
        <script src="<?php echo e(ASSET_URL); ?>plugins/jquery.blockui.min.js<?php echo e(JS_VERSION); ?>" type="text/javascript"></script>
        <script src="<?php echo e(ASSET_URL); ?>plugins/jquery.cokie.min.js<?php echo e(JS_VERSION); ?>" type="text/javascript"></script>
        <script src="<?php echo e(ASSET_URL); ?>plugins/jquery-validation/js/jquery.validate.min.js<?php echo e(JS_VERSION); ?>" type="text/javascript"></script>
        <script src="<?php echo e(ASSET_URL); ?>plugins/uniform/jquery.uniform.min.js<?php echo e(JS_VERSION); ?>" type="text/javascript"></script>
        <script src="<?php echo e(ASSET_URL); ?>plugins/bootstrap-switch/js/bootstrap-switch.min.js<?php echo e(JS_VERSION); ?>" type="text/javascript"></script>
        <!-- END CORE PLUGINS -->
        <script src="<?php echo e(ASSET_URL); ?>scripts/metronic.js<?php echo e(JS_VERSION); ?>" type="text/javascript"></script>
        <script src="<?php echo e(ASSET_URL); ?>scripts/layout.js<?php echo e(JS_VERSION); ?>" type="text/javascript"></script>
        <script src="<?php echo e(ASSET_URL); ?>scripts/demo.js<?php echo e(JS_VERSION); ?>" type="text/javascript"></script>
        <script src="<?php echo e(ASSET_URL); ?>scripts/login.js<?php echo e(JS_VERSION); ?>" type="text/javascript"></script>

        <?php echo $__env->yieldContent('content'); ?>
        <script type="text/javascript">
            var SITE_URL = "<?php echo SITE_URL; ?>";
            jQuery(document).ready(function () {
                // initiate layout and plugins
                Metronic.init(); // init metronic core components
                Layout.init(); // init current layout
                Demo.init(); // init demo features
                Login.init(); // init demo features  
                setTimeout(function () {
                    $(".alert-success").fadeOut(3000);
                }, 4000);
            });
            $(window).load(function () {
                $('#loading').addClass('hide');
            });
        </script>
        <!-- END JAVASCRIPTS -->
    </body>
    <!-- END BODY -->
</html>
