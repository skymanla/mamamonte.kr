/*
마이뱅크
write : gray
since : 2019-10-18
edit : Jinn
lase edit : 2020-01-21 info 타입 추가
*/
var miDesignPop = new function(){
    this.set = function(options){
        var defaults = {
            dAuto : true, // 팝업 dom render 가 팝업 마크업이 이미 있을경우만 진행
            dWidth : '', // pop width
            dConHe : '', // pop con height
            dType : 'basic', // basic, alert, info 타입설정
            dClass : 'info-box1', // 기본 info-box1 // class 설정 커스텀 가능
            dTarget : 'dev-alert-pop', // 타겟 설정 id 설정 // 마크업된 팝업이 있을경우 // 멀티팝업의 경우
            dTitle : null, // 타이틀
            dTitleAlign : 't-a-l', //t-a-c, t-a-l, t-a-r 타이틀 정렬
            dCopy : null, // 카피라이트
            dCopyAlign : 't-a-l', //t-a-c, t-a-l, t-a-r 카피라이트 정렬
            dOpenAc : null, // 오픈콜백
            dCloseAc : null, // .close-pop 콜백
            dYesAc : null, // .yes-bt-ac 콜백
            dNoAc : null, // .no-bt-ac 콜백
            dButtonSetNum : 1, // 1, 2
            dButtonSet : false, // 팝업 버튼 셋팅 커스텀 가능
            dButtonSetText : ['확인','아니오'], // 기본값 ['확인','아니오'] // 팝업 버튼 셋팅 커스텀 가능
            dCloseX : false, // 팝업 x 버튼
            dAjaxHtml : false, // ajax 로 html 파일을 load해서 dCopy 에 대입할 경우
        };
        var opts = $.extend(defaults, options);
        return opts;
    };

    this.setting = function(options){
        var opts = this.set(options);

        var _Target = $('#'+opts.dTarget),
        _TargetCon = _Target.find('.box-wrap'),
        _CloseBt = '#'+opts.dTarget +' .close-pop',
        _YesBt = '#'+opts.dTarget +' .yes-bt-ac',
        _NoBt = '#'+opts.dTarget +' .no-bt-ac';
        

        openAc();

        $(document).on('click',_CloseBt,function(){
            if(opts.dCloseAc){
                opts.dCloseAc();
            }
            dPopClose();
        });

        $(document).on('click',_YesBt,function(){
            if(opts.dYesAc){
                opts.dYesAc();
            }
            dPopClose();
        });

        $(document).on('click',_NoBt,function(){
            if(opts.dNoAc){
                opts.dNoAc();
            }
            dPopClose();
        });

        function openAc(){
            if(_Target.length==0 && opts.dAuto){
                var titleData = '';
                var CloseXButton= '';
                var popWidth = '';
                var popConHeight = '';
                var popStyle = (opts.dType=='info') ? 'pop-info' : ''; 

                if(opts.dWidth){
                    popWidth = 'max-width:'+opts.dWidth+'px';
                }

                if(opts.dConHe){
                    popConHeight = 'height:'+opts.dConHe+'px';
                }

                if(opts.dTitle){
                    titleData = '<h2 class="title '+opts.dTitleAlign+'">'+opts.dTitle+'</h2>';
                }

                if(opts.dCloseX){
                    CloseXButton = '<button type="button" class="close-x close-pop"></button>'
                }

                if(!opts.dAjaxHtml){
                    opts.dCopy = opts.dCopy.replace(/\n/g,"<br>");
                }

                if(opts.dButtonSet){
                    opts.dButtonSet = opts.dButtonSet;
                } else if(opts.dButtonSetNum == 1){
                    opts.dButtonSet = '<button type="button" class="yes-bt yes-bt-ac '+popStyle+'">'+opts.dButtonSetText[0]+'</button>'
                } else if(opts.dButtonSetNum == 2){
                    opts.dButtonSet = '<ul>'+
                                        '<li class="w-2"><button type="button" class="no-bt no-bt-ac">'+opts.dButtonSetText[1]+'</button></li>'+
                                        '<li class="w-2"><button type="button" class="yes-bt yes-bt-ac">'+opts.dButtonSetText[0]+'</button></li>'+
                                    '</ul>';
                }

                var html = '<div class="mi-common-pop '+opts.dClass+'" id="'+opts.dTarget+'">'+
                                '<div>'+
                                    '<div class="box-wrap" style="'+popWidth+'">'+
                                        CloseXButton+
                                        '<div class="copy-wrap '+opts.dCopyAlign+' '+popStyle+'" style="'+popConHeight+'">'+titleData+'<div class="copy-box">'+opts.dCopy+'</div></div>'+
                                        '<div class="bt-wrap '+popStyle+'">'+opts.dButtonSet+'</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>';

                $('body').append(html);
            }
            dPopOpen();
        }

        $(window).on('resize', function() {
            if($(".mi-common-pop:visible").length!=0){
                dPopResize();
                $('html').addClass('mi-scroll-none');
            }
        }).resize();
        
        function dPopOpen(){
            _Target = $('#'+opts.dTarget),
            _TargetCon = _Target.find('.box-wrap'),
            _CloseBt = '#'+opts.dTarget +' .close-pop';

            setTimeout(function(){
                $('html').addClass('mi-scroll-none');
                _Target.show();
                _Target.find('> div').css({opacity : 1});
                dPopResize();
                if(opts.dOpenAc){
                    opts.dOpenAc();
                }
                
                _Target.attr({
                    'tabindex' : 0
                }).css({
                    'z-index' : 99999+$(".mi-common-pop:visible").length
                }).focus();
                
            },10);
        }

        function dPopClose(){
            $(document).off('click',_CloseBt);
            $(document).off('click',_YesBt);
            $(document).off('click',_NoBt);
            
            _Target.hide();
            if(opts.dType=='alert'){
                _Target.remove();
            }
            if($(".mi-common-pop:visible").length==0){
                $('html').removeClass('mi-scroll-none');
            }
        }

        function dPopResize(){
            var TargetPadding = parseFloat(_Target.css('padding-left')),
                cWidth = _TargetCon.outerWidth(),
                cHeight = _TargetCon.outerHeight(),
                wWidth = $(document).width(),
                wHeight = $(window).height(),
                cTop = (wHeight/2)-(cHeight/2),
                cLeft = (wWidth/2)-(cWidth/2)-TargetPadding;

            
            if(cTop<=0){cTop=0;}
            if(cLeft<=0){cLeft=0;}
            _TargetCon.css({
                'top': cTop+'px',
                'left': cLeft+'px'
            });
        }
    };

    this.alert = function(data){
        var dataType = typeof data;

        if(dataType === 'object'){
            var dOpts = {
                dType : 'alert', // basic, alert 타입설정
                dCopyAlign : 't-a-c', //t-a-c, t-a-l, t-a-r 카피라이트 정렬
            };
            var ddOpts = $.extend(dOpts, data);
        } else if(dataType === 'string'){
            var ddOpts = {
                dConHe: 110, // pop con height
                dType : 'alert', // basic, alert 타입설정
                dCopy : data, // 타이틀
                dCopyAlign : 't-a-c', //t-a-c, t-a-l, t-a-r 카피라이트 정렬
            }
        }
        this.setting(ddOpts);
    }
};