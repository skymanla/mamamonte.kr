<?php
/*
 * Copyright (c) 2021.5.26
 * author: ryan-dev
 */

namespace App\Models\Member;


use Illuminate\Database\Eloquent\Model;

class StudentState extends Model
{
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        $this->table = 'student_state';
        $this->timestamps = false;
        $this->primaryKey = 'seq';
    }
}
