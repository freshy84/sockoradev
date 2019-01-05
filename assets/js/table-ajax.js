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
                        { "data": "no_of_faces" },
                        { "data": "quantity" },
                        { "data": "product_type" },
                        { "data": "line_item_status_html" },                        
                    ]
            }
        }

        e.init({
            src: $("#datatable_ajax"),
            onSuccess: function (t) {
                setInterval(() => {
                    $('.fancybox').fancybox({
                        buttons: [
                            'download',
                            'thumbs',
                            'close'
                        ]
                    });

                    $('[data-fancybox^="gallery"], [data-fancybox^="line-item-images"], [data-fancybox^="line-item-new-images"]').fancybox({
                        buttons: [
                            'download',
                            'thumbs',
                            'close'
                        ], 
                        thumbs : {
                            autoStart : true
                          } 
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
            
            var table = e.getDataTable();
            var row = $(this).closest('tr')[0];
            var d = table.row(row).data();
            
            $.post(SITE_URL + 'orders/change-status', { line_item_id: line_item_id, status: status }, function (data) {
                if ($.trim(data) == 'TRUE') {
                    d.line_item_status = status;
                    table
                    .row(row)
                    .data( d )
                    .draw();
                }
            });

        }), e.getTableWrapper().on('dragenter', '.file-drag-div', function (e) {
            e.preventDefault();
            
        }), e.getTableWrapper().on('dragenter', '.psd-upload-button', function (e) {
            e.preventDefault();
            
        }), e.getTableWrapper().on('dragover', '.file-drag-div', function (e) {
            e.preventDefault();            

        }), e.getTableWrapper().on('drop', '.file-drag-div', function (e) {
            e.preventDefault();
            var lineItemId = $(this).attr('rel');
            var uploadType = $(this).attr('rel1');

            var files = e.originalEvent.dataTransfer.files;
            if (files.length > 5) {
                bootbox.alert("You can only upload a maximum of 5 files at a time.");
            } else {
                if (lineItemId !== undefined && lineItemId !== '') {
                    if (uploadType == 'Image' || uploadType == 'NewImage') {
                        var status = true;
                        var fileSize = 0; 

                        $.each(files, function (ind, file) {
                            if ((file.type != 'image/png' && file.type != 'image/jpg' && file.type != 'image/jpeg')) {
                                status = false;
                            }
                            fileSize += file.size;
                        });

                        setTimeout(() => {
                            if ((fileSize / 1024) <= 10240) {
                                if (status === false) {
                                    bootbox.alert("Only .png .jpg .jpeg file is allowed.");
                                } else {
                                    uploadLineItemFile(files, lineItemId, uploadType);
                                }
                            } else {
                                bootbox.alert("You can only upload a maximum 10M at a time.");
                            } 
                        }, 500);

                    } else if (uploadType == 'PSD' || uploadType == 'NewPSD') {
                        var status = true;
                        var fileSize = 0; 
                        
                        $.each(files, function (ind, file) {
                            if (!(/\.(psd)$/i).test(file.name)) {
                                status = false;
                                fileSize += file.size;
                            }
                        });

                        setTimeout(() => {
                            if ((fileSize / 1024) <= 10240) {
                                if (status === false) {
                                    bootbox.alert("Only PSD file allowed.");
                                } else {
                                    uploadLineItemFile(files, lineItemId, uploadType);
                                }
                            } else {
                                bootbox.alert("You can only upload a maximum 10M at a time.");
                            }
                        }, 500);
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

        }), e.getTableWrapper().on('click', '.image-upload-button, .new-image-upload-button, .psd-upload-button, .new-psd-upload-button', function (e) {
            $(this).closest('td').find('input[type=file]').trigger('click');

        }), e.getTableWrapper().on('change', '.image-file-input, .new-image-file-input', function (e) {
            var files = e.currentTarget.files;
            var lineItemId = $(this).closest('td').attr('rel');
            var uploadType = $(this).closest('td').attr('rel1');

            if (files.length > 5) {
                bootbox.alert("You can only upload a maximum of 5 files at a time.");

            } else {
                if (lineItemId !== undefined && lineItemId !== '') {
                    var status = true;
                    var fileSize = 0;

                    $.each(files, function (ind, file) {
                        if ((file.type != 'image/png' && file.type != 'image/jpg' && file.type != 'image/jpeg')) {
                            status = false;
                        }
                        fileSize += file.size;

                    });
                    setTimeout(() => {                        
                        if ((fileSize / 1024) <= 10240) {
                            if (status) {
                                uploadLineItemFile(files, lineItemId, uploadType);
                            } else {
                                bootbox.alert("Only .png .jpg .jpeg file is allowed.");
                            }
                        } else {
                            bootbox.alert("You can only upload a maximum 10M at a time.");
                        } 
                    }, 500);
                }
            }
                        
        }), e.getTableWrapper().on('change', '.psd-file-input, .new-psd-file-input', function (e) {
            var files = e.currentTarget.files;
            var lineItemId = $(this).closest('td').attr('rel');
            var uploadType = $(this).closest('td').attr('rel1');

            if (files.length > 5) {
                bootbox.alert("You can only upload a maximum of 5 files at a time.");

            } else {
                var status = true;
                var fileSize = 0;
                $.each(files, function (ind, file) {
                    if (!(/\.(psd)$/i).test(file.name)) {
                        status = false;
                    }

                    fileSize += file.size;
                });

                setTimeout(() => {
                    if ((fileSize / 1024) <= 10240) {
                        if(status) {
                            uploadLineItemFile(files, lineItemId, uploadType);
                        } else {
                            bootbox.alert("Only PSD file allowed.");
                        }
                    } else {
                        bootbox.alert("You can only upload a maximum 10M at a time.");
                    } 
                }, 500);
            }

        }), e.getTableWrapper().on('click', '.preview-image .delete-image, .preview-new-image .delete-image, .preview-psd .delete-psd, .preview-new-psd .delete-psd', function (e) {
            var $this = $(e.target);
            var lineItemId = $(this).closest('td').attr('rel');
            var uploadType = $(this).closest('td').attr('rel1');
            var filename = $(this).attr('rel');
            var formData = new FormData();      
            formData.append('lineItemId', lineItemId);
            formData.append('uploadType', uploadType);
            formData.append('filename', filename);
            
            if (lineItemId !== undefined && lineItemId != '' && uploadType != '') {
                $.ajax({
                    url: SITE_URL + 'orders/delete-lineitem-image',
                    type: "POST",
                    data: formData,
                    contentType: false,
                    cache: false,
                    processData: false,
                    success: function (response) {
                        if (response.status == 'TRUE') {
                            if (uploadType == 'Image' || uploadType == 'NewImage') {
                                $this.closest('.image-item').fadeOut("slow", function () {
                                    $this.closest('.image-item').remove();
                                });
                            } else {
                                $this.closest('.psd-file-list').fadeOut("slow", function () {
                                    $this.closest('.psd-file-list').remove();
                                });
                            }
                        } else {
                            bootbox.alert(response.message);    
                        }
                    },
                    error: function () {
                        bootbox.alert('Something went wrong while deleting file. Please try again.');
                    } 
                });
            }

        })
    };

    function uploadLineItemFile(files, lineItemId, uploadType) {
        var formData = new FormData();      
        $.each(files, function (i, file) {      
            formData.append('files[]', file);
        });

        formData.append('lineItemId', lineItemId);
        formData.append('uploadType', uploadType);

        if (uploadType == 'PSD') {
            $('.detail-row-' + lineItemId).find('.psd-upload-button').text('Uploading...').attr('disabled', 'disabled');           
        } else if (uploadType == 'NewPSD') {
            $('.detail-row-' + lineItemId).find('.new-psd-upload-button').text('Uploading...').attr('disabled', 'disabled');
        } else if (uploadType == 'NewImage') {
            $('.detail-row-' + lineItemId).find('.new-image-upload-button').text('Uploading...').attr('disabled', 'disabled');
        } else {
            $('.detail-row-' + lineItemId).find('.image-upload-button').text('Uploading...').attr('disabled', 'disabled');
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
                        $('.detail-row-' + lineItemId).find('.preview-psd').append(response.imageHtml);
                        $('.detail-row-' + lineItemId).find('.psd-file-input').val('');
                    } else if (uploadType == 'NewPSD') {
                        $('.detail-row-' + lineItemId).find('.new-psd-upload-button').text('Change').removeAttr('disabled');
                        $('.detail-row-' + lineItemId).find('.preview-new-psd').append(response.imageHtml);
                        $('.detail-row-' + lineItemId).find('.new-psd-file-input').val('');
                    } else if (uploadType == 'Image') {
                        $('.detail-row-' + lineItemId).find('.image-upload-button').text('Change').removeAttr('disabled');
                        $('.detail-row-' + lineItemId).find('.preview-image').append(response.imageHtml);
                        $('.detail-row-' + lineItemId).find('.image-file-input').val('');
                    } else  {
                        $('.detail-row-' + lineItemId).find('.new-image-upload-button').text('Change').removeAttr('disabled');
                        $('.detail-row-' + lineItemId).find('.preview-new-image').append(response.imageHtml);
                        $('.detail-row-' + lineItemId).find('.new-image-file-input').val('');
                    }
                } else {
                    bootbox.alert(response.message);
                }
            },
            error: function () {
                bootbox.alert('Something went wrong while file uploading. Please try again.');
            } 
        });
    }

    function format(d) {
        var imageHtml = '<div class="preview-image">' + d.v_image + '</div>';
        var psdHTml = '<div class="preview-psd">' + d.v_psd_file + '</div>';      
        var designNote =  d.designer_note;
        var newImageHtml = '';
        var newPsdHtml = '';
        var rightBorder = '';

        if (d.line_item_status == 'Redo' && (d.user_type == 'Admin' || d.user_type == 'Designer' || d.user_type == 'Manager')) {
            newImageHtml += '<td width="11%" class="file-drag-div" rel="' + d.id + '" rel1="NewImage"><strong>New Images:</strong></td><td width="39%" class="file-drag-div" rel="' + d.id + '" rel1="NewImage"><button class="btn btn-sm blue-madison new-image-upload-button">Upload</button><input type="file" class="new-image-file-input" style="display: none;" multiple/> <div class="preview-new-image">' + d.v_new_image + '</div></td>';

            newPsdHtml += '<td class="file-drag-div" rel="' + d.id + '"  rel1="NEwPSD"><strong>New PSD:</strong></td><td class="file-drag-div" rel="' + d.id + '"  rel1="NewPSD"><button class="btn btn-sm blue-madison new-psd-upload-button">Upload</button><input type="file" class="new-psd-file-input" style="display: none;" multiple/> <div class="preview-new-psd">' + d.v_new_psd_file + '</div></td>';
            rightBorder = 'border-right: 1px solid #ddd;'
            
        } else {
            if (d.v_new_image != '') {
                newImageHtml += '<td width="11%"><strong>New Images:</strong></td><td width="39%" ><div class="preview-new-image">' + d.v_new_image + '</div><td>';
                rightBorder = 'border-right: 1px solid #ddd;'
            }
        
            if (d.v_new_psd_file != '') {
                newPsdHtml += '<td ><strong>New PSD:</strong></td><td class="file-drag-div"><div class="preview-new-psd">' + d.v_new_psd_file + '</div></td>';
                rightBorder = 'border-right: 1px solid #ddd;'
            }
        }

        
        if (d.user_type == 'Admin' || d.user_type == 'Designer' || d.user_type == 'Manager') {
            imageHtml = '<div style="'+ rightBorder +'"><button class="btn btn-sm blue-madison image-upload-button">Upload</button><input type="file" class="image-file-input" style="display: none;" multiple/> <div class="preview-image">' + d.v_image + '</div></div>';
            
            psdHTml = '<div style="'+ rightBorder +'"><button class="btn btn-sm blue-madison psd-upload-button">Upload</button><input type="file" class="psd-file-input" style="display: none;" multiple/> <div class="preview-psd">' + d.v_psd_file + '</div></div>';

            designNote = '<textarea type="text" name="v_designer_note" class="form-control input-sm designer-note" id="designer_note_' + d.id + '" rel="' + d.id + '" placeholder="Designer Note" maxlength="500" style="width: 50%">' + d.designer_note + '</textarea>';
        }

        return '<table class="detail-row-table detail-row-' + d.id + '" cellpadding="5" cellspacing="0" border="0" style="width: 100%; padding-left:50px;" >' +
            '<tr>' +
                '<td><strong>Text: </strong></td>' +
                '<td colspan="3">' + d.text + '</td>' +                
            '</tr>' +
            '<tr>' +
            '<td><strong>Color: </strong></td>' +
            '<td colspan="3">' + d.color + '</td>' +                
        '</tr>' +
            '<tr>' +
                '<td><strong>Designer Note: </strong></td>' +
                '<td  colspan="3">' + designNote + '</td>' +                
            '</tr>' +
            '<tr >' +
                '<td class="file-drag-div" rel="' + d.id + '" rel1="Image" width="11%"><strong>Images: </strong></td>' +
                '<td class="file-drag-div" rel="' + d.id + '" rel1="Image" width="39%">' + imageHtml + '</td>' +
                newImageHtml +                
            '</tr>' +
            '<tr>'+
                '<td class="file-drag-div" rel="' + d.id + '"  rel1="PSD"><strong>PSD: </strong></td>'+
                '<td class="file-drag-div" rel="' + d.id + '"  rel1="PSD">' + psdHTml + '</td>' +
                newPsdHtml +
            '</tr>' + 
            '</table>';
    }
    return {
        init: function (t, n) {
            a(), void 0 == n && (n = ""), e(t, n)
        }
    }
}();