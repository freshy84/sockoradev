<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::get('/', function () {
    return view('welcome');
})->middleware(['auth.shop'])->name('home');


Route::group(array('middleware' => 'guest'),function(){
    Route::any('/', array('uses' => 'AuthenticateController@index'));
    Route::any('login', array('uses' => 'AuthenticateController@index'));
    Route::post('/forgot-password', array('uses' => 'AuthenticateController@forgot_password'));
    Route::any('/reset-password/{code}',array('as' => 'reset-password','uses' => 'AuthenticateController@reset_password'));
});

Route::group(array('middleware' => 'auth'), function() {
    Route::get('dashboard', 'AuthenticateController@dashboard');
    Route::any('my_profile', 'AuthenticateController@my_profile');
    Route::get('logout', 'AuthenticateController@logout');
    
    /* Users */
    Route::any('users', 'UsersController@getIndex');
    Route::any('users/list-ajax', 'UsersController@anyListAjax');
    Route::any('users/add', 'UsersController@anyAdd');
    Route::any('users/edit/{id}', 'UsersController@anyEdit');
    Route::any('users/delete/{id}', 'UsersController@getDelete');
    Route::any('users/bulk-action', 'UsersController@postBulkAction');
    
    Route::any('orders', 'OrdersController@getIndex');
    Route::any('orders/list-ajax', 'OrdersController@anyListAjax');
    Route::any('orders/edit/{id}', 'OrdersController@anyEdit');
    
});