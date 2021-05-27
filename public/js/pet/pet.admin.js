var tr = $('.student'),

    talkBtn = $('#talkBtn'), // 알림톡 발송 버튼
    allBtn = $('#allBtn'), // 전체 조회 버튼
    pfBtn = $('#pfBtn'), // 연체건 조회 버튼
    statusChangeA = $('.status-change'), // 상태변경 a태그
    logBtn = $('.log-btn'), // 비고 (로그) 버튼

    cancelData = { data: {} }, // 해지접수 데이터

    bankList = '<option value="" disabled selected hidden>은행선택</option>'; // 은행 목록 하드코딩

tr.on('click', function(e) { // 세부사항 테이블 보이기
    var _This = $(this),
        code = _This.data('code'),
        thisChildTr = $('#subList_'+code); // 현재건의 childTr

    if(!$(e.target).hasClass('status-mini-li') && !$(e.target).hasClass('log-btn') && e.target.nodeName != 'A' && e.target.nodeName != 'INPUT'){
        if(thisChildTr.length > 0){ // 이미 API를 불러왔었음
            if(thisChildTr.hasClass('visible')){
                thisChildTr.hide().removeClass('visible');
            }else{
                thisChildTr.show().addClass('visible');
            }
        }else{
            detailListAct.param.code = code;
            detailListAct.param.target = _This;

            if(commonJS.currentPathname.indexOf('animal') > -1){ // 반려동물 기준
                detailListAct.getDetailInfo(detailListAct.showDatailAnimal);
            }else{
                detailListAct.getDetailInfo(detailListAct.showDetailCustomer);
            }
        }
    }
});

talkBtn.on('click', function() { // 알림톡 발송
    var checkedList = $("input[type=checkbox]:checked").not('#selectAll'),
        code = checkedList.data('code'), // 코드
        status = checkedList.data('status');

    $.ajax({
        type: 'GET',
        url: '/api/pet/info/tel/' + code,
        data: '',
        contentType: 'application/json',
        dataType: 'json'
    }).done(function(res) {
        miDesignPop.alert({
            dTarget: 'alert-pop',
            dTitle: '알림톡 발송',
            dCloseX: true,
            dCopy: '<div class="alert-pop-box">'
                        +'<div class="mi-input-wrap popup-input">'
                            + '<div class="mi-input-group align-top">'
                                + '<label class="mi-input-label">휴대폰번호</label>'
                                + '<div class="mi-input-box">'
                                    + '<div class="mi-input-input">'
                                        +'<input type="text" class="mi-input" id="petSendTel" value="'+res.data+'" maxlength="11">'
                                    + '</div>'
                                + '</div>'
                            + '</div>'
                        + '</div>'

                        +'<div class="alert-kind-wrap">'
                            +'<div class="mi-input-wrap popup-input">'
                                +'<div class="mi-input-group">'
                                    +'<div class="mi-input-box">'
                                        + '<div class="mi-input-input">'
                                            +'<input type="radio" name="alertType" id="m154" value="m154">'
                                            + '<label for="m154">가입완료</label>'
                                        + '</div>'
                                        + '<div class="mi-input-input">'
                                            +'<input type="radio" name="alertType" id="m155" value="m155">'
                                            + '<label for="m155">가입완료(삼성화제)</label>'
                                        + '</div>'
                                    +'</div>'
                                +'</div>'
                            +'</div>'
                            +'<div class="mi-input-wrap popup-input">'
                                +'<div class="mi-input-group">'
                                    +'<div class="mi-input-box">'
                                        + '<div class="mi-input-input">'
                                            +'<input type="radio" name="alertType" id="m156" value="m156">'
                                            + '<label for="m156">연체</label>'
                                        + '</div>'
                                        + '<div class="mi-input-input">'
                                            +'<input type="radio" name="alertType" id="m157" value="m157">'
                                            + '<label for="m157">연체 최종일</label>'
                                        + '</div>'
                                    +'</div>'
                                +'</div>'
                            +'</div>'
                        +'</div>'

                        +'<div class="warning-box"></div>'

                    +'</div>',
            dButtonSet: '<ul>'
                            + '<li class="w-2"><button type="button" class="no-bt no-bt-ac">취소</button></li>'
                            + '<li class="w-2"><button type="button" class="yes-bt multi-pop-bt send-alert-bt" data-code="'+code+'">발송</button></li>'
                        + '</ul>',
        });
    }).fail(function(res) {
        commonJS.alertPop(res.responseJSON.error.message || res.responseJSON.message);
    });
});

