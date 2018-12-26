var Datatable = function() {
    var t, e, a, r, n, o, c = !1,
        i = {},
        s = function() {
            var e = $('tbody > tr > td:nth-child(1) input[type="checkbox"]:checked', a).size();
            t.dataTable.language.metronicGroupActions;
            e > 0 || $(".table-group-actions > span", n).text("")
        };
    return {
        init: function (l) {
            if ($("#search_submit").click(function() {
                    $('#frmSearchForm textarea.form-filter, #frmSearchForm select.form-filter, #frmSearchForm input:not([type="radio"],[type="checkbox"])').each(function() {
                        o.setAjaxParam($(this).attr("name"), $(this).val())
                    }), $('input.form-filter[type="checkbox"]:checked', a).each(function() {
                        o.addAjaxParam($(this).attr("name"), $(this).val())
                    }), $('input.form-filter[type="radio"]:checked', a).each(function() {
                        o.setAjaxParam($(this).attr("name"), $(this).val())
                    }), e.ajax.reload()
                }), $("#btn_show_all").click(function() {
                    $('#frmSearchForm textarea.form-filter, #frmSearchForm select.form-filter, #frmSearchForm input:not([type="radio"],[type="checkbox"])').each(function() {
                        $(this).val(""), o.setAjaxParam($(this).attr("name"), "")
                    }), $('input.form-filter[type="checkbox"]:checked', a).each(function() {
                        $(this).val(""), o.addAjaxParam($(this).attr("name"), "")
                    }), $('input.form-filter[type="radio"]:checked', a).each(function() {
                        $(this).val(""), o.setAjaxParam($(this).attr("name"), "")
                    }), e.ajax.reload()
                }), $().dataTable) {
                o = this, l = $.extend(!0, {
                    src: "",
                    filterApplyAction: "filter",
                    filterCancelAction: "filter_cancel",
                    resetGroupActionInputOnSuccess: !0,
                    loadingMessage: "Loading...",
                    dataTable: {
                        dom: "<'row'<'col-md-8 col-sm-12'pli><'col-md-4 col-sm-12'<'table-group-actions pull-right'>>r><'table-scrollable't><'row'<'col-md-8 col-sm-12'pli><'col-md-4 col-sm-12'>>",
                        pageLength: 10,
                        language: {
                            metronicGroupActions: "_TOTAL_ records selected:  ",
                            metronicAjaxRequestGeneralError: "Could not complete request. Please check your internet connection",
                            lengthMenu: "<span class='seperator'>|</span>View _MENU_ records",
                            info: "<span class='seperator'>|</span>Found total _TOTAL_ records",                            
                            infoEmpty: "No records found to show",
                            emptyTable: "No data available.",
                            zeroRecords: "No matching records found",
                            paginate: {
                                previous: "Prev",
                                next: "Next",
                                last: "Last",
                                first: "First",
                                page: "Page",
                                pageOf: "of"
                            }
                        },
                        orderCellsTop: !0,
                        columnDefs: [{
                            targets: "no-sort",
                            orderable: !1
                        }],
                        pagingType: "bootstrap_extended",
                        autoWidth: !1,
                        processing: !1,
                        serverSide: !0,                                        
                        ajax: {
                            url: "",
                            type: "POST",
                            timeout: 2e4,
                            data: function(e) {
                                e.page = e.start / e.length + 1, $.each(i, function(t, a) {
                                    e[t] = a
                                }), Metronic.blockUI({
                                    message: t.loadingMessage,
                                    target: r,
                                    overlayColor: "none",
                                    cenrerY: !0,
                                    boxed: !0
                                })
                            },
                            dataSrc: function(e) {
                                return e.customActionMessage && Metronic.alert({
                                    type: "OK" == e.customActionStatus ? "success" : "danger",
                                    icon: "OK" == e.customActionStatus ? "check" : "warning",
                                    message: e.customActionMessage,
                                    container: n,
                                    place: "prepend"
                                }), e.customActionStatus && t.resetGroupActionInputOnSuccess && $(".table-group-action-input", n).val(""), t.onSuccess && t.onSuccess.call(void 0, o), Metronic.unblockUI(r), e.data
                            },
                            error: function() {
                                t.onError && t.onError.call(void 0, o), Metronic.alert({
                                    type: "danger",
                                    icon: "warning",
                                    message: t.dataTable.language.metronicAjaxRequestGeneralError,
                                    container: n,
                                    place: "prepend"
                                }), Metronic.unblockUI(r)
                            }
                        },
                        drawCallback: function(t) {
                            c === !1 && (c = !0, a.show()), Metronic.initUniform($('input[type="checkbox"]', a)), s()
                        }
                    }
                }, l), t = l, a = $(l.src), r = a.parents(".table-container");
                var u = $.fn.dataTableExt.oStdClasses;
                $.fn.dataTableExt.oStdClasses.sWrapper = $.fn.dataTableExt.oStdClasses.sWrapper + " dataTables_extended_wrapper", $.fn.dataTableExt.oStdClasses.sFilterInput = "form-control input-small input-sm input-inline", $.fn.dataTableExt.oStdClasses.sLengthSelect = "form-control input-xsmall input-sm input-inline", e = a.DataTable(l.dataTable), $.fn.dataTableExt.oStdClasses.sWrapper = u.sWrapper, $.fn.dataTableExt.oStdClasses.sFilterInput = u.sFilterInput, $.fn.dataTableExt.oStdClasses.sLengthSelect = u.sLengthSelect, n = a.parents(".dataTables_wrapper"), 1 === $(".table-actions-wrapper", r).size() && ($(".table-group-actions", n).html($(".table-actions-wrapper", r).html()), $(".table-actions-wrapper", r).remove()), $(".group-checkable", a).change(function() {
                    var t = $('tbody > tr > td:nth-child(1) input[type="checkbox"]', a),
                        e = $(this).is(":checked");
                    $(t).each(function() {
                        $(this).attr("checked", e)
                    }), $.uniform.update(t), s()
                }), a.on("change", 'tbody > tr > td:nth-child(1) input[type="checkbox"]', function() {
                    s()
                }), a.on("click", ".filter-submit", function(t) {
                    t.preventDefault(), o.submitFilter()
                }), a.on("keyup", 'input[type="text"]', function(t) {
                    var e = t.keyCode;
                    13 == e && (t.preventDefault(), o.submitFilter())
                }), a.on("click", ".filter-cancel", function(t) {
                    t.preventDefault(), o.resetFilter()
                })
            }
        },
        submitFilter: function() {
            o.setAjaxParam("action", t.filterApplyAction), $('textarea.form-filter, select.form-filter, input.form-filter:not([type="radio"],[type="checkbox"])', a).each(function() {
                o.setAjaxParam($(this).attr("name"), $(this).val())
            }), $('input.form-filter[type="checkbox"]:checked', a).each(function() {
                o.addAjaxParam($(this).attr("name"), $(this).val())
            }), $('input.form-filter[type="radio"]:checked', a).each(function() {
                o.setAjaxParam($(this).attr("name"), $(this).val())
            }), e.ajax.reload()
        },
        resetFilter: function() {
            $("textarea.form-filter, select.form-filter, input.form-filter", a).each(function() {
                $(this).val("")
            }), $('input.form-filter[type="checkbox"]', a).each(function() {
                $(this).attr("checked", !1)
            }), $(".reset_select").select2("val", ""), o.clearAjaxParams(), o.addAjaxParam("action", t.filterCancelAction), e.ajax.reload()
        },
        getSelectedRowsCount: function() {
            return $('tbody > tr > td:nth-child(1) input[type="checkbox"]:checked', a).size()
        },
        getSelectedRows: function() {
            var t = [];
            return $('tbody > tr > td:nth-child(1) input[type="checkbox"]:checked', a).each(function() {
                t.push($(this).val())
            }), t
        },
        setAjaxParam: function(t, e) {
            i[t] = e
        },
        addAjaxParam: function(t, e) {
            i[t] || (i[t] = []), skip = !1;
            for (var a = 0; a < i[t].length; a++) i[t][a] === e && (skip = !0);
            skip === !1 && i[t].push(e)
        },
        clearAjaxParams: function(t, e) {
            i = {}
        },
        getDataTable: function() {
            return e
        },
        getTableWrapper: function() {
            return n
        },
        gettableContainer: function() {
            return r
        },
        getTable: function() {
            return a
        },
        getAjaxParams: function() {
            return setAjaxParam, i.page = i.export_page, i.length = i.export_length, i
        }
    }
};