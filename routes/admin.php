<?php

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
|
| These routes handle the admin dashboard for SIAP Impact / SAKINA platform.
| All routes require authentication and are prefixed with /admin.
| Requirements: 5.1, 5.2, 13.1, 13.2
|
*/

use App\Http\Controllers\Admin\ApplicantController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ExportController;
use App\Http\Controllers\Admin\FileDownloadController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('admin.dashboard');

    /*
    |--------------------------------------------------------------------------
    | Export Routes (MUST be before parameterized routes to prevent 404)
    |--------------------------------------------------------------------------
    | Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, UI/UX 5.1, 5.2
    */
    Route::get('/applicants/export', [ExportController::class, 'export'])
        ->name('admin.applicants.export');

    /*
    |--------------------------------------------------------------------------
    | Applicant Management Routes
    |--------------------------------------------------------------------------
    | Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 9.1, 9.2, 9.3, 9.4, 9.5
    */
    Route::get('/applicants', [ApplicantController::class, 'index'])
        ->name('admin.applicants.index');
    Route::get('/applicants/{id}', [ApplicantController::class, 'show'])
        ->where('id', '[0-9]+')
        ->name('admin.applicants.show');

    /*
    |--------------------------------------------------------------------------
    | File Download Routes
    |--------------------------------------------------------------------------
    | Requirements: 10.1, 10.2, 10.3, 10.4, 10.5
    */
    Route::get('/applicants/{id}/download/{type}', [FileDownloadController::class, 'download'])
        ->where('id', '[0-9]+')
        ->where('type', 'recommendation_letter|twibbon_image|twibbon_screenshot|essay')
        ->name('admin.applicants.download');
});