excelBtn.on('click', function() { // 엑셀 다운로드
    var orderBy = searchForm.find('#orderBySelect').val() || null,
        step = searchForm.find('#stepSelect').val() || null,
        state = searchForm.find('#stateSelect').val() || null,
        insurance = searchForm.find('#insuranceSelect').val() || null,
        division = searchForm.find('#divisionSelect').val() || null,
        txtDate = searchForm.find('#miDatepicker').val() || null,
        option = searchForm.find('#optionSelect').val() || null,
        txtKeyfield = searchForm.find('#txtKeyfield').val() || null,

        ajaxData = {};

    ajaxData.txtDate = txtDate;
    ajaxData.option = option;
    ajaxData.txtKeyfield = txtKeyfield;
    ajaxData.orderBy = orderBy;
    ajaxData.step = step;
    ajaxData.state = state;
    ajaxData.insurance = insurance;
    ajaxData.division = division;

    console.log(ajaxData);

    commonJS.excelDownload(ajaxData, '/pet/excel');
});

allBtn.on('click', function() { // 전체 조회
    $('#stateSelect').val('');
    $('#searchForm').attr('onsubmit', 'return true').submit();
});

pfBtn.on('click', function() { // 연체건 조회
    $('#stateSelect').val('PF');
    $('#searchForm').attr('onsubmit', 'return true').submit();
});

logBtn.on('click', function() { // 로그 보기
    var _This = $(this),
        thisCode = _This.data('code');

    $.ajax({
        type: 'GET',
        url: '/api/pet/log/' + thisCode,
        contentType: 'application/json',
        dataType: 'json'
    }).done(function(res) {
        if(res.success){
            var contents = '';
            for(var i = 0; i < res.data.length; i++){
                var data = res.data[i],
                    date = data.date,
                    name = data.name,
                    content = data.content;

                contents += '<tr>'
                                +'<td>' + date + '</td>'
                                +'<td>' + name + '</td>'
                                +'<td>' + content + '</td>'
                            +'</tr>';
            }


            miDesignPop.alert({
                dWidth: 800,
                dTitle : '로그',
                dCopy : '<div class="log-pop-box pop-table student-table">'
                            +'<table>'
                                +'<colgroup>'
                                    +'<col width="25%">'
                                    +'<col width="15%">'
                                    +'<col width="60%">'
                                +'</colgroup>'
                                +'<thead>'
                                    +'<tr>'
                                        +'<th>일시</th>'
                                        +'<th>작업자</th>'
                                        +'<th>내용</th>'
                                    +'</tr>'
                                +'</thead>'
                                +'<tbody>'
                                    + contents
                                +'</tbody>'
                            +'</table>'
                        +'</div>',
                dButtonSetNum: 0,
                dButtonSet: '',
                dCloseX: true
            });
        }else{
            commonJS.alertPop(res.error.message);
        }
    }).fail(function(res) {
        commonJS.alertPop(res.responseJSON.error.message || res.responseJSON.message);
    });
});

$(document).on('click', '.show-pet-photo', function() { // 사진 보기
    var _This = $(this),
        id = _This.data('id'),
        uuid = _This.data('uuid');

    $.ajax({
        type: 'GET',
        url: '/pet/image/file/' + uuid,
        contentType: 'application/json',
        dataType: 'text'
    }).done(function(res) {
        miDesignPop.alert({
            dTarget: 'pet-photo-pop',
            dTitle: '사진',
            dCloseX: true,
            dCopyAlign: 't-a-c',
            dCopy: '<div class="pet-photo-box">'
                        +'<form id="changePhotoForm" enctype="multipart/form-data">'
                            +'<label for="frontPhoto">사진교체</label>'
                            +'<input type="file" id="frontPhoto" name="frontPhoto" accept="image/*">'
                        +'</form>'
                        +'<div class="showing-img-box"></div>'
                    +'</div>',
            dButtonSet: '<ul>'
                            + '<li class="w-1"><button type="button" class="yes-bt change-photo-bt" data-uuid="'+uuid+'" data-id="'+id+'" disabled>확인</button></li>'
                        + '</ul>',
        });

        $('.showing-img-box').css('background-image', 'url(data:image/*;base64,'+res+')');
    }).fail(function(res) {
        commonJS.alertPop(res.responseJSON.error.message || res.responseJSON.message);
    });
});

