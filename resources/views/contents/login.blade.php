@extends('main')
@section('content')
    <div class="login-box">
        <h1>센터관리자</h1>
        <p class="copy">센터관리자 로그인 서비스</p>
        <form action="" method="post" name="LoginForm">

            <button type="button" onclick="document.LoginForm.submit()">로그인</button>
            <div class="label-wrap"><input type="checkbox" id="email-save" name="emailSave"><label for="email-save">이메일 저장</label></div>
        </form>
    </div>
@endsection
