@extends('main')
@section('subcss')
    <link rel="stylesheet" href="{{ asset('css/account.css') }}?v={{ time() }}" />
@endsection
@section('content')
    <section class="container-section">
        <form method="post" name="modForm" id="modForm">
            <div class="inner">
                <h1>회원 가입</h1>
                <div class="add-list">
                    <div>
                        <label for="register_info">안내사항</label>
                        <span style="color:#0972a5">* 연락처 및 이메일은 사용등록 완료 후 안내를 위해 사용됩니다</span>
                    </div>
                    <div>
                        <label for="name">이름</label>
                        <label>
                            <input type="text" name="name" required />
                        </label>
                    </div>
                    <div>
                        <label for="tel">연락처</label>
                        <span>{{ $oauthInfo['phone'] }}</span>
                    </div>
                    <div>
                        <label for="email">이메일</label>
                        <span>{{ $oauthInfo['email'] }}</span>
                    </div>
                    <div>
                        <label for="centerTitle">센터 선택</label>
                        <select name="centerTitle" id="centerTitle">
                            @foreach($centerList as $center)
                                <option value="{{ $center->seq }}">{{ $center->title . " " . $center->name }}</option>
                            @endforeach
                        </select>
                    </div>
                </div>
                <!-- STR 최종수정 및 버튼 -->
                <hr>
                <div class="btns">
                    <button type="button" onclick="goCancel();" id="cancelMyformBtn">취소</button>
                    <button type="button" onclick="goModify();" class="active" id="addMyformBtn" data-type="mod">가입</button>
                </div>
                <!-- END 최종수정 및 버튼 -->
            </div>
        </form>
    </section>
@endsection

@section('subscript')
    <script type="text/javascript" src="{{ asset('js/account.js') }}?v={{ time() }}"></script>
@endsection
