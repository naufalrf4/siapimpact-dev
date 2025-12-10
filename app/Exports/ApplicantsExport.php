<?php

namespace App\Exports;

use App\Models\Applicant;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

/**
 * Export class for applicants data to Excel format.
 * Requirements: 11.1, 11.2, 11.3, 11.5
 */
class ApplicantsExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
{
    /**
     * @var array{
     *     search?: string|null,
     *     university?: string|null,
     *     domicile?: string|null
     * }
     */
    protected array $filters;

    /**
     * Create a new export instance.
     *
     * @param array{
     *     search?: string|null,
     *     university?: string|null,
     *     domicile?: string|null
     * } $filters
     */
    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    /**
     * Build the query for export.
     * Requirements: 11.2 - Export with active filters includes only filtered applicants
     *
     * @return Builder<Applicant>
     */
    public function query(): Builder
    {
        $query = Applicant::query();

        if (!empty($this->filters['search'])) {
            $query->search($this->filters['search']);
        }

        if (!empty($this->filters['university'])) {
            $query->byUniversity($this->filters['university']);
        }

        if (!empty($this->filters['domicile'])) {
            $query->byDomicile($this->filters['domicile']);
        }

        return $query->orderBy('created_at', 'desc');
    }


    /**
     * Define the headings for the export.
     * Requirements: 11.3 - Include identity, academic, and metadata fields
     *
     * @return array<string>
     */
    public function headings(): array
    {
        return [
            'ID',
            'Full Name',
            'National ID (NIK)',
            'Birth Place',
            'Birth Date',
            'Phone',
            'Email',
            'Domicile',
            'University',
            'Study Program',
            'Semester',
            'GPA',
            'IP Address',
            'Submitted At',
        ];
    }

    /**
     * Map the applicant data for export.
     * Requirements: 11.3 - Include identity, academic, and metadata fields
     *
     * @param Applicant $applicant
     * @return array<mixed>
     */
    public function map($applicant): array
    {
        return [
            $applicant->id,
            $applicant->full_name,
            $applicant->national_id,
            $applicant->birth_place,
            $applicant->birth_date?->format('Y-m-d'),
            $applicant->phone,
            $applicant->email,
            $applicant->domicile,
            $applicant->university,
            $applicant->study_program,
            $applicant->semester,
            $applicant->gpa,
            $applicant->ip_address,
            $applicant->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}
