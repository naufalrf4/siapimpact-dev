<?php

namespace App\Services\Contracts;

interface DashboardServiceInterface
{
    public function getStatistics(): array;
}
