<?php

use App\Http\Controllers\Public\RegistrationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('/register', [RegistrationController::class, 'create'])
    ->name('register.create');

Route::post('/register', [RegistrationController::class, 'store'])
    ->middleware(['throttle:' . config('siapimpact.registration_rate_limit', 10) . ',1'])
    ->name('register.store');

Route::get('/register/success', [RegistrationController::class, 'success'])
    ->name('register.success');

Route::redirect('/dashboard', '/admin/dashboard');

require __DIR__.'/settings.php';
require __DIR__.'/admin.php';
