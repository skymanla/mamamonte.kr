/*
 * Copyright (c) 2021.5.21
 * author: ryan-dev
 */

function goModify() {
    var name = $('input[name=name]');
    var item = $('#centerTitle');

    if ($.trim(name.val()) === '') {
        commonJS.alertPop('이름을 입력해 주세요', function () {
            name.focus();
        });
        return;
    }

    ajaxCall({
        method: 'post',
        params: {
            seq: item.val(),
            name: name.val()
        },
        uri: 'oauth/save',
        func: function(res) {
            commonJS.alertPop(res.message, function() {
                location.href = '/user/logout';
            });
        }
    });
}

function goCancel() {
    location.href = '/user/logout';
}

