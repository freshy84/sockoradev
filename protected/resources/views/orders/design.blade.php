@extends('layouts.default')
@section('content')
    <style>
        .error-inner{color:red;}
    </style>
    <div class="page-content-wrapper">
        <div class="page-content" style="min-height:1100px">
            <div class="row">
                <div class="col-md-12">
                    <div class="portlet">
                        <div class="portlet-title">
                            <div class="page-title caption"><strong><i class="icon-users"></i> {{ $title }}</strong></div>
                        </div>
                    </div>
                    <div class="portlet-body">
                        <div class="table-container ">
                            @if(Session::has('success-message'))
                                <div class="Metronic-alerts alert alert-success fade in">
                                    <button aria-hidden="true" data-dismiss="alert" class="close" type="button"></button>
                                    <i class="fa-lg fa fa-check "></i>
                                    <span class="message">{!!Session::get('success-message')!!}</span>
                                </div>
                            @endif
                            <table class="table table-striped table-hover table-bordered orders-listing" id="datatable_ajax">
                                <thead>
                                <tr role="row" class="heading">
                                    <th class="table-checkbox no-sort" rowspan="1" colspan="1" aria-label="" style="width: 14px;"></th>
                                    <th width="60px;">
                                        Order #
                                    </th>
                                    <th width="15%">
                                        Line Item
                                    </th>
                                    <th class="no-sort" width="20%">
                                        Images
                                    </th>
                                    <th class="no-sort" width="10%">
                                        Faces
                                    </th>
                                    <th width="10%">
                                        Quantity
                                    </th><th width="10%">
                                        Product Type
                                    </th>
                                    <th width="10%">
                                        Status
                                    </th>
                                </tr>
                                <tr role="row" class="filter">
                                    <td rowspan="1" colspan="1">

                                    </td>
                                    <td rowspan="1" colspan="1">
                                        <input type="text" name="v_order_id" class="form-control form-filter input-sm" placeholder="Order Id"/>
                                    </td>
                                    <td rowspan="1" colspan="1">
                                        <input type="text" name="v_line_item" class="form-control form-filter input-sm" placeholder="Line Item"/>
                                    </td>
                                    <td rowspan="1" colspan="1">

                                    </td>

                                    <td rowspan="1" colspan="1">
                                        <input type="text" name="i_no_of_faces" class="form-control form-filter input-sm" placeholder="Faces"/>
                                    </td>
                                    <td rowspan="1" colspan="1">
                                        <input type="text" name="i_quantity_min" class="form-control form-filter input-sm" placeholder="Min"/>
                                        <input type="text" name="i_quantity_max" class="form-control form-filter input-sm" placeholder="Max"  style="margin-top: 5px;"/>
                                    </td>
                                    <td rowspan="1" colspan="1">
                                        <input type="text" name="product_type" class="form-control form-filter input-sm" placeholder="Product Type"/>
                                    </td>
                                    <td rowspan="1" colspan="1">
                                        <select name="e_status" class="form-control form-filter input-sm">
                                            <option value="">-- Select --</option>
                                            <option value="New Order">New Order</option>
                                            <option value="Design Complete">Design Complete</option>
                                            <option value="Mock-up Sent">Mock-up Sent</option>
                                            <option value="Redo">Redo</option>
                                            <option value="Approved">Approved</option>
                                        </select>
                                        <button class="btn btn-sm blue-madison filter-submit hide"><i class="fa fa-search"></i> Search</button>
                                    </td>
                                </tr>
                                </thead>
                                <tbody>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script>
        $(document).ready(function(){
            $('.page-sidebar-menu li').removeClass('active');
            $('.design_link').toggleClass('active');
            var url = SITE_URL + 'orders/list-ajax';
            var order = [[0, "desc"]];
            {{\Illuminate\Support\Facades\Session::put('status', 'Design')}}
            TableAjax.init(url, order, status);
            setTimeout(() => {
                $('.table-group-actions').html('<button class="btn btn-sm blue-madison filter-submit"><i class="fa fa-search"></i> Search</button> <button class="btn btn-sm default filter-cancel"><i class="fa fa-times"></i> Reset</button>');

            }, 100);
        });
    </script>
@stop