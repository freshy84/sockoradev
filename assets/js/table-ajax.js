var project_array, TableAjax = function (t) {
    var a = function () {
        $(".date-picker").datepicker({
            rtl: Metronic.isRTL(),
            autoclose: !0
        })
    },
    e = function (t, a) {
        "" == a && (a = [0, "asc"]);
        var e = new Datatable,
            n = $("#datatable_ajax");
        var columns = {};

        if (t == SITE_URL + 'orders/list-ajax') {
            columns = {
                columns:
                    [
                        {
                            "className": 'more-details row-details-close',
                            "orderable": false,
                            "data": null,
                            "defaultContent": '<span class="row-details row-details-close"></span>'
                        },
                        { "data": "order_id" },
                        { "data": "line_item_name" },
                        { "data": "images" },
                        { "data": "color" },
                        { "data": "no_of_faces" },
                        { "data": "quantity" },
                        { "data": "line_item_status" },                        
                    ]
            }
        }

        e.init({
            src: $("#datatable_ajax"),
            onSuccess: function (t) {
                setInterval(() => {
                    $('.fancybox').fancybox({
                        buttons : [
                            'download',
                            'thumbs',
                            'close'
                          ]
                    });
                }, 500);
            },
            onError: function (t) { },
            loadingMessage: "Loading...",
            dataTable: {
                lengthMenu: [
                    [10, 20, 50, 100, 150],
                    [10, 20, 50, 100, 150]
                ],
                pageLength: 10,
                ajax: {
                    url: t
                },
                columnDefs: [{
                    targets: "no-sort",
                    orderable: !1
                }],
                ...columns,
                displayStart: 0,
                fnRowCallback: function (t, a, e, n) {
                    setTimeout(function () {
                        $(t).find(".make-switch").bootstrapSwitch()
                    }, 1)
                },
                order: a
            }
        }), e.getTableWrapper().on("click", ".table-group-action-submit", function (t) {
            t.preventDefault();
            var a = $(".table-group-action-input", e.getTableWrapper()),
                o = $(".table-group-action-url", e.getTableWrapper()).val();
            if ("" != a.val() && e.getSelectedRowsCount() > 0) {
                var c = {};
                c.action = a.val(), c.ids = e.getSelectedRows(), $.post(o, c, function (t) {
                    if ("TRUE" == t) {
                        send_data_action = c.action.toLowerCase(), "active" == send_data_action ? send_data_action = "activated" : "inactive" == send_data_action ? send_data_action = "inactivated" : "approved" == send_data_action ? send_data_action = "approved" : send_data_action = "deleted", Metronic.alert({
                            type: "success",
                            icon: "check",
                            message: "Record has been " + send_data_action + " successfully.",
                            container: e.getTableWrapper(),
                            place: "prepend"
                        }), $.each(c.ids, function (t, a) {
                            "Active" == c.action ? ($("tbody > tr > td > .status_" + a, n).addClass("label-success"), $("tbody > tr > td > .status_" + a, n).removeClass("label-danger"), $("tbody > tr > td > .status_" + a, n).text(c.action)) : "Inactive" == c.action ? ($("tbody > tr > td > .status_" + a, n).addClass("label-danger"), $("tbody > tr > td > .status_" + a, n).removeClass("label-success"), $("tbody > tr > td > .status_" + a, n).text(c.action)) : "Approved" == c.action ? $("tbody > tr > td > .status_" + a, n).text(c.action) : $("tbody > tr > td  .delete_" + a, n).closest("tr").fadeOut(1500, function () {
                                $(this).closest("tr").remove(), $("#datatable_ajax tbody > tr").length <= 1 && $(".filter-submit").trigger("click")
                            })
                        }), $("#datatable_ajax").DataTable().ajax.reload(), setTimeout(function () {
                            $(".alert-success").fadeOut(4e3)
                        }, 3e3);
                        var a = $('tbody > tr > td:nth-child(1) input[type="checkbox"]', n);
                        $(this).is(":checked");
                        $(a).each(function () {
                            $(this).attr("checked", !1)
                        }), $(".table-group-action-input").val(""), $(".group-checkable").attr("checked", !1), $.uniform.update(a, n), $.uniform.update($(".group-checkable", n))
                    }
                })
            } else "" == a.val() ? Metronic.alert({
                type: "danger",
                icon: "warning",
                message: "Please select an action",
                container: e.getTableWrapper(),
                place: "prepend"
            }) : 0 === e.getSelectedRowsCount() && Metronic.alert({
                type: "danger",
                icon: "warning",
                message: "No record selected",
                container: e.getTableWrapper(),
                place: "prepend"
            })
        }), $(".form-filter").val(""), $(document).on("click", "#export_to_excel", function (t) {
            var a = $("#datatable_ajax").DataTable().ajax.params(),
                a = $.param(a),
                e = $(this).attr("action-url");
            window.location.href = e + "?" + a
        }), e.getTableWrapper().on('click', ' tbody td .row-details', function () {
            var tr = $(this).closest('tr');
            var table = e.getDataTable();
            var row = table.row(tr);

            if (row.child.isShown()) {
                row.child.hide();
                $(this).addClass("row-details-close").removeClass("row-details-open");
                tr.removeClass('shown');
            } else {
                $(this).addClass("row-details-open").removeClass("row-details-close");
                row.child(format(row.data())).show();
                tr.addClass('shown');
            }
        }), e.getTableWrapper().on('change', ' tbody td .line-item-status', function () {
            var line_item_id = $(this).attr('rel');
            var status = $(this).val();

            $.post(SITE_URL + 'orders/change-status', { line_item_id: line_item_id, status: status }, function (data) {
                if ($.trim(data) == 'TRUE') {
                    // $('.order-id-' + line_item_id).val(status);
                }
            });

        }), e.getTableWrapper().on('dragenter', '.file-drag-div', function (e) {
            e.preventDefault();
            // $(this).css('border', '#39b311 2px dashed');
            // $(this).css('background', '#f1ffef');

        }), e.getTableWrapper().on('dragenter', '.psd-upload-button', function (e) {
            e.preventDefault();
            // $(this).closest('tr').css('border', '#39b311 2px dashed');
            // $(this).closest('tr').css('background', '#f1ffef');

        }), e.getTableWrapper().on('dragover', '.file-drag-div', function (e) {            
            e.preventDefault();
            // $('.file-drag-div').not(e).css('border', 'none').css('background', 'none');

        }), e.getTableWrapper().on('drop', '.file-drag-div', function (e) {
            /* $(this).css('border', 'none');
            $(this).css('background', 'none'); */
            e.preventDefault();
            var lineItemId = $(this).attr('rel');
            var uploadType = $(this).attr('rel1');

            var file = e.originalEvent.dataTransfer.files[0];
            
            if (e.originalEvent.dataTransfer.files.length > 1) {
                bootbox.alert("Only single file allowed.");

            } else {
                if (uploadType == 'Image') {
                    if ((file.type == 'image/png' || file.type == 'image/jpg' || file.type == 'image/jpeg') && lineItemId !== undefined && lineItemId !== '') {
                        uploadLineItemFile(file, lineItemId, uploadType);
                    } else {
                        bootbox.alert("Only .png .jpg .jpeg file is allowed.");
                    }
                } else if (uploadType == 'PSD') {
                    if (((/\.(psd)$/i).test(file.name)) && lineItemId !== undefined && lineItemId !== '') {
                        uploadLineItemFile(file, lineItemId, uploadType);
                    } else {
                        bootbox.alert("Only PSD file allowed.");
                    }
                }
            }

        }), e.getTableWrapper().on('blur', '.designer-note', function (e) {
            e.preventDefault();
            var lineItemId = $(this).attr('rel');
            if (lineItemId != '') {
                $.post(SITE_URL + 'orders/update-designer-note', { line_item_id: lineItemId, 'note': $(this).val() }, function (response) {
                    if (response == 'TRUE') {
                            
                    }
                })
               
            }          

        }), e.getTableWrapper().on('click', '.image-upload-button', function (e) {
            $(this).closest('tr').find('.image-file-input').trigger('click');

        }), e.getTableWrapper().on('click', '.psd-upload-button', function (e) {
            $(this).closest('tr').find('.psd-file-input').trigger('click');

        }), e.getTableWrapper().on('change', '.image-file-input', function (e) {
            var file = e.currentTarget.files[0];
            var lineItemId = $(this).closest('tr').attr('rel');

            if ((file.type == 'image/png' || file.type == 'image/jpg' || file.type == 'image/jpeg') && lineItemId !== undefined && lineItemId !== '') {
                uploadLineItemFile(file, lineItemId, 'Image');
            } else {
                bootbox.alert("Only .png .jpg .jpeg formats are allowed.");
            }
        }), e.getTableWrapper().on('change', '.psd-file-input', function (e) {
            var file = e.currentTarget.files[0];
            var lineItemId = $(this).closest('tr').attr('rel');

            if (((/\.(psd)$/i).test(file.name)) && lineItemId !== undefined && lineItemId !== '') {
                uploadLineItemFile(file, lineItemId, 'PSD');

            } else {
                bootbox.alert("Only PSD file allowed.");
            }
        })
    };

    function uploadLineItemFile(image, lineItemId, uploadType) {
        var formData = new FormData();
        formData.append('image', image);
        formData.append('lineItemId', lineItemId);
        formData.append('uploadType', uploadType);
        if (uploadType == 'PSD') {
            $('.detail-row-' + lineItemId).find('.psd-upload-button').text('Uploading...').attr('disabled');
           
        } else {
            $('.detail-row-' + lineItemId).find('.image-upload-button').text('Uploading...').attr('disabled');
        }
        $.ajax({
            url: SITE_URL + 'orders/upload-lineitem-image',
            type: "POST",
            data: formData,
            contentType: false,
            cache: false,
            processData: false,
            success: function (response) {
                if (response.status !== undefined && response.status == 'TRUE') {
                    if (uploadType == 'PSD') {
                        $('.detail-row-' + lineItemId).find('.psd-upload-button').text('Change').removeAttr('disabled');
                        $('.detail-row-' + lineItemId).find('.preview-psd').html(response.imageHtml);
                        $('.detail-row-' + lineItemId).find('.psd-file-input').val('');
                    } else {
                        $('.detail-row-' + lineItemId).find('.image-upload-button').text('Change').removeAttr('disabled');
                        $('.detail-row-' + lineItemId).find('.preview-image').html(response.imageHtml);
                        $('.detail-row-' + lineItemId).find('.image-file-input').val('');
                    }
                }
            }
        });
    }

    function format(d) {
        var imageHtml = '<div class="preview-image">' + d.v_image + '</div>';
        var pdsHTml = '<div class="preview-psd">'+ d.v_psd_file +'</div>';
        var designNote =  d.designer_note;
        
        if (d.user_type == 'Admin' || d.user_type == 'Designer' || d.user_type == 'Manager') {
            imageHtml = '<button class="btn btn-sm blue-madison image-upload-button">' + (d.v_image == '' ? 'Upload' : 'Change') + '</button><input type="file" class="image-file-input" style="display: none;"/> <div class="preview-image">' + d.v_image + '</div>';
            pdsHTml = '<button class="btn btn-sm blue-madison psd-upload-button">' + (d.v_psd_file == '' ? 'Upload' : 'Change') + '</button><input type="file" class="psd-file-input" style="display: none;"/> <div class="preview-psd">' + d.v_psd_file + '</div>';
            designNote = '<input type="text" name="v_designer_note" class="form-control input-sm designer-note" id="designer_note_'+d.id+'" rel="'+d.id+'" placeholder="Designer Note" value="'+d.designer_note+'" maxlength="500">';
        }

        return '<table class="detail-row-table detail-row-' + d.id + '" cellpadding="5" cellspacing="0" border="0" style="width: 50%; padding-left:50px;" >' +
            '<tr>' +
                '<td><strong>Text: </strong></td>' +
                '<td>' + d.text + '</td>' +
            '</tr>' +
            '<tr>' +
                '<td width="110px"><strong>Designer Note: </strong></td>' +
                '<td>' + designNote + '</td>' +
            '</tr>' +
            '<tr class="file-drag-div" rel="' + d.id + '" rel1="Image">' +
                '<td ><strong>Image: </strong></td>' +
                '<td>' +imageHtml+ '</td>'+
            '</tr>' +
            '<tr class="file-drag-div file-drag-div1" rel="' + d.id + '"  rel1="PSD">'+
                '<td><strong>PSD: </strong></td>'+
                '<td>'+pdsHTml+'</td>'+
            '</tr>' + 
            '</table>';
    }
    return {
        init: function (t, n) {
            a(), void 0 == n && (n = ""), e(t, n)
        }
    }
}();