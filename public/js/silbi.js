var searchForm = $('#searchForm'), // 검색폼
    excelBtn = $('#excelBtn'), // 엑셀 다운로드 버튼
    searchBtnPartner = $('#searchBtnPartner'); // 파트너사 검색 버튼


var radioDateRangeSilbi = $('input[name="dateSelectSilbi"]'); // 개월수 검색 radio
var ExcelBtn = $('#excelBtn');

$(function() {
  // btnSearch
  $(document).on('click', '.btnSearch', function () {
    var _That = $(this);
    var sendVal = '';
    if (_That.data('value') !== 'a') {
      sendVal = _That.data('value');
    }

    var f = document.getElementById('searchForm');
    f.btnSearch.value = sendVal;

    f.submit();
    return false;
  });

  // btn-company-info
  $(document).on('click', '.btn-insu-info', function(e) {
    var _This = $(this),
        _parent = _This.parent().parent(),
        code = _parent.data('code'),
        thisChildTr = $('#people_' + code), // 현재건의 childTr
        childTrs = $('.people'); // 전체의 childTr

    childTrs.remove();

    if(thisChildTr.length > 0){
      thisChildTr.show();
    } else {

      silbiAjax({
        method: 'get',
        url: '/api/silbi/insu-goods',
        data: {
          uiSeq: _parent.data('uiseq'),
          age: _parent.data('age'),
          crawIdx: _parent.data('idx'),
          gender: _parent.data('gender')
        },
        func: function(result) {
          if (result.success === true) {

            var type2Html = '';
            var type3Html = '';
            var clickIcon = '';
            var moveIcon = '';

            if (result.data.type2.length < 1 && result.data.type3.length < 1) {
              return;
            }

            if (result.data.type2.length > 0) {
              result.data.type2.forEach(function(v, i) {
                clickIcon = '';
                moveIcon = '';
                type2Html += '<tr>';

                if (v.insuClick === 'ok') {
                  clickIcon = 'O';
                }

                if (v.insuMove === 'ok') {
                  moveIcon = 'O';
                }

                if (v.insuClick === 'ok' && v.insuMove === null) { // 클릭은 했으나 무브가 없으면
                  moveIcon = 'X';
                }

                type2Html += '<td>' + (i + 1) + '</td>'
                    + '<td>' + v.company + '</td>'
                    + '<td>' + setComma(v.price) + '</td>'
                    + '<td>' + clickIcon + '</td>'
                    + '<td>' + moveIcon + '</td>';

                type2Html += '</tr>';
              });
            }

            if (result.data.type3.length > 0) {
              result.data.type3.forEach(function(v, i) {
                clickIcon = '';
                moveIcon = '';
                type3Html += '<tr>';

                if (v.insuClick === 'ok') {
                  clickIcon = 'O';
                }

                if (v.insuMove === 'ok') {
                  moveIcon = 'O';
                }

                if (v.insuClick === 'ok' && v.insuMove === null) { // 클릭은 했으나 무브가 없으면
                  moveIcon = 'X';
                }

                type3Html += '<td>' + (i + 1) + '</td>'
                    + '<td>' + v.company + '</td>'
                    + '<td>' + setComma(v.price) + '</td>'
                    + '<td>' + clickIcon + '</td>'
                    + '<td>' + moveIcon + '</td>';

                type3Html += '</tr>';
              });
            }

            // 선택
            var infoTr =
                '<tr>' +
                '<td  style="padding: 0;">'
                + '<table>'
                + '<tr>'
                + '<th>순위</th>'
                + '<th>보험사명</th>'
                + '<th>보험료</th>'
                + '<th>열람</th>'
                + '<th>이동</th>'
                + '</tr>'
                + type3Html
                + '</table>'
                + '</td>' +
                '</tr>' +
                '<tr>';

            // 표준형
            var infoTr2 = '<tr><td  style="padding: 0;">'
                + '<table>'
                + '<tr>'
                + '<th>순위</th>'
                + '<th>보험사명</th>'
                + '<th>보험료</th>'
                + '<th>열람</th>'
                + '<th>이동</th>'
                + '</tr>'
                + type2Html
                + '</table>'
                + '</td>' +
                '</tr>';

            var infoTable =
                '<tr class="people" id="people_' + code + '">' +
                '<td colspan="9">' +
                '<table class="table detail">' +
                '<thead>' +
                '<tr>' +
                '<th>선택형</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>' +
                infoTr +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '<td colspan="10">' +
                '<table class="table detail">' +
                '<thead>' +
                '<tr>' +
                '<th>표준형</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>' +
                infoTr2 +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>';

            _parent.after(infoTable);
            if(!$(e.target).closest('.prevent-bubble').length){

            }
          }
        }
      });
    }
  });

  // btn-modify-company
  $(document).on('click', '.btn-modify-company', function () {
    var _this = $(this),
        code = _this.data('seq');

    silbiAjax({
      method: 'get',
      url: '/api/silbi/setting/' + code,
      func: function(res) {
        if (res.success === true) {
          var html =
              '<div class="pop-company-change">'
              + '<input type="hidden" name="companySeq" value="' + res.data.seq + '" />' +
              '<table class="table pop-company-table">' +
              '<tbody>' +
              '<tr>' +
              '<td>보험사코드</td>' +
              '<td><input type="text" name="insCd" value="'+ res.data.insCd + '" readonly /></td>' +
              '</tr><tr>' +
              '<td>보험사명</td>' +
              '<td><input type="text" name="insNm" value="' + res.data.insNm + '" readonly /></td>' +
              '</tr><tr>' +
              '<td>상품명</td>' +
              '<td><input type="text" name="goodsNm" value="' + res.data.goodsNm + '" /></td>' +
              '</tr><tr>' +
              '<td>가입연령</td>' +
              '<td style="text-align: left">'
              + '<input class="age-input" type="number" name="age1" oninput="maxLengthAge(this)" value="' + res.data.age1 + '" /> ~ '
              + '<input class="age-input" type="number" name="age2" oninput="maxLengthAge(this)" value="' + res.data.age2 + '" />'
              + '</td>' +
              '</tr><tr>' +
              '<td>가입방법</td>' +
              '<td style="text-align: left">'
              + '<select name="applyType" id="applyType" onchange="changeApplyType(this)">'
              + '<option value="1" ' + (res.data.applyType === "1" ? 'selected' : '') +'>온라인</option>'
              + '<option value="2" ' + (res.data.applyType === "2" ? 'selected' : '') +'>전화</option>'
              + '</select>'
              + '</td>' +
              '</tr><tr>' +
              '<td>연결가능</td>' +
              '<td style="text-align: left">'
              + '<input style="margin-right: 5px" type="checkbox" name="isPc" id="isPc" value="Y" ' + (res.data.isPc === 'Y' ? 'checked' : '') + ' /><label for="isPc" style="margin-right:10px">PC</label>'
              + '<input style="margin-right: 5px" type="checkbox" name="isMobile" id="isMobile" value="Y" ' + (res.data.isMobile === 'Y' ? 'checked' : '') + ' /><label for="isMobile">모바일</label>'
              + '</td>' +
              '</tr><tr>' +
              '<td>전화번호</td>' +
              '<td><input type="text" name="tel" value="' + (!res.data.tel ? '' : res.data.tel) + '" /></td>' +
              '</tr><tr>' +
              '<td>편의성별점</td>' +
              '<td><input type="text" name="insRate" value="' + res.data.insRate + '" /></td>' +
              '</tr><tr>' +
              '<td>편의성문구(PC)</td>' +
              '<td><textarea id="applyMemo" placeholder="편의성문구를 작성해 주세요">' + (!res.data.applyMemo ? '' : res.data.applyMemo) +'</textarea></td>' +
              '</tr><tr>' +
              '<td>편의성문구(모바일)</td>' +
              '<td><textarea id="applyMemoMobile" placeholder="편의성문구를 작성해 주세요">' + (!res.data.applyMemoMobile ? '' : res.data.applyMemoMobile) +'</textarea></td>' +
              '</tr><tr>' +
              '<td colspan="2" style="text-align: left">기본 URL</td>' +
              '</tr><tr>' +
              '<td>PC</td>' +
              '<td><input type="text" name="urlPc" value="' + (!res.data.planUrlPc ? '' : res.data.planUrlPc) + '" readonly /></td>' +
              '</tr><tr>' +
              '<td>모바일</td>' +
              '<td><input type="text" name="urlMobile" value="' + (!res.data.planUrlMobile ? '' : res.data.planUrlMobile) + '" readonly /></td>' +
              '</tr><tr>' +
              '<td colspan="2" style="text-align: left">변경 URL</td>' +
              '</tr><tr>' +
              '<td>PC</td>' +
              '<td><input type="text" name="changePcUrl" value="' + (!res.data.urlPc ? '' : res.data.urlPc) + '" /></td>' +
              '</tr><tr>' +
              '<td>모바일</td>' +
              '<td><input type="text" name="changeMobileUrl" value="' + (!res.data.urlMobile ? '' : res.data.urlMobile) + '" /></td>' +
              '</tr><tr>' +
              '<td colspan="2"></td></tr><tr>' +
              '<td>노출여부</td>' +
              '<td style="text-align: left">'
              + '<input style="margin-right: 5px" type="checkbox" name="useYn" id="useY" value="Y" ' + (res.data.useYn === 'Y' ? 'checked' : '') + ' /><label for="useY" style="margin-right:10px">노출</label>'
              + '<input style="margin-right: 5px" type="checkbox" name="useYn" id="useN" value="N" ' + (res.data.useYn === 'N' ? 'checked' : '') + ' /><label for="useN">미노출</label>'
              + '</td>' +
              '</tr>' +
              '</tbody>' +
              '</table>' +
              '</div>';

          var SaveBtn = '<ul>'+
              '<li class="w-2"><button type="button" class="yes-bt yes-bt-save">수정</button></li>'+
              '<li class="w-2"><button type="button" class="no-bt no-bt-ac">취소</button></li>'+
              '</ul>';
          miDesignPop.alert({
            dWidth: 650,
            dTarget : 'multi-pop1', // 타겟 설정 id 설정
            dTitle: res.data.insNm +' 상품정보',
            dCopy: html,
            dButtonSet: SaveBtn,
            dCloseX: true
          });
        } else {
          return console.log(res);
        }
      }
    });
  });

  // yes-bt-save confirm event
  $(document).on('click', '.yes-bt-save', function () {
    var SaveBtn = '<ul>'+
        '<li class="w-2"><button type="button" class="yes-bt yes-bt-save-final">수정</button></li>'+
        '<li class="w-2"><button type="button" class="no-bt no-bt-ac">취소</button></li>'+
        '</ul>';
    miDesignPop.alert({
      dTarget: 'multi-pop2',
      dCopy: '수정하시겠습니까?',
      dButtonSet: SaveBtn
    });
  });

  $(document).on('click', '.yes-bt-save-final', function () {
    // data
    var code = $('input[name=companySeq]'),
        goodsNm = $('input[name=goodsNm]'),
        age1 = $('input[name=age1]'),
        age2 = $('input[name=age2]'),
        applyType = $('select#applyType'),
        isPc = $('input[name=isPc]'),
        isMobile = $('input[name=isMobile]'),
        tel = $('input[name=tel]'),
        insRate = $('input[name=insRate]'),
        applyMemo = $('textarea#applyMemo'),
        applyMemoMobile = $('textarea#applyMemoMobile'),
        changePcUrl = $('input[name=changePcUrl]'),
        changeMobileUrl = $('input[name=changeMobileUrl]'),
        useYn = $('input[name=useYn]:checked');

    // validation
    if (!code.val()) {
      miDesignPop.alert({
        dTarget: 'multi-pop3',
        dCopy: 'code is null',
        dYesAc: function () {
          $('#multi-pop2').remove();
        }
      });
      return;
    }

    if ($.trim(goodsNm.val()).length < 1) {
      miDesignPop.alert({
        dTarget: 'multi-pop3',
        dCopy: '상품명을 입력해 주세요',
        dYesAc: function () {
          $('#multi-pop2').remove();
          goodsNm.focus();
        }
      });
      return;
    }

    if ($.trim(age1.val()).length < 1) {
      miDesignPop.alert({
        dTarget: 'multi-pop3',
        dCopy: '최소 나이를 입력해 주세요',
        dYesAc: function () {
          $('#multi-pop2').remove();
          age1.focus();
        }
      });
      return;
    }

    if ($.trim(age2.val()).length < 1) {
      miDesignPop.alert({
        dTarget: 'multi-pop3',
        dCopy: '최대 나이를 입력해 주세요',
        dYesAc: function () {
          $('#multi-pop2').remove();
          age2.focus();
        }
      });
      return;
    }

    if ($.trim(age1.val()) > $.trim(age2.val())) {
      miDesignPop.alert({
        dTarget: 'multi-pop3',
        dCopy: '최소 나이가 최대 나이보다 크면 안됩니다',
        dYesAc: function () {
          $('#multi-pop2').remove();
          age1.focus();
        }
      });
      return;
    }

    if (applyType.val() === '2' && $.trim(tel.val()).length < 1) {
      miDesignPop.alert({
        dTarget: 'multi-pop3',
        dCopy: '전화번호를 넎어주세요',
        dYesAc: function () {
          $('#multi-pop2').remove();
          tel.focus();
        }
      });
      return;
    }

    if ($.trim(applyMemo.val()).length < 1) {
      miDesignPop.alert({
        dTarget: 'multi-pop3',
        dCopy: '편의성문구를 작성해 주세요',
        dYesAc: function () {
          $('#multi-pop2').remove();
          applyMemo.focus();
        }
      });
      return;
    }

    if (!isPc.prop('checked') && !isMobile.prop('checked')) {
      miDesignPop.alert({
        dTarget: 'multi-pop3',
        dCopy: '연결 가능여부를 선택해 주세요',
        dYesAc: function () {
          $('#multi-pop2').remove();
        }
      });
      return;
    }

    if (!useYn.val()) {
      miDesignPop.alert({
        dTarget: 'multi-pop3',
        dCopy: '노출여부를 선택해 주세요',
        dYesAc: function () {
          $('#multi-pop2').remove();
        }
      });
      return;
    }

    var data = {
      goodsNm: goodsNm.val(),
      age1: age1.val(),
      age2: age2.val(),
      applyType: applyType.val(),
      isPc: (isPc.prop('checked') ? 'Y' : 'N'),
      isMobile: (isMobile.prop('checked') ? 'Y' : 'N'),
      tel: tel.val(),
      insRate: insRate.val(),
      applyMemo: applyMemo.val(),
      applyMemoMobile: applyMemoMobile.val(),
      changePcUrl: changePcUrl.val(),
      changeMobileUrl: changeMobileUrl.val(),
      useYn: useYn.val()
    }

    silbiAjax({
      method: 'post',
      url: '/api/silbi/setting/' + code.val(),
      data: data,
      func: function(result) {
        if (result.success === true) {
          location.reload();
        }

        console.log(result);
      }
    });
  });

  // checkbox oneclick
  $(document).on('click', 'input[name=useYn]', function() {
    if ($(this).prop('checked')) {
      $('input[name=useYn]').prop('checked', false);
      $(this).prop('checked', true);
    }
  });

  $(document).on('click', 'input[name=isMobile]', function() {
    var applyType = $('select#applyType'),
        insRate = $('input[name=insRate]');
    if (!$(this).prop('checked') && applyType.val() === '1') {
      // insRate.val('0.5');
    }
  });

  // 비고보기 팝업
  $(document).on('click', '.btn-remark-show', function (e) {
    var bcSeq = $(this).data('seq');
    driverListAjax({
      method: 'get',
      url: '/api/silbi/history/' + bcSeq,
      func: function(res) {
        if (res.data && res.data.length > 0) {
          var setData = '';
          res.data.forEach(function(v, i){
            var changeTitle = v.changeTitle.split('|');
            var changeContents = v.changeContent.split('|');
            var viewLog = '';
            changeTitle.forEach(function(vv, ii){
              var tailTxt = '';
              switch(vv) {
                case '상품명': case '가입방법': case '전화번호': case '편의성별점': case 'PC 편의성문구': case '모바일 편의성문구':
                  tailTxt = ' (으)로 변경';
                  break;
                case '가입연령': case '노출여부':
                  tailTxt = '로 변경';
                  break;
              }
              if (vv === '변경 URL 수정') {
                viewLog += '<p><span class="point-color5">' + changeContents[ii] + '</span> ' + vv + tailTxt + '</p>';
              } else {
                viewLog += '<p>' + vv + ' <span class="point-color5">' + changeContents[ii] + '</span>' + tailTxt + '</p>';
              }
            });


            setData += '<tr>';
            setData += '<td style="text-align: center">' + v.viewRegDate + '</td>';
            setData += '<td style="text-align: center">' + v.changeUser + '</td>';
            setData += '<td><div style="word-break: break-all">' + viewLog + '</div></td>';
            setData += '</tr>';
          });
          var html =
              '<div class="pop-remark-show">' +
              '<table class="table detail non-border">' +
              "<colgroup>" +
              '<col width="25%" />' +
              '<col width="10%" />' +
              '<col width="65%" />' +
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
});

radioDateRangeSilbi.on('change', function() {
  var _This = $(this),
      radioValue = _This.val(),
      date = new Date(),
      searchStartDate, // 검색 시작일
      searchEndDate, // 검색 마지막일 (이번달의 마지막 날)
      searchDate; // n개월 최종 검색일

  if (radioValue === '1w') {
    searchStartDate = commonJS.dateFormatter(new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7)), // 검색 시작일
    searchEndDate = commonJS.dateFormatter(new Date(date.getFullYear(), date.getMonth(), date.getDate())), // 검색 마지막일 (이번달의 마지막 날)
    searchDate = searchStartDate + ' ~ ' + searchEndDate; // n개월 최종 검색일
  } else if (radioValue === '1') {
    searchStartDate = commonJS.dateFormatter(new Date(date.getFullYear(), date.getMonth() - 1, date.getDate())); // 검색 시작일
    searchEndDate = commonJS.dateFormatter(new Date(date.getFullYear(), date.getMonth(), date.getDate())); // 검색 마지막일 (이번달의 마지막 날)
    searchDate = searchStartDate + ' ~ ' + searchEndDate; // n개월 최종 검색일
  } else if (radioValue === '3') {
    searchStartDate = commonJS.dateFormatter(new Date(date.getFullYear(), date.getMonth() - 3, date.getDate())); // 검색 시작일
    searchEndDate = commonJS.dateFormatter(new Date(date.getFullYear(), date.getMonth(), date.getDate())); // 검색 마지막일 (이번달의 마지막 날)
    searchDate = searchStartDate + ' ~ ' + searchEndDate; // n개월 최종 검색일
  }

  $('input[name=sDate]').val(searchStartDate);
  $('input[name=eDate]').val(searchEndDate);

  $('input[name=hiddenSelect]').val(radioValue);
  $('#miDatepicker').val(searchDate);
});

searchResetBtn.on('click', function() {
  var miDatepicker = $('#miDatepicker'),
      option = $('#option'),
      btnSearch = $('input[name=btnSearch]'),
      txtKeyField = $('#txtKeyfield'),
      sDate = $('input[name=sDate]'),
      eDate = $('input[name=eDate]');

  sDate.val('');
  eDate.val('');
  $('input[name="dateSelectSilbi"]:checked').prop('checked', false);
  $('input[name="hiddenSelect"]').val("1");
  btnSearch.val('');
  miDatepicker.val('');
  option.val('tel');
  txtKeyField.val('');

  // console.log(miDatepicker.val());
  // 값 초기화 후 재검색
  var f = document.getElementById('searchForm');
  f.submit();
  return false;
});

// STR 엑셀 다운로드
excelBtn.on('click', function() { // 엑셀 다운로드
  var _This = $(this),
      level = _This.data('level'),
      txtDate = searchForm.find('#miDatepicker').val() || null,
      dateSelectSilbi = searchForm.find('input[name="dateSelectSilbi"]').val() || null,
      option = searchForm.find('#option').val() || null,
      search = searchForm.find('#txtKeyfield').val() || null,
      btnSearch = searchForm.find('input[name=btnSearch]').val() || null,
      sDate = searchForm.find('input[name=sDate]').val() || null,
      eDate = searchForm.find('input[name=eDate]').val() || null
      url = '';

  var ajaxData = {
    txtDate: txtDate,
    dateSelectSilbi: dateSelectSilbi,
    option: option,
    search: search,
    btnSearch: btnSearch,
    sDate: sDate,
    eDate: eDate
  }

  // ajaxData.dateOption = dateOption;
  // ajaxData.txtDate = txtDate;
  // ajaxData.dateSelectSilbi = dateSelectSilbi;
  // ajaxData.option = option;
  // ajaxData.search = search;
  // ajaxData.btnSearch = btnSearch;
  // ajaxData.sDate = sDate;


  if(level === 4){ // 보험사용 URL
    url = '/silbi/insurance/excel';
  } else if (level === 1) {
    url = '/silbis/partner/excel';
  } else{
    url = '/silbi/excel';
  }
  commonJS.excelDownload(ajaxData, url); // 엑셀 다운로드
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

}function silbiAjax(obj) {
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
    var dataObj = '';
    if (obj.method === 'post') {
      dataObj = JSON.stringify(obj.data);
    } else {
      dataObj = obj.data;
    }


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

// comma
function setComma(n) {
  var reg = /(^[+-]?\d+)(\d{3})/;   // 정규식
  n += '';                          // 숫자를 문자열로 변환
  while (reg.test(n)) {
    n = n.replace(reg, '$1' + ',' + '$2');
  }
  return n;
}

// 나이 maxlength
function maxLengthAge(obj) {
  // 시작 글자 0 입력하면 지움
  if (obj.value.length === 1 && obj.value[0] === '0') {
    obj.value = '';
  }

  // 1보다 클 때 첫자리는 0 두번째가 0보다 크면 앞에를 지움
  if (obj.value.length > 1 && (obj.value[0] === '0' && obj.value[1] > '0')) {
    obj.value = obj.value[1];
  }

  // 2자리 이상 입력하면 앞에 2자리만 남김
  if (obj.value.length > 2) {
    obj.value = obj.value.slice(0, 2);
  }

  return obj.value;
}

// changeApplyType(this)
function changeApplyType(obj) {
  // isMobileCheck
  var isMobile = $('input[name=isMobile]'),
      insRate = $('input[name=insRate]');
  if (obj.value === '1' && !isMobile.prop('checked')) {
    // insRate.val('0.5');
  }
}