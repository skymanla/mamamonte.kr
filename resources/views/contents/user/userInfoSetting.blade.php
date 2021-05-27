@extends('main')
@section('subcss')
    <link rel="stylesheet" href="{{ asset('css/account.css') }}?v={{ time() }}" />
@endsection
@section('content')
    <section class="container-section">
        <form method="post" name="modForm" id="modForm">
            <div class="inner">
                <h1>센터 설정</h1>
                <div class="add-list">
                    <div>
                        <label for="name">센터 선택</label>
                        <select name="" id="centerTitle">
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
                    <button type="button" onclick="goModify();" class="active" id="addMyformBtn" data-type="mod">저장</button>
                </div>
                <!-- END 최종수정 및 버튼 -->
            </div>
        </form>
    </section>
@endsection

@section('subscript')
    <script type="text/javascript" src="{{ asset('js/account.js') }}?v={{ time() }}"></script>
@endsection
