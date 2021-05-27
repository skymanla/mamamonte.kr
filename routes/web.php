<?php
/*
 * Copyright (c) 2021.5.12
 * author: ryan-dev
 */

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [\App\Http\Controllers\MainController::class, 'main'])->name('main');
Route::name('user.')->group(function () {
    Route::get('/user/oauth2/{oauthType}', [\App\Http\Controllers\User\OauthController::class, 'oauthReceivers'])->name('oauth');
    Route::get('/user/info', [\App\Http\Controllers\User\UserInformationController::class, 'main'])->name('info');
    Route::get('/user/logout', function () {
        session()->flush();
        return redirect()->route('main');
    })->name('logout');
});

Route::name('student.')->group(function () {
  Route::get('/student/list', [\App\Http\Controllers\Students\ListController::class, 'main'])->name('list');
});

Route::name('consulting.')->group(function () {
  Route::get('/consulting/list', [\App\Http\Controllers\Consulting\ListController::class, 'main'])->name('list');
  Route::get('/consulting/new', [\App\Http\Controllers\Consulting\WriteController::class, 'main'])->name('write');
});

