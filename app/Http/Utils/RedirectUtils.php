<?php
/*
 * Copyright (c) 2021.5.14
 * author: ryan-dev
 */

namespace App\Http\Utils;

use Illuminate\Support\Facades\Redirect;

class RedirectUtils
{
    // main redirect
    public static function redirectMain()
    {
        return Redirect::route('main');
    }

    // userinfo redirect
    public static function redirectUserInfo()
    {
        return Redirect::route('user.info');
    }

    // student.list redirect
    public static function redirectStudentList()
    {
        return Redirect::route('student.list');
    }

    // consulting.list redirect
    public static function redirectConsultingList()
    {
        return Redirect::route('consulting.list');
    }
}
