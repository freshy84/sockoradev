var timeoutID;
var email_flag = true; // for email unique validation

function general_char_count_textarea(id_textarea, maxLen, span_id) {
    var Length = $("#" + id_textarea).val().length;
    var AmountLeft = maxLen - Length;
    if (AmountLeft >= 0) {
        $('#' + span_id).html("Remaining characters:" + AmountLeft);
    }
    if (Length >= maxLen) {
        if (event.which != 8) {
            return false;
        }
    }
}

$('.date_picker_new').datepicker({
    format: 'dd-mm-yyyy',
    autoclose: true
});

function convertImgToBase64URL(url, callback, outputFormat) {
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
        var canvas = document.createElement('CANVAS'),
            ctx = canvas.getContext('2d'),
            dataURL;
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback(dataURL);
        canvas = null;
    };
    img.src = url;
}

function DeleteRecordImage() {
    var url = $(this).attr('delete-url');
    var arrId = $(this).attr('rel');
    var el = $(this);
    if (arrId != '') {
        bootbox.confirm('Are you sure you want to delete this record?', function(confirmed) {
            if (confirmed) {
                $.get(url, function(data) {
                    if ($.trim(data) == "TRUE") {
                        $('.alert-success').show();
                        $('.alert-success .message').html('Record deleted successfully.');
                        el.closest('tr').fadeOut(1500, function() {
                            $(this).closest('tr').remove();
                            $('#datatable_ajax').DataTable().ajax.reload();
                            /*if($("#datatable_ajax tbody > tr").length <= 1) {
                             $(".filter-submit").trigger( "click" );
                             $('#datatable_ajax').DataTable().ajax.reload();
                             }*/
                        });
                        setTimeout(function() {
                            $('.alert-success').fadeOut(4000);
                        }, 3000);
                    } else {
                        var data = JSON.parse(data);
                        if (data.status == 'DELETE_ERROR') {
                            bootbox.alert($.trim(data.error_message));
                        }
                    }
                });
            }
        });
    }
}

function read_image2(input) {
    if (input.files && input.files[0]) {
        var file = input.files[0];

        var reader = new FileReader();
        $('.file_upload2').html('Please wait...');
        $('button[type="submit"]').prop('disabled', true);
        reader.onload = function(e) {
            img_src = e.target.result;
            var img = new Image();
            img.src = img_src;
            var width = img.width;
            var height = img.height;

            //alert(file.type);
            if ((file.type == 'image/jpeg' || file.type == 'image/jpg' || file.type == 'image/png' || file.type == 'image/png' || file.type == 'image/gif')) {
                var img = new Image();
                img.onload = function() {
                    //console.log(calculateAspectRatioFit(img.width,img.height,'512','512'));
                    //console.log(img.width+"--------"+img.height+"--------"+img.width > 199+"--------"+img.height > 199+"--------"+img.width < 513+"--------"+img.height < 513);
                    if (img.width == img.height && img.width > 199 && img.height > 199 && img.width < 513 && img.height < 513) {
                        $("#show_image2").attr("src", e.target.result);
                        $("#show_image2").show();
                        $("#imgbase642").attr("value", e.target.result);
                    } else {
                        bootbox.alert("Image must be in square with Minimum 200 X 200 and Maximum 512 X 512 .", function(answer) {
                            $('.image_upload2').val('');
                            $('#imgbase642').val('');
                            $(".show_image2").attr('src', SITE_URL + "img/no_image.png");
                        });
                        $('button[type="submit"]').prop('disabled', false);
                        $('.file_upload_cover').html('Select Image');
                        return false;
                    }
                    /*if(img.width < 513 && img.height < 513){
                     bootbox.alert("Image width & height must be less than 512 X 512.", function(answer) {
                     $('.image_upload2').val('');
                     $('#imgbase642').val('');
                     $(".show_image2").attr('src',SITE_URL+"img/no_image.png");
                     //http://siteproofs.net/projects/saad_almallak/appex/img/no_image.png
                     //alert(SITE_URL);
                     
                     });
                     $('button[type="submit"]').prop('disabled',false);
                     $('.file_upload_cover').html('Select Image');
                     return false;
                     }    
                     $("#show_image2").attr("src", e.target.result);
                     $("#show_image2").show();
                     $("#imgbase642").attr("value", e.target.result);*/
                };
                img.src = e.target.result;
            } else {
                bootbox.alert("Please upload image only.", function(answer) {
                    $('.image_upload2').val('');
                });
            }
            $('button[type="submit"]').prop('disabled', false);
            $('.file_upload2').html('Select Image');
        };

        reader.readAsDataURL(input.files[0]);
    }
}

