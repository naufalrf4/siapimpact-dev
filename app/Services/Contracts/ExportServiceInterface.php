<?php

namespace App\Services\Contracts;

use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

interface ExportServiceInterface
{
    public function exportToCsv(array $filters = []): StreamedResponse;

    public function exportToExcel(array $filters = []): BinaryFileResponse;
}