$(document).on('change', '#frontPhoto', function() {
    var _This = $(this), // jquery this
        vsThis = this,
        thisVal = _This.val(), // file input value
        label = _This.parent().find('label');

    if (thisVal && !(/\.(png|jpg|jpeg)$/).test(thisVal)) {
        commonJS.alertPop('사진 파일만 업로드 가능합니다');
        return;
    }

    if (vsThis.files && vsThis.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('.example').addClass('uploaded');
            $('.showing-img-box').css('background-image', 'url(' + e.target.result + ')');
            $('.change-photo-bt').attr('disabled', false);
        }
        reader.readAsDataURL(vsThis.files[0]);
    }else{
        $('.example').removeClass('uploaded');
        $('.showing-img-box').css('background-image', 'none');
        $('.change-photo-bt').attr('disabled', 'disabled');
    }
});

$(document).on('click', '.change-photo-bt', function() { // 사진 저장
    var _This = $(this),
        id = _This.data('id'),
        uuid = _This.data('uuid'),
        changePhotoForm = $('#changePhotoForm'),
        photoInput = $('#frontPhoto');

    if (photoInput.length > 0 && photoInput.val()) { // 신규입력 (사진 저장) + 사진 수정
        var applyFormData = new FormData(changePhotoForm[0]),
            fileExtenstion = $('input[name="frontPhoto"]')[0].files[0].name.split('.').pop();
        applyFormData.append("file", $("input[name='frontPhoto']")[0].files[0], 'frontPhoto.' + fileExtenstion);

        $('body').prepend('<div class="loading-spinner-wrap"><div class="big-spinner"></div><div class="small-spinner"></div></div>');

        // // STR 사진 업로드 (저장)
        $.ajax({
            type: 'POST',
            url: '/pet/image/file/'+id+'/'+uuid,
            data: applyFormData,
            contentType: false,
            processData: false,
            beforeSend: function(xhr) { xhr.setRequestHeader(commonJS.header, commonJS.token); }
        }).done(function (res) {
            if(res.success){
                $('.loading-spinner-wrap').remove();
                commonJS.alertPop('사진을 교체했습니다', function() {
                    location.reload();
                });
            }else{
                commonJS.alertPop('사진 교체를 실패하였습니다');
            }
        }).fail(function(xhr, status, err) {
            console.log(xhr.status);
        });
        // // END 사진 업로드 (저장)
    }else{
        commonJS.alertPop('교체된 사진이 없습니다');
    }
});

$(document).on('click', '.send-alert-bt', function() { // 알림톡 발송
    var _This = $(this),
        thisCode = _This.data('code'),
        alertCode = $('input[name="alertType"]:checked').val(),
        telVal = $('#petSendTel').val(),
        telLen = telVal.length,
        telFr = telVal.substr(0, 3);

    $('.warning-box').text('');

    if (telLen < 10) { // 전화번호가 1자리 미만인 경우
        $('.warning-box').text('휴대폰번호를 정확하게 입력해 주세요');
        return false;
    }

    if (!miValidate.isTelFrCheck(telFr)) { // 휴대폰 앞자리
        $('.warning-box').text('010, 011, 016, 017, 018, 019 만 입력가능합니다');
        return false;
    }

    if(!alertCode){
        $('.warning-box').text('발송하실 알림톡을 선택해 주세요');
        return false;
    }

    // TODO : 알림톡 발송 API @Jinn (20.07.07)
    $.ajax({
        type: 'POST',
        url: '/api/pet/biztalk/'+alertCode+'/'+thisCode+'/'+telVal,
        contentType: 'application/json',
        dataType: 'json',
        beforeSend: function(xhr) { xhr.setRequestHeader(commonJS.header, commonJS.token); }
    }).done(function(res) {
        if(res.success){
            commonJS.alertPop('알림톡을 발송했습니다', function() {
                commonJS.removePop();
            });
        }else{
            commonJS.alertPop(res.error.message);
        }
    }).fail(function(res) {
        miDesignPop.alert({
            dConHe: 110,
            dWidth: 380,
            dCopy: res.responseJSON.error.message,
            dYesAc: function() {

            }
        });
    });
});

