@extends('main')
@section('subcss')
    <link rel="stylesheet" href="{{ asset('css/account.css') }}?v={{ time() }}" />
@endsection
@section('content')
    @include('common.menu', ['tabRequest', $tabRequest])
    <section class="container-section">
        <form method="post" name="regForm" id="regForm" autocomplete="off" onsubmit="return false;">
            <div class="inner">
                <h1>상담 추가</h1>
                <div class="add-list">
                    <div>
                        <label for="first_come">접수일시</label>
                        <div>
                            <input type="text" name="first_come" id="first_come" class="mi-datepicker" autocomplete="off" placeholder="최초접수일" readonly />
                        </div>
                    </div>
                    <div>
                        <label for="name">이름</label>
                        <div><input type="text" name="name" id="name" minlength="2" maxlength="5" required /></div>
                    </div>
                    <div>
                        <label for="monthly">개월수</label>
                        <div><input type="text" name="monthly" id="monthly" required /></div>
                    </div>
                    <div>
                        <label for="tel">전화번호</label>
                        <div><input type="text" name="tel" id="tel" minlength="10" maxlength="11"/></div>
                    </div>
                    <div>
                        <label for="birth_y">생년월일</label>
                        <div>
                            <input type="text" name="birth_y" id="birth_y" maxlength="4" placeholder="YYYY" />
                        </div>
                        <div>
                            <input type="text" name="birth_m" id="birth_m" maxlength="2" placeholder="MM" />
                        </div>
                        <div>
                            <input type="text" name="birth_d" id="birth_d" maxlength="2" placeholder="DD" />
                        </div>
                    </div>
                    <div>
                        <label for="progressItem">진행상태</label>
                        <div>
                            <select name="progressItem" id="progressItem">
                                @foreach($progress as $p)
                                    <option value="{{ $p->code}}">{{ $p->title }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                    <div>
                        <label for="expressionItem">체험수업</label>
                        <div>
                            <select name="expressionItem" id="expressionItem">
                                @foreach($expression as $e)
                                    <option value="{{ $e->code}}">{{ $e->title }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                    <div>
                        <label for="semesterItem">학기안내</label>
                        <div>
                            <select name="semesterItem" id="semesterItem" onchange="semeOnchangeFn($(this))">
                                @foreach($semester as $s)
                                    <option value="{{ $s->code}}">{{ $s->title }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                    <div class="pay_task">
                        <label for="first_pay">최초 등록일(결제)</label>
                        <div>
                            <input type="text" name="first_pay" id="first_pay" class="mi-datepicker" autocomplete="off" placeholder="최초 등록일" readonly />
                        </div>
                    </div>
                    <div class="pay_task">
                        <label for="pay_info">결제내용</label>
                        <div>
                            <input type="radio" name="pay_info" value="card" /> 카드 <br>
                            <input type="radio" name="pay_info" value="cash" /> 현금
                        </div>
                        <div>
                            <input type="text" name="price" id="pay_info" placeholder="결제금액" />
                        </div>
                    </div>
                    <div>
                        <label for="voc_title">상담종류</label>
                        <div>
                            <input type="radio" name="voc_kinds" value="K" checked="checked" /> 카톡 <br>
                            <input type="radio" name="voc_kinds" value="C" /> 전화
                        </div>
                        <div>
                            <select name="voc_title" id="voc_title">
                                @foreach($voc as $v)
                                    <option value="{{ $v->code }}">{{ $v->title }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                    <div>
                        <label for="voc_content">상담내용</label>
                        <div>
                            <input type="text" name="voc_content" id="voc_content" placeholder="상담내용" />
                        </div>
                    </div>
                </div>

                <hr>
                <div class="btns" style="padding-bottom: 10px">
                    <button type="button" id="cancelAddBtn">취소</button>
                    <button type="button" class="active" id="addAccountBtn" data-type="add">저장</button>
                </div>

            </div>
        </form>
    </section>
@endsection

@section('subscript')
    <script type="text/javascript" src="{{ asset('js/consulting.js') }}?v={{ time() }}"></script>
@endsection
