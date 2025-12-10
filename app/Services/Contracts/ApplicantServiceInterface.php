<?php

namespace App\Services\Contracts;

use App\Models\Applicant;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ApplicantServiceInterface
{
    public function getPaginated(array $filters = [], int $perPage = 20): LengthAwarePaginator;

    public function getById(int $id): ?Applicant;
}