function get_crop_parameters() {
    if ($('.cropWrapper img').prop('src') != undefined && $('.cropWrapper img').prop('src') != '') {
        var image = $('.cropWrapper img');
        var width = $('.dropzone').outerWidth();
        var height = $('.dropzone').outerHeight();
        var factor = (width != $('.dropzone').outerWidth()) ? width / $('.dropzone').outerWidth() : 1;
        var finalWidth, finalHeight, finalTop, finalLeft, imageWidth, imageHeight, imageOriginalWidth, imageOriginalHeight;

        finalWidth = width;
        finalHeight = height;
        finalTop = parseInt(Math.round(parseInt(image.css('top')) * factor)) * -1;
        finalLeft = parseInt(Math.round(parseInt($(image).css('left')) * factor)) * -1;
        imageWidth = parseInt(Math.round(image.width() * factor));
        imageHeight = parseInt(Math.round($(image).height() * factor));
        imageOriginalWidth = image.data('width');
        imageOriginalHeight = image.data('height');

        finalTop = finalTop || 0;
        finalLeft = finalLeft || 0;

        var obj = {
            imageOriginalWidth: imageOriginalWidth,
            imageOriginalHeight: imageOriginalHeight,
            imageWidth: imageWidth,
            imageHeight: imageHeight,
            width: finalWidth,
            height: finalHeight,
            left: finalLeft,
            top: finalTop
        }
        //console.log(obj);
        return obj;
    }
}

function get_edit_crop_parameters() {
    if ($('.edit_image .cropWrapper img').prop('src') != undefined && $('.edit_image .cropWrapper img').prop('src') != '') {
        var image = $('.edit_image .cropWrapper img');
        var width = $('.edit_image .dropzone').outerWidth();
        var height = $('.edit_image .dropzone').outerHeight();
        var factor = (width != $('.edit_image .dropzone').outerWidth()) ? width / $('.edit_image .dropzone').outerWidth() : 1;
        var finalWidth, finalHeight, finalTop, finalLeft, imageWidth, imageHeight, imageOriginalWidth, imageOriginalHeight;

        finalWidth = width;
        finalHeight = height;
        finalTop = parseInt(Math.round(parseInt(image.css('top')) * factor)) * -1;
        finalLeft = parseInt(Math.round(parseInt($(image).css('left')) * factor)) * -1;
        imageWidth = parseInt(Math.round(image.width() * factor));
        imageHeight = parseInt(Math.round($(image).height() * factor));
        imageOriginalWidth = image.data('width');
        imageOriginalHeight = image.data('height');

        finalTop = finalTop || 0;
        finalLeft = finalLeft || 0;

        var obj = {
            imageOriginalWidth: imageOriginalWidth,
            imageOriginalHeight: imageOriginalHeight,
            imageWidth: imageWidth,
            imageHeight: imageHeight,
            width: finalWidth,
            height: finalHeight,
            left: finalLeft,
            top: finalTop
        }
        //console.log(obj);
        return obj;
    }
}

function get_new_crop_parameters() {
    if ($('.new_file .cropWrapper img').prop('src') != undefined && $('.new_file .cropWrapper img').prop('src') != '') {
        var image = $('.new_file .cropWrapper img');
        var width = $('.new_file .dropzone').outerWidth();
        var height = $('.new_file .dropzone').outerHeight();
        var factor = (width != $('.new_file .dropzone').outerWidth()) ? width / $('.new_file .dropzone').outerWidth() : 1;
        var finalWidth, finalHeight, finalTop, finalLeft, imageWidth, imageHeight, imageOriginalWidth, imageOriginalHeight;

        finalWidth = width;
        finalHeight = height;
        finalTop = parseInt(Math.round(parseInt(image.css('top')) * factor)) * -1;
        finalLeft = parseInt(Math.round(parseInt($(image).css('left')) * factor)) * -1;
        imageWidth = parseInt(Math.round(image.width() * factor));
        imageHeight = parseInt(Math.round($(image).height() * factor));
        imageOriginalWidth = image.data('width');
        imageOriginalHeight = image.data('height');

        finalTop = finalTop || 0;
        finalLeft = finalLeft || 0;

        var obj = {
            imageOriginalWidth: imageOriginalWidth,
            imageOriginalHeight: imageOriginalHeight,
            imageWidth: imageWidth,
            imageHeight: imageHeight,
            width: finalWidth,
            height: finalHeight,
            left: finalLeft,
            top: finalTop
        }
        //console.log(obj);
        return obj;
    }
}

