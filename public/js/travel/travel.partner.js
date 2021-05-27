// NOTE : 여행자보험 제휴사 스크립트 @Jinn (20.07.15)

function showDetailList(code, target) { // 세부리스트 API
    var url = '/api/travel/partner/peoples/'+code+'/'+travelCommonJS.currentService;

    $.ajax({
        type: 'GET',
        url: url,
        dataType: 'json'
    }).done(function(res) {
        var infoTr = '',
            orgTotal = 0,
            detailTr = $('#people_'+code);

        for(var i = 0; i < res.data.length; i++){
            var data = res.data[i],
                dataCode = data.code, // code  (subCode)
                dataName = data.name, // 이름
                dataAge = data.age, // 나이
                dataSex = data.sex, // 성별
                dataTel = data.tel, // 전화번호
                dataPrice = data.price, // 할인 후 가격
                dataOrgPrice = data.orgPrice, // 할인 전 가격
                dataStateKor = data.state; // 상태 코드

            orgTotal += dataOrgPrice;

            infoTr += '<tr class="detail-tr" id="companion_'+code+'_'+dataCode
                        +'" data-code="'+code
                        +'" data-datacode="'+dataCode
                        +'" data-name="'+dataName
                        +'" data-age="'+dataAge
                        +'" data-price="'+dataPrice +'">'
                        +'<td>'
                            +'<span>'+dataName+'</span>'
                        +'</td>'
                        +'<td>'
                            +'<span id="sexText">'+dataSex+'</span>'
                        +'</td>'
                        +'<td>'
                            +'<span id="ageText">'+dataAge+'</span>'
                        +'</td>'
                        +'<td>'
                            +'<span>'+(dataTel ? dataTel : '-')+'</span>'
                        +'</td>'
                        +'<td class="t-a-r">'
                            +'<span id="orgPriceText">'+miValidate.isNumComma(dataOrgPrice)+'</span>'
                        +'</td>'
                        +'<td>'
                            +dataStateKor
                        +'</td>'
                    +'</tr>';
        }
        var infoTable = '<td colspan="22">'
                        +'<table class="table">'
                            +'<thead>'
                                +'<th>이름</th>'
                                +'<th>성별</th>'
                                +'<th>나이</th>'
                                +'<th>휴대폰번호</th>'
                                +'<th>보험료('+miValidate.isNumComma(orgTotal)+')</th>'
                                +'<th>상태</th>'
                            +'</thead>'
                            +'<tbody>'
                                + infoTr 
                            +'</tbody></table></td>';

        if(detailTr.length > 0){
            target.html(infoTable);
        }else{
            target.after('<tr id="people_'+code+'" class="people visible">'+infoTable+'</tr>');
        }
    }).fail(function(res) {
        commonJS.alertPop(res.responseJSON.error.message || res.responseJSON.message);
    });
}