@extends('main')
@section('subcss')
    <link rel="stylesheet" href="{{ asset('css/list.css') }}?v={{ time() }}" />
@endsection
@section('content')
    @include('common.menu', ['tabRequest', $tabRequest])
    <section class="container-section">
        <section class="list-wrapper">
            <!-- functions-wrapper -->
            <div class="functions-wrapper">
                <form name="searchForm" id="searchForm" class="filter filter-spacing-adjust2">
                    <div class="order-filter">
                        <select name="progress">
                            <option value="all">전체진행상태</option>
                            @foreach($progress as $pitem)
                                <option value="{{ $pitem->code }}">{{ $pitem->title }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="date-filter flex-center">
                        <input type="text" name="txtDate" class="mi-datepicker" id="miDatepicker" autocomplete="off" readonly />
                    </div>
                    <div class="search-filter">
                        <select>
                            <option selected>이름</option>
                        </select>
                        <input type="text" name="txtKeyfield" id="txtKeyfield" />
                        <div class="filter-btn-wrapper">
                            <button type="submit" class="search active" id="searchBtn">검색</button>
                            <button type="button" id="searchResetBtn">초기화</button>
                        </div>
                    </div>
                </form>
                <div class="result-total">
                    <div>검색개수 :&nbsp;<span>{{ $list->total() }}</span></div>
                </div>
                <div class="function">
                    <div class="function-btns">
                        <button class="refresh-bt" id="refreshBtn"><i class="mi-text-hidden">새로고침</i></button>
                    </div>
                    <div class="function-statistics">
                        <button class="btn-go-consulting-write" onclick="location.href='{{ route('consulting.write') }}'">상담추가</button>
                    </div>
                </div>
            </div>
            <!-- functions-wrapper -->
            <table class="table main-table driver-table">
                <colgroup></colgroup>
                <thead>
                <tr>
                    <th><input type="checkbox" name="" id="selectAll"></th>
                    <th>접수일시</th>
                    <th>이름</th>
                    <th>최초 개월 수</th>
                    <th>생년월일</th>
                    <th>연락처</th>
                    <th>진행사항</th>
                    <th>체험수업</th>
                    <th>학기상태</th>
                    <th>최초 등록일</th>
                    <th>결제내용</th>
                    <th>상담</th>
                </tr>
                </thead>
                <tbody>
                @foreach($list as $item)
                    <tr data-seq="{{ $item->seq }}">
                        <td><input type="checkbox" name="" /></td>
                        <td>{{ $item->first_come_date }}</td>
                        <td class="userName">{{ $item->name }}</td>
                        <td>{{ $item->first_monthly }}</td>
                        <td>{{ $item->birth }}</td>
                        <td>{{ $item->tel }}</td>
                        <td>
                            <select name="progressItem">
                                @foreach($progress as $pitem)
                                    <option value="{{ $pitem->code }}" @if($item->studentState->p_state_cd === $pitem->code) selected @endif>{{ $pitem->title }}</option>
                                @endforeach
                            </select>
                        </td>
                        <td>
                            <select name="expressionItem">
                                @foreach($expression as $eitem)
                                    <option value="{{ $eitem->code }}" @if($item->studentState->e_state_cd === $eitem->code) selected @endif>{{ $eitem->title }}</option>
                                @endforeach
                            </select>
                        </td>
                        <td>
                            <select name="semesterItem">
                                @foreach($semester as $sitem)
                                    <option value="{{ $sitem->code }}" @if($item->studentState->seme_state_cd === $sitem->code) selected @endif>{{ $sitem->title }}</option>
                                @endforeach
                            </select>
                        </td>
                        <td>{{ $item->paymentInfo->pay_dt ?? '-' }}</td>
                        <td>
                            @if($item->paymentInfo->info !== '-')
                                {{ $item->paymentInfo->info. '_'. $item->paymentInfo->price }}
                            @else
                                {{ $item->paymentInfo->info }}
                            @endif
                        </td>
                        <td>
                            <button type="button" class="show-btn btn-template-consult">상세</button>
                        </td>
                    </tr>
                @endforeach
                </tbody>
            </table>
        </section>
        <div class="pagination-wrapper">
            <ul class="pagination">
                <li class="page-item"><a class="page-link" ><<</a></li>
                <li class="page-item"><a class="page-link active" >1</a></li>
                <li class="page-item"><a class="page-link" >>></a></li>
            </ul>
        </div>
    </section>
@endsection

@section('subscript')
    <script type="text/javascript" src="{{ asset('js/boardList.js') }}?v={{ time() }}"></script>
@endsection
