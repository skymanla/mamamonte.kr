<?php
/*
 * Copyright (c) 2021.5.26
 * author: ryan-dev
 */

namespace App\Models\Payment;


use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        $this->table = 'payment_info';
        $this->timestamps = false;
        $this->primaryKey = 'seq';
    }

    public function getPayDtAttribute($payDt)
    {
        return date('y.n.d', strtotime($payDt));
    }

    public function getInfoAttribute($info)
    {
        switch ($info) {
            case 'card':
                return '카드';
            case 'cash':
                return '현금';
            default:
                return '-';
        }
    }

    public function getPriceAttribute($price)
    {
        return number_format($price);
    }
}
