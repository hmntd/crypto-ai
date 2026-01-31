<?php

use App\Http\Controllers\CryptoAnalysisController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/cryptos', [
        CryptoAnalysisController::class,
        'index'
    ])->name('api.cryptos.index');

    Route::get('/cryptos/{crypto}/ai-analysis', [
        CryptoAnalysisController::class,
        'show'
    ])->name('api.cryptos.ai-analysis');
});
