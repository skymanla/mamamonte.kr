var searchResetBtn = $('#searchResetBtn'), // 검색 초기화
    addListBtn = $('#addListBtn'), // 등록하기 버튼
    deleteBtn = $('.delete-btn'); // 목록 삭제 버튼

// STR 검색창
searchResetBtn.on('click', function() { // 검색 초기화
    var searchOption = $('#searchOption'),
        txtKeyField = $('#txtKeyfield');
    
    searchOption.val('W');
    txtKeyField.val('');
});
// END 검색창

// STR 등록하기
addListBtn.on('click', function() {
    miDesignPop.alert({
        dTarget: 'blacklist-pop',
        dCopy: '<div class="blacklist-pop-box">'
                    +'<div class="mi-input-wrap popup-input">'
                        +'<div class="mi-input-group">'
                        +'<label class="mi-input-label">생년월일</label>'
                            +'<div class="mi-input-box">'
                                + '<div class="mi-input-input">'
                                    +'<input type="text" class="mi-input" id="birth">'
                                + '</div>'
                            +'</div>'
                        +'</div>'
                    +'</div>'

                    +'<div class="mi-input-wrap popup-input">'
                        +'<div class="mi-input-group">'
                        +'<label class="mi-input-label">주민등록 뒷자리</label>'
                            +'<div class="mi-input-box">'
                                + '<div class="mi-input-input">'
                                    +'<input type="text" class="mi-input" id="resident">'
                                + '</div>'
                            +'</div>'
                        +'</div>'
                    +'</div>'

                    +'<div class="mi-input-wrap popup-input">'
                        +'<div class="mi-input-group">'
                        +'<label class="mi-input-label">등록사유</label>'
                            +'<div class="mi-input-box">'
                                + '<div class="mi-input-input">'
                                    +'<textarea class="mi-input" id="content"></textarea>'
                                + '</div>'
                            +'</div>'
                        +'</div>'
                    +'</div>'

                    +'<div class="mi-input-wrap popup-input">'
                        +'<div class="mi-input-group">'
                            +'<label class="mi-input-label">서비스</label>'
                            +'<div class="mi-input-box">'
                                +'<div class="mi-input-input">' 
                                    +'<input type="radio" name="bType" class="b-type" id="short" value="A">'
                                +'</div>'
                                +'<label class="mi-input-label" for="short">단기</label>'
                            +'</div>'
                            +'<div class="mi-input-box">'
                                +'<div class="mi-input-input">' 
                                    +'<input type="radio" name="bType" class="b-type" id="yuhak" value="B">'
                                +'</div>'
                                +'<label class="mi-input-label" for="yuhak">장기</label>'
                            +'</div>'
                            +'<div class="mi-input-box">'
                                +'<div class="mi-input-input">'
                                    +'<input type="radio" name="bType" class="b-type" id="domestic" value="D">'
                                +'</div>'
                                +'<label class="mi-input-label" for="domestic">국내</label>'
                            +'</div>'
                        +'</div>'
                    +'</div>'
                +'</div>',
        dCloseX: true,
        dButtonSet: '<ul>'
                        + '<li class="w-1"><button type="button" class="yes-bt multi-pop-bt">등록</button></li>'
                    + '</ul>',
        
    });

    $(document).on('click', '.multi-pop-bt', function() {
        var birth = $('#birth'),
            birthVal = birth.val(),
            resident = $('#resident'),
            residentVal = resident.val(),
            content = $('#content'),
            contentVal = content.val().trim(),
            service = $('.b-type:checked'),
            serviceVal = service.val(),
            nowYear = new Date().getFullYear(),
            checkBirth = miValidate.isMemBirth({
                nowDate: nowYear,
                strBirth: birthVal,
                endBirth: residentVal
            }),
            ajaxData = {};

        if(!checkBirth.birthCheck){
            miDesignPop.alert({
                dConHe: 110,
                dCopy: '생년월일을 정확히 입력해주세요', 
            });
            return;
        }

        if(birthVal.length != 6){
            miDesignPop.alert({
                dConHe: 110,
                dCopy: '생년월일을 정확히 입력해주세요', 
            });
            return;  
        }

        if(residentVal.length != 7){
            miDesignPop.alert({
                dConHe: 110,
                dCopy: '주민번호를 정확히 입력해주세요', 
            });
            return;
        }

        if(!miValidate.isMemNumCheck(birthVal+residentVal)){
            miDesignPop.alert({
                dConHe: 110,
                dCopy: '주민번호를 정확히 입력해주세요', 
            });
            return;
        }

        if(contentVal.length < 1){
            miDesignPop.alert({
                dConHe: 110,
                dCopy: '등록사유를 입력해주세요', 
            });
            return;
        }


        if(!serviceVal){
            miDesignPop.alert({
                dConHe: 110,
                dCopy: '서비스 종류를 선택해주세요', 
            });
            return;
        }

        ajaxData.birth = birthVal;
        ajaxData.resident = residentVal;
        ajaxData.memo = contentVal;
        ajaxData.service = serviceVal;

        $.ajax({
            type: 'POST',
            url: '/api/domestic/blacklist',
            data: JSON.stringify(ajaxData),
            contentType: 'application/json',
            dataType: 'json',
            beforeSend: function(xhr) { xhr.setRequestHeader(commonJS.header, commonJS.token); }
        }).done(function(res) {
            miDesignPop.alert({
                dConHe: 110,
                dCopy: '정상적으로 등록되었습니다',
                dYesAc: function() {
                    location.reload();
                }
            });
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
// END 등록하기

// STR 삭제하기
deleteBtn.on('click', function() {
    var _This = $(this),
        code = _This.data('code');

    miDesignPop.alert({
        dConHe: 110,
        dCopy: '블랙리스트에서 삭제하시겠습니까?',
        dButtonSetNum: 2,
        dYesAc: function() {
            $.ajax({
                type: 'POST',
                url: '/api/domestic/blacklist/'+code,
                contentType: 'application/json',
                dataType: 'json',
                beforeSend: function(xhr) { xhr.setRequestHeader(commonJS.header, commonJS.token); }
            }).done(function(res) {
                miDesignPop.alert({
                    dConHe: 110,
                    dCopy: '삭제되었습니다',
                    dYesAc: function() {
                        location.reload();
                    }
                });
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
// END 삭제하기