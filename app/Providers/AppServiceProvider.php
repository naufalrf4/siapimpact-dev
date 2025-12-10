<?php

namespace App\Providers;

use App\Services\ApplicantService;
use App\Services\Contracts\ApplicantServiceInterface;
use App\Services\Contracts\DashboardServiceInterface;
use App\Services\Contracts\ExportServiceInterface;
use App\Services\Contracts\FileStorageServiceInterface;
use App\Services\Contracts\RegistrationServiceInterface;
use App\Services\DashboardService;
use App\Services\ExportService;
use App\Services\FileStorageService;
use App\Services\RegistrationService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(FileStorageServiceInterface::class, FileStorageService::class);
        $this->app->bind(RegistrationServiceInterface::class, RegistrationService::class);
        $this->app->bind(DashboardServiceInterface::class, DashboardService::class);
        $this->app->bind(ApplicantServiceInterface::class, ApplicantService::class);
        $this->app->bind(ExportServiceInterface::class, ExportService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
