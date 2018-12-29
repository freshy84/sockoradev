<style>
    .page-sidebar-menu-closed span.main_logo{
        display: none;
    }
    .page-sidebar-menu i.small_logo {
        display: none;
    }
    .page-sidebar-menu-closed i.small_logo {
        display: block;
    }
</style>
<div class="page-sidebar navbar-collapse collapse">
    <?php
        $data = getCurrentControllerAction();
        $explode_data = explode("||", $data);
        $curr_controller = $explode_data[0];
        $curr_action = $explode_data[1];        
    ?>
    <ul class="page-sidebar-menu" data-keep-expanded="false" data-auto-scroll="true" data-slide-speed="200">
        <li class="sidebar-toggler-wrapper" >
            <!-- BEGIN SIDEBAR TOGGLER BUTTON -->
            <div class="sidebar-toggler" ng-click="toggleState()">
            </div>
            <!-- END SIDEBAR TOGGLER BUTTON -->
        </li>
        <li class="sidebar-search-wrapper">
            <form class="sidebar-search sidebar-search-bordered" action="" method="POST">
                <a href="javascript:;" class="remove"><i class="icon-close"></i></a>
            </form>
        </li>
        <li class="<?= $curr_controller == "Authenticate" && $curr_action == "dashboard" ? 'active' : null ?>">
            <a href="{{action('AuthenticateController@dashboard')}}" data-container="body" data-placement="bottom" data-html="true" >
                <i class="icon-home"></i>
                <span class="title">Dashboard</span>
                <span class="<?= $curr_controller == "Authenticate" && $curr_action == "dashboard" ? 'selected' : null ?>"></span>
            </a>
        </li>
        <li class="<?= $curr_controller == "Users" ? 'active' : null ?>">
            <a href="{{action('UsersController@getIndex')}}" data-container="body" data-placement="bottom" data-html="true" >
                <i class="fa fa-users"></i>
                <span class="title">Users</span>
            </a>
        </li>

        <li class="<?= $curr_controller == "Orders" ? 'active' : null ?>">
            <a href="{{action('OrdersController@getIndex')}}" data-container="body" data-placement="bottom" data-html="true" >
                <i class="fa fa-shopping-cart"></i>
                <span class="title">Orders</span>
            </a>
        </li>
        
        <li class="<?= $curr_controller == "Authenticate" && $curr_action == "my_profile" ? 'active' : null ?> setting">
            <a href="{{action('AuthenticateController@my_profile')}}">
                <i class="icon-user"></i>
                <span class="title">My Profile</span>
                <span class="<?= $curr_controller == "Authenticate" && $curr_action == "my_profile" ? 'selected' : null ?>"></span>
            </a>
        </li>
    </ul>
</div>