$(document).ready(function() {
    if ($("#t_full_description").length > 0) {
        CKEDITOR.replace('t_full_description', {
            removeButtons: 'Save'
        });
    }
    if ($("#t_terms_conditions").length > 0) {
        CKEDITOR.replace('t_terms_conditions', {
            removeButtons: 'Save'
        });
    }
    if ($("#t_check_in_information").length > 0) {
        CKEDITOR.replace('t_check_in_information', {
            removeButtons: 'Save'
        });
    }
    if ($(".listing_type").length > 0) {
        $(".listing_type").selectpicker('refresh');
    }
    if ($(".provider_list").length > 0) {
        $(".provider_list").selectpicker('refresh');
    }
    if ($(".country_list").length > 0) {
        $(".country_list").selectpicker('refresh');
    }
    if ($(".province_list").length > 0) {
        $(".province_list").selectpicker('refresh');
    }
    if ($(".area_list").length > 0) {
        $(".area_list").selectpicker('refresh');
    }
    $(document).on('click', '#checkAll', function() {
        var checked = $(this).is(":checked");
        if (checked) {
            $('.user_checkbox').each(function() {
                $(this).attr("checked", checked);
            });
        } else {
            $('.user_checkbox').each(function() {
                $(this).attr("checked", false);
            });
        }
        $.uniform.update($('.user_checkbox'));
    });
    $(document).on('change', '.user_checkbox', function() {
        var len = $(".user_checkbox").length;
        var count = $(".user_checkbox:checked").length;
        if (count == len) {
            $("#checkAll").attr("checked", true);
        } else {
            $("#checkAll").attr("checked", false);
        }

        $.uniform.update($('#checkAll'));
    });
    $(document).ajaxError(function(event, request, settings) {
        if (request.responseText === 'Unauthorized.') {
            window.location = SITE_URL;
        }
    });
    setTimeout(function() {
        $(".alert-success").fadeOut(3000);
    }, 4000);
    if ($(window).height() > 900) {
        $("#main-content").attr('style', "min-height: " + (eval($(window).height()) - 95) + "px");
    }
    if ($("#sidebar").height() > $("#main-content").height()) {
        $("#main-content").attr('style', "min-height: " + ($("#sidebar").height() + 50) + "px");
    }
    $(document).on('click', "input[type=checkbox]", function() {
        if ($(this).is(':checked')) {
            $(this).parent().addClass('checked');
            $(this).attr('checked', 'checked');
        } else {
            $(this).removeAttr('checked');
            $(this).parent().removeClass('checked');
        }
    });
    handleUniform();
    $(document).on('change', '#import-excel-file', function() {
        $('#import-excel').trigger('submit');
    });
    $("#uniform-drop-remove-all").click(function() {
        var flag = false;
        if ($(this).children().children().attr('class') == "checked") {
            flag = true;
        } else {
            flag = false;
        }
        $(".all-checkbox").each(function() {
            var id = this.id;
            if (flag) {
                $("#" + id).children().children().addClass('checked');
            } else {
                $("#" + id).children().children().removeClass('checked');
            }
        });
    });
    $("#btn_showall").click(function() {
        if ($(this).hasClass('faq-list')) {
            window.location = ADMIN_URL + "faqs";
        } else {
            window.location = window.location.href;
        }

    });
    $(document).on("click", "#delete_record", function() {
        var url = $(this).attr('delete-url');
        var arrId = $(this).attr('rel');
        var deleteMsg = $(this).attr('delete-msg');
        if (deleteMsg == undefined) {
            deleteMsg = "";
        }
        var el = $(this);
        if (arrId != '') {
            bootbox.confirm('Are you sure you want to delete this record? ' + deleteMsg, function(confirmed) {
                if (confirmed) {
                    $.get(url, function(data) {
                        //alert(data);
                        if ($.trim(data) == "TRUE") {
                            $('.alert-success .message').html('Record deleted successfully.');
                            $('.alert-success').show();
                            el.closest('tr').fadeOut(1500, function() {
                                $(this).closest('tr').remove();
                                $('#datatable_ajax').DataTable().ajax.reload();
                                /*  if($("#datatable_ajax tbody > tr").length <= 1) {
                                 $(".filter-submit").trigger( "click" );
                                 $('#datatable_ajax').DataTable().ajax.reload();
                                 }*/
                            });
                            setTimeout(function() {
                                $('.alert-success').fadeOut(4000);
                            }, 3000);
                        } else {
                            var data = JSON.parse(data);
                            if (data.status == 'DELETE_ERROR') {
                                bootbox.alert($.trim(data.error_message));
                            }
                        }
                    });
                }
            });
        }
    });
    $(document).on("click", "#cancelled_record", function() {
        var url = $(this).attr('cancelled-url');
        var arrId = $(this).attr('rel');
        var el = $(this);
        if (arrId != '') {
            bootbox.confirm('Are you sure you want to Cancelled this record?', function(confirmed) {
                if (confirmed) {
                    $.get(url, function(data) {
                        if (data.status == 'TRUE') {
                            $('.alert-success').show();
                            $('.alert-success .message').html('Record Cancelled successfully.');

                            el.closest('tr').fadeOut(1500, function() {
                                $(this).closest('tr').remove();
                                $('#datatable_ajax').DataTable().ajax.reload();
                            });

                            setTimeout(function() {
                                $('.alert-success').fadeOut(4000);
                            }, 3000);
                        }
                    });
                }
            });
        }
    });
    $(document).on("click", "#change_status", function() {
        var url = $(this).attr('change-url');
        var id = $(this).attr('data-id');
        var value = $(this).attr('rel');
        var el = $(this);
        if (id != '') {
            if (value == 'Active') {
                var message = 'Inactive';
                var change_val = 'Inactive';
            } else if (value == 'Inactive') {
                var message = 'Active';
                var change_val = 'Active';
            }
            bootbox.confirm("Are you sure that you want to " + message + " this record?", function(confirmed) {
                if (confirmed) {
                    $.post(url, {
                        id: id,
                        status: change_val
                    }, function(result) {
                        if (result == 'TRUE') {
                            $('#datatable_ajax').DataTable().ajax.reload();
                        } else if (result == 'status_count') {
                            bootbox.alert("Maximum 3 records can be set 'active' at a time. Please set status to 'inactive' to any active record in order to 'active' this record.");
                        }
                    });
                }
            });
        }
    });
    /* $(document).on("click", ".remove_listing_image", function() {
     var row_id = $(this).attr('rel');
     //console.log(row_id);
     $.post(SITE_URL+'listings/listing-delete-image',{id:id}, function(result){
     if(result == 'TRUE'){
     $("#image"+row_id).remove(); // remove row
     $("#label_"+row_id).remove(); // remove row
     }
     
     });
     });*/

    $(document).on("click", ".back_table", function() {
        if ($(".edit-record").length > 0) {
            if (!confirm('Updated information will discarded. Are you sure you want to continue?')) {
                return false;
            }
        }
        $('#widget-view-inner-content').fadeOut(500, function() {
            $('#widget-body-inner-content').fadeIn(500);
            $('#widget-view-inner-content').removeClass('edit-record');
            $('#widget-view-inner-content').removeClass('view-record');
            $('#widget-view-inner-content').html("");
        });
        return true;
    });
    $("#frmEdit").submit(function() {
        var form = $("#frmEdit");
        form.find('.duplicate-error').hide();
        form.find(".form-group").removeClass('has-error');
        if ($('#v_cms_content').length > 0) {
            CKEDITOR.instances.v_cms_content.updateElement();
            $('#v_cms_content').val(CKEDITOR.instances['v_cms_content'].getData());
        }
        if ($('#topic_desc').length > 0) {
            CKEDITOR.instances.topic_desc.updateElement();
            $('#topic_desc').val(CKEDITOR.instances['topic_desc'].getData());
        }

        if ($('#section_desc').length > 0) {
            CKEDITOR.instances.section_desc.updateElement();
            $('#section_desc').val(CKEDITOR.instances['section_desc'].getData());
        }

        if ($('#t_full_description').length > 0) {
            CKEDITOR.instances.t_full_description.updateElement();
            $('#t_full_description').val(CKEDITOR.instances['t_full_description'].getData());
        }
        if ($('#t_terms_conditions').length > 0) {
            CKEDITOR.instances.t_terms_conditions.updateElement();
            $('#t_terms_conditions').val(CKEDITOR.instances['t_terms_conditions'].getData());
        }
        if ($('#t_check_in_information').length > 0) {
            CKEDITOR.instances.t_check_in_information.updateElement();
            $('#t_check_in_information').val(CKEDITOR.instances['t_check_in_information'].getData());
        }

        if (form_valid("#frmEdit")) {
            if ($('#image_val1 img').prop('src') != undefined && $('#image_val1 img').prop('src') != '' && $('#image_val1 img').prop('src').indexOf("base64") > 0) {
                $('#v_logo_val1').val($('#image_val1 img').prop('src'));
            }

            var curObj = $(this);
            curObj.find('button[type=submit]').attr('disabled', 'disabled');
            $("#btn_usp_intro").text("Please wait");
            var send_data = $("#frmEdit").serialize();
            $.post($("#frmEdit").attr("action"), send_data, function(data) {
                curObj.find('button[type=submit]').removeAttr('disabled');
                if ($.trim(data) == '') {
                    form.find('.alert-success').show();
                    form.find('.alert-danger').hide();
                    form.find('.duplicate-error').hide();
                    form.find('.duplicate_name_error').hide();
                    setTimeout(function() {
                        form.find('.alert-success').fadeOut(4000);
                    }, 3000);
                    if ($("#redirect_url").length == 1) {
                        window.location.href = $("#redirect_url").val();
                    } else {
                        window.location = strstr($("#frmEdit").attr("action"), '/edit/', true);
                    }
                } else {
                    form.find('.duplicate_name_error').show();
                    $("#btn_usp_intro").text("Save");
                    $("#btn_usp_intro").append("<i class='fa fa-check-square-o'></i>");
                    $(data).each(function(i, val) {

                        $.each(val, function(key, v) {
                            $('#' + key).closest('.form-group').addClass('has-error');
                            $('#error_' + key).show();
                        });
                    });
                    if ($('.has-error .form-control').length > 0) {
                        $('html, body').animate({
                            scrollTop: $('.has-error .form-control').first().offset().top - 200
                        }, 1000);
                        $('.has-error .form-control').first().focus()
                    }
                }
            });
        } else {
            save_and_continue_flag = false;
        }
        return false;
    });
    var save_and_continue_flag = false;
    $("#frmAddNewSubmit").click(function() {
        save_and_continue_flag = true
    });
    $(document).on('click', ".remove", function() {
        del_id = $(this).attr('id1');
        $("#" + del_id).remove();
    });
    $("#frmAdd").submit(function() {
        var form = $("#frmAdd");
        form.find('.duplicate-error').hide();
        form.find(".form-group").removeClass('has-error');

        if (form_valid("#frmAdd")) {
            $('.required_captcha').html("");
            jQuery('#g-recaptcha-response').val('');
            var curObj = $(this);
            curObj.find('button[type=submit]').attr('disabled', 'disabled');
            if ($('#image_val img').prop('src') != undefined && $('#image_val img').prop('src') != '') {
                $('#v_logo_val').val($('#image_val img').prop('src'));
            }
            if ($('#t_full_description').length > 0) {
                CKEDITOR.instances.t_full_description.updateElement();
                $('#t_full_description').val(CKEDITOR.instances['t_full_description'].getData());
            }
            if ($('#t_terms_conditions').length > 0) {
                CKEDITOR.instances.t_terms_conditions.updateElement();
                $('#t_terms_conditions').val(CKEDITOR.instances['t_terms_conditions'].getData());
            }
            var send_data = $("#frmAdd").serialize();
            $.post($("#frmAdd").attr("action"), send_data, function(data) {
                curObj.find('button[type=submit]').removeAttr('disabled');

                if ($.trim(data) == '') {
                    $('#d_error').hide();
                    form.find('.alert-success').fadeOut(5000);
                    form.find('.alert-danger').hide();
                    $("html, body").animate({
                        scrollTop: 0
                    }, 600);
                    if (save_and_continue_flag) {
                        save_and_continue_flag = false;
                        window.location.href = window.location.href;
                    } else {
                        save_and_continue_flag = false;
                        window.location.href = (window.location.href).replace('/add', '');
                    }
                } else {

                    form.find('.alert-success').hide();
                    form.find('.alert-danger').show();
                    $(data).each(function(i, val) {
                        $.each(val, function(key, v) {
                            $('#' + key).closest('.form-group').addClass('has-error');
                            $('#error_' + key).show();
                        });
                    });

                    if ($('.has-error .form-control').length > 0) {
                        $('html, body').animate({
                            scrollTop: $('.has-error .form-control').first().offset().top - 200
                        }, 1000);
                        $('.has-error .form-control').first().focus()
                    }
                }
            });
        } else {
            save_and_continue_flag = false;
        }
        return false;
    });
    $("#frmAdd_new").submit(function() {

        var form = $("#frmAdd_new");
        form.find('.duplicate-error').hide();
        form.find(".form-group").removeClass('has-error');
        if ($('#topic_desc').length > 0) {
            CKEDITOR.instances.topic_desc.updateElement();
            $('#topic_desc').val(CKEDITOR.instances['topic_desc'].getData());
        }
        if ($('#section_desc').length > 0) {
            CKEDITOR.instances.section_desc.updateElement();
            $('#section_desc').val(CKEDITOR.instances['section_desc'].getData());
        }
        if ($('#quiz_desc').length > 0) {
            CKEDITOR.instances.quiz_desc.updateElement();
            $('#quiz_desc').val(CKEDITOR.instances['quiz_desc'].getData());
        }
        if ($('#intro_desc').length > 0) {
            CKEDITOR.instances.intro_desc.updateElement();
            $('#intro_desc').val(CKEDITOR.instances['intro_desc'].getData());
        }

        if (form_valid("#frmAdd_new")) {
            $('.required_captcha').html("");
            jQuery('#g-recaptcha-response').val('');
            var curObj = $(this);
            curObj.find('button[type=submit]').attr('disabled', 'disabled');
            if ($('#image_val img').prop('src') != undefined && $('#image_val img').prop('src') != '') {
                $('#v_logo_val').val($('#image_val img').prop('src'));
            }


            var send_data = $("#frmAdd_new").serialize();

            $.post($("#frmAdd_new").attr("action"), send_data, function(data) {
                curObj.find('button[type=submit]').removeAttr('disabled');

                if ($.trim(data) == '') {
                    $('#d_error').hide();
                    $('#status_error_new').hide();
                    form.find('.alert-success').fadeOut(5000);
                    form.find('.alert-danger').hide();
                    $("html, body").animate({
                        scrollTop: 0
                    }, 600);
                    if (save_and_continue_flag) {
                        save_and_continue_flag = false;
                        window.location.href = window.location.href;
                    } else {
                        save_and_continue_flag = false;
                        window.location.href = (window.location.href).replace('/add', '');
                    }
                } else {

                    form.find('.alert-success').hide();
                    form.find('.alert-danger').show();
                    $(data).each(function(i, val) {
                        $.each(val, function(key, v) {
                            $('#' + key).closest('.form-group').addClass('has-error');
                            $('#error_' + key).show();
                        });
                    });

                    if ($('.has-error .form-control').length > 0) {
                        $('html, body').animate({
                            scrollTop: $('.has-error .form-control').first().offset().top - 200
                        }, 1000);
                        $('.has-error .form-control').first().focus()
                    }
                }
            });
        } else {
            save_and_continue_flag = false;
        }
        return false;
    });
    $(".todatepicker").on("change", function() {
        if ($(this).val() != '') {
            var this_obj = $(this)
            setTimeout(function() {
                this_obj.closest('.form-group').removeClass('has-error');
                this_obj.closest('.form-group').find('.help-block-error').remove();
                this_obj.css('border', '1px solid rgb(229, 229, 229)');
            }, 500);
        }
    });
    $(".fromdatepicker").on("change", function() {
        if ($(this).val() != '') {
            var this_obj = $(this)
            setTimeout(function() {
                this_obj.closest('.form-group').removeClass('has-error');
                this_obj.closest('.form-group').find('.help-block-error').remove();
                this_obj.css('border', '1px solid rgb(229, 229, 229)');
            }, 500);
        }
    });
});