$(document).on('click', '.name-log', function() { // 피보험자 이름 기준 팝업
    var _This = $(this),
        thisCode = _This.data('code');

    $.ajax({
        type: 'GET',
        url: '/api/pet/joins/' + thisCode,
        contentType: 'application/json',
        dataType: 'json'
    }).done(function(res) {
        if(res.success){
            var contents = '';
            for(var i = 0; i < res.data.length; i++){
                var data = res.data[i],
                    kind = data.petKind
                    regDate = data.regDateTime,
                    name = data.petName,
                    planName = data.planName,
                    planCd = data.planCd,
                    age = data.age,
                    fee = data.fee,
                    breed = data.breed,
                    status = data.status,
                    statusTxt = '';

                switch(status){
                    case 'MS':
                    case 'CD':
                        statusTxt = '<td class="point-color5">정상</td>';
                        break;

                    case 'PF':
                    case 'CO':
                        statusTxt = '<td class="point-color3">연체</td>';
                        break;

                    case 'MW':
                        statusTxt = '<td>만기예정</td>';
                        break;
                }

                contents += '<tr>'
                                +'<td>' + (kind == 'D' ? '강아지' : '고양이') + '</td>'
                                +'<td>' + name + '</td>'
                                +'<td>' + regDate + '</td>'
                                +'<td> <a href="javascript:void(0);" class="plan-pop underline" data-planname="'+planName+'" data-age="'+age+'" data-fee="'+fee+'" data-plancd="'+planCd+'" data-breed="'+breed+'">'+planName+'</a></td>'
                                + statusTxt
                            +'</tr>';
            }


            miDesignPop.alert({
                dTarget: 'pet-customer-apply-student',
                dWidth: 800,
                dTitle : '가입내역',
                dCopy : '<div class="name-log-pop-box pop-table student-table">'
                            +'<table>'
                                +'<colgroup>'
                                    +'<col width="10%">'
                                    +'<col width="25%">'
                                    +'<col width="25%">'
                                    +'<col width="15%">'
                                    +'<col width="15%">'
                                +'</colgroup>'
                                +'<thead>'
                                    +'<tr>'
                                        +'<th>동물구분</th>'
                                        +'<th>이름</th>'
                                        +'<th>가입일시</th>'
                                        +'<th>플랜</th>'
                                        +'<th>상태</th>'
                                    +'</tr>'
                                +'</thead>'
                                +'<tbody>'
                                    + contents
                                +'</tbody>'
                            +'</table>'
                        +'</div>',
                dButtonSetNum: 0,
                dButtonSet: '',
                dCloseX: true
            });
        }else{
            commonJS.alertPop(res.error.message);
        }
    }).fail(function(res) {
        commonJS.alertPop(res.responseJSON.error.message || res.responseJSON.message);
    });
});

// STR 미니팝업
$('body').on('click', function(e) { // 상태변경 미니팝업 닫기
    if($(e.target).hasClass('status-change')){
        var existPop = $(e.target).parent().find('.status-mini-pop');
        $('.status-mini-pop').not($(existPop)).hide();
    }else if(!$(e.target).hasClass('status-mini-li')){
        $('.status-mini-pop').hide();
    }
});

statusChangeA.on('click', function() { // 상태변경 미니팝업 노출
    var _This = $(this),
        thisParentTd = _This.parent(),
        thisStatus = _This.data('status'),
        thisIsOpen = _This.data('isopen'), // 개시여부
        statusCanBe = {},
        statusCanBeList = '<ul>';

    if(thisParentTd.find('.status-mini-pop').length > 0){
        $('.status-mini-pop').show();
    }else{
        // TODO : 한글로 되어있는 status값 채워넣기 @Jinn (20.06.25)
        if(thisStatus == 'MS' || thisStatus == 'CD'){
            if(!thisIsOpen){
                statusCanBe.RF = '환불';
                statusCanBe.MD = '인수거절';
            }else{
                statusCanBe.TM = '해지';
            }

        }else if(thisStatus == 'FR'){
            statusCanBe.해지접수취소 = '해지접수취소';
        }else if(thisStatus == 'RR'){
            statusCanBe.환불접수취소 = '환불접수취소';
        }

        for(var key in statusCanBe){
            statusCanBeList += '<li class="status-mini-li" data-willbe="'+key+'">' + statusCanBe[key] + '</li>';
        }

        thisParentTd.append('<div class="status-mini-pop">' + statusCanBeList + '</ul></div>');
    }
});

