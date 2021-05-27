var tr = $('.student'),

    optionSelect = $('#option'), // 검색 필터 select
    txtKeyfield = $('#txtKeyfield'), // 검색 키워드 input
    mailBtn = $('#mailBtn'), // 메일 발송 버튼
    couponBtn = $('#couponBtn'), // 쿠폰 발행 팝업
    memoBtn = $('.memo-btn'), // 특이사항 버튼

    planInfo = $('.student-plan-info'), // 플랜 정보 (팝업)

    travelCommonJS = {
        isDomestic: (commonJS.currentPathname.indexOf('domestic') > -1),
        isYuhak: (commonJS.currentPathname.indexOf('yuhak') > -1),
        currentService: $('.container-section').data('service'),
        loginKind: $('.container-section').data('kind'),
        currentLevel: ''
    };

if(commonJS.currentPathname.indexOf('domestic') < 0){ // 해외 여행자보험일 경우 datepicker range 조절
    dateFilter.datepicker('option', 'minDate', new Date('2015-01-01'));

    searchResetBtn.on('click', function() {
        dateFilter.datepicker('option', 'minDate', new Date('2015-01-01'));
        dateFilter.datepicker('option', 'maxDate', new Date());
    });
}

function sendMail(ajaxData, tr, newNameArr) {
    $.ajax({
        type: 'POST',
        url: '/api/travel/mail',
        data: JSON.stringify(ajaxData),
        contentType: 'application/json',
        dataType: 'json',
        beforeSend: function(xhr) { xhr.setRequestHeader(commonJS.header, commonJS.token); }
    }).done(function(res) {
        if(res.success) {
            commonJS.alertPop('메일 발송이 완료되었습니다', function() {
                if(tr){
                    tr.attr('data-eng', newNameArr.join());
                }

                $('.mi-common-pop').remove();
                $('html').removeClass('mi-scroll-none');
            });
        }else{
            commonJS.alertPop(res.error.message);
        }
    }).fail(function() {

    });
}

// STR 검색창
optionSelect.on('change', function() { // 날짜 선택시 input 제거
    var _This = $(this),
        thisVal = _This.val();

    if(thisVal.indexOf('date') > -1){ // 날짜
        txtKeyfield.addClass('hide');
    }else{
        txtKeyfield.removeClass('hide');
    }
});

searchResetBtn.on('click', function() { // 검색 초기화
    var dateOption = $('#dateOption'),
        miDatepicker = $('#miDatepicker'),
        option = $('#option'),
        txtKeyField = $('#txtKeyfield');
    dateOption.val('regdate');
    miDatepicker.val(miDatepicker.data('default'));
    $('input[name="dateselect"]:checked').prop('checked', false);
    $('input[name="payMethod"]:checked').prop('checked', false);
    $('input[name="status"]:checked').prop('checked', false);

    option.val('name');
    txtKeyField.val('');

    searchForm.attr('onsubmit', 'return true').submit();
});
// END 검색창

// STR 리스트
memoBtn.on('click', function() { // 특이사항 입력
    var _ThisBtn = $(this),
        code = _ThisBtn.data('code');

    $.ajax({
        type: 'GET',
        url: (commonJS.currentPathname.indexOf('insurance') > -1 ? '/api/travel/insurance/memo/' : '/api/travel/memo/') + code,
        contentType: 'application/json',
        dataType: 'json'
    }).done(function(res) {
        if(res.success){
            miDesignPop.alert({
                dTarget: 'memo-pop',
                dTitle: '특이사항 입력',
                dCopy: '<div class="memo-pop-box">'
                            +'<div class="mi-input-wrap popup-input">'
                                +'<div class="mi-input-group">'
                                    +'<div class="mi-input-box">'
                                        + '<div class="mi-input-input">'
                                            +'<textarea class="mi-input" id="content">'+(res.data ? (res.data).replace(/<br>/gi, '&#10;') : '')+'</textarea>'
                                        + '</div>'
                                    +'</div>'
                                +'</div>'
                            +'</div>'
                        +'</div>',
                dButtonSet: '<ul>'
                                + '<li class="w-2"><button type="button" class="no-bt no-bt-ac">취소</button></li>'
                                + '<li class="w-2"><button type="button" class="yes-bt multi-pop-bt save-memo-bt">등록</button></li>'
                            + '</ul>',
            });
        }
    }).fail(function(res) {
        commonJS.alertPop(res.responseJSON.error.message || res.responseJSON.message);
    });

    $(document).on('click', '.save-memo-bt', function() { // 특이사항 저장
        var content = $('#content'),
            contentVal = (content.val()).replace(/(?:\r\n|\r|\n)/gi, '<br>'),
            ajaxData = {};

        ajaxData.code = code;
        ajaxData.memo = contentVal;

        $.ajax({
            type: 'POST',
            url: '/api/travel/memo/'+code,
            data: JSON.stringify(ajaxData),
            contentType: 'application/json',
            dataType: 'json',
            beforeSend: function(xhr) { xhr.setRequestHeader(commonJS.header, commonJS.token); }
        }).done(function(res) {
            if(res.success){
                commonJS.alertPop('특이사항이 저장되었습니다', function() {
                    $('.mi-common-pop').remove();
                    $('html').removeClass('mi-scroll-none');
                    if(contentVal.length > 0){
                        _ThisBtn.removeClass('active').text('보기');
                    }
                });
            }
        }).fail(function(res) {
            commonJS.alertPop(res.responseJSON.error.message || res.responseJSON.message);
        });
    });
});
// END 리스트