function handleGoTop() {
    /* set variables locally for increased performance */
    $('#footer .go-top').click(function() {
        $('html,body').animate({
            scrollTop: 0
        }, 'slow');
    });
}

function clearForm(form) {
    $(":input", form).each(function() {
        var type = this.type;
        var tag = this.tagName.toLowerCase();
        if (type == 'text') {
            this.value = "";
        }
    });
};

function handleUniform() {
    if (!$().uniform) {
        return;
    }
    if (test = $("input[type=checkbox]:not(.toggle), input[type=radio]:not(.toggle)")) {
        test.uniform();
    }
}

function handleProfileForm() {
    $("#update_profile").submit(function() {
        var form = $("#update_profile");
        form.find('.duplicate-error').hide();
        form.find(".form-group").removeClass('has-error');
        if (form_valid("#update_profile")) {
            var curObj = $(this);
            if ($('#image_val img').prop('src') != undefined && $('#image_val img').prop('src') != '') {
                $('#v_logo_val').val($('#image_val img').prop('src'));
            }

            curObj.find('button[type=submit]').attr('disabled', 'disabled');
            var send_data = $("#update_profile").serialize();
            $.post($("#update_profile").attr("action"), send_data, function(data) {
                curObj.find('button[type=submit]').removeAttr('disabled');
                data = JSON.parse(data);
                if ($.trim(data.status) == 'TRUE') {
                    if ($('.page-content').hasClass('my-profile')) {
                        if (data.image != '') {
                            $('.page-header').find('img.img-circle').attr('src', SITE_URL + USER_PROFILE_THUMB_IMAGE_PATH + data.image);
                        } else {
                            $('.page-header').find('img.img-circle').attr('src', SITE_URL + 'assets/img/default-image.png');
                        }
                    }
                    $('#name').text($('#v_firstname').val() + ' ' + $('#v_lastname').val());
                    $('.duplicate-error').hide();
                    $('#password_new').val('');
                    $('#password_retype').val('');
                    form.find('.alert-success').show();
                    form.find('.alert-danger').hide();
                    $("html, body").animate({
                        scrollTop: 0
                    }, 600);
                    setTimeout(function() {
                        $(".alert-success").fadeOut(2000);
                    }, 4000);
                } else {
                    form.find('.alert-success').hide();
                    form.find('.alert-danger').show();
                    $(data).each(function(i, val) {
                        $.each(val, function(key, v) {
                            $('#' + key).closest('.form-group').addClass('has-error');
                            $('#error_' + key).show();
                        });
                    });
                    $("html, body").animate({
                        scrollTop: 0
                    }, 600);
                    $('.has-error .form-control').first().focus();
                }
            });
        } else {
            save_and_continue_flag = false;
        }
        return false;
    });

    $("#update_setting").submit(function() {
        var form = $("#update_setting");
        form.find('.duplicate-error').hide();
        form.find(".form-group").removeClass('has-error');

        if ($('#privacypolicy').length > 0) {
            CKEDITOR.instances.privacypolicy.updateElement();
            $('#privacypolicy').val(CKEDITOR.instances['privacypolicy'].getData());

        }
        if ($('#aboutapp').length > 0) {
            CKEDITOR.instances.aboutapp.updateElement();
            $('#aboutapp').val(CKEDITOR.instances['aboutapp'].getData());
        }
        if ($('#terms_condition').length > 0) {
            CKEDITOR.instances.terms_condition.updateElement();
            $('#terms_condition').val(CKEDITOR.instances['terms_condition'].getData());

        }
        /*if($('#welcometext').length > 0){
         //  CKEDITOR.instances.welcometext.updateElement();
         $('#welcometext').val(CKEDITOR.instances['welcometext'].getData());
         }*/

        if (form_valid("#update_setting")) {
            var curObj = $(this);
            curObj.find('button[type=submit]').attr('disabled', 'disabled');
            var send_data = $("#update_setting").serialize();
            $.post($("#update_setting").attr("action"), send_data, function(data) {
                curObj.find('button[type=submit]').removeAttr('disabled');
                if (data == 'TRUE') {
                    $('.duplicate-error').hide();
                    form.find('.alert-success').show();
                    form.find('.alert-danger').hide();
                    $("html, body").animate({
                        scrollTop: 0
                    }, 600);
                    setTimeout(function() {
                        $(".alert-success").fadeOut(2000);
                    }, 4000);
                } else {
                    form.find('.alert-success').hide();
                    form.find('.alert-danger').show();
                    $(data).each(function(i, val) {
                        $.each(val, function(key, v) {
                            $('#' + key).closest('.form-group').addClass('has-error');
                            $('#error_' + key).show();
                        });
                    });
                    $("html, body").animate({
                        scrollTop: 0
                    }, 600);
                    $('.has-error .form-control').first().focus()
                }
            });
        } else {
            save_and_continue_flag = false;
        }
        return false;
    });

}

