var commonJS = {
    header: $("meta[name='_csrf_header']").attr("content"),
    token: $("meta[name='_csrf']").attr("content"),
    currentPathname : location.pathname,
    sessErrorCode: 'ERR_SESSION_TIMEOUT', // 세션 만료 코드
    getCookie : function(cookieKey) { // 쿠키 가져오기
        var cookieArr = document.cookie.split(';'),
            cookieKey = cookieKey + '=',
            result = '';

        for(var i = 0; i < cookieArr.length; i++) {
            if(cookieArr[i][0] === " ") {
            cookieArr[i] = cookieArr[i].substring(1);
            }

            if(cookieArr[i].indexOf(cookieKey) === 0) {
                result = cookieArr[i].slice(cookieKey.length, cookieArr[i].length);
            }
        }

        return result;
    },
    goPage : function(page, perPageNum, url) { // 페이지 이동
        var formObj = $('#searchForm');

        formObj.attr("action", url);
        formObj.attr("method", "get");
        formObj.append('<input type="hidden" value="' + page + '" name="page">');
        formObj.submit();
    },
    dateFormatter : function(date){ // 날짜 포맷팅 (yyyy-MM-dd)
        var year = date.getFullYear(),
            month = (date.getMonth() + 1 >= 10) ? date.getMonth() + 1 : '0' + (date.getMonth()+1),
            day = (date.getDate() > 10) ? date.getDate() : '0' + date.getDate();

        return year + '-' + month  + '-' + day;
    },
    excelDownload : function(data, url){ // 엑셀 다운로드
        $('body').prepend('<div class="loading-spinner-wrap"><div class="big-spinner"></div><div class="small-spinner"></div></div>');
        data._csrf = commonJS.token;

        $.fileDownload(
            url,
            {
                httpMethod: 'POST',
                data: $.param(data),
                successCallback: function() {
                    $('.loading-spinner-wrap').remove();
                    $('iframe').remove();
                    console.info('download success');
                },
                failCallback: function() {
                    $('.loading-spinner-wrap').remove();
                    $('iframe').remove();
                    console.error('download fail');
                    alert('다운로드 실패 :(');
                }
            }
        )
    },
    alertPop: function(message, callback) { // 알림 팝업
        if(callback){
            miDesignPop.alert({
                dTarget: 'alert-pop-callback',
                dConHe: 110,
                dCopy: message,
                dYesAc: function(){
                    callback();
                }
            });
        }else{
            miDesignPop.alert({
                dTarget: 'alert-pop-nocallback',
                dConHe: 110,
                dCopy: message,
            });
        }
    },
    removePop: function() { // 팝업 전체삭제
        $('.mi-common-pop').remove();
        $('html').removeClass('mi-scroll-none');
    },
    checkValueAct: { // 유효성검사 (휴대폰번호, 이메일, 주민번호 등)
        resetWarnBox: function(){ // warning-box reset
            $('.warning-box').text('');
        },
        checkPhone: function(element) { // 휴대폰번호
            var tel = $(element),
                telVal = tel.val(),
                telValFr = telVal.substr(0, 3),
                telValLen = telVal.length;

            checkValueAct.resetWarnBox();

            if (telValLen < 10) { // 전화번호가 1자리 미만인 경우
                $('.warning-box').text('휴대폰번호를 정확하게 입력해 주세요');
                tel.focus();
                return false;
            }

            if (!miValidate.isTelFrCheck(telValFr)) { // 휴대폰 앞자리
                $('.warning-box').text('010, 011, 016, 017, 018, 019 만 입력가능합니다');
                tel.focus();
                return false;
            }

            return telVal;
        },
        checkSid: function(sid1Ele, sid2Ele) {
            var sid1 = $(sid1Ele),
                sid2 = $(sid2Ele),
                sid1Val = sid1.val(),
                sid2Val = sid2.val(),
                fullSid = sid1Val + sid2Val;

            checkValueAct.resetWarnBox();

            if (sid1Val.length != 6 || sid2Val.length != 7 || !miValidate.isMemNumCheck(fullSid)) { // 전화번호가 1자리 미만인 경우
                $('.warning-box').text('주민등록번호를 정확하게 입력해 주세요');
                sid1.focus();
                return false;
            }

            return {
                sid1: sid1Val,
                sid2: sid2Val
            };
        },
        checkEmail: function(idEle, domainEle) {
            var domain = $(domainEle),
                id = $(idEle),
                domainVal = domain.val(),
                idVal = id.val(),
                fullEmail = idVal + '@' + domainVal;

            if(!idVal || !domainVal){
                $('.warning-box').text('이메일을 입력해주세요');
                id.focus();
                return false;
            }

            console.log(fullEmail);
            if(!miValidate.isEmailCheck(fullEmail)){ // 값이 올바르지 않을 때
                $('.warning-box').text('이메일을 정확히 입력해주세요');
                id.focus();
                return false;
            }

            return {
                id: idVal,
                domain: domainVal
            };
        }
    },
    emailInputAct: function(email1, email2, emailChange) { // 이메일 input 관련 action

        // STR 이벤트 버블링 방지용 event off 처리
        $(document).off('keyup', email1 + ',' + email2);
        $(document).off('focusout', email2);
        $(document).off('change', emailChange);
        // END 이벤트 버빌링 방지용 event off 처리

        $(document).on('keyup', email1 + ',' + email2, function () { // 메일 주소 공백 제거
            var _This = $(this),
                val = _This.val(),
                relVal = miValidate.isSpaceDelete(val);

            _This.val(relVal);
        });

        $(document).on('focusout', email2, function () { // 메일2 (주소 직접 입력 input)
            var _This = $(this),
                val = _This.val(),
                emailChangeEle = $(emailChange),
                email2Ele = $(email2);

            if(val){
                emailChangeEle.find('option').each(function(){ // 입력한 값이 select 박스에 있으면 선택 처리
                    var _sThis = $(this),
                        d = _sThis.val();
                    if( d == val){
                        email2Ele.hide();
                        emailChangeEle.val(val).trigger('change');
                        return;
                    }
                });
            }
        });

        $(document).on('change', emailChange, function() { // 메일 select box
            var _This = $(this),
                val = _This.val(),
                email2Ele = $(email2);

            if(val == 'custom'){
                email2Ele.show().val('').focus();
            } else {
                email2Ele.hide().val(val);
            }
        });
    }
}

