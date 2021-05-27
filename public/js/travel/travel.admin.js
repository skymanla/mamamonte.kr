var countryChange = $('.country-change'),
    couponState = $('.coupon-state'),

    vocListItem = $('.voc-student-item'), // 상담 현황 출력
    blackListApply = $('.blacklist-apply'), // 블랙리스트 신청 내역

    korPaperBtn = $('.kor-paper-btn'),
    engPaperBtn = $('.eng-paper-btn'),

    searchForm = $('#searchForm'), // 검색 폼
    excelBtn = $('#excelBtn'); // 엑셀 다운로드 버튼

function showDetailList(code, target) { // 세부리스트 API
    var year = target.data('year');
    year = (year == '2017') ? year+"/" : ""; // 과거 2017년도 일 경우 API 변경

    $.ajax({ // 해외단기 상세 리스트 API
        type: 'GET',
        url: '/api/people/'+year+'info/'+code+'/'+travelCommonJS.currentService,
        dataType: 'json'
    }).done(function(res) {
        var infoTr = '',
            orgTotal = 0,
            priceTotal = 0,

            detailTr = $('#people_'+code);
        for(var i = 0; i < res.data.length; i++){
            var data = res.data[i],
                dataCode = data.code, // code  (subCode)
                dataProductCode = data.product_code, // 상품코드
                dataName = data.name, // 이름
                dataBirth = data.birth, // 생년월일
                dataResident = data.resident, // 주민번호 뒷자리
                dataAge = data.age, // 나이
                dataSex = data.sex, // 성별
                dataTel = data.tel, // 전화번호
                dataEmailArr = (data.email).split('@'), // 이메일
                dataEmailId = dataEmailArr[0], // 이메일 앞부분
                dataEmailDomain = dataEmailArr[1], // 이메일 뒷부분
                dataPrice = data.price, // 할인 후 가격
                dataOrgPrice = data.org_price, // 할인 전 가격
                dataStateCode = data.state.code, // 상태
                dataStateValue = data.state.value, // 상태
                dataRequester = data.requester, // 환불 여부 (1 : 전체환불 아니면 개별환불) - B나 F일 경우 변경 컬럼에 버튼으로 들어감
                dataVocCount = data.voc_count, // 상담 횟수
                dataPgCategory = data.pgcategory, // kcp / 스마트로
                dataRefundDate = data.refund_date, // 환불일시
                dataReject = data.reject, // 해약등록여부
                dataOldInsurance = data.oldInsurance || '-',

                refundBtn = '', // 환불 버튼
                cancelInsuBtn = '', // 보험해약 버튼
                modType = '',
                btnTitle = '',
                refundType = '',

                isCustomEmail = false;

            orgTotal += dataOrgPrice;
            priceTotal += dataPrice;

            if(dataPgCategory == 'KCP'){
                refundType = '(KCP)' ;
            }else if(dataPgCategory == 'smatro'){
                refundType = '(스마트로)';
            }

            if(dataRequester == '1'){
                modType = 'all';
                btnTitle = '전체환불';
            }else{
                modType = 'part';
                btnTitle = '환불';
            }

            if(dataEmailDomain != 'naver.com'
                && dataEmailDomain != 'daum.net'
                && dataEmailDomain != 'hanmail.net'
                && dataEmailDomain != 'gmail.com'
                && dataEmailDomain != 'nate.com'
                && dataEmailDomain != 'mibank.me'
            ){
                isCustomEmail = true;
            }

            if(dataRefundDate && dataStateCode == 'D'){ // 이미 환불된 상태
                refundBtn += dataRefundDate;
                cancelInsuBtn = '-';
            }else if(dataStateCode != 'D' && dataStateCode != 'C'){
                if(dataStateCode == 'B' || dataStateCode == 'F'){
                    refundBtn += '<button class="mi-input active btn-in-detail" id="refundBtn" data-status="'+dataStateCode+'" data-type="'+modType+'" data-pg="'+dataPgCategory+'">'+btnTitle+' '+refundType+'</button>';


                    if(dataReject){ // 저장된 정보 있음
                        cancelInsuBtn = '<button class="mi-input cancel-insu-btn btn-in-detail" id="cancelInsuBtn_'+code+'" data-status="'+dataStateCode+'">보기</button>';
                    }else{
                        cancelInsuBtn = '<button class="mi-input active cancel-insu-btn btn-in-detail" id="cancelInsuBtn_'+code+'" data-status="'+dataStateCode+'">등록</button>';
                    }

                    if(dataRequester == '1' && res.data.length > 1){ // 대표자건 개별환불 추가
                        refundBtn += '<button class="mi-input active btn-in-detail" id="refundBtn" data-status="'+dataStateCode+'" data-type="part" data-pg="'+dataPgCategory+'">환불 '+refundType+'</button>';
                    }
                }else if(dataStateCode == 'E' && dataRequester == '1') {
                    refundBtn += '<button class="mi-input active btn-in-detail" id="payboocCompleteBtn">무통장입금완료</button>';
                }
            }

            infoTr += '<tr class="detail-tr" id="companion_'+code+'_'+dataCode
                        +'" data-code="'+code
                        +'" data-datacode="'+dataCode
                        +'" data-name="'+dataName
                        +'" data-age="'+dataAge
                        +'" data-price="'+dataPrice
                        +'" data-state="'+dataStateCode+'">'
                        +'<td class="with-input">'
                            +'<input type="text" class="mi-input" id="name" name="name" value='+dataName+'>'
                        +'</td>'
                        +'<td>'
                            +'<span id="birthText">'+dataBirth+'</span>'
                        +'</td>'
                        +'<td class="with-input">'
                            +'<input type="text" class="mi-input" id="resident" name="resident" value='+dataResident+' maxlength="7">'
                        +'</td>'
                        +'<td>'
                            +'<span id="sexText">'+dataSex+'</span>'
                        +'</td>'
                        +'<td>'
                            +'<span id="ageText">'+dataAge+'</span>'
                        +'</td>'
                        +'<td class="'+(code == dataCode ? 'with-input' : '')+'">'
                            +(code == dataCode ? '<input type="text" class="mi-input" id="tel" name="tel" value='+dataTel+' maxlength="11">' : '-')
                        +'</td>'
                        +'<td class="email-td">'
                            + (code == dataCode ? '<div class="mi-input-wrap">'
                            + '<div class="mi-input-group align-top">'
                                + '<div class="mi-input-box">'
                                    + '<div class="mi-input-input">'
                                        +'<input type="text" class="mi-input email1-detail" id="email1Detail" value="'+dataEmailId+'">'
                                    + '</div>'
                                    + '<div class="mi-input-connect"><span class="at">@</span></div>'
                                    + '<div class="mi-input-input">'
                                        + '<input type="text" class="mi-input" id="email2Detail" style="margin-bottom: 10px;'+(isCustomEmail ? "" : "display: none;")+'" value="'+dataEmailDomain+'">'
                                        + '<select name="" id="email2ChangeDetail" class="mi-input select email2-change-detail">'
                                        + '<option value="" selected disabled hidden>선택</option>'
                                        + '<option value="naver.com" '+(dataEmailDomain == "naver.com" ? "selected" : "")+'>naver.com</option>'
                                        + '<option value="daum.net" '+(dataEmailDomain == "daum.net" ? "selected" : "")+'>daum.net</option>'
                                        + '<option value="hanmail.net" '+(dataEmailDomain == "hanmail.net" ? "selected" : "")+'>hanmail.net</option>'
                                        + '<option value="gmail.com" '+(dataEmailDomain == "gmail.com" ? "selected" : "")+'>gmail.com</option>'
                                        + '<option value="nate.com" '+(dataEmailDomain == "nate.com" ? "selected" : "")+'>nate.com</option>'
                                        + '<option value="mibank.me" '+(dataEmailDomain == "mibank.me" ? "selected" : "")+'>mibank.me</option>'
                                        + '<option value="custom"'+(isCustomEmail ? "selected" : "")+'>직접입력</option>'
                                        + '</select>'
                                    + '</div>'
                                + '</div>'
                            + '</div>'
                        + '</div>' : '-')
                        +'</td>'
                        +'<td>'
                            +'<span id="orgPriceText">'+miValidate.isNumComma(dataOrgPrice)+'</span>'
                        +'</td>'
                        +(commonJS.currentPathname.indexOf('yuhak') > -1 ? '<td>'
                            +'<span>'+dataOldInsurance+'</span>'
                        +'</td>' : '')
                        +'<td>'
                            +'<span id="priceText">'+miValidate.isNumComma(dataPrice)+'</span>'
                        +'</td>'
                        +'<td class="no-click">'
                            +'<a href="javascript:void(0);" id="productCodeText" data-plan="'+dataProductCode+'">'+dataProductCode+'</a>'
                        +'</td>'
                        +'<td class="no-click">'
                            +'<button class="mi-input btn-in-detail" id="modifyBtn"> 수정 </button>'
                        +'</td>'
                        +'<td class="'+(refundBtn ? 'refund-td' : '')+' no-click">'
                            +'<div>'
                            +(refundBtn ? refundBtn : '-')
                            +'</div>'
                        +'</td>'
                        +(travelCommonJS.currentService == 'B' || travelCommonJS.currentService == 'W' ? '<td class="'+(cancelInsuBtn ? 'cancel-insu-td' : '')+' no-click">'
                            +'<div>'
                            +(cancelInsuBtn ? cancelInsuBtn : '-')
                            +'</div>'
                        +'</td>' : '')
                        +'<td class="no-click">'
                            +(dataVocCount ? '<a href="javascript:void(0)" id="vocCountText">'+dataVocCount+'</a>' : '-')
                        +'</td>'
                    +'</tr>';
        }
        var infoTable = '<td colspan="30">'
                        +'<table class="table detail">'
                            +'<thead>'
                                +'<th>이름</th>'
                                +'<th>생년월일</th>'
                                +'<th>주민번호</th>'
                                +'<th>성별</th>'
                                +'<th>나이</th>'
                                +'<th>휴대폰번호</th>'
                                +'<th>이메일</th>'
                                +'<th>보험료('+miValidate.isNumComma(orgTotal)+')</th>'
                                +(commonJS.currentPathname.indexOf('yuhak') > -1 ? '<th>기존보험사</th>' : '')
                                +'<th>결제금액('+miValidate.isNumComma(priceTotal)+')</th>'
                                +'<th>플랜</th>'
                                +'<th>변경</th>'
                                +'<th>환불</th>'
                                +(commonJS.currentPathname.indexOf('yuhak') > -1 || commonJS.currentPathname.indexOf('wholiday') > -1 ? '<th>보험해약</th>' : '')
                                +'<th>상담</th>'
                            +'</thead>'
                            +'<tbody>'
                                + infoTr
                            +'</tbody></table></td>';
        if(detailTr.length > 0){
            target.html(infoTable);
        }else{
            target.after('<tr id="people_'+code+'" class="people visible">'+infoTable+'</tr>');
        }
    }).fail(function(res) {
        commonJS.alertPop(res.responseJSON.error.message || res.responseJSON.message);
    });
}

function changeListAfterCancel(res, thisTd) { // 환불 후 리스트 변경
    var cancelDate = res.data.cancelDate || res.data.refundDate,
        code = res.data.code,
        peopleCode = res.data.peopleCode,

        compList = $('#companion_'+code+'_'+peopleCode),
        peopleTr = $('#people_'+code);

    compList.attr('data-state', 'D');
    thisTd.html(cancelDate);
    $('#refund-pop').remove();
    $('html').removeClass('mi-scroll-none');

    if(res.data.type == 'all'){ // 전체 환불일 경우에만 메인 리스트 상태 변경
        $('#listState_'+code).text('환불').attr('class', 'state-D');
        $('#list_'+code).find('input[type=checkbox]').attr('data-status', 'D');

        peopleTr.find('.refund-td').html(cancelDate);
    }else{
        var isAllD = true;
        $('#people_'+code).find('.detail-tr').each(function(idx, item){
            if($(item).attr('data-state') != 'D'){
                isAllD = false;
                return;
            }
        });
        if(isAllD){ // 전체환불일 경우
            $('#listState_'+code).text('환불').attr('class', 'state-D');
            $('#list_'+code).find('input[type=checkbox]').attr('data-status', 'D');
        }
    }
}

function searchCountry(keyword){
    $.ajax({
        type: 'GET',
        url: '/api/travel/country?search='+keyword,
        contentType: 'application/json',
        dataType: 'json',
    }).done(function(res) {
        if(res.success){
            var select = $('#countryInputBox');
                data = res.data,
                options = '<div class="mi-input-group">'
                            +'<select class="mi-input select" id="countryList">'
                                +'<option value="" selected disabled hidden>선택</option>';

            for(var i = 0; i < data.length; i++){
                options += '<option value="'+data[i].code+'">' + data[i].nameKor + '</option>';
            }

            if($('#countryList').length < 1){
                select.append(options+'</select></div>');
            }else{
                $('#countryList').html(options);
            }
        }else{
            commonJS.alertPop(res.error.message);
        }
    }).fail(function(res) {
    });
}

// STR 메인 리스트
couponState.on('click', function() {
    var _This = $(this),
        Tr = _This.parent().parent(),
        thisName = Tr.find('#name').text(),
        thisTel = Tr.data('tel');

    $.ajax({
        type: 'GET',
        url: '/api/travel/coupon/' + thisTel,
        contentType: 'application/json',
        dataType: 'json'
    }).done(function(res) {
        if(res.success) {
            var list = res.data;
            var copy = '<div class="coupon-pop-box pop-table student-table">'
                        +'<table>'
                            +'<thead>'
                                +'<tr>'
                                    +'<th>등록일</th>'
                                    +'<th>만료일</th>'
                                    +'<th>만료기간</th>'
                                    +'<th>분류</th>'
                                +'</tr>'
                            +'</thead>'
                            +'<tbody>';

            for(var i = 0; i < list.length; i++) {
                var data = list[i];
                copy += '<tr>'
                            +'<td>'+data.regDate+'</td>'
                            +'<td>'+data.endDate+'</td>'
                            +'<td>'+data.day+'일</td>'
                            +'<td>'+data.isGift+'</td>'
                        +'</tr>';
            }

            miDesignPop.alert({
                dWidth: 1000,
                dTitle: thisName+'님의 쿠폰 내역',
                dCopy: copy + '</tbody></table></div>',
                dCloseX: true,
                dButtonSetNum: 0,
                dButtonSet: '',
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
countryChange.on('click', function() {
    var _ThisA = $(this),
        tr = _ThisA.parent().parent(),
        code = tr.data('code'),
        orgCountry = _ThisA.text();
    miDesignPop.alert({
        dTarget: 'country-pop',
        dTitle: '여행 국가 변경',
        dCopy: '<div class="country-pop-box">'
                    +'<div class="current-box">'
                        +'<span class="current-title">현재 여행 국가</span>'
                        +'<span class="current-text">'+orgCountry+'</span>'
                    +'</div>'
                    +'<div class="mi-input-wrap popup-input" id="countryInputBox">'
                        +'<div class="mi-input-group">'
                            +'<div class="mi-input-box">'
                                +'<div class="mi-input-input">'
                                    +'<input type="text" class="mi-input" id="countryName" placeholder="변경할 국가 이름">'
                                +'</div>'
                                +(travelCommonJS.currentService != 'B' ? '<div>'
                                    +'<button class="mi-input" id="searchCountry">검색</button>'
                                +'</div>' : '')
                            +'</div>'
                        +'</div>'
                    +'</div>'
                +'</div>',
        dCloseX: true,
        dButtonSet: '<ul>'
                        + '<li class="w-1"><button type="button" class="yes-bt multi-pop-bt">변경</button></li>'
                    + '</ul>',
    });

    $(document).off('click', '#searchCountry').on('click', '#searchCountry', function() {
        searchCountry($('#countryName').val());
    });

    $(document).on('keydown', '#countryName', function(key) {
        if(key.keyCode == 13){
            searchCountry($('#countryName').val());
        }
    });

    $(document).on('click', '.multi-pop-bt', function() {
        var countrySelect = $('#countryList'),
            thisVal = countrySelect.val(),
            thisText = countrySelect.find('option:selected').text(),
            ajaxData = {};

        ajaxData.code = thisVal;
        ajaxData.name = thisText;

        $.ajax({
            type: 'POST',
            url: '/api/travel/country/'+code,
            data: JSON.stringify(ajaxData),
            contentType: 'application/json',
            dataType: 'json',
            beforeSend: function(xhr) { xhr.setRequestHeader(commonJS.header, commonJS.token); }
        }).done(function(res) {
            if(res.success){
                commonJS.alertPop('국가 변경이 완료되었습니다', function() {
                    _ThisA.text(res.data.name);
                    $('.mi-common-pop').remove();
                    $('html').removeClass('mi-scroll-none');
                });
            }else{
                commonJS.alertPop('국가 변경이 실패했습니다\n다시 시도해주세요');
            }
        }).fail(function(res) {
            commonJS.alertPop(res.responseJSON.error.message || res.responseJSON.message);
        });
    });
});
// END 메인 리스트

// STR 세부정보
$(document).on('click', '#refundBtn', function() { // 환불 및 취소 버튼
    var _This = $(this),
        thisTd = _This.parent().parent(),
        status = _This.data('status'),
        type = _This.data('type'),
        pg = _This.data('pg'),
        tr = thisTd.parent(),
        code = tr.data('code'),
        dataCode = tr.data('datacode'),
        name = tr.data('name'),
        price = tr.data('price'),
        ajaxData = {},
        cancelAjaxData = {};

    if(status == 'B'){ // 카드결제
        $.ajax({
            type: 'GET',
            url: '/api/travel/cancel/'+code+'/'+dataCode,
            contentType: 'application/json',
            dataType: 'json',
        }).done(function(res) {
            var data = res.data,
                dataTel = data.tel,
                dataName = data.name,
                dataBirth = data.birth,
                dataResident = data.resident,
                dataTel = data.tel,
                dataTID = data.tid,
                dataMID = data.mid,
                dataService = data.service,
                dataPrice = data.price, // 개별환불 금액
                dataAmtTotal = data.amtTotal, // 취소 가능 금액
                dataRefundPrice = (type == 'all' ? dataAmtTotal : dataPrice), // cancel_amt
                dataAuthCode = data.authCode,
                dataPayMethod = data.payMethod,
                dataState = data.state;

            cancelAjaxData.code = String(code);
            cancelAjaxData.people_code = String(dataCode);
            cancelAjaxData.tid = dataTID;
            cancelAjaxData.mid = dataMID;
            cancelAjaxData.service = dataService;
            cancelAjaxData.type = type;
            cancelAjaxData.paymethod = dataPayMethod;
            cancelAjaxData.state = dataState;
            cancelAjaxData.pg = pg;
            cancelAjaxData.tel = dataTel;
            cancelAjaxData.buyer_name = dataName;
            cancelAjaxData.cancel_amt = String(dataRefundPrice);
            cancelAjaxData.cancel_amt_total = String(dataAmtTotal);
            cancelAjaxData.auth_code = dataAuthCode;

            miDesignPop.alert({
                dTarget: 'refund-pop',
                dTitle: '카드결제 취소 ' + (type == 'all' ? '(전체환불)' : '(개별환불)'),
                dCopy: '<div class="voc-pop-box pop-table">'
                            +'<table>'
                                +'<tr>'
                                    +'<td>성명</td>'
                                    +'<td>'+dataName+'</td>'
                                +'</tr>'
                                +'<tr>'
                                    +'<td>주민등록번호</td>'
                                    +'<td>'+dataBirth +'-'+dataResident+'</td>'
                                +'</tr>'
                                +'<tr>'
                                    +'<td>휴대폰번호</td>'
                                    +'<td>'+(dataTel || '-')+'</td>'
                                +'</tr>'
                                +'<tr>'
                                    +'<td>보험료</td>'
                                    +'<td>'+miValidate.isNumComma(dataRefundPrice)+'</td>'
                                +'</tr>'
                            +'</table>'
                        +'</div>',
                dButtonSet: '<ul>'
                                + '<li class="w-2"><button type="button" class="no-bt no-bt-ac">닫기</button></li>'
                                + '<li class="w-2"><button type="button" class="yes-bt multi-pop-bt">결제취소</button></li>'
                            +'</ul>'
            });

        }).fail(function(res) {
            commonJS.alertPop(res.responseJSON.error.message || res.responseJSON.message);
        });


        // STR 결제 취소
        $(document).off('click', '.multi-pop-bt').on('click', '.multi-pop-bt', function() {
            $.ajax({
                type: 'POST',
                url: '/travel/ajax/cancel/',
                data: JSON.stringify(cancelAjaxData),
                contentType: 'application/json',
                dataType: 'json',
                beforeSend: function(xhr) { xhr.setRequestHeader(commonJS.header, commonJS.token); }
            }).done(function(res) {
                if(res.success){
                    commonJS.alertPop('결제를 취소했습니다', function() {
                        changeListAfterCancel(res, thisTd)
                    });
                }else{
                    commonJS.alertPop(res.error.message);
                }
            }).fail(function(res) {
                commonJS.alertPop(res.responseJSON.error.message || res.responseJSON.message);
            });
        });
        // END 결제 취소

    }else if(status == 'F'){ // 무통장 결제
        ajaxData.code = code;
        ajaxData.peopleCode = dataCode;
        ajaxData.type = type;

        miDesignPop.alert({
            dConHe: 110,
            dCopy: '무통장신청을 취소하시겠습니까?',
            dButtonSetNum: 2,
            dYesAc: function() {

                // STR 무통장 취소 API
                $.ajax({
                    type: 'POST',
                    url: '/api/travel/pay/refund',
                    data: JSON.stringify(ajaxData),
                    contentType: 'application/json',
                    dataType: 'json',
                    beforeSend: function(xhr) { xhr.setRequestHeader(commonJS.header, commonJS.token); }
                }).done(function(res) {
                    if(res.success){
                        commonJS.alertPop('결제를 취소했습니다', function() {
                            changeListAfterCancel(res, thisTd)
                        });
                    }
                }).fail(function(res) {
                    commonJS.alertPop(res.responseJSON.error.message || res.responseJSON.message);
                });
                // END 무통장 취소 API
            }
        });

    }
});

$(document).on('click', '.cancel-insu-btn', function() { // 보험해약 버튼
    var _This = $(this),
        thisTd = _This.parent().parent(),
        tr = thisTd.parent(),
        code = tr.data('code'),
        getName = tr.data('name');

    $.ajax({
        type: 'GET',
        url: '/api/travel/reject/' + code,
        contentType: 'application/json',
        dataType: 'json'
    }).done(function(res) {
        if(res.success){
            var data = res.data,
                rejectAt = data.rejectAt || '',
                refundAt = data.refundAt || '',
                price = data.price || '',
                account = data.account || '',
                name = data.name || getName;

            miDesignPop.alert({
                dTarget: 'cancelinsu-pop',
                dTitle: '보험해약정보 입력',
                dCopy: '<div class="cancelinsu-pop-box">'
                        +'<div class="mi-input-wrap">'
                            +'<div class="mi-input-group">'
                                +'<label for="cancelAt" class="mi-input-label">해약일</label>'
                                +'<div class="mi-input-box">'
                                    +'<div class="mi-input-input">'
                                        +'<input type="text" name="cancelAt" id="cancelAt" class="mi-datepicker" autocomplete="off" placeholder="해지일" readonly value="'+rejectAt+'">'
                                    +'</div>'
                                +'</div>'
                            +'</div>'
                        +'</div>'
                        +'<div class="mi-input-wrap">'
                            +'<div class="mi-input-group">'
                                +'<label for="refundAt" class="mi-input-label">환급일</label>'
                                +'<div class="mi-input-box">'
                                    +'<div class="mi-input-input">'
                                        +'<input type="text" name="refundAt" id="refundAt" class="mi-datepicker" autocomplete="off" placeholder="환급일" readonly value="'+refundAt+'">'
                                    +'</div>'
                                +'</div>'
                            +'</div>'
                        +'</div>'
                        +'<div class="mi-input-wrap">'
                            +'<div class="mi-input-group">'
                                +'<label for="cancelPrice" class="mi-input-label">환급보험료</label>'
                                +'<div class="mi-input-box">'
                                    +'<div class="mi-input-input">'
                                        +'<input type="text" name="cancelPrice" id="cancelPrice" class="mi-input" placeholder="환급보험료" value="'+price+'">'
                                    +'</div>'
                                +'</div>'
                            +'</div>'
                        +'</div>'
                        +'<div class="mi-input-wrap">'
                            +'<div class="mi-input-group">'
                                +'<label for="cancelAccount" class="mi-input-label">환급계좌</label>'
                                +'<div class="mi-input-box">'
                                    +'<div class="mi-input-input">'
                                        +'<input type="text" name="cancelAccount" id="cancelAccount" class="mi-input" placeholder="환급계좌" value="'+account+'">'
                                    +'</div>'
                                +'</div>'
                            +'</div>'
                        +'</div>'
                        +'<div class="mi-input-wrap">'
                            +'<div class="mi-input-group">'
                                +'<label for="cancelName" class="mi-input-label">예금주</label>'
                                +'<div class="mi-input-box">'
                                    +'<div class="mi-input-input">'
                                        +'<input type="text" name="cancelName" id="cancelName" class="mi-input" value="'+name+'" placeholder="예금주">'
                                    +'</div>'
                                +'</div>'
                            +'</div>'
                        +'</div>'

                        +'<div class="warning-box"></div>'
                        +'</div>',

                dButtonSet: '<ul>'
                                + '<li class="w-2"><button type="button" class="no-bt no-bt-ac">취소</button></li>'
                                + '<li class="w-2"><button type="button" class="yes-bt multi-pop-bt save-cancel-bt" data-code="'+code+'">저장</button></li>'
                            + '</ul>',
            });

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

            $('#cancelAt').datepicker({
                changeYear: true,
                changeMonth: true,
            });

            $('#refundAt').datepicker({
                changeYear: true,
                changeMonth: true,
            });
        }else{
            commonJS.alertPop(res.error.message);
        }
    }).fail(function(res) {
        commonJS.alertPop(res.responseJSON.error.message || res.responseJSON.message);
    });
});


$(document).on('click', '.save-cancel-bt', function() { // 보험해약정보 저장
    var _This = $(this),
        code = _This.data('code'),

        cancelAtInput = $('#cancelAt'),
        cancelAtVal = cancelAtInput.val(),

        refundAtInput = $('#refundAt'),
        refundAtVal = refundAtInput.val(),

        cancelAccountInput = $('#cancelAccount'),
        cancelAccountVal = cancelAccountInput.val(),

        cancelPriceInput = $('#cancelPrice'),
        cancelPriceVal = cancelPriceInput.val(),

        cancelNameInput = $('#cancelName'),
        cancelNameVal = cancelNameInput.val(),

        ajaxData = {
            cancelAt : cancelAtVal,
            refundAt : refundAtVal,
            account: cancelAccountVal,
            price : cancelPriceVal,
            name : cancelNameVal
        };

    // STR 보험해약 저장 API
    $.ajax({
        type: 'POST',
        url: '/api/travel/reject/' + code,
        data: JSON.stringify(ajaxData),
        contentType: 'application/json',
        dataType: 'json',
        beforeSend: function(xhr) { xhr.setRequestHeader(commonJS.header, commonJS.token); }
    }).done(function(res) {
        if(res.success){
            commonJS.alertPop('저장되었습니다', function() {
                $('#cancelInsuBtn_' + code).text('수정');
                commonJS.removePop();
            });
        }else{
            commonJS.alertPop(res.error.message);
        }
    }).fail(function(res) {
        commonJS.alertPop(res.responseJSON.error.message || res.responseJSON.message);
    });
    // END 보험해약 저장 API
});

$(document).on('keyup', '#cancelPrice', function() { // 보험료는 숫자만 입력 가능
    var _This = $(this),
        thisVal = _This.val(),
        thisValValidate = miValidate.isLangOnlyType(thisVal, 'NUM');

    _This.val(thisValValidate);
});

$(document).on('click', '#payboocCompleteBtn', function() { // 무통장 결제완료 처리
    var _This = $(this),
        thisTr = _This.parent().parent().parent(),
        code = thisTr.data('code'),
        parentsTr = _This.parents('#people_'+code),
        ajaxData = {};

    ajaxData.code = code;

    miDesignPop.alert({
        dConHe: 110,
        dCopy: '무통장 입금을 완료 처리하시겠습니까?',
        dButtonSetNum: 2,
        dYesAc: function() {

            // STR 무통장 완료 API
            $.ajax({
                type: 'POST',
                url: '/api/travel/pay/'+code,
                data: JSON.stringify(ajaxData),
                contentType: 'application/json',
                dataType: 'json',
                beforeSend: function(xhr) { xhr.setRequestHeader(commonJS.header, commonJS.token); }
            }).done(function(res) {
                if(res.success){
                    commonJS.alertPop('완료 처리되었습니다', function() {
                        showDetailList(code, parentsTr); // 세부리스트 API
                        $('#listState_'+code).text('무통장입금완료').attr('class', 'state-F');
                        $('#list_'+code).removeClass('highlight'); // 하이라이트 제거
                        $('#list_'+code).find('input[type=checkbox]').attr('data-status', 'F');
                    });
                }
            }).fail(function(res) {
                commonJS.alertPop(res.responseJSON.error.message || res.responseJSON.message);
            });
            // END 무통장 완료 API
        }
    });
});

$(document).on('click', '#vocCountText', function() { // 상담내역 리스트 출력
    var _This = $(this),
        thisTd = _This.parent(), // 상담내역 td
        thisTr = thisTd.parent(), // 현재 tr
        vocCount = _This, // 상담내역 a태그
        dataName = thisTr.data('name'), // 현재 tr name
        dataCode = thisTr.data('datacode'); // 현재 tr code

    // STR 상담내역 가져오기 API
    $.ajax({
        type: 'GET',
        url: '/api/travel/voc/' + dataCode,
        data: '',
        contentType: 'application/json',
        dataType: 'json'
    }).done(function(res) {
        var dataList = res.data, // 상담내역 리스트
            vocList = '';

        for(var i = 0; i < dataList.length; i++){
            var item = dataList[i],
                code = item.code, // api code
                name = item.name // api name
                incType = item.inc_type, // api inc_type (상담방식)
                vocType = item.voc_type, // api voc_type (상담구분)
                content = item.content, // api content (상담내용)
                idx = item.idx, // api idx (상담 index)
                createdt = (item.createdt).slice(0, 16); // api createdt (상담생성시간)

            vocList += '<div class="voc-student">'
                            +'<div class="voc-info">'
                                +'<span>'+code+', '+incType+'문의, '+vocType+', '+name+'</span>'
                                +'<button class="remove-student" data-idx="'+idx+'"></button>'
                            +'</div>'
                            +'<div class="voc-content">'+ content +'</div>'
                            +'<div class="voc-time">'+ createdt + '</div>'
                        +'</div>';
        }

        // STR 상담내역 팝업
        miDesignPop.alert({
            dTarget: 'voc-pop',
            dWidth: 600,
            dCopy: '<div class="voc-pop-box pop-table">'
                        +'<table>'
                            +'<tr>'
                                +'<td colspan=2><b>'+dataName+'</b>님의 상담내역</td>'
                            +'</tr>'

                            +'<tr>'
                                +'<td>방식</td>'
                                +'<td>'
                                    +'<input type="radio" name="q_type-"'+dataCode+' class="q-type" id="qPhone" value="P">'
                                    +'<label class="mi-input-label" for="qPhone">전화문의</label>'
                                    +'<input type="radio" name="q_type-"'+dataCode+' class="q-type" id="qEmail" value="E">'
                                    +'<label class="mi-input-label" for="qEmail">이메일문의</label>'
                                +'</td>'
                            +'</tr>'

                            +'<tr>'
                                +'<td>구분</td>'
                                +'<td>'
                                    +'<input type="radio" name="voc_type-"'+dataCode+' class="voc-type" id="vocCancle" value="C">'
                                    +'<label class="mi-input-label" for="vocCancle">취소</label>'
                                    +'<input type="radio" name="voc_type-"'+dataCode+' class="voc-type" id="vocReward" value="R">'
                                    +'<label class="mi-input-label" for="vocReward">보상</label>'
                                    +(travelCommonJS.currentService == 'W' || travelCommonJS.currentService == 'B' ? '' :
                                        '<input type="radio" name="voc_type-"'+dataCode+' class="voc-type" id="vocCoupon" value="O">'
                                        +'<label class="mi-input-label" for="vocCoupon">쿠폰</label>')
                                    +'<input type="radio" name="voc_type-"'+dataCode+' class="voc-type" id="vocNormal" value="N">'
                                    +'<label class="mi-input-label" for="vocNormal">일반/이용안내</label>'
                                    +'<input type="radio" name="voc_type-"'+dataCode+' class="voc-type" id="vocPay" value="P">'
                                    +'<label class="mi-input-label" for="vocPay">결제</label>'
                                    +'<input type="radio" name="voc_type-"'+dataCode+' class="voc-type" id="vocEtc" value="E">'
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
                                + '<li class="w-2"><button type="button" class="yes-bt multi-pop-bt">저장</button></li>'
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
        // END 상담내역 팝업

        $(document).off('click', '.remove-student').on('click', '.remove-student', function() { // 상담 내역 삭제
            var _This = $(this),
                list = _This.parents('.voc-student'),
                idx = _This.data('idx'),
                ajaxData = {};

            ajaxData.code = dataCode;
            ajaxData.idx = idx;

            miDesignPop.alert({
                dConHe: 110,
                dCopy: '상담내역을 삭제하시겠습니까?',
                dButtonSetNum: 2,
                dYesAc: function() {
                    // STR 상담내역 삭제 API
                    $.ajax({
                        type: 'POST',
                        url: '/api/travel/voc/'+dataCode+'/'+idx,
                        data: JSON.stringify(ajaxData),
                        contentType: 'application/json',
                        dataType: 'json',
                        beforeSend: function(xhr) { xhr.setRequestHeader(commonJS.header, commonJS.token); }
                    }).done(function(res) {
                        var vocCountVal = Number(vocCount.text()); // 상담내역 카운트
                        list.remove();
                        vocCount.text(vocCountVal-1);
                    }).fail(function(res) {
                        commonJS.alertPop(res.responseJSON.error.message || res.responseJSON.message);
                    });
                    // END 상담내역 삭제 API
                }
            });
        });

        $(document).off('click', '.multi-pop-bt').on('click', '.multi-pop-bt', function() { // 저장 버튼 클릭
            var _This = $(this),
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
            ajaxData.inc_type_str = qTypeVal;
            ajaxData.voc_type_str = vocTypeVal;
            ajaxData.content = vocContentVal;

            // STR 상담 내역 저장 API
            $.ajax({
                type: 'POST',
                url: '/api/travel/voc',
                data: JSON.stringify(ajaxData),
                contentType: 'application/json',
                dataType: 'json',
                beforeSend: function(xhr) { xhr.setRequestHeader(commonJS.header, commonJS.token); }
            }).done(function(res) {
                var vocCountVal = Number(vocCount.text()); // 상담내역 카운트

                if(res.success){
                    var data = res.data, // 상담내역 리스트
                    dataCode = data.code,
                    dataVocType = data.voc_type,
                    dataIncType = data.inc_type,
                    dataContent = data.content,
                    dataName = data.admin_name,
                    dataIdx = data.idx, // api idx (상담 index)
                    dataCreatedt = (data.createdt).slice(0, 16); // api createdt (상담생성시간)

                    vocList = '<div class="voc-student">'
                                +'<div class="voc-info">'
                                    +'<span>'+dataCode+', '+dataIncType+'문의, '+dataVocType+', '+dataName+'</span>'
                                    +'<button class="remove-student" data-idx="'+dataIdx+'"></button>'
                                +'</div>'
                                +'<div class="voc-content">'+ dataContent +'</div>'
                                +'<div class="voc-time">'+ dataCreatedt + '</div>'
                            +'</div>';

                    $('.voc-student-box').prepend(vocList);
                }

                vocType.prop('checked', false);
                qType.prop('checked', false);
                vocContent.val('');
                vocCount.text(vocCountVal+1);

            }).fail(function(res) {
                commonJS.alertPop(res.responseJSON.error.message || res.responseJSON.message);
            });
            // END 상담 내역 저장 ㅁPI
        });
    }).fail(function(res) {

    });
    // END 상담내역 가져오기 API
});
// END 세부정보

// STR functions

// STR 쿠폰발행
couponBtn.on('click', function() { // 쿠폰 발행
    var checkedList = $("input[type=checkbox]:checked").not('#selectAll'),
        code = checkedList.data('code'),
        tr = $('#list_'+code),
        tel = tr.data('tel'),
        name = tr.find('#name').text();

    if(checkedList.length > 1){
        commonJS.alertPop('쿠폰 발행은 한 번에 한 건만 가능합니다', function() {
            checkedList.prop('checked', false)
        });
        return;
    }

    miDesignPop.alert({
        dTarget: 'coupon-pop',
        dCopy: '<div class="coupon-pop-box">'
                    +(name ? '<div class="pop-title">'+name+'님에게 쿠폰을 발송하시겠습니까?</div>' : '')

                    +'<div class="mi-input-wrap popup-input">'
                        +'<div class="mi-input-group">'
                        +'<label class="mi-input-label">전화번호</label>'
                            +'<div class="mi-input-box">'
                                + '<div class="mi-input-input">'
                                    +'<input type="text" class="mi-input" id="tel" value="'+(tel ? tel : '')+'">'
                                + '</div>'
                            +'</div>'
                        +'</div>'
                    +'</div>'

                    +'<div class="mi-input-wrap popup-input">'
                        +'<div class="mi-input-group">'
                        +'<label class="mi-input-label">발행개수</label>'
                            +'<div class="mi-input-box">'
                                + '<div class="mi-input-input w2">'
                                    +'<input type="text" class="mi-input" id="count" value="0">'
                                + '</div>'
                                + '<div class="mi-input-input btns">'
                                    +'<button class="mi-input min-btn">-</button>'
                                    +'<button class="mi-input add-btn">+</button>'
                                + '</div>'
                            +'</div>'
                        +'</div>'
                    +'</div>'

                    +'<div class="warning-box">'
                    +'</div>'
                +'</div>',
        dButtonSetNum: 2,
        dButtonSet: '<ul>'
                        + '<li class="w-2"><button type="button" class="no-bt no-bt-ac">취소</button></li>'
                        + '<li class="w-2"><button type="button" class="yes-bt multi-pop-bt send-coupon-bt">발송</button></li>'
                    + '</ul>',
    });
});

$(document).on('click', '.min-btn', function() { // 발행 개수 감소
    var count = $('#count'),
        countVal = Number(count.val()),
        changedVal = (countVal-1 < 0) ? 0 : countVal-1;

    count.val(changedVal);
});

$(document).on('click', '.add-btn', function() { // 발행 개수 추가
    var count = $('#count'),
        countVal = Number(count.val()),
        changedVal = countVal+1;

    count.val(changedVal);
});

$(document).on('click', '.send-coupon-bt', function() { // 쿠폰 발행 버튼
    var warningBox = $('.warning-box'),
        tel = $('#tel'),
        telVal = tel.val(),
        telFr = telVal.substr(0, 3),
        count = $('#count')
        countVal = count.val(),
        ajaxData = {};


    if(telVal.length < 10){
        warningBox.text('전화번호를 정확히 입력해주세요');
        return;
    }

    if(!miValidate.isTelFrCheck(telFr)){
        warningBox.text('전화번호 앞자리는 010, 011, 016, 017, 018, 019만\n가능합니다');
        return;
    }

    if(countVal < 1){
        warningBox.text('발행 매수를 1장 이상 입력해주세요');
        return;
    }

    ajaxData.owner = telVal;
    ajaxData.count = countVal;

    $.ajax({
        type: 'POST',
        url: '/api/travel/coupon',
        data: JSON.stringify(ajaxData),
        contentType: 'application/json',
        dataType: 'json',
        beforeSend: function(xhr) { xhr.setRequestHeader(commonJS.header, commonJS.token); }
    }).done(function(res) {
        if(res.success){
            commonJS.alertPop('쿠폰 발행이 완료되었습니다', function() {
                $('.mi-common-pop').remove();
                $('html').removeClass('mi-scroll-none');
            });
        }
    }).fail(function(res) {
        commonJS.alertPop(res.responseJSON.error.message || res.responseJSON.message);
    });
});
// END 쿠폰발행

excelBtn.on('click', function() { // 엑셀 다운로드
    var dateOption = searchForm.find('#dateOption').val() || null,
        txtDate = searchForm.find('#miDatepicker').val() || null,
        dateselect = searchForm.find('input[name="dateselect"]').val() || null,
        option = searchForm.find('#option').val() || null,
        search = searchForm.find('#txtKeyfield').val() || null,
        status = searchForm.find('input[name="status"]:checked').val() || null,
        payMethod = searchForm.find('input[name="payMethod"]:checked').val() || null,
        service = travelCommonJS.currentService,

        travelExcelUrl = '',
        ajaxData = {};

    ajaxData.dateOption = dateOption;
    ajaxData.txtDate = txtDate;
    ajaxData.dateselect = dateselect;
    ajaxData.option = option;
    ajaxData.search = search;
    ajaxData.status = status;
    ajaxData.payMethod = payMethod;
    ajaxData.service = service;

    if(txtDate.indexOf('2017') > -1){ // NOTE : 2017년 다운로드건일 경우 URL 분기 @Jinn (20.10.15)
        travelExcelUrl = '/travel/2017/excel';
    }else{
        travelExcelUrl = '/travel/excel';
    }

    commonJS.excelDownload(ajaxData, travelExcelUrl); // 엑셀 다운로드
});

korPaperBtn.on('click', function() {
    var _This = $(this),
        thisId = _This.attr('id'),
        checkedList = $("input[type=checkbox]:checked"),
        state = checkedList.data('status'),
        code = checkedList.data('code'),
        regYear = checkedList.data('regyear'),
        service = (thisId == 'longKorPaperBtn') ? 'long' : 'short',
        tr = checkedList.parent().parent();

    if(checkedList.length > 1){
        commonJS.alertPop('국문 가입증명서 미리보기는\n한 번에 한 건만 가능합니다', function() {
            checkedList.prop('checked', false)
        });
        return;
    }

    if(checkedList.length < 1){
        commonJS.alertPop('국문 가입증명서 미리보기할 건을 선택해주세요');
        return;
    }

    if(!(state == 'B' || state == 'F' || state == 'H')){ // 신청상태가 아님
        commonJS.alertPop('가입증명서를 확인할 수 없는 상태입니다');
        return;
    }

    if(regYear < 2018){
        window.open('/travel/certification/kor/'+ service + '/' + code  +'/2017', '_blank');
    }else{
        window.open('/travel/certification/kor/'+ service + '/' + code, '_blank');
    }

});

engPaperBtn.on('click', function() { // 영문 가입증명서 미리보기
    var _This = $(this),
        thisId = _This.attr('id'),
        checkedList = $("input[type=checkbox]:checked"),
        state = checkedList.data('status'),
        code = checkedList.data('code'),
        regYear = checkedList.data('regyear'),
        service = (thisId == 'longEngPaperBtn') ? 'long' : 'short',
        tr = checkedList.parent().parent(),
        engName = tr.data('eng');

    if(checkedList.length > 1){
        commonJS.alertPop('영문 가입증명서 미리보기는\n한 번에 한 건만 가능합니다', function() {
            checkedList.prop('checked', false)
        });
        return;
    }

    if(checkedList.length < 1){
        commonJS.alertPop('영문 가입증명서 미리보기할 건을 선택해주세요');
        return;
    }

    if(!(state == 'B' || state == 'F' || state == 'H')){ // 신청상태가 아님
        commonJS.alertPop('가입증명서를 확인할 수 없는 상태입니다');
        return;
    }else{ // 신청상태이나 영문이름이 없음
        if(!engName || engName.length < 1){
            commonJS.alertPop('영문이름을 입력하지 않은 건입니다');
            return;
        }
    }


    if(regYear < 2018){
        window.open('/travel/certification/eng/'+ service + '/' + code  +'/2017', '_blank');
    }else{
        window.open('/travel/certification/eng/'+ service + '/' + code, '_blank');
    }
});

vocListItem.on('click', function() { // 상담 내역 출력
    var _This = $(this),
        thisCode = _This.data('code');

    $.ajax({
        type: 'GET',
        url: '/api/travel/voc/counselor/'+thisCode,
        contentType: 'application/json',
        dataType: 'json'
    }).done(function(res) {
        if(res.success){
            var data = res.data,
                copy = '<div class="voc-pop-box pop-table student-table">'
                        +'<table>'
                            +'<thead>'
                                +'<tr>'
                                    +'<th>번호</th>'
                                    +'<th>등록일</th>'
                                    +'<th>신청자</th>'
                                    +'<th>방식</th>'
                                    +'<th>구분</th>'
                                    +'<th>내용</th>'
                                +'</tr>'
                            +'</thead>'
                            +'<tbody>';

            data.forEach(function(item, idx){
                var dataCode = item.code,
                    dataCreated = item.createdt.substr(0, 16),
                    dataVocType = item.voc_type,
                    dataIncType = item.inc_type,
                    dataName = item.name,
                    dataContent = item.content;

                copy += '<tr>'
                            +'<td>'+dataCode+'</td>'
                            +'<td>'+dataCreated+'</td>'
                            +'<td>'+dataName+'</td>'
                            +'<td>'+dataIncType+'</td>'
                            +'<td>'+dataVocType+'</td>'
                            +'<td>'+dataContent+'</td>'
                        +'</tr>';
            });

            miDesignPop.alert({
                dWidth: 1000,
                dTitle: '상담',
                dCopy: copy + '</tbody></table></div>',
                dCloseX: true,
                dButtonSetNum: 0,
                dButtonSet: '',
            });
        }
    }).fail(function(res) {
        commonJS.alertPop(res.responseJSON.error.message || res.responseJSON.message);
    });
});

blackListApply.on('click', function() { // 블랙리스트 신청 내역
    var _This = $(this),
        thisId = _This.attr('id'),
        listKind = (thisId == 'week') ? '(지난 7일)' : (thisId == 'yesterday') ? '(어제)' : '(오늘)';

    $.ajax({
        type: 'GET',
        url: '/api/travel/blacklist/'+thisId,
        contentType: 'application/json',
        dataType: 'json'
    }).done(function(res) {
        if(res.success){
            var data = res.data,
                copy = '<div class="blacklist-pop-box pop-table student-table">'
                        +'<div class="excel-btn-wrap"><button class="black-excel-btn" data-type="'+thisId+'">엑셀 다운로드</button></div>'
                        +'<table>'
                            +'<thead>'
                                +'<tr>'
                                    +'<th>신청일</th>'
                                    +'<th>이름</th>'
                                    +'<th>주민번호</th>'
                                    +'<th>출발시간</th>'
                                    +'<th>등록일</th>'
                                    +'<th>대표가입자</th>'
                                +'</tr>'
                            +'</thead>'
                            +'<tbody>';

            data.forEach(function(item, idx){
                var dataRegDate = item.regdate || '',
                    dataRegTime = String(item.regtime) || '',
                    dataFullRegDate = dataRegDate + ' ' + dataRegTime.substr(0,2) + ':' + dataRegTime.substr(2,2) + ':' + dataRegTime.substr(4,2),
                    dataName = item.name || '',
                    dataBirth = item.birth || '',
                    dataResident = item.resident || '',
                    dataMemNum = dataBirth + '-' + dataResident,
                    dataDepartDate = item.depart_date,
                    dataDepartTime = item.depart_time,
                    dataFullDepartDate = (dataDepartDate ? dataDepartDate + ' ' + dataDepartTime + '시' : '-'),
                    dataFullBlackDate = (item.blacklist_regdate).substr(0, 10),
                    dataEmail = item.email,
                    dataIsRep = dataEmail ? '○' : 'X';

                copy += '<tr>'
                            +'<td>'+dataFullRegDate+'</td>'
                            +'<td>'+dataName+'</td>'
                            +'<td>'+dataMemNum+'</td>'
                            +'<td>'+dataFullDepartDate+'</td>'
                            +'<td>'+dataFullBlackDate+'</td>'
                            +'<td>'+dataIsRep+'</td>'
                        +'</tr>';
            });

            miDesignPop.alert({
                dWidth: 1000,
                dTitle: '블랙리스트 보험 신청 내역 ' + listKind,
                dCopy: copy + '</tbody></table></div>',
                dCloseX: true,
                dButtonSetNum: 0,
                dButtonSet: '',
            });
        }
    }).fail(function(res) {
        commonJS.alertPop(res.responseJSON.error.message || res.responseJSON.message);
    });
});

$(document).on('click', '.black-excel-btn', function() { // 블랙리스트 신청내역 엑셀 다운로드
    var _This = $(this),
        type = _This.data('type'),
        ajaxData = {};

    commonJS.excelDownload(ajaxData, '/blacklist/'+type+'/excel'); // 엑셀 다운로드
});
// END functions