$(document).on('click', '.status-mini-li', function() { // 미니팝업 액션
    var _This = $(this),
        thisTr = _This.parent().parent().parent().parent(),
        thisTrId = thisTr.data('code'),
        willBe = _This.data('willbe'),
        copy = '';

    $.ajax({
        type: 'GET',
        url: '/api/pet/reject/' + thisTrId,
        contentType: 'application/json',
        dataType: 'json'
    }).done(function(res) {
        if(res.success){
            var data = res.data,
                userName = data.name,
                tel = data.tel,
                petName = data.petName,
                kind = data.kind,
                breed = data.breed,
                birth = data.birth,
                moid = data.moid,
                paySeq = data.seq,
                newDate = new Date(birth),
                year = newDate.getFullYear(),
                month = (newDate.getMonth() + 1 >= 10) ? newDate.getMonth() + 1 : '0' + (newDate.getMonth()+1),
                day = (newDate.getDate() > 9) ? newDate.getDate() : '0' + newDate.getDate(),
                birthFormat = String(year).substr(2, 2) + month + day;

            copy +='<div class="reject-pop-student pop-table">'
                        +'<table>'
                            +'<tr>'
                                +'<td>피보험자</td>'
                                +'<td>' + userName + '(' + tel + ')</td>'
                            +'</tr>'
                            +'<tr>'
                                +'<td>반려동물</td>'
                                +'<td>' + petName + '(' + (kind == 'D' ? '강아지' : '고양이') + ')</td>'
                            +'</tr>'
                            +'<tr>'
                                +'<td>품종</td>'
                                +'<td>'+breed+'</td>'
                            +'</tr>'
                            +'<tr>'
                                +'<td>생년월일</td>'
                                +'<td>'+birthFormat+'</td>'
                            +'</tr>'
                        +'</table>';


            if(willBe == 'RF'){
                copy += '<div class="ask-copy">환불처리하시겠습니까?</div></div>';
            }else if(willBe == 'TM'){
                copy += '<div class="ask-copy">해지하시겠습니까?</div>'
                        // +'<div class="date-wrapper">'
                        //     +'<input type="text" name="cancelDate" id="cancelDate" class="mi-datepicker" autocomplete="off" placeholder="해지일 선택">'
                        // +'</div>'
                        +'</div>';
            }else if(willBe == 'MD'){
                copy += '<div class="ask-copy">인수거절하시겠습니까?</div></div>';
            }

            miDesignPop.alert({
                dTarget: 'reject-pop',
                dCopy: copy + '<div class="warning-box"></div>',
                dButtonSet: '<ul>'
                                + '<li class="w-2"><button type="button" class="no-bt no-bt-ac">아니오</button></li>'
                                + '<li class="w-2"><button type="button" class="yes-bt multi-pop-bt '+(willBe == 'TM' ? 'cancel-pay-bt' : 'reject-pay-bt')+'" data-moid="'+moid+'" data-seq="'+paySeq+'" data-code="'+thisTrId+'" data-willbe="'+willBe+'" data-name="'+userName+'">예</button></li>'
                            + '</ul>',
            });

            if(willBe == 'TM'){ // 해지일 경우 해지일 선택 datepicker
                var cancelDatepicker = $('#cancelDate');

                //datepicker 한글화 설정
                $.datepicker.regional['ko'] = {
                    closeText: '닫기',
                    currentText: '오늘',
                    prevText: '이전 달',
                    nextText: '다음 달',
                    monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                    monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                    dayNames: ['일', '월', '화', '수', '목', '금', '토'],
                    dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
                    dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
                    showMonthAfterYear: true,
                    yearSuffix: '년',
                    dateFormat: "yy-mm-dd", // 텍스트 필드에 입력되는 날짜 형식
                };
                $.datepicker.setDefaults($.datepicker.regional['ko']);

                cancelDatepicker.datepicker({
                    minDate: 1,
                    changeYear: true,
                    changeMonth: true,
                    beforeShow: function(input) {
                        var offset = $(input).offset();
                        setTimeout(function(){
                            $('#ui-datepicker-div').css({
                                'top': (offset.top + 38) - window.scrollY,
                                'left': offset.left
                            })
                        }, 0);
                    }
                });

            }
        }else{
            commonJS.alertPop(res.error.message);
        }
    }).fail(function(res) {
        commonJS.alertPop(res.responseJSON.error.message || res.responseJSON.message);
    });
});

$(document).on('click', '.reject-pay-bt', function() { // 카드결제 취소 (환불, 인수거절)
    var _This = $(this),
        willBe = _This.data('willbe'),
        moid = _This.data('moid'),
        seq = _This.data('seq');

    $.ajax({
        type: 'GET',
        url: '/pay/cancel-call/'+moid+'/'+seq+'/'+willBe,
        contentType: 'application/json',
        dataType: 'json'
    }).done(function(res) {
        if(res.success){
            commonJS.alertPop('결제 취소가 완료되었습니다', function() {
                location.reload();
            });
        }else{
            commonJS.alertPop(res.data.forwardMessage);
        }
    }).fail(function(res) {
        commonJS.alertPop('결제 취소를 실패했습니다');
    });
});