function handleListRecord() {
    $('#frmSearchForm input[type="text"]').on("keyup", function(event) {
        var unicode = event.keyCode;
        if (unicode == 13) {
            loadPiece($("#frmSearchForm").attr('action'));
        }
        return false;
    });

    $("#btn_submit").click(function() {
        loadPiece($("#frmSearchForm").attr('action'));
        return false;
    });

    $(document).on('change', '.record_page', function() {
        $("#rec_per_page").val($(this).val());
        loadPiece($("#frmSearchForm").attr('action'));
        return false;
    });

}

// this is optional to use if you want animated show/hide. But plot charts can make the animation slow.
function handleSidebarTogglerAnimated() {
    $('.sidebar-toggler').click(function() {
        if ($('#sidebar > ul').is(":visible") === true) {
            $('#main-content').animate({
                'margin-left': '25px'
            });

            $('#sidebar').animate({
                'margin-left': '-190px'
            }, {
                complete: function() {
                    $('#sidebar > ul').hide();
                    $("#container").addClass("sidebar-closed");
                }
            });
        } else {
            $('#main-content').animate({
                'margin-left': '215px'
            });
            $('#sidebar > ul').show();
            $('#sidebar').animate({
                'margin-left': '0'
            }, {
                complete: function() {
                    $("#container").removeClass("sidebar-closed");
                }
            });
        }
    })
}

