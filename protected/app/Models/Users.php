<?php
namespace App\Models;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Users extends Authenticatable {    

    protected $table = 'users';
    protected $hidden = [
        'password', 'remember_token',
    ];

}