$(document).on('click', '.cancel-pay-bt', function()    { // 은행 팝업
    var _This = $(this),
        code = _This.data('code'),
        userName = _This.data('name'),
        copy = '';

    // if(!$('#cancelDate').val()){ // 해지일 선택 안됨
    //     $('.warning-box').text('해지일자를 선택해주세요');
    //     return;
    // }else{
    //     $('.warning-box').text('');
    // }

    cancelData.code = code;

    copy = '<div class="mi-input-wrap">'
                +'<div class="mi-input-group">'
                    +'<label for="bank" class="mi-input-label">은행선택</label>'
                    +'<div class="mi-input-box">'
                        +'<div class="mi-input-input">'
                            +'<select name="bank" id="cancelBank" class="mi-input select">'
                                +bankList
                            +'</select>'
                        +'</div>'
                    +'</div>'
                +'</div>'
            +'</div>'
            +'<div class="mi-input-wrap">'
                +'<div class="mi-input-group">'
                    +'<label for="account" class="mi-input-label">계좌번호</label>'
                    +'<div class="mi-input-box">'
                        +'<div class="mi-input-input">'
                            +'<input type="text" name="account" id="cancelAccount" class="mi-input" minlength="9" maxlength="17">'
                        +'</div>'
                    +'</div>'
                +'</div>'
            +'</div>'
            +'<div class="mi-input-wrap">'
                +'<div class="mi-input-group">'
                    +'<label for="owner" class="mi-input-label">예금주</label>'
                    +'<div class="mi-input-box">'
                        +'<div class="mi-input-input">'
                            +'<input type="text" id="cancelOwner" name="owner" class="mi-input" value="'+userName+'">'
                        +'</div>'
                    +'</div>'
                +'</div>'
            +'</div>'

            +'<div class="warning-box"></div>'

    miDesignPop.alert({
        dTitle: '환불접수',
        dCopy: copy,
        dButtonSet: '<ul>'
                        + '<li class="w-2"><button type="button" class="no-bt no-bt-ac">취소</button></li>'
                        + '<li class="w-2"><button type="button" class="yes-bt multi-pop-bt save-account-bt">접수</button></li>'
                    + '</ul>',
    });
});

$(document).on('click', '.save-account-bt', function() { // 환불 은행 정보 저장
    var bankInput = $('#cancelBank'),
        bankVal = bankInput.val(),
        bankText = $('#cancelBank > option:selected').text(),
        accountInput = $('#cancelAccount'),
        accountVal = accountInput.val(),
        ownerInput = $('#cancelOwner'),
        ownerVal = ownerInput.val(),
        cancelDate = $('#cancelDate').val();

    cancelData.data.bank = bankText;
    cancelData.data.bankCd = bankVal;
    cancelData.data.account = accountVal;

    $('.warning-box').text('');

    if(!bankVal){
        $('.warning-box').text('은행을 선택해주세요');
        return;
    }

    if(!accountVal){
        $('.warning-box').text('계좌번호를 입력해주세요');
        return;
    }

    if(!ownerVal){
        $('.warning-box').text('예금주명을 입력해주세요');
        return;
    }


    $.ajax({
        type: 'POST',
        url: '/api/pet/refund/' + cancelData.code,
        data: JSON.stringify(cancelData.data),
        contentType: 'application/json',
        dataType: 'json',
        beforeSend: function(xhr) { xhr.setRequestHeader(commonJS.header, commonJS.token); }
    }).done(function(res) {
        if(res.success){
            commonJS.alertPop('해지접수가 완료되었습니다', function() {
                commonJS.removePop();
                location.reload();
            });
        }else{
            commonJS.alertPop(res.error.message);
        }
    }).fail(function(res) {
        miDesignPop.alert({
            dConHe: 110,
            dWidth: 380,
            dCopy: res.responseJSON.error.message,
            dYesAc: function() {

            }
        });
    });
});

$(document).on('keyup', '#cancelAccount', function() { // 계좌번호 숫자만 입력
    var _This = $(this),
        thisVal = _This.val(),
        relVal = miValidate.isLangOnlyType(thisVal, 'NUM');

    _This.val(relVal);
});

$(document).on('keyup', '#cancelOwner', function() { // 예금주 한글 + 영어만
    var _This = $(this),
        thisVal = _This.val(),
        relVal = miValidate.isLangOnlyTypeDelete(miValidate.isLangOnlyTypeDelete(thisVal, 'NUM'), 'SPC');

    _This.val(relVal);
});

$(document).on('focusout', '#cancelOwner', function() { // 예금주 trim
    var _This = $(this),
        thisVal = _This.val(),
        relVal = thisVal.trim();

    _This.val(relVal);
});
// END 미니팝업

