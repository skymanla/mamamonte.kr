<?php
/*
 * Copyright (c) 2021.5.14
 * author: ryan-dev
 */

namespace App\Models\Center;


use Illuminate\Database\Eloquent\Model;

class CenterTitle extends Model
{
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        $this->timestamps = false;
        $this->primaryKey = 'seq';
        $this->table = 'center_title';
    }

    public function user()
    {

    }
}
