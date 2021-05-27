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
                        <select>
                            <option value="" selected>전체 진행상태</option>
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
                    <div>검색개수 :&nbsp;<span>1</span></div>
                </div>
            </div>
            <!-- functions-wrapper -->
            <table class="table main-table driver-table">
                <colgroup></colgroup>
                <thead>
                    <tr>
                        <th><input type="checkbox" name="" id="selectAll"></th>
                        <th>이름</th>
                        <th>접수날짜</th>
                        <th>생년월일</th>
                        <th>상담시 개월 수</th>
                        <th>연락처</th>
                    </tr>
                </thead>
                <tbody>
                <tr>
                    <td><input type="checkbox" name="" /></td>
                    <td>김남태</td>
                    <td>Y.m.d H:i:s</td>
                    <td>없으면 -</td>
                    <td>24</td>
                    <td>010-2517-4882</td>
                </tr>
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