// STR 상담 내역
$(document).on('click', '.add-voc', function() { // 상담 팝업
    var _This = $(this),
        thisCode = _This.data('code');

    $.ajax({
        type: 'GET',
        url: '/api/voc/pet/' + thisCode,
        contentType: 'application/json',
        dataType: 'json'
    }).done(function(res) {
        if(res.success){
            var vocList = '';

            for(var i = res.data.length - 1; i > -1; i--){
                var item = res.data[i],
                    code = item.code, // api code
                    name = item.insName // api name
                    incType = item.incType, // api inc_type (상담방식)
                    vocType = item.vocType, // api voc_type (상담구분)
                    content = item.content, // api content (상담내용)
                    idx = item.idx, // api idx (상담 index)
                    createdt = (item.createdt).slice(0, 16); // api createdt (상담생성시간)

                vocList += '<div class="voc-student">'
                                +'<div class="voc-info">'
                                    +'<span>'+code+', '+incType+'문의, '+vocType+', '+name+'</span>'
                                    +'<button class="remove-student" data-idx="'+idx+'" data-code="'+code+'"></button>'
                                +'</div>'
                                +'<div class="voc-content">'+ content +'</div>'
                                +'<div class="voc-time">'+ createdt + '</div>'
                            +'</div>';
            }

            miDesignPop.alert({
                dTarget: 'voc-pop',
                dWidth: 600,
                dCopy: '<div class="voc-pop-box pop-table">'
                            +'<table>'
                                +'<tr>'
                                    +'<td>방식</td>'
                                    +'<td>'
                                        +'<input type="radio" name="q_type-"'+thisCode+' class="q-type" id="qPhone" value="P">'
                                        +'<label class="mi-input-label" for="qPhone">전화문의</label>'
                                        +'<input type="radio" name="q_type-"'+thisCode+' class="q-type" id="qEmail" value="E">'
                                        +'<label class="mi-input-label" for="qEmail">이메일문의</label>'
                                    +'</td>'
                                +'</tr>'

                                +'<tr>'
                                    +'<td>구분</td>'
                                    +'<td>'
                                        +'<input type="radio" name="voc_type-"'+thisCode+' class="voc-type" id="vocCancle" value="C">'
                                        +'<label class="mi-input-label" for="vocCancle">취소</label>'
                                        +'<input type="radio" name="voc_type-"'+thisCode+' class="voc-type" id="vocReward" value="R">'
                                        +'<label class="mi-input-label" for="vocReward">보상</label>'
                                        +'<input type="radio" name="voc_type-"'+thisCode+' class="voc-type" id="vocNormal" value="N">'
                                        +'<label class="mi-input-label" for="vocNormal">일반/이용안내</label>'
                                        +'<input type="radio" name="voc_type-"'+thisCode+' class="voc-type" id="vocPay" value="P">'
                                        +'<label class="mi-input-label" for="vocPay">결제</label>'
                                        +'<input type="radio" name="voc_type-"'+thisCode+' class="voc-type" id="vocEtc" value="E">'
                                        +'<label class="mi-input-label" for="vocEtc">기타</label>'
                                    +'</td>'
                                +'</tr>'

                            +'</table>'

                            +'<div>'
                                +'<textarea id="vocContent"></textarea>'
                            +'</div>'

                            +'<div class="bt-wrap pop-info">'
                                +'<ul>'
                                    + '<li class="w-2"><button type="button" class="no-bt no-bt-ac">취소</button></li>'
                                    + '<li class="w-2"><button type="button" class="yes-bt voc-save-bt" data-code="'+thisCode+'">저장</button></li>'
                                +'</ul>'
                            +'</div>'

                            +'<div class="warning-box"></div>'

                            +'<div class="voc-student-box">'
                                +vocList
                            +'</div>'

                        +'</div>',
                dButtonSetNum: 0,
                dButtonSet: '',
                dCloseX: true,
            });
        }else{
            commonJS.alertPop(res.error.message);
        }
    }).fail(function(res) {
        commonJS.alertPop(res.responseJSON.error.message || res.responseJSON.message);
    });
});

