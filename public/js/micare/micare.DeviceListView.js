(function ($) {
    function DeviceListView(params) {
        var that = this;

        that._$micareDomain = params.micareDomain;
        that.$el = $('.' + params.classId);

        that._$txtKeyfield = that.$('#txtKeyfield');
        that._$progressStatus = that.$('#progressStatus');
        that._$billStatus = that.$('#billStatus');
        that._$inspectionStatus = that.$('#inspectionStatus');
        that._$insureStatus = that.$('#insureStatus');
        that._$optionSelect = that.$('#optionSelect');
        that._$miDatepicker = that.$('#miDatepicker');
        that._$searchResetBtn = that.$('#searchResetBtn');
        that._$refreshBtn = that.$('#refreshBtn');
        that._$searchForm = that.$('#searchForm');
        that._$allBtn = that.$('#allBtn');
        that._$partnerHiddenInput = that.$('#partnerHiddenInput');
        that._$partnerBtn = that.$('.partner-btn');
        that._$statusChangeA = that.$('.status-change');

        //이벤트 바인딩
        bindEvents.call(that);

        //초기화
        that._$searchResetBtn.on('click', function () {
            reset.call(that);
        });

        that._$refreshBtn.on('click', function (){
            location.reload();
        });

        that._$allBtn.on('click', function (){
            reset.call(that);
            that._$partnerHiddenInput .val('');
            that._$searchForm.attr('onsubmit', 'return true').submit();
        });

        that._$partnerBtn.on('click', function(){
            var _This = $(this),
                partnerKind = _This.data('kind');

            that._$partnerHiddenInput .val(partnerKind);
            that._$searchForm.attr('onsubmit', 'return true').submit();
        });

        that._$progressStatus.on('change', function (){
            that._$searchForm.attr('onsubmit', 'return true').submit();
        });

        that._$billStatus.on('change', function (){
            that._$searchForm.attr('onsubmit', 'return true').submit();
        });

        that._$inspectionStatus.on('change', function (){
            that._$searchForm.attr('onsubmit', 'return true').submit();
        });

        that._$insureStatus.on('change', function (){
            that._$searchForm.attr('onsubmit', 'return true').submit();
        });

        /*********************************************************************
         * 상태변경 미니팝업 닫기
         ********************************************************************/
        $('body').on('click', function(e) { // 상태변경 미니팝업 닫기
            if($(e.target).hasClass('status-change')){
                var existPop = $(e.target).parent().find('.status-mini-pop');
                $('.status-mini-pop').not($(existPop)).hide();
            }else if(!$(e.target).hasClass('status-mini-li')){
                $('.status-mini-pop').hide();
            }
        });
    }

    DeviceListView.prototype.$ = function () {
        return this.$el.find.apply(this.$el, arguments);
    };

    //private
    function toggleActon(id) {
        $("#" + id).toggle();
    }

    function bindEvents() {
        var that = this;
        var micareDomain = this._$micareDomain;

        that._$statusChangeA.on('click', function (event){
            event.stopPropagation();
            event.preventDefault();
            var _This = $(this),
                thisParentTd = _This.parent(),
                seq = _This.data('seq'),
                payMethod = _This.data('payMethod'),
                billPaySeq = _This.data('billPaySeq'),
                statusCanBe = {},
                statusCanBeList = '<ul>';

            if(thisParentTd.find('.status-mini-pop').length > 0){
                $('.status-mini-pop').show();
            }else{
                //개시전취소
                statusCanBeList += '<li class="status-mini-li" data-willbe="BE">환불</li>'
                //중도해지
                statusCanBeList += '<li class="status-mini-li" data-willbe="BG">해지</li>'

                thisParentTd.append('<div class="status-mini-pop">' + statusCanBeList + '</ul></div>');
            }
        });

        this.$('.student').each(function () {
            var data1 = $(this).attr("data1")
            $(this).bind('click', function () {
                toggleActon(data1);
            });
        });

        this.$('.show-micare-photo').each(function () {
            var _this = $(this)
            var uid = _this.data('uid');
            var id = _this.data('id');
            var fileType = _this.data('type');
            var from = _this.data('from'); // 페이지

            _this.bind('click', function () {
                if (!id) {
                    commonJS.alertPop('등록된 사진이 없습니다');
                    return;
                }

                $.ajax({
                    type: 'GET',
                    url: '/micare/file/read/' + uid + '/' + fileType,
                    contentType: 'application/json',
                    dataType: 'text'
                }).done(function (res) {
                    miDesignPop.alert({
                        dTarget: 'show-micare-photo',
                        dTitle: '사진',
                        dCloseX: true,
                        dCopyAlign: 't-a-c',
                        dCopy: '<div class="showing-img-box"></div>',
                    });

                    $('.showing-img-box').css('background-image', 'url(data:image/*;base64,' + res + ')').attr('data-from', 'db');
                }).fail(function (res) {
                    var resTextToJson = JSON.parse(res.responseText);
                    commonJS.alertPop(resTextToJson.error.message, function () {
                        if (resTextToJson.error.code == commonJS.sessErrorCode) {
                            location.href = '/';
                        }
                    });
                });
            });
        });

        //검수 실패 사진
        this.$('.show-micare-reject').each(function () {
            var _this = $(this)
            var uid = _this.data('uid');
            var id = _this.data('id');
            var fileType = _this.data('type');
            var from = _this.data('from'); // 페이지

            _this.bind('click', function () {
                if (!id) {
                    commonJS.alertPop('등록된 사진이 없습니다');
                    return;
                }

                $.ajax({
                    type: 'GET',
                    url: '/micare/file/reject/' + id,
                    contentType: 'application/json',
                    dataType: 'text'
                }).done(function (res) {
                    miDesignPop.alert({
                        dTarget: 'show-micare-reject',
                        dTitle: '사진',
                        dCloseX: true,
                        dCopyAlign: 't-a-c',
                        dCopy: '<div class="showing-img-box"></div>',
                    });

                    $('.showing-img-box').css('background-image', 'url(data:image/*;base64,' + res + ')').attr('data-from', 'db');
                }).fail(function (res) {
                    var resTextToJson = JSON.parse(res.responseText);
                    commonJS.alertPop(resTextToJson.error.message, function () {
                        if (resTextToJson.error.code == commonJS.sessErrorCode) {
                            location.href = '/';
                        }
                    });
                });
            });
        });
    }

    function reset(){
        var that = this;
        that._$txtKeyfield.val('');
        that._$progressStatus.val('');
        that._$billStatus.val('');
        that._$inspectionStatus.val('');
        that._$insureStatus.val('');
        that._$optionSelect.val('phone');
        var defaultDate = that._$miDatepicker.data('default');
        miDatepicker.val(defaultDate);
        $('input[name="dateSelect"]').each(function(item) {
            if($(this).val() == 3){
                $(this).prop('checked', true);
            }
        });
    }

    this.DeviceListView = DeviceListView;
})(jQuery);
