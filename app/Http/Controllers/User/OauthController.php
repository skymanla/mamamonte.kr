<?php
/*
 * Copyright (c) 2021.5.14
 * author: ryan-dev
 */

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Utils\RedirectUtils;
use Illuminate\Http\Request;

class OauthController extends Controller
{
    public function oauthReceivers(Request $request, $oauthType)
    {
        // oauth session check
        if (session()->has('oauth_info')) {
            return RedirectUtils::redirectUserInfo();
        }

        if ($oauthType === 'naver') {
            if (!$request->has('code') && !$request->has('state')) {
                return RedirectUtils::redirectMain();
            }
            // 네이버 로그인
            $client_id = env('NAVER_OAUTH_CLIENT_ID');
            $client_secret = env('NAVER_OAUTH_CLIENT_SECRET');
            $code = $request->code;
            $state = $request->state;
            $redirectURI = urlencode(env('NAVER_OAUTH_CALLBACK_URL'));
            $url = "https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id="
                .$client_id
                ."&client_secret=".$client_secret
                ."&redirect_uri=".$redirectURI
                ."&code=".$code
                ."&state=".$state;

            $is_post = false;
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_POST, $is_post);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $headers = array();
            $response = curl_exec ($ch);
            $status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

            curl_close ($ch);

            if ($status_code !== 200) {
                return RedirectUtils::redirectMain();
            }

            $naverProfile = json_decode($this->getNaverProfile(json_decode($response, true)), true);

            if (empty($naverProfile['response']['email'])) {
                return RedirectUtils::redirectMain();
            }

            session([
                'oauth_info' => [
                    'id' => $naverProfile['response']['id'],
                    'email' => $naverProfile['response']['email'],
                    'phone' => $naverProfile['response']['mobile'],
                    'type' => $oauthType,
                ]
            ]);
        } else {
            // for kakao
        }

        return RedirectUtils::redirectUserInfo();
    }

    private function getNaverProfile($receiver)
    {
        if (!isset($receiver['access_token'])) {
            return RedirectUtils::redirectMain();
        }

        $token = $receiver['access_token'];
        $header = "Bearer ".$token; // Bearer 다음에 공백 추가
        $url = "https://openapi.naver.com/v1/nid/me";

        $is_post = false;
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, $is_post);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $headers = array();
        $headers[] = "Authorization: ".$header;
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        $response = curl_exec ($ch);
        $status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        curl_close ($ch);

        if ($status_code !== 200) {
            return RedirectUtils::redirectMain();
        }

        return $response;
    }
}
