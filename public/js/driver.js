$(function() {
  var serviceMenuOpen = $('.service-set-menu > .hover-student');

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


  // datepicker focusin 이벤트 클릭으로 대체
  $(document).on('click', '.setSalesRange', function() {
    targetWidget.fadeIn(200);
    // console.log($(targetDiv).find('.ui-widget'));
    // console.log(targetWidget);

    var dData = $(targetDiv).data().datepicker, // datepicker data
        vewDate = dData.startDay; // 보여질 달력 월수

    if (dData.startDay > dData.endDay) { // 마지막 선택일이 첫 선택일보다 클경우
        vewDate = dData.endDay;
    }

    if(!vewDate){
        var pickDate = $(targetInput).val(),
            pickDate = pickDate.split('~')[0];

        vewDate = pickDate.trim();
    }

    $(targetDiv).datepicker("setDate", vewDate);
  });

  $.datepicker.setDefaults({
    dayNamesShort: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  });
  // datpicker 닫힌후 리스트 로드 이벤트 추가
  $('.date-filter').datepicker("option", "onSelect", function(selectedDate, t){
      var dData = $(this).data().datepicker; // datepicker data

      if (!dData.pickDate) { // 선택 전
          dData.pickDate = true; // 선택 유무
          dData.startDay = selectedDate; // 시작일
          delete dData.endDay; // 종료일 삭제
      } else { // 선택 후
          dData.endDay = selectedDate; // 종료일

          if (dData.startDay > selectedDate) { // 종료일이 시작일보다 작을 경우
              dData.endDay = dData.startDay;
              dData.startDay = selectedDate;
          }

          if (dData.endDay) { // 종료일이 있다면
              delete dData.pickDate; // 선택 유뮤 삭제
          }
      }

      var startDay = dData.startDay, // 시작일
          endDay = dData.endDay, // 종료일
          appendDate = startDay; // 시작일 ~ 종료일

      if (endDay) {
          appendDate = startDay + ' ~ ' + endDay;
      }

      $(targetInput).val(appendDate);
      if (startDay && endDay) {
          setTimeout(function () {
              targetWidget.fadeOut(200);
          }, 300);

          // input data setting
          var rangeNumber = Math.floor(( Date.parse(endDay) - Date.parse(startDay) ) / 86400000);
          var setDate = startDay;
          for (var i = 0;  i <= rangeNumber; i++) {
            var checkSameDate = false;
            var html = '<tr>' +
                '<td>' +
                '<input type="checkbox" name="idx" value="" /></td>' +
                '<td><input type="hidden" name="saleDate" value="' + $.datepicker.formatDate('yy-mm-dd', new Date(setDate)) + '" />' + $.datepicker.formatDate('yy-mm-dd (D)', new Date(setDate)) +
                '</td>' +
                '<td><input type="text" name="saleStartTime" placeholder="10:00:00" style="text-align: center" value="" /></td>' +
                '<td><input type="text" name="saleEndTime" placeholder="10:30:00" style="text-align: center" value="" /></td>' +
                '<td><input type="text" name="saleLimit" placeholder="30" style="text-align: center" value="" /></td>' +
                '<td>'
                + '<div class="btns">'
                + '<button class="saveSaleDateButton active" onclick="saleDateButton(this, \'w\')">저장</button>'
                + '<button class="modifySaleDateButton disabled" onclick="saleDateButton(this, \'m\')" disabled>수정</button>'
                + '</div>'
                + '</td>'
                + '</tr>';
            // 자식 중에서 선택한 날짜가 존재한다면 해당 데이터는 append 하지 않는다
            $('input[name=saleDate]').each(function (j) {
              if ($('input[name=saleDate]').eq(j).attr("value") == $.datepicker.formatDate('yy-mm-dd', new Date(setDate))) {
                checkSameDate = true;
                return false;
              }
            });
            setDate = addDay(setDate);
            if (checkSameDate === true) {
              continue;
            }
            $('.setSalesLines').append(html);
          }
      }
  });

  // 삭제
  $('.saleDeleteButton').click(function() {
    var idxCheckList = $('input:checkbox[name=idx]:checked'),
        arrLength = idxCheckList.length;
    if (arrLength < 1) {
      alert('select item for delete');
      return false;
    }
    idxCheckList.each(function() {
      if (this.value == "") {
        $(this).parent().parent().remove();
        return true;
      }
      salesAjax(obj = {
        method: "post",
        url: "/api/driver/sales/" + this.value,
        data: {method: "DELETE"},
        func: function(result) {
          $(this).parent().parent().remove();
          return true;
        }
      });
    });
    callAlertDesignPop("삭제되었습니다", "");
    return false;
  });

  // 검색 버튼 눌렀을 때
  $('.jobSearchButton').click(function () {
    var cate1 = $('input[name=cate1]'),
        cate2 = $('input[name=cate2]'),
        cate3 = $('input[name=cate3]'),
        cate4 = $('input[name=cate4]');

    var submitData = {
      cate1: cate1.val(),
      cate2: cate2.val(),
      cate3: cate3.val(),
      cate4: cate4.val()
    };

    makeForm('get', '', submitData);

  });

  // 엑셀 파일 업로드
  $('.execlUploadButton').click(function(e) {
    e.preventDefault();
    $('input[name=file]').click();
  });
});

