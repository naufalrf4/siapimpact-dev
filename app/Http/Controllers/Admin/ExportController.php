<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Contracts\ExportServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExportController extends Controller
{
    public function __construct(
        protected ExportServiceInterface $exportService
    ) {}

    public function export(Request $request): StreamedResponse|BinaryFileResponse
    {
        $format = $request->input('format', 'csv');
        
        $filters = [
            'search' => $request->input('search'),
            'university' => $request->input('university'),
            'domicile' => $request->input('domicile'),
        ];

        Log::info('Export requested', [
            'admin_user_id' => $request->user()?->id,
            'format' => $format,
            'filters' => $filters,
            'timestamp' => now()->toIso8601String(),
        ]);

        if ($format === 'xlsx') {
            return $this->exportService->exportToExcel($filters);
        }

        return $this->exportService->exportToCsv($filters);
    }
}
