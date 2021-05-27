<?php
/*
 * Copyright (c) 2021.5.13
 * author: ryan-dev
 */

namespace App\Http\Controllers;

use App\Http\Utils\RedirectUtils;
use Illuminate\Http\Request;

class MainController extends Controller
{
    // Login Main
    public function main() {

        if (session()->has('oauth_info')) {
            return RedirectUtils::redirectUserInfo();
        }

        $redirectURI  = urlencode(env('NAVER_OAUTH_CALLBACK_URL'));
        $client_id  = env('NAVER_OAUTH_CLIENT_ID');
        $state = "RAMDOM_STATE";

        $apiURL = "https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=".$client_id."&redirect_uri=".$redirectURI."&state=".$state;
        return view('contents.login',
        [
          'naverUrl' => $apiURL
        ]);
    }
}
