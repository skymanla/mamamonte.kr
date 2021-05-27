<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/oauth/save', [\App\Http\Controllers\User\UserInformationController::class, 'saveCenterTitle'])->name('oauth.save');
Route::post('/consulting/save', [\App\Http\Controllers\Consulting\WriteController::class, 'saveConsulting'])->name('consulting.save');
Route::post('/consulting/voc/{seq}')->name('consulting.vocDetail');
