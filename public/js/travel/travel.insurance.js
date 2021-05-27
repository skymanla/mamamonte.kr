// NOTE : 여행자보험 보험사용 스크립트 @Jinn (20.07.15)

function showDetailList(code, target){ // 세부리스트 API
    var url = '';

    if(travelCommonJS.isDomestic){ // 국내 
        url = '/api/domestic/insurance/peoples/' + code;
    }else{ // 해외
        if(travelCommonJS.isYuhak){ // 장기
            url = '/api/people/info/'+code+'/'+travelCommonJS.currentService;
        }else{
            url = '/api/travel/insurance/peoples/' + code + '/' + travelCommonJS.currentService;
        }
    }

    $.ajax({
        type: 'GET',
        url: url,
        contentType: 'application/json',
        dataType: 'json'
    }).done(function(res) {
        if(res.success){
            var infoTr = '',
                orgTotal = 0,
                infoTable = '',
                detailTr = $('#people_' + code);

            if(travelCommonJS.isYuhak){ // 장기
                for(var i = 0; i < res.data.length; i++){
                    var data = res.data[i],
                        dataCode = data.code, // code  (subCode)
                        dataProductCode = data.product_code, // 상품코드
                        dataName = data.name, // 이름
                        dataBirth = data.birth, // 생년월일
                        dataResident = data.resident, // 주민번호 뒷자리
                        dataAge = data.age, // 나이
                        dataSex = data.sex, // 성별
                        dataTel = data.tel, // 전화번호
                        dataEmail = data.email,
                        dataEmailArr = dataEmail.split('@'), // 이메일
                        dataEmailId = dataEmailArr[0], // 이메일 앞부분
                        dataEmailDomain = dataEmailArr[1], // 이메일 뒷부분
                        dataPrice = data.price, // 할인 후 가격
                        dataOrgPrice = data.org_price, // 할인 전 가격
                        dataInsuNum = data.insu_number, // 증권번호
                        dataStateCode = data.state.code, // 상태 코드
                        dataStateKor = data.state.insurance, // 상태 한글
        
                        emailInput = '',
                        isCustomEmail = false;
        
                    orgTotal += dataOrgPrice;

                    if(dataEmailDomain != 'naver.com' 
                        && dataEmailDomain != 'daum.net' 
                        && dataEmailDomain != 'hanmail.net' 
                        && dataEmailDomain != 'gmail.com' 
                        && dataEmailDomain != 'nate.com' 
                        && dataEmailDomain != 'mibank.me'
                    ){
                        isCustomEmail = true;
                    }

                    emailInput = '<div class="mi-input-wrap">'
                                    + '<div class="mi-input-group align-top">'
                                        + '<div class="mi-input-box">'
                                            + '<div class="mi-input-input">'
                                                +'<input type="text" class="mi-input" id="email1Detail" value="'+dataEmailId+'">'
                                            + '</div>'
                                            + '<div class="mi-input-connect"><span class="at">@</span></div>'
                                            + '<div class="mi-input-input">'
                                                + '<input type="text" class="mi-input" id="email2Detail" style="margin-bottom: 10px;'+(isCustomEmail ? "" : "display: none;")+'" value="'+dataEmailDomain+'">'
                                                + '<select name="" id="email2ChangeDetail" class="mi-input select">'
                                                + '<option value="" selected disabled hidden>선택</option>'
                                                + '<option value="naver.com" '+(dataEmailDomain == "naver.com" ? "selected" : "")+'>naver.com</option>'
                                                + '<option value="daum.net" '+(dataEmailDomain == "daum.net" ? "selected" : "")+'>daum.net</option>'
                                                + '<option value="hanmail.net" '+(dataEmailDomain == "hanmail.net" ? "selected" : "")+'>hanmail.net</option>'
                                                + '<option value="gmail.com" '+(dataEmailDomain == "gmail.com" ? "selected" : "")+'>gmail.com</option>'
                                                + '<option value="nate.com" '+(dataEmailDomain == "nate.com" ? "selected" : "")+'>nate.com</option>'
                                                + '<option value="mibank.me" '+(dataEmailDomain == "mibank.me" ? "selected" : "")+'>mibank.me</option>'
                                                + '<option value="custom"'+(isCustomEmail ? "selected" : "")+'>직접입력</option>'
                                                + '</select>'
                                            + '</div>'
                                        + '</div>'
                                    + '</div>'
                                + '</div>';

                    infoTr += '<tr class="detail-tr" id="companion_'+code+'_'+dataCode
                                +'" data-code="'+code
                                +'" data-datacode="'+dataCode
                                +'" data-name="'+dataName
                                +'" data-age="'+dataAge
                                +'" data-price="'+dataPrice
                                +'" data-state="'+dataStateCode+'">'
                                +'<td>'
                                    +'<input type="text" class="mi-input" id="name" name="name" value='+dataName+'>'
                                +'</td>'
                                +'<td>'
                                    +'<span id="birthText">'+dataBirth+'</span>'
                                +'</td>'
                                +'<td>'
                                    +'<input type="text" class="mi-input" id="resident" name="resident" value='+dataResident+' maxlength="7">'
                                +'</td>'
                                +'<td>'
                                    +'<span id="sexText">'+dataSex+'</span>'
                                +'</td>'
                                +'<td>'
                                    +'<span id="ageText">'+dataAge+'</span>'
                                +'</td>'
                                +'<td>'
                                    +(code == dataCode ? '<input type="text" class="mi-input" id="tel" name="tel" value='+dataTel+' maxlength="11">' : '-')
                                +'</td>'
                                +'<td class="email-td">'
                                    +(code == dataCode ? emailInput : '-')
                                +'</td>'
                                +'<td class="t-a-r">'
                                    +'<span id="orgPriceText">'+miValidate.isNumComma(dataOrgPrice)+'</span>'
                                +'</td>'
                                +'<td class="no-click">'
                                    +'<a href="javascript:void(0);" id="productCodeText" data-plan="'+dataProductCode+'">'+dataInsuNum+'</a>'
                                +'</td>'
                                +'<td>'
                                    +dataStateKor
                                +'</td>'
                                +'<td class="no-click">'
                                    +(dataStateCode != 'D' ? '<button class="mi-input" id="modifyBtn"> 수정 </button>' : '-')
                                +'</td>' 
                            +'</tr>';
                }

                infoTable = '<td colspan="22">'
                            +'<table class="table detail">'
                                +'<thead>'
                                    +'<th>이름</th>'
                                    +'<th>생년월일</th>'
                                    +'<th>주민번호</th>'
                                    +'<th>성별</th>'
                                    +'<th>나이</th>'
                                    +'<th>휴대폰번호</th>'
                                    +'<th>이메일</th>'
                                    +'<th>보험료('+miValidate.isNumComma(orgTotal)+')</th>'
                                    +'<th>증권번호</th>'
                                    +'<th>상태</th>'
                                    +'<th>변경</th>'
                                +'</thead>'
                                +'<tbody>'
                                    + infoTr 
                                +'</tbody></table></td>';
            }else{
                for(var i = 0; i < res.data.length; i++){
                    var data = res.data[i],
                        dataCode = data.code, // code  (subCode)
                        dataProductCode = data.productCode, // 상품코드
                        dataPlanCode = data.planCode, // 플랜 코드
                        dataInsuNum = data.insuNum || null, // 증권번호
                        dataName = data.name, // 이름
                        dataBirth = data.birth, // 생년월일
                        dataAge = data.age, // 나이
                        dataSex = data.sex, // 성별
                        dataTel = data.tel, // 전화번호
                        dataEmail = data.email, // 이메일
                        dataPrice = data.price, // 할인 후 가격
                        dataOrgPrice = data.orgPrice, // 할인 전 가격
                        dataStateKor = data.state, // 상태 코드
                        planA = '';
    
                    orgTotal += dataOrgPrice;
    
                    if(travelCommonJS.isDomestic){ // 국내
                        var planName = dataProductCode == '추천' ? '고급' : '일반';
                        planA = '<a href="javascript:void(0);" id="planCdText" data-plan="'+dataPlanCode+'">'+planName+'</a>';
                    }else{ // 해외
                        planA = '<a href="javascript:void(0);" id="productCodeText" data-plan="'+dataProductCode+'">'+(commonJS.currentPathname.indexOf('yuhak') > -1 ? dataInsuNum : dataProductCode)+'</a>'
                    }
    
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
                                    +'<span id="birthText">'+dataBirth+'</span>'
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
                                +'<td>'
                                    +'<span>'+(dataEmail ? dataEmail : '-')+'</span>'
                                +'</td>'
                                +'<td class="t-a-r">'
                                    +'<span id="orgPriceText">'+miValidate.isNumComma(dataOrgPrice)+'</span>'
                                +'</td>'
                                +'<td class="no-click">'
                                    +planA
                                +'</td>'
                                +'<td>'
                                    +dataStateKor
                                +'</td>'
    
                            +'</tr>';
                }
    
                infoTable = '<td colspan="22">'
                                +'<table class="table">'
                                    +'<colgroup>'
                                        +'<col width="10%">'
                                        +'<col width="10%">'
                                        +'<col width="10%">'
                                        +'<col width="10%">'
                                        +'<col width="10%">'
                                        +'<col width="10%">'
                                        +'<col width="10%">'
                                        +'<col width="10%">'
                                        +'<col width="10%">'
                                        +'<col width="10%">'
                                    +'</colgroup>'
                                    +'<thead>'
                                        +'<th>이름</th>'
                                        +'<th>생년월일</th>'
                                        +'<th>성별</th>'
                                        +'<th>나이</th>'
                                        +'<th>휴대폰번호</th>'
                                        +'<th>이메일</th>'
                                        +'<th>보험료('+miValidate.isNumComma(orgTotal)+')</th>'
                                        +'<th>플랜</th>'
                                        +'<th>상태</th>'
                                    +'</thead>'
                                    +'<tbody>'
                                        + infoTr 
                                    +'</tbody></table></td>';
            }

            if(detailTr.length > 0){
                target.html(infoTable);
            }else{
                target.after('<tr id="people_'+code+'" class="people visible">'+infoTable+'</tr>');
            }
        }else{
            commonJS.alertPop(res.error.message);
        }
    }).fail(function(res) {
        commonJS.alertPop(res.responseJSON.error.message || res.responseJSON.message);
    });
}