var selectAll = $('#selectAll'), // 리스트 전체선택
    listCheckbox = $('input[type=checkbox]'), // 리스트 체크박스

    menuSelect = $('#insuMenus'), // 메뉴 select

    pageLinkA = $('.page-link'),

    SEARCH_FORM = $('#searchForm'),
    searchBtn = $('#searchBtn'), // 검색 버튼
    searchResetBtn = $('#searchResetBtn'), // 검색 초기화
    radioDateRangeName = 'input[name="dateSelect"]', // 개월수 검색 radio 이름
    radioDateRange = $('input[name="dateSelect"]'); // 개월수 검색 radio

searchBtn.on('click', function() { // 검색
    var dateInput = $('#miDatepicker'),
        dateVal =  dateInput.val();

    if(dateInput.length > 0){
        if(dateVal.indexOf('~') < 0){ // 하루만 선택
            dateInput.val(dateVal + ' ~ ' + dateVal);
        }
    }

    if(radioDateRange.length > 0 && !$(radioDateRangeName + ':checked').val()){ // 펫보험이고 날짜 range 선택이 없을시 (기본값이 3이기 때문에 바꿔서 보내줘야함)
        $('#searchForm').append('<input type="hidden" name="dateSelect" value="-1"></input>');
    }

    $('#searchForm').attr('onsubmit', 'return true');
});

