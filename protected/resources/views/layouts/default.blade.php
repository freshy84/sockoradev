<!DOCTYPE html>
<!--[if IE 8]> <html lang="en" class="ie8 no-js"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9 no-js"> <![endif]-->
<!--[if !IE]><!-->
<html lang="en">
    <!--<![endif]-->
    <!-- BEGIN HEAD -->
    <head>
        <meta charset="utf-8"/>
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>{{ $title }} | {{ SITE_NAME }}</title>
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta content="width=device-width, initial-scale=1" name="viewport"/>
        <meta content="" name="description"/>
        <meta content="" name="author"/>
        <!-- BEGIN GLOBAL MANDATORY STYLES -->
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700&subset=all" rel="stylesheet" type="text/css"/>
        <link href="{{ ASSET_URL }}plugins/font-awesome/css/font-awesome.min.css{{CSS_VERSION}}" rel="stylesheet" type="text/css"/>
        <link href="{{ ASSET_URL }}plugins/simple-line-icons/simple-line-icons.min.css{{CSS_VERSION}}" rel="stylesheet" type="text/css"/>
        <link href="{{ ASSET_URL }}plugins/bootstrap/css/bootstrap.min.css{{CSS_VERSION}}" rel="stylesheet" type="text/css"/>
        <link href="{{ ASSET_URL }}plugins/uniform/css/uniform.default.min.css{{CSS_VERSION}}" rel="stylesheet" type="text/css"/>
        <link href="{{ ASSET_URL }}plugins/bootstrap-switch/css/bootstrap-switch.css{{CSS_VERSION}}" rel="stylesheet" type="text/css"/>
        <link href="{{ ASSET_URL }}plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css{{CSS_VERSION}}" rel="stylesheet" type="text/css"/>
        <!-- END GLOBAL MANDATORY STYLES -->
        <!-- BEGIN PAGE LEVEL PLUGIN STYLES -->
        <link href="{{ ASSET_URL }}plugins/jquery-file-upload/blueimp-gallery/blueimp-gallery.min.css{{CSS_VERSION}}" rel="stylesheet"/>
        <link href="{{ ASSET_URL }}plugins/jquery-file-upload/css/jquery.fileupload.css{{CSS_VERSION}}" rel="stylesheet"/>
        <link href="{{ ASSET_URL }}plugins/jquery-file-upload/css/jquery.fileupload-ui.css{{CSS_VERSION}}" rel="stylesheet"/>
        <link href="{{ ASSET_URL }}plugins/bootstrap-datepicker/css/datepicker3.css{{CSS_VERSION}}" rel="stylesheet" type="text/css"/>
        <link href="{{ ASSET_URL }}plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.css{{CSS_VERSION}}" rel="stylesheet" type="text/css"/>
        

        <!-- END PAGE LEVEL PLUGIN STYLES -->

        <!-- BEGIN PAGE STYLES -->

        <!-- END PAGE STYLES -->
        <!-- BEGIN THEME STYLES -->
        <link href="{{ ASSET_URL }}css/components.css{{CSS_VERSION}}" id="style_components" rel="stylesheet" type="text/css"/>
        <link href="{{ ASSET_URL }}css/plugins.css{{CSS_VERSION}}" rel="stylesheet" type="text/css"/>
        <link href="{{ ASSET_URL }}css/layout.css{{CSS_VERSION}}" rel="stylesheet" type="text/css"/>
        <link href="{{ ASSET_URL }}css/themes/light2.css{{CSS_VERSION}}" rel="stylesheet" type="text/css" id="style_color"/>
        <link href="{{ASSET_URL}}css/profile.css{{CSS_VERSION}}" rel="stylesheet" type="text/css"/>
        <link href="{{ ASSET_URL }}css/custom.css{{CSS_VERSION}}" rel="stylesheet" type="text/css"/>
        <link href="{{ ASSET_URL }}css/image-crop.css{{CSS_VERSION}}" rel="stylesheet" type="text/css"/>
        <link href="{{ ASSET_URL }}plugins/jcrop/css/jquery.Jcrop.min.css{{CSS_VERSION}}" rel="stylesheet" type="text/css"/>
        <link rel="stylesheet" type="text/css" href="{{ ASSET_URL }}plugins/fancybox/dist/jquery.fancybox.min.css{{CSS_VERSION}}" media="screen" />
        
        <!-- END THEME STYLES -->
        <link rel="shortcut icon" href="{{ SITE_URL }}favicon.png"/>
        <script src="{{ ASSET_URL }}plugins/jquery.min.js{{JS_VERSION}}" type="text/javascript"></script>
        <script src="{{ ASSET_URL }}plugins/jquery-migrate.min.js{{JS_VERSION}}" type="text/javascript"></script>
        <script src="{{ ASSET_URL }}plugins/jquery-ui/jquery-ui-1.10.3.custom.min.js{{JS_VERSION}}" type="text/javascript"></script>
        <script src="{{ ASSET_URL }}plugins/bootstrap/js/bootstrap.min.js{{JS_VERSION}}" type="text/javascript"></script>
        <script src="{{ ASSET_URL }}plugins/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js{{JS_VERSION}}" type="text/javascript"></script>
        <script src="{{ ASSET_URL }}plugins/jquery-slimscroll/jquery.slimscroll.min.js{{JS_VERSION}}" type="text/javascript"></script>
        <script src="{{ ASSET_URL }}plugins/jquery.blockui.min.js{{JS_VERSION}}" type="text/javascript"></script>
        <script src="{{ ASSET_URL }}plugins/jquery.cokie.min.js{{JS_VERSION}}" type="text/javascript"></script>
        <script src="{{ ASSET_URL }}plugins/uniform/jquery.uniform.min.js{{JS_VERSION}}" type="text/javascript"></script>
        
        <!-- END CORE PLUGINS -->
        <script type="text/javascript" src="{{ ASSET_URL }}plugins/jquery-validation/js/jquery.validate.min.js{{JS_VERSION}}"></script>
        <script type="text/javascript" src="{{ ASSET_URL }}plugins/jquery-validation/js/additional-methods.js{{JS_VERSION}}"></script>
        <!-- BEGIN PAGE LEVEL PLUGINS -->
        <script src="{{ ASSET_URL }}plugins/datatables/media/js/jquery.dataTables.min.js{{JS_VERSION}}" type="text/javascript"></script>
        <script src="{{ ASSET_URL }}plugins/datatables/extensions/TableTools/js/dataTables.tableTools.min.js{{JS_VERSION}}" type="text/javascript"></script>
        <script src="{{ ASSET_URL }}plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js{{JS_VERSION}}" type="text/javascript"></script>
        <script src="{{ ASSET_URL }}js/datatable.js{{JS_VERSION}}" type="text/javascript"></script>
        <script src="{{ ASSET_URL }}js/table-ajax.js{{JS_VERSION}}" type="text/javascript"></script>
        <script src="{{ ASSET_URL }}plugins/bootbox/bootbox.min.js{{JS_VERSION}}" type="text/javascript"></script>
        <script src="{{ ASSET_URL }}plugins/typeahead/handlebars.min.js{{JS_VERSION}}" type="text/javascript"></script>
        <script src="{{ ASSET_URL }}plugins/typeahead/typeahead.bundle.min.js{{JS_VERSION}}" type="text/javascript"></script>

        <script src="{{ ASSET_URL }}plugins/jquery-file-upload/js/jquery.fileupload.js"></script>
        <script type="text/javascript" src="{{ ASSET_URL }}scripts/bootstrap-fileinput.js{{JS_VERSION}}"></script>
        <script type="text/javascript" src="{{ ASSET_URL }}plugins/bootstrap-datepicker/js/bootstrap-datepicker.js{{JS_VERSION}}"></script>
        <script type="text/javascript" src="{{ ASSET_URL }}plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.js{{JS_VERSION}}"></script>
        <script type="text/javascript" src="{{ ASSET_URL }}scripts/metronic.js{{JS_VERSION}}"></script>
        <script type="text/javascript" src="{{ ASSET_URL }}scripts/layout.js{{JS_VERSION}}"></script>

        <script type="text/javascript" src="{{ ASSET_URL }}plugins/jcrop/js/jquery.Jcrop.min.js{{JS_VERSION}}"></script>
        <script src="{{ ASSET_URL }}plugins/bootstrap-switch/js/bootstrap-switch.min.js{{JS_VERSION}}" type="text/javascript"></script>
        <script src="{{ ASSET_URL }}scripts/quick-sidebar.js{{JS_VERSION}}" type="text/javascript"></script>
        <script src="{{ ASSET_URL }}scripts/demo.js{{JS_VERSION}}" type="text/javascript"></script>
        <script src="{{ ASSET_URL }}scripts/components-form-tools.js{{JS_VERSION}}"></script>
        <script src="{{ ASSET_URL }}scripts/form-image-crop.js{{JS_VERSION}}" type="text/javascript"></script>
        
        <script src="{{ ASSET_URL }}plugins/fancybox/dist/jquery.fancybox.min.js{{JS_VERSION}}" type="text/javascript" ></script>

        <script src="{{ASSET_URL}}js/custom_script.js{{JS_VERSION}}" type="text/javascript"></script>
        <script src="{{ASSET_URL}}js/custom_validation.js{{ JS_VERSION }}" type="text/javascript"></script>
        <script src="{{ASSET_URL}}js/image_upload.js{{ JS_VERSION }}" type="text/javascript"></script>
        <script src="{{ASSET_URL}}js/table-editable.js{{ JS_VERSION }}" type="text/javascript"></script>
        <!-- <script src="{{ASSET_URL}}js/upload_script.js" type="text/javascript"></script> -->
        <script src="{{ ASSET_URL }}plugins/jcrop/js/jquery.color.js{{ JS_VERSION }}" type="text/javascript"></script>
        <script src="{{ ASSET_URL }}plugins/jcrop/js/jquery.Jcrop.min.js{{ JS_VERSION }}" type="text/javascript"></script>
        <script src="{{ ASSET_URL }}plugins/moment.min.js"></script>
        <script src="{{ ASSET_URL }}js/calendar.js" type="text/javascript"></script>

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
        @include('elements.header')
        <!-- END HEADER -->
        <!-- BEGIN CONTAINER -->
        <div class="page-container">
            <!-- BEGIN SIDEBAR -->
            @include('elements.sidebar')
            <!-- END SIDEBAR -->

            <!-- BEGIN CONTENT -->
            @yield('content')
            <!-- END CONTENT -->
            <!-- BEGIN QUICK SIDEBAR -->
            <a href="javascript:;" class="page-quick-sidebar-toggler"><i class="icon-close"></i></a>        
            <!-- END QUICK SIDEBAR -->
        </div>
        <!-- BEGIN FOOTER -->
        @include('elements.footer')
        <!-- END FOOTER -->
        @yield('cropboxsection')
        <!-- IMPORTANT! Load jquery-ui-1.10.3.custom.min.js before bootstrap.min.js to fix bootstrap tooltip conflict with jquery ui tooltip -->

        <!-- END PAGE LEVEL SCRIPTS -->
        <script type="text/javascript">
            var SITE_URL = "<?php echo SITE_URL; ?>";
            var WWW_ROOT = "<?php echo WWW_ROOT; ?>";
            var ASSET_URL = "<?php echo ASSET_URL; ?>";
            var TEMP_IMG_PATH = '{{TEMP_IMG_PATH}}'
            var USER_PROFILE_IMAGE_PATH = "{{ USER_PROFILE_IMAGE_PATH }}";
            var USER_PROFILE_THUMB_IMAGE_PATH = "{{ USER_PROFILE_THUMB_IMAGE_PATH }}";
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
