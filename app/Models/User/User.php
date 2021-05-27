<?php
/*
 * Copyright (c) 2021.5.14
 * author: ryan-dev
 */

namespace App\Models\User;


use App\Models\Center\CenterTitle;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        $this->timestamps = false;
        $this->primaryKey = 'seq';
        $this->table = 'user';
    }

    public function centerTitle()
    {
        return $this->hasOne(CenterTitle::class, 'seq', 'ct_seq');
    }
}
