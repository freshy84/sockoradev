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

                    <a class="more" href="{{action('UsersController@getIndex')}}">
                        View more
                        <i class="m-icon-swapright m-icon-white"> </i>
                    </a>
                </div>
            </div>
        </div>
        <!-- END DASHBOARD STATS -->
    </div>
</div>
@stop
