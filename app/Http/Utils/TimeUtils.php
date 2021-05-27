<?php
/*
 * Copyright (c) 2021.5.24
 * author: ryan-dev
 */

namespace App\Http\Utils;

use DateTime;

class TimeUtils
{
    public static function calcMonthly($birth)
    {
        if (empty($birth)) {
            return 0;
        }

        $toBirth = new DateTime($birth);
        $now = new DateTime();

        $diff = date_diff($now, $toBirth);

        return $diff->days / 30;
    }
}
