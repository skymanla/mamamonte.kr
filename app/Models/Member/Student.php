<?php
/*
 * Copyright (c) 2021.5.26
 * author: ryan-dev
 */

namespace App\Models\Member;


use App\Http\Utils\StringUtils;
use App\Models\Payment\Payment;
use App\Models\Voc\Voc;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        $this->timestamps = false;
        $this->primaryKey = 'seq';
        $this->table = 'students';
    }

    public function getFirstComeDateAttribute($firstComeDate)
    {
        return date('y.n.d', strtotime($firstComeDate));
    }

    public function getBirthAttribute($birth)
    {
        return date('y.m.d', strtotime($birth));
    }

    public function getTelAttribute($tel)
    {
        return StringUtils::phoneHyphen($tel);
    }

    public function studentState() {
        return $this->hasOne(StudentState::class, 'st_seq', 'seq');
    }

    public function paymentInfo() {
        return $this->hasOne(Payment::class, 'st_seq', 'seq');
    }

    public function voc() {
        return $this->hasOne(Voc::class, 'st_seq', 'seq');
    }
}
