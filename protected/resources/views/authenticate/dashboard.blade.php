@extends('layouts.default')
@section('content')
<div class="page-content-wrapper">
    <div class="page-content" style="min-height:1100px">
        <h3 class="page-title">
            Dashboard
        </h3>
        <div class="page-bar">
            <ul class="page-breadcrumb">
                <li>
                    <i class="fa fa-home"></i>
                    Dashboard
                </li>
            </ul>
        </div>
        <!-- END PAGE HEADER-->
        <!-- BEGIN DASHBOARD STATS -->

        <div class="row">
            <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                <div class="dashboard-stat blue-madison">
                    <a href="{{ SITE_URL.'users' }}" style="text-decoration: none;">
                        <div class="visual">
                            <i class="fa fa-users"></i>
                        </div>
                        <div class="details">
                            <div class="number">
                                {{ $responseData['User']}}
                            </div>
                            <div class="desc">
                                Users
                            </div>
                        </div>

                        <div class="more" >
                            View more
                            <i class="m-icon-swapright m-icon-white"> </i>
                        </div>
                    </a>
                </div>
            </div>
            <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                <div class="dashboard-stat green-meadow">
                    <a href="{{ SITE_URL.'orders' }}" style="text-decoration: none;">
                        <div class="visual">
                            <i class="fa fa-shopping-cart"></i>
                        </div>
                        <div class="details">
                            <div class="number">
                            {{ $responseData['orders']}}
                            </div>
                            <div class="desc">
                                Orders
                            </div>
                        </div>
                        <div class="more">
                            View more
                            <i class="m-icon-swapright m-icon-white"> </i>
                        </div>
                    </a>
                </div>
            </div>
        </div>
        <!-- END DASHBOARD STATS -->
    </div>
</div>
@stop
