/*
마이뱅크
write : gray
since : 2019-11-29
*/

// STR 모바일 체크
var miAgent = navigator.userAgent;
var checkMobile = false;
if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) {
    checkMobile = true;
}
if (miAgent.match(/iPhone|iPod|iPad|Android|IEMobile|BlackBerry|Kindle|Windows CE|LG|MOT|SAMSUNG/i) != null) {
    checkMobile = true;
}
// END 모바일 체크

$(function () {
    pushAc1(); // 알림함
    miNextSlide({ // 리스트 클릭시
        target: '#js-slide-list', // 타겟 설정 id or class
        mode: 'slide', // slide, fade
        speed: 200, // 속도
        brToggle: true, // 다른 형제를 닫게할꺼냐
    });
    listRowCallAc(); // 통화 실패 및 통화 완료
    arriveTimeChange(); // 도착확정시간 변경 팝업

    stateChange(); // 상세 미수령 수령완료 버튼

    infoLogPopAc(); // 수정로그 팝업
});

// STR 알림함
function pushAc1() {
    var openBt = $('.push-bt-open'), // 알림함 열기 버튼
        closeBt = $('.push-bt-close'), // 알림함 닫기 버튼
        tarGet = $('.push-list-wrap'), // 알림함
        tab = tarGet.find('.tab li'), // 알림함 tab
        list = tarGet.find('.list ul'); // 알림함 list

    openBt.on('click', function () {
        $('html').addClass('mi-scroll-none');
        $(this).removeClass('push');
        tarGet.addClass('active');
    });

    closeBt.on('click', function () {
        $('html').removeClass('mi-scroll-none');
        tarGet.removeClass('active');
    });

    tab.find('button').on('click', function () {
        var _This = $(this),
            _tPar = _This.parent(),
            tpIndex = _tPar.index();

        tab.eq(tpIndex).addClass('active').siblings().removeClass('active');
        list.eq(tpIndex).addClass('active').siblings().removeClass('active');
        tab.eq(tpIndex).find('span').removeClass('push');
    });
}
// END 알림함

// STR next contents slide
function miNextSlide(options) {
    var defaults = {
        target: '', // 타겟 설정 id or class
        mode: 'slide', // slide, fade
        speed: 200, // 속도
        brToggle: false, // 다른 형제를 닫게할꺼냐
    };
    var opts = $.extend(defaults, options);

    $(opts.target).find('.js-slide-bt').on('click', function (e) {
        var _This = $(this);
        if (opts.mode == 'slide') {
            if (opts.brToggle) {
                _This.siblings('.js-slide-bt').removeClass('active').next('.js-slide-info').stop().slideUp(opts.speed);
            }
            _This.toggleClass('active').next('.js-slide-info').stop().slideToggle(opts.speed);
        } else {
            if (opts.brToggle) {
                _This.siblings('.js-slide-bt').removeClass('active').next('.js-slide-info').stop().fadeOut(opts.speed);
            }
            _This.toggleClass('active').next('.js-slide-info').stop().fadeToggle(opts.speed);
        }

        _This.next('.js-slide-info').on('click', function (e) {
           // e.stopPropagation();
        });
    });
}
// END next contents slide

// STR 통화 실패 및 통화 완료
function listRowCallAc() {
    $('[data-call="call-action"]').on('click', function () {
        var _This = $(this),
            tParCall = _This.parents('.row-info').prev().find('.call');

        _This.addClass('active').siblings('.phone-icon').removeClass('active');

        var call_state = 'C';
        var gr_seq = _This.attr('data-value');
        if (_This.hasClass('ok')) { // 통화 완료 일때
            tParCall.removeClass('no');
            tParCall.addClass('ok');
            _This.parents('.call-list').find('.info').slideDown();
            call_state = 'Y';
        } if (_This.hasClass('no')) {
            tParCall.removeClass('ok');
            tParCall.addClass('no');
            call_state = 'N';
        }
        ajaxCall({
            method: 'POST',
            params: {'gr_seq': gr_seq, 'state': call_state},
            uri: 'save-call-history',
            func: function (res) {
                if (res.msg === 'success') {
                    var callText = '통화연결: '+ res.userName + ' (' + res.dTime + ')';
                    $('#callInfo').text(callText);
                }
            }
        })
    });
}
// END 통화 실패 및 통화 완료