pageLinkA.on('click', function() {
    var pageIdx = $(this).data('page');
    if (pageIdx) {
        var f = document.getElementById('searchForm');
        var page = document.createElement('input');
        page.setAttribute('type', 'hidden');
        page.setAttribute('name', 'page');
        page.setAttribute('value', pageIdx);

        f.appendChild(page);
    }
    $('#searchForm').attr('onsubmit', 'return true').submit();
});

selectAll.on("click", function() { // 전체선택
    if(selectAll.prop("checked")){
        $('input[type=checkbox]').not(":disabled").prop("checked",true);
    }else{
        $('input[type=checkbox]').prop("checked",false);
    }
});

menuSelect.on('change', function() { // 메뉴 select change
    var _This = $(this),
        level = _This.data('level'),
        thisVal = _This.val();

    if(level == 4){ // 보험사
        switch(thisVal){
            case 'traveler':
                location.href = '/travel/insurance';
                break;
            case 'driver':
                location.href = '/driver/insurance';
                break;
            case 'pet':
                location.href = '/pet/insurance';
                break;
            case 'mountain':
                // TODO : 등산 관리자로 연결 @Jinn
                location.href = '/building';
                break;
        }
    }else{
        switch(thisVal){
            case 'traveler':
                location.href = '/travel/short';
                break;
            case 'driver':
                location.href = '/midriver/main';
                break;
            case 'pet':
                location.href = '/pet/animal/student';
                break;
            case 'mountain':
                // TODO : 등산 관리자로 연결 @Jinn
                location.href = '/building';
                break;
            case 'silbi':
                location.href = '/silbi/student';
                break;
            case 'micare':
                location.href = '/micare/device';
                break;
        }
    }
});

radioDateRange.on('change', function() { // 개월 radio 선택
    var _This = $(this),
        month = _This.val(),
        date = new Date(),
        searchStartDate = commonJS.dateFormatter(new Date(date.getFullYear(), date.getMonth()-month)), // 검색 시작일
        searchEndDate = commonJS.dateFormatter(new Date(date.getFullYear(), date.getMonth()+1, 0)), // 검색 마지막일 (이번달의 마지막 날)
        searchDate = searchStartDate + ' ~ ' + searchEndDate; // n개월 최종 검색일

    $('#miDatepicker').val(searchDate);
});

// STR datepicker
var dateFilter = $('.date-filter'),
    targetDiv = '.date-filter',
    miDatepicker = $('#miDatepicker'), // datepicker
    targetInput = '#miDatepicker',
    targetWidget = $(targetDiv).find('.ui-widget'),
    miNumberOfMonths = 2;

//datepicker 한글화 설정
$.datepicker.regional['ko'] = {
    closeText: '닫기',
    prevText: '이전달',
    nextText: '다음달',
    currentText: '오늘',
    monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    dayNames: ['일', '월', '화', '수', '목', '금', '토'],
    dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
    dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
    weekHeader: 'Wk',
    dateFormat: "yy-mm-dd", // 텍스트 필드에 입력되는 날짜 형식
    firstDay: 0,
    isRTL: false,
    showMonthAfterYear: true,
    yearSuffix: '년'
};
$.datepicker.setDefaults($.datepicker.regional['ko']);

