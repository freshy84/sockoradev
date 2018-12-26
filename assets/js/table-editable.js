var TableEditable = function () {

    var handleFeatureTable = function () {

        function strip(html) {
            var tmp = document.createElement("DIV");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || "";
        }

        function restoreRow(oTable, nRow) {
            var aData = oTable.fnGetData(nRow);
            var jqTds = $('>td', nRow);

            for (var i = 0, iLen = jqTds.length; i < iLen; i++) {
                oTable.fnUpdate(aData[i], nRow, i, false);
            }
            //oTable.fnDraw();
        }

        function editRow(oTable, nRow) {
            var aData = oTable.fnGetData(nRow);
            var jqTds = $('>td', nRow);
            if (nEditingType != 'Terms' && nEditingType != 'ListingType') {
                jqTds[0].innerHTML = '<input id="v_name" type="text" class="form-control required features_name unique" placeholder="Name" value="' + aData[0] + '" rel="' + nEditingId + '" id2="' + nEditingType + '">';
            }  else {
                jqTds[0].innerHTML = '<input id="v_name" type="text" class="form-control required" placeholder="Name" value="' + aData[0] + '">';
            }
            jqTds[1].innerHTML = '<a href="javascript:;" class="btn btn-xs green-haze save"><i class="fa fa-check"></i> Save</a><a href="javascript:;" class="btn btn-xs default cancel"><i class="fa fa-close"></i> Cancel</a>';
        }

        function saveRow(oTable, nRow) {
            var jqInputs = $('input', nRow);
            oTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
            oTable.fnUpdate('<a href="javascript:;" class="btn default btn-xs edit" data-type="' + nEditingType + '" rel="' + nEditingId + '"><i class="fa fa-edit"></i> Edit </a><a href="javascript:;" class="btn btn-xs default delete" rel="' + nEditingId + '" data-type="' + nEditingType + '"><i class="fa fa-close"></i> Delete</a>', nRow, 1, false);
            
            oTable.fnDraw();
        }

        /*function cancelEditRow(oTable, nRow) {
         var jqInputs = $('input', nRow);
         oTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
         oTable.fnUpdate('<a class="edit" href="">Edit</a>', nRow, 1, false);
         oTable.fnDraw();
         }*/

        var table = $('.sample_editable_1');

        var oTable = table.dataTable({

            "lengthMenu": [
                [5, 15, 20, -1],
                [5, 15, 20, "All"] // change per page values here
            ],
            // set the initial value
            "pageLength": false,
            "bPaginate": false,
            "bFilter": false,
            "bInfo": false,
            "bRetrieve": true,
            "language": {
                "lengthMenu": " _MENU_ records"
            },
            "columnDefs": [{// set default column settings
                    'orderable': false,
                    'targets': [0]
                }, {
                    'bSortable': false,
                    'aTargets': [-1, -2, -3]
                }
            ],
            "order": [] // set first column as a default sort by asc
        });

        var tableWrapper = $("#datatable_ajax_wrapper");

        var nEditing = null;
        var nEditingId = null;
        var nEditingType = null;

        table.on('click', '.delete', function (e) {
            e.preventDefault();
            var nRow = $(this).parents('tr')[0];
            var id = $(this).attr('rel');
            var type = $(this).attr('data-type');
            bootbox.confirm("Are you sure that you want to delete this record?", function (confirmed) {
                if (confirmed) {
                    if (type == 'Terms') {
                        $.post(SITE_URL + 'room-information/delete/' + id, function (data) {
                            if (data.status == 'TRUE') {
                                oTable.fnDeleteRow(nRow);
                                $('#delete_msg').fadeIn(1000);
                                setTimeout(function () {
                                    $('#delete_msg').fadeOut(3000);
                                }, 4000);
                            }
                        });
                    } else if (type == 'ListingType') {
                        $.post(SITE_URL + 'listing-type/delete/' + id, function (data) {
                            if (data.status == 'TRUE') {
                                oTable.fnDeleteRow(nRow);
                                $('#delete_msg').fadeIn(1000);
                                setTimeout(function () {
                                    $('#delete_msg').fadeOut(3000);
                                }, 4000);
                            }
                        });

                    } else {
                        $.post(SITE_URL + 'global-informations/delete/' + id, function (data) {
                            if (data.status == 'TRUE') {
                                oTable.fnDeleteRow(nRow);
                                $('#delete_msg').fadeIn(1000);
                                setTimeout(function () {
                                    $('#delete_msg').fadeOut(3000);
                                }, 4000);
                            }
                        });
                    }
                }
            });
        });

        table.on('click', '.cancel', function (e) {
            bootbox.confirm('Updated information will discarded. Are you sure you want to continue?', function (confirmed) {
                if (confirmed) {
                    e.preventDefault();
                    restoreRow(oTable, nEditing);
                    nEditing = null;
                    nEditingId = null;
                    nEditingType = null;

                }
            });
        });

        table.on('click', '.edit', function (e) {
            e.preventDefault();
            /* Get the row as a parent of the link that was clicked on */
            var nRow = $(this).parents('tr')[0];
            var nRowEditId = $(this).attr('rel');
            var nRowEditType = $(this).attr('data-type');
            if (nEditing !== null && nEditingId != nRowEditId) {
                /* Currently editing - but not this row - restore the old before continuing to edit mode */
                restoreRow(oTable, nEditing);
                nEditing = nRow;
                nEditingId = nRowEditId;
                nEditingType = nRowEditType;
                editRow(oTable, nRow);

            } else {
                /* No edit in progress - let's start one */
                nEditing = nRow;
                nEditingId = nRowEditId;
                nEditingType = nRowEditType;
                editRow(oTable, nRow);

            }
        });

        /* Editing this row and want to save it */
        table.on('click', '.save', function (e) {
            e.preventDefault();
            $(nEditing).find('.duplicate_error').remove();
            /*$(nEditing).find('.help-block').remove();
             $(nEditing).find('#v_name').removeClass('error');*/
            if ($('.help-block').length <= 0) {
                var send_data = {};
                send_data['v_name'] = $(nEditing).find('#v_name').val();
                send_data['id'] = nEditingId;
                send_data['e_type'] = nEditingType;
                if (send_data['v_name'] != '') {
                    if (nEditingType == 'Terms') {
                        $.post(SITE_URL + 'room-information/edit', send_data, function (data) {
                            if (data.status == 'TRUE') {
                                $('#edit_msg').fadeIn(1000);
                                setTimeout(function () {
                                    $('#edit_msg').fadeOut(3000);
                                }, 4000);
                                $(nEditing).find('#v_name').removeClass('error');
                                saveRow(oTable, nEditing);
                                nEditing = null;
                            } else {
                                $(data).each(function (i, val) {
                                    $.each(val, function (key, v) {
                                        $(nEditing).find('#' + key).after('<div id="' + key + '_error" style="color:#a94442" class="help-block help-block-error duplicate_error">' + v + '</div>');
                                        $(nEditing).find('.duplicate_error').show();
                                    });
                                });
                            }
                        });

                    } else if (nEditingType == 'ListingType') {
                        $.post(SITE_URL + 'listing-type/edit', send_data, function (data) {
                            if (data.status == 'TRUE') {
                                $('#edit_msg').fadeIn(1000);
                                setTimeout(function () {
                                    $('#edit_msg').fadeOut(3000);
                                }, 4000);
                                $(nEditing).find('#v_name').removeClass('error');
                                saveRow(oTable, nEditing);
                                nEditing = null;
                            } else {
                                $(data).each(function (i, val) {
                                    $.each(val, function (key, v) {
                                        $(nEditing).find('#' + key).after('<div id="' + key + '_error" style="color:#a94442" class="help-block help-block-error duplicate_error">' + v + '</div>');
                                        $(nEditing).find('.duplicate_error').show();
                                    });
                                });
                            }
                        });
                    }  else {
                        $.post(SITE_URL + 'global-informations/' + nEditingType + '/edit', send_data, function (data) {
                            if (data.status == 'TRUE') {
                                $('#edit_msg').fadeIn(1000);
                                setTimeout(function () {
                                    $('#edit_msg').fadeOut(3000);
                                }, 4000);
                                $(nEditing).find('#v_name').removeClass('error');
                                saveRow(oTable, nEditing);
                                nEditing = null;
                            } else {
                                $(data).each(function (i, val) {
                                    $.each(val, function (key, v) {
                                        $(nEditing).find('#' + key).after('<div id="' + key + '_error" style="color:#a94442" class="help-block help-block-error duplicate_error">' + v + '</div>');
                                        $(nEditing).find('.duplicate_error').show();
                                    });
                                });
                            }
                        });
                    }

                } else {
                    /*$(nEditing).find('#v_name').after('<div id="_error" style="color:#a94442" class="help-block">Please enter name.</div>');*/
                }
            }
        });
        $('#add_feature').click(function () {
            $('#FeatureModal').modal('show');
            $('#FeatureModal #id').val("");
        });
        $('#add_room_information').click(function () {
            $('#TermsModal').modal('show');
            $('#TermsModal #id').val("");
        });
        $('#add_listing_type').click(function () {
            $('#ListingTypeModal').modal('show');
            $('#ListingTypeModal #id').val("");
        });
      
        $("#FeatureAdd").submit(function ()
        {
            var form = $("#FeatureAdd");
            $("#FeatureAdd .duplicate_error").hide();
            if (form_valid("#FeatureAdd"))
            {
                $.post($("#FeatureAdd").attr("action"), $("#FeatureAdd").serialize(), function (data) {
                    if ($.trim(data.status) == 'TRUE') {
                        $('.alert-danger').hide();
                        form.find('.duplicate_error').hide();
                        $('#FeatureAdd')[0].reset();
                        $('#FeatureModal').modal('hide');
                        var rowIndex = $(oTable).dataTable().fnAddData([data.v_name, '<a href="javascript:;" class="btn default btn-xs edit" rel="' + data.id + '" data-type="' + data.e_type + '"><i class="fa fa-edit"></i> Edit</a><a href="javascript:;" class="btn btn-xs default delete" rel="' + data.id + '" data-type="' + data.e_type + '"><i class="fa fa-close"></i> Delete</a>']);
                        oTable.fnDraw();
                        var row = $(oTable).dataTable().fnGetNodes(rowIndex);
                        $(row).attr('id', data.id);
                        $('#add_msg').fadeIn(1000);
                        setTimeout(function () {
                            $('#add_msg').fadeOut(3000);
                        }, 4000);
                    } else {
                        form.find('.alert-success').hide();
                        form.find('.alert-danger').show();
                        $(data).each(function (i, val) {
                            $.each(val, function (key, v) {
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
            }
            return false;
        });
        $("#TermsAdd").submit(function ()
        {
            var form = $("#TermsAdd");
            $("#TermsAdd .duplicate_error").hide();
            if (form_valid("#TermsAdd"))
            {
                $.post($("#TermsAdd").attr("action"), $("#TermsAdd").serialize(), function (data) {
                    if ($.trim(data.status) == 'TRUE') {
                        $('.alert-danger').hide();
                        form.find('.duplicate_error').hide();
                        $('#TermsAdd')[0].reset();
                        $('#TermsModal').modal('hide');
                        var rowIndex = $(oTable).dataTable().fnAddData([data.v_name, '<a href="javascript:;" class="btn default btn-xs edit" rel="' + data.id + '" data-type="' + data.e_type + '"><i class="fa fa-edit"></i> Edit</a><a href="javascript:;" class="btn btn-xs default delete" rel="' + data.id + '" data-type="' + data.e_type + '"><i class="fa fa-close"></i> Delete</a>']);
                        oTable.fnDraw();
                        var row = $(oTable).dataTable().fnGetNodes(rowIndex);
                        $(row).attr('id', data.id);
                        $('#add_msg').fadeIn(1000);
                        setTimeout(function () {
                            $('#add_msg').fadeOut(3000);
                        }, 4000);
                    } else {
                        form.find('.alert-success').hide();
                        form.find('.alert-danger').show();
                        $(data).each(function (i, val) {
                            $.each(val, function (key, v) {
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
            }
            return false;
        });
        $("#ListingTypeAdd").submit(function ()
        {
            var form = $("#ListingTypeAdd");
            $("#ListingTypeAdd .duplicate_error").hide();
            if (form_valid("#ListingTypeAdd"))
            {
                $.post($("#ListingTypeAdd").attr("action"), $("#ListingTypeAdd").serialize(), function (data) {
                    if ($.trim(data.status) == 'TRUE') {
                        $('.alert-danger').hide();
                        form.find('.duplicate_error').hide();
                        $('#ListingTypeAdd')[0].reset();
                        $('#ListingTypeModal').modal('hide');
                        var rowIndex = $(oTable).dataTable().fnAddData([data.v_name, '<a href="javascript:;" class="btn default btn-xs edit" rel="' + data.id + '" data-type="ListingType"><i class="fa fa-edit"></i> Edit</a><a href="javascript:;" class="btn btn-xs default delete" rel="' + data.id + '" data-type="ListingType"><i class="fa fa-close"></i> Delete</a>']);
                        oTable.fnDraw();
                        var row = $(oTable).dataTable().fnGetNodes(rowIndex);
                        $(row).attr('id', data.id);
                        $('#add_msg').fadeIn(1000);
                        setTimeout(function () {
                            $('#add_msg').fadeOut(3000);
                        }, 4000);
                    } else {
                        form.find('.alert-success').hide();
                        form.find('.alert-danger').show();
                        $(data).each(function (i, val) {
                            $.each(val, function (key, v) {
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
            }
            return false;
        });
        
        $('#FeatureCancel').click(function (e) {
            $('#FeatureAdd .form-group').removeClass('has-error');
            $('#FeatureAdd .help-block').remove();
            $('#FeatureAdd').find('.duplicate-error').hide();
            $('#FeatureAdd')[0].reset();
        });
        $('#TermsCancel').click(function (e) {
            $('#TermsAdd .form-group').removeClass('has-error');
            $('#TermsAdd .help-block').remove();
            $('#TermsAdd').find('.duplicate-error').hide();
            $('#TermsAdd')[0].reset();
        });
        $('#ListingTypeCancel').click(function (e) {
            $('#ListingTypeAdd .form-group').removeClass('has-error');
            $('#ListingTypeAdd .help-block').remove();
            $('#ListingTypeAdd').find('.duplicate-error').hide();
            $('#ListingTypeAdd')[0].reset();
        });
    }


    var handleCouponTable = function () {

        function strip(html) {
            var tmp = document.createElement("DIV");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || "";
        }

        function restoreRow(oTable, nRow) {
            var aData = oTable.fnGetData(nRow);
            var jqTds = $('>td', nRow);

            for (var i = 0, iLen = jqTds.length; i < iLen; i++) {
                oTable.fnUpdate(aData[i], nRow, i, false);
            }
            //oTable.fnDraw();
        }

        function editRow(oTable, nRow) {

            var consumerListSelect = '<select id="i_consumer_id" name="i_consumer_id" class="form-control required" placeholder="Consumer">\
                <option value=""> Select Consumer </option>';
            $.each($consumerList, function (index, value) {
                consumerListSelect += '<option value="' + value.v_firstname + '">' + value.v_firstname + '</option>';
            });
            consumerListSelect += '</select>';

            var discountTypeSelect = ' <select class="form-control required" name="e_discount_type" id="e_discount_type" placeholder="Discount Type">\
                            <option value="">Select Discount Type</option>\
                            <option value="Percentage Discount">Percentage Discount</option>\
                            <option value="Fixed Amount Discount">Fixed Amount Discount</option>\
                        </select>';

            var aData = oTable.fnGetData(nRow);
            var jqTds = $('>td', nRow);
            jqTds[0].innerHTML = '<input id="v_code" type="text" class="form-control required code unique" placeholder="Name" value="' + $.trim(strip(aData[0])) + '" rel="' + nEditingId + '">';
            jqTds[1].innerHTML = consumerListSelect;
            jqTds[2].innerHTML = '<input id="i_usage_limit_per_coupon" type="text" class="form-control" placeholder="Usage limit per coupon" value="' + $.trim(strip(aData[2])) + '">';
            jqTds[3].innerHTML = '<input id="d_expiry_date" type="text" class="form-control expiry_date" placeholder="Expiry Date" value="' + $.trim(strip(aData[3])) + '"/>';
            jqTds[4].innerHTML = '<input id="i_minimum_spend" type="text" class="form-control" placeholder="Minimum Spend" value="' + $.trim(strip(aData[4])) + '">';
            jqTds[5].innerHTML = '<input id="i_maximum_spend" type="text" class="form-control" placeholder="Maximum Spend" value="' + $.trim(strip(aData[5])) + '">';
            jqTds[6].innerHTML = '<input id="v_email_restrict" type="text" class="form-control email" placeholder="Email Restriction" value="' + $.trim(strip(aData[6])) + '">';
            jqTds[7].innerHTML = discountTypeSelect;
            jqTds[8].innerHTML = '<input id="i_coupon_amount" type="text" class="form-control required" placeholder="Coupon Amount" value="' + $.trim(strip(aData[8])) + '">';

            jqTds[9].innerHTML = '<a href="javascript:;" class="btn btn-xs green-haze save margin-bottom"><i class="fa fa-check"></i> Save</a><a href="javascript:;" class="btn btn-xs default cancel"><i class="fa fa-close"></i> Cancel</a>';

            $('#i_consumer_id,#e_discount_type').select({
                placeholder: "Select",
                allowClear: true
            });
            $('.expiry_date').datepicker({
                autoclose: true,
                todayBtn: true,
                todayHighlight: true,
                constrainInput: false,
                clearBtn: true,
                format: 'yyyy-mm-dd'
            });
            $('#i_consumer_id').val($.trim(strip(aData[1])));
            $('#e_discount_type').val($.trim(strip(aData[7])));

        }

        function saveRow(oTable, nRow) {
            var jqInputs = $('input', nRow);
            oTable.fnUpdate('<a href="javascript:;" class="btn default btn-xs edit margin-bottom" rel="' + nEditingId + '"><i class="fa fa-edit"></i> Edit </a><a href="javascript:;" class="btn btn-xs default delete" rel="' + nEditingId + '"><i class="fa fa-close"></i> Delete</a>', nRow, 9, false);
            
            oTable.fnDraw();
        }

        /*function cancelEditRow(oTable, nRow) {
         var jqInputs = $('input', nRow);
         oTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
         oTable.fnUpdate('<a class="edit" href="">Edit</a>', nRow, 1, false);
         oTable.fnDraw();
         }*/

        var table = $('.sample_editable_9');

        var oTable = table.dataTable({

            "lengthMenu": [
                [5, 15, 20, -1],
                [5, 15, 20, "All"] // change per page values here
            ],
            // set the initial value
            "pageLength": false,
            "bPaginate": false,
            "bFilter": false,
            "bInfo": false,
            "bRetrieve": true,
            "language": {
                "lengthMenu": " _MENU_ records"
            },
            "columnDefs": [{// set default column settings
                    'orderable': false,
                    'targets': [0]
                }, {
                    'bSortable': false,
                    'aTargets': [-1, -2, -3]
                }
            ],
            "order": [] // set first column as a default sort by asc
        });

        var tableWrapper = $("#datatable_ajax_wrapper");

        var nEditing = null;
        var nEditingId = null;
        
        table.on('click', '.delete', function (e) {
            e.preventDefault();
            var nRow = $(this).parents('tr')[0];
            var id = $(this).attr('rel');
            bootbox.confirm("Are you sure that you want to delete this record?", function (confirmed) {
                if (confirmed) {
                    $.post(SITE_URL + 'coupon/delete/' + id, function (data) {
                        if (data.status == 'TRUE') {
                            oTable.fnDeleteRow(nRow);
                            $('#delete_msg').fadeIn(1000);
                            setTimeout(function () {
                                $('#delete_msg').fadeOut(3000);
                            }, 4000);
                        }
                    });

                    
                }
            });
        });

        table.on('click', '.cancel', function (e) {
            bootbox.confirm('Updated information will discarded. Are you sure you want to continue?', function (confirmed) {
                if (confirmed) {
                    e.preventDefault();
                    restoreRow(oTable, nEditing);
                    nEditing = null;
                    nEditingId = null;
                }
            });
        });

        table.on('click', '.edit', function (e) {
            e.preventDefault();
            /* Get the row as a parent of the link that was clicked on */
            var nRow = $(this).parents('tr')[0];
            var nRowEditId = $(this).attr('rel');
            if (nEditing !== null && nEditingId != nRowEditId) {
                /* Currently editing - but not this row - restore the old before continuing to edit mode */
                restoreRow(oTable, nEditing);
                nEditing = nRow;
                nEditingId = nRowEditId;
                editRow(oTable, nRow);

            } else {
                /* No edit in progress - let's start one */
                nEditing = nRow;
                nEditingId = nRowEditId;
                editRow(oTable, nRow);

            }
        });

        /* Editing this row and want to save it */
        table.on('click', '.save', function (e) {
            e.preventDefault();
            $(nEditing).find('.duplicate_error').remove();
            /*$(nEditing).find('.help-block').remove();
             $(nEditing).find('#v_name').removeClass('error');*/
            if ($('.help-block').length <= 0) {
                var send_data = {};
                send_data['v_code'] = $(nEditing).find('#v_code').val();
                send_data['i_usage_limit_per_coupon'] = $(nEditing).find('#i_usage_limit_per_coupon').val();
                send_data['d_expiry_date'] = $(nEditing).find('#d_expiry_date').val();
                send_data['i_minimum_spend'] = $(nEditing).find('#i_minimum_spend').val();
                send_data['i_maximum_spend'] = $(nEditing).find('#i_maximum_spend').val();
                send_data['v_email_restrict'] = $(nEditing).find('#v_email_restrict').val();
                send_data['e_discount_type'] = $(nEditing).find('#e_discount_type').val();
                send_data['i_coupon_amount'] = $(nEditing).find('#i_coupon_amount').val();

                send_data['i_consumer_id'] = $.grep($consumerList, function (v) {
                    return v.v_firstname == $(nEditing).find('#i_consumer_id').val();
                });
                send_data['id'] = nEditingId;
                if (send_data['v_code'] != '' && send_data['i_consumer_id'][0] != undefined && send_data['e_discount_type'] != '' && send_data['i_coupon_amount'] != '') {
                    send_data['i_consumer_id'] = send_data['i_consumer_id'][0].id;
                    $.post(SITE_URL + 'coupon/edit', send_data, function (data) {
                        if (data.status == 'TRUE') {
                            $('#edit_msg').fadeIn(1000);
                            setTimeout(function () {
                                $('#edit_msg').fadeOut(3000);
                            }, 4000);
                            $(nEditing).find('#v_code').removeClass('error');
                            $(nEditing).find('#i_consumer_id').removeClass('error');
                            saveRow(oTable, nEditing);
                            nEditing = null;
                        } else {
                            $(data).each(function (i, val) {
                                $.each(val, function (key, v) {
                                    $(nEditing).find('#' + key).after('<div id="' + key + '_error" style="color:#a94442" class="help-block help-block-error duplicate_error">' + v + '</div>');
                                    $(nEditing).find('.duplicate_error').show();
                                });
                            });
                        }
                    });
                

                } else {
                    /*$(nEditing).find('#v_name').after('<div id="_error" style="color:#a94442" class="help-block">Please enter name.</div>');*/
                }
            }
        });
       
        $('#add_coupon').click(function () {
            $('#CouponModal').modal('show');
            $('#CouponModal #id').val("");
        });
         
        $("#CouponAdd").submit(function ()
        {
            var form = $("#CouponAdd");
            $("#CouponAdd .duplicate_error").hide();
            if (form_valid("#CouponAdd"))
            {
                $.post($("#CouponAdd").attr("action"), $("#CouponAdd").serialize(), function (data) {
                    if ($.trim(data.status) == 'TRUE') {
                        $('.alert-danger').hide();
                        form.find('.duplicate_error').hide();
                        $('#CouponAdd')[0].reset();
                        $('#CouponModal').modal('hide');
                        //var rowIndex = $(oTable).dataTable().fnAddData([data.v_code,data.i_consumer_id,data.d_expiry_date, '<a href="javascript:;" class="btn default btn-xs edit" rel="' + data.id + '"><i class="fa fa-edit"></i> Edit</a><a href="javascript:;" class="btn btn-xs default delete" rel="' + data.id + '"><i class="fa fa-close"></i> Delete</a>']);
                        oTable.fnDraw();
                        //var row = $(oTable).dataTable().fnGetNodes(rowIndex);
                        //$(row).attr('id', data.id);
                        $('#add_msg').fadeIn(1000);
                        setTimeout(function () {
                            $('#add_msg').fadeOut(3000);
                        }, 4000);
                    } else {
                        form.find('.alert-success').hide();
                        form.find('.alert-danger').show();
                        $(data).each(function (i, val) {
                            $.each(val, function (key, v) {
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
            }
            return false;
        });
      
        $('#CouponAddCancel').click(function (e) {
            $('#CouponAdd .form-group').removeClass('has-error');
            $('#CouponAdd .help-block').remove();
            $('#CouponAdd').find('.duplicate-error').hide();
            $('#CouponAdd')[0].reset();
        });
    }
    var handleCountryTable = function () {

        function strip(html) {
            var tmp = document.createElement("DIV");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || "";
        }

        function restoreRow(oTable, nRow) {
            var aData = oTable.fnGetData(nRow);
            var jqTds = $('>td', nRow);

            for (var i = 0, iLen = jqTds.length; i < iLen; i++) {
                oTable.fnUpdate(aData[i], nRow, i, false);
            }
            //oTable.fnDraw();
        }

        function editRow(oTable, nRow) {
            var aData = oTable.fnGetData(nRow);
            var jqTds = $('>td', nRow);
            jqTds[0].innerHTML = '<input id="v_name" type="text" class="form-control required" placeholder="Name" value="' + aData[0] + '">';
            jqTds[1].innerHTML = '<input id="v_code" type="text" class="form-control required" placeholder="Code" value="' + aData[1] + '">';
            jqTds[2].innerHTML = '<a href="javascript:;" class="btn btn-xs green-haze save"><i class="fa fa-check"></i> Save</a><a href="javascript:;" class="btn btn-xs default cancel"><i class="fa fa-close"></i> Cancel</a>';
        }

        function saveRow(oTable, nRow) {
            var jqInputs = $('input', nRow);
            oTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
            oTable.fnUpdate(jqInputs[1].value, nRow, 1, false);
            oTable.fnUpdate('<a href="javascript:;" class="btn default btn-xs edit" rel="' + nEditingId + '"><i class="fa fa-edit"></i> Edit </a><a href="javascript:;" class="btn btn-xs default delete" rel="' + nEditingId + '"><i class="fa fa-close"></i> Delete</a>', nRow, 1, false);
            oTable.fnDraw();
        }

        var table = $('.sample_editable_2');

        var oTable = table.dataTable({

            "lengthMenu": [
                [5, 15, 20, -1],
                [5, 15, 20, "All"] // change per page values here
            ],
            // set the initial value
            "pageLength": false,
            "bPaginate": false,
            "bFilter": false,
            "bInfo": false,
            "bRetrieve": true,
            "language": {
                "lengthMenu": " _MENU_ records"
            },
            "columnDefs": [{// set default column settings
                    'orderable': false,
                    'targets': [0]
                }, {
                    'bSortable': false,
                    'aTargets': [-1, -2, -3]
                }
            ],
            "order": [] // set first column as a default sort by asc
        });

        var tableWrapper = $("#datatable_country_wrapper");

        var nEditing = null;
        var nEditingId = null;

        table.on('click', '.delete', function (e) {
            e.preventDefault();
            var nRow = $(this).parents('tr')[0];
            var id = $(this).attr('rel');
            bootbox.confirm("Are you sure that you want to delete this record?", function (confirmed) {
                if (confirmed) {
                    $.post(SITE_URL + 'locations/Country/delete/' + id, function (data) {
                        if (data.status == 'TRUE') {
                            oTable.fnDeleteRow(nRow);
                            $('#delete_msg').fadeIn(1000);
                            setTimeout(function () {
                                $('#delete_msg').fadeOut(3000);
                            }, 4000);
                        }
                    });
                }
            });
        });

        table.on('click', '.cancel', function (e) {
            bootbox.confirm('Updated information will discarded. Are you sure you want to continue?', function (confirmed) {
                if (confirmed) {
                    e.preventDefault();
                    restoreRow(oTable, nEditing);
                    nEditing = null;
                    nEditingId = null;

                }
            });
        });

        table.on('click', '.edit', function (e) {
            e.preventDefault();
            /* Get the row as a parent of the link that was clicked on */
            var nRow = $(this).parents('tr')[0];
            var nRowEditId = $(this).attr('rel');
            if (nEditing !== null && nEditingId != nRowEditId) {
                /* Currently editing - but not this row - restore the old before continuing to edit mode */
                restoreRow(oTable, nEditing);
                nEditing = nRow;
                nEditingId = nRowEditId;
                editRow(oTable, nRow);

            } else {
                /* No edit in progress - let's start one */
                nEditing = nRow;
                nEditingId = nRowEditId;
                editRow(oTable, nRow);

            }
        });

        /* Editing this row and want to save it */
        table.on('click', '.save', function (e) {
            e.preventDefault();
            $(nEditing).find('.duplicate_error').remove();
            if ($('.help-block').length <= 0) {
                var send_data = {};
                send_data['v_name'] = $(nEditing).find('#v_name').val();
                send_data['v_code'] = $(nEditing).find('#v_code').val();
                send_data['id'] = nEditingId;
                if (send_data['v_name'] != '' && send_data['v_code'] != '') {
                    $.post(SITE_URL + 'locations/Country/edit', send_data, function (data) {
                        if (data.status == 'TRUE') {
                            $('#edit_msg').fadeIn(1000);
                            setTimeout(function () {
                                $('#edit_msg').fadeOut(3000);
                            }, 4000);
                            saveRow(oTable, nEditing);
                            nEditing = null;
                        } else {
                            $(data).each(function (i, val) {
                                $.each(val, function (key, v) {
                                    $(nEditing).find('#' + key).after('<div id="' + key + '_error" style="color:#a94442" class="help-block help-block-error duplicate_error">' + v + '</div>');
                                    $(nEditing).find('.duplicate_error').show();
                                });
                            });
                        }
                    });
                }
            }
        });
        $('#add_location').click(function () {
            $('#LocationModal').modal('show');
            $('#LocationModal #id').val("");
        });
        $("#CountryAdd").submit(function ()
        {
            var form = $("#CountryAdd");
            $("#CountryAdd .duplicate_error").hide();
            if (form_valid("#CountryAdd"))
            {
                $.post($("#CountryAdd").attr("action"), $("#CountryAdd").serialize(), function (data) {
                    if ($.trim(data.status) == 'TRUE') {
                        $('.alert-danger').hide();
                        form.find('.duplicate_error').hide();
                        $('#CountryAdd')[0].reset();
                        $('#LocationModal').modal('hide');
                        var rowIndex = $(oTable).dataTable().fnAddData([data.v_name, data.v_code, '<a href="javascript:;" class="btn default btn-xs edit" rel="' + data.id + '"><i class="fa fa-edit"></i> Edit</a><a href="javascript:;" class="btn btn-xs default delete" rel="' + data.id + '"><i class="fa fa-close"></i> Delete</a>']);
                        oTable.fnDraw();
                        var row = $(oTable).dataTable().fnGetNodes(rowIndex);
                        $(row).attr('id', data.id);
                        $('#add_msg').fadeIn(1000);
                        setTimeout(function () {
                            $('#add_msg').fadeOut(3000);
                        }, 4000);
                    } else {
                        form.find('.alert-success').hide();
                        form.find('.alert-danger').show();
                        $(data).each(function (i, val) {
                            $.each(val, function (key, v) {
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
            }
            return false;
        });

        $('#CountryCancel').click(function (e) {
            $('#CountryAdd .form-group').removeClass('has-error');
            $('#CountryAdd .help-block').remove();
            $('#CountryAdd').find('.duplicate-error').hide();
            $('#CountryAdd')[0].reset();
        });
    }

    var handleProvinceTable = function () {

        function strip(html) {
            var tmp = document.createElement("DIV");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || "";
        }

        function restoreRow(oTable, nRow) {
            var aData = oTable.fnGetData(nRow);
            var jqTds = $('>td', nRow);

            for (var i = 0, iLen = jqTds.length; i < iLen; i++) {
                oTable.fnUpdate(aData[i], nRow, i, false);
            }
            //oTable.fnDraw();
        }

        function editRow(oTable, nRow) {
            var countryListSelect = '<select id="i_country_id" name="i_country_id" class="form-control required select_country" placeholder="Country">\
                <option value=""> Select Country </option>';
            $.each($countryList, function (index, value) {
                countryListSelect += '<option value="' + value.v_name + '">' + value.v_name + '</option>';
            });
            countryListSelect += '</select>';
            var aData = oTable.fnGetData(nRow);
            var jqTds = $('>td', nRow);
            jqTds[0].innerHTML = '<input id="v_name" type="text" class="form-control required" placeholder="Name" value="' + aData[0] + '">';
            jqTds[1].innerHTML = countryListSelect;
            jqTds[2].innerHTML = '<a href="javascript:;" class="btn btn-xs green-haze save"><i class="fa fa-check"></i> Save</a><a href="javascript:;" class="btn btn-xs default cancel"><i class="fa fa-close"></i> Cancel</a>';
            $('#i_country_id').select({
                placeholder: "Select",
                allowClear: true
            });
            $('#i_country_id').val($.trim(strip(aData[1])));
            //$('#i_country_id').select('val', $.trim(strip(aData[1])) );                        
        }

        function saveRow(oTable, nRow) {
            var jqInputs = $('input,select', nRow);
            oTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
            oTable.fnUpdate(jqInputs[1].value, nRow, 1, false);
            oTable.fnUpdate('<a href="javascript:;" class="btn default btn-xs edit" rel="' + nEditingId + '"><i class="fa fa-edit"></i> Edit </a><a href="javascript:;" class="btn btn-xs default delete" rel="' + nEditingId + '"><i class="fa fa-close"></i> Delete</a>', nRow, 1, false);
            oTable.fnDraw();
        }

        var table = $('.sample_editable_3');

        var oTable = table.dataTable({

            "lengthMenu": [
                [5, 15, 20, -1],
                [5, 15, 20, "All"] // change per page values here
            ],
            // set the initial value
            "pageLength": false,
            "bPaginate": false,
            "bFilter": false,
            "bInfo": false,
            "bRetrieve": true,
            "language": {
                "lengthMenu": " _MENU_ records"
            },
            "columnDefs": [{// set default column settings
                    'orderable': false,
                    'targets': [0]
                }, {
                    'bSortable': false,
                    'aTargets': [-1, -2, -3]
                }
            ],
            "order": [] // set first column as a default sort by asc
        });

        var tableWrapper = $("#datatable_country_wrapper");

        var nEditing = null;
        var nEditingId = null;

        table.on('click', '.delete', function (e) {
            e.preventDefault();
            var nRow = $(this).parents('tr')[0];
            var id = $(this).attr('rel');
            bootbox.confirm("Are you sure that you want to delete this record?", function (confirmed) {
                if (confirmed) {
                    $.post(SITE_URL + 'locations/Province/delete/' + id, function (data) {
                        if (data.status == 'TRUE') {
                            oTable.fnDeleteRow(nRow);
                            $('#delete_msg').fadeIn(1000);
                            setTimeout(function () {
                                $('#delete_msg').fadeOut(3000);
                            }, 4000);
                        }
                    });
                }
            });
        });

        table.on('click', '.cancel', function (e) {
            bootbox.confirm('Updated information will discarded. Are you sure you want to continue?', function (confirmed) {
                if (confirmed) {
                    e.preventDefault();
                    restoreRow(oTable, nEditing);
                    nEditing = null;
                    nEditingId = null;

                }
            });
        });

        table.on('click', '.edit', function (e) {
            e.preventDefault();
            /* Get the row as a parent of the link that was clicked on */
            var nRow = $(this).parents('tr')[0];
            var nRowEditId = $(this).attr('rel');
            if (nEditing !== null && nEditingId != nRowEditId) {
                /* Currently editing - but not this row - restore the old before continuing to edit mode */
                restoreRow(oTable, nEditing);
                nEditing = nRow;
                nEditingId = nRowEditId;
                editRow(oTable, nRow);

            } else {
                /* No edit in progress - let's start one */
                nEditing = nRow;
                nEditingId = nRowEditId;
                editRow(oTable, nRow);

            }
        });

        /* Editing this row and want to save it */
        table.on('click', '.save', function (e) {
            e.preventDefault();
            $(nEditing).find('.duplicate_error').remove();
            if ($('.help-block').length <= 0) {
                var send_data = {};
                send_data['v_name'] = $(nEditing).find('#v_name').val();
                //console.log($countryList.map(function(item) { if(item.v_name == $(nEditing).find('#i_country_id').val()){ return item.id; } }));
                send_data['i_country_id'] = $.grep($countryList, function (v) {
                    return v.v_name == $(nEditing).find('#i_country_id').val();
                });
                send_data['id'] = nEditingId;
                if (send_data['v_name'] != '' && send_data['i_country_id'][0] != undefined) {
                    send_data['i_country_id'] = send_data['i_country_id'][0].id;
                    $.post(SITE_URL + 'locations/Province/edit', send_data, function (data) {
                        if (data.status == 'TRUE') {
                            $('#edit_msg').fadeIn(1000);
                            setTimeout(function () {
                                $('#edit_msg').fadeOut(3000);
                            }, 4000);
                            saveRow(oTable, nEditing);
                            nEditing = null;
                        } else {
                            $(data).each(function (i, val) {
                                $.each(val, function (key, v) {
                                    $(nEditing).find('#' + key).after('<div id="' + key + '_error" style="color:#a94442" class="help-block help-block-error duplicate_error">' + v + '</div>');
                                    $(nEditing).find('.duplicate_error').show();
                                });
                            });
                        }
                    });
                }
            }
        });
        $('#add_location').click(function () {
            $('#LocationModal').modal('show');
            $('#LocationModal #id').val("");
        });
        $("#ProvinceAdd").submit(function ()
        {
            var form = $("#ProvinceAdd");
            $("#ProvinceAdd .duplicate_error").hide();
            if (form_valid("#ProvinceAdd"))
            {
                $.post($("#ProvinceAdd").attr("action"), $("#ProvinceAdd").serialize(), function (data) {
                    if ($.trim(data.status) == 'TRUE') {
                        $('.alert-danger').hide();
                        form.find('.duplicate_error').hide();
                        $('#ProvinceAdd')[0].reset();
                        $('#LocationModal').modal('hide');
                        var rowIndex = $(oTable).dataTable().fnAddData([data.v_name, data.i_country_id, '<a href="javascript:;" class="btn default btn-xs edit" rel="' + data.id + '"><i class="fa fa-edit"></i> Edit</a><a href="javascript:;" class="btn btn-xs default delete" rel="' + data.id + '"><i class="fa fa-close"></i> Delete</a>']);
                        oTable.fnDraw();
                        var row = $(oTable).dataTable().fnGetNodes(rowIndex);
                        $(row).attr('id', data.id);
                        $('#add_msg').fadeIn(1000);
                        setTimeout(function () {
                            $('#add_msg').fadeOut(3000);
                        }, 4000);
                    } else {
                        form.find('.alert-success').hide();
                        form.find('.alert-danger').show();
                        $(data).each(function (i, val) {
                            $.each(val, function (key, v) {
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
            }
            return false;
        });

        $('#ProvinceCancel').click(function (e) {
            $('#ProvinceAdd .form-group').removeClass('has-error');
            $('#ProvinceAdd .help-block').remove();
            $('#ProvinceAdd').find('.duplicate-error').hide();
            $('#ProvinceAdd')[0].reset();
        });
    }

    var handleAreaTable = function () {

        function strip(html) {
            var tmp = document.createElement("DIV");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || "";
        }

        function restoreRow(oTable, nRow) {
            var aData = oTable.fnGetData(nRow);
            var jqTds = $('>td', nRow);

            for (var i = 0, iLen = jqTds.length; i < iLen; i++) {
                oTable.fnUpdate(aData[i], nRow, i, false);
            }
            //oTable.fnDraw();
        }

        function editRow(oTable, nRow) {
            var countryListSelect = '<select id="i_country_id" name="i_country_id" class="form-control required select_country" placeholder="Country">\
                <option value=""> Select Country </option>';
            $.each($countryList, function (index, value) {
                countryListSelect += '<option value="' + value.v_name + '">' + value.v_name + '</option>';
            });
            countryListSelect += '</select>';

            var provinceListSelect = '<select id="i_province_id" name="i_province_id" class="form-control required select_province" placeholder="Prevince">\
                <option value=""> Select Province </option>';
            $.each($provinceList, function (index, value) {
                provinceListSelect += '<option value="' + value.v_name + '">' + value.v_name + '</option>';
            });
            provinceListSelect += '</select>';
            var aData = oTable.fnGetData(nRow);
            var jqTds = $('>td', nRow);

            jqTds[0].innerHTML = '<input id="v_name" type="text" class="form-control required" placeholder="Name" value="' + aData[0] + '">';
            jqTds[1].innerHTML = provinceListSelect;
            jqTds[2].innerHTML = countryListSelect;
            jqTds[3].innerHTML = '<a href="javascript:;" class="btn btn-xs green-haze save"><i class="fa fa-check"></i> Save</a><a href="javascript:;" class="btn btn-xs default cancel"><i class="fa fa-close"></i> Cancel</a>';
            $('#i_country_id, #i_province_id').select({
                placeholder: "Select",
                allowClear: true
            });
            $('#i_country_id').val($.trim(strip(aData[2])));
            $('.select_country').trigger('change');
            $('#i_province_id').val($.trim(strip(aData[1])));

            //$('#i_country_id').select('val', $.trim(strip(aData[1])) );                        
        }


        function saveRow(oTable, nRow) {
            var jqInputs = $('input,select', nRow);
            oTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
            oTable.fnUpdate(jqInputs[1].value, nRow, 1, false);
            oTable.fnUpdate(jqInputs[2].value, nRow, 2, false);
            oTable.fnUpdate('<a href="javascript:;" class="btn default btn-xs edit" rel="' + nEditingId + '"><i class="fa fa-edit"></i> Edit </a><a href="javascript:;" class="btn btn-xs default delete" rel="' + nEditingId + '"><i class="fa fa-close"></i> Delete</a>', nRow, 1, false);
            oTable.fnDraw();
        }

        var table = $('.sample_editable_4');

        var oTable = table.dataTable({

            "lengthMenu": [
                [5, 15, 20, -1],
                [5, 15, 20, "All"] // change per page values here
            ],
            // set the initial value
            "pageLength": false,
            "bPaginate": false,
            "bFilter": false,
            "bInfo": false,
            "bRetrieve": true,
            "language": {
                "lengthMenu": " _MENU_ records"
            },
            "columnDefs": [{// set default column settings
                    'orderable': false,
                    'targets': [0]
                }, {
                    'bSortable': false,
                    'aTargets': [-1, -2, -3]
                }
            ],
            "order": [] // set first column as a default sort by asc
        });

        var tableWrapper = $("#datatable_country_wrapper");

        var nEditing = null;
        var nEditingId = null;

        table.on('click', '.delete', function (e) {
            e.preventDefault();
            var nRow = $(this).parents('tr')[0];
            var id = $(this).attr('rel');
            bootbox.confirm("Are you sure that you want to delete this record?", function (confirmed) {
                if (confirmed) {
                    $.post(SITE_URL + 'locations/Area/delete/' + id, function (data) {
                        if (data.status == 'TRUE') {
                            oTable.fnDeleteRow(nRow);
                            $('#delete_msg').fadeIn(1000);
                            setTimeout(function () {
                                $('#delete_msg').fadeOut(3000);
                            }, 4000);
                        }
                    });
                }
            });
        });

        table.on('change', '.select_country', function (e) {
            var country_name = $(this).val();
            var provinceDropdown = '<option value=""> Select Province </option>';
            if (country_name != '') {
                var country_id = $.grep($countryList, function (v) {
                    return v.v_name == country_name;
                })[0].id;

                $provinceNewList = $.grep($provinceList, function (v) {
                    return v.i_country_id == country_id;
                });

                $.each($provinceNewList, function (index, value) {
                    provinceDropdown += '<option value="' + value.v_name + '">' + value.v_name + ' </option>';
                });

                $('.select_province').html('');
                $('.select_province').append(provinceDropdown);
                $('.select_province').removeAttr('disabled');
            } else {
                $('.select_province').html('');
                $('.select_province').append(provinceDropdown);
                $('.select_province').attr('disabled', 'disabled');
            }
        });

        table.on('click', '.cancel', function (e) {
            bootbox.confirm('Updated information will discarded. Are you sure you want to continue?', function (confirmed) {
                if (confirmed) {
                    e.preventDefault();
                    restoreRow(oTable, nEditing);
                    nEditing = null;
                    nEditingId = null;

                }
            });
        });

        table.on('click', '.edit', function (e) {
            e.preventDefault();
            /* Get the row as a parent of the link that was clicked on */
            var nRow = $(this).parents('tr')[0];
            var nRowEditId = $(this).attr('rel');
            if (nEditing !== null && nEditingId != nRowEditId) {
                /* Currently editing - but not this row - restore the old before continuing to edit mode */
                restoreRow(oTable, nEditing);
                nEditing = nRow;
                nEditingId = nRowEditId;
                editRow(oTable, nRow);

            } else {
                /* No edit in progress - let's start one */
                nEditing = nRow;
                nEditingId = nRowEditId;
                editRow(oTable, nRow);

            }
        });

        /* Editing this row and want to save it */
        table.on('click', '.save', function (e) {
            e.preventDefault();
            $(nEditing).find('.duplicate_error').remove();
            if ($('.help-block').length <= 0) {
                var send_data = {};
                send_data['v_name'] = $(nEditing).find('#v_name').val();
                //console.log($countryList.map(function(item) { if(item.v_name == $(nEditing).find('#i_country_id').val()){ return item.id; } }));
                send_data['i_province_id'] = $.grep($provinceList, function (v) {
                    return v.v_name == $(nEditing).find('#i_province_id').val();
                });
                send_data['i_country_id'] = $.grep($countryList, function (v) {
                    return v.v_name == $(nEditing).find('#i_country_id').val();
                });
                send_data['id'] = nEditingId;
                if (send_data['v_name'] != '' && send_data['i_province_id'][0] != undefined && send_data['i_country_id'][0] != undefined) {
                    send_data['i_province_id'] = send_data['i_province_id'][0].id;
                    send_data['i_country_id'] = send_data['i_country_id'][0].id;
                    $.post(SITE_URL + 'locations/Area/edit', send_data, function (data) {
                        if (data.status == 'TRUE') {
                            $('#edit_msg').fadeIn(1000);
                            setTimeout(function () {
                                $('#edit_msg').fadeOut(3000);
                            }, 4000);
                            saveRow(oTable, nEditing);
                            nEditing = null;
                        } else {
                            $(data).each(function (i, val) {
                                $.each(val, function (key, v) {
                                    $(nEditing).find('#' + key).after('<div id="' + key + '_error" style="color:#a94442" class="help-block help-block-error duplicate_error">' + v + '</div>');
                                    $(nEditing).find('.duplicate_error').show();
                                });
                            });
                        }
                    });
                }
            }
        });
        $('#add_location').click(function () {
            $('#LocationModal').modal('show');
            $('#LocationModal #id').val("");
        });
        $("#AreaAdd").submit(function ()
        {
            var form = $("#AreaAdd");
            $("#AreaAdd .duplicate_error").hide();
            if (form_valid("#AreaAdd"))
            {
                $.post($("#AreaAdd").attr("action"), $("#AreaAdd").serialize(), function (data) {
                    if ($.trim(data.status) == 'TRUE') {
                        $('.alert-danger').hide();
                        form.find('.duplicate_error').hide();
                        $('#AreaAdd')[0].reset();
                        $('#LocationModal').modal('hide');
                        var rowIndex = $(oTable).dataTable().fnAddData([data.v_name, data.i_province_id, data.i_country_id, '<a href="javascript:;" class="btn default btn-xs edit" rel="' + data.id + '"><i class="fa fa-edit"></i> Edit</a><a href="javascript:;" class="btn btn-xs default delete" rel="' + data.id + '"><i class="fa fa-close"></i> Delete</a>']);
                        oTable.fnDraw();
                        var row = $(oTable).dataTable().fnGetNodes(rowIndex);
                        $(row).attr('id', data.id);
                        $('#add_msg').fadeIn(1000);
                        setTimeout(function () {
                            $('#add_msg').fadeOut(3000);
                        }, 4000);
                    } else {
                        form.find('.alert-success').hide();
                        form.find('.alert-danger').show();
                        $(data).each(function (i, val) {
                            $.each(val, function (key, v) {
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
            }
            return false;
        });

        $('#LocationCancel').click(function (e) {
            $('#AreaAdd .form-group').removeClass('has-error');
            $('#AreaAdd .help-block').remove();
            $('#AreaAdd').find('.duplicate-error').hide();
            $('#AreaAdd')[0].reset();
        });
    }


    var handleRateTypeMappingTable = function () {

        function strip(html) {
            var tmp = document.createElement("DIV");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || "";
        }

        function restoreRow(oTable, nRow) {
            var aData = oTable.fnGetData(nRow);
            var jqTds = $('>td', nRow);

            for (var i = 0, iLen = jqTds.length; i < iLen; i++) {
                oTable.fnUpdate(aData[i], nRow, i, false);
            }
            //oTable.fnDraw();
        }

        var table = $('.sample_editable_8');

        var oTable = table.dataTable({

            "lengthMenu": [
                [5, 15, 20, -1],
                [5, 15, 20, "All"] // change per page values here
            ],
            // set the initial value
            "pageLength": false,
            "bPaginate": false,
            "bFilter": false,
            "bInfo": false,
            "bRetrieve": true,
            "language": {
                "lengthMenu": " _MENU_ records"
            },
            "columnDefs": [{// set default column settings
                    'orderable': false,
                    'targets': [0]
                }, {
                    'bSortable': false,
                    'aTargets': [-1, -2, -3]
                }
            ],
            "order": [] // set first column as a default sort by asc
        });

        var tableWrapper = $("#datatable_country_wrapper");

        var nEditing = null;
        var nEditingId = null;

        table.on('click', '.delete', function (e) {
            e.preventDefault();
            var nRow = $(this).parents('tr')[0];
            var id = $(this).attr('rel');
            bootbox.confirm("Are you sure that you want to delete this record?", function (confirmed) {
                if (confirmed) {
                    $.post(SITE_URL + 'rate-type-mapping/delete/' + id, function (data) {
                        if (data.status == 'TRUE') {
                            oTable.fnDeleteRow(nRow);
                            $('#delete_msg').fadeIn(1000);
                            setTimeout(function () {
                                $('#delete_msg').fadeOut(3000);
                            }, 4000);
                        }
                    });
                }
            });
        });

        table.on('click', '.edit', function (e) {
            e.preventDefault();
            /* Get the row as a parent of the link that was clicked on */
            var nRow = $(this).parents('tr')[0];
            var nRowEditId = $(this).attr('rel');
            var nRowListId = $(this).attr('data-type');
            $.get(SITE_URL + 'rate-type-mapping/edit/' + nRowEditId, function (data) {
                if (data.status == 'TRUE') {
                    records = data.items;
                    $('#RateTypeMappingModal').modal('show');
                    $('#RateTypeMappingModal .modal-title').html('Edit Rate');
                    $('#RateTypeMappingModal #RateTypeMappingCancel').hide();
                    $('#RateTypeMappingModal #RateTypeMappingCancel').trigger('click');
                    $('#RateTypeMappingModal #id').val(records.id);
                    $('#RateTypeMappingModal #v_rate_code').val(records.v_rate_code);
                    $('#RateTypeMappingModal #i_markup').val(records.i_markup);
                    $('#RateTypeMappingModal #i_default').val(records.i_default);
                    if(records.v_room_information_ids != null)
                        $('#RateTypeMappingAdd #v_room_information_ids').val(records.v_room_information_ids.split(","));
                    $('#RateTypeMappingModal #i_special_type_id').val(records.i_special_type_id);
                    $('#RateTypeMappingModal #i_user_id').val(records.i_user_id);
                    $.uniform.update();
                }
            });
        });

        $('#add_rate_type_mapping').click(function () {
            $('#RateTypeMappingModal').modal('show');
            $('#RateTypeMappingModal #id').val("");
            $('#RateTypeMappingModal .modal-title').html('Add Rate');
            $('#RateTypeMappingModal #RateTypeMappingCancel').show();
            $('#RateTypeMappingModal #RateTypeMappingCancel').trigger('click');
        });
        $("#RateTypeMappingAdd").submit(function ()
        {
            var form = $("#RateTypeMappingAdd");
            $("#RateTypeMappingAdd .duplicate_error").hide();
            if (form_valid("#RateTypeMappingAdd"))
            {
                $.post($("#RateTypeMappingAdd").attr("action"), $("#RateTypeMappingAdd").serialize(), function (data) {
                    if ($.trim(data.status) == 'TRUE') {
                        $('.alert-danger').hide();
                        form.find('.duplicate_error').hide();
                        $('#RateTypeMappingAdd')[0].reset();
                        $('#RateTypeMappingModal').modal('hide');
                        var rowIndex = $(oTable).dataTable().fnAddData([data.v_rate_code, data.i_markup, data.i_default, data.i_special_type_id, data.i_user_id, '<a href="javascript:;" class="btn default btn-xs edit" rel="' + data.id + '"><i class="fa fa-edit"></i> Edit</a><a href="javascript:;" class="btn btn-xs default delete" rel="' + data.id + '"><i class="fa fa-close"></i> Delete</a>']);
                        oTable.fnDraw();
                        var row = $(oTable).dataTable().fnGetNodes(rowIndex);
                        $(row).attr('id', data.id);
                        $('#add_msg').fadeIn(1000);
                        setTimeout(function () {
                            $('#add_msg').fadeOut(3000);
                        }, 4000);
                    } else {
                        form.find('.alert-success').hide();
                        form.find('.alert-danger').show();
                        $(data).each(function (i, val) {
                            $.each(val, function (key, v) {
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
            }
            return false;
        });

        $('#RateTypeMappingCancel').click(function (e) {
            $('#RateTypeMappingAdd .form-group').removeClass('has-error');
            $('#RateTypeMappingAdd .help-block').remove();
            $('#RateTypeMappingAdd').find('.duplicate-error').hide();
            $('#RateTypeMappingAdd')[0].reset();
            $('#RateTypeMappingAdd input[type=checkbox]').attr('checked',false);
            $('#RateTypeMappingAdd input[type=checkbox]').parent().removeClass('checked');
            $.uniform.update();
        });
    }


    var handleSpecialTypeTable = function () {

        function strip(html) {
            var tmp = document.createElement("DIV");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || "";
        }

        function restoreRow(oTable, nRow) {
            var aData = oTable.fnGetData(nRow);
            var jqTds = $('>td', nRow);

            for (var i = 0, iLen = jqTds.length; i < iLen; i++) {
                oTable.fnUpdate(aData[i], nRow, i, false);
            }
            //oTable.fnDraw();
        }

        function editRow(oTable, nRow) {
            var aData = oTable.fnGetData(nRow);
            var jqTds = $('>td', nRow);
            jqTds[0].innerHTML = '<textarea id="t_description" class="form-control required text_area" placeholder="Name">' + aData[0] + '</textarea>';
            jqTds[1].innerHTML = '<textarea id="t_terms_condition" class="form-control required text_area" placeholder="Terms & Condition">' + aData[1] + '</textarea>';
            jqTds[2].innerHTML = '<a href="javascript:;" class="btn btn-xs green-haze save"><i class="fa fa-check"></i> Save</a><a href="javascript:;" class="btn btn-xs default cancel"><i class="fa fa-close"></i> Cancel</a>';
        }

        function saveRow(oTable, nRow) {
            var jqInputs = $('input,textarea', nRow);
            oTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
            oTable.fnUpdate(jqInputs[1].value, nRow, 1, false);
            oTable.fnUpdate('<a href="javascript:;" class="btn default btn-xs edit" rel="' + nEditingId + '"><i class="fa fa-edit"></i> Edit </a><a href="javascript:;" class="btn btn-xs default delete" rel="' + nEditingId + '"><i class="fa fa-close"></i> Delete</a>', nRow, 1, false);
            oTable.fnDraw();
        }

        var table = $('.sample_editable_5');

        var oTable = table.dataTable({

            "lengthMenu": [
                [5, 15, 20, -1],
                [5, 15, 20, "All"] // change per page values here
            ],
            // set the initial value
            "pageLength": false,
            "bPaginate": false,
            "bFilter": false,
            "bInfo": false,
            "bRetrieve": true,
            "language": {
                "lengthMenu": " _MENU_ records"
            },
            "columnDefs": [{// set default column settings
                    'orderable': false,
                    'targets': [0]
                }, {
                    'bSortable': false,
                    'aTargets': [-1, -2, -3]
                }
            ],
            "order": [] // set first column as a default sort by asc
        });

        var tableWrapper = $("#datatable_country_wrapper");

        var nEditing = null;
        var nEditingId = null;

        table.on('click', '.delete', function (e) {
            e.preventDefault();
            var nRow = $(this).parents('tr')[0];
            var id = $(this).attr('rel');
            bootbox.confirm("Are you sure that you want to delete this record?", function (confirmed) {
                if (confirmed) {
                    $.post(SITE_URL + 'special-type/delete/' + id, function (data) {
                        if (data.status == 'TRUE') {
                            oTable.fnDeleteRow(nRow);
                            $('#delete_msg').fadeIn(1000);
                            setTimeout(function () {
                                $('#delete_msg').fadeOut(3000);
                            }, 4000);
                        }
                    });
                }
            });
        });

        table.on('click', '.cancel', function (e) {
            bootbox.confirm('Updated information will discarded. Are you sure you want to continue?', function (confirmed) {
                if (confirmed) {
                    e.preventDefault();
                    restoreRow(oTable, nEditing);
                    nEditing = null;
                    nEditingId = null;

                }
            });
        });

        table.on('click', '.edit', function (e) {
            e.preventDefault();
            /* Get the row as a parent of the link that was clicked on */
            var nRow = $(this).parents('tr')[0];
            var nRowEditId = $(this).attr('rel');
            if (nEditing !== null && nEditingId != nRowEditId) {
                /* Currently editing - but not this row - restore the old before continuing to edit mode */
                restoreRow(oTable, nEditing);
                nEditing = nRow;
                nEditingId = nRowEditId;
                editRow(oTable, nRow);

            } else {
                /* No edit in progress - let's start one */
                nEditing = nRow;
                nEditingId = nRowEditId;
                editRow(oTable, nRow);

            }
        });

        /* Editing this row and want to save it */
        table.on('click', '.save', function (e) {
            e.preventDefault();
            $(nEditing).find('.duplicate_error').remove();
            if ($('.help-block').length <= 0) {
                var send_data = {};
                send_data['t_description'] = $(nEditing).find('#t_description').val();
                send_data['t_terms_condition'] = $(nEditing).find('#t_terms_condition').val();
                send_data['id'] = nEditingId;
                if (send_data['t_description'] != '' && send_data['t_terms_condition'] != '') {
                    $.post(SITE_URL + 'special-type/edit', send_data, function (data) {
                        if (data.status == 'TRUE') {
                            $('#edit_msg').fadeIn(1000);
                            setTimeout(function () {
                                $('#edit_msg').fadeOut(3000);
                            }, 4000);
                            saveRow(oTable, nEditing);
                            nEditing = null;
                        } else {
                            $(data).each(function (i, val) {
                                $.each(val, function (key, v) {
                                    $(nEditing).find('#' + key).after('<div id="' + key + '_error" style="color:#a94442" class="help-block help-block-error duplicate_error">' + v + '</div>');
                                    $(nEditing).find('.duplicate_error').show();
                                });
                            });
                        }
                    });
                }
            }
        });
        $('#add_special_type').click(function () {
            $('#SpecialTypeModal').modal('show');
            $('#SpecialTypeModal #id').val("");
        });
        $("#SpecialTypeAdd").submit(function ()
        {
            var form = $("#SpecialTypeAdd");
            $("#SpecialTypeAdd .duplicate_error").hide();
            if (form_valid("#SpecialTypeAdd"))
            {
                $.post($("#SpecialTypeAdd").attr("action"), $("#SpecialTypeAdd").serialize(), function (data) {
                    if ($.trim(data.status) == 'TRUE') {
                        $('.alert-danger').hide();
                        form.find('.duplicate_error').hide();
                        $('#SpecialTypeAdd')[0].reset();
                        $('#SpecialTypeModal').modal('hide');
                        var rowIndex = $(oTable).dataTable().fnAddData([data.t_description, data.t_terms_condition, '<a href="javascript:;" class="btn default btn-xs edit" rel="' + data.id + '"><i class="fa fa-edit"></i> Edit</a><a href="javascript:;" class="btn btn-xs default delete" rel="' + data.id + '"><i class="fa fa-close"></i> Delete</a>']);
                        oTable.fnDraw();
                        var row = $(oTable).dataTable().fnGetNodes(rowIndex);
                        $(row).attr('id', data.id);
                        $('#add_msg').fadeIn(1000);
                        setTimeout(function () {
                            $('#add_msg').fadeOut(3000);
                        }, 4000);
                    } else {
                        form.find('.alert-success').hide();
                        form.find('.alert-danger').show();
                        $(data).each(function (i, val) {
                            $.each(val, function (key, v) {
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
            }
            return false;
        });

        $('#SpecialTypeCancel').click(function (e) {
            $('#SpecialTypeAdd .form-group').removeClass('has-error');
            $('#SpecialTypeAdd .help-block').remove();
            $('#SpecialTypeAdd').find('.duplicate-error').hide();
            $('#SpecialTypeAdd')[0].reset();
        });
    }

    var handleListingRoomTable = function () {

        function strip(html) {
            var tmp = document.createElement("DIV");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || "";
        }

       /* function restoreRow(oTable, nRow) {
            var aData = oTable.fnGetData(nRow);
            var jqTds = $('>td', nRow);

            for (var i = 0, iLen = jqTds.length; i < iLen; i++) {
                oTable.fnUpdate(aData[i], nRow, i, false);
            }
            //oTable.fnDraw();
        }*/

        /*function editRow(oTable, nRow) {
            var aData = oTable.fnGetData(nRow);
            var jqTds = $('>td', nRow);
            jqTds[0].innerHTML = '<input id="v_room_name" type="text" class="form-control required" placeholder="Name" value="' + aData[0] + '">';
            jqTds[1].innerHTML = '<input id="i_max_occupancy" type="text" class="form-control" placeholder="Max Occupancy" value="' + $.trim(strip(aData[1])) + '">';
            jqTds[2].innerHTML = '<input id="i_max_adult_occupancy" type="text" class="form-control" placeholder="Max Adult Occupancy" value="' + $.trim(strip(aData[2])) + '">';
            jqTds[3].innerHTML = '<input id="i_max_child_occupancy" type="text" class="form-control" placeholder="Max Child Occupancy" value="' + $.trim(strip(aData[3])) + '">';
            jqTds[4].innerHTML = '<input id="i_child_age_min" type="text" class="form-control" placeholder="Child Age Min" value="' + $.trim(strip(aData[4])) + '">';
            jqTds[5].innerHTML = '<input id="i_child_age_max" type="text" class="form-control" placeholder="Child Age Max" value="' + $.trim(strip(aData[5])) + '">';
            jqTds[6].innerHTML = '<input id="i_markup" type="text" class="form-control" placeholder="Makup" value="' + $.trim(strip(aData[6])) + '">';
            jqTds[7].innerHTML = '<input id="v_code" type="text" class="form-control" placeholder="Room Code" value="' + $.trim(strip(aData[7])) + '">';
            jqTds[8].innerHTML = '<textarea id="t_description" type="text" class="form-control" placeholder="Description" value="' + $.trim(strip(aData[8])) + '">' + $.trim(strip(aData[8])) + '</textarea>';
            jqTds[9].innerHTML = '<a href="javascript:;" class="btn btn-xs green-haze save"><i class="fa fa-check"></i></a><a href="javascript:;" class="btn btn-xs default cancel"><i class="fa fa-close" ></i></a>';
        }*/

        /*function saveRow(oTable, nRow) {
            var jqInputs = $('input,textarea', nRow);
            for (var i = 0, iLen = jqInputs.length; i < iLen; i++) {
                oTable.fnUpdate(jqInputs[i].value, nRow, i, false);
            }
            oTable.fnUpdate('<a href="javascript:;" class="btn default btn-xs edit" rel="' + nEditingId + '" data-type="' + nEditingListId + '"><i class="fa fa-edit"></i></a><a href="javascript:;" class="btn btn-xs default delete" rel="' + nEditingId + '" data-type="' + nEditingListId + '"><i class="fa fa-close"></i></a>', nRow, 9, false);
            oTable.fnDraw();
        }*/

        var table = $('.sample_editable_6');

        var oTable = table.dataTable({

            "lengthMenu": [
                [5, 15, 20, -1],
                [5, 15, 20, "All"] // change per page values here
            ],
            // set the initial value
            "pageLength": false,
            "bPaginate": false,
            "bFilter": false,
            "bInfo": false,
            "bRetrieve": true,
            "language": {
                "lengthMenu": " _MENU_ records"
            },
            "columnDefs": [{// set default column settings
                    'orderable': false,
                    'targets': [0]
                }, {
                    'bSortable': false,
                    'aTargets': [-1, -2, -3]
                }
            ],
            "order": [] // set first column as a default sort by asc
        });

        var tableWrapper = $("#datatable_country_wrapper");

        var nEditing = null;
        var nEditingId = null;
        var nEditingListId = null;

        table.on('click', '.delete', function (e) {
            e.preventDefault();
            var nRow = $(this).parents('tr')[0];
            var id = $(this).attr('rel');
            bootbox.confirm("Are you sure that you want to delete this record?", function (confirmed) {
                if (confirmed) {
                    $.post(SITE_URL + 'listings/room-delete/' + id, function (data) {
                        if (data.status == 'TRUE') {
                            oTable.fnDeleteRow(nRow);
                            $('#delete_msg').fadeIn(1000);
                            setTimeout(function () {
                                $('#delete_msg').fadeOut(3000);
                            }, 4000);
                        }
                    });
                }
            });
        });

        table.on('click', '.edit', function (e) {
            e.preventDefault();
            /* Get the row as a parent of the link that was clicked on */
            var nRow = $(this).parents('tr')[0];
            var nRowEditId = $(this).attr('rel');
            $.get(SITE_URL + 'listings/room-edit/' + nRowEditId, function (data) {
                if (data.status == 'TRUE') {
                    records = data.items;
                    $('#RoomModal').modal('show');
                    $('#RoomModal .modal-title').html('Edit Room');
                    $('#RoomModal #RoomCancel').hide();
                    $('#RoomModal .tab_room_images').show();
                    $('#RoomModal #RoomCancel').trigger('click');
                    $('#RoomModal #id').val(records.id);
                    $('#RoomModal #v_room_name').val(records.v_room_name);
                    $('#RoomModal #i_room_area').val(records.i_room_area);
                    /*if(records.v_bed_types != null)
                        $('#RoomModal #v_bed_types').val(records.v_bed_types.split(","));*/
                    $('#RoomModal #i_bed_type_id').val(records.i_bed_type_id);
                    $('#RoomModal #i_max_occupancy').val(records.i_max_occupancy);
                    $('#RoomModal #i_max_adult_occupancy').val(records.i_max_adult_occupancy);
                    $('#RoomModal #i_max_child_occupancy').val(records.i_max_child_occupancy);
                    $('#RoomModal #i_child_age_min').val(records.i_child_age_min);
                    $('#RoomModal #i_child_age_max').val(records.i_child_age_max);
                    $('#RoomModal #i_markup').val(records.i_markup);
                    $('#RoomModal #v_code').val(records.v_code);
                    $('#RoomModal #i_room_feature_id').val(records.i_room_feature_id);
                    $('#RoomModal #t_description').val(records.t_description);
                    $('#RoomModal #t_description').html(records.t_description);
                    $("#room_image_add").html('');
                    if(records.listing_room_image != ''){
                        var attach = '';
                        $.each(records.listing_room_image, function (key, v) {
                            attach += '<li class="li_pro" id="roomImage' + v.id + '" rel="'+v.id+'" room-image-order="'+v.i_image_order+'"><div class="li-wrap" id="roomLabel_' + v.id + '"><div class="li-skin"><div class="li-outer"><a data-fancybox-type="image" class="fancybox1 fancybox.image" rel="' + v.id + '" href="' +  DEFAULT_IMG_SERVER + '?id=' + v.id + '&type=origional&file=room"><div class="li-inner"><img src="' +  DEFAULT_IMG_SERVER + '?id=' + v.id + '&type=latest&file=room" class="" /></div></a></div><a class="li-close" href="javascript:;" rel="' + v.id + '" title="Close" onClick="remove_listing_room_image(' + v.id + ')"></a></div></div><span class="span_pro">'+v.i_image_order+'</span></li>';
                            
                        });
                        $("#room_image_add").append(attach);
                        
                    }
                    $.uniform.update();
                }
            });
        });

      
       /* table.on('click', '.cancel', function (e) {
            bootbox.confirm('Updated information will discarded. Are you sure you want to continue?', function (confirmed) {
                if (confirmed) {
                    e.preventDefault();
                    restoreRow(oTable, nEditing);
                    nEditing = null;
                    nEditingId = null;
                    nEditingListId = null;

                }
            });
        });*/

        /*table.on('click', '.edit', function (e) {
            e.preventDefault();
            // Get the row as a parent of the link that was clicked on 
            var nRow = $(this).parents('tr')[0];
            var nRowEditId = $(this).attr('rel');
            var nRowListId = $(this).attr('data-type');
            if (nEditing !== null && nEditingId != nRowEditId) {
                 Currently editing - but not this row - restore the old before continuing to edit mode 
                restoreRow(oTable, nEditing);
                nEditing = nRow;
                nEditingId = nRowEditId;
                nEditingListId = nRowListId;
                editRow(oTable, nRow);

            } else {
                // No edit in progress - let's start one 
                nEditing = nRow;
                nEditingId = nRowEditId;
                nEditingListId = nRowListId;
                editRow(oTable, nRow);

            }
        });*/

        /* Editing this row and want to save it */
        /*table.on('click', '.save', function (e) {
            e.preventDefault();
            $(nEditing).find('.duplicate_error').remove();
            if ($('.help-block').length <= 0) {
                var send_data = {};
                send_data['i_listing_id'] = nEditingListId;
                send_data['v_room_name'] = $(nEditing).find('#v_room_name').val();
                send_data['i_max_occupancy'] = $(nEditing).find('#i_max_occupancy').val();
                send_data['i_max_adult_occupancy'] = $(nEditing).find('#i_max_adult_occupancy').val();
                send_data['i_max_child_occupancy'] = $(nEditing).find('#i_max_child_occupancy').val();
                send_data['i_child_age_min'] = $(nEditing).find('#i_child_age_min').val();
                send_data['i_child_age_max'] = $(nEditing).find('#i_child_age_max').val();
                send_data['i_markup'] = $(nEditing).find('#i_markup').val();
                send_data['v_code'] = $(nEditing).find('#v_code').val();
                send_data['t_description'] = $(nEditing).find('#t_description').val();
                send_data['id'] = nEditingId;
                if (send_data['v_room_name'] != '') {
                    $.post(SITE_URL + 'listings/room-edit', send_data, function (data) {
                        if (data.status == 'TRUE') {
                            $('#edit_msg').fadeIn(1000);
                            setTimeout(function () {
                                $('#edit_msg').fadeOut(3000);
                            }, 4000);
                            saveRow(oTable, nEditing);
                            nEditing = null;

                        } else {
                            $(data).each(function (i, val) {
                                $.each(val, function (key, v) {
                                    $(nEditing).find('#' + key).after('<div id="' + key + '_error" style="color:#a94442" class="help-block help-block-error duplicate_error">' + v + '</div>');
                                    $(nEditing).find('.duplicate_error').show();
                                });
                            });
                        }
                    });
                }
            }
        });*/
        $('#add_room').click(function () {
            $('#RoomModal').modal('show');
            $('#RoomModal #id').val("");
            $('#RoomModal .modal-title').html('Add Room');
            $('#RoomModal .tab_room_images').hide();
            $('#RoomModal .tabbable > ul > li').removeClass('active');
            $('#RoomModal .tab_room_basic_info').addClass('active');
            $('#RoomModal .tab-pane').removeClass('active');
            $('#RoomModal #tab_room_basic_info').addClass('active');
            $('#RoomModal #RoomCancel').show();
            $('#RoomModal #RoomCancel').trigger('click');
           
        });
        $("#RoomAdd").submit(function ()
        {
            var form = $("#RoomAdd");
            $("#RoomAdd .duplicate_error").hide();
            if (form_valid("#RoomAdd"))
            {
                $.post($("#RoomAdd").attr("action"), $("#RoomAdd").serialize(), function (data) {
                    if ($.trim(data.status) == 'TRUE') {
                        $('.alert-danger').hide();
                        form.find('.duplicate_error').hide();
                        $('#RoomAdd')[0].reset();
                        $('#RoomModal').modal('hide');
                        oTable.fnDraw();
                        /*var rowIndex = $(oTable).dataTable().fnAddData([data.v_room_name, data.i_max_occupancy, data.i_max_adult_occupancy, data.i_max_child_occupancy, data.i_child_age_min, data.i_child_age_max, data.i_markup, data.v_code, data.t_description, '<a href="javascript:;" class="btn default btn-xs edit" rel="' + data.id + '" data-type="' + data.i_listing_id + '"><i class="fa fa-edit"></i></a><a href="javascript:;" class="btn btn-xs default delete" rel="' + data.id + '" data-type="' + data.i_listing_id + '"><i class="fa fa-close"></i></a>']);
                        var row = $(oTable).dataTable().fnGetNodes(rowIndex);
                        $(row).attr('id', data.id);*/
                        $('#add_msg').fadeIn(1000);
                        setTimeout(function () {
                            $('#add_msg').fadeOut(3000);
                        }, 4000);
                    } else {
                        form.find('.alert-success').hide();
                        form.find('.alert-danger').show();
                        $(data).each(function (i, val) {
                            $.each(val, function (key, v) {
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
            }
            return false;
        });

        $('#RoomCancel').click(function (e) {
            $('#RoomAdd .form-group').removeClass('has-error');
            $('#RoomAdd .help-block').remove();
            $('#RoomAdd').find('.duplicate-error').hide();
            $('#RoomAdd')[0].reset();
            $('#RoomAdd #t_description').html('');
            $("#room_image_add").html('');
            $('#RoomAdd input[type=checkbox]').attr('checked',false);
            $('#RoomAdd input[type=checkbox]').parent().removeClass('checked');
            $.uniform.update();
        });
       /* table.on('click', '#room-availability', function (e) {
            Calendar.init();
            $('#RoomAvailabilityModal').modal('show');
        });*/

    }

    var handleListingRateTable = function () {

        function strip(html) {
            var tmp = document.createElement("DIV");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || "";
        }

        var table = $('.sample_editable_7');

        var oTable = table.dataTable({

            "lengthMenu": [
                [5, 15, 20, -1],
                [5, 15, 20, "All"] // change per page values here
            ],
            // set the initial value
            "pageLength": false,
            "bPaginate": false,
            "bFilter": false,
            "bInfo": false,
            "bRetrieve": true,
            "language": {
                "lengthMenu": " _MENU_ records"
            },
            "columnDefs": [{// set default column settings
                    'orderable': false,
                    'targets': [0]
                }, {
                    'bSortable': false,
                    'aTargets': [-1, -2, -3]
                }
            ],
            "order": [] // set first column as a default sort by asc
        });

        var tableWrapper = $("#datatable_country_wrapper");

        var nEditing = null;
        var nEditingId = null;
        var nEditingListId = null;

        table.on('click', '.delete', function (e) {
            e.preventDefault();
            var nRow = $(this).parents('tr')[0];
            var id = $(this).attr('rel');
            bootbox.confirm("Are you sure that you want to delete this record?", function (confirmed) {
                if (confirmed) {
                    $.post(SITE_URL + 'listings/rate-delete/' + id, function (data) {
                        if (data.status == 'TRUE') {
                            oTable.fnDeleteRow(nRow);
                            $('#delete_msg').fadeIn(1000);
                            setTimeout(function () {
                                $('#delete_msg').fadeOut(3000);
                            }, 4000);
                        }
                    });
                }
            });
        });

        table.on('click', '.edit', function (e) {
            e.preventDefault();
            /* Get the row as a parent of the link that was clicked on */
            var nRow = $(this).parents('tr')[0];
            var nRowEditId = $(this).attr('rel');
            $.get(SITE_URL + 'listings/rate-edit/' + nRowEditId, function (data) {
                if (data.status == 'TRUE') {
                    records = data.items;
                    $('#RateModal').modal('show');
                    $('#RateModal .modal-title').html('Edit Rate');
                    $('#RateModal #RateCancel').hide();
                    $('#RateModal #RateCancel').trigger('click');
                    /* $('#RateModal .formRate').attr('id','RateEdit');
                     $('#RateModal .formRate').attr('name','RateEdit');
                     $('#RateModal .formRate').attr('action',SITE_URL+'listings/rate-edit/'+nRowEditId);*/
                    $('#RateModal #id').val(records.id);
                    $('#RateModal #i_room_id').val(records.i_room_id);
                    $('#RateModal #i_listing_id').val(records.i_listing_id);
                    $('#RateModal #i_specialtype_id').val(records.i_specialtype_id);
                    $('#RateModal #e_price_type').val(records.e_price_type);
                    $('#RateModal #i_room_information_id').val(records.i_room_information_id);
                    $('#RateModal .fromdatepicker').datepicker("setDate", records.d_from_date);
                    $('#RateModal .todatepicker').datepicker("setDate", records.d_to_date);
                    $('#RateModal #d_to_date').val(records.d_to_date);
                    $('#RateModal #i_price').val(records.i_price);
                    $('#RateModal #i_rack_rate').val(records.i_rack_rate);
                    $('#RateModal #v_code').val(records.v_code);
                    $('#RateModal #t_rate_description').val(records.t_rate_description);
                    $('#RateModal #t_rate_description').html(records.t_rate_description);
                    $.uniform.update();
                }
            });
        });

        $('#add_room_rate').click(function () {
            $('#RateModal').modal('show');
            $('#RateModal #id').val("");
            $('#RateModal .modal-title').html('Add Rate');
            /*            $('#RateModal .formRate').attr('id','RateAdd');
             $('#RateModal .formRate').attr('name','RateAdd');
             $('#RateModal .formRate').attr('action',SITE_URL+'listings/rate-add');*/
            $('#RateModal #RateCancel').show();
            $('#RateModal #RateCancel').trigger('click');

        });
        $("#RateAdd").submit(function ()
        {
            var form = $("#RateAdd");
            //$("#RateAdd .duplicate_error").hide();
            if (form_valid("#RateAdd"))
            {
                $.post($("#RateAdd").attr("action"), $("#RateAdd").serialize(), function (data) {
                    if ($.trim(data.status) == 'TRUE') {
                        $('.alert-danger').hide();
                        form.find('.duplicate_error').hide();
                        $('#RateAdd')[0].reset();
                        $('#RateModal').modal('hide');
                        oTable.fnDraw();
                        //var row = $(oTable).dataTable().fnGetNodes(rowIndex);
                        //$(row).attr('id', data.id);                        
                        $('#add_msg').fadeIn(1000);
                        setTimeout(function () {
                            $('#add_msg').fadeOut(3000);
                        }, 4000);
                    } else {
                        form.find('.alert-success').hide();
                        form.find('.alert-danger').show();
                        $(data).each(function (i, val) {
                            $.each(val, function (key, v) {
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
            }
            return false;
        });

        $('#RateCancel').click(function (e) {
            $('#RateAdd .form-group').removeClass('has-error');
            $('#RateAdd .help-block').remove();
            $('#RateAdd').find('.duplicate-error').hide();
            $('#RateAdd')[0].reset();
            $('#RateAdd #t_rate_description').html('');
            $.uniform.update();
        });
    }

    return {

        //main function to initiate the module
        init: function (table_id) {
            if (table_id === undefined || table_id == '') {
                handleFeatureTable();
            } else if(table_id == 'sample_editable_2'){
                handleCountryTable();
            } else if(table_id == 'sample_editable_3'){
                handleProvinceTable();
            } else if(table_id == 'sample_editable_4'){
                handleAreaTable();
            } else if (table_id == 'sample_editable_5') {
                handleSpecialTypeTable();
            } else if (table_id == 'sample_editable_6') {
                handleListingRoomTable();
            } else if (table_id == 'sample_editable_7') {
                handleListingRateTable();
            } else if (table_id == 'sample_editable_8') {
                handleRateTypeMappingTable(); 
            } else if (table_id == 'sample_editable_9'){
                handleCouponTable();
            }
        }

    };

}();