// STR 세부정보
tr.on('click', function() { // 세부사항 테이블 보이기
    var _This = $(this),
        code = _This.data('code'),
        thisChildTr = $('#people_'+code), // 현재건의 childTr
        otherTrs = $('.people').not('#people_'+code), // 현재건 제외 childTr
        childTrs = $('.people'); // 전체의 childTr

    if(thisChildTr.length > 0){ // 이미 API를 불러왔었음
        if(thisChildTr.hasClass('visible')){
            thisChildTr.hide().removeClass('visible');
        }else{
            thisChildTr.show().addClass('visible');
        }

    }else{
        showDetailList(code, _This); // 세부리스트 API
    }
});

commonJS.emailInputAct('#email1Detail', '#email2Detail', '#email2ChangeDetail'); // 이메일 input 관련 action

$(document).on('click', '#productCodeText', function() { // 보장내용확인 팝업 (해외)
    var _This = $(this),
        thisTr = _This.parent().parent(),
        name = thisTr.data('name'),
        age = thisTr.data('age'),
        code = thisTr.data('code'),
        repTr = $('#list_'+code),
        day = repTr.data('day'),
        planCd = _This.data('plan');


    $.ajax({
        type: 'GET',
        url: '/load/'+planCd+'.html',
        dataType: 'html',
        data: ''
    }).done(function (data) {

        miDesignPop.alert({
            dClass: 'guarantee-info',
            dTitle: name+'님 보험나이 만'+age+'세 여행기간 '+day+'일',
            dTitleAlign: 't-a-l',//기본값 t-a-c //t-a-c, t-a-l, t-a-r 타이틀 정렬
            dCopy: data, // 카피라이트
            dAjaxHtml: true, // ajax 로 html 파일을 load해서 dCopy 에 대입할 경우
        });

    }).fail(function () {
    });
});

$(document).on('click', '#planCdText', function() { // 플랜정보 팝업 (국내)
    var _This = $(this),
        thisTr = _This.parent().parent(),
        name = thisTr.data('name'),
        age = thisTr.data('age'),
        code = thisTr.data('code'),
        repTr = $('#list_'+code),
        day = repTr.data('day'),
        planCd = _This.data('plan');


    $.ajax({
        type: 'GET',
        url: '/api/domestic/plan/'+planCd,
        dataType: 'json',
    }).done(function (res) {
        var guaranteeList = '';

        for(var i = 0; i < res.data.length; i++){
            var item = res.data[i];

            if(item.child.length > 0){
                guaranteeList += '<div class="section">'
                                    +'<div class="title">' + item.title + '</div>'
                                    +'<ul class="student depth1">';
            }else{
                guaranteeList += '<div class="section">'
                                    +'<ul class="student">'
                                        +'<li class="strong1">'
                                            +'<div>' + item.title + '</div>'
                                            +(item.value ? '<div>' + miValidate.isNumComma(item.value) + '원<div>' : '' )
                                        +'</li>';
            }

            for(var j = 0; j < item.child.length; j++){
                var detailItem = item.child[j];
                guaranteeList += '<li class="strong1">'
                                    +'<div>' + detailItem.title + '</div>'
                                    +'<div>' + miValidate.isNumComma(detailItem.value) + '원</div>'
                                +'</li>'
            }

            guaranteeList += '</ul>'
                            +'</div>';
        }
        miDesignPop.alert({
            dClass: 'guarantee-info',
            dTitle: name+'님 보험나이 만'+age+'세 여행기간 '+day+'일',
            dTitleAlign: 't-a-l',//기본값 t-a-c //t-a-c, t-a-l, t-a-r 타이틀 정렬
            dCopy: '<div class="plan-box-student">' // 카피라이트
                        +guaranteeList
                    +'</div>'
        });

    }).fail(function () {
    });
})

