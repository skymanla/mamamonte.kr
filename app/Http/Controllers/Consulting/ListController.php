<?php
/*
 * Copyright (c) 2021.5.22
 * author: ryan-dev
 * 상담기록지 List
 */

namespace App\Http\Controllers\Consulting;

use App\Http\Controllers\Controller;
use App\Http\Helpers\UserAuthenticationHelper;
use App\Models\Member\Student;
use App\Models\StateCd;
use App\Models\Voc\Voc;
use Illuminate\Http\Request;

class ListController extends Controller
{
    public function main(Request $request)
    {
        // 로그인 및 인증 여부 확인
        if (!UserAuthenticationHelper::isAuthenticated()) {
            session()->flush();
            return view('contents.emptypop',
                [
                    'message' => "로그인해주시기 바랍니다"
                ]);
        }

        // get list
        $list = Student::with([
            'studentState' => static function ($studentState) {
                $studentState->orderBy('seq', 'desc');
            },
            'paymentInfo' => static function ($paymentInfo) {
                $paymentInfo->orderBy('seq', 'desc');
            },
            'voc' => static function ($voc) {
                $voc->orderBy('seq', 'desc');
            }
        ]);

        // TODO: 검색 관련 데이터
        $list = $list->orderBy('students.seq', 'desc')->paginate(10);

//         return response()->json(['data' => $list]);

        // 진행상태 값
        $progress = StateCd::where('is_use', 'Y')
            ->where('title_cd', 'P')
            ->orderBy('seq', 'asc')
            ->get();

        // 체험상태 값
        $expression = StateCd::where('is_use', 'Y')
            ->where('title_cd', 'E')
            ->orderBy('seq', 'asc')
            ->get();

        // 학기상태 값
        $semester = StateCd::where('is_use', 'Y')
            ->where('title_cd', 'S')
            ->orderBy('seq', 'asc')
            ->get();

        return view('contents.consulting.list',
        [
            'tabRequest' => 'consultingList',
            'progress' => $progress,
            'expression' => $expression,
            'semester' => $semester,
            'list' => $list,
        ]);
    }

    public function vocDetailAPI(Request $request, $seq)
    {
        // 로그인 및 인증 여부 확인
        if (!UserAuthenticationHelper::isAuthenticated()) {
            session()->flush();
            abort(409);
        }

        // validation
        $validation = Validator::make(
            $request->all(),
            [
                'voc_kinds' => ['required'],
                'voc_type' => ['required'],
                'vocContent' => ['required']
            ]
        );

        if ($validation->fails()) {
            abort(400, $validation->errors());
        }

        $voc = new Voc();
        $voc->st_seq = $seq;
        $voc->ct_seq = session()->get('user_info.ct_seq');
        $voc->user_idx = session()->get('user_info.seq');
        $voc->kinds = $request->voc_kinds;
        $voc->v_state_cd = $request->voc_type;
        $voc->contents = $request->vocContent;

        $voc->save();

        // 전체 리스트 다시 전달
        $vocList = Voc::where('ct_seq', session()->get('user_info.ct_seq'))
            ->where('st_seq', $seq)
            ->orderBy('seq', 'desc')
            ->get();
    }
}
