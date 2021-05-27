<?php
/*
 * Copyright (c) 2021.5.26
 * author: ryan-dev
 */

namespace App\Models\Voc;


use Illuminate\Database\Eloquent\Model;

class Voc extends Model
{
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        $this->table = 'voc';
        $this->timestamps = false;
        $this->primaryKey = 'seq';
    }
}
