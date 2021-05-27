/*
mibank validate
write : gray
since : 2019-10-11
*/
var miValidate = {
    isLangCheckText : ['ENG','KR','NUM','SPC'], //영어,한글,숫자,특수문자
    langType : [
        /[a-zA-Z]/,	//영어
        /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/, //한글
        /[0-9]/,	//숫자
        /[~!@#$%^&*()_+|<>?:{}]/, //특수문자
    ],
    isValCheck : function (data) { //빈값 체크 및 특수문자만 or  띄어쓰기만, 줄바꿈만 있는지 체크
        data = String(data); // 문자로 변환
        data = this.isSpaceDelete(data); //스페이스 삭제
        return data.length > 0; //문자열이 0 이상일 경우만
    },
    isSpaceCheck : function (data) { //띄어쓰기, 줄바꿈 체크
        data = String(data); // 문자로 변환
        return /\s/.test(data) || /\n/.test(data); //띄어쓰기 및 줄바꿈이 포함 되어있는지
    },
    isSpaceDelete : function (data) { //띄어쓰기 삭제
        data = String(data); // 문자로 변환
        return data.replace(/\s/gi, '');
    },
    isLangCheck : function (data,lang) { //해당 언어 포함 체크
        var nIndex = this.isLangCheckText.indexOf(lang), //lang 의 index 할당
            value = this.langType[nIndex]; //lnagType 의 index의 value값
        return value.test(data); //value 값 포함 여부
    },
    isLangOnly : function (data,lang) { //해당 언어만 있냐를  체크
        var dLang,
            etcLang,
            nIndex = this.isLangCheckText.indexOf(lang); //lang 의 index 할당

        this.langType.forEach(function(value, index){
            if(nIndex==index){
                return dLang = true; //lang 값
            } else {
                return !value.test(data) ? false : etcLang = value.test(data); //해당 언어가 아닌경우
            }
        });

        return dLang && !etcLang && this.isValCheck(data); //해당언어만 있으면서 value 값이 있을경우
    },
    isLangOnlyType : function (data,lang) { //해당 언어 제외 삭제
        var type = /[^0-9]/g;
        switch (lang){
            case "ENG" :
                    type = /[^a-zA-Z]/g;
                break;
            case "ENGSP" : // 영문 이름 (띄어쓰기 포함)
                    type = /[^a-zA-Z ]/g;
                break;
            case "KR" :
                    type = /[a-z0-9]|[ \[\]{}()<>?|`~!@#$%^&*-_+=,.;:\"'\\]/g;
                break;
            case "NUM" :
                    type = /[^0-9]/g;
                break;
        }
        data = String(data); // 문자로 변환
        data = data.replace(type,"");
        return data;
    },
    isLangOnlyTypeDelete : function (data,lang) { //해당 언어 삭제
        switch (lang){
            case "ENG" :
                    type = /[a-zA-Z]/g;
                break;
            case "KR" :
                    type = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g;
                break;
            case "NUM" :
                    type = /[0-9]/g;
                break;
            case "SPC" :
                    type = /[`~!@#$%^&*()_=+|<>?:{}'"]/g;
                break;
        }

        data = String(data); // 문자로 변환
        data = data.replace(type,"");
        return data;
    },
    isNumComma : function (data) { //콤마 추가
        data = String(data); // 문자로 변환
        data = this.isNumCommaDelete(data); //콤마 삭제
        data = this.isSpaceDelete(data); //띄어쓰기 삭제
        return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); //숫정의 경우만 3자리수마다 콤마 추가
    },
    isNumCommaDelete : function (data) { //콤마 삭제
        return data.replace(/,/g, '');
    },
    isLengMin : function (data,num) { //글자 최소 길이
        data = String(this.isSpaceDelete(data));
        num = Number(num);
        return data && data.length >= num ? true : false;
    },
    isLengMax : function (data,num) { //글자 최대 길이
        data = String(this.isSpaceDelete(data));
        num = Number(num);
        return data && data.length <= num ? true : false;
    },
    isEmailCheck : function (data) { //메일 주소 체크
        return /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/.test(data);
    },
    isMemNumCheck : function (data) { // 주민등록번호 및 외국인등록번호 체크
        var arr_ssn = [], // 주민등록번호 담을 배열
            compare = [2,3,4,5,6,7,8,9,2,3,4,5], // 공식에 필요한 넘버
            sum     = 0; // 합산할 숫자 초기화

        // 공식: M = (11 - ((2×A + 3×B + 4×C + 5×D + 6×E + 7×F + 8×G + 9×H + 2×I + 3×J + 4×K + 5×L) % 11)) % 11
        for (var i = 0; i<13; i++){  // 주민등록번호 배열 에 담기
            arr_ssn[i] = data.substring(i,i+1);
        }

        for (var i = 0; i<12; i++){ // 주민등록번호를 공식넘버를 곱해서 합산
            sum = sum + (arr_ssn[i] * compare[i]);
        }

        //sum = (11 - (sum % 11)) % 10; // 주민등록번호 마지막 번호 공식
        //sum = ((11 - (sum % 11)) % 10 +2 ) % 10; // 외국인등록번호 마지막 번호 공식

        if ( (11 - (sum % 11)) % 10 == arr_ssn[12] ){ // 주민등록번호 마지막 번호 공식 과 실제 주민등록번호 마지막이 같은지 체크
            return 'kr';
        } else if ( sum = ((11 - (sum % 11)) % 10 +2 ) % 10 == arr_ssn[12] ){
            return 'foreigner';
        } else {
            return false;
        }
    },
    isMemBirth : function(data){ // 생년월일 앞에 년도 두자리 추가 and 주민번호 앞자리 유효성
        var defaults = {
            nowDate : '', // 현재년도
            strBirth : '', // 주민번호 앞자리
            endBirth : '', // 주민번호 뒷자리
            gender : '', // 성별 M,F = 남, 여
            birthCheck : true, // 생일 유효성
        };
        var nData = $.extend(defaults, data);

        var memYearsLa = nData.strBirth.substr(0, 2); // 생일년도 뒷자리2
        var memBirthMonth = nData.strBirth.substr(2, 2); // 생일 달
        var memBirthDay = nData.strBirth.substr(4, 2); // 생일 일
        var nowYears = String(nData.nowDate).substr(2, 2); // 현재년도 뒷자리2

        if(!nData.endBirth){ // 주민번호 뒷자리가 없을경우
            if (nData.gender === 'M') { // 남
                if (Number(memYearsLa) <= Number(nowYears)) {
                    nData.endBirth = '3333333';
                } else {
                    nData.endBirth = '1111111';
                }
            } else if (nData.gender === 'F') { // 여
                if (Number(memYearsLa) <= Number(nowYears)) {
                    nData.endBirth = '4444444';
                } else {
                    nData.endBirth = '2222222';
                }
            }
        }

        var endBirthFr = nData.endBirth.substr(0, 1), // 주민번호 뒷자리 앞번호1자리
            memYearsFr = '00'; // 생일년도 앞자리2
        switch(Number(endBirthFr)) {
            //1900년대(남자:1, 여자:2)
            case 1:
            case 2:
            case 5:
            case 6:
                memYearsFr = '19';
                break;
            //2000년대(남자:3, 여자:4)
            case 3:
            case 4:
            case 7:
            case 8:
                memYearsFr = '20';
                break;
            //1800년대(남자:9, 여자:0)
            case 9:
            case 0:
                memYearsFr = '18';
                break;
            default:
                return false;
                break;
        }

        var splitBirthYear = Number(memYearsFr + memYearsLa); // 생년
        var splitBirthMonth = Number(memBirthMonth); // 월
        var splitBirthDay = Number(memBirthDay); // 일

        var monthDayArr = [31,28,31,30,31,30,31,31,30,31,30,31]; // 월별 마지막 일수
        var monthLastDay = monthDayArr[splitBirthMonth-1];

        if( (splitBirthYear%4 == 0 && splitBirthYear%100 != 0) || splitBirthYear%400 == 0 ) { // 윤년 체크
            monthLastDay = 29;
        }

        if(splitBirthMonth < 1 || splitBirthMonth > 12 || splitBirthDay < 1 || splitBirthDay > monthLastDay){ // 생일(월 일 - 윤년포함) 체크
            nData.birthCheck =false;
        }

        nData.fullDate = memYearsFr + memYearsLa + '-' + memBirthMonth + '-' + memBirthDay; // 생일 년-월-일
        return nData;
    },
    isTelFrCheck : function(data){ // 전화번호 앞자리 체크
        data = String(data); // 문자로 변환
        return /01([0|1|6|7|8|9]?)/.test(data);
    },
    isTelHyphen : function(data){ // 전화번호 하이픈 추가
        data = String(data); // 문자로 변환
        data = this.isSpaceDelete(data); //띄어쓰기 삭제
        if(data.length > 10){
            return data.toString().replace(/(\d{3})(\d{4})(\d{3})/, "$1-$2-$3"); // 휴대번호 하이픈 삽입 000-0000-0000
        }else{
            return data.toString().replace(/(\d{3})(\d{3})(\d{3})/, "$1-$2-$3"); // 휴대번호 하이픈 삽입 000-000-0000
        }
    },
    isInsuranceAge : function(data){ // 보험나이 계산
        
        var defaults = {
            strDate : '', // 보험 시작일
            memBirth : '', // 생일
        };
        var nData = $.extend(defaults, data);

        var n = new Date(nData.strDate);
        var d = new Date(nData.memBirth);
        n.setMonth(n.getMonth()+5);
        if(n.getDate()<d.getDate()){	
            n.setMonth(n.getMonth()-1);
        }
        if(n.getMonth()<d.getMonth()){
            n.setFullYear(n.getFullYear()-1);
        }

        return Number(n.getFullYear())-Number(d.getFullYear()); 
    },
    isConsonantCheck : function (data) { // 자음 모음 체크
        return /[ㄱ-ㅎ|ㅏ-ㅣ]/.test(data); //value 값 포함 여부
    },
    isPostPosition : function (data, type){
        var lastChar = data.charCodeAt(data.length - 1),    
            isLastYes = (lastChar - 0xAC00) % 28 > 0 ? true : false,
            postposition = '';
        switch (type) {
            case '은/는' : 
                postposition = (isLastYes) ? '은' : '는';
                break;
            case '이/가' : 
                postposition = (isLastYes) ? '이' : '기';
                break;
            case '을/를' : 
                postposition = (isLastYes) ? '을' : '를';
                break;
            case '와/과' : 
                postposition = (isLastYes) ? '과' : '와';   
                break;
            case '이' :  // -이 붙이기 (봉봉'이', 하루)
                postposition = (isLastYes) ? '이' : '';   
                break;
        }

        return postposition;
    },
    isBrowerCheck: function() { // 브라우저 체크
        var browser  = navigator.userAgent.toLowerCase();
        if(/whale/g.test(browser)){ // WHALE
            return 'whale';
        }else if(/opr/g.test(browser)){ // OPERA
            return 'opera';
        }else if(/edge/g.test(browser)){ // EDGE
            return 'edge';
        }else if(/firefox/g.test(browser)){ // FF
            return 'firefox';
        }else if(/(?=.*chrome)(?=.*safari)/.test(browser)){ // CHROME
            return 'chrome';
        }else if((navigator.appName == 'Netscape' && browser.indexOf('trident') != -1) || (browser.indexOf("msie") != -1)){ // IE
            return 'ie';
        }else if(/safari/.test(browser)){ // SAFARI
            return 'safari';
        }
    }
};