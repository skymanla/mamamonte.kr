/*
 * Copyright (c) 2021.5.23
 * author: ryan-dev
 */

// datepicker
$(document).ready(function () {
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

    $('#first_come').datepicker({
        changeYear: true,
        changeMonth: true,
    })

    $('#first_pay').datepicker({
        changeYear: true,
        changeMonth: true,
    })
});

function semeOnchangeFn($_this) {
    var task = $_this.val();

    if (task === 'SD') {
        $('.pay_task').hide();
    } else {
        $('.pay_task').show();
    }
}

$('#cancelAddBtn').on('click', function () {
    location.href = '/consulting/list';
});

$('#addAccountBtn').on('click', function () {
    // validation
    var name        = $('input[name=name]'),
        birth_y     = $('input[name=birth_y]'),
        birth_m     = $('input[name=birth_m]'),
        birth_d     = $('input[name=birth_d]'),
        monthly     = $('input[name=monthly]'),
        tel         = $('input[name=tel]'),
        first_come = $('input[name=first_come]');

    if ($.trim(first_come.val()) === "") {
        commonJS.alertPop("접수일시는 필수입니다", function () {
            first_come.focus();
        });
        return;
    }

    if ($.trim(name.val()) === "") {
        commonJS.alertPop("이름은 필수입니다", function () {
            name.focus();
        });
        return;
    }

    if ($.trim(monthly.val()) === "") {
        commonJS.alertPop("개월수는 필수입니다", function () {
            monthly.focus();
        });
        return;
    }

    if ($.trim(birth_y.val()) === "") {
        commonJS.alertPop("생년월일을 입력해주세요", function () {
            birth_y.focus();
        });
        return;
    }

    if ($.trim(birth_m.val()) === "") {
        commonJS.alertPop("생년월일을 입력해주세요", function () {
            birth_m.focus();
        });
        return;
    }

    if ($.trim(birth_d.val()) === "") {
        commonJS.alertPop("생년월일을 입력해주세요", function () {
            birth_d.focus();
        });
        return;
    }

    if ($.trim(tel.val()) === "") {
        commonJS.alertPop("전화번호를 입력해주세요", function () {
            tel.focus();
        });
        return;
    }

    // 학생 정보 obj
    var studentObj = {
        name: name.val(),
        birth: birth_y.val() + '-' + birth_m.val() + '-' + birth_d.val(),
        monthly: monthly.val(),
        tel: tel.val(),
        first_come: first_come.val()
    }

    // 학생 상태 obj
    var studentStateObj = {
        p_state: $('#progressItem').val(),
        e_state: $('#expressionItem').val(),
        seme_state: $('#semesterItem').val()
    }

    // 결제 관련 obj
    var payInfoObj = {
        payDt: $('#first_pay').val(),
        payInfo: $('input[name=pay_info]:checked').val(),
        price: $('input[name=price]').val()
    }

    // 상담 관련 obj
    var vocObj = {
        v_kinds: $('input[name=voc_kinds]:checked').val(),
        v_state: $('#voc_title').val(),
        v_content: $('input[name=voc_content]').val()
    }

    ajaxCall({
        method: 'post',
        uri: 'consulting/save',
        params: {
            studentObj: studentObj,
            studentStateObj: studentStateObj,
            payInfoObj: payInfoObj,
            vocObj: vocObj
        },
        func: function(res) {
            commonJS.alertPop(res.message, function () {
                if (res.status === 'success') {
                    location.href = '/consulting/list';
                }
            });
        }
    })
});
