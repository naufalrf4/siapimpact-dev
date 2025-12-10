<?php

namespace App\Services;

use App\Models\Applicant;
use App\Services\Contracts\ExportServiceInterface;
use Illuminate\Support\Facades\Log;
use OpenSpout\Common\Entity\Row;
use OpenSpout\Writer\XLSX\Writer;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExportService implements ExportServiceInterface
{
    protected array $headers = [
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

    public function exportToCsv(array $filters = []): StreamedResponse
    {
        $filename = $this->generateFilename('csv');

        Log::info('Export to CSV initiated', [
            'filters' => $filters,
            'filename' => $filename,
        ]);

        $response = new StreamedResponse(function () use ($filters) {
            $handle = fopen('php://output', 'w');

            if ($handle === false) {
                return;
            }

            fwrite($handle, "\xEF\xBB\xBF");

            fputcsv($handle, $this->headers);

            $this->getFilteredQuery($filters)
                ->orderBy('created_at', 'desc')
                ->chunk(500, function ($applicants) use ($handle) {
                    foreach ($applicants as $applicant) {
                        fputcsv($handle, $this->mapApplicantToRow($applicant));
                    }
                });

            fclose($handle);
        });

        $response->headers->set('Content-Type', 'text/csv; charset=UTF-8');
        $response->headers->set('Content-Disposition', 'attachment; filename="' . $filename . '"');
        $response->headers->set('Cache-Control', 'no-cache, no-store, must-revalidate');
        $response->headers->set('Pragma', 'no-cache');
        $response->headers->set('Expires', '0');

        return $response;
    }

    public function exportToExcel(array $filters = []): BinaryFileResponse
    {
        $filename = $this->generateFilename('xlsx');
        $tempPath = storage_path('app/temp/' . $filename);

        // Ensure temp directory exists
        if (!is_dir(dirname($tempPath))) {
            mkdir(dirname($tempPath), 0755, true);
        }

        Log::info('Export to Excel initiated', [
            'filters' => $filters,
            'filename' => $filename,
        ]);

        $writer = new Writer();
        $writer->openToFile($tempPath);

        // Write header row
        $writer->addRow(Row::fromValues($this->headers));

        // Write data rows in chunks
        $this->getFilteredQuery($filters)
            ->orderBy('created_at', 'desc')
            ->chunk(500, function ($applicants) use ($writer) {
                foreach ($applicants as $applicant) {
                    $writer->addRow(Row::fromValues($this->mapApplicantToRow($applicant)));
                }
            });

        $writer->close();

        return response()->download($tempPath, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ])->deleteFileAfterSend(true);
    }

    protected function getFilteredQuery(array $filters): \Illuminate\Database\Eloquent\Builder
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

        return $query;
    }

    protected function mapApplicantToRow(Applicant $applicant): array
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

    protected function generateFilename(string $extension): string
    {
        $timestamp = now()->format('Y-m-d_His');
        return "applicants_export_{$timestamp}.{$extension}";
    }
}