function changeValue(obj) {
  var fileName = obj.files;

  if (!/\.(xlsx)$/i.test(fileName[0].name)) {
    alert('xlsx 만 가능\n\n' + fileName[0].name);
    return false;
  }

  // 통과되었을 때 form sumbit
  var fileForm = document.upFileForm;
  fileForm.submit();
}
function saleDateButton(data, type) {
  var parentData = $(data).parent().parent().parent(),
      idx = parentData.find($('input[name=idx]')),
      saleDate = parentData.find($('input[name=saleDate]')),
      saleDateValue = saleDate.val().replace(/-/gi, ''),
      openTime = parentData.find($('input[name=saleStartTime]')),
      openTimeValue = openTime.val().replace(/:/gi, ''),
      endTime = parentData.find($('input[name=saleEndTime]')),
      endTimeValue = endTime.val().replace(/:/gi, ''),
      saleLimit = parentData.find($('input[name=saleLimit]')),
      saleLimitValue = saleLimit.val(),
      apiUrl = "/api/driver/sales",
      day = new Date(),
      apiMethod = "post";

  // TODO : 시간 유효성검사 @Jinn (20.07.01)

  // 판매 제한 날짜
  if (saleDateValue == '') {
    callAlertDesignPop('판매제한 날짜 데이터가 없습니다', '');
    return false;
  }

  // 오픈 시간
  if (openTimeValue == '') {
    callAlertDesignPop('오픈 시간을 입력해 주세요', openTime);
    return false;
  }

  // 종료 시간
  if (endTimeValue == '') {
    callAlertDesignPop('마감 시간을 입력해 주세요', endTime);
    return false;
  }

  if(Number(openTimeValue) > Number(endTimeValue)){ // 오픈시간이 마감시간보다 크면 X
    callAlertDesignPop('시간을 정확히 입력해 주세요', openTime);
    return false;
  }

  // 판매 한도
  if (!$.isNumeric(saleLimitValue)) {
    saleLimit.val(0);
    callAlertDesignPop('판매 한도를 입력해 주세요', saleLimit);
    return false;
  }

  if (saleLimitValue == '') {
    callAlertDesignPop('판매 한도를 입력해 주세요', saleLimit);
    return false;
  }

  if (type === 'm') {
    apiUrl = apiUrl + "/" + idx.val();
    apiMethod = "PUT";
  }

  salesAjax(obj = {
    method: "post",
    url: apiUrl,
    data: {method: apiMethod, salesDate: saleDateValue, openTime: openTimeValue, closeTime: endTimeValue, salesLimit: saleLimitValue},
    func: function(result) {
      if (result.error) {
        callAlertDesignPop(result.error.message, '');
        // dom remove
        parentData.remove();
        return false;
      }
      if (result.data) {
        // 자신 셋팅
        idx.val(result.data);
        $(data).attr("disabled", true);
        $(data).removeClass("active");
        $(data).addClass("disabled");
        // 형제 셋팅
        var nextNode = $(data).next();
        nextNode.removeAttr("disabled");
        nextNode.removeClass("disabled");
        nextNode.addClass("active");
        // 팝
        callAlertDesignPop('저장되었습니다', '');
      } else {
        callAlertDesignPop('수정되었습니다', '');
      }
    }
  });
}

function salesAjax(obj) {
  $.ajax({
    method: obj.method,
    url: obj.url,
    data: JSON.stringify(obj.data),
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

function callAlertDesignPop(msg, obj) {
  miDesignPop.alert({
    dConHe: 110,
    dWidth: 380,
    dCopy: msg,
    dYesAc: function () {
      if (obj != ''){
        obj.focus();
      }
    }
  });
}

function makeForm(method, url, params) {
  // form 생성
  var form = document.createElement("form");
  // form.setAttribute("charset", "UTF-8");
  form.setAttribute("method", method); // Get 또는 Post 입력
  form.setAttribute("action", url);

  // form data
  Object.keys(params).map(function (keyVal) {
    hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", keyVal);
    hiddenField.setAttribute("value", params[keyVal]);
    form.appendChild(hiddenField);
  });

  document.body.appendChild(form);
  form.submit();
}

function addDay(Day) {
  var newday = new Date(Day);
  newday.setDate(newday.getDate() + 1);
  return $.datepicker.formatDate('yy-mm-dd', newday);
}