$(document).on('click', '.voc-save-bt', function() { // 저장 버튼 클릭
    var _This = $(this),
        dataCode = _This.data('code'),
        qType = $('.q-type:checked'),
        qTypeVal = qType.val(),
        vocType = $('.voc-type:checked')
        vocTypeVal = vocType.val(),
        vocContent = $('#vocContent'),
        vocContentVal = vocContent.val().trim(),
        ajaxData = {},

        warningBox = $('.warning-box');

    warningBox.text('');

    if(!qTypeVal){
        warningBox.text('상담방식을 선택해주세요');
        return;
    }
    if(!vocTypeVal){
        warningBox.text('상담구분을 선택해주세요');
        return;
    }
    if(vocContentVal.length < 1){
        vocContentVal = '';
    }

    ajaxData.code = dataCode;
    ajaxData.incTypeStr = qTypeVal;
    ajaxData.vocTypeStr = vocTypeVal;
    ajaxData.content = vocContentVal;
    ajaxData.service = 'pet';

    // STR 상담 내역 저장 API
    $.ajax({
        type: 'POST',
        url: '/api/voc',
        data: JSON.stringify(ajaxData),
        contentType: 'application/json',
        dataType: 'json',
        beforeSend: function(xhr) { xhr.setRequestHeader(commonJS.header, commonJS.token); }
    }).done(function(res) {
        if(res.success){
            var data = res.data, // 상담내역 리스트
            dataCode = data.code,
            dataVocType = data.vocType,
            dataIncType = data.incType,
            dataContent = data.content,
            dataName = data.insName,
            dataIdx = data.idx, // api idx (상담 index)
            dataCreatedt = (data.createdt).slice(0, 16); // api createdt (상담생성시간)

            vocList = '<div class="voc-student">'
                        +'<div class="voc-info">'
                            +'<span>'+dataCode+', '+dataIncType+'문의, '+dataVocType+', '+dataName+'</span>'
                            +'<button class="remove-student" data-idx="'+dataIdx+'" data-code="'+dataCode+'"></button>'
                        +'</div>'
                        +'<div class="voc-content">'+ dataContent +'</div>'
                        +'<div class="voc-time">'+ dataCreatedt + '</div>'
                    +'</div>';

            $('.voc-student-box').prepend(vocList);

            var vocCount = $('#vocList_' + dataCode),
            vocCountVal = Number(vocCount.text()); // 상담내역 카운트

            vocType.prop('checked', false);
            qType.prop('checked', false);
            vocContent.val('');
            vocCount.text(vocCountVal+1);
        }

    }).fail(function(res) {
        commonJS.alertPop(res.responseJSON.error.message || res.responseJSON.message);
    });
});

$(document).on('click', '.remove-student', function() { // 상담 내역 삭제
    var _This = $(this),
        list = _This.parents('.voc-student'),
        code = _This.data('code'),
        idx = _This.data('idx');

    miDesignPop.alert({
        dConHe: 110,
        dCopy: '상담내역을 삭제하시겠습니까?',
        dButtonSetNum: 2,
        dYesAc: function() {
            $.ajax({
                type: 'POST',
                url: '/api/voc/pet/' + code + '/' + idx,
                contentType: 'application/json',
                dataType: 'json',
                beforeSend: function(xhr) { xhr.setRequestHeader(commonJS.header, commonJS.token); }
            }).done(function(res) {
                if(res.success){
                    var vocCountVal = Number($('#vocList_' + code).text()); // 상담내역 카운트
                        list.remove();
                        $('#vocList_' + code).text(vocCountVal-1);
                }else{
                    commonJS.alertPop(res.error.message);
                }
            }).fail(function(res) {
                miDesignPop.alert({
                    dConHe: 110,
                    dWidth: 380,
                    dCopy: res.responseJSON.error.message,
                    dYesAc: function() {

                    }
                });
            });
        }
    });
});
// END 상담 내역

bankList += '<option value="004">국민은행</option>'
            +'<option value="020">우리은행</option>'
            +'<option value="088">신한은행</option>'
            +'<option value="005">KEB하나은행</option>'
            +'<option value="011">NH농협은행</option>'
            +'<opti?on value="">지역농축협</opti?on>'
            // +'<option value="003">IBK기업은행</option>'
            +'<option value="023">SC제일은행</option>'
            +'<option value="027">한국씨티은행</option>'
            +'<option value="090">카카오뱅크</option>'
            +'<option value="089">케이뱅크</option>'
            +'<option value="032">부산은행</option>'
            +'<option value="039">경남은행</option>'
            +'<option value="031">대구은행</option>'
            +'<option value="037">전북은행</option>'
            +'<option value="034">광주은행</option>'
            +'<option value="035">제주은행</option>'
            +'<option value="007">수협은행</option>'
            +'<option value="002">산업은행</option>'
            +'<option value="903">저축은행</option>'
            +'<option value="901">새마을금고</option>'
            +'<option value="902">신협</option>';
            // +'<option value="">우체국</option>';
