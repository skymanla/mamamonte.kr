<?php
/*
 * Copyright (c) 2021.5.23
 * author: ryan-dev
 */

namespace App\Models;


use Illuminate\Database\Eloquent\Model;

class StateCd extends Model
{
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        $this->timestamps = false;
        $this->primaryKey = 'seq';
        $this->table = 'state_cd';
    }
}
