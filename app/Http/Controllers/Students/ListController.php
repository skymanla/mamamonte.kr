<?php
/*
 * Copyright (c) 2021.5.21
 * author: ryan-dev
 */

namespace App\Http\Controllers\Students;


use App\Http\Controllers\Controller;

class ListController extends Controller
{
    public function main()
    {
        return view('contents.student.list',
        ['tabRequest' => 'studentList']);
    }
}
