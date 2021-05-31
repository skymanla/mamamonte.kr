<?php
/*
 * Copyright (c) 2021.5.14
 * author: ryan-dev
 */

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Helpers\UserAuthenticationHelper;
use App\Http\Utils\RedirectUtils;
use App\Models\Center\CenterTitle;
use App\Models\User\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserInformationController extends Controller
{
    // User Information default consulting
    public function main()
    {
        // session check
        if (!session()->has('oauth_info')) {
            return RedirectUtils::redirectMain();
        }

        $data = User::where('email', session()->get('oauth_info.email'));

        // 검색이 되지 않으면 새로운 유저 데이터를 만들기 위한 페이지로 이동
        if ($data->count() === 0) {
            // center_title 가져오기
            $centerList = CenterTitle::where('is_use', 'Y')->orderBy('seq', 'asc')->get();

            return view('contents.user.userInfoSetting',
            [
                'centerList' => $centerList,
                'oauthInfo' => [
                    'email' => session()->get('oauth_info.email'),
                    'phone' => session()->get('oauth_info.phone')
                ]
            ]);
        }

        // 아직 인증되지 않았다면
        if (!UserAuthenticationHelper::isAuthenticated()) {
            session()->flush();
            return view('contents.emptypop',
                [
                    'message' => "인증 대기 중입니다<br>관리자에게 문의바랍니다"
                ]);
        }

        // 인증된 사용자
        return RedirectUtils::redirectConsultingList();
    }

    // User Center Title save
    public function saveCenterTitle(Request $request)
    {
        $validation = Validator::make(
            $request->all(),
            [
                'seq' => ['required', 'numeric'],
                'name' => ['required']
            ]
        );

        if ($validation->fails()) {
            abort(400, $validation->errors());
        }

        // session -> 변수 전환
        $oauthType = session()->get('oauth_info.type');
        $id = session()->get('oauth_info.id');
        $email = session()->get('oauth_info.email');
        $name = $request->name;
        $tel = session()->get('oauth_info.phone');

        // 존재하는 회원인지 확인
        if (!self::hasUser($email)) {
            return response()->json(['status' => 'fails', 'message' => "이미 존재하는 이메일입니다\n관리자에게 문의해주세요"]);
        }

        // save user
        $user = new User();
        $user->ct_seq = $request->seq;
        $user->oauth_type = $oauthType;
        $user->id = $id;
        $user->email = $email;
        $user->name = $name;
        $user->tel = $tel;
        $user->save();

        // save 되면 session 에 ct_seq 를 담아둠
        session(['ct_seq' => $request->seq]);

        return response()->json(['status' => 'success', 'message' => "센터 사용 신청이 완료되었습니다\n관리자 승인 후 사용가능합니다"]);
    }

    private static function hasUser($email)
    {
        $user = User::where('email', $email);

        return !($user->count() > 0);
    }
}