dateFilter.datepicker({
    dateFormat: "yy-mm-dd",
    changeYear: true,
    changeMonth: true,
    onSelect: function (selectedDate, t) {
        var dData = $(this).data().datepicker; // datepicker data

        if (!dData.pickDate) { // 선택 전
            dData.pickDate = true; // 선택 유무
            dData.startDay = selectedDate; // 시작일
            delete dData.endDay; // 종료일 삭제
        } else { // 선택 후
            dData.endDay = selectedDate; // 종료일

            if (dData.startDay > selectedDate) { // 종료일이 시작일보다 작을 경우
                if(Number(selectedDate.substring(0, 4)) < 2018 && commonJS.currentPathname.indexOf('domestic') < 0 && commonJS.currentPathname.indexOf('travel') > -1){ // 해외여행자보험일 경우 2018이전이면 그 해만 검색 가능
                    dData.startDay = selectedDate.substring(0, 4)+'-01-01';
                }else{
                    dData.endDay = dData.startDay;
                    dData.startDay = selectedDate;
                }

            }

            if (dData.endDay) { // 종료일이 있다면
                delete dData.pickDate; // 선택 유뮤 삭제
            }
        }

        var startDay = dData.startDay, // 시작일
            endDay = dData.endDay, // 종료일
            appendDate = startDay; // 시작일 ~ 종료일

        if(Number(startDay.substring(0, 4)) < 2018 && commonJS.currentPathname.indexOf('domestic') < 0 && commonJS.currentPathname.indexOf('travel') > -1){ // 해외여행자보험일 경우 2018이전이면 그 해만 검색 가능
            $(this).datepicker('option', 'minDate', new Date(startDay.substring(0, 4)+'-01-01'));
            $(this).datepicker('option', 'maxDate', new Date(startDay.substring(0, 4)+'-12-31'));
        }

        if (endDay) {
            appendDate = startDay + ' ~ ' + endDay;
        }
        $(targetInput).val(appendDate);
        if (startDay && endDay) {

            var checkedMonth = $(radioDateRangeName+':checked').val();

            // 실비보험 분기
            if(commonJS.currentPathname.indexOf('silbi') > -1) {
                $('input[name=dateSelectSilbi]:checked').prop('checked', false);
                $('input[name=hiddenSelect]').val('');
                $('input[name=sDate]').val(startDay);
                $('input[name=eDate]').val(endDay);
            }

            if(checkedMonth){
                var date = new Date(),
                    checkedStartDate = '',
                    checkedEndDate = '';

                if(commonJS.currentPathname.indexOf('pet') > -1){
                    checkedStartDate = commonJS.dateFormatter(new Date(date.getFullYear(), date.getMonth()-checkedMonth, date.getDate()));
                    checkedEndDate = commonJS.dateFormatter(new Date());
                }else{
                    checkedStartDate = commonJS.dateFormatter(new Date(date.getFullYear(), date.getMonth()-checkedMonth));
                    checkedEndDate = commonJS.dateFormatter(new Date(date.getFullYear(), date.getMonth()+1, 0));
                }

                if(checkedStartDate != startDay || checkedEndDate != endDay){ // radio button active 풀기
                    $(radioDateRangeName+':checked').prop('checked', false);
                }
            }else{
                var date = new Date(),
                    buttonMonths = [1, 3, 6, 9, 12],
                    buttonEndDate = '';

                if(commonJS.currentPathname.indexOf('pet') > -1){
                    buttonEndDate = commonJS.dateFormatter(new Date());
                }else{
                    buttonEndDate = commonJS.dateFormatter(new Date(date.getFullYear(), date.getMonth()+1, 0));
                }

                // 실비보험 분기
                if(commonJS.currentPathname.indexOf('silbi') > -1) {
                    buttonEndDate = commonJS.dateFormatter(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
                }

                if(endDay == buttonEndDate){
                    for(var i = 0; i < buttonMonths.length; i++ ){
                        var buttonStartDate = '';

                        if(commonJS.currentPathname.indexOf('pet') > -1){
                            buttonStartDate = commonJS.dateFormatter(new Date(date.getFullYear(), date.getMonth()-buttonMonths[i], date.getDate()));
                        }else{
                            buttonStartDate = commonJS.dateFormatter(new Date(date.getFullYear(), date.getMonth()-buttonMonths[i]));
                        }

                        // 실비보험 분기
                        if(commonJS.currentPathname.indexOf('silbi') > -1) {
                            buttonStartDate = commonJS.dateFormatter(new Date(date.getFullYear(), date.getMonth()-buttonMonths[i], date.getDate()));
                        }

                        if(startDay == buttonStartDate){ // 범위에 해당하는 버튼 active
                            $('#plus'+buttonMonths[i]).prop('checked', 'checked');
                        }
                    }
                }

                if(commonJS.currentPathname.indexOf('biztalk') > -1){ // 운전자 알림톡 로그
                    $(SEARCH_FORM).attr('onsubmit', true);
                    $(SEARCH_FORM).submit();
                }
            }

            setTimeout(function () {
                targetWidget.fadeOut(200);
            }, 300);
        }
    },
    beforeShowDay: function (date) {
        var dData = $(this).data().datepicker, // datepicker data
            startDay = ($(this).find('#miDatepicker').val()).substring(0, 10) ||  dData.startDay, // 시작일
            endDay = ($(this).find('#miDatepicker').val()).substring(13) ||  dData.endDay; // 종료일

        var selDate = date.getTime(),
            selDateFr = date.toJSON().slice(0, 10),
            startClass = 'ui-state-range-td-active',
            endClass = 'ui-state-range-td-active';

        if (startDay) {
            var selDateStart = new Date(new String(startDay).replace(new RegExp("-", 'g'), "/"));
            var selDateStartFr = selDateStart.toJSON().slice(0, 10);
            var selDateStart = selDateStart.getTime();
        }

        if (endDay) {
            var selDateEnd = new Date(new String(endDay).replace(new RegExp("-", 'g'), "/"));0
            var selDateEndFr = selDateEnd.toJSON().slice(0, 10);
            var selDateEnd = selDateEnd.getTime();
        }

        if (startDay && endDay) {
            startClass = 'ui-state-range-td-start';
            endClass = 'ui-state-range-td-end';

            if (startDay == endDay) {
                startClass = 'ui-state-range-td-active';
                endClass = 'ui-state-range-td-active';
            }
        }

        if (selDateFr == selDateStartFr) {
            return [true, startClass, ''];
        } else if (selDateFr == selDateEndFr) {
            return [true, endClass, ''];
        } else if (selDate > selDateStart && selDate < selDateEnd) {
            return [true, 'ui-state-range-td', ''];
        } else {
            return [true, ''];
        }
    }
});

targetWidget = $(targetDiv).find('.ui-widget');
targetWidget.hide();

miDatepicker.on('focusin', function () {
    var startDate = (dateFilter.find('#miDatepicker').val()).substring(0, 10),
        endDate = (dateFilter.find('#miDatepicker').val()).substring(13);

    targetWidget.fadeIn(200);
    // console.log($(targetDiv).find('.ui-widget'));
    // console.log(targetWidget);

    var dData = $(targetDiv).data().datepicker, // datepicker data
        vewDate = startDate; // 보여질 달력 월수

    if (dData.startDay > dData.endDay) { // 마지막 선택일이 첫 선택일보다 클경우
        vewDate = endDate;
    }

    if(!vewDate){
        var pickDate = $(targetInput).val(),
            pickDate = pickDate.split('~')[0];

        vewDate = pickDate.trim();
    }

    $(targetDiv).datepicker("setDate", vewDate);
});

$(document).on('click', function (e) {
    var datepickerLen = false;
    if ($(e.target).parents(targetDiv).length == 0) { // targetDiv 없을 경우
        datepickerLen = true;
    }

    if ($(e.target).parents(".ui-datepicker-header").length != 0) { // 달력 죄우 화살표 버튼 버블링
        datepickerLen = false;
    }

    if (datepickerLen) {
        targetWidget.fadeOut(200);
    }
});
// END datepicker

// Ajax Call function
function ajaxCall(options) {
    var defaults = {
        async: true,
        method: '',
        params: '',
        uri: '',
        func: ''
    };
    var opts = $.extend(defaults, options);
    // opts.params._token = $('meta[name="csrf-token"]').attr('content'); // CSRF Token
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') // CSRF Token
        },
        async: opts.async,
        method: opts.method,
        data: opts.params,
        dataType: 'json',
        url: '/api/' + opts.uri
    }).done(function (result) {
        if (opts.func) {
            opts.func(result);
        } else {
            return result;
        }
    }).fail(function (xhr, error, state) {
        commonJS.alertPop(state, function () {
            return false;
        })
    });
}
