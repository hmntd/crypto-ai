<?php

use App\Http\Controllers\CryptoAnalysisController;
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
});

require __DIR__ . '/settings.php';
