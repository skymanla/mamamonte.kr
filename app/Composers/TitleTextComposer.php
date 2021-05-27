<?php
/*
 * Copyright (c) 2021.5.20
 * author: ryan-dev
 */

namespace App\Composers;


use App\Http\Helpers\UserAuthenticationHelper;
use Illuminate\View\View;

class TitleTextComposer
{
    public $centerTitle = '';
    // 중분류 title
    private function getCenterTitle()
    {
        // session check
        if (UserAuthenticationHelper::isAuthenticated() && session()->has('user_info') && session()->has('user_info.ct_name')) {
            $this->centerTitle = " - " . session()->get('user_info.ct_name');
        }
    }

    public function compose(View $view)
    {
        $this->getCenterTitle();
        $view->with('centerTitle', $this->centerTitle);
    }
}