$(document).on('click', '#modifyBtn', function() { // 세부사항 테이블 수정 저장
    var _This = $(this),
        tr = _This.parent().parent(),
        code = tr.data('code'),
        dataCode = tr.data('datacode'),
        name = tr.find('#name'),
        nameVal = miValidate.isSpaceDelete(name.val()),
        birthVal = tr.find('#birthText').text(),
        resident = tr.find('#resident'),
        residentVal = miValidate.isLangOnlyType(resident.val(), 'NUM'),
        email1 = tr.find('#email1Detail'),
        email2 = tr.find('#email2Detail'),
        email2Change = tr.find('#email2ChangeDetail'),
        email1Val = email1.val(),
        email2Val = email2.val(),
        email2ChangeVal = email2Change.val(),
        fullEmailVal = email1Val + '@' + email2Val,
        tel = tr.find('#tel'),
        telVal = miValidate.isSpaceDelete(tel.val()),
        telFr = telVal.substr(0, 3),
        ajaxData = {};

    resident.val(residentVal);
    // STR 유효성 검사
    if(nameVal.length < 2){
        commonJS.alertPop('이름을 입력해주세요');
        return;
    }

    if(miValidate.isConsonantCheck(nameVal)){
        commonJS.alertPop('이름을 정확히 입력해주세요');
        return;
    }

    if(residentVal.length != 7){

        commonJS.alertPop('주민번호를 정확히 입력해주세요');
        return;
    }

    if(!miValidate.isMemNumCheck(birthVal+residentVal)){
        commonJS.alertPop('주민번호를 정확히 입력해주세요');
        return;
    }

    if(code == dataCode){
        if(!miValidate.isTelFrCheck(telFr)){
            commonJS.alertPop('전화번호 앞자리는 010, 011, 016, 017, 018, 019만\n가능합니다');
            return;
        }

        if(telVal.length < 10){
            commonJS.alertPop('전화번호를 정확히 입력해주세요');
            return;
        }

        if(!email1Val){ // email1에 아무 값도 없을 때
            commonJS.alertPop('이메일을 입력해주세요');
            return;
        }

        if(!email2Val){
            commonJS.alertPop('이메일을 입력해주세요');
            return;
        }

        if(!miValidate.isEmailCheck(fullEmailVal)){ // 값이 올바르지 않을 때
            commonJS.alertPop('이메일을 정확히 입력해주세요');
            return;
        }
    }
    // END 유효성 검사

    ajaxData.code = code;
    ajaxData.peopleCode = dataCode;
    ajaxData.name = nameVal;
    ajaxData.birth = birthVal;
    ajaxData.resident = residentVal;
    ajaxData.email = fullEmailVal;
    ajaxData.tel = telVal;

    $.ajax({
        type: 'POST',
        url: '/api/travel/info',
        data: JSON.stringify(ajaxData),
        contentType: 'application/json',
        dataType: 'json',
        beforeSend: function(xhr) { xhr.setRequestHeader(commonJS.header, commonJS.token); }
    }).done(function(res) {
        commonJS.alertPop('수정되었습니다',  function() {
            if(code == dataCode){
                var repTr = $('#list_'+code);
                repTr.find('#name').text(nameVal);
                repTr.attr('data-email', fullEmailVal);
                repTr.attr('data-tel', telVal);
            }
            showDetailList(code, $('#people_'+code));
        });
    }).fail(function(res) {
        commonJS.alertPop(res.responseJSON.error.message || res.responseJSON.message);
    });
});
// END 세부정보

