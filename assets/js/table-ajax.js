var project_array, TableAjax = function(t) {
    var a = function() {
            $(".date-picker").datepicker({
                rtl: Metronic.isRTL(),
                autoclose: !0
            })
        },
        e = function(t, a) {
            "" == a && (a = [0, "asc"]);
            var e = new Datatable,
                n = $("#datatable_ajax");
            e.init({
                src: $("#datatable_ajax"),
                onSuccess: function (t) {
                    setInterval(() => {
                        $('.fancybox').fancybox();
                    }, 500);
                },
                onError: function(t) {},
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
                    columns: [
                        {
                            "className":      'more-details row-details-close',
                            "orderable":      false,
                            "data":           null,
                            "defaultContent": '<span class="row-details row-details-close"></span>'
                        },
                        { "data": "order_id" },
                        { "data": "line_item_name" },
                        { "data": "images" },
                        { "data": "text" },
                        { "data": "color" },
                        { "data": "no_of_faces" },
                        { "data": "quantity" },
                        { "data": "action" }
                    ],
                    displayStart: 0,
                    fnRowCallback: function(t, a, e, n) {
                        setTimeout(function() {
                            $(t).find(".make-switch").bootstrapSwitch()
                        }, 1)
                    },
                    order: a
                }
            }), e.getTableWrapper().on("click", ".table-group-action-submit", function(t) {
                t.preventDefault();
                var a = $(".table-group-action-input", e.getTableWrapper()),
                    o = $(".table-group-action-url", e.getTableWrapper()).val();
                if ("" != a.val() && e.getSelectedRowsCount() > 0) {
                    var c = {};
                    c.action = a.val(), c.ids = e.getSelectedRows(), $.post(o, c, function(t) {
                        if ("TRUE" == t) {
                            send_data_action = c.action.toLowerCase(), "active" == send_data_action ? send_data_action = "activated" : "inactive" == send_data_action ? send_data_action = "inactivated" : "approved" == send_data_action ? send_data_action = "approved" : send_data_action = "deleted", Metronic.alert({
                                type: "success",
                                icon: "check",
                                message: "Record has been " + send_data_action + " successfully.",
                                container: e.getTableWrapper(),
                                place: "prepend"
                            }), $.each(c.ids, function(t, a) {
                                "Active" == c.action ? ($("tbody > tr > td > .status_" + a, n).addClass("label-success"), $("tbody > tr > td > .status_" + a, n).removeClass("label-danger"), $("tbody > tr > td > .status_" + a, n).text(c.action)) : "Inactive" == c.action ? ($("tbody > tr > td > .status_" + a, n).addClass("label-danger"), $("tbody > tr > td > .status_" + a, n).removeClass("label-success"), $("tbody > tr > td > .status_" + a, n).text(c.action)) : "Approved" == c.action ? $("tbody > tr > td > .status_" + a, n).text(c.action) : $("tbody > tr > td  .delete_" + a, n).closest("tr").fadeOut(1500, function() {
                                    $(this).closest("tr").remove(), $("#datatable_ajax tbody > tr").length <= 1 && $(".filter-submit").trigger("click")
                                })
                            }), $("#datatable_ajax").DataTable().ajax.reload(), setTimeout(function() {
                                $(".alert-success").fadeOut(4e3)
                            }, 3e3);
                            var a = $('tbody > tr > td:nth-child(1) input[type="checkbox"]', n);
                            $(this).is(":checked");
                            $(a).each(function() {
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
            }), $(".form-filter").val(""), $(document).on("click", "#export_to_excel", function(t) {
                var a = $("#datatable_ajax").DataTable().ajax.params(),
                    a = $.param(a),
                    e = $(this).attr("action-url");
                window.location.href = e + "?" + a
            }), e.getTableWrapper().on('click', ' tbody td .row-details', function () {
                var tr = $(this).closest('tr');
                console.log(tr);
                var table = e.getDataTable();
                var row = table.row(tr);
        
                if ( row.child.isShown() ) {
                    // This row is already open - close it
                    row.child.hide();
                    $(this).addClass("row-details-close").removeClass("row-details-open");
                    tr.removeClass('shown');
                }
                else {
                    // Open this row
                    $(this).addClass("row-details-open").removeClass("row-details-close");
                    row.child( format(row.data()) ).show();
                    tr.addClass('shown');
                }
            });
        };

        function format ( d ) {
            console.log(d)
            // `d` is the original data object for the row
            return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
                '<tr>'+
                    '<td>Full name:</td>'+
                    '<td>'+d.name+'</td>'+
                '</tr>'+
                '<tr>'+
                    '<td>Extension number:</td>'+
                    '<td>'+d.extn+'</td>'+
                '</tr>'+
                '<tr>'+
                    '<td>Extra info:</td>'+
                    '<td>And any further details here (images etc)...</td>'+
                '</tr>'+
            '</table>';
        }
    return {
        init: function(t, n) {
            a(), void 0 == n && (n = ""), e(t, n)
        }
    }
}();