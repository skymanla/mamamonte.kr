<?php
/*
 * Copyright (c) 2021.5.26
 * author: ryan-dev
 */

namespace App\Http\Utils;


class StringUtils
{
    public static function returnMsg($successType, $msg) {
        return ['state' => $successType, 'msg' => $msg];
    }

    // 숫자만 남기는 정규식
    public static function replaceNumber($str)
    {
        return preg_replace("/[^0-9]*/s", "", trim($str));
    }

    // 전화번호 validate
    public static function validatePhoneNumber($str): bool
    {
        return preg_match("/(^01[016789])([0-9]{3,4})([0-9]{4})/", self::replaceNumber($str)) ? true : false;
    }

    // 전화번호 하이픈
    public static function phoneHyphen($phone): string
    {
        $phoneLength = strlen($phone);
        switch ($phoneLength) {
            case "10":
                if (substr($phone, 0, 2) == "02") {
                    $phone1 = substr($phone, 0, 2);
                    $phone2 = substr($phone, 2, 4);
                    $phone3 = substr($phone, 6, 10);
                } else {
                    $phone1 = substr($phone, 0, 3);
                    $phone2 = substr($phone, 3, 3);
                    $phone3 = substr($phone, 6, 10);
                }
                break;
            case "11":
                $phone1 = substr($phone, 0, 3);
                $phone2 = substr($phone, 3, 4);
                $phone3 = substr($phone, 7, 4);
                break;
            default:
                $phone1 = substr($phone, 0, 4);
                $phone2 = substr($phone, 4, 4);
                $phone3 = substr($phone, 8, $phoneLength-1);
                break;
        }
        return $phone1."-".$phone2."-".$phone3;
    }
}
