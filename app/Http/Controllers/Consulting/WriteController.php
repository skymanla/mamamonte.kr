<?php
/*
 * Copyright (c) 2021.5.23
 * author: ryan-dev
 */

namespace App\Http\Controllers\Consulting;

use App\Http\Controllers\Controller;
use App\Http\Helpers\UserAuthenticationHelper;
use App\Models\Member\Student;
use App\Models\Member\StudentState;
use App\Models\Payment\Payment;
use App\Models\StateCd;
use App\Models\Voc\Voc;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class WriteController extends Controller
{
    public function main()
    {
        // 로그인 및 인증 여부 확인
        if (!UserAuthenticationHelper::isAuthenticated()) {
            session()->flush();
            return view('contents.emptypop',
                [
                    'message' => "로그인해주시기 바랍니다"
                ]);
        }

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

        // 상담
        $voc = StateCd::where('is_use', 'Y')
            ->where('title_cd', 'V')
            ->orderBy('seq', 'asc')
            ->get();

        return view('contents.consulting.write',
        [
            'tabRequest' => 'consultingList',
            'progress' => $progress,
            'expression' => $expression,
            'semester' => $semester,
            'voc' => $voc
        ]);
    }

    // save
    public function saveConsulting(Request $request) {
        // 로그인 및 인증 여부 확인
        if (!UserAuthenticationHelper::isAuthenticated()) {
            session()->flush();
            abort(409);
        }

        // validation
        $validation = Validator::make(
            $request->all(),
            [
                'studentObj' => ['required', 'array'],
                'studentObj.name' => ['required'],
                'studentObj.birth' => ['required'],
                'studentObj.monthly' => ['required'],
                'studentObj.tel' => ['required'],
                'studentObj.first_come' => ['required', 'date'],
                'studentStateObj' => ['required', 'array'],
                'studentStateObj.p_state' => ['required'],
                'studentStateObj.e_state' => ['required'],
                'studentStateObj.seme_state' => ['required'],
                'vocObj' => ['required', 'array'],
                'vocObj.v_state' => ['required'],
                'vocObj.v_content' => ['required']
            ]
        );

        if ($validation->fails()) {
            abort(400, $validation->errors());
        }

        // 학생 기록 여부(중복 기록 방지)
        $studentCount = Student::where('ct_seq', session()->get('user_info.ct_seq'))
            ->where('name', $request->studentObj['name'])
            ->where('birth', $request->studentObj['birth'])->count();

        if ($studentCount > 0) {
            return response()->json(['status' => 'fail', 'message' => '이미 등록된 회원입니다']);
        }

        // student save
        $student = new Student();
        $student->name = $request->studentObj['name'];
        $student->birth = $request->studentObj['birth'];
        $student->first_monthly = $request->studentObj['monthly'];
        $student->first_come_date = $request->studentObj['first_come'];
        $student->tel = $request->studentObj['tel'];
        $student->ct_seq = session()->get('user_info.ct_seq');
        $student->user_idx = session()->get('user_info.seq');

        $student->save();

        // get last id
        $st_seq = $student->seq;

        // student_state save
        $studentState = new StudentState();
        $studentState->st_seq = $st_seq;
        $studentState->p_state_cd = $request->studentStateObj['p_state'];
        $studentState->e_state_cd = $request->studentStateObj['e_state'];
        $studentState->seme_state_cd = $request->studentStateObj['seme_state'];
        $studentState->user_idx = session()->get('user_info.seq');

        $studentState->save();

        // payment info save
        if ($request->has('payInfoObj') && $request->has('payInfoObj.payDt') && $request->has('payInfoObj.payInfo') && $request->has('payInfoObj.price')) {
            $payment = new Payment();
            $payment->st_seq = $st_seq;
            $payment->pay_dt = $request->payInfoObj['payDt'];
            $payment->info = $request->payInfoObj['payInfo'];
            $payment->price = $request->payInfoObj['price'];
            $payment->user_idx = session()->get('user_info.seq');
            $payment->save();
        }

        // voc save
        $voc = new Voc();
        $voc->ct_seq = session()->get('user_info.ct_seq');
        $voc->st_seq = $st_seq;
        $voc->kinds = $request->vocObj['voc_kinds'];
        $voc->v_state_cd = $request->vocObj['v_state'];
        $voc->contents = $request->vocObj['v_content'];
        $voc->user_idx = session()->get('user_info.seq');
        $voc->save();

        return response()->json(['status' => 'success', 'message' => '상담 추가 완료되었습니다']);
    }
}
