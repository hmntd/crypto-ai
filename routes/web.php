<?php

use App\Http\Controllers\CryptoAnalysisController;
use App\Http\Controllers\FavouriteCryptoController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::prefix('api')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/cryptos', [
        CryptoAnalysisController::class,
        'index'
    ])->name('api.cryptos.index');

    Route::get('/cryptos/{crypto}/ai-analysis', [
        CryptoAnalysisController::class,
        'show'
    ])->name('api.cryptos.ai-analysis');

    Route::post('/cryptos/{crypto}/favourite', [
        FavouriteCryptoController::class,
        'toggle'
    ])->name('api.cryptos.favourite');
});

require __DIR__ . '/settings.php';
