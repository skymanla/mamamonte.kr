/*
 * Copyright (c) 2021.5.21
 * author: ryan-dev
 */

function goModify() {
    var item = $('#centerTitle');

    ajaxCall({
        method: 'post',
        params: {
            seq: item.val()
        },
        uri: 'oauth/save',
        func: function(res) {
            commonJS.alertPop(res.msg, function() {
                location.href = '/user/logout';
            });
        }
    });
}

function goCancel() {
    location.href = '/user/logout';
}