// STR 도착확정시간 변경 팝업
function arriveTimeChange() {
    var arriveTime = $('#arriveTime'), // 도착확정시간 박스
        openBt = $('#arriveTimePopOpen'), // 도착확정시간 팝업 오픈 버튼
        arriveHour = $('#arriveHour'), // 팝업 도착확정시간 시간
        arriveMinute = $('#arriveMinute'), // 팝업 도착확정시간 분
        tParSignBt = $('#signPopOpenBt'); // 서명받기 버튼

    openBt.on('click', function (e) {
        if ($(this).hasClass('on')) {
            miDesignPop.setting({
                dTraget: 'arriveTimePop', // 팝업 아이디
                dYesAc: function () {// .yes-bt-ac 콜백
                    var dTime = arriveHour.val() + ':' + arriveMinute.val();
                    // 도착 확정시 업뎃
                    ajaxCall({
                        method: 'POST',
                        params: {'gr_seq': $('#GrSeq').val(), 'dTime': dTime},
                        uri: 'save-decide-time',
                        func: function (res) {
                            if (res.msg === 'success') { // 성공하면 값 binding
                                location.reload();
                                // arriveTime.text(dTime);
                                // tParSignBt.addClass('on');
                            }
                        }
                    })
                }
            });
            setTimeout(function () {
                arriveHour.focus();
            }, 100);
        }
    });

    arriveHour.on('keyup', function () { // 팝업 도착확정시간 시간 키업
        var _This = $(this),
            v = _This.val(),
            data = miValidate.isLangOnlyType(v); // 숫자만 입력

        _This.val(data);

        if (data.length >= 2) {
            arriveMinute.focus();
        }
    });

    arriveMinute.on('keyup', function () { // 팝업 도착확정시간 분 키업
        var _This = $(this),
            v = _This.val(),
            data = miValidate.isLangOnlyType(v); // 숫자만 입력

        _This.val(data);
    });
}
// END 도착확정시간 변경 팝업

// STR 상세 미수령 수령완료 버튼
function stateChange() {
    var bt = $('.receipt-bt-wrap button'), // 미수령, 수령완료 버튼
        textBox = $('.receipt-end-box'); // 수령완료 텍스트 박스

    bt.on('click', function () {
        var _This = $(this);

        if (_This.hasClass('on')) { // 버튼을 클릭할 수 있을때 on 이 있을때
            var state = '';
            var imgValue = '';
            var dcopy = '';
            var travelCountry = '';
            if (_This.hasClass('receipt-bt-no')) { // 미수령
                state = 'H';
                dcopy = '미수령으로 변경하시겠습니까?';
            } if (_This.hasClass('receipt-bt-ok')) { // 수령완료
                state = 'E';
                dcopy = '수령완료로 변경하시겠습니까?';
                imgValue = $('.sign-wrap').find('.con').find('.img-box').find('img').attr('src');
                travelCountry = $('input[name=travelInput]').val();
            }
            miDesignPop.alert({
                dConHe: 110, // pop con height
                dCopy: dcopy,
                dButtonSetNum : 2, // 1, 2
                dButtonSetText : ['확인','아니오'], // 기본값 ['확인','아니오'] // 팝업 버튼 셋팅 커스텀 가능
                dYesAc: function () {// .yes-bt-ac 콜백
                    ajaxCall({
                        method: 'POST',
                        params: {'gr_seq': $('#GrSeq').val(), 'state': state, 'imgValue': imgValue, 'travelCountry': travelCountry},
                        uri: 'receipt-ok',
                        func: function (res) {
                            if (res.msg === 'success') {
                                //_This.addClass('active').parent('div').siblings().find('button').removeClass('active');
                                location.href = '/view/' + $('#GrSeq').val();
                            }
                        }
                    });
                }
            });
        }
    });
}
// END 상세 미수령 수령완료 버튼

// STR 수정로그 팝업
function infoLogPopAc() {
    var atrOpenBt = $('#infoLogPopBt'); // 수정로그 보기 버튼

    atrOpenBt.on('click', function () {
        miDesignPop.setting({
            dTraget: 'infoLogPop', // 팝업 아이디
            dYesAc: function () {// .yes-bt-ac 콜백

            }
        });
    });
}
// END 수정로그 팝업

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
        // console.log(error);
        // console.log(state);
        // console.log(xhr);
    });
}

// 이동 Tab
function goTab(tabType) {
    var stx = $('#stx').val();
    var keyword = $('#keyword').val();
    var linkList = 'list';
    if (tabType === 'wait') {
        linkList = 'w-list';
    }
    location.href = '/' + linkList + '/1?airport=' + tabType + '&stx=' + stx + '&keyword=' + keyword;
}

// 수정완료 버튼 script
function goModify() {
    var seq = $('#GrSeq').val(),
        memo = $('#memo').val(),
        timer = $('#timer').val();


    ajaxCall({
        method: 'POST',
        params: {'gr_seq': seq, 'memo': memo, 'timer': timer},
        uri: 'modify-memo',
        func: function (res) {
            if (res.msg === 'success') {
                location.href = '/view/'+seq;
            }
            console.log(res);
        }
    })
}

// 취소 버튼 script
function goCancel() {
    var seq = $('#GrSeq').val();
    location.href = '/view/'+seq;
}
