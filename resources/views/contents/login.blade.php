@extends('main')
@section('subcss')
    <link rel="stylesheet" href="{{ asset('css/login.css') }}?v={{ time() }}" />
@endsection
@section('content')
    <div class="login-wrapper">
        <div class="login-title-wrapper">
            <h1>마마몽떼 관리자 로그인</h1>
        </div>
        <form action="" method="post" id="LoginForm">
            <div class="oauth-form">
                <img class="naver_oauth" src="{{ asset('image/naver/btnD_complete.png') }}" alt="naver 로그인 " />
            </div>
        </form>
    </div>

    <script>
        $('.naver_oauth').on('click', function() {
          location.href = "{{ $naverUrl }}";
        });
    </script>
@endsection
