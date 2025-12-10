<?php

namespace App\Services;

use App\Models\Applicant;
use App\Services\Contracts\ApplicantServiceInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ApplicantService implements ApplicantServiceInterface
{
    protected array $sortableColumns = [
        'full_name',
        'email',
        'university',
        'domicile',
        'semester',
        'gpa',
        'created_at',
    ];

    public function getPaginated(array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        $query = Applicant::query();

        if (!empty($filters['search'])) {
            $query->search($filters['search']);
        }

        if (!empty($filters['university'])) {
            $query->byUniversity($filters['university']);
        }

        if (!empty($filters['domicile'])) {
            $query->byDomicile($filters['domicile']);
        }

        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortDirection = $filters['sort_direction'] ?? 'desc';

        if (!in_array($sortBy, $this->sortableColumns, true)) {
            $sortBy = 'created_at';
        }

        $sortDirection = strtolower($sortDirection) === 'asc' ? 'asc' : 'desc';

        $query->orderBy($sortBy, $sortDirection);

        return $query->paginate($perPage);
    }

    public function getById(int $id): ?Applicant
    {
        return Applicant::find($id);
    }
}
