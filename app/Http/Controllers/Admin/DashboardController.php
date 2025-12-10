<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Contracts\DashboardServiceInterface;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        protected DashboardServiceInterface $dashboardService
    ) {}

    public function index(): Response
    {
        $statistics = $this->dashboardService->getStatistics();

        return Inertia::render('Admin/Dashboard', [
            'statistics' => $statistics,
        ]);
    }
}
