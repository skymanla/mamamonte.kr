var petInfoA = $('.pet-info'), // 펫 생년월일 a태그
    uploadInput = $('.upload-input'); // 삼성 pdf 업로드 input

excelBtn.on('click', function() { // 엑셀 다운로드
    var txtDate = searchForm.find('#miDatepicker').val() || null,
        option = searchForm.find('#optionSelect').val() || null,
        txtKeyfield = searchForm.find('#txtKeyfield').val() || null,

        company = $('.container-section').data('company'),
        ajaxData = {};

    ajaxData.txtDate = txtDate;
    ajaxData.option = option;
    ajaxData.txtKeyfield = txtKeyfield;

    commonJS.excelDownload(ajaxData, '/pet/insurance/'+company+'/excel')
});

petInfoA.on('click', function() { // 펫 정보 팝업
    var _This = $(this),
        thisCode = _This.data('code'),
        copy = '';

    $.ajax({
        type: 'GET',
        url: '/api/pet/animal/'+thisCode,
        contentType: 'application/json',
        dataType: 'json'
    }).done(function(res) {
        if(res.success){
            var data = res.data,
                name = data.name,
                age = data.age,
                fur = data.fur,
                gender = data.gender,
                trn = data.trn;
            
            miDesignPop.alert({
                dCopy : '동물정보',
                dCopy : '<div class="pop-table">'
                            +'<table>'
                                +'<tr>'
                                    +'<td>동물이름</td>'
                                    +'<td>' + name + '</td>'
                                +'</tr>'
                                +'<tr>'
                                    +'<td>나이</td>'
                                    +'<td>만 ' + age + '세</td>'
                                +'</tr>'
                                +'<tr>'    
                                    +'<td>털 색상</td>'
                                    +'<td>' + (fur ? fur : '-') + '</td>'
                                +'</tr>'
                                +'<tr>'
                                    +'<td>성별</td>'
                                    +'<td>' + (gender == 'F' ? '암컷' : '수컷') + '</td>'
                                +'</tr>'
                                +'<tr>'
                                    +'<td>중성화</td>'
                                    +'<td>' + (trn == 'Y' ? '중성' : '미중성') + '</td>'
                                +'</tr>'
                            +'</table>'
                        +'</div>'
            });
        }else{
            commonJS.alertPop(res.error.message);
        }
    }).fail(function(res) {
        commonJS.alertPop(res.responseJSON.error.message || res.responseJSON.message);
    });

});

uploadInput.on('change', function() { // PDF 업로드
    var _This = $(this), // jquery this
        thisVal = _This.val(), // file input value
        thisCode = _This.data('code'),
        parentForm = _This.parent(),
        email = $('#' + thisCode + '_email').text(),
        formData = new FormData(parentForm[0]);

    console.log(email);
    if (thisVal && !(/\.(pdf|PDF)$/).test(thisVal)) {
        commonJS.alertPop('PDF 파일만 업로드 가능합니다');
        return;
    }

    formData.append('file', _This[0].files[0], 'samsung.certification.pdf');
    
    $.ajax({
        type: 'POST',
        url: '/pet/certification/file/' + thisCode + '/' + email,
        data: formData,
        contentType: false,
        processData: false,
        beforeSend: function(xhr) { xhr.setRequestHeader(commonJS.header, commonJS.token); }
    }).done(function(res) {
        if(res.success){
            commonJS.alertPop('파일을 업로드했습니다', function() {
                location.reload();
            });
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