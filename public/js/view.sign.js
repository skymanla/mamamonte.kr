/*
마이뱅크
write : gray
since : 2019-11-29
*/
$(function(){
    signPopOpenAc(); // 서명받기 // 상세에서만 사용
});

// STR 서명받기
function signPopOpenAc(){
    var tarSignBt = $('#signPopOpenBt'), // 서명받기 버튼
        tarPop = $('#signPop'), // 서명받기 팝업
        tarPopCloseBt = tarPop.find('.close'), // 서명받기 팝업 닫기 버튼
        tarPopResetBt = tarPop.find('.reset'), // 서명받기 팝업 리셋 버튼
        tarPopOkBt = tarPop.find('.ok'), // 서명받기 팝업 확인 버튼
        tarSignImgWrap = $('.sign-wrap .con'); // 서명이미지 박스
    
    // STR signature_pad-master
    var wrapper = document.getElementById("signaturePad");
    var canvas = wrapper.querySelector("canvas");
    var signaturePad = new SignaturePad(canvas, {
        backgroundColor: 'rgb(255, 255, 255)'
    });

    function resizeCanvas() {
        var ratio =  Math.max(window.devicePixelRatio || 1, 1);
        //canvas.width = canvas.offsetWidth * ratio;
        //canvas.height = canvas.offsetHeight * ratio;
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        signaturePad.clear();
    }
    // END signature_pad-master

    tarSignBt.on('click',function(){ // 서명받기 버튼
        var _This = $(this);

        if(_This.hasClass('on')){ // 도착확정시간 입력 됬을때
            tarPop.show();
            resizeCanvas(); // // STR signature_pad-master
            $('html').addClass('mi-scroll-none');
        }
    });

    tarPopCloseBt.on('click',function(){ // 서명받기 팝업 닫기 버튼
        tarPop.hide();
        $('html').removeClass('mi-scroll-none');
    });

    tarPopResetBt.on('click',function(){ // 서명받기 팝업 리셋 버튼
        signaturePad.clear();
    });

    tarPopOkBt.on('click',function(){ // 서명받기 팝업 확인 버튼
        if (signaturePad.isEmpty()) { // 서명이 없을때
           // alert("Please provide a signature first.");
        } else { // 서명이 있을때
            var dataURL = signaturePad.toDataURL(), // 이미지 src
                img = '<div class="img-box"><img src="'+dataURL+'"></div>';

            tarSignImgWrap.html(img);
            tarPop.hide();
            $('.receipt-bt-no').removeClass('on');
            $('.receipt-bt-ok').addClass('on');
            $('.list.type2').show();
            $('html').removeClass('mi-scroll-none');
        }
    });
}
// END 서명받기