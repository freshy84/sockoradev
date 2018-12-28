<!DOCTYPE html>
<!--[if IE 8]> <html lang="en" class="ie8 no-js"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9 no-js"> <![endif]-->
<!--[if !IE]><!-->
<html lang="en">
    <!--<![endif]-->
    <!-- BEGIN HEAD -->
    <head>
        <meta charset="utf-8"/>
        <title><?php echo e($title); ?> | <?php echo e(SITE_NAME); ?></title>
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta content="width=device-width, initial-scale=1" name="viewport"/>
        <meta content="" name="description"/>
        <meta content="" name="author"/>
        <!-- BEGIN GLOBAL MANDATORY STYLES -->
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700&subset=all" rel="stylesheet" type="text/css"/>
        <link href="<?php echo e(ASSET_URL); ?>plugins/font-awesome/css/font-awesome.min.css<?php echo e(CSS_VERSION); ?>" rel="stylesheet" type="text/css"/>
        <link href="<?php echo e(ASSET_URL); ?>plugins/simple-line-icons/simple-line-icons.min.css<?php echo e(CSS_VERSION); ?>" rel="stylesheet" type="text/css"/>
        <link href="<?php echo e(ASSET_URL); ?>plugins/bootstrap/css/bootstrap.min.css<?php echo e(CSS_VERSION); ?>" rel="stylesheet" type="text/css"/>
        <link href="<?php echo e(ASSET_URL); ?>plugins/uniform/css/uniform.default.min.css<?php echo e(CSS_VERSION); ?>" rel="stylesheet" type="text/css"/>
        <link href="<?php echo e(ASSET_URL); ?>plugins/bootstrap-switch/css/bootstrap-switch.css<?php echo e(CSS_VERSION); ?>" rel="stylesheet" type="text/css"/>
        <link href="<?php echo e(ASSET_URL); ?>plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css<?php echo e(CSS_VERSION); ?>" rel="stylesheet" type="text/css"/>
        <!-- END GLOBAL MANDATORY STYLES -->
        <!-- BEGIN PAGE LEVEL PLUGIN STYLES -->
        <link href="<?php echo e(ASSET_URL); ?>plugins/jquery-file-upload/blueimp-gallery/blueimp-gallery.min.css<?php echo e(CSS_VERSION); ?>" rel="stylesheet"/>
        <link href="<?php echo e(ASSET_URL); ?>plugins/jquery-file-upload/css/jquery.fileupload.css<?php echo e(CSS_VERSION); ?>" rel="stylesheet"/>
        <link href="<?php echo e(ASSET_URL); ?>plugins/jquery-file-upload/css/jquery.fileupload-ui.css<?php echo e(CSS_VERSION); ?>" rel="stylesheet"/>
        <link href="<?php echo e(ASSET_URL); ?>plugins/bootstrap-fileinput/bootstrap-fileinput.css<?php echo e(CSS_VERSION); ?>" rel="stylesheet" type="text/css"/>
        <link href="<?php echo e(ASSET_URL); ?>plugins/bootstrap-daterangepicker/daterangepicker-bs3.css<?php echo e(CSS_VERSION); ?>" rel="stylesheet" type="text/css"/>

        <link href="<?php echo e(ASSET_URL); ?>plugins/bootstrap-datepicker/css/datepicker3.css<?php echo e(CSS_VERSION); ?>" rel="stylesheet" type="text/css"/>
        <link href="<?php echo e(ASSET_URL); ?>plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.css<?php echo e(CSS_VERSION); ?>" rel="stylesheet" type="text/css"/>
        <link href="<?php echo e(ASSET_URL); ?>plugins/fullcalendar/fullcalendar.min.css<?php echo e(CSS_VERSION); ?>" rel="stylesheet" type="text/css"/>
        <link rel="stylesheet" type="text/css" href="<?php echo e(ASSET_URL); ?>plugins/bootstrap-select/bootstrap-select.min.css<?php echo e(CSS_VERSION); ?>"/>
        <link rel="stylesheet" type="text/css" href="<?php echo e(ASSET_URL); ?>plugins/select2/select2.css<?php echo e(CSS_VERSION); ?>"/> 
        <link rel="stylesheet" type="text/css" href="<?php echo e(ASSET_URL); ?>plugins/jquery-multi-select/css/multi-select.css<?php echo e(CSS_VERSION); ?>"/>


        <!-- END PAGE LEVEL PLUGIN STYLES -->

        <!-- BEGIN PAGE STYLES -->

        <!-- END PAGE STYLES -->
        <!-- BEGIN THEME STYLES -->
        <link href="<?php echo e(ASSET_URL); ?>css/components.css<?php echo e(CSS_VERSION); ?>" id="style_components" rel="stylesheet" type="text/css"/>
        <link href="<?php echo e(ASSET_URL); ?>css/plugins.css<?php echo e(CSS_VERSION); ?>" rel="stylesheet" type="text/css"/>
        <link href="<?php echo e(ASSET_URL); ?>css/layout.css<?php echo e(CSS_VERSION); ?>" rel="stylesheet" type="text/css"/>
        <link href="<?php echo e(ASSET_URL); ?>css/themes/default.css<?php echo e(CSS_VERSION); ?>" rel="stylesheet" type="text/css" id="style_color"/>
        <link href="<?php echo e(ASSET_URL); ?>css/profile.css<?php echo e(CSS_VERSION); ?>" rel="stylesheet" type="text/css"/>
        <link href="<?php echo e(ASSET_URL); ?>css/custom.css<?php echo e(CSS_VERSION); ?>" rel="stylesheet" type="text/css"/>
        <link href="<?php echo e(ASSET_URL); ?>css/image-crop.css<?php echo e(CSS_VERSION); ?>" rel="stylesheet" type="text/css"/>
        <link href="<?php echo e(ASSET_URL); ?>plugins/jcrop/css/jquery.Jcrop.min.css<?php echo e(CSS_VERSION); ?>" rel="stylesheet" type="text/css"/>
        <link rel="stylesheet" type="text/css" href="<?php echo e(ASSET_URL); ?>plugins/fancybox/source/jquery.fancybox.css?v=2.1.2" media="screen" />
        <link href="<?php echo e(ASSET_URL); ?>plugins/fullcalendar/fullcalendar.min.css<?php echo e(CSS_VERSION); ?>" rel="stylesheet"/>

        <!-- END THEME STYLES -->
        <link rel="shortcut icon" href="<?php echo e(ASSET_URL); ?>favicon.ico"/>
        <script src="<?php echo e(ASSET_URL); ?>plugins/jquery.min.js<?php echo e(JS_VERSION); ?>" type="text/javascript"></script>
        <script src="<?php echo e(ASSET_URL); ?>plugins/jquery-migrate.min.js<?php echo e(JS_VERSION); ?>" type="text/javascript"></script>
        <script src="<?php echo e(ASSET_URL); ?>plugins/jquery-ui/jquery-ui-1.10.3.custom.min.js<?php echo e(JS_VERSION); ?>" type="text/javascript"></script>
        <script src="<?php echo e(ASSET_URL); ?>plugins/bootstrap/js/bootstrap.min.js<?php echo e(JS_VERSION); ?>" type="text/javascript"></script>
        <script src="<?php echo e(ASSET_URL); ?>plugins/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js<?php echo e(JS_VERSION); ?>" type="text/javascript"></script>
        <script src="<?php echo e(ASSET_URL); ?>plugins/jquery-slimscroll/jquery.slimscroll.min.js<?php echo e(JS_VERSION); ?>" type="text/javascript"></script>
        <script src="<?php echo e(ASSET_URL); ?>plugins/jquery.blockui.min.js<?php echo e(JS_VERSION); ?>" type="text/javascript"></script>
        <script src="<?php echo e(ASSET_URL); ?>plugins/jquery.cokie.min.js<?php echo e(JS_VERSION); ?>" type="text/javascript"></script>
        <script src="<?php echo e(ASSET_URL); ?>plugins/uniform/jquery.uniform.min.js<?php echo e(JS_VERSION); ?>" type="text/javascript"></script>
        <script src="<?php echo e(ASSET_URL); ?>plugins/bootstrap-switch/js/bootstrap-switch.js<?php echo e(JS_VERSION); ?>" type="text/javascript"></script>
        <script type="text/javascript" src="<?php echo e(ASSET_URL); ?>plugins/bootstrap-touchspin/bootstrap.touchspin.js<?php echo e(JS_VERSION); ?>"></script>

        <!-- END CORE PLUGINS -->
        <script type="text/javascript" src="<?php echo e(ASSET_URL); ?>plugins/jquery-validation/js/jquery.validate.min.js<?php echo e(JS_VERSION); ?>"></script>
        <script type="text/javascript" src="<?php echo e(ASSET_URL); ?>plugins/jquery-validation/js/additional-methods.js<?php echo e(JS_VERSION); ?>"></script>
        <!-- BEGIN PAGE LEVEL PLUGINS -->
        <script src="<?php echo e(ASSET_URL); ?>plugins/datatables/media/js/jquery.dataTables.min.js<?php echo e(JS_VERSION); ?>" type="text/javascript"></script>
        <script src="<?php echo e(ASSET_URL); ?>plugins/datatables/extensions/TableTools/js/dataTables.tableTools.min.js<?php echo e(JS_VERSION); ?>" type="text/javascript"></script>
        <script src="<?php echo e(ASSET_URL); ?>plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js<?php echo e(JS_VERSION); ?>" type="text/javascript"></script>
        <script src="<?php echo e(ASSET_URL); ?>js/datatable.js<?php echo e(JS_VERSION); ?>" type="text/javascript"></script>
        <script src="<?php echo e(ASSET_URL); ?>js/table-ajax.js<?php echo e(JS_VERSION); ?>" type="text/javascript"></script>
        <script src="<?php echo e(ASSET_URL); ?>plugins/bootbox/bootbox.min.js<?php echo e(JS_VERSION); ?>" type="text/javascript"></script>
        <script src="<?php echo e(ASSET_URL); ?>plugins/typeahead/handlebars.min.js<?php echo e(JS_VERSION); ?>" type="text/javascript"></script>
        <script src="<?php echo e(ASSET_URL); ?>plugins/typeahead/typeahead.bundle.min.js<?php echo e(JS_VERSION); ?>" type="text/javascript"></script>

        <script src="<?php echo e(ASSET_URL); ?>plugins/jquery-file-upload/js/jquery.fileupload.js"></script>
        <script type="text/javascript" src="<?php echo e(ASSET_URL); ?>scripts/bootstrap-fileinput.js<?php echo e(JS_VERSION); ?>"></script>
        <script type="text/javascript" src="<?php echo e(ASSET_URL); ?>plugins/bootstrap-select/bootstrap-select.min.js<?php echo e(JS_VERSION); ?>"></script>
        <script type="text/javascript" src="<?php echo e(ASSET_URL); ?>plugins/select2/select2.min.js"></script>
        <script src="<?php echo e(ASSET_URL); ?>plugins/jquery-multi-select/js/jquery.multi-select.js" type="text/javascript"></script>
        <script type="text/javascript" src="<?php echo e(ASSET_URL); ?>plugins/bootstrap-datepicker/js/bootstrap-datepicker.js<?php echo e(JS_VERSION); ?>"></script>
        <script type="text/javascript" src="<?php echo e(ASSET_URL); ?>plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.js<?php echo e(JS_VERSION); ?>"></script>
        <script type="text/javascript" src="<?php echo e(ASSET_URL); ?>plugins/select2/select2.min.js<?php echo e(JS_VERSION); ?>"></script>
        <script type="text/javascript" src="<?php echo e(ASSET_URL); ?>scripts/metronic.js<?php echo e(JS_VERSION); ?>"></script>
        <script type="text/javascript" src="<?php echo e(ASSET_URL); ?>scripts/layout.js<?php echo e(JS_VERSION); ?>"></script>

        <script type="text/javascript" src="<?php echo e(ASSET_URL); ?>plugins/jcrop/js/jquery.Jcrop.min.js<?php echo e(JS_VERSION); ?>"></script>
        <script src="<?php echo e(ASSET_URL); ?>plugins/bootstrap-switch/js/bootstrap-switch.min.js<?php echo e(JS_VERSION); ?>" type="text/javascript"></script>
        <script src="<?php echo e(ASSET_URL); ?>scripts/quick-sidebar.js<?php echo e(JS_VERSION); ?>" type="text/javascript"></script>
        <script src="<?php echo e(ASSET_URL); ?>scripts/demo.js<?php echo e(JS_VERSION); ?>" type="text/javascript"></script>
        <script src="<?php echo e(ASSET_URL); ?>scripts/components-form-tools.js<?php echo e(JS_VERSION); ?>"></script>
        <script src="<?php echo e(ASSET_URL); ?>scripts/form-image-crop.js<?php echo e(JS_VERSION); ?>" type="text/javascript"></script>
        <script type="text/javascript" src="<?php echo e(ASSET_URL); ?>/plugins/fancybox/source/jquery.fancybox.js?v=2.1.2"></script>
        <script src="<?php echo e(ASSET_URL); ?>plugins/fancybox/source/helpers/jquery.fancybox-media.js?v=2.1.2" type="text/javascript" ></script>

        <script type="text/javascript" src="<?php echo e(ASSET_URL); ?>plugins/ckeditor/ckeditor.js<?php echo e(JS_VERSION); ?>"></script>
        <script type="text/javascript" src="<?php echo e(ASSET_URL); ?>plugins/ckeditor/adapters/jquery.js<?php echo e(JS_VERSION); ?>"></script>
        <script src="<?php echo e(ASSET_URL); ?>js/custom_script.js<?php echo e(JS_VERSION); ?>" type="text/javascript"></script>
        <script src="<?php echo e(ASSET_URL); ?>js/custom_validation.js<?php echo e(JS_VERSION); ?>" type="text/javascript"></script>
        <script src="<?php echo e(ASSET_URL); ?>js/image_upload.js<?php echo e(JS_VERSION); ?>" type="text/javascript"></script>
        <script src="<?php echo e(ASSET_URL); ?>js/table-editable.js<?php echo e(JS_VERSION); ?>" type="text/javascript"></script>
        <!-- <script src="<?php echo e(ASSET_URL); ?>js/upload_script.js" type="text/javascript"></script> -->
        <script src="<?php echo e(ASSET_URL); ?>plugins/jcrop/js/jquery.color.js<?php echo e(JS_VERSION); ?>" type="text/javascript"></script>
        <script src="<?php echo e(ASSET_URL); ?>plugins/jcrop/js/jquery.Jcrop.min.js<?php echo e(JS_VERSION); ?>" type="text/javascript"></script>
        <script src="<?php echo e(ASSET_URL); ?>plugins/moment.min.js"></script>
        <script src="<?php echo e(ASSET_URL); ?>plugins/fullcalendar/fullcalendar.min.js"></script>
        <script src="<?php echo e(ASSET_URL); ?>js/calendar.js" type="text/javascript"></script>

        <!-- END PAGE LEVEL PLUGINS -->
        <!-- BEGIN PAGE LEVEL SCRIPTS -->
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
    <body class="page-header-fixed page-quick-sidebar-over-content page-style-square">
        <!-- BEGIN PAGE SPINNER -->
        <div id="loading">
            <div class="loading-center">
                <div class="outer"></div>
                <div class="inner"></div>
            </div>
        </div>   
        <!-- END PAGE SPINNER -->

        <!-- BEGIN HEADER -->
        <?php echo $__env->make('admin.elements.header', array_except(get_defined_vars(), array('__data', '__path')))->render(); ?>
        <!-- END HEADER -->
        <!-- BEGIN CONTAINER -->
        <div class="page-container">
            <!-- BEGIN SIDEBAR -->
            <?php echo $__env->make('admin.elements.sidebar', array_except(get_defined_vars(), array('__data', '__path')))->render(); ?>
            <!-- END SIDEBAR -->

            <!-- BEGIN CONTENT -->
            <?php echo $__env->yieldContent('content'); ?>
            <!-- END CONTENT -->
            <!-- BEGIN QUICK SIDEBAR -->
            <a href="javascript:;" class="page-quick-sidebar-toggler"><i class="icon-close"></i></a>        
            <!-- END QUICK SIDEBAR -->
        </div>
        <!-- BEGIN FOOTER -->
        <?php echo $__env->make('admin.elements.footer', array_except(get_defined_vars(), array('__data', '__path')))->render(); ?>
        <!-- END FOOTER -->
        <?php echo $__env->yieldContent('cropboxsection'); ?>
        <!-- IMPORTANT! Load jquery-ui-1.10.3.custom.min.js before bootstrap.min.js to fix bootstrap tooltip conflict with jquery ui tooltip -->

        <!-- END PAGE LEVEL SCRIPTS -->
        <script type="text/javascript">
            var ADMIN_URL = "<?php echo ADMIN_URL; ?>";
            var ADMIN_PATH = "<?php echo ADMIN_PATH; ?>";
            var SITE_URL = "<?php echo SITE_URL; ?>";
            var DEFAULT_IMG_SERVER = "<?php echo DEFAULT_IMG_SERVER; ?>";
            var WWW_ROOT = "<?php echo WWW_ROOT; ?>";
            var ASSET_URL = "<?php echo ASSET_URL; ?>";
            var TEMP_IMG_PATH = '<?php echo e(TEMP_IMG_PATH); ?>'
            var USER_PROFILE_IMAGE_PATH = "<?php echo e(USER_PROFILE_IMAGE_PATH); ?>";
            var USER_PROFILE_THUMB_IMAGE_PATH = "<?php echo e(USER_PROFILE_THUMB_IMAGE_PATH); ?>";
            $(document).ready(function () {
                Metronic.init();
                Layout.init(); // init current layout
                QuickSidebar.init(); // init quick sidebar
                Demo.init(); // init demo features
                setTimeout(function () {
                    $('.make-switch').bootstrapSwitch.defaults.size = 'large';
                    $('.make-switch').bootstrapSwitch();
                    $("input[type='checkbox']").uniform();
                }, 1000);
            });
            $(window).load(function () {
                $('#loading').addClass('hide');
            });
        </script>
        <!-- END JAVASCRIPTS -->
    </body>
    <!-- END BODY -->
</html>
