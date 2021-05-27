<?php
/*
 * Copyright (c) 2021.5.20
 * author: ryan-dev
 */

namespace App\Providers;


use App\Composers\TitleTextComposer;
use Illuminate\Support\ServiceProvider;

class CenterTitleProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        view()->composer(
            ['main', 'contents.*'],
            TitleTextComposer::class
        );
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