// STR functions
mailBtn.on('click', function() { // 메일 발송
    var checkedList = $("input[type=checkbox]:checked").not('#selectAll'),
        code = checkedList.data('code'), // 코드
        status = checkedList.data('status'), // 상태 (B,F일 때만 증명서 발급 가능)
        isPaperAble = (status == 'B' || status == 'F' || status == 'H'),
        tr = $('#list_'+code),
        email = tr.data('email'),
        emailId = '',
        emailDomain = '',
        engNameInputs = '',
        name = tr.find('#name').text(),
        isCustomEmail = false;


    if(!isPaperAble){ // 신청상태가 아닐 때 메일 발송 X
        commonJS.alertPop('메일을 발송할 수 있는 상태가 아닙니다');
        return;
    }

    if(checkedList.length > 1){
        commonJS.alertPop('메일 발송은 한 번에 한 건만 가능합니다', function() {
            checkedList.prop('checked', false);
        });
        return;
    }

    if(checkedList.length < 1){
        commonJS.alertPop('메일 발송할 건을 선택해주세요');
        return;
    }

    emailId = email.split('@')[0];
    emailDomain = email.split('@')[1];

    if(emailDomain != 'naver.com'
        && emailDomain != 'daum.net'
        && emailDomain != 'hanmail.net'
        && emailDomain != 'gmail.com'
        && emailDomain != 'nate.com'
        && emailDomain != 'mibank.me'
    ){
        isCustomEmail = true;
    }

    $.ajax({
        type: 'GET',
        url: '/api/travel/name/' + code,
        contentType: 'application/json',
        dataType: 'json'
    }).done(function(res) {
        if(res.success){
            var names = res.data.name;
            for(var i=0; i<names.length; i++){
                var engName = (names[i].engName != null) ? names[i].engName : '',
                    korName = names[i].korName,
                    personCode = names[i].code;

                engNameInputs += '<div class="mi-input-wrap popup-input">'
                                    +'<div class="mi-input-group">'
                                    +'<label class="mi-input-label">'+korName+'</label>'
                                        +'<div class="mi-input-box">'
                                            + '<div class="mi-input-input">'
                                                +'<input type="text" class="mi-input eng-name" id="engName'+i+'" value="'+engName+'" data-code="'+personCode+'">'
                                            + '</div>'
                                        +'</div>'
                                    +'</div>'
                                +'</div>';
            }

            miDesignPop.alert({
                dTarget: 'mail-pop',
                dCopy: '<div class="mail-pop-box">'
                            +'<div class="pop-title">'+name+'님에게 이메일을 발송하시겠습니까?</div>'

                            +'<div class="mi-input-wrap popup-input">'
                            + '<div class="mi-input-group align-top">'
                            + '<label class="mi-input-label">이메일</label>'
                            + '<div class="mi-input-box">'
                                + '<div class="mi-input-input">'
                                    +'<input type="text" class="mi-input" id="email1Pop" value="'+emailId+'">'
                                + '</div>'
                                + '<div class="mi-input-connect"><span class="at">@</span></div>'
                                + '<div class="mi-input-input">'
                                    + '<input type="text" class="mi-input" id="email2Pop" style="margin-bottom: 10px;'+(isCustomEmail ? "" : "display: none;")+'" value="'+emailDomain+'">'
                                    + '<select name="" id="email2ChangePop" class="mi-input select">'
                                    + '<option value="" selected disabled hidden>선택</option>'
                                    + '<option value="naver.com" '+(emailDomain == "naver.com" ? "selected" : "")+'>naver.com</option>'
                                    + '<option value="daum.net" '+(emailDomain == "daum.net" ? "selected" : "")+'>daum.net</option>'
                                    + '<option value="hanmail.net" '+(emailDomain == "hanmail.net" ? "selected" : "")+'>hanmail.net</option>'
                                    + '<option value="gmail.com" '+(emailDomain == "gmail.com" ? "selected" : "")+'>gmail.com</option>'
                                    + '<option value="nate.com" '+(emailDomain == "nate.com" ? "selected" : "")+'>nate.com</option>'
                                    + '<option value="mibank.me" '+(emailDomain == "mibank.me" ? "selected" : "")+'>mibank.me</option>'
                                    + '<option value="custom"'+(isCustomEmail ? "selected" : "")+'>직접입력</option>'
                                    + '</select>'
                                + '</div>'
                            + '</div>'
                            + '</div>'
                            + '</div>'

                            +'<div class="mi-input-wrap popup-input">'
                                +'<div class="mi-input-group">'
                                    +'<div class="mi-input-box">'
                                        +'<div class="mi-input-input">'
                                            +'<input type="checkbox" name="korPaper" class="paper-kind" id="korPaper" value="k" '+(isPaperAble ? '' : 'disabled')+'>'
                                        +'</div>'
                                        +'<label class="mi-input-label" for="korPaper">국문 가입증명서</label>'
                                    +'</div>'
                                    +'<div class="mi-input-box">'
                                        +'<div class="mi-input-input">'
                                            +'<input type="checkbox" name="engPaper" class="paper-kind" id="engPaper" value="e" '+(isPaperAble ? '' : 'disabled')+'>'
                                        +'</div>'
                                        +'<label class="mi-input-label" for="engPaper">영문 가입증명서</label>'
                                    +'</div>'
                                    +'<div class="mi-input-box">'
                                        +'<div class="mi-input-input">'
                                            +'<input type="checkbox" name="preparePaper" class="paper-kind" id="preparePaper" value="d" '+(location.pathname.indexOf('wholiday') > -1 ? 'disabled' : '')+'>'
                                        +'</div>'
                                        +'<label class="mi-input-label" for="preparePaper">구비서류 리스트</label>'
                                    +'</div>'
                                +'</div>'
                            +'</div>'

                            + engNameInputs

                            +'<div class="warning-box">'
                            +'</div>'
                        +'</div>',
                dButtonSet: '<ul>'
                                + '<li class="w-2"><button type="button" class="no-bt no-bt-ac">취소</button></li>'
                                + '<li class="w-2"><button type="button" class="yes-bt multi-pop-bt send-mail-bt">발송</button></li>'
                            + '</ul>',
            });

            commonJS.emailInputAct('#email1Pop', '#email2Pop', '#email2ChangePop'); // 이메일 input 관련 action

            $(document).off('click', '.send-mail-bt').on('click', '.send-mail-bt', function() { // 변경된 이메일 유효성검사
                var ajaxData = {},
                    newNameAjaxData = { rep : {}, comp : []},
                    email1 = $('#email1Pop'),
                    email2 = $('#email2Pop'),
                    email2Change = $('#email2ChangePop'),
                    email1Val = email1.val(),
                    email2Val = email2.val(),
                    email2ChangeVal = email2Change.val(),
                    fullEmailVal = email1Val + '@' + email2Val,
                    engNameInputs = $('.eng-name'),
                    newNameArr = [],
                    types = $('.paper-kind:checked'),
                    type = [],

                    warningBox = $('.warning-box');

                warningBox.text('');

                types.each(function() {
                    var _This = $(this),
                        thisVal = _This.val();

                    if(thisVal){
                        type.push(thisVal);
                    }
                });

                if(!email1Val){ // email1에 아무 값도 없을 때
                    warningBox.text('이메일을 입력해주세요');
                    return;
                }

                if(!email2Val){
                    warningBox.text('이메일을 입력해주세요');
                    return;
                }

                if(!miValidate.isEmailCheck(fullEmailVal)){ // 값이 올바르지 않을 때
                    warningBox.text('이메일을 정확히 입력해주세요');
                    return;
                }

                if(type.indexOf('e') > -1){ // 영문가입증명서 메일 선택시
                    var isInValidate = false;
                    engNameInputs.each(function(idx){
                        var _This = $(this),
                            thisCode = _This.data('code'),
                            thisVal =  miValidate.isLangOnlyType(_This.val(), 'ENGSP');

                        if(thisVal.length < 1){
                            warningBox.text('영문이름을 입력해주세요');
                            isInValidate = true;
                        }else{
                            newNameArr.push(thisVal);
                            if(idx == 0){
                                newNameAjaxData.rep.code = thisCode;
                                newNameAjaxData.rep.name = thisVal;
                            }else{
                                var temp = {};
                                temp.code = thisCode;
                                temp.name = thisVal;
                                newNameAjaxData.comp.push(temp);
                            }
                        }
                    });

                    if(isInValidate) {
                        return;
                    }
                }

                if(type.length < 1){
                    warningBox.text('메일 종류를 선택해주세요');
                    return;
                }

                ajaxData.code = code;
                ajaxData.service = travelCommonJS.currentService;
                ajaxData.email = fullEmailVal;
                ajaxData.type = type;

                if(type.indexOf('e') > -1){ // 영문가입증명서 요청할 경우
                    // STR 영문이름변경 API
                    $.ajax({
                        type: 'POST',
                        url: '/api/travel/english-name',
                        data: JSON.stringify(newNameAjaxData),
                        contentType: 'application/json',
                        dataType: 'json',
                        beforeSend: function(xhr) { xhr.setRequestHeader(commonJS.header, commonJS.token); }
                    }).done(function(res) {
                        if(res.success){
                            sendMail(ajaxData, tr, newNameArr)
                        }
                    }).fail(function(res) {
                        commonJS.alertPop(res.responseJSON.error.message || res.responseJSON.message);
                    });
                    // END 영문이름변경 API
                }else{
                    sendMail(ajaxData);
                }
            });
        }else{
            commonJS.alertPop(res.error.message);
            return;
        }
    }).fail(function(res) {
        commonJS.alertPop(res.error.message);
    });
});
// END functions
