var searchForm = $('#searchForm'), // 검색폼
    excelBtn = $('#excelBtn'), // 엑셀 다운로드 버튼
    searchBtnPartner = $('#searchBtnPartner'); // 파트너사 검색 버튼

// 공통 변수
var age = '', // 나이
    infoSeq = '', // seq
    setDate = '', // 일자
    insuNum = '',
    insuAmount = '',
    changeInsu = '';


// 비즈톡 오브젝트
var bizTalkObj = {
    seq: '',
    userName: '',
    state: '',
    company: '',
    cancelContents: ''
}

$(function() {
    var serviceMenuOpen = $('.service-set-menu > .hover-student');

    // partner 지정날짜 검색 데이터 바인딩용
    $('#searchOneDay').append(setOneDay())

    // 서비스 설정 over 했을 시 나타날 이벤트
    serviceMenuOpen
        .mouseenter(function () {
            $(this).addClass("active").find('.driver-service-student').css('display', 'flex');
        })
        .mouseleave(function () {
            $('.driver-service-student').mouseleave(function () {
                serviceMenuOpen.removeClass("active").find('.driver-service-student').removeAttr('style');
            });
        });

    // th select sort
    $('.table-select-sort').on('click', function() {
        $(".ul-select-sort").remove();

        var selectDivLi;
        if ($(this).hasClass('takeover')) {
            selectDivLi =
                '<li><a href="javascript:void(0);">전체</a></li>' +
                '<li><a href="javascript:void(0);" class="point-color4">Y</a></li>' +
                '<li><a href="javascript:void(0);" class="point-color4">C/Y</a></li>' +
                '<li><a href="javascript:void(0);" class="point-color3">N</a></li>';
        } else if($(this).hasClass('guarantee')) {
            selectDivLi =
                '<li><a href="javascript:void(0);">전체</a></li>' +
                '<li><a href="javascript:void(0);" class="point-color4">Y</a></li>' +
                '<li><a href="javascript:void(0);" class="point-color3">N</a></li>';
        } else if($(this).hasClass('refundTarget')) {
            selectDivLi =
                '<li><a href="javascript:void(0);">전체</a></li>' +
                '<li><a href="javascript:void(0);" class="point-color4">Y</a></li>' +
                '<li><a href="javascript:void(0);" class="point-color3">N</a></li>';
        }

        var selectDiv =
            '<ul class="ul-select-sort">' +
            selectDivLi +
            '</ul>';
        $(this).append(selectDiv);
    });
    $(document).on('click', function(e) {
        if(!$(e.target).hasClass('table-select-sort')) {
            $(".ul-select-sort").remove();
        }
    })

    // 세부 정보 열기
    var tr = $('.driver-table tbody > tr');

    tr.on('click', function(e) {
        return;
        var _This = $(this),
            code = _This.data('seq'),
            thisChildTr = $('#people_'+code), // 현재건의 childTr
            childTrs = $('.people'); // 전체의 childTr
        var userName = '';

        childTrs.remove();

        if(thisChildTr.length > 0){
            thisChildTr.show();
        } else {
            var infoTr =
                '<tr>' +
                '<td>1</td>' +
                '<td>2</td>' +
                '<td>3</td>' +
                '<td>4</td>' +
                '<td>5</td>' +
                '<td>6</td>' +
                '<td>7</td>' +
                '<td>8</td>' +
                '<td>9</td>' +
                '<td>10</td>' +
                '<td>11</td>' +
                '</tr>';

            var infoTable =
                '<tr id="people_'+code+'" class="people">' +
                '<td colspan="11">' +
                '<table class="table detail">' +
                '<thead>' +
                '<tr>' +
                '<th>서브1</th>' +
                '<th>서브2</th>' +
                '<th>서브3</th>' +
                '<th>서브4</th>' +
                '<th>서브5</th>' +
                '<th>서브6</th>' +
                '<th>서브7</th>' +
                '<th>서브8</th>' +
                '<th>서브9</th>' +
                '<th>서브10</th>' +
                '<th>서브11</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>' +
                infoTr +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>';
            // $(this).closest('tr').after(tempHtml);
            if(!$(e.target).closest('.prevent-bubble').length){
                _This.after(infoTable);
            }
        }
    });

    // 지원금 레이어팝업
    $(document).on('click', '.btn-support-pop', function() {
        var seq = $(this).data('seq');

        driverListAjax({
            methood: 'GET',
            url: '/api/driver/support-pop/' + seq,
            func: function(res) {
                var bodyData = "";
                res.data.bodyDatas.forEach(function(v, i) {
                    bodyData += '<tr><td>'
                        + v.month
                        + '</td>'
                        + '<td>'
                        + (v.acceptCount == '0' ? '-' : v.acceptCount + '명')
                        + '</td>'
                        + '<td>'
                        + (v.withdrawalCount == '0' ? '-' : v.withdrawalCount + '명')
                        + '</td>'
                        + '<td>'
                        + (v.finalCount == '0' ? '-' : v.finalCount + '명')
                        + '</td>'
                        + '<td>'
                        + (v.supportAmt == '0' ? '-' : setComma(v.supportAmt) + '원')
                        + '</td>'
                        + '<td>'
                        + v.incomeDate
                        + '</td></tr>'
                });

                var supportPop = '<div class="pop-table">'
                    + '<div style="padding: 0 40px;">' // container start

                    + '<div style="margin-bottom: 10px;">' // header container start
                    + '<div style="display: flex;justify-content: space-between;border-bottom: 1px solid #bcbcbc;">'
                    + '<div><span style="font-weight: bold">' + res.data.headerDatas.name + '님</span> 지원금 현황</div>'
                    + '<div>총 ' + setComma(res.data.headerDatas.amt) + '원</div>'
                    + '</div>'
                    + '</div>' // header container end

                    + '<div class="support-student-box">' // body container start
                    + '<table style="text-align: center">'
                    + '<tr>'
                    + '<td></td>'
                    + '<td>청약</td>'
                    + '<td>철회</td>'
                    + '<td>최종</td>'
                    + '<td>지원금</td>'
                    + '<td>입금일</td>'
                    + '</tr>'
                    + bodyData
                    + '</table>'
                    + '</div>' // body container end

                    + '</div>' // container end
                    +'</div>';

                miDesignPop.alert({
                    dWidth : 750,
                    dCloseX : false, // 팝업 x 버튼
                    dTitleAlign : 'type1',
                    dCopy : supportPop, //카피
                    dTitle : '지원금 조회',
                });
            }
        });
    });

    // 담보 상세 보기 pop 변경
    $(document).on('click', '.btn-change-insurance-show', function() {
        clearValue();
        infoSeq = $(this).parent().parent().data('infoseq');
        age = $(this).parent().parent().data('age');

        // 없으면 안탐
        if (!infoSeq) {
            return;
        }
        // color 초기화
        for (var dk in defaultPriceList) {
            var d = defaultPriceList[dk];
            d.color = 'black';
        }
        driverListAjax({
            method: 'get',
            url: "/api/driver/info/dambo/" + infoSeq,
            func: function(result) {
                if (result.success === true) {
                    var tdObject = '';
                    var origin = result.data.origin;
                    var change = result.data.change;
                    for (var key in defaultPriceList) {
                        tdObject += '<td><span ';

                        var dd = defaultPriceList[key];

                        // 값 대조
                        var setPrice = '';
                        dd.price.forEach(function(v, i) {
                            if (v.minAge <= age && v.maxAge >= age) {
                                return setPrice = v.price;
                            }
                        });

                        // 변경 보험료가 존재할 때(afterEffectAmt)
                        if (key === 'damboAfterEffect') {
                            if (origin.grade == '3') {
                                setPrice = origin.afterEffectAmt;
                            }
                        }

                        // null 이면
                        if (change[key] === null) {
                            change[key] = setPrice;
                        }

                        if (change[key] !== setPrice) {
                            tdObject += ' style="color: red"';
                        }
                        // close span opener
                        tdObject += '>';
                        tdObject += setComma(change[key]);
                        tdObject += '만</span></td>';
                    }

                    // setComma(n)
                    var topAfterEffect = '',
                        afterEffect = '',
                        death = '',
                        support = '',
                        lawyer = '',
                        finePeople = '',
                        fineGoods = '',
                        injury = '',
                        cosmetic = '',
                        fracture = '',
                        fractureFive = '',
                        fractureDiagnosis = '',
                        fractureOperation = '';

                    defaultPriceList.damboTopAfterEffect.price.forEach(function(v, i) {
                        if (v.minAge <= age && v.maxAge >= age) {
                            return topAfterEffect = v.price;
                        }
                    });

                    defaultPriceList.damboAfterEffect.price.forEach(function(v, i) {
                        if (v.minAge <= age && v.maxAge >= age) {
                            if (origin.afterEffectAmt) {
                                return afterEffect = origin.afterEffectAmt;
                            }
                            return afterEffect = v.price;
                        }
                    });

                    defaultPriceList.damboDeath.price.forEach(function(v, i) {
                        if (v.minAge <= age && v.maxAge >= age) {
                            return death = v.price;
                        }
                    });

                    defaultPriceList.damboSupport.price.forEach(function(v, i) {
                        if (v.minAge <= age && v.maxAge >= age) {
                            return support = v.price;
                        }
                    });

                    defaultPriceList.damboLawyer.price.forEach(function(v, i) {
                        if (v.minAge <= age && v.maxAge >= age) {
                            return lawyer = v.price;
                        }
                    });

                    defaultPriceList.damboFinePeople.price.forEach(function(v, i) {
                        if (v.minAge <= age && v.maxAge >= age) {
                            return finePeople = v.price;
                        }
                    });

                    defaultPriceList.damboFineGoods.price.forEach(function(v, i) {
                        if (v.minAge <= age && v.maxAge >= age) {
                            return fineGoods = v.price;
                        }
                    });

                    defaultPriceList.damboInjury.price.forEach(function(v, i) {
                        if (v.minAge <= age && v.maxAge >= age) {
                            return injury = v.price;
                        }
                    });

                    defaultPriceList.damboCosmetic.price.forEach(function(v, i) {
                        if (v.minAge <= age && v.maxAge >= age) {
                            return cosmetic = v.price;
                        }
                    });

                    defaultPriceList.damboFracture.price.forEach(function(v, i) {
                        if (v.minAge <= age && v.maxAge >= age) {
                            return fracture = v.price;
                        }
                    });

                    defaultPriceList.damboFractureFive.price.forEach(function(v, i) {
                        if (v.minAge <= age && v.maxAge >= age) {
                            return fractureFive = v.price;
                        }
                    });

                    defaultPriceList.damboFractureOperation.price.forEach(function(v, i) {
                        if (v.minAge <= age && v.maxAge) {
                            return fractureOperation = v.price;
                        }
                    });

                    defaultPriceList.damboFractureDiagnosis.price.forEach(function(v, i) {
                        if (v.minAge <= age && v.maxAge) {
                            return fractureDiagnosis = v.price;
                        }
                    });

                    var collateralTableTrs =
                        '<tr>' +
                        '<td>청약</td>' +
                        '<td>' + setComma(topAfterEffect) + '만</td>' +
                        '<td>' + setComma(afterEffect) + '만</td>' +
                        '<td>' + setComma(death) + '만</td>' +
                        '<td>' + setComma(support) + '만</td>' +
                        '<td>' + setComma(lawyer) + '만</td>' +
                        '<td>' + setComma(finePeople) + '만</td>' +
                        '<td>' + setComma(fineGoods) + '만</td>' +
                        '<td>' + setComma(injury) + '만</td>' +
                        '<td>' + setComma(cosmetic) + '만</td>' +
                        '<td>' + setComma(fractureFive) + '만</td>' +
                        '<td>' + setComma(fractureDiagnosis) + '만</td>' +
                        '<td>' + setComma(fracture) + '만</td>' +
                        '<td>' + setComma(fractureOperation) + '만</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td>인수</td>' +
                        tdObject +
                        '</tr>';

                    var collateralTable =
                        '<table class="table detail collateralTable">' +
                        '<thead>' +
                        '<tr>' +
                        '<th></th>' +
                        '<th>고도후유장해</th>' +
                        '<th>후유장해(3~100%)</th>' +
                        '<th>사망</th>' +
                        '<th>형사합의금(동승자포함)</th>' +
                        '<th>변호사</th>' +
                        '<th>벌금(대인)</th>' +
                        '<th>벌금(대물)</th>' +
                        '<th>상해등급별 진단비</th>' +
                        '<th>성형치료</th>' +
                        '<th>5대 골절진단</th>' +
                        '<th>골절진단</th>' +
                        '<th>5대 골절수술</th>' +
                        '<th>골절수술</th>' +
                        '</tr>' +
                        '</thead>' +
                        '<tbody>' +
                        collateralTableTrs +
                        '</tbody>' +
                        '</table>';

                    miDesignPop.alert({
                        dWidth : 2400,
                        dCloseX : false, // 팝업 x 버튼
                        dTitleAlign : 'type1',
                        dCopy : collateralTable, //카피
                        dTitle : '변경담보 확인',
                        dButtonSetNum : 1,
                        dButtonSetText : [ "확인" ],
                    });

                }
            }
        })
    });

    // 담보변경 보기
    $(document).on('click', '.btn-change-collateral', function() {
        clearValue();
        infoSeq = $(this).parent().parent().data('infoseq');
        age = $(this).parent().parent().data('age');
        // color 초기화
        for (var key in defaultPriceList) {
            var d = defaultPriceList[key];
            d.color = 'black';
        }

        driverListAjax({
            method: "get",
            url: "/api/driver/info/dambo/" + infoSeq,
            func: function(result) {
                if (result.success === true) {
                    var origin = result.data.origin;
                    var change = result.data.change;
                    for (var key in change) {
                        if (change[key] === null) {
                            change[key] = '';
                        }

                        var dd = defaultPriceList[key];
                        if (typeof dd === 'object') {
                            dd.color = 'black';
                            var setPrice = '';
                            dd.price.forEach(function(v, i) {
                                if (v.minAge <= age && v.maxAge >= age) {
                                    if (key === 'damboAfterEffect') {
                                        if (origin.grade == '3') {
                                            return setPrice = origin.afterEffectAmt;
                                        }
                                    }
                                    return setPrice = v.price;
                                }
                            });
                            if (change[key] !== '' && (change[key] !== setPrice)) {
                                dd.color = 'red';
                            }
                        }
                    }

                    // setComma(n)
                    var topAfterEffect = '',
                        afterEffect = '',
                        death = '',
                        support = '',
                        lawyer = '',
                        finePeople = '',
                        fineGoods = '',
                        injury = '',
                        cosmetic = '',
                        fracture = '',
                        fractureFive = '',
                        fractureOperation = '',
                        fractureDiagnosis = '';

                    defaultPriceList.damboTopAfterEffect.price.forEach(function(v, i) {
                        if (v.minAge <= age && v.maxAge >= age) {
                            return topAfterEffect = v.price;
                        }
                    });

                    defaultPriceList.damboAfterEffect.price.forEach(function(v, i) {
                        if (v.minAge <= age && v.maxAge >= age) {
                            if (origin.afterEffectAmt) {
                                return afterEffect = origin.afterEffectAmt;
                            }
                            return afterEffect = v.price;
                        }
                    });

                    defaultPriceList.damboDeath.price.forEach(function(v, i) {
                        if (v.minAge <= age && v.maxAge >= age) {
                            return death = v.price;
                        }
                    });

                    defaultPriceList.damboSupport.price.forEach(function(v, i) {
                        if (v.minAge <= age && v.maxAge >= age) {
                            return support = v.price;
                        }
                    });

                    defaultPriceList.damboLawyer.price.forEach(function(v, i) {
                        if (v.minAge <= age && v.maxAge >= age) {
                            return lawyer = v.price;
                        }
                    });

                    defaultPriceList.damboFinePeople.price.forEach(function(v, i) {
                        if (v.minAge <= age && v.maxAge >= age) {
                            return finePeople = v.price;
                        }
                    });

                    defaultPriceList.damboFineGoods.price.forEach(function(v, i) {
                        if (v.minAge <= age && v.maxAge >= age) {
                            return fineGoods = v.price;
                        }
                    });

                    defaultPriceList.damboInjury.price.forEach(function(v, i) {
                        if (v.minAge <= age && v.maxAge >= age) {
                            return injury = v.price;
                        }
                    });

                    defaultPriceList.damboCosmetic.price.forEach(function(v, i) {
                        if (v.minAge <= age && v.maxAge >= age) {
                            return cosmetic = v.price;
                        }
                    });

                    defaultPriceList.damboFracture.price.forEach(function(v, i) {
                        if (v.minAge <= age && v.maxAge >= age) {
                            return fracture = v.price;
                        }
                    });

                    defaultPriceList.damboFractureFive.price.forEach(function(v, i) {
                        if (v.minAge <= age && v.maxAge >= age) {
                            return fractureFive = v.price;
                        }
                    });

                    defaultPriceList.damboFractureOperation.price.forEach(function(v, i) {
                        if (v.minAge <= age && v.maxAge >= age) {
                            return fractureOperation = v.price;
                        }
                    });

                    defaultPriceList.damboFractureDiagnosis.price.forEach(function(v, i) {
                        if (v.minAge <= age && v.maxAge >= age) {
                            return fractureDiagnosis = v.price;
                        }
                    });

                    var collateralTableTrs =
                        '<table class="table detail collateralTable">' +
                        '<thead>' +
                        '<tr>' +
                        '<th style="width: 120px"></th>' +
                        '<th>고도후유장해</th>' +
                        '<th>후유장해(3~100%)</th>' +
                        '<th>사망</th>' +
                        '<th>형사합의금(동승자포함)</th>' +
                        '<th>변호사</th>' +
                        '<th>벌금(대인)</th>' +
                        '<th>벌금(대물)</th>' +
                        '</tr>' +
                        '</thead>' +
                        '<tbody>' +
                        '<tr>' +
                        '<td>청약</td>' +
                        '<td>' + setComma(topAfterEffect) + '만</td>' +
                        '<td>' + setComma(afterEffect) + '만</td>' +
                        '<td>' + setComma(death) + '만</td>' +
                        '<td>' + setComma(support) + '만</td>' +
                        '<td>' + setComma(lawyer) + '만</td>' +
                        '<td>' + setComma(finePeople) + '만</td>' +
                        '<td>' + setComma(fineGoods) + '만</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td>인수</td>' +
                        '<td><input type="number" name="topAfterEffect" style="color:' + defaultPriceList.damboTopAfterEffect.color + '" placeholder="' + topAfterEffect + '" value="' + change.damboTopAfterEffect + '"/></td>' +
                        '<td><input type="number" name="afterEffect" style="color:' + defaultPriceList.damboAfterEffect.color + '" placeholder="' + afterEffect + '" value="' + change.damboAfterEffect + '"/></td>' +
                        '<td><input type="number" name="death" style="color:' + defaultPriceList.damboDeath.color + '" placeholder="' + death + '" value="' + change.damboDeath + '"/></td>' +
                        '<td><input type="number" name="support" style="color:' + defaultPriceList.damboSupport.color + '" placeholder="' + support + '" value="' + change.damboSupport + '"/></td>' +
                        '<td><input type="number" name="lawyer" style="color:' + defaultPriceList.damboLawyer.color + '" placeholder="' + lawyer + '" value="' + change.damboLawyer + '"></td>' +
                        '<td><input type="number" name="finePeople" style="color:' + defaultPriceList.damboFinePeople.color + '" placeholder="' + finePeople + '" value="' + change.damboFinePeople + '"></td>' +
                        '<td><input type="number" name="fineGoods" style="color:' + defaultPriceList.damboFineGoods.color + '" placeholder="' + fineGoods + '" value="' + change.damboFineGoods + '"></td>' +
                        '</tr>' +
                        '</tbody>' +
                        '</table>' +
                        '<table class="table detail collateralTable">' +
                        '<thead>' +
                        '<tr>' +
                        '<th style="width: 120px"></th>' +
                        '<th>상해등급별 진단비</th>' +
                        '<th>성형치료</th>' +
                        '<th>5대 골절진단</th>' +
                        '<th>골절진단</th>' +
                        '<th>5대 골절수슬</th>' +
                        '<th>골절수술</th>' +
                        '<th></th>' +
                        '</tr>' +
                        '</thead>' +
                        '<tbody>' +
                        '<tr>' +
                        '<td>청약</td>' +
                        '<td>' + setComma(injury) + '만</td>' +
                        '<td>' + setComma(cosmetic) + '만</td>' +
                        '<td>' + setComma(fractureFive) + '만</td>' +
                        '<td>' + setComma(fractureDiagnosis) + '만</td>' +
                        '<td>' + setComma(fracture) + '만</td>' +
                        '<td>' + setComma(fractureOperation) + '만</td>' +
                        '<td></td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td>인수</td>' +
                        '<td><input type="number" name="injury" style="color:' + defaultPriceList.damboInjury.color + '" placeholder="' + injury + '" value="' + change.damboInjury + '"></td>' +
                        '<td><input type="number" name="cosmetic" style="color:' + defaultPriceList.damboCosmetic.color + '" placeholder="' + cosmetic + '" value="' + change.damboCosmetic + '"></td>' +
                        '<td><input type="number" name="fractureFive" style="color:' + defaultPriceList.damboFractureFive.color + '" placeholder="' + fractureFive + '" value="' + change.damboFractureFive + '"></td>' +
                        '<td><input type="number" name="fractureDiagnosis" style="color:' + defaultPriceList.damboFractureDiagnosis.color + '" placeholder="' + fractureDiagnosis + '" value="' + change.damboFractureDiagnosis + '"></td>' +
                        '<td><input type="number" name="fracture" style="color:' + defaultPriceList.damboFracture.color + '" placeholder="' + fracture + '" value="' + change.damboFracture + '"></td>' +
                        '<td><input type="number" name="fractureOperation" style="color:' + defaultPriceList.damboFractureOperation.color + '" placeholder="' + fractureOperation + '" value="' + change.damboFractureOperation + '"></td>' +
                        '<td></td>' +
                        '</tr>' +
                        '</tbody>' +
                        '</table>';
                    miDesignPop.alert({
                        dWidth : 2400,
                        dCloseX : false, // 팝업 x 버튼
                        dTitleAlign : 'type1',
                        dCopy : collateralTableTrs, //카피
                        dTitle : '변경인수 입력',
                        dYesAc : function(){// .yes-bt-ac 콜백
                            var priceList = {
                                death: $('input[name=death]').val(),
                                topAfterEffect: $('input[name=topAfterEffect]').val(),
                                afterEffect: $('input[name=afterEffect]').val(),
                                finePeople: $('input[name=finePeople]').val(),
                                fineGoods: $('input[name=fineGoods]').val(),
                                lawyer: $('input[name=lawyer]').val(),
                                support: $('input[name=support]').val(),
                                injury: $('input[name=injury]').val(),
                                cosmetic: $('input[name=cosmetic]').val(),
                                fracture: $('input[name=fracture]').val(),
                                fractureFive: $('input[name=fractureFive]').val(),
                                fractureDiagnosis: $('input[name=fractureDiagnosis]').val(),
                                fractureOperation: $('input[name=fractureOperation]').val()
                            };

                            for (var key in priceList) {
                                if (priceList[key] !== '') {
                                    priceList[key] = parseInt(priceList[key]);
                                    if (priceList[key] === 'NaN') {
                                        priceList[key] = null;
                                    }
                                } else {
                                    priceList[key] = null;
                                }
                            }

                            driverListAjax({
                                method: 'post',
                                url: '/api/driver/info/apply/permit/' + infoSeq,
                                data: {
                                    priceList: priceList
                                },
                                func: function(result) {
                                    if (result.success === true) {
                                        location.reload();
                                    }
                                    console.log(result);
                                }
                            })


                        },
                        dButtonSetNum : 2,
                        dButtonSetText : [ "저장", "취소" ],
                    });
                }
            }

        })
    });

    // 담보 수정 보기
    $(document).on('click', '.btn-show-collateral', function() {
        clearValue();
        var _This = $(this);
        infoSeq = $(this).parent().parent().data('infoseq');
        age = $(this).parent().parent().data('age');
        // 현재 떠있는 모든 녀석 일단 제거
        $('.collateralTable').remove();

        // 없으면 안탐
        if (!infoSeq) {
            return;
        }
        // color 초기화
        for (var dk in defaultPriceList) {
            var d = defaultPriceList[dk];
            d.color = 'black';
        }
        driverListAjax({
            method: 'get',
            url: "/api/driver/info/dambo/" + infoSeq,
            func: function(result) {
                if (result.success === true) {
                    var tdObject = '';
                    var origin = result.data.origin;
                    var change = result.data.change;
                    for (var key in defaultPriceList) {
                        tdObject += '<td><span ';

                        var dd = defaultPriceList[key];

                        // 값 대조
                        var setPrice = '';
                        dd.price.forEach(function(v, i) {
                            if (v.minAge <= age && v.maxAge >= age) {
                                return setPrice = v.price;
                            }
                        });

                        // 변경 보험료가 존재할 때(afterEffectAmt)
                        if (key === 'damboAfterEffect') {
                            if (origin.grade == '3') {
                                setPrice = origin.afterEffectAmt;
                            }
                        }

                        // null 이면
                        if (change[key] === null) {
                            change[key] = setPrice;
                        }

                        if (change[key] !== setPrice) {
                            tdObject += ' style="color: red"';
                        }
                        // close span opener
                        tdObject += '>';
                        tdObject += setComma(change[key]);
                        tdObject += '만</span></td>';
                    }

                    // setComma(n)
                    var topAfterEffect = '',
                        afterEffect = '',
                        death = '',
                        support = '',
                        lawyer = '',
                        finePeople = '',
                        fineGoods = '',
                        injury = '',
                        cosmetic = '',
                        fracture = '',
                        fractureFive = '',
                        fractureOperation = '',
                        fractureDiagnosis = '';

                    defaultPriceList.damboTopAfterEffect.price.forEach(function(v, i) {
                        if (v.minAge <= age && v.maxAge >= age) {
                            return topAfterEffect = v.price;
                        }
                    });

                    defaultPriceList.damboAfterEffect.price.forEach(function(v, i) {
                        if (v.minAge <= age && v.maxAge >= age) {
                            if (origin.afterEffectAmt) {
                                return afterEffect = origin.afterEffectAmt;
                            }
                            return afterEffect = v.price;
                        }
                    });

                    defaultPriceList.damboDeath.price.forEach(function(v, i) {
                        if (v.minAge <= age && v.maxAge >= age) {
                            return death = v.price;
                        }
                    });

                    defaultPriceList.damboSupport.price.forEach(function(v, i) {
                        if (v.minAge <= age && v.maxAge >= age) {
                            return support = v.price;
                        }
                    });

                    defaultPriceList.damboLawyer.price.forEach(function(v, i) {
                        if (v.minAge <= age && v.maxAge >= age) {
                            return lawyer = v.price;
                        }
                    });

                    defaultPriceList.damboFinePeople.price.forEach(function(v, i) {
                        if (v.minAge <= age && v.maxAge >= age) {
                            return finePeople = v.price;
                        }
                    });

                    defaultPriceList.damboFineGoods.price.forEach(function(v, i) {
                        if (v.minAge <= age && v.maxAge >= age) {
                            return fineGoods = v.price;
                        }
                    });

                    defaultPriceList.damboInjury.price.forEach(function(v, i) {
                        if (v.minAge <= age && v.maxAge >= age) {
                            return injury = v.price;
                        }
                    });

                    defaultPriceList.damboCosmetic.price.forEach(function(v, i) {
                        if (v.minAge <= age && v.maxAge >= age) {
                            return cosmetic = v.price;
                        }
                    });

                    defaultPriceList.damboFracture.price.forEach(function(v, i) {
                        if (v.minAge <= age && v.maxAge >= age) {
                            return fracture = v.price;
                        }
                    });

                    defaultPriceList.damboFractureFive.price.forEach(function(v, i) {
                        if (v.minAge <= age && v.maxAge >= age) {
                            return fractureFive = v.price;
                        }
                    });

                    defaultPriceList.damboFractureOperation.price.forEach(function(v, i) {
                        if (v.minAge <= age && v.maxAge >= age) {
                            return fractureOperation = v.price;
                        }
                    });

                    defaultPriceList.damboFractureDiagnosis.price.forEach(function(v, i) {
                        if (v.minAge <= age && v.maxAge >= age) {
                            return fractureDiagnosis = v.price;
                        }
                    });

                    var collateralTableTrs =
                        '<tr>' +
                        '<td>청약</td>' +
                        '<td>' + setComma(topAfterEffect) + '만</td>' +
                        '<td>' + setComma(afterEffect) + '만</td>' +
                        '<td>' + setComma(death) + '만</td>' +
                        '<td>' + setComma(support) + '만</td>' +
                        '<td>' + setComma(lawyer) + '만</td>' +
                        '<td>' + setComma(finePeople) + '만</td>' +
                        '<td>' + setComma(fineGoods) + '만</td>' +
                        '<td>' + setComma(injury) + '만</td>' +
                        '<td>' + setComma(cosmetic) + '만</td>' +
                        '<td>' + setComma(fractureFive) + '만</td>' +
                        '<td>' + setComma(fractureDiagnosis) + '만</td>' +
                        '<td>' + setComma(fracture) + '만</td>' +
                        '<td>' + setComma(fractureOperation) + '만</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td>인수</td>' +
                        tdObject +
                        '</tr>';

                    var collateralTable =
                        '<table class="table detail collateralTable">' +
                        '<thead>' +
                        '<tr>' +
                        '<th></th>' +
                        '<th>고도후유장해</th>' +
                        '<th>후유장해(3~100%)</th>' +
                        '<th>사망</th>' +
                        '<th>형사합의금(동승자포함)</th>' +
                        '<th>변호사</th>' +
                        '<th>벌금(대인)</th>' +
                        '<th>벌금(대물)</th>' +
                        '<th>상해등급별 진단비</th>' +
                        '<th>성형치료</th>' +
                        '<th>5대 골절진단</th>' +
                        '<th>골절진단</th>' +
                        '<th>5대 골절수술</th>' +
                        '<th>골절수술</th>' +
                        '</tr>' +
                        '</thead>' +
                        '<tbody>' +
                        collateralTableTrs +
                        '</tbody>' +
                        '</table>';

                    _This.closest('table').after(collateralTable);
                }
            }
        })
    });

    // 코드조회 팝업
    $(document).on('click', '.btn-code-inquiry', function (e) {
        clearValue();
        infoSeq = $(this).parent().parent().data('infoseq');
        var userStep = $('#userStep'),
            miDatepicker = $('#miDatepicker'),
            option = $('#option'),
            btnSearch = $('input[name=btnSearch]'),
            txtKeyField = $('#txtKeyfield');

        userStep.val('');
        btnSearch.val('');
        $('select#searchOneDay option:eq(0)').prop("selected", true);
        miDatepicker.val(miDatepicker.data('default'));
        option.val('tel');
        txtKeyField.val('');
        $('input[name=useCouponParent]').val('0');
        $('input[name=useCouponChild]').val('0');

        var joinseq = $(this).data('joinseq');
        if (!joinseq) {
            joinseq = '0';
        }

        $('input[name=useCodeParent]').val(joinseq);

        var f = document.getElementById('searchForm');
        f.submit();
        return false;
    });

    $(document).on('click', '.btn-tests', function() {
        clearValue();
        infoSeq = $(this).parent().parent().data('infoseq');
        driverListAjax({
            method: 'get',
            url: '/api/driver/code/' + infoSeq,
            func: function(res) {
                var listItem = '';
                for (var idx in res.data.members) {
                    listItem += '<li>' + res.data.members[idx] + '</li>';
                }
                var html =
                    '<div class="pop-code-inquiry">' +
                    "<dl>" +
                    "<dt>" + res.data.code + "</dt>" +
                    "<dd>코드 유효기간 : " + res.data.closeAt +"까지</dd>" +
                    "</dl>" +
                    "<div>사용자(" + res.data.count + ")</div>" +
                    "<ul>" +
                    listItem +
                    "</ul>" +
                    "</div>";

                miDesignPop.alert({
                    dWidth : 355,
                    dCloseX : false, // 팝업 x 버튼
                    dTitleAlign : 'type1',
                    dCopy : html, //카피
                    dTitle : '코드조회',
                    dYesAc : function(){// .yes-bt-ac 콜백

                    }
                });
            }
        });
    });

    // 쿠폰 사용 조회
    $(document).on('click', '.btn-gift-student', function() {
        clearValue();
        infoSeq = $(this).parent().parent().data('infoseq');
        var userStep = $('#userStep'),
            miDatepicker = $('#miDatepicker'),
            option = $('#option'),
            btnSearch = $('input[name=btnSearch]'),
            txtKeyField = $('#txtKeyfield');

        userStep.val('');
        btnSearch.val('');
        $('select#searchOneDay option:eq(0)').prop("selected", true);
        miDatepicker.val(miDatepicker.data('default'));
        option.val('tel');
        txtKeyField.val('');
        $('input[name=useCodeParent]').val(0);
        $('input[name=useCodeChild]').val(0);

        var joinseq = $(this).data('joinseq');
        if (!joinseq) {
            joinseq = '0';
        }

        var selfseq = $(this).data('selfseq');
        if (!selfseq) {
            selfseq = '0';
        }

        $('input[name=useCouponParent]').val(0);
        $('input[name=useCouponChild]').val(selfseq);

        var f = document.getElementById('searchForm');
        f.submit();
        return false;
    });

    // 쿠폰 선물 조회
    $(document).on('click', '.btn-use-coupon', function() {
        clearValue();
        infoSeq = $(this).parent().parent().data('infoseq');
        var userStep = $('#userStep'),
            miDatepicker = $('#miDatepicker'),
            option = $('#option'),
            btnSearch = $('input[name=btnSearch]'),
            txtKeyField = $('#txtKeyfield');

        userStep.val('');
        btnSearch.val('');
        $('select#searchOneDay option:eq(0)').prop("selected", true);
        miDatepicker.val(miDatepicker.data('default'));
        option.val('tel');
        txtKeyField.val('');
        $('input[name=useCouponChild]').val(0);
        $('input[name=useCodeParent]').val(0);
        $('input[name=useCodeChild]').val(0);

        var joinseq = $(this).data('joinseq');
        if (!joinseq) {
            joinseq = '0';
        }

        $('input[name=useCouponParent]').val(joinseq);

        var f = document.getElementById('searchForm');
        f.submit();
        return false;
    });

    // 비고보기 팝업
    $(document).on('click', '.btn-remark-show', function (e) {
        var etSeq = $(this).parent().parent().data('code');
        driverListAjax({
            method: 'get',
            url: '/api/driver/history/' + etSeq,
            func: function(res) {
                if (res.data && res.data.length > 0) {
                    var setData = '';
                    res.data.forEach(function(v, i){
                        var actionType = '';
                        if (v.actionType) {
                            actionType = '(' + v.actionType + ')';
                        }
                        setData += '<tr>';
                        setData += '<td>' + v.viewRegDate + '</td>';
                        setData += '<td>' + v.actionUser + '</td>';
                        setData += '<td><div style="word-break: break-all">' + actionType + v.actionContent + '</div></td>';
                        setData += '</tr>';
                    });
                    var html =
                        '<div class="pop-remark-show">' +
                        '<table class="table detail non-border">' +
                        "<colgroup>" +
                        '<col width="25%" />' +
                        '<col width="20%" />' +
                        '<col width="55%" />' +
                        "</colgroup>" +
                        "<thead>" +
                        "<tr>" +
                        "<th>일시</th>" +
                        "<th>작업자</th>" +
                        "<th>내용</th>" +
                        "</tr>" +
                        "</thead>" +
                        "<tbody>" +
                        setData +
                        "</tbody>" +
                        "</table>" +
                        "</div>";

                    miDesignPop.alert({
                        dWidth : 1200,
                        dCloseX : false, // 팝업 x 버튼
                        dTitleAlign : 'type1',
                        dCopy : html, //카피
                        dTitle : '로그조회',
                        dYesAc : function(){// .yes-bt-ac 콜백

                        }
                    });
                }
            }
        });
    });

    // [보험사] 메모 작성 및 작성 메모 리스트
    $(document).on('click', '.btn-memo-show', function (e) {
        infoSeq = $(this).parent().parent().data('infoseq');
        var userName = $(this).parent().parent().find('.userName').text();

        driverListAjax({
            method: 'get',
            url: '/api/driver/memo/' + infoSeq,
            func: function(res) {
                var setData = '';

                if (res.data.length > 0) {
                    res.data.forEach(function(v, i){
                        setData += '<tr>';
                        setData += '<td>' + v.viewRegDate + '</td>';
                        setData += '<td>' + v.viewAdminName + '</td>';
                        setData += '<td><div style="word-break: break-all">' + v.contents + '</div></td>';
                        setData += '</tr>';
                    });
                } else {
                    setData += '<tr><td></td><td></td><td></td></tr>';
                }

                var html =
                    '<div class="pop-memo-show">' +
                    '<table class="table detail non-border">' +
                    "<colgroup>" +
                    '<col width="25%" />' +
                    '<col width="20%" />' +
                    '<col width="55%" />' +
                    "</colgroup>" +
                    "<thead>" +
                    "<tr>" +
                    "<th>일시</th>" +
                    "<th>작업자</th>" +
                    "<th>내용</th>" +
                    "</tr>" +
                    "</thead>" +
                    "<tbody>" +
                    setData +
                    "</tbody>" +
                    "</table>" +
                    '<div class="memo-write-container">' +
                    '<div class="memo-write-box"><textarea id="contents" placeholder="최소 1자 이상 입력해주세요"></textarea></div>' +
                    '<div class="memo-save-box"><button type="submit" class="save active" id="saveMemoBtn">저장</button></div>' +
                    '</div>' +
                    "</div>";

                miDesignPop.alert({
                    dWidth : 1200,
                    dCloseX : false, // 팝업 x 버튼
                    dTitleAlign : 'type1',
                    dCopy : html, //카피
                    dTitle : userName + '님의 메모',
                    dYesAc : function(){// .yes-bt-ac 콜백

                    }
                });
            }
        });
    });

    $(document).on('click', '#saveMemoBtn', function() {
        var contents = $('textarea#contents').val();
        if (contents.length < 1) {
            alert('메모는 1자 이상 작성 바랍니다');
            return;
        }

        if (confirm("메모를 저장하시겠습니까?")) {
            driverListAjax({
                method: 'post',
                url: '/api/driver/memo',
                data: {
                    diSeq: infoSeq,
                    contents: contents
                },
                func: function(result) {
                    if (result.success === true) {
                        location.reload();
                    }
                    console.log(result);
                }
            })
        }
    });
    // 이메일 변경 팝업
    $(document).on('click', '.btn-email-change', function () {
        clearValue();
        var _That = $(this);
        infoSeq = $(this).parent().parent().data("infoseq");
        var html =
            '<div class="pop-email-change">' +
            '<div><input type="text" name="emailHeader"><span>@</span><input type="text" name="emailTail"></div>' +
            "<div><select>" +
            '<option value="직접입력">직접입력</option>' +
            '<option value="naver.com">naver.com</option>' +
            '<option value="daum.net">daum.net</option>' +
            '<option value="hanmail.net">hanmail.net</option>' +
            '<option value="gmail.com">gmail.com</option>' +
            '<option value="nate.com">nate.com</option>' +
            "</select></div>" +
            "</div>";

        miDesignPop.alert({
            dWidth : 355,
            dCloseX : false, // 팝업 x 버튼
            dTitleAlign : 'type1',
            dCopy : html, //카피
            dTitle : '이메일 변경',
            dYesAc : function(){// .yes-bt-ac 콜백
                var email = $('input[name=emailHeader]').val() + '@' + $('input[name=emailTail]').val();
                driverListAjax({
                    method: "post",
                    url: "/api/driver/info/email/" + infoSeq,
                    data: {"email": email},
                    func: function(result) {
                        if (result.success === true) {
                            _That.text(email);
                        }
                    }
                });
            },
            dButtonSetNum: 2,
            dButtonSetText : [ "저장", "취소" ],
        });
    });

    //상담 템플릿 팝업
    $(document).on('click', '.btn-template-consult', function () {
        var _This = $(this);
        var seq = _This.parent().parent().data('seq');

        var userName = $('.main-table tbody').find('[data-seq="' + seq + '"]').find('.userName').text();

        ajaxCall({
            method: 'get',
            uri: '/consulting/voc/' + seq,
            func: function (res) {
                var vocPop = '<div class="voc-pop-box pop-table">'
                    +'<table>'
                    +'<tr>'
                    +'<td colspan=2><b>' + userName + '</b>님의 상담내역</td>'
                    +'</tr>'
                    +'<tr>'
                    +'<td>구분</td>'
                    +'<td>'
                    +'<input type="radio" name="voc_type" class="voc-type" id="vocCancle" value="1">'
                    +'<label class="mi-input-label" for="vocCancle">코드</label>'
                    +'<input type="radio" name="voc_type" class="voc-type" id="vocReward" value="2">'
                    +'<label class="mi-input-label" for="vocReward">일반/이용안내</label>'
                    +'<input type="radio" name="voc_type" class="voc-type" id="vocNormal" value="3">'
                    +'<label class="mi-input-label" for="vocNormal">결제</label>'
                    +'<input type="radio" name="voc_type" class="voc-type" id="vocPay" value="4">'
                    +'<label class="mi-input-label" for="vocPay">인수</label>'
                    +'<input type="radio" name="voc_type" class="voc-type" id="vocEtc" value="5">'
                    +'<label class="mi-input-label" for="vocEtc">기타</label>'
                    +'</td>'
                    +'</tr>'

                    +'</table>'

                    +'<div>'
                    +'<textarea id="vocContent"></textarea>'
                    +'</div>'

                    +'<div class="bt-wrap pop-info">'
                    +'<ul>'
                    + '<li class="w-2"><button type="button" class="no-bt no-bt-ac">취소</button></li>'
                    + '<li class="w-2"><button type="button" class="yes-bt voc-save-bt" data-code="' + infoSeq + '">저장</button></li>'
                    +'</ul>'
                    +'</div>'

                    +'<div class="warning-box"></div>'

                    +'<div class="voc-list-box">'

                    +'<div class="voc-list">'
                    +'<div class="voc-info">'
                    +'<span>3. 블라블라</span>'
                    +'</div>'
                    +'<div class="voc-content" style="word-break: break-all">체험2차문의</div>'
                    +'<div class="voc-time">21-03-01</div>'
                    + '</div>'

                    +'<div class="voc-list">'
                    +'<div class="voc-info">'
                    +'<span>2. 수강신청</span>'
                    +'</div>'
                    +'<div class="voc-content" style="word-break: break-all">토요수업문의</div>'
                    +'<div class="voc-time">21-02-24</div>'
                    + '</div>'

                    +'<div class="voc-list">'
                    +'<div class="voc-info">'
                    +'<span>1. 상담예정</span>'
                    +'</div>'
                    +'<div class="voc-content" style="word-break: break-all">유치원, 수관심은 높으나 집중시간이 짧아 몬테소리를 하고 싶음</div>'
                    +'<div class="voc-time">21-02-23</div>'
                    + '</div>'


                    +'</div>'

                    +'</div>';

                miDesignPop.alert({
                    dTarget: 'voc-pop',
                    dWidth: 600,
                    dCopy: vocPop,
                    dButtonSetNum: 0,
                    dButtonSet: '',
                    dCloseX: true,
                });
            }
        });

        $(document).off('click', '.voc-save-bt').on('click', '.voc-save-bt', function() { // 저장 버튼 클릭
            var _This = $(this),
                template = $('input[name=voc_type]:checked'),
                question = $('textarea#vocContent'),
                warningBox = $('.warning-box');

            warningBox.text('');
            // 상담 템플릿 미 선택 시
            if (!template.val()) {
                warningBox.text('상담 구분을 선택해 주세요');
                return;
            }

            // 상담 내용이 미작성
            if (question.val().trim() === '' || question.val().trim().length < 1) {
                warningBox.text('상담 내용을 적어주세요');
                return;
            }

            var data = {
                seq: infoSeq,
                template: parseInt(template.val()),
                content: question.val()
            };

            driverListAjax({
                method: 'post',
                url: '/api/driver/voc',
                data: data,
                func: function(result) {
                    if (result.success === true) {
                        var vocList = '';
                        var vocNumber = result.data.length;
                        result.data.forEach(function (v, i) {
                            vocNumber = vocNumber - i;
                            var vocType = '일반문의';
                            switch (v.template) {
                                case 1:
                                    vocType = '코드';
                                    break;
                                case 2:
                                    vocType = '일반/이용안내';
                                    break;
                                case 3:
                                    vocType = '결제';
                                    break;
                                case 4:
                                    vocType = '인수';
                                    break;
                                case 5:
                                    vocType = '기타';
                                    break;
                            }
                            vocList += '<div class="voc-student">' +
                                '<div class="voc-info">'
                                +'<span>' + vocNumber + '. ' + vocType + ', ' + v.user + '</span>'
                                // +'<button class="remove-student" data-idx="' + v.seq + '"></button>'
                                +'</div>'
                                +'<div class="voc-content" style="word-break: break-all">'+ v.question +'</div>'
                                +'<div class="voc-time">'+ v.regDate + '</div>'
                                + '</div>'
                        });
                        $('.voc-student-box').empty().append(vocList);
                        template.prop('checked', false);
                        question.val('');
                        var vocCount = parseInt($('.btn-template-consult').text());
                        $('.btn-template-consult').text(vocCount + 1);
                    }
                }
            });
        });
    });

    // 상담 템플릿 팝업 textarea
    $(document).on('keyup', '.pop-template-consult textarea', function() {
        var content = $(this).val();

        $(this).next('span').html(content.length + "/100");

        if(content.length >100) {
            $(this).val(content.substring(0,100));
            $(this).next('span').html("100/100");
        }
    })

    // 계좌정보 입력 팝업
    $(document).on('click', '.btn-account-information', function () {
        var _That = $(this);
        var bankName = $(this).previousSibling; // 은행
        var userName = $(this).parent().parent().data("username");
        var infoSeq = $(this).parent().parent().data("infoseq");
        var html =
            '<div class="pop-account-information">' +
            "<dl>" +
            "<dt><label>은행</label></dt>" +
            "<dd><select name='bankSelect'>" +
            '<option value="004" selected>국민은행</option>' +
            '<option value="020">우리은행</option>' +
            '<option value="088">신한은행</option>' +
            '<option value="011">농협은행</option>' +
            '<option value="081">하나은행</option>' +
            '<option value="003">기업은행</option>' +
            '<option value="023">SC은행</option>' +
            '<option value="027">한국씨티은행</option>' +
            '<option value="071">우체국</option>' +
            '<option value="032">부산은행</option>' +
            '<option value="031">대구은행</option>' +
            '<option value="039">경남은행</option>' +
            '<option value="037">전북은행</option>' +
            '<option value="034">광주은행</option>' +
            '<option value="035">제주은행</option>' +
            '<option value="045">새마을금고</option>' +
            '<option value="048">신협</option>' +
            '<option value="007">수협</option>' +
            "</select></dd>" +
            "<dt><label>계좌번호</label></dt>" +
            '<dd><input type="text" name="bankNumber" pattern="\\d*" minlength="9" maxlength="17" placeholder="\'-\' 없이 입력"/></dd>' +
            "</dl>" +
            "</div>";

        miDesignPop.alert({
            dWidth : 355,
            dCloseX : false, // 팝업 x 버튼
            dTitleAlign : 'type1',
            dCopy : html, //카피
            dTitle : '계좌정보 입력',
            dYesAc : function(){// .yes-bt-ac 콜백
                var bankCd = $('select[name=bankSelect]').val();
                var bankNm = $('select[name=bankSelect] option:checked').text();
                var bankAcc = $('input[name=bankNumber]').val();

                if (bankAcc.trim() === '') {
                    alert('계좌번호를 입력해 주세요');
                    return;
                }
                driverListAjax({
                    method: 'post',
                    url: '/api/driver/acc/' + infoSeq,
                    data: {
                        diSeq: infoSeq,
                        bankNm: bankNm,
                        bankAccount: bankAcc,
                        bankCd: bankCd,
                        accName: userName
                    },
                    func: function(res) {
                        if (res.success) {
                            _That.text('(' + bankAcc + ')');
                            _That.prev().text(bankNm);
                        }
                    }
                })
            },
            dButtonSetNum : 2,
        });
    });

    // 인수여부 선택 팝업
    $(document).on('click', '.btn-takeover-select', function() {
        infoSeq = $(this).parent().parent().data('infoseq');
        age = $(this).parent().parent().data('age');
        var html =
            '<div class="pop-takeover-select">' +
            '<ul>' +
            '<li><label><input type="radio" name="takeroverSelect" value="takeover-ok">일반인수</label></li>' +
            '<li><label><input type="radio" name="takeroverSelect" value="takeover-change">변경인수</label></li>' +
            '<li><label><input type="radio" name="takeroverSelect" value="takeover-no">인수거절</label></li>' +
            '</ul>' +
            "</div>";

        var insuPopBtn = '<ul>'+
            '<li class="w-2"><button type="button" class="no-bt no-bt-insu-cancel">취소</button></li>'+
            '<li class="w-2"><button type="button" class="yes-bt yes-bt-insu-save">저장</button></li>'+
            '</ul>';

        miDesignPop.alert({
            dWidth : 355,
            dCloseX : false, // 팝업 x 버튼
            dTitleAlign : 'type1',
            dCopy : html, //카피
            dTitle : '인수여부 선택',
            dButtonSet: insuPopBtn,
            dYesAc : function(){// .yes-bt-ac 콜백

            },
            dButtonSetNum : 2,
            dButtonSetText : [ "저장", "취소" ],
        });
    });

    // 인수여부 선택 팝업 - 인수거절일때
    $(document).on('change', '.pop-takeover-select input[name="takeroverSelect"]', function() {
        $(this).closest('.pop-takeover-select').find('.takeover-reason').remove();
        $(this).closest('.pop-takeover-select').find('.insu-container').remove();
        if($(this).val() === 'takeover-no') {
            var takerOverReasonNo =
                '<div class="takeover-reason">' +
                '<textarea id="rejectReasonTxt" placeholder="상세사유입력 (100자내외)"></textarea>' +
                '</div>';
            $(this).closest('ul').after(takerOverReasonNo);
        } else if($(this).val() === 'takeover-ok') {
            var takerOverReasonOk =
                '<div class="insu-container">' +
                '<table>'
                + '<tr>'
                + '<td class="td-align-right">승환계약 여부</td><td class="td-align-left"><input type="checkbox" name="changeInsurance" value="Y" /></td>'
                + '</tr>'
                + '<tr>'
                + '<td class="td-align-right">증권번호</td><td class="td-align-left"><input type="text" placeholder="입력" name="insuNum" /></td>'
                + '</tr>'
                + '<tr>'
                + '<td class="td-align-right">개시일</td><td class="td-align-left">' + setInsuData() + '</td>'
                + '</tr>'
                + '</table>'
                + '</div>';
            $(this).closest('ul').after(takerOverReasonOk);
        } else if ($(this).val() === 'takeover-change') {
            var takerOverReasonChange =
                '<div class="insu-container">' +
                '<table>'
                + '<tr>'
                + '<td class="td-align-right">승환계약 여부</td><td class="td-align-left"><input type="checkbox" name="changeInsurance" value="Y" /></td>'
                + '</tr>'
                + '<tr>'
                + '<td class="td-align-right">증권번호</td><td class="td-align-left"><input type="text" placeholder="입력" name="insuNum" /></td>'
                + '</tr>'
                + '<tr>'
                + '<td class="td-align-right">보험료</td><td class="td-align-left"><input type="number" name="insuAmount" /></td>'
                + '</tr>'
                + '<tr>'
                + '<td class="td-align-right">개시일</td><td class="td-align-left">' + setInsuData() + '</td>'
                + '</tr>'
                + '</table>'
                + '</div>';
            $(this).closest('ul').after(takerOverReasonChange);
        }
    });

    // 인수거절 사유 상세 팝업
    $(document).on('click', '.btn-takeoverno-reason', function() {
        var infoseq = $(this).parent().parent().data('infoseq');
        driverListAjax({
            method: 'get',
            url: '/api/driver/info/reject/' + infoseq,
            func: function(result) {
                if (result.success === true) {
                    var viewReason = '';

                    switch (result.data.num) {
                        case '1':
                            viewReason = '단순변심 ';
                            break;
                        case '2':
                            viewReason = '인수지침위배 ';
                            break;
                        case '3':
                            viewReason = '통화부재 ';
                            break;
                        case '4':
                            viewReason = '타사가입(여러 보험 비교 목적) ';
                            break;
                    }
                    var html =
                        '<div class="pop-takeover-select">' +
                        '<ul class="disable">' +
                        '<li><label><input type="radio" name="takeroverSelect" value="takeover-ok" disabled>인수</label></li>' +
                        '<li><label><input type="radio" name="takeroverSelect" value="takeover-change" disabled>변경인수</label></li>' +
                        '<li><label><input type="radio" name="takeroverSelect" value="takeover-no" checked>인수거절</label></li>' +
                        '</ul>' +
                        '<div class="takeover-reason">' +
                        // '<select id="rejectOptions">' +
                        // '<option ' + (result.data.num === "1" ? ' selected ' : '') + ' value="1">1. 단순변심</option>' +
                        // '<option ' + (result.data.num === "2" ? ' selected ' : '') + ' value="2">2. 인수지침위배</option>' +
                        // '<option ' + (result.data.num === "3" ? ' selected ' : '') + ' value="3">3. 통화부재</option>' +
                        // '<option ' + (result.data.num === "4" ? ' selected ' : '') + ' value="4">4. 타사가입(여러 보험 비교 목적)</option>' +
                        // '</select>' +
                        '<textarea id="rejectReasonTxt" placeholder="상세사유입력 (100자내외)">' + (viewReason + result.data.reason) + '</textarea>' + '</div>' +
                        '</div>';
                    miDesignPop.alert({
                        dWidth : 355,
                        dCloseX : false, // 팝업 x 버튼
                        dTitleAlign : 'type1',
                        dCopy : html, //카피
                        dTitle : '인수거절사유 상세보기',
                        dYesAc : function(){// .yes-bt-ac 콜백
                            var rejectReasonTxt = $('textarea#rejectReasonTxt').val();

                            if (rejectReasonTxt.length < 10) {
                                alert('거절 사유는 최소 10자 이상 적어주시기 바랍니다');
                                return;
                            }
                            var obj = {"reason": rejectReasonTxt};


                            driverListAjax({
                                method: "post",
                                url: "/api/driver/info/apply/reject/" + infoseq,
                                data: obj,
                                func: function(result) {
                                    if (result.success === true) {
                                        location.reload();
                                    }
                                    console.log(result);
                                }
                            });
                        },
                        dButtonSetNum : 2,
                        dButtonSetText : [ "저장", "취소" ],
                    });
                }
            }
        });
    });

    // 보험 상태 변경 start
    $(document).on('click', '.btn-change-status', function() {
        var infoSeq = $(this).parent().parent().data('infoseq');
        var html = '<div class="pop-takeover-select">' +
            '<ul>' +
            '<li>'
            + '<label><input type="radio" name="insuranceState" value="00">정상</label>'
            + '</li>' +
            '<li>'
            + '<label><input type="radio" name="insuranceState" value="12">해지</label>'
            + '</li>' +
            '<li>'
            + '<label><input type="radio" name="insuranceState" value="77">실효</label>'
            + '</li>' +
            '<li>'
            + '<label><input type="radio" name="insuranceState" value="67">개시전 취소</label>'
            + '</li>' +
            '<li>'
            + '<label><input type="radio" name="insuranceState" value="66">청약철회</label>'
            + '</li>' +
            '</ul>' +
            "</div>";
        miDesignPop.alert({
            dWidth : 355,
            dCloseX : false, // 팝업 x 버튼
            dTitleAlign : 'type1',
            dCopy : html, //카피
            dTitle : '보험상태 변경',
            dYesAc : function(){// .yes-bt-ac 콜백
                var obj = new Object();
                var stateValue = $('input[name=insuranceState]:checked').val();
                obj.state = stateValue;
                if (stateValue !== '00') {
                    var insuYear = $('select[name=insuYear]').val();
                    var insuMonth =  $('select[name=insuMonth]').val();
                    insuMonth = insuMonth >= 10 ? insuMonth : '0' + insuMonth;
                    var insuDate = $('select[name=insuDay]').val();
                    insuDate = insuDate >= 10 ? insuDate : '0' + insuDate;

                    setDate = insuYear + '' + insuMonth + '' + insuDate;

                    obj.edate = setDate;
                }

                driverListAjax({
                    method: 'post',
                    url: '/api/driver/info/insurance_state/' + infoSeq,
                    data: obj,
                    func: function(result) {
                        if (result.success === true) {
                            location.reload();
                        }
                        console.log(result);
                    }
                })
            },
            dButtonSetNum : 2,
            dButtonSetText : [ "저장", "취소" ],
        });
    });

    $(document).on('click', 'input[name=insuranceState]', function() {
        // 기존에 열려있던 div 는 제거
        $('.setOpenAt').remove();

        if ($(this).val() !== "00") {
            var html ='<div class="setOpenAt">' + setInsuData() + '</div>';
            $(this).parent().parent().append(html);
        }
    });

    // 보험 상태 변경 end

    // type number 일 때 숫자가 아니면 필드 초기화
    $('input[type=number]').focusout(function() {
        if (isNaN($(this).val()) === true) {
            $(this).val('');
        }
    });

    // search btn event
    $(document).on('click', '.btn-go-search', function() {
        $('input[name=useCouponParent]').val(0);
        $('input[name=useCouponChild]').val(0);
        $('input[name=useCodeParent]').val(0);
        $('input[name=useCodeChild]').val(0);
        var searchVal = $(this).data('search');

        // var userStep = $('select[name=userStep]').val(); // 유저 트래킹
        // var txtDate = $('input[name=txtDate]').val(); // 기간검색
        // var option = $('select[name=option]').val(); // 옵션
        // var search = $('input[name=search]').val(); // 텍스트

        var f = document.getElementById('searchForm');

        if (searchVal === 'b' || searchVal === 'd' || searchVal === 'e' || searchVal === 'f') {
            f.userStep.value = '9';
        } else if (searchVal === 'a') {
            f.userStep.value = '';
        }

        f.btnSearch.value = searchVal;
        f.submit();
        return false;
    });

    // 환급완료 button action
    $(document).on('click', '.btn-go-refund', function() {
        var checkItems = $('input[name=listCheck]:checked');
        if (checkItems.length < 1) {
            miDesignPop.alert({
                dConHe: 110, // pop con height
                dCopy: '환급할 항목을 선택해 주세요',
                dTitle: '', // 타이틀
                dYesAc: function () {// .yes-bt-ac 콜백

                }
            });
            return false;
        }

        var checkItem = new Array();
        checkItems.each(function(n, i) {
            var dom = $(i);
            var isRefund = dom.parent().parent().find('td > .userIsResult').text();
            var okRefund = dom.parent().parent().find('td > .userRefundOkDay').text();
            if (okRefund.trim() === '-' || okRefund.trim() === '') {
                if (isRefund === 'Y') {
                    checkItem.push(parseInt(i.value));
                }
            }
        });

        if (checkItem.length < 1) {
            miDesignPop.alert({
                dConHe: 110, // pop con height
                dCopy: '환급가능한 대상이 없습니다',
                dTitle: '', // 타이틀
                dYesAc: function () {// .yes-bt-ac 콜백

                }
            });
            return false;
        }

        var firstName = $('.driver-table tbody').find('[data-infoseq="' + checkItem[0] + '"]').find('.userName').text();

        var data = {
            codes: checkItem,
            sendMethod: 'post'
        }

        var selectOptions = setCashBackDate();
        var html = '<div class="pop-cashback-select">'
            + '<ul>'
            + '<li style="text-align: left"><span style="font-size: 14px;margin-right:10px">환급일</span><label>' + selectOptions + '</label></li>'
            + '</ul>';

        // 지정 환급일 셋팅 default 오늘
        miDesignPop.alert({
            dWidth : 355,
            dCloseX : false, // 팝업 x 버튼
            dTitleAlign : 'type1',
            dCopy : html, //카피
            dTitle : '환급일 등록',
            dYesAc : function(){// .yes-bt-ac 콜백
                // 현재 연도
                var now = new Date();
                var nowYear = now.getFullYear();

                var cashMonth = $('select[name=cashMonth]').val();
                var sendCashMonth = cashMonth >= 10 ? cashMonth : '0' + cashMonth;

                var cashDay = $('select[name=cashDay]').val();
                var sendCashDay = cashDay >= 10 ? cashDay : '0' + cashDay;

                data.cashBackDate = nowYear + '-' + sendCashMonth + '-' + sendCashDay;

                driverListAjax({
                    method: 'post',
                    url: '/api/driver/cashback',
                    data: data,
                    func: function(res) {
                        if (res.success === false) {
                            console.log(res);
                            return;
                        }

                        var viewMsg = '';
                        if (checkItem.length -1 < 1) {
                            viewMsg = firstName + '님의 ';
                        } else {
                            viewMsg = firstName + ' 외 ' + (checkItem.length - 1) + '명의 ';
                        }
                        viewMsg += '환급일이 ' +cashMonth + '월 ' + cashDay + '일로 등록되었습니다';
                        miDesignPop.alert({
                            dConHe: 110, // pop con height
                            dCopy: viewMsg,
                            dTitle: '', // 타이틀
                            dYesAc: function () {// .yes-bt-ac 콜백
                                location.reload();
                            }
                        });
                    }
                });
            },
            dButtonSetNum : 2,
            dButtonSetText : [ "저장", "취소" ],
        });
    });

    // 환급일 변경 및 삭제
    $(document).on('click', '.btn-change-cashBackDate', function() {
        infoSeq = $(this).parent().parent().data('infoseq');
        var selectOptions = setCashBackDate();
        var html =
            '<div class="pop-cashBack-change">' +
            '<div><span>환급일</span>' + selectOptions + '</div>' +
            '<div><input type="checkbox" name="deleteCashBack" value="d" />환급일 삭제</div>' +
            '</div>';

        var insuPopBtn = '<ul>'+
            '<li class="w-2"><button type="button" class="no-bt no-bt-insu-cancel">취소</button></li>'+
            '<li class="w-2"><button type="button" class="yes-bt yes-bt-cashBack-save">저장</button></li>'+
            '</ul>';

        miDesignPop.alert({
            dWidth : 250,
            dCloseX : false, // 팝업 x 버튼
            dTitleAlign : 'type1',
            dCopy : html, //카피
            dTitle : '환급일 수정',
            dButtonSet: insuPopBtn,
            dYesAc : function(){// .yes-bt-ac 콜백
                // var email = $('input[name=emailHeader]').val() + '@' + $('input[name=emailTail]').val();
                // driverListAjax({
                //     method: "post",
                //     url: "/api/driver/info/email/" + infoSeq,
                //     data: {"email": email},
                //     func: function(result) {
                //         if (result.success === true) {
                //             _That.text(email);
                //         }
                //     }
                // });
            },
            dButtonSetNum: 2,
            dButtonSetText : [ "저장", "취소" ],
        });
    });

    // 환급일 변경 및 삭제 저장 버튼 눌렀을 때
    $(document).on('click', '.yes-bt-cashBack-save', function() {
        var data = new Object();
        data.codes = [infoSeq];
        // 현재 연도
        var now = new Date();
        var nowYear = now.getFullYear();

        var cashMonth = $('select[name=cashMonth]').val();
        var sendCashMonth = cashMonth >= 10 ? cashMonth : '0' + cashMonth;

        var cashDay = $('select[name=cashDay]').val();
        var sendCashDay = cashDay >= 10 ? cashDay : '0' + cashDay;

        var checkMethod = $('input[name=deleteCashBack]:checked');

        data.cashBackDate = nowYear + '-' + sendCashMonth + '-' + sendCashDay;

        // 삭제인지 아닌지
        data.sendMethod = 'post';
        if (checkMethod.val() === 'd') {
            data.sendMethod = 'delete';
        }

        var stepCheck = true;
        if (data.sendMethod === 'delete') {
            if(confirm('환급일 삭제를 하시겠습니까?')){
                // pass
            } else {
                stepCheck = false;
                // 팝업 제거
                // $('.mi-common-pop').remove();
                // $('html').removeClass('mi-scroll-none');
            }
        }

        if (stepCheck === true) {
            driverListAjax({
                method: 'post',
                url: '/api/driver/cashback',
                data: data,
                func: function(res) {
                    if (res.success === false) {
                        console.log(res);
                        return;
                    }
                    $('.mi-common-pop').remove();
                    $('html').removeClass('mi-scroll-none');

                    var firstName = $('.driver-table tbody').find('[data-infoseq="' + infoSeq + '"]').find('.userName').text();
                    var viewMsg = firstName + '님의 ';
                    if (data.sendMethod === 'delete') {
                        viewMsg += '환급일을 삭제하였습니다';
                    } else {
                        viewMsg += '환급일이 ' +cashMonth + '월 ' + cashDay + '일로 등록되었습니다';
                    }

                    miDesignPop.alert({
                        dConHe: 110, // pop con height
                        dCopy: viewMsg,
                        dTitle: '', // 타이틀
                        dYesAc: function () {// .yes-bt-ac 콜백
                            location.reload();
                        }
                    });
                }
            });
        }
    });

    // 지원금 입금완료 button action
    $(document).on('click', '.btn-go-supportAmt', function() {
        var checkItems = $('input[name=listCheck]:checked');
        if (checkItems.length < 1) {
            miDesignPop.alert({
                dConHe: 110, // pop con height
                dCopy: '입금할 항목을 선택해 주세요',
                dTitle: '', // 타이틀
                dYesAc: function () {// .yes-bt-ac 콜백

                }
            });
            return false;
        }

        var checkItem = new Array();
        checkItems.each(function(n, i) {
            var dom = $(i);
            var isSupportAmt = dom.parent().parent().find('td > .nowSupportAmt').text();
            if (isSupportAmt.trim() !== '-') { // 당월 금액이 없으면 패스
                checkItem.push(parseInt(i.value));
            }
        });

        if (checkItem.length < 1) {
            miDesignPop.alert({
                dConHe: 110, // pop con height
                dCopy: '입금가능한 대상이 없습니다',
                dTitle: '', // 타이틀
                dYesAc: function () {// .yes-bt-ac 콜백

                }
            });
            return false;
        }

        var firstName = $('.driver-table tbody').find('[data-code="' + checkItem[0] + '"]').find('.userName').text();

        var data = {
            gjSeq: checkItem,
            sendMethod: 'post'
        }

        var selectOptions = setCashBackDate();
        var html = '<div class="pop-cashback-select">'
            + '<ul>'
            + '<li style="text-align: left"><span style="font-size: 14px;margin-right:10px">입금일</span><label>' + selectOptions + '</label></li>'
            + '</ul>';

        // 지정 환급일 셋팅 default 오늘
        miDesignPop.alert({
            dWidth : 355,
            dCloseX : false, // 팝업 x 버튼
            dTitleAlign : 'type1',
            dCopy : html, //카피
            dTitle : '입금일 등록',
            dYesAc : function(){// .yes-bt-ac 콜백
                // 현재 연도
                var now = new Date();
                var nowYear = now.getFullYear();

                var cashMonth = $('select[name=cashMonth]').val();
                var sendCashMonth = cashMonth >= 10 ? cashMonth : '0' + cashMonth;

                var cashDay = $('select[name=cashDay]').val();
                var sendCashDay = cashDay >= 10 ? cashDay : '0' + cashDay;

                data.supportDate = nowYear + '-' + sendCashMonth + '-' + sendCashDay;

                driverListAjax({
                    method: 'post',
                    url: '/api/driver/save-support-amt',
                    data: data,
                    func: function(res) {
                        if (res.success === false) {
                            console.log(res);
                            return;
                        }
                        if (res.status === 500) {
                            miDesignPop.alert({
                                dConHe: 110, // pop con height
                                dCopy: '오류가 발생했습니다',
                                dTitle: '', // 타이틀
                                dYesAc: function () {// .yes-bt-ac 콜백
                                    // location.reload();
                                }
                            });
                            return;
                        }

                        var viewMsg = '';
                        if (checkItem.length -1 < 1) {
                            viewMsg = firstName + '님의 ';
                        } else {
                            viewMsg = firstName + ' 외 ' + (checkItem.length - 1) + '명의 ';
                        }
                        viewMsg += '입금일이 ' +cashMonth + '월 ' + cashDay + '일로 등록되었습니다';
                        miDesignPop.alert({
                            dConHe: 110, // pop con height
                            dCopy: viewMsg,
                            dTitle: '', // 타이틀
                            dYesAc: function () {// .yes-bt-ac 콜백
                                location.reload();
                            }
                        });
                    }
                });
            },
            dButtonSetNum : 2,
            dButtonSetText : [ "저장", "취소" ],
        });
    });

    // [보험사] 인수여부 선택
    $(document).on('click', '.yes-bt-insu-save', function() {
        var userName = $('.main-table tbody').find('[data-infoseq="' + infoSeq + '"]').find('.userName').text();
        var jobGrade = $('.main-table tbody').find('[data-infoseq="' + infoSeq + '"]').data('jobgrade');
        // 변경인수일때
        if($('.pop-takeover-select input[name="takeroverSelect"]:checked').val() === "takeover-change") {
            // obj 만들기
            insuNum = $('input[name=insuNum]');
            insuAmount = $('input[name=insuAmount]');
            if ($('input[name=changeInsurance]').is(':checked') === true) {
                changeInsu = 'Y';
            }

            var insuYear = $('select[name=insuYear]').val();
            var insuMonth =  $('select[name=insuMonth]').val();
            insuMonth = insuMonth >= 10 ? insuMonth : '0' + insuMonth;
            var insuDate = $('select[name=insuDay]').val();
            insuDate = insuDate >= 10 ? insuDate : '0' + insuDate;

            setDate = insuYear + '' + insuMonth + '' + insuDate;

            if ($.trim(insuNum.val()) === '') {
                alert('증권번호는 필수입니다');
                return;
            }

            if ($.trim(insuAmount.val()) === '') {
                alert('보험료는 필수입니다');
                return;
            }

            // 필수값 들어오면 팝업 제거
            $('.mi-common-pop').remove();

            // setComma(n)
            var topAfterEffect = '',
                afterEffect = '',
                death = '',
                support = '',
                lawyer = '',
                finePeople = '',
                fineGoods = '',
                injury = '',
                cosmetic = '',
                fracture = '',
                fractureFive = '',
                fractureOperation = '',
                fractureDiagnosis = '';

            defaultPriceList.damboTopAfterEffect.price.forEach(function(v, i) {
                if (v.minAge <= age && v.maxAge >= age) {
                    return topAfterEffect = v.price;
                }
            });

            defaultPriceList.damboAfterEffect.price.forEach(function(v, i) {
                if (v.minAge <= age && v.maxAge >= age) {
                    if (jobGrade === 3) {
                        return afterEffect = '5000';
                    }
                    return afterEffect = v.price;
                }
            });

            defaultPriceList.damboDeath.price.forEach(function(v, i) {
                if (v.minAge <= age && v.maxAge >= age) {
                    return death = v.price;
                }
            });

            defaultPriceList.damboSupport.price.forEach(function(v, i) {
                if (v.minAge <= age && v.maxAge >= age) {
                    return support = v.price;
                }
            });

            defaultPriceList.damboLawyer.price.forEach(function(v, i) {
                if (v.minAge <= age && v.maxAge >= age) {
                    return lawyer = v.price;
                }
            });

            defaultPriceList.damboFinePeople.price.forEach(function(v, i) {
                if (v.minAge <= age && v.maxAge >= age) {
                    return finePeople = v.price;
                }
            });

            defaultPriceList.damboFineGoods.price.forEach(function(v, i) {
                if (v.minAge <= age && v.maxAge >= age) {
                    return fineGoods = v.price;
                }
            });

            defaultPriceList.damboInjury.price.forEach(function(v, i) {
                if (v.minAge <= age && v.maxAge >= age) {
                    return injury = v.price;
                }
            });

            defaultPriceList.damboCosmetic.price.forEach(function(v, i) {
                if (v.minAge <= age && v.maxAge >= age) {
                    return cosmetic = v.price;
                }
            });

            defaultPriceList.damboFracture.price.forEach(function(v, i) {
                if (v.minAge <= age && v.maxAge >= age) {
                    return fracture = v.price;
                }
            });

            defaultPriceList.damboFractureFive.price.forEach(function(v, i) {
                if (v.minAge <= age && v.maxAge >= age) {
                    return fractureFive = v.price;
                }
            });

            defaultPriceList.damboFractureDiagnosis.price.forEach(function(v, i) {
                if (v.minAge <= age && v.maxAge >= age) {
                    return fractureDiagnosis = v.price;
                }
            });

            defaultPriceList.damboFractureOperation.price.forEach(function(v, i) {
                if (v.minAge <= age && v.maxAge >= age) {
                    return fractureOperation = v.price;
                }
            });

            var html2 =
                '<div class="pop-takeover-change">' +
                '<table class="table detail">' +
                '<thead>' +
                '<tr>' +
                '<th style="width:120px"></th>' +
                '<th>교통상해80%이상후유장해</th>' +
                '<th>교통상해후유장해(3~100%)</th>' +
                '<th>교통상해사망</th>' +
                '<th>교통사고처리지원금(동승자포함)</th>' +
                '<th>자동차사고변호사선임비용</th>' +
                '<th>운전자교통사고벌금(대인)</th>' +
                '<th>운전자교통사고벌금(대물)</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr>' +
                '<td>청약</td>' +
                '<td>' + setComma(topAfterEffect) + '만</td>' +
                '<td>' + setComma(afterEffect) + '만</td>' +
                '<td>' + setComma(death) + '만</td>' +
                '<td>' + setComma(support) + '만</td>' +
                '<td>' + setComma(lawyer) + '만</td>' +
                '<td>' + setComma(finePeople) + '만</td>' +
                '<td>' + setComma(fineGoods) + '만</td>' +
                '</tr>' +
                '<tr>' +
                '<td>인수</td>' +
                '<td><input type="number" name="topAfterEffect" placeholder="' + topAfterEffect + '"></td>' +
                '<td><input type="number" name="afterEffect" placeholder="' + afterEffect + '"></td>' +
                '<td><input type="number" name="death" placeholder="' + death + '"></td>' +
                '<td><input type="number" name="support" placeholder="' + support + '"></td>' +
                '<td><input type="number" name="lawyer" placeholder="' + lawyer + '"></td>' +
                '<td><input type="number" name="finePeople" placeholder="' + finePeople + '"></td>' +
                '<td><input type="number" name="fineGoods" placeholder="' + fineGoods + '"></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '<table class="table detail">' +
                '<thead>' +
                '<tr>' +
                '<th  style="width:120px"></th>' +
                '<th>자동차사고부상IV(1~4급)</th>' +
                '<th>교통사고성형치료비</th>' +
                '<th>5대골절진단비</th>' +
                '<th>골절진단비</th>' +
                '<th>5대골절수술비</th>' +
                '<th>골절수술비</th>' +
                '<th></th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr>' +
                '<td>청약</td>' +
                '<td>' + setComma(injury) + '만</td>' +
                '<td>' + setComma(cosmetic) + '만</td>' +
                '<td>' + setComma(fractureFive) + '만</td>' +
                '<td>' + setComma(fractureDiagnosis) + '만</td>' +
                '<td>' + setComma(fracture) + '만</td>' +
                '<td>' + setComma(fractureOperation) + '만</td>' +
                '<td></td>' +
                '</tr>' +
                '<tr>' +
                '<td>인수</td>' +

                '<td><input type="number" name="injury" placeholder="' + injury + '"></td>' +
                '<td><input type="number" name="cosmetic" placeholder="' + cosmetic + '"></td>' +
                '<td><input type="number" name="fractureFive" placeholder="' + fractureFive + '"></td>' +
                '<td><input type="number" name="fractureDiagnosis" placeholder="' + fractureDiagnosis + '"></td>' +
                '<td><input type="number" name="fracture" placeholder="' + fracture + '"></td>' +
                '<td><input type="number" name="fractureOperation" placeholder="' + fractureOperation + '"></td>' +
                '<td></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</div>';

            setTimeout(function() {
                var insuPopBtn = '<ul>'+
                    '<li class="w-2"><button type="button" class="no-bt no-bt-insu-cancel">취소</button></li>'+
                    '<li class="w-2"><button type="button" class="yes-bt yes-bt-change-save">저장</button></li>'+
                    '</ul>';
                miDesignPop.alert({
                    dWidth : 2400,
                    dCloseX : false, // 팝업 x 버튼
                    dTitleAlign : 'type1',
                    dCopy : html2, //카피
                    dTitle : '변경인수 입력',
                    dButtonSet: insuPopBtn,
                    dYesAc : function(){// .yes-bt-ac 콜백

                    },
                    dButtonSetNum : 2,
                    dButtonSetText : [ "저장", "취소" ],
                });
            }, 100);

        } else if ($('.pop-takeover-select input[name="takeroverSelect"]:checked').val() === "takeover-no") { // 인수 거절
            // var rejectOption = $('#rejectOptions').val();
            var rejectReasonTxt = $('textarea#rejectReasonTxt').val();
            if (rejectReasonTxt.length < 10) {
                alert('거절 사유는 최소 10자 이상 적어주시기 바랍니다');
                return;
            }
            var obj = {"reason": rejectReasonTxt};

            miDesignPop.alert({
                dCloseX : false, // 팝업 x 버튼
                dTarget : 'multi-pop1', // 타겟 설정 id 설정
                dTitleAlign : 'type1',
                dCopy : userName + '님의 심사결과를 인수거절로 처리하시겠습니까?', //카피
                dTitle : '변경인수 입력',
                dYesAc : function(){// .yes-bt-ac 콜백
                    driverListAjax({
                        method: "post",
                        url: "/api/driver/info/apply/reject/" + infoSeq,
                        data: obj,
                        func: function(result) {
                            if (result.success === true) {
                                bizTalkObj.state = "1";
                                bizTalkObj.company = '롯데고객센터,1588-3344';
                                bizTalkObj.seq = infoSeq;
                                bizTalkObj.userName = userName;
                                bizTalkObj.cancelContents = '인수거절';

                                // 팝업 제거
                                $('.mi-common-pop').remove();
                                miDesignPop.alert({
                                    dTarget : 'multi-pop2', // 타겟 설정 id 설정
                                    dCopy: userName + '님을 인수거절로 저장하였습니다<br>인수거절 알림톡을 발송하시겠습니까?',
                                    dYesAc: function() {
                                        driverListAjax({
                                            method: 'post',
                                            url: '/api/driver/send-biztalk/' + infoSeq,
                                            data: bizTalkObj,
                                            func: function(result) {
                                                if (result.success === true) {
                                                    miDesignPop.alert({
                                                        dCopy: userName + '님께 인수거절 알림톡을 발송하였습니다',
                                                        dYesAc: function() {
                                                            location.reload();
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                    },
                                    dNoAc: function() {
                                        location.reload();
                                    },
                                    dButtonSetNum : 2,
                                    dButtonSetText : [ "발송", "취소" ]
                                });
                            }
                            console.log(result);
                        }
                    });
                },
                dNoAc: function() {

                },
                dButtonSetNum : 2,
                dButtonSetText : [ "저장", "취소" ],
            });
        } else if ($('.pop-takeover-select input[name="takeroverSelect"]:checked').val() === "takeover-ok") { // 인수
            var changeInsurance = 'N';
            if ($('input[name=changeInsurance]').is(':checked') === true) {
                changeInsurance = 'Y';
            }
            insuNum = $('input[name=insuNum]');

            if ($.trim(insuNum.val()) === '') {
                alert('증권번호는 필수입니다.');
                return;
            }

            var insuYear = $('select[name=insuYear]').val();
            var insuMonth =  $('select[name=insuMonth]').val();
            insuMonth = insuMonth >= 10 ? insuMonth : '0' + insuMonth;
            var insuDate = $('select[name=insuDay]').val();
            insuDate = insuDate >= 10 ? insuDate : '0' + insuDate;

            setDate = insuYear + '' + insuMonth + '' + insuDate;

            var obj = {
                applyNum: insuNum.val(),
                openAt: setDate,
                changeInsurance: changeInsurance
            };

            driverListAjax({
                method: "post",
                url: "/api/driver/info/apply/permit/" + infoSeq,
                data: obj,
                func: function(result) {
                    if (result.success === true) {
                        location.reload();
                    }
                    console.log(result);
                }
            });
        }
    });

    // [보험사] 취소 버튼 공통 처리
    $(document).on('click', '.no-bt-insu-cancel', function() {
        // 팝업 제거
        $('.mi-common-pop').remove();
        $('html').removeClass('mi-scroll-none');
    });

    // [보험사] 인수 변경 저장
    $(document).on('click', '.yes-bt-change-save', function() {
        // 변경 인수 값 확인
        var priceList = {
            death: $('input[name=death]').val(),
            topAfterEffect: $('input[name=topAfterEffect]').val(),
            afterEffect: $('input[name=afterEffect]').val(),
            finePeople: $('input[name=finePeople]').val(),
            fineGoods: $('input[name=fineGoods]').val(),
            lawyer: $('input[name=lawyer]').val(),
            support: $('input[name=support]').val(),
            injury: $('input[name=injury]').val(),
            cosmetic: $('input[name=cosmetic]').val(),
            fracture: $('input[name=fracture]').val(),
            fractureFive: $('input[name=fractureFive]').val(),
            fractureOperation: $('input[name=fractureOperation]').val(),
            fractureDiagnosis: $('input[name=fractureDiagnosis]').val()
        };

        var setDamboPrice = false;

        for (var key in priceList) {
            if (priceList[key] !== '') {
                priceList[key] = parseInt(priceList[key]);
                if (priceList[key] === 'NaN') {
                    priceList[key] = null;
                }
            } else {
                priceList[key] = null;
            }

            if (priceList[key] || priceList[key] === 0) {
                setDamboPrice = true;
            }
        }

        if (setDamboPrice === false) {
            alert('하나의 담보라도 필수로 입력해야합니다');
            return;
        }

        driverListAjax({
            method: "post",
            url: "/api/driver/info/apply/permit/" + infoSeq,
            data: {
                applyNum: insuNum.val(),
                openAt: setDate,
                price: parseInt(insuAmount.val()),
                changeInsurance: changeInsu,
                priceList: priceList
            },
            func: function(result) {
                if (result.success === true) {
                    location.reload();
                }
                console.log(result);
            }
        });
    });

    // [보험사] 처라상태 변경
    $(document).on('click', '.btn-insurance-check', function() {
        var userName = $(this).parent().parent().find('.userName').text();
        var html = '<div><span>' + userName + '님 인수심사를 진행합니다</span></div>'
        infoSeq = $(this).parent().parent().data('infoseq');
        miDesignPop.alert({
            dWidth : 400,
            dCloseX : false, // 팝업 x 버튼
            dTitleAlign : 'type1',
            dCopy : html, //카피
            dYesAc : function(){// .yes-bt-ac 콜백
                driverListAjax({
                    method: 'post',
                    url: '/api/driver/check-state/' + infoSeq,
                    data: {
                        "state": "4"
                    },
                    func: function (result) {
                        if (result.success === true) {
                            location.reload()
                        }
                        console.log(result);
                    }
                })
            }
        });

    });

    // [보험사] 심사중 상세 상태 변경
    $(document).on('click', '.btn-check-student', function () {
        infoSeq = $(this).parent().parent().data('infoseq');
        var html =
            '<div class="pop-check-select">' +
            '<ul>' +
            '<li><label><input type="radio" name="checkSelect" value="insuWait">담보해지안내 후 대기</label></li>' +
            '<li><label><input type="radio" name="checkSelect" value="insuHold">부재중 보류</label></li>' +
            '<li><label><input type="radio" name="checkSelect" value="insuCancel">장기부재로 인한 취소</label></li>' +
            '<li><label><input type="radio" name="checkSelect" value="insuReject">고객취소요청</label></li>' +
            '<li><label><input type="radio" name="checkSelect" value="insuTest">테스트</label></li>' +
            '</ul>' +
            "</div>";

        var insuPopBtn = '<ul>'+
            '<li class="w-2"><button type="button" class="no-bt no-bt-insu-cancel">취소</button></li>'+
            '<li class="w-2"><button type="button" class="yes-bt yes-bt-check-save">저장</button></li>'+
            '</ul>';

        miDesignPop.alert({
            dWidth : 355,
            dCloseX : false, // 팝업 x 버튼
            dTitleAlign : 'type1',
            dCopy : html, //카피
            dTitle : '처리상태 선택',
            dButtonSet: insuPopBtn,
            dYesAc : function(){// .yes-bt-ac 콜백

            },
            dButtonSetNum : 2,
            dButtonSetText : [ "저장", "취소" ],
        });
    });

    // [보험사] 처리상태 상세 사유 textarea
    $(document).on('click', 'input[name=checkSelect]', function() {
        $(this).closest('.pop-check-select').find('.check-reason').remove();
        var checkValue = $(this).val();
        var checkReasonNo = '';
        if (checkValue === 'insuHold') {
            checkReasonNo += '<div class="check-reason">' +
                '<textarea id="checkReasonTxt" placeholder="상세사유입력 (100자내외)"></textarea>' +
                '</div>';
        } else if (checkValue === 'insuWait') {
            checkReasonNo += '<div class="check-reason">' +
                '<textarea id="checkReasonTxt" placeholder="상세사유입력 (100자내외)"></textarea>' +
                '</div>';
        }
        $(this).closest('ul').after(checkReasonNo);
    });

    // [보험사] 처리상태 저장 이벤트
    $(document).on('click', '.yes-bt-check-save', function() {
        var radioCheck = $('input[name=checkSelect]:checked').val();
        var checkReason = $('textarea#checkReasonTxt').val();
        if (!radioCheck) {
            alert('사유를 선택해 주세요');
            return;
        }

        if (radioCheck === 'insuHold' || radioCheck === 'insuWait') {
            if (!checkReason) {
                alert('상세사유를 입력해 주세요');
                return;
            }

            if (checkReason.length < 10) {
                alert('최소 10자 이상 입력해 주세요');
                return;
            }
        }

        var checkState = '';
        var bizTalkName = '';
        // status 로 값 변경
        switch (radioCheck) {
            case 'insuHold':
                checkState = '41';
                break;
            case 'insuWait':
                checkState = '42';
                bizTalkName = '담보해지 안내'
                break;
            case 'insuReject':
                checkState = '43';
                checkReason = null;
                bizTalkName = '고객요청으로 인한 청약취소';
                break;
            case 'insuCancel':
                checkState = '44';
                bizTalkName = '장기부재로 인한 청약취소';
                checkReason = null;
                break;
            case 'insuTest':
                checkState = '5';
                bizTalkName = '테스트';
                checkReason = null;
                break;
            default:
                return;
        }

        driverListAjax({
            method: 'post',
            url: '/api/driver/check-state/' + infoSeq,
            data: {
                "state": checkState,
                "applyReason": checkReason
            },
            func: function (result) {
                if (result.success === true) {
                    var userName = $('.main-table tbody').find('[data-infoseq="' + infoSeq + '"]').find('.userName').text();
                    // 알림톡 발송 state 분기
                    if (checkState === '42' || checkState === '43' || checkState === '44') {
                        // 기존 팝업 제거
                        $('.mi-common-pop').remove();
                        // $('html').removeClass('mi-scroll-none');
                        // 저장이 되고 알림톡 팝업 노출
                        // 안보내면 닫히고 reload 보내면 ajax 한번 더 태워서 reload
                        bizTalkObj.seq = infoSeq;
                        bizTalkObj.userName = userName;
                        bizTalkObj.state = checkState;

                        var insuPopBtn = '<ul>'+
                            '<li class="w-2"><button type="button" class="no-bt no-bt-biztalk-cancel">취소</button></li>'+
                            '<li class="w-2"><button type="button" class="yes-bt yes-bt-biztalk-save">저장</button></li>'+
                            '</ul>';
                        if (checkState === '43' || checkState === '44') {
                            bizTalkObj.cancelContents = (checkState === '43' ? '고객요청' : '장기부재');
                            insuPopBtn = '<ul>'+
                                '<li class="w-2"><button type="button" class="no-bt no-bt-biztalk-cancel">취소</button></li>'+
                                '<li class="w-2"><button type="button" class="yes-bt yes-bt-biztalk-send-save">발송</button></li>'+
                                '</ul>';
                        }

                        miDesignPop.alert({
                            dWidth : 355,
                            dCloseX : false, // 팝업 x 버튼
                            dTitleAlign : 'type1',
                            dCopy : userName + '님께 ' + bizTalkName + ' 알림톡을 발송하시겠습니까?', //카피
                            dTitle : '알림톡 발송 선택',
                            dButtonSet: insuPopBtn
                        });
                    } else {
                        location.reload();
                    }
                }
                console.log(result);
            }
        });
    });

    // 알림톡 발송 취소
    $(document).on('click', '.no-bt-biztalk-cancel', function() {
        location.reload();
    });

    // 알림톡 발송 yes
    $(document).on('click', '.yes-bt-biztalk-save', function() {
        // 기존 팝업 제거
        $('.mi-common-pop').remove();

        var insuPopBtn = '<ul>'+
            '<li class="w-2"><button type="button" class="no-bt no-bt-biztalk-cancel">취소</button></li>'+
            '<li class="w-2"><button type="button" class="yes-bt yes-bt-biztalk-send-save">발송</button></li>'+
            '</ul>';
        if (bizTalkObj.state === '42') {
            var html = '<div class="pop-takeover-select">' +
                '<div class="takeover-reason">' +
                '<select id="company">' +
                '<option value="삼성화재,1588-5114">삼성화재</option>' +
                '<option value="현대해상,1588-5656">현대해상</option>' +
                '<option value="DB손해보험,1588-0100">DB손해보험</option>' +
                '<option value="메리츠화재,1566-7711">메리츠화재</option>' +
                '<option value="흥국화재,1688-1688">흥국화재</option>' +
                '<option value="AIG손해보험,1544-2792">AIG손해보험</option>' +
                '<option value="KB손해보험,1544-0114">KB손해보험</option>' +
                '<option value="MG손해보험,1588-5959">MG손해보험</option>' +
                '<option value="NH농협손해보험,1644-9000">NH농협손해보험</option>' +
                '<option value="한화손해보험,1566-8000">한화손해보험</option>' +
                '<option value="캐롯손해보험,1566-0300">캐롯손해보험</option>' +
                '<option value="AXA손해보험,1566-1566">AXA손해보험</option>' +
                '<option value="하나손해보험,1566-3000">하나손해보험</option>' +
                '</select>' +
                '</div>';
            miDesignPop.alert({
                dWidth : 355,
                dCloseX : false, // 팝업 x 버튼
                dTitleAlign : 'type1',
                dCopy : html, //카피
                dTitle : '알림톡 발송 선택',
                dButtonSet: insuPopBtn
            });
        }
    });

    // 담보해지 안내 발송 저장
    $(document).on('click', '.yes-bt-biztalk-send-save', function() {
        var confirmMsg = '';
        if (bizTalkObj.state === '42') {
            bizTalkObj.company = $('select#company').val();
            var companyName = bizTalkObj.company.split(',');
            confirmMsg = bizTalkObj.userName + '님께 ' + companyName[0] + ' ' + bizTalkObj.cancelContents + ' 담보해지안내 알림톡을 발송하시겠습니까?';
        } else {
            // 기존 팝업 제거
            $('.mi-common-pop').remove();
            driverListAjax({
                method: 'post',
                url: '/api/driver/send-biztalk/' + bizTalkObj.seq,
                data: bizTalkObj,
                func: function(result) {
                    if (result.success === true) {
                        miDesignPop.alert({
                            dWidth : 355,
                            dCloseX : false, // 팝업 x 버튼
                            dTitleAlign : 'type1',
                            dCopy : bizTalkObj.userName + '님께 알림톡이 발송되었습니다', //카피
                            dTitle : '알림톡 발송',
                            dYesAc : function(){// .yes-bt-ac 콜백
                                location.reload();
                            },
                            dButtonSetNum : 1,
                            dButtonSetText : ["확인"],
                        });
                    }
                }
            });

            return;
        }
        // 기존 팝업 제거
        $('.mi-common-pop').remove();
        miDesignPop.alert({
            dWidth : 355,
            dCloseX : false, // 팝업 x 버튼
            dTitleAlign : 'type1',
            dCopy : confirmMsg, //카피
            dTitle : '알림톡 발송',
            dYesAc : function(){// .yes-bt-ac 콜백
                driverListAjax({
                    method: 'post',
                    url: '/api/driver/send-biztalk/' + bizTalkObj.seq,
                    data: bizTalkObj,
                    func: function(result) {
                        if (result.success === true) {
                            miDesignPop.alert({
                                dWidth : 355,
                                dCloseX : false, // 팝업 x 버튼
                                dTitleAlign : 'type1',
                                dCopy : bizTalkObj.userName + '님께 알림톡이 발송되었습니다', //카피
                                dTitle : '알림톡 발송',
                                dYesAc : function(){// .yes-bt-ac 콜백
                                    location.reload();
                                },
                                dButtonSetNum : 1,
                                dButtonSetText : ["확인"],
                            });
                        }
                    }
                });
            },
            dNoAc: function() {
                location.reload();
            },
            dButtonSetNum : 2,
            dButtonSetText : ["확인", "취소"],
        });
    });

    // [보험사] 41, 42 내용 상세
    $(document).on('click', '.btn-applyReason-check', function() {
        infoSeq = $(this).parent().parent().parent().data('infoseq');
        driverListAjax({
            method: "get",
            url: "/api/driver/apply-reason/" + infoSeq,
            func: function(result) {
                if (result.success === true) {
                    var viewReason = result.data.applyReason;
                    viewReason = viewReason.replace(/\n/g, '<br/>'); // 개행 문자를 br 태그로 교체
                    viewReason = viewReason.replace(/(<br>|<br\/>|<br \/>)/g, '&#10;'); // br 태그를 개행 코드로 대체
                    var html = '<div class="pop-check-select">' +
                        '<div class="check-reason">' +
                        '<textarea id="checkReasonTxt" placeholder="상세사유입력 (100자내외)">' + viewReason + '</textarea>' +
                        '</div></div>';

                    var insuPopBtn = '<ul>'+
                        '<li class="w-2"><button type="button" class="no-bt no-bt-insu-cancel">취소</button></li>'+
                        '<li class="w-2"><button type="button" class="yes-bt yes-bt-apply-reason-save">저장</button></li>'+
                        '</ul>';
                    miDesignPop.alert({
                        dWidth : 355,
                        dCloseX : false, // 팝업 x 버튼
                        dTitleAlign : 'type1',
                        dCopy : html, //카피
                        dTitle : '상태사유 상세보기',
                        dButtonSet: insuPopBtn,
                        dYesAc : function(){// .yes-bt-ac 콜백

                        },
                        dButtonSetNum : 2,
                        dButtonSetText : [ "저장", "취소" ],
                    });
                }
                console.log(result);
            }
        });
    });

    // [통합] 처리상태 상세 사유
    $(document).on('click', '.btn-applyReason-show', function() {
        infoSeq = $(this).parent().parent().parent().data('infoseq');
        driverListAjax({
            method: "get",
            url: "/api/driver/apply-reason/" + infoSeq,
            func: function(result) {
                if (result.success === true) {
                    var viewReason = result.data.applyReason;
                    viewReason = viewReason.replace(/\n/g, '<br/>'); // 개행 문자를 br 태그로 교체
                    viewReason = viewReason.replace(/(<br>|<br\/>|<br \/>)/g, '&#10;'); // br 태그를 개행 코드로 대체
                    var html = '<div class="pop-check-select">' +
                        '<div class="check-reason">' +
                        '<textarea id="checkReasonTxt" placeholder="상세사유입력 (100자내외)" readonly>' + viewReason + '</textarea>' +
                        '</div></div>';

                    miDesignPop.alert({
                        dWidth : 355,
                        dCloseX : false, // 팝업 x 버튼
                        dTitleAlign : 'type1',
                        dCopy : html, //카피
                        dTitle : '상태사유 상세보기',
                        dYesAc : function(){// .yes-bt-ac 콜백

                        }
                    });
                }
                console.log(result);
            }
        });
    });


    // [보험사] 처리상태 상세 사유 저장
    $(document).on('click', '.yes-bt-apply-reason-save', function() {
        var checkReason = $('textarea#checkReasonTxt').val();

        if (!checkReason) {
            alert('상세사유를 입력해 주세요');
            return;
        }

        if (checkReason.length < 10) {
            alert('최소 10자 이상 입력해 주세요');
            return;
        }

        driverListAjax({
            method: 'post',
            url: '/api/driver/check-state/' + infoSeq,
            data: {
                "applyReason": checkReason
            },
            func: function (result) {
                if (result.success === true) {
                    // 팝업 제거
                    $('.mi-common-pop').remove();
                    $('html').removeClass('mi-scroll-none');
                }
                console.log(result);
            }
        });
    });

    // [보험사] 알림톡 발송(no) 새로고침해버림
    $(document).on('click', '.no-bt-confirm-biztalk', function() {
        location.reload();
    });

    // 검색필드 텍스트 공백 제거
    $(document).on('focusout', '#txtKeyfield', function() {
        $(this).val($.trim($(this).val()));
    });

    // 새로고침
    $(document).on('click', '#refreshBtn', function() {
        location.reload();
    });
});


function driverListAjax(obj) {
    if (!obj.data) {
        $.ajax({
            method: obj.method,
            url: obj.url,
            contentType: "application/json",
            dataType: "json",
            async: obj.asyncValue ? obj.asyncValue : true,
            beforeSend: function(xhr) {
                xhr.setRequestHeader(commonJS.header, commonJS.token)
            },
            success: function(result) {
                if (obj.func) {
                    obj.func(result);
                } else {
                    return result;
                }
            }, error: function(error) {
                if (obj.func) {
                    obj.func(error.responseJSON);
                } else {
                    return error;
                }
            }
        });
    } else {
        var dataObj = JSON.stringify(obj.data);

        $.ajax({
            method: obj.method,
            url: obj.url,
            data: dataObj,
            contentType: "application/json",
            dataType: "json",
            async: obj.asyncValue ? obj.asyncValue : true,
            beforeSend: function(xhr) {
                xhr.setRequestHeader(commonJS.header, commonJS.token)
            },
            success: function(result) {
                if (obj.func) {
                    obj.func(result);
                } else {
                    return result;
                }
            }, error: function(error) {
                if (obj.func) {
                    obj.func(error.responseJSON);
                } else {
                    return error;
                }
            }
        });
    }

}

function setInsuData() {
    var defaultDate = new Date();

    var setYear = [defaultDate.getFullYear() - 2, defaultDate.getFullYear() - 1, defaultDate.getFullYear(), defaultDate.getFullYear() + 1, defaultDate.getFullYear() + 2, defaultDate.getFullYear() + 3];
    var setYearOption = '';
    for(var y = 0; y < setYear.length; y++) {
        var yearSelected = '';
        if (setYear[y] == defaultDate.getFullYear()) {
            yearSelected = ' selected';
        }
        setYearOption += '<option value="' + setYear[y] + '"' + yearSelected + '>' + setYear[y] + '</option>';
    }

    var setMonthOption = '';
    for(var m = 1; m < 13; m++) {
        var monthSelected = '';
        if (m == defaultDate.getMonth() + 1) {
            monthSelected = ' selected';
        }
        setMonthOption += '<option value="' + m + '"' + monthSelected + '>' + m + '</option>';
    }

    var html = '<select name="insuYear" onchange="getFullDate()">'
        + setYearOption
        + '</select>년 '
        + '<select name="insuMonth" onchange="getFullDate()">'
        + setMonthOption
        + '</select>월 '
        + '<select name="insuDay">'
        + setFullDate(defaultDate)
        + '</select>일 ';

    return html;
}

function setCashBackDate() {
    var defaultDate = new Date();

    var setYear = [defaultDate.getFullYear() - 2, defaultDate.getFullYear() - 1, defaultDate.getFullYear(), defaultDate.getFullYear() + 1, defaultDate.getFullYear() + 2, defaultDate.getFullYear() + 3];
    var setYearOption = '';
    for(var y = 0; y < setYear.length; y++) {
        var yearSelected = '';
        if (setYear[y] == defaultDate.getFullYear()) {
            yearSelected = ' selected';
        }
        setYearOption += '<option value="' + setYear[y] + '"' + yearSelected + '>' + setYear[y] + '</option>';
    }

    var setMonthOption = '';
    for(var m = 1; m < 13; m++) {
        var monthSelected = '';
        if (m == defaultDate.getMonth() + 1) {
            monthSelected = ' selected';
        }
        setMonthOption += '<option value="' + m + '"' + monthSelected + '>' + m + '</option>';
    }

    var html = '<select name="cashMonth" onchange="getFullDateCashBack()">'
        + setMonthOption
        + '</select>월 '
        + '<select name="cashDay">'
        + setFullDate(defaultDate)
        + '</select>일 ';

    return html;
}

function setFullDate(date) {
    var setYear = date.getFullYear();
    var setMonth = date.getMonth();

    var setDate = new Date(setYear, setMonth + 1, 0);

    var setDateOption = '';
    for (var d = 1; d < setDate.getDate() + 1; d++) {
        var selected = '';
        if (date.getDate() === d) {
            selected = ' selected';
        }
        setDateOption += '<option value="' + d + '"' + selected + '>' + d + '</option>';
    }

    return setDateOption;
}

function getFullDate() {
    $('select[name=insuDay] option').remove();

    var setYear = $('select[name=insuYear]').val();
    var setMonth = $('select[name=insuMonth]').val();
    if (setMonth === 12) {
        setMonth = 0;
    }
    var setNowDate = new Date();
    var setDate = new Date(setYear, setMonth, 0);

    var setDateOption = '';
    for (var d = 1; d < setDate.getDate() + 1; d++) {
        var selected = '';
        if (setNowDate.getDate() === 1) {
            selected = ' selected';
        }
        setDateOption += '<option value="' + d + '"' + selected + '>' + d + '</option>';
    }

    $('select[name=insuDay]').append(setDateOption);
}

function getFullDateCashBack() {
    $('select[name=cashDay] option').remove();

    var defaultDate = new Date();

    var setYear = defaultDate.getFullYear();
    var setMonth = $('select[name=cashMonth]').val();
    if (setMonth === 12) {
        setMonth = 0;
    }
    var setNowDate = new Date();
    var setDate = new Date(setYear, setMonth, 0);

    var setDateOption = '';
    for (var d = 1; d < setDate.getDate() + 1; d++) {
        var selected = '';
        if (setNowDate.getDate() === 1) {
            selected = ' selected';
        }
        setDateOption += '<option value="' + d + '"' + selected + '>' + d + '</option>';
    }

    $('select[name=cashDay]').append(setDateOption);
}

// comma
function setComma(n) {
    var reg = /(^[+-]?\d+)(\d{3})/;   // 정규식
    n += '';                          // 숫자를 문자열로 변환
    while (reg.test(n)) {
        n = n.replace(reg, '$1' + ',' + '$2');
    }
    return n;
}

function setOneDay() {
    var defaultDate = new Date();
    var defaultSetYear = defaultDate.getFullYear();
    var defaultSetMonth = defaultDate.getMonth() + 1;
    defaultSetMonth = (defaultSetMonth < 10) ? '0' + defaultSetMonth : defaultSetMonth;

    var defaultSetDate = defaultDate.getDate();
    defaultSetDate = (defaultSetDate < 10) ? '0' + defaultSetDate : defaultSetDate;

    var defaultSetDay = getDay(defaultDate.getDay());

    var defaultOptionVal = defaultSetYear + '-' + defaultSetMonth + '-' + defaultSetDate;

    var getParmeter = getParameterByName('oneDaySelector');

    var selected = '';
    if (getParmeter === defaultOptionVal) {
        selected = 'selected';
    }

    var setOption = '';
    // 오늘 데이터
    setOption += '<option value="' + defaultOptionVal + '" ' + selected + '>' + ((defaultDate.getMonth() + 1) + '월') + ' ' + ((defaultDate.getDate()) + '일') + '(' + defaultSetDay + ')' + '</option>';

    for (var d = 1; d < 8; d++) {
        selected = '';
        // 오늘 기준으로 날짜 셋팅
        var newDate = new Date(defaultDate.getFullYear(), defaultDate.getMonth(), (defaultDate.getDate() - d));
        var newSetYear = newDate.getFullYear();

        var newSetMonth = newDate.getMonth() + 1;
        newSetMonth = (newSetMonth < 10) ? '0' + newSetMonth : newSetMonth;

        var newSetDate = newDate.getDate();
        newSetDate = (newSetDate < 10) ? '0' + newSetDate : newSetDate;

        var newOptionVal = newSetYear + '-' + newSetMonth + '-' + newSetDate;

        var newSetDay = getDay(newDate.getDay());

        if (getParmeter === newOptionVal) {
            selected = 'selected';
        }

        setOption += '<option value="' + newOptionVal + '" ' + selected +'>' + ((newDate.getMonth() + 1) + '월') + ' ' + (newDate.getDate() + '일') + '(' + newSetDay + ')' + '</option>';
    }

    return setOption;
}

function getDay(num) {
    var dayArray = ["일", "월", "화", "수", "목", "금", "토"];

    return dayArray[num];
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function goOneDaySelector(data) {
    // ?oneDaySelector=&txtDate=2020-06-02+~+2020-06-02&option=tel&search=
    var That = $(data);

    var optionVal = $('select[name=option]').val();
    var searchVal = $('input[name=search]').val();

    location.href = "?txtDate=" + That.val() + "+~+" + That.val() + "&option="
        + optionVal + "&search=" + searchVal + "&oneDaySelector=" + That.val() + "&userStep=" + $('select[name=userStep]').val();
}

// userStep 검색
function goUserStep(data) {
    var f = document.getElementById('searchForm');
    f.submit();
    return false;
}

// applyStatus 검색
function goApplyStep(data) {
    var f = document.getElementById('searchForm');
    f.submit();
    return false;
}

// insuStatus 검색
function goInsuStep(data) {
    var f = document.getElementById('searchForm');
    f.submit();
    return false;
}

function goSearchOneDay(data) {
    var v = $(data).val();
    $('input[name=txtDate]').val(v + ' ~ ' + v);

    var f = document.getElementById('searchForm');
    f.submit();
    return false;
}

function clearValue() {
    age = infoSeq = setDate = '';
}

function changeRankMonth(opt) {
    var f = document.getElementById('searchForm');
    f.submit();
    return false;
}

// STR 검색창
searchResetBtn.on('click', function() { // 검색 초기화
    var userStep = $('#userStep'),
        applyStatus = $('#applyStatus'),
        insuStatus = $('#insuStatus'),
        miDatepicker = $('#miDatepicker'),
        option = $('#option'),
        btnSearch = $('input[name=btnSearch]'),
        txtKeyField = $('#txtKeyfield');

    userStep.val('');
    applyStatus.val('');
    insuStatus.val('');
    btnSearch.val('');
    $('select#searchOneDay option:eq(0)').prop("selected", true);
    miDatepicker.val(miDatepicker.data('default'));
    option.val('tel');
    txtKeyField.val('');
    $('input[name=useCouponParent]').val(0);
    $('input[name=useCouponChild]').val(0);
    $('input[name=useCodeParent]').val(0);
    $('input[name=useCodeChild]').val(0);

    var f = document.getElementById('searchForm');
    f.submit();
    return false;
});
// END 검색창

searchBtnPartner.on('click', function() {
    var f = document.getElementById('searchForm');
    f.submit();
    return false;
});

// STR 엑셀 다운로드
excelBtn.on('click', function() { // 엑셀 다운로드
    var _This = $(this),
        level = _This.data('level'),
        dateOption = searchForm.find('#dateOption').val() || null,
        txtDate = searchForm.find('#miDatepicker').val() || null,
        dateSelect = searchForm.find('input[name="dateSelect"]').val() || null,
        option = searchForm.find('#option').val() || null,
        search = searchForm.find('#txtKeyfield').val() || null,
        status = searchForm.find('input[name="status"]:checked').val() || null,
        payMethod = searchForm.find('input[name="payMethod"]:checked').val() || null,
        userStep = searchForm.find('#userStep').val() || null,
        btnSearch = searchForm.find('input[name=btnSearch]').val() || null,
        url = '',
        ajaxData = {};

    ajaxData.dateOption = dateOption;
    ajaxData.txtDate = txtDate;
    ajaxData.dateSelect = dateSelect;
    ajaxData.option = option;
    ajaxData.search = search;
    ajaxData.status = status;
    ajaxData.payMethod = payMethod;
    ajaxData.userStep = userStep;
    ajaxData.btnSearch = btnSearch;


    if(level === 4){ // 보험사용 URL
        url = '/midriver/insurance/excel';
    } else if (level === 1) {
        url = '/midriver/partner/excel';
    } else{
        url = '/midriver/excel';
    }
    commonJS.excelDownload(ajaxData, url); // 엑셀 다운로드
});
// STR 엑셀 다운로드

// 링크 현황 엑셀 다운로드
$('#excelBtnLinkRank').on('click', function() {
    var _This = $(this),
        sDate = searchForm.find('input[name="sDate"]').val() || null,
        option = searchForm.find('#option').val() || null,
        search = searchForm.find('#txtKeyfield').val() || null,
        userStep = searchForm.find('#userStep').val() || null,
        btnSearch = searchForm.find('input[name=btnSearch]').val() || null,
        url = '',
        ajaxData = {};

    ajaxData.sDate = sDate;
    ajaxData.option = option;
    ajaxData.search = search;
    ajaxData.userStep = userStep;
    ajaxData.btnSearch = btnSearch;

    url = '/driver/ranklist/excel'
    commonJS.excelDownload(ajaxData, url); // 엑셀 다운로드
});
