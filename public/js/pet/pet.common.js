var standardSelect = $('#standardSelect'), // 리스트 출력 기준 select

    searchForm = $('#searchForm'),
    refreshBtn = $('#refreshBtn'), // 새로고침
    mailBtn = $('#mailBtn'), // 메일발송 버튼
    excelBtn = $('#excelBtn'), // 엑셀 다운로드 버튼
    searchResetBtn = $('#searchResetBtn'), // 검색창 리셋 버튼

    detailListAct = { //
        param : {},
        getDetailInfo : function(callback) { // 세부리스트 정보 API
            $.ajax({
                type: 'GET',
                url: '/api/pet/info/'+detailListAct.param.code,
                contentType: 'application/json',
                dataType: 'json'
            }).done(function(res) {
                if(res.success){
                    detailListAct.param.data = res.data;
                    callback();
                }else{
                    commonJS.alertPop(res.error.message);
                }
            }).fail(function(res) {
                commonJS.alertPop(res.responseJSON.error.message || res.responseJSON.message);
            });
        },
        showDetailCustomer: function() { // 피보험자 기준 세부리스트
            var infoTr = '',
                infoTd = '',
                data = detailListAct.param.data,
                userName = data.name || null,
                sid = data.sid1 ? data.sid1 + '-' + data.sid2 : null,
                email = data.email || null,
                tel = data.tel || null,
                petName = data.petName || null,
                planName = data.planName || null,
                regNo = data.regNo || null,
                regType = data.regType || null,
                regTypeTxt = '',
                birth = data.birth || null,
                birthFormat = '',
                trn = data.trn|| null,
                fur = data.fur|| null,
                vocCnt = data.vocCnt,
                gender = data.gender || null,
                kind = data.kind || null,
                breed = data.breed || null,
                payBillSeq = data.payBillSeq,
                uuid = data.uuid || null,
                photoId = data.photoUuid || null,
                age = (data.age == null ? null : data.age),

                pgStatus = $('#list_' + detailListAct.param.code).data('status'),
                payedList = '',
                planBtn = '';

            if(birth){
                var newDate = new Date(birth),
                    year = newDate.getFullYear(),
                    month = (newDate.getMonth() + 1 > 9) ? newDate.getMonth() + 1 : '0' + (newDate.getMonth()+1),
                    day = (newDate.getDate() > 9) ? newDate.getDate() : '0' + newDate.getDate();

                birthFormat = year + '.' + month + '.' + day;
            }

            switch(regType){
                case '1':
                    regTypeTxt = '내장형';
                    break;
                case '2':
                    regTypeTxt = '외장형';
                    break;
                case '3':
                    regTypeTxt = '인식표';
                    break;
            }

            if(payBillSeq){
                switch(pgStatus){
                    case 'MS':
                    case 'MW':
                    case 'PF':
                    case 'CO':
                    case 'CD':
                        payedList = '<a href="javascript:void(0);" class="pay-log" data-code="'+detailListAct.param.code+'" data-paybill="'+payBillSeq+'">결제완료</a>';
                        break;
                    case 'RF':
                        payedList = '<a href="javascript:void(0);" class="pay-log no-color" data-code="'+detailListAct.param.code+'" data-paybill="'+payBillSeq+'">환불완료</a>';
                        break;
                    case 'MD':
                        payedList = '<a href="javascript:void(0);" class="pay-log no-color" data-code="'+detailListAct.param.code+'" data-paybill="'+payBillSeq+'">인수거절</a>';
                        break;
                    case 'CP':
                        payedList = '<a href="javascript:void(0);" class="pay-log" data-code="'+detailListAct.param.code+'" data-paybill="'+payBillSeq+'">미납해지</a>';
                        break;
                }
            }

            infoTd = '<td>'
                        +(email ? '<a href="javascript:void(0);" class="change-email no-color" id="changeEmail_'+detailListAct.param.code+'" data-email="'+email+'" data-code="'+detailListAct.param.code+'">' + email + '</a>' : '<span>-</span>')
                    +'</td>'
                    +'<td>'
                        +'<span>-</span>' // 증권번호
                    +'</td>'
                    +'<td>'
                        +(kind ? '<span>' + (kind == 'D' ? '강아지' : '고양이') + '</span>' : '<span>-</span>')
                    +'</td>'
                    +'<td>'
                        +(petName ? '<span>' + petName + '</span>' : '<span>-</span>')
                    +'</td>'
                    +'<td>'
                        +(regNo ? '<span>' + regNo + '</span>' : (photoId ? '<button class="mi-input show-pet-photo" data-uuid="'+photoId+'" data-id="'+detailListAct.param.code+'">사진보기</button>' : '<span>-</span>'))
                    +'</td>'
                    +'<td>'
                        +(regType ? '<span>' + regType + '</span>' : '<span>-</span>')
                    +'</td>'
                    +'<td>'
                        +(breed ? '<span>' + breed + '</span>' : '<span>-</span>')
                    +'</td>'
                    +'<td>'
                        +(birth ? '<span>' + birthFormat + '</span>' : '<span>-</span>')
                    +'</td>'
                    +'<td>'
                        +(age != null ? '<span>만' + age + '세</span>' : '<span>-</span>')
                    +'</td>'
                    +'<td>'
                        +(fur ? '<span>' + fur + '</span>' : '<span>-</span>')
                    +'</td>'
                    +'<td>'
                        +(gender ? '<span>' + (gender == 'F' ? '암' : '수') + '</span>' : '<span>-</span>')
                    +'</td>'
                    +'<td class="boundary">'
                        +(trn ? '<span>' + trn + '</span>' : '<span>-</span>')
                    +'</td>'
                    +'<td>'
                        +(payedList ? payedList : '<span>-</span>')
                    +'</td>'
                    +'<td>'
                        +'<span>-</span>' // 해지보험료
                    +'</td>'
                    +'<td>'
                        +'<span>신규</span>' // 가입구분
                    +'</td>'
                    +'<td>'
                        +(planBtn ? planBtn : '<span>-</span>')
                    +'</td>'
                    +'<td>'
                        +'<a href="javascript:void(0);" class="add-voc default-font-color" id="vocList_'+detailListAct.param.code+'" data-code="'+detailListAct.param.code+'">'+vocCnt+'</a>'
                    +'</td>';

            infoTr += '<tr class="detail-tr" id="pet_'+detailListAct.param.code+'">'
                        +infoTd
                    +'</tr>';
            var infoTable = '<td colspan="24">'
                                +'<table class="table detail">'
                                    +'<thead>'
                                        +'<th>이메일주소</th>'
                                        +'<th>증권번호</th>'
                                        +'<th>동물구분</th>'
                                        +'<th>동물이름</th>'
                                        +'<th>동물등록번호</th>'
                                        +'<th>등록유형</th>'
                                        +'<th>품종</th>'
                                        +'<th>생년월일</th>'
                                        +'<th>나이</th>'
                                        +'<th>털 색상</th>'
                                        +'<th>성별</th>'
                                        +'<th class="boundary">중성화</th>'
                                        +'<th>납부내역</th>'
                                        +'<th>해지보험료</th>'
                                        +'<th>가입구분</th>'
                                        +'<th>가입증명서</th>'
                                        +'<th>상담</th>'
                                    +'</thead>'
                                    +'<tbody>'
                                        +infoTr
                                    +'</tbody></table></td>',
                detailTr = $('#subList_'+detailListAct.param.code);

            if(detailTr.length > 0){
                detailListAct.param.target.html(infoTable);
            }else{
                detailListAct.param.target.after('<tr id="subList_'+detailListAct.param.code+'" class="people visible">'+infoTable+'</tr>');
            }
        },
        showDatailAnimal: function() { // 반려동물 기준 세부리스트
            var infoTr = '',
                infoTd = '',
                data = detailListAct.param.data,
                userName = data.name || null,
                joinCnt = data.joinCnt,
                sid = data.sid1 ? data.sid1 + '-' + data.sid2 : null,
                email = data.email || null,
                tel = data.tel || null,
                petName = data.petName || null,
                planName = data.planName || null,
                regNo = data.regNo || null,
                regType = data.regType || null,
                birth = data.birth || null,
                birthFormat = '',
                trn = data.trn|| null,
                fur = data.fur|| null,
                vocCnt = data.vocCnt,
                gender = data.gender || null,
                payBillSeq = data.payBillSeq,
                uuid = data.uuid || null,
                photoId = data.photoUuid || null,

                pgStatus = $('#list_' + detailListAct.param.code).data('status'),
                payedList = '',
                planBtn = '<span>-</span>';

            if(birth){
                var newDate = new Date(birth),
                    year = newDate.getFullYear(),
                    month = (newDate.getMonth() + 1 > 9) ? newDate.getMonth() + 1 : '0' + (newDate.getMonth()+1),
                    day = (newDate.getDate() > 9) ? newDate.getDate() : '0' + newDate.getDate();

                birthFormat = year + '.' + month + '.' + day;
            }

            switch(regType){
                case '1':
                    regTypeTxt = '내장형';
                    break;
                case '2':
                    regTypeTxt = '외장형';
                    break;
                case '3':
                    regTypeTxt = '인식표';
                    break;
            }

            if(payBillSeq){
                switch(pgStatus){
                    case 'MS':
                    case 'MW':
                    case 'PF':
                    case 'CO':
                    case 'CD':
                        payedList = '<a href="javascript:void(0);" class="pay-log" data-code="'+detailListAct.param.code+'" data-paybill="'+payBillSeq+'">결제완료</a>';

                        if(uuid){
                            planBtn = '<button class="mi-input read-file" data-uuid="'+uuid+'" data-planname="'+planName+'" data-id="'+detailListAct.param.code+'">보기</button>';
                        }
                        break;
                    case 'RF':
                        payedList = '<a href="javascript:void(0);" class="pay-log no-color" data-code="'+detailListAct.param.code+'" data-paybill="'+payBillSeq+'">환불완료</a>';
                        break;
                    case 'MD':
                        payedList = '<a href="javascript:void(0);" class="pay-log no-color" data-code="'+detailListAct.param.code+'" data-paybill="'+payBillSeq+'">인수거절</a>';
                        break;
                    case 'CP':
                        payedList = '<a href="javascript:void(0);" class="pay-log" data-code="'+detailListAct.param.code+'" data-paybill="'+payBillSeq+'">미납해지</a>';
                        break;
                }
            }

            infoTd = '<td>'
                        +(data.sid1 ? '<a href="javascript:void(0);" class="change-sid no-color" id="changeSid_'+detailListAct.param.code+'" data-sid="'+sid+'" data-code="'+detailListAct.param.code+'">' + sid + '</a>' : '<span>-</span>')
                    +'</td>'
                    +'<td>'
                        +(tel ? '<a href="javascript:void(0);" class="change-tel no-color" id="changeTel_'+detailListAct.param.code+'" data-tel="'+tel+'" data-code="'+detailListAct.param.code+'">' + tel + '</a>' : '<span>-</span>')
                    +'</td>'
                    +'<td>'
                        +'<span>-</span>'
                    +'</td>'
                    +'<td class="boundary">'
                        +(email ? '<a href="javascript:void(0);" class="change-email no-color" id="changeEmail_'+detailListAct.param.code+'" data-email="'+email+'" data-code="'+detailListAct.param.code+'">' + email + '</a>' : '<span>-</span>')
                    +'</td>'
                    +'<td>'
                        +(regNo ? '<span>' + regNo + '</span>' : (photoId ? '<button class="mi-input show-pet-photo" data-uuid="'+photoId+'" data-id="'+detailListAct.param.code+'">사진보기</button>' : '<span>-</span>'))
                    +'</td>'
                    +'<td>'
                        +(regType ? '<span>' + regType + '</span>' : '<span>-</span>')
                    +'</td>'
                    +'<td>'
                        +(birth ? '<span>' + birthFormat + '</span>' : '<span>-</span>')
                    +'</td>'
                    +'<td>'
                        +(fur ? '<span>' + fur + '</span>' : '<span>-</span>')
                    +'</td>'
                    +'<td>'
                        +(gender ? '<span>' + (gender == 'F' ? '암' : '수') + '</span>' : '<span>-</span>')
                    +'</td>'
                    +'<td class="boundary">'
                        +(trn ? '<span>' + trn + '</span>' : '<span>-</span>')
                    +'</td>'
                    +'<td>'
                        +(payedList ? payedList : '<span>-</span')
                    +'</td>'
                    +'<td>'
                        +(planBtn ? planBtn : '<span>-</span>')
                    +'</td>'
                    +'<td>'
                        +'<a href="javascript:void(0);" class="add-voc default-font-color" id="vocList_'+detailListAct.param.code+'" data-code="'+detailListAct.param.code+'">'+vocCnt+'</a>'
                    +'</td>';

            infoTr += '<tr class="detail-tr" id="pet_'+detailListAct.param.code+'">'
                        +infoTd
                    +'</tr>';

            var infoTable = '<td colspan="26">'
                                +'<table class="table detail">'
                                    +'<thead>'
                                        +'<th>주민번호</th>'
                                        +'<th>휴대폰번호</th>'
                                        +'<th>증권번호</th>'
                                        +'<th class="boundary">이메일</th>'
                                        +'<th>동물등록번호</th>'
                                        +'<th>등록유형</th>'
                                        +'<th>생년월일</th>'
                                        +'<th>털 색상</th>'
                                        +'<th>성별</th>'
                                        +'<th class="boundary">중성화</th>'
                                        +'<th>납부내역</th>'
                                        +'<th>가입증명서</th>'
                                        +'<th>상담</th>'
                                    +'</thead>'
                                    +'<tbody>'
                                        +infoTr
                                    +'</tbody></table></td>',
                detailTr = $('#subList_'+detailListAct.param.code);

            if(detailTr.length > 0){
                detailListAct.param.target.html(infoTable);
            }else{
                detailListAct.param.target.after('<tr id="subList_'+detailListAct.param.code+'" class="people visible">'+infoTable+'</tr>');
            }
        },
        changeInfo : function(type, data, callback) { // 휴대번호, 주민번호, 이메일 바꾸기
            var copy = '',
                newName = '',
                newVal = '';

            if(type == 'email'){ // 이메일 변경
                copy = '이메일을 변경하였습니다';
                newName = 'email';
                newVal = data.email;
            }else if(type == 'resident'){ // 주민번호 변경
                copy = '주민등록번호를 변경하였습니다';
                newName = 'sid';
                newVal = data.sid1 + '-' + data.sid2;
            }else if(type == 'tel'){ // 전화번호 변경
                copy = '전화번호를 변경하였습니다';
                newName = 'tel';
                newVal = data.tel;
            }

            $.ajax({
                type: 'POST',
                url: '/api/pet/info/'+type+'/'+data.code,
                data: JSON.stringify(data),
                contentType: 'application/json',
                dataType: 'json',
                beforeSend: function(xhr) { xhr.setRequestHeader(commonJS.header, commonJS.token); }
            }).done(function(res) {
                if(res.success){
                    commonJS.alertPop(copy, function() {
                        commonJS.removePop();
                        $('#change' + (newName.charAt(0).toUpperCase() + newName.slice(1)) + '_' + data.code).data(newName, newVal).text(newVal);
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
        }
    };


questionPop();

standardSelect.on('change', function() { // 정렬 기준 선택
    var _This = $(this),
        thisVal = _This.val();

    location.href = '/pet/' + thisVal + '/student';
});

listCheckbox.not('#selectAll').on('click', function() { // 리스트 하나씩만 클릭
    var _This = $(this),
        checkedList = $("input[type=checkbox]:checked").not('#selectAll');

    if(checkedList.length > 0){
        checkedList.prop('checked', false).attr('checked', false);
        _This.prop('checked', true).attr('checked', true)
    }
});

refreshBtn.on('click', function() { // 새로고침
    location.reload();
});

// STR 정보 변경
$(document).on('click', '.change-tel', function () { // 전화번호 변경
    var _This = $(this),
        thisTel = _This.data('tel');

    miDesignPop.alert({
        dTarget: 'change-tel-pop',
        dTitle: '휴대폰번호 수정',
        dCopy: '<div class="change-tel-box">'
                    +'<div class="mi-input-wrap popup-input">'
                        + '<div class="mi-input-group align-top">'
                            + '<div class="mi-input-box">'
                                + '<div class="mi-input-input">'
                                    +'<input type="text" class="mi-input" id="telNew" value="'+thisTel+'" maxlength="11">'
                                + '</div>'
                            + '</div>'
                        + '</div>'
                    + '</div>'

                    +'<div class="warning-box"></div>'
                +'</div>',
        dButtonSet: '<ul>'
                        + '<li class="w-2"><button type="button" class="no-bt no-bt-ac">취소</button></li>'
                        + '<li class="w-2"><button type="button" class="yes-bt save-changed-tel" data-code="'+detailListAct.param.code+'">수정</button></li>'
                    + '</ul>',
    });
});

$(document).on('click', '.save-changed-tel', function() { // 전화번호 변경 저장
    var _This = $(this),
        thisCode = _This.data('code'),
        newTel = $('#telNew').val(),
        newTelFr = newTel.substr(0, 3),
        newTelLen = newTel.length,
        ajaxData = {};

    $('.warning-box').text('');

    if (newTelLen < 10) { // 전화번호가 1자리 미만인 경우
        $('.warning-box').text('휴대폰번호를 정확하게 입력해 주세요');
        return false;
    }

    if (!miValidate.isTelFrCheck(newTelFr)) { // 휴대폰 앞자리
        $('.warning-box').text('010, 011, 016, 017, 018, 019 만 입력가능합니다');
        return false;
    }

    ajaxData.code = thisCode;
    ajaxData.tel = newTel;

    detailListAct.changeInfo('tel', ajaxData);
});

$(document).on('click', '.change-sid', function () { // 주민번호 변경
    var _This = $(this),
        thisSid = _This.data('sid'),
        sid1 = thisSid.split('-')[0],
        sid2 = thisSid.split('-')[1];

    miDesignPop.alert({
        dTarget: 'change-tel-pop',
        dTitle: '주민등록번호 수정',
        dCopy: '<div class="change-tel-box">'
                    +'<div class="mi-input-wrap popup-input">'
                        + '<div class="mi-input-group align-top">'
                            + '<div class="mi-input-box">'
                                + '<div class="mi-input-input">'
                                    +'<input type="text" class="mi-input" id="sid1New" value="'+sid1+'" maxlength="6">'
                                + '</div>'
                                + '<div class="mi-input-connect">-</div>'
                                + '<div class="mi-input-input">'
                                    +'<input type="text" class="mi-input" id="sid2New" value="'+sid2+'" maxlength="7">'
                                + '</div>'
                            + '</div>'
                        + '</div>'
                    + '</div>'

                    +'<div class="warning-box"></div>'
                +'</div>',
        dButtonSet: '<ul>'
                        + '<li class="w-2"><button type="button" class="no-bt no-bt-ac">취소</button></li>'
                        + '<li class="w-2"><button type="button" class="yes-bt save-changed-sid" data-code="'+detailListAct.param.code+'">수정</button></li>'
                    + '</ul>',
    });
});

$(document).on('click', '.save-changed-sid', function() { // 주민번호 변경 저장
    var _This = $(this),
        thisCode = _This.data('code'),
        newSid1 = $('#sid1New').val(),
        newSid2 = $('#sid2New').val(),
        newFullSid = newSid1 + newSid2,
        ajaxData = {};

    $('.warning-box').text('');

    if (newSid1.length != 6 || newSid2.length != 7 || !miValidate.isMemNumCheck(newFullSid)) { // 전화번호가 1자리 미만인 경우
        $('.warning-box').text('주민등록번호를 정확하게 입력해 주세요');
        return false;
    }

    ajaxData.code = thisCode;
    ajaxData.sid1 = newSid1;
    ajaxData.sid2 = newSid2;

    detailListAct.changeInfo('resident', ajaxData);
});

$(document).on('click', '.change-email', function () { // 이메일 변경
    var _This = $(this),
        thisEmail = _This.data('email'),
        emailId = '',
        emailDomain = '',
        isCustomEmail = false;

        emailId = thisEmail.split('@')[0];
        emailDomain = thisEmail.split('@')[1];

        if(emailDomain != 'naver.com'
            && emailDomain != 'daum.net'
            && emailDomain != 'hanmail.net'
            && emailDomain != 'gmail.com'
            && emailDomain != 'nate.com'
            && emailDomain != 'mibank.me'
        ){
            isCustomEmail = true;
        }

    miDesignPop.alert({
        dTarget: 'change-tel-pop',
        dTitle: '이메일 수정',
        dCopy: '<div class="change-tel-box">'
                    +'<div class="mi-input-wrap popup-input">'
                        + '<div class="mi-input-group align-top">'
                            + '<div class="mi-input-box">'
                                + '<div class="mi-input-input">'
                                    +'<input type="text" class="mi-input" id="email1New" value="'+emailId+'">'
                                + '</div>'
                                + '<div class="mi-input-connect"><span class="at">@</span></div>'
                                + '<div class="mi-input-input">'
                                    + '<input type="text" class="mi-input" id="email2New" style="margin-bottom: 10px;'+(isCustomEmail ? "" : "display: none;")+'" value="'+emailDomain+'">'
                                    + '<select name="" id="email2ChangeNew" class="mi-input select">'
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

                    +'<div class="warning-box"></div>'
                +'</div>',
        dButtonSet: '<ul>'
                        + '<li class="w-2"><button type="button" class="no-bt no-bt-ac">취소</button></li>'
                        + '<li class="w-2"><button type="button" class="yes-bt save-changed-email" data-code="'+detailListAct.param.code+'">수정</button></li>'
                    + '</ul>',
    });
});

$(document).on('click', '.save-changed-email', function() { // 주민번호 변경 저장
    var _This = $(this),
        thisCode = _This.data('code'),
        newEmailId = $('#email1New').val(),
        newEmailDomain = $('#email2New').val(),
        newfullEmail = newEmailId + '@' + newEmailDomain,
        ajaxData = {};

    $('.warning-box').text('');

    if(!newEmailId || !newEmailDomain){
        $('.warning-box').text('이메일을 입력해주세요');
        return;
    }

    if(!miValidate.isEmailCheck(newfullEmail)){ // 값이 올바르지 않을 때
        $('.warning-box').text('이메일을 정확히 입력해주세요');
        return;
    }

    ajaxData.code = thisCode;
    ajaxData.email = newfullEmail;

    detailListAct.changeInfo('email', ajaxData);
});


commonJS.emailInputAct('#email1New', '#email2New', '#email2ChangeNew'); // 이메일 input 관련 action
// END 정보 변경

$(document).on('click', '.pay-log', function() { // 납부내역
    var _This = $(this),
        thisCode = _This.data('code'),
        thisPayBill = _This.data('paybill'),
        copy = '<div class="pay-pop-box pop-table student-table">';

    $.ajax({
        type: 'GET',
        url: '/api/pet/payed/' + thisPayBill,
        contentType: 'application/json',
        dataType: 'json'
    }).done(function(res) {
        if(res.success){
            var data = res.data,
                dataCnt = data.length,
                period = $('#list_' + thisCode).data('period');

            copy += '<div class="payed-log">'
                        +'<div><button class="show-card-log">카드변경이력</div>'
                        +'<div>납부 <span class="point-color3">'+dataCnt+'</span> / '+period+' 회</div>'
                    +'</div>'
                    +'<table>'
                    +'<thead>'
                        +'<tr>'
                            +'<th>회차</th>'
                            +'<th>결제일시</th>'
                            +'<th>결제상태</th>'
                            +'<th>카드정보</th>'
                            +'<th>미결제 알림톡 발송일시</th>'
                            +'<th>알림톡 열람상태</th>'
                        +'</tr>'
                    +'</thead>'
                    +'<tbody>';

            for(var i = 0; i < dataCnt; i++){
                var item = data[i],
                    payDate = item.payDate,
                    payResDate = item.payResDate,
                    payStatus = item.payStatus,
                    cardName = item.cardNm,
                    cardNo = item.decCardNo ? item.decCardNo.replace(/(\S{4})/g, '$1-') : '-';

                copy += '<tr>'
                            // TODO : 결제 회차 필요 @Jinn (20.07.02)
                            +'<td>' + (i+1) +'</td>'
                            +'<td>' + (payResDate.substr(0, 10) + ' ' + payResDate.substr(11, 5)) +'</td>'
                            +'<td>' + (payStatus || '-') +'</td>'
                            +'<td>' + (cardName ? cardName + ' ' + cardNo.substring(0, cardNo.length-1) : '<span class="point-color3">사용자 삭제</span>') +'</td>'
                            // TODO : 알림톡 관련 정부 출력 @Jinn (20.07.02)
                            +'<td>-</td>'
                            +'<td>-</td>'
                        +'<tr>'
            }

            miDesignPop.alert({
                dTarget: 'payed-log-pop',
                dWidth: 1000,
                dTitle: '보험료 납부내역',
                dCopy: copy + '</tbody></table></div>',
                dCloseX: true,
                dButtonSetNum: 0,
                dButtonSet: '',
            });
        }else{
            commonJS.alertPop(res.error.message);
        }
    }).fail(function(res) {
        commonJS.alertPop(res.responseJSON.error.message || res.responseJSON.message);
    });

});

$(document).on('click', '.show-card-log', function() { // 카드변경이력
    var _This = $(this),
        copy = '<div class="pay-pop-box pop-table student-table">';


    // TODO : API call @Jinn (20.08.21)
    copy += '<table>'
            +'<thead>'
                +'<tr>'
                    +'<th>변경일시</th>'
                    +'<th>카드정보</th>'
                    +'<th>변경사항</th>'
                +'</tr>'
            +'</thead>'
            +'<tbody>';

    miDesignPop.alert({
        dTarget: 'card-log-pop',
        dWidth: 800,
        dTitle: '카드변경이력',
        dCopy: copy + '</tbody></table></div>',
        dCloseX: true,
        dButtonSetNum: 0,
        dButtonSet: '',
    });
});

mailBtn.on('click', function() { // 메일 발송
    var checkedList = $("input[type=checkbox]:checked").not('#selectAll'),
        code = checkedList.data('code'), // 코드
        status = checkedList.data('status'),
        company = checkedList.data('company'),
        isPaperAble = (status == 'MS' || status == 'MW'), // TODO : 발행 가능한 상태값 필요 @Jinn (20.07.06)
        tr = $('#list_'+code),
        emailId = '',
        emailDomain = '',
        isCustomEmail = false;

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

    $.ajax({
        type: 'GET',
        url: '/api/pet/info/email/' + code,
        contentType: 'application/json',
        dataType: 'json'
    }).done(function(res) {
        if(res.success){
            var email = res.data,
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


            miDesignPop.alert({
                dTarget: 'mail-pop',
                dTitle: '이메일 발송',
                dCloseX: true,
                dCopy: '<div class="mail-pop-box">'

                            +'<div class="mi-input-wrap popup-input">'
                            + '<div class="mi-input-group align-top">'
                            + '<label class="mi-input-label">이메일</label>'
                            + '<div class="mi-input-box">'
                                + '<div class="mi-input-input">'
                                    +'<input type="text" class="mi-input" id="email1" value="'+emailId+'">'
                                + '</div>'
                                + '<div class="mi-input-connect"><span class="at">@</span></div>'
                                + '<div class="mi-input-input">'
                                    + '<input type="text" class="mi-input" id="email2" style="margin-bottom: 10px;'+(isCustomEmail ? "" : "display: none;")+'" value="'+emailDomain+'">'
                                    + '<select name="" id="email2Change" class="mi-input select">'
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
                                        +'<div class="mi-input-box">'
                                            +'<div class="mi-input-input">'
                                                +'<input type="checkbox" name="joinPaper" class="paper-kind" id="joinPaper" value="C" '+(isPaperAble ? '' : 'disabled')+'>'
                                                +'<label for="joinPaper">가입증명서</label>'
                                            +'</div>'
                                            +'<div class="mi-input-input">'
                                                +'<input type="checkbox" name="paper" class="paper-kind" id="paper" value="D">'
                                                +'<label for="paper">보험금청구서류</label>'
                                            +'</div>'
                                            +'<div class="mi-input-input">'
                                                +'<input type="checkbox" name="paper" class="paper-kind" id="term" value="T">'
                                                +'<label for="term">보험약관</label>'
                                            +'</div>'
                                        +'</div>'
                                    +'</div>'

                                +'</div>'

                            +'</div>'

                            +'<div class="warning-box">'
                            +'</div>'
                        +'</div>',
                dButtonSet: '<ul>'
                                + '<li class="w-2"><button type="button" class="no-bt no-bt-ac">취소</button></li>'
                                + '<li class="w-2"><button type="button" class="yes-bt multi-pop-bt send-mail-bt">발송</button></li>'
                            + '</ul>',
            });
        }else{
            commonJS.alertPop(res.error.messsage);
        }
    }).fail(function(res) {
        commonJS.alertPop(res.responseJSON.error.message || res.responseJSON.message);
    });

    commonJS.emailInputAct('#email1', '#email2', '#email2Change'); // 이메일 input 관련 action

    $(document).off('click', '.send-mail-bt').on('click', '.send-mail-bt', function() { // 변경된 이메일 유효성검사
        var email1 = $('#email1'),
            email2 = $('#email2'),
            email2Change = $('#email2Change'),
            email1Val = email1.val(),
            email2Val = email2.val(),
            email2ChangeVal = email2Change.val(),
            fullEmailVal = email1Val + '@' + email2Val,
            types = $('.paper-kind:checked'),
            type = [],
            ajaxData = {},

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

        if(type.length < 1){
            warningBox.text('메일 종류를 선택해주세요');
            return;
        }

        switch(company.substr(0, 1)){
            case 'S':
                ajaxData.company = 1;
                break;
            case 'D':
                ajaxData.company = 2;
                break;
            case 'H':
                ajaxData.company = 3;
                break;
        }

        ajaxData.codes = type;
        ajaxData.email = fullEmailVal;

        // TODO : 메일발송 @Jinn (20.07.06)
        $.ajax({
            type: 'POST',
            url: '/api/pet/email/' + code,
            data: JSON.stringify(ajaxData),
            contentType: 'application/json',
            dataType: 'json',
            beforeSend: function(xhr) { xhr.setRequestHeader(commonJS.header, commonJS.token); }
        }).done(function(res) {
            if(res.success){
                commonJS.alertPop('이메일을 발송하였습니다', function() {
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
});

// STR admin, thirdparty 공용 확정
$(document).on('click', '.plan-pop', function() { // 플랜정보 팝업 노출
    var _This = $(this),
        thisText = _This.data('planname'),
        thisAge = _This.data('age'),
        fee = _This.data('fee'),
        breed = _This.data('breed'),
        month = _This.data('month'),
        thisCode = _This.data('plancd');

    $.ajax({
        type: 'GET',
        url: '/api/pet/plan/'+thisCode,
        contentType: 'application/json',
        dataType: 'json'
    }).done(function(res) {
        if(res.success){
            var ciSeq = 0,
                insuItemName = '',

                chk1 = res.data.chk1, // 슬관절
                chk2 = res.data.chk2, // 피부
                repYn = res.data.chk4,
                servicePeriod = res.data.period,

                hospitalPrc = '', // 입원, 통원 치료비
                surgeryPrc = '', // 수술비
                disease = false, // 질병 보장

                hospitalPrc = '', // 입원, 통원 치료비
                surgeryPrc = '', // 수술비
                showDiseaseBox = false,
                diseaseEtc = '', // 추가 질병특약
                diseaseTeeth = '', // 치과치료관련 문구
                guarantype = '', // 보장 내용 (1: 전부 2: 슬관절만 3: 피부/구강만)

                firstQuestion = '', // ? 버튼
                secondQuestion = '', // ? 버튼
                maturity = '', // 만기 문구

                etc1Prc = '', // 배상책임
                etc2Prc = '', // 장례지원
                etc3Prc = ''; // 유실동물

            // TODO : 플랜 이름 변경되니까 thisText 쓰면 안됨 @Jinn (20.07.20)

            if(thisText.indexOf('S') > -1){
                ciSeq = 1;
            }else if(thisText.indexOf('D') > -1){
                ciSeq = 2;
            }else if(thisText.indexOf('H') > -1){
                ciSeq = 3;
            }

            if(ciSeq == 1){ // 삼성
                etc1Prc = '10,000,000원';
                etc2Prc = '150,000원';

                maturity = '20';

                if(chk1 == 'Y' && chk2 == 'Y'){
                    showDiseaseBox = true;
                    diseaseTeeth = '(치과치료 제외)';
                    guarantype = (thisAge > 6 ? 3 : 1);
                }else if(chk1 == 'Y'){
                    showDiseaseBox = true;
                    guarantype  = 2;
                }else if(chk2 == 'Y') {
                    diseaseTeeth = '(치과치료 제외)';
                    showDiseaseBox = true;
                    guarantype = 3;
                }

                if(thisText.indexOf('B') > -1){
                    hospitalPrc = '10,000,000원';
                    surgeryPrc = '2,000,000원';

                    firstQuestion = '<span class="question-mark" data-num="1-1" data-kind="10" data-disease1="'+chk1+'" data-disease2="'+chk2+'" data-age="'+thisAge+'" data-fee="'+fee+'"><i class="mi-text-hidden">정보</i></span>';
                    secondQuestion = '<span class="question-mark" data-num="1-2" data-repyn="'+repYn+'" ><i class="mi-text-hidden">정보</i></span>';
                }else{
                    hospitalPrc = '15,000,000원';
                    surgeryPrc = '3,000,000원';

                    firstQuestion = '<span class="question-mark" data-num="1-1" data-kind="15" data-disease1="'+chk1+'" data-disease2="'+chk2+'" data-age="'+thisAge+'" data-fee="'+fee+'"><i class="mi-text-hidden">정보</i></span>';
                    secondQuestion = '<span class="question-mark" data-num="1-2" data-repyn="'+repYn+'" ><i class="mi-text-hidden">정보</i></span>';
                }

                if(thisText.substr(3, 1) == 1){
                    insuItemName = '삼성화재 반려견보험 애니펫 1년';
                }else{
                    insuItemName = '삼성화재 반려견보험 애니펫 3년';
                }

            }else if(ciSeq == 2) { // DB
                hospitalPrc = '3,000,000원';
                surgeryPrc = '3,000,000원';
                showDiseaseBox = true;
                diseaseTeeth = '(치과치료 포함)';
                guarantype = 1;
                maturity = '10';

                etc1Prc = '5,000,000원';
                etc2Prc = '150,000원';

                insuItemName = 'DB 프로미 반려동물보험';

                firstQuestion = '<span class="question-mark" data-num="2-1" data-kind="10" data-disease1="'+chk1+'" data-disease2="'+chk2+'" data-age="'+thisAge+'" data-fee="'+fee+'"><i class="mi-text-hidden">정보</i></span>';
                secondQuestion = '<span class="question-mark" data-num="2-2" data-repyn="'+repYn+'" ><i class="mi-text-hidden">정보</i></span>';

            }else if(ciSeq == 3){ // 한화
                hospitalPrc = '3,000,000원';
                surgeryPrc = '3,000,000원';
                showDiseaseBox = true;
                diseaseEtc = '한방침술/물리치료 포함';
                maturity = '10';

                if(chk2 == 'Y'){
                    diseaseTeeth = '(치과치료 포함)';
                    guarantype = 3;
                }

                etc1Prc = '5,000,000원';
                etc2Prc = '150,000원';
                etc3Prc = '150,000원';

                insuItemName = '한화 LIFEPLUS 댕댕이보험';
                firstQuestion = '<span class="question-mark" data-num="3-1" data-kind="10" data-disease1="'+chk1+'" data-disease2="'+chk2+'" data-age="'+thisAge+'" data-fee="'+fee+'"><i class="mi-text-hidden">정보</i></span>';
                secondQuestion = '<span class="question-mark" data-num="3-2" data-repyn="'+repYn+'" ><i class="mi-text-hidden">정보</i></span>';
            }

            var titleText = '보장내용 - ' + insuItemName,
            dCopy = '<div class="plan-box-student in-pet">'
                        +'<div>'
                            +'<div class="plan-summary-wrap">'
                                +'<div>'
                                    +'<div class="plan-summary-title">품종</div>'
                                    +'<div class="plan-summary-content plan-summary-breed">'
                                        +'<div class="pop-breed">'+breed+'</div>'
                                    +'</div>'
                                +'</div>'
                                +'<div>'
                                    +'<div class="plan-summary-title">나이</div>'
                                    +'<div class="plan-summary-content">'+(thisAge < 1 ? month + '개월' : '만' + thisAge + '세')+'</div>'
                                +'</div>'
                                +'<div class="highlight">'
                                    +'<div class="plan-summary-title">보험기간</div>'
                                    +'<div class="plan-summary-content plan-summary-period active">'+(servicePeriod/12) + '년(' + maturity + '세까지 갱신가능)</div>'
                                +'</div>'
                            +'</div>'
                            +'<div class="section">'
                                +'<div class="title">질병/상해 보장금액'+firstQuestion+'</div>'
                                +'<ul class="student depth1">'
                                    +(ciSeq == 1 ?
                                    '<li class="strong1">'
                                        +'<div>'
                                            +'<div>입원치료비</div>'
                                            +'<div>통원치료비</div>'
                                        +'</div>'
                                        +'<div'+(servicePeriod == 36 ? ' class="copy"' : '')+'>'+hospitalPrc+'</div>'
                                    +'</li>'
                                    :
                                    '<li class="strong1">'
                                        +'<div>입원치료비</div>'
                                        +'<div>'+hospitalPrc+'</div>'
                                    +'</li>'
                                    +'<li class="strong1">'
                                        +'<div>통원치료비</div>'
                                        +'<div>'+hospitalPrc+'</div>'
                                    +'</li>')
                                    +'<li class="strong1">'
                                        +'<div>수술비</div>'
                                        +'<div'+(servicePeriod == 36 ? ' class="copy"' : '')+'>'+surgeryPrc+'</div>'
                                    +'</li>'
                                +'</ul>'
                                +(showDiseaseBox ? '<div class="guarantee-wrap">'
                                +'<div class="guarantee-box">'
                                    +(diseaseEtc ? '<div>한방침술/물리치료 포함</div>' : '')
                                    +(chk2 == 'Y' ? '<div>구강질환치료 포함<span'+(ciSeq != 1 ? ' class="point-color1"' : '')+'>'+diseaseTeeth+'<span></div>' : '')
                                    +(chk2 == 'Y' ? '<div>피부질환치료 포함</div>' : '')
                                    +(chk1 == 'Y' ? '<div>슬관절치료 포함</div>' : '')
                                +'</div>'
                                    +(guarantype ? '<div class="gurantee-btn-wrap"><button type="button" class="underline disease-guarantee-pop" data-ci="'+ciSeq+'" data-age="'+thisAge+'" data-guarantype="'+guarantype+'">자세히보기</button></div>' : '')
                                +'</div>' : '')
                            +'</div>'
                            +'<div class="section">'
                                +'<div class="title">기타특약 보장금액'+secondQuestion+'</div>'
                                +'<ul class="student depth1">'
                                    +(repYn == 'Y' ? '<li class="strong1">'
                                                +'<div>배상책임</div>'
                                                +'<div'+(servicePeriod == 36 && ciSeq == 1 ? ' class="copy"' : '')+'>'+etc1Prc+'</div>'
                                            +'</li>' : '')
                                    +'<li class="strong1">'
                                        +'<div>사망위로금</div>'
                                        +'<div>'+etc2Prc+'</div>'
                                    +'</li>'
                                    +(etc3Prc ? '<li class="strong1">'
                                                    +'<div>강아지 유실지원금</div>'
                                                    +'<div>'+etc3Prc+'</div>'
                                                +'</li>' : '')
                                +'</ul>'
                            +'</div>'
                        +'</div>'
                    +'</div>';


            miDesignPop.alert({
                dTarget: 'pet-plan-info',
                dClass: 'guarantee-info',
                dTitleAlign: 't-a-l',//기본값 t-a-c //t-a-c, t-a-l, t-a-r 타이틀 정렬
                dTitle: titleText, // 타이틀
                dCopy: dCopy, // 카피라이트
            });
        }else{
            commonJS.alertPop(res.error.message);
        }
    }).fail(function(res) {
        commonJS.alertPop(res.responseJSON.error.message || res.responseJSON.message);
    });
});

searchResetBtn.on('click', function() { // 검색 초기화
    var orderBySelect = $('#orderBySelect'),
        stepSelect = $('#stepSelect'),
        stateSelect = $('#stateSelect'),
        insuranceSelect = $('#insuranceSelect'),
        divisionSelect = $('#divisionSelect'),
        miDatepicker = $('#miDatepicker'),
        defaultDate = miDatepicker.data('default'),
        optionSelect = $('#optionSelect'),
        txtKeyfield = $('#txtKeyfield');

    orderBySelect.val('apply');
    stepSelect.val('');
    stateSelect.val('');
    insuranceSelect.val('');
    divisionSelect.val('');
    optionSelect.val('pet-user');
    txtKeyfield.val('');
    miDatepicker.val(defaultDate);
    $('input[name="dateselect"]').each(function(item) {
        if($(this).val() == 3){
            $(this).prop('checked', true);
        }
    });

    searchForm.attr('onsubmit', 'return true').submit();
});

$(document).on('click', '.read-file', function() { // 가입증명서 보기
    var _This = $(this),
        subList = _This.parents('.people'),
        parentList = subList.prev('.student'),
        status = parentList.data('status'),
        id = _This.data('id'),
        uuid = _This.data('uuid'),
        planName = _This.data('planname');

    if(status != 'M'){
        if(uuid != null){ // 삼성, pdf 있음
            window.open(location.origin + '/pet/certification/file/' + uuid, '_blank')
        }else if(uuid == null && planName.indexOf('S') > -1){ // 삼성, pdf 없음
            commonJS.alertPop('업로드된 가입증명서가 없습니다');
        }
    }else{
        commonJS.alertPop('가입증명서를 조회할 수 없는 상태입니다');
    }
});
// END admin, thirdparty 공용 확정


function questionPop() { // 플랜 보장내용 물음표 인포박스
    var target = '.question-mark';

    $(document).on('click', target, function() {
        var _This = $(this),
            id = String(_This.data('num')),
            repYn = _This.data('repyn'),
            kind = String(_This.data('kind')), // 삼성일 때 10만원 15만원
            disease1 = _This.data('disease1'), // 슬관절
            disease2 = _This.data('disease2'), // 피부/구강
            age = _This.data('age'), // 삼성일 때 만 6세까지만 슬관절 내용 노출
            fee = _This.data('fee'), // 자기부담금
            popTarget = id + (_This.data('kind') ? kind :  ''),
            html = '';

        switch(id) {
            // 삼성
            case '1-1' :
                html = '<p class="info-student-title">입원/통원치료비</p>'
                        +'<span>입원/통원치료비 1일보상한도 '+kind+'만원</span>'
                        +'<p class="info-student-title">수술비</p>'
                        +'<span>수술비 보상은 1년에 2회 가능하며, 1회보상한도 '+kind+'0만원</span>'
                        +(disease1 == 'Y' ? '<p class="info-student-title">슬관절 수술비</p>'
                        +'<span>슬관절 수술비 보상은 1년에 1회 가능하며, 1회보상한도 100만원</span>' : '')
                        +'<ul class="info-student-student">'
                            +'<li><div>질병은 가입후 <span class="strong">30일 경과시</span>부터 보장\n'+(age < 7 && disease1 == 'Y' ? '<span class="small">(단, 슬관절질환의 경우 '+(age > 0 ? '1년' : '90일')+')</span>' : '') + '</div></li>'
                            +'<li><div>보험기간중 치료가 개시된 경우,\n보험만료후 <span class="strong">90일까지</span> 보장</div></li>'
                            +'<li><div class="ls">치료비 <span class="strong">70%</span> 보장 / 자기부담금 <span class="strong">'+fee+'만원</span>\n'+(age < 7 && disease1 == 'Y'  ? '<span class="small">(단, 슬관절질환 보장의 경우 수술비 및 당일 치료비 <span class="strong">50%</span> 보장 / 자기부담금 <span class="strong">없음</span>)<span>' : '') + '</div></li>'
                        +'</ul>'
                        +(disease2 == 'N' ? '<div class="additional-section">'
                            +'<div>'
                                +'<p class="mi-point-color1">구강질환 보장</p>'
                                +'<div>단, 구강내 질환을 원인으로 생긴 치료비 보상</div>'
                                +'<ul class="student-dash"><li>치석제거 및 치과치료비 제외</li><li>단, 부정교합 기타 이상형성의 개선치료는 포함</li></ul>'
                            +'</div>'
                        +'</div>' : '');
                break;
            case '1-2' :
                html = (repYn ? '<p class="info-student-title">배상책임</p>'
                        +'<span>배상책임 보상은 1년에 1사고 가능하며, 1사고 보상한도 1,000만원\n(자기부담금 10만원)</span>' : '')
                        +'<p class="info-student-title">사망위로금</p>'
                        +'<span>가입후 30일 경과시점부터 보장</span>';
                break;
            // DB
            case '2-1' :
                html = '<p class="info-student-title">입원치료비</p>'
                        +'<span>입원치료비 보상은 1년에 20일 가능하며, 1일보상한도 15만원</span>'
                        +'<p class="info-student-title">통원치료비</p>'
                        +'<span>통원치료비 보상은 1년에 20일 가능하며, 1일보상한도 15만원</span>'
                        +'<p class="info-student-title">수술비</p>'
                        +'<span>수술비 보상은 1년에 2회 가능하며, 1회보상한도 150만원</span>'
                        +'<ul class="info-student-student">'
                            +'<li><div>질병은 가입후 <span class="strong">30일 경과시</span>부터 보장</div></li>'
                            +'<li><div>보험기간중 치료가 개시된 경우,\n보험만료후 <span class="strong">180일까지</span> 보장</div></li>'
                            +'<li><div class="ls">치료비 <span class="strong">70%</span> 보장 / 자기부담금 <span class="strong">'+fee+'만원</span></div></li>'
                        +'</ul>'
                break;
            case '2-2' :
                html = (repYn ? '<p class="info-student-title">배상책임</p>'
                        +'<span>배상책임 보상은 1년에 1사고 가능하며, 1사고 보상한도 500만원\n(자기부담금 3만원)</span>' : '')
                        +'<p class="info-student-title">사망위로금</p>'
                        +'<span>가입후 30일 경과시점부터 보장</span>';
                break;

            // 한화
            case '3-1' :
                html = '<p class="info-student-title">입원치료비</p>'
                        +'<span>입원치료비 보상은 1년에 20일 가능하며, 1일보상한도 15만원</span>'
                        +'<p class="info-student-title">통원치료비</p>'
                        +'<span>통원치료비 보상은 1년에 20일 가능하며, 1일보상한도 15만원</span>'
                        +'<p class="info-student-title">수술비</p>'
                        +'<span>수술비 보상은 1년에 2회 가능하며, 1회보상한도는 150만원</span>'
                        +'<ul class="info-student-student">'
                            +'<li><div>질병은 가입후 <span class="strong">30일 경과시</span>부터 보장</div></li>'
                            +'<li><div>보험기간중 치료가 개시된 경우,\n보험만료후 <span class="strong">180일까지</span> 보장</div></li>'
                            +'<li><div class="ls">치료비 <span class="strong">70%</span> 보장 / 자기부담금 <span class="strong">'+fee+'만원</span></div></li>'
                        +'</ul>'
                        +'<div class="additional-section">'
                            +'<div>'
                                +'<p class="mi-point-color1">한방 침술/물리치료</p>'
                                +'<div>단, 보상하는 상해 또는 질병 치료를 위한 침술치료에 한정. 그 외 한방 및 대체의학은 제외</div>'
                            +'</div>'
                        +'</div>';
                break;
            case '3-2' :
                html = (repYn ? '<p class="info-student-title">배상책임</p>'
                        +'<span>배상책임 보상은 1년에 1사고 가능하며, 1사고 보상한도 500만원\n(자기부담금 3만원)</span>' : '')
                        +'<p class="info-student-title">사망위로금</p>'
                        +'<span>가입후 60일 경과시점부터 보장</span>'
                        +'<p class="info-student-title">강아지 유실지원금</p>'
                        +'<span>가입후 60일 경과시점부터 보장</span>';
                break;

            case '4' : // 등록유형
                html =  '<p class="info-student-title">내장형</p>'
                        +'<span>내장형 무선식별장치</span>'
                        +'<p class="info-student-title">외장형</p>'
                        +'<span>외장형 무선식별장치</span>'
                        +'<p class="info-student-title">인식표</p>'
                        +'<span>무선식별장치가 없는 인식표</span>';
                break;

            case '5' : // 자기부담금
                html = '치료비 자기부담금은 치료비 청구시 가입자가 부담하는 금액입니다';
                break;
        }

        miDesignPop.alert({ // 마크업 랜더링후 삭제함 alert
			dType: 'info',
            dCopyAlign : 't-a-l',
			dTarget: 'question-mark-info'+popTarget,
			dCopy : html, // 카피라이트
		});
    });
}

$(document).on('click', '.disease-guarantee-pop', function() { // 특약 자세히보기
    var _This = $(this),
        ciSeq = _This.data('ci'),
        age = _This.data('age'),
        guaranType = _This.data('guarantype'),
        isBoneShow = true,
        isTeethShow = true,
        isShowEverything = true,

        copy = '';

    if(guaranType == 2){
        isTeethShow = false;
    }
    if(guaranType == 3){
        isBoneShow = false;
    }

    if(age < 7 && isBoneShow && isTeethShow){
        isShowEverything = true;
    }

    if(ciSeq == '1'){ // 삼성
        copy = (age < 7 && isBoneShow ? '<p class="info-student-title">슬관절 수술비용보장</p>'
                +'<span>슬관절탈구, 십자인대파열, 고관절탈구(고관절형성부전, 대퇴골두괴사증으로 인한 탈구 포함) 수술비와 당일 치료비 보상</span>' : '')
                +(isTeethShow ? '<p class="info-student-title">피부질환 보장</p>'
                +'<span>피부질환(외이염, 면역성 피부알러지, 피부트러블을 포함) 치료비 보상</span>'
                +'<p class="info-student-title">구강질환 보장</p>'
                +'<span>구강내 질환 치료비 보상</span>'
                +'<ul class="student-dash purple"><li>치석제거 및 치과치료비 제외(부정교합 기타 이상형성의 개선치료 포함)</li></ul>' : '');

    }else if(ciSeq == '2'){ // DB
        copy = '<p class="info-student-title">슬관절질환 보장</p>'
                +'<span>슬관절탈구, 고관절탈구, 슬관절형성부전, 고관절형성부전 또는 기타 이들과 유사한 질병/상해 수술비와 치료비 보상</span>'
                +'<p class="info-student-title">피부질환 보장</p>'
                +'<span>피부질환(외이염, 면역성 피부알러지, 피부트러블을 포함) 치료비 보상</span>'
                +'<p class="info-student-title">구강질환 보장</p>'
                +'<span>구강내 질환 치료비 보상</span><br>'
                +'<span class="mi-point-color1">(치료목적의 치석제거 및 치아부정교합 등 치과치료비 포함)</span>';


    }else if (ciSeq == '3'){ // 한화
        copy = '<p class="info-student-title">피부질환 보장</p>'
                +'<span>피부질환(외이염, 면역성 피부알러지, 피부트러블을 포함) 치료비 보상</span>'
                +'<p class="info-student-title">구강질환 보장</p>'
                +'<span>구강내 질환 치료비 보상</span><br>'
                +'<span class="mi-point-color1">(치료목적의 치석제거 및 치아부정교합 등 치과치료비 포함)</span>';


    }

    miDesignPop.setting({ // 마크업 랜더링후 삭제함 alert
        dType: 'info',
        dTarget: 'question-mark-info' + ciSeq,
        dCopy: copy
    });
});
