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
    isTelFrCheck : function(data){
        data = String(data); // 문자로 변환
        return /01([0|1|6|7|8|9]?)/.test(data);
    }
}