// by default used simple show/hide without animation due to the issue with handleSidebarTogglerAnimated.
function handleSidebarToggler() {
    $('.sidebar-toggler').click(function() {
        if ($('#sidebar > ul').is(":visible") === true) {
            $('#main-content').css({
                'margin-left': '25px'
            });
            $('#sidebar').css({
                'margin-left': '-190px'
            });
            $('#sidebar > ul').hide();
            $("#container").addClass("sidebar-closed");
        } else {
            $('#main-content').css({
                'margin-left': '215px'
            });
            $('#sidebar > ul').show();
            $('#sidebar').css({
                'margin-left': '0'
            });
            $("#container").removeClass("sidebar-closed");
        }
    })
}

function handleWidgetTools() {
    $('.widget .tools .icon-remove').click(function() {
        $(this).parents(".widget").parent().remove();
    });

    $('.widget .tools .icon-refresh').click(function() {
        var el = $(this).parents(".widget");
        App.blockUI(el);
        window.setTimeout(function() {
            App.unblockUI(el);
        }, 1000);
    });

    $('.widget .tools .icon-chevron-down, .widget .tools .icon-chevron-up').click(function() {
        var el = $(this).parents(".widget").children(".widget-body");
        if ($(this).hasClass("icon-chevron-down")) {
            $(this).removeClass("icon-chevron-down").addClass("icon-chevron-up");
            el.slideUp(200);
        } else {
            $(this).removeClass("icon-chevron-up").addClass("icon-chevron-down");
            el.slideDown(200);
        }
    });
}

function nl2br(str, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

function resetForm(frmID) {
    $('#summernote_send_a_message').code('');
    if ($("#message_id").length > 0) {
        $("#message_id").val('');
    }
    if ($("#follow_id").length > 0) {
        $("#follow_id").val('');
        $("#i_followed_up_type_id, #i_next_followed_up_type_id, #i_next_followed_up_by").select2('val', '')
    }
    $("#" + frmID)[0].reset();
}

function rtrim(str, lastChar) {
    if (str.substring(str.length - 1) == lastChar) {
        str = str.substring(0, str.length - 1);
    }
    return str;
}

function scroll_up_to(selector) {
    $('html, body').animate({
        scrollTop: (parseInt($(selector).offset().top, 10) - 200)
    }, 500);
}

function strstr(haystack, needle, bool) {

    var pos = 0;

    haystack += "";
    pos = haystack.indexOf(needle);
    if (pos == -1) {
        return false;
    } else {
        if (bool) {
            return haystack.substr(0, pos);
        } else {
            return haystack.slice(pos);
        }
    }
}
$(document).on("click", ".back_table", function() {
    if ($(".edit-record").length > 0) {
        if (!confirm('Updated information will discarded. Are you sure you want to continue?')) {
            return false;
        }
    }
    $('#widget-view-inner-content').fadeOut(500, function() {
        $('#widget-body-inner-content').fadeIn(500);
        $('#widget-view-inner-content').removeClass('edit-record');
        $('#widget-view-inner-content').removeClass('view-record');
        $('#widget-view-inner-content').html("");
    });
    return true;
});

function toggleSelection(user_type, role, module) {
    var id = user_type + '_' + role + '_' + module;
    var idx = $selection.indexOf(id);
    if (module == 'Read All') {
        var read_own = user_type + '_' + role + '_Read Own';
        read_idx = $selection.indexOf(read_own);
        if (read_idx > -1) {
            $selection.splice(read_idx, 1);
            $newselection[read_own] = false;
            $selection.push(id);
        } else {
            $selection.push(id);
        }
    } else if (module == 'Read Own') {
        var read_all = user_type + '_' + role + '_Read All';
        read_idx = $selection.indexOf(read_all);
        if (read_idx > -1) {
            $selection.splice(read_idx, 1);
            $newselection[read_own] = false;
            $selection.push(id);
        } else {
            $selection.push(id);
        }
    } else {
        if (idx > -1) {
            $selection.splice(idx, 1);
            $newselection[id] = false;
        } else {
            $selection.push(id);
        }
    }
    $('#selection_list').val($selection);
}