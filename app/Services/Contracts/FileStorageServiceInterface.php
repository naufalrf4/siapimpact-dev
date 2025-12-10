<?php

namespace App\Services\Contracts;

use App\Models\Applicant;
use Illuminate\Http\UploadedFile;
use Symfony\Component\HttpFoundation\StreamedResponse;

interface FileStorageServiceInterface
{
    public function store(UploadedFile $file, string $type): string;

    public function getPath(Applicant $applicant, string $type): ?string;

    public function download(string $path, string $filename): StreamedResponse;

    public function delete(string $path): bool;
}
