var loginBtn = $('#loginBtn'), // 로그인 버튼
    loginForm = $('#loginForm'), // 로그인 폼
    authBtn = $('#authBtn'), // 번호인증 확인 버튼
    authForm = $('#authForm'), // 번호인증 폼
    loginEmailId = '#loginEmail',
    loginPasswordId = '#loginPassword',
    loginEmail = $('#loginEmail'), // 이메일
    loginPassword = $('#loginPassword'), // 비밀번호
    rememberEmail = $('#rememberEmail'), // 이메일 저장

    authCode = $('#authCode'), // 인증번호
    resendAuthBtn = $('#resendAuth'), // 번호 인증 재전송

    date = new Date(),
    cookieEmail = commonJS.getCookie('mibankInsuId') || ''; // 쿠키 이메일 저장 값


if(cookieEmail){
    loginEmail.val(cookieEmail);
    rememberEmail.prop('checked', 'checked');
}

// STR 로그인
loginBtn.on('click', function() { // 로그인 버튼 클릭
    loginSubmit();
});

$(document).on('keydown', loginEmailId+','+loginPasswordId, function(key) { // 입력 중 엔터 처리
    if(key.keyCode == 13){
        loginSubmit();
    }
})


function loginSubmit() {
    var loginEmailVal = loginEmail.val(), // 이메일 값
        loginPasswordVal = loginPassword.val(), // 비밀번호 값
        rememberEmailVal = rememberEmail.is(':checked'); // 이메일 저장 값
    
    if(loginEmailVal.length < 1) {
        commonJS.alertPop('아이디를 입력하세요', function() {
            loginEmail.focus();
        });
        return;
    }
        
    if(loginPasswordVal.trim().length < 1) {
        commonJS.alertPop('비밀번호를 입력하세요', function() {
            loginPassword.focus()
        });
        return;
    }
    
    // 이메일 쿠키에 저장
    (rememberEmailVal) ? date.setDate(date.getDate() + 30) : date.setDate(date.getDate() - 1);
    document.cookie = "mibankInsuId="+loginEmailVal+";expires="+date.toUTCString();
    
    loginForm.attr("onsubmit", "return true");
    loginForm.submit();
}
// END 로그인

// STR 번호인증
authCode.on('keyup', function() {
    var _This = $(this),
        val = _This.val(),
        relVal = miValidate.isLangOnlyType(val, 'NUM'),
        relVal = miValidate.isSpaceDelete(relVal);

    _This.val(relVal);
});

authBtn.on('click', function() { // 인증번호 확인
    var authCodeVal = authCode.val(); // 인증번호 값
    $.ajax({
        type: 'POST',
        url: '/login/two-factor',
        data: JSON.stringify({confirm: authCodeVal}),
        contentType: 'application/json',
        dataType: 'json',
        beforeSend: function(xhr) { xhr.setRequestHeader(commonJS.header, commonJS.token); }
    }).done(function(res) {
        if(res.success){
            // TODO : URL 변경 @Jinn (20.05.11)
            if(res.data.isInsurance){ // 보험사
                location.href = '/insurance';
            }else{
                location.href = '/dashboard';
            }
        }else{
            commonJS.alertPop('인증에 실패했습니다\n다시 시도해주세요', function() {
                authCode.focus()
            });
            return;
        }
    }).fail(function(res) {
        commonJS.alertPop(res.responseJSON.error.message, function() {
            authCode.focus()
        });
        return;
    });
});

resendAuthBtn.on('click', function() { // 인증번호 재발송
    $.ajax({
        type: 'POST',
        url: '/login/two-factor/resend',
        data: JSON.stringify(),
        contentType: 'application/json',
        dataType: 'json',
        beforeSend: function(xhr) { xhr.setRequestHeader(commonJS.header, commonJS.token); }
    }).done(function(res) {
        if(res.success){
            commonJS.alertPop('인증번호가 재발송되었습니다', function() {
                authCode.focus()
            });
        }else{
            commonJS.alertPop('인증번호가 재발송을 실패했습니다\n다시 시도해주세요');
            return;
        }
    }).fail(function(res) {
        commonJS.alertPop(res.error.message);
        return;
    });

    
})
// END 번호인증