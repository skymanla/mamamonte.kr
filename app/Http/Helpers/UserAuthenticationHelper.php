<?php
/*
 * Copyright (c) 2021.5.19
 * author: ryan-dev
 */

namespace App\Http\Helpers;


use App\Models\User\User;

class UserAuthenticationHelper
{
    // 없으면 || is_use = N 이면  false, 있고 is_use = Y 면 true
    public static function isAuthenticated(): bool
    {
        // session 이 선언되어 있지 않다면
        if (!session()->has('oauth_info') && !session()->has('oauth_info.email')) {
            return false;
        }

        $data = User::where('email', session()->get('oauth_info.email'));

        // 없으면 false
        if ($data->count() < 1) {
            return false;
        }

        $info = $data->first();
        self::setAuthenticated($info);

        // is_use = N 이면 false
        return !($info->is_use === 'N');
    }

    public static function setAuthenticated($data): void
    {
        $centerData = $data->centerTitle;

        if (!session()->has('user_info')) {
            session([
              'user_info' => [
                  'seq' => $data->seq,
                  'ct_seq' => $centerData->seq,
                  'ct_title' => $centerData->title,
                  'ct_name' => $centerData->name,
              ]
            ]);
        }
    }
}
