<?php

namespace App\Services;

use App\Models\Applicant;
use App\Services\Contracts\FileStorageServiceInterface;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;
use InvalidArgumentException;

class FileStorageService implements FileStorageServiceInterface
{
    protected string $disk = 'siapimpact';

    protected array $typeDirectories = [
        'recommendation_letter' => 'recommendation_letters',
        'twibbon_image' => 'twibbon_images',
        'twibbon_screenshot' => 'twibbon_screenshots',
        'essay' => 'essays',
    ];

    protected array $typePathFields = [
        'recommendation_letter' => 'recommendation_letter_path',
        'twibbon_image' => 'twibbon_image_path',
        'twibbon_screenshot' => 'twibbon_screenshot_path',
        'essay' => 'essay_file_path',
    ];

    public function store(UploadedFile $file, string $type): string
    {
        $this->validateType($type);

        $directory = $this->typeDirectories[$type];
        $extension = $file->getClientOriginalExtension();
        $filename = Str::uuid()->toString() . '.' . $extension;

        $path = $file->storeAs($directory, $filename, $this->disk);

        if ($path === false) {
            throw new \RuntimeException("Failed to store file of type: {$type}");
        }

        return $path;
    }

    public function getPath(Applicant $applicant, string $type): ?string
    {
        $this->validateType($type);

        $field = $this->typePathFields[$type];

        return $applicant->{$field};
    }

    public function download(string $path, string $filename): StreamedResponse
    {
        if (!Storage::disk($this->disk)->exists($path)) {
            throw new \RuntimeException("File not found: {$path}");
        }

        $mimeType = Storage::disk($this->disk)->mimeType($path);

        return Storage::disk($this->disk)->download($path, $filename, [
            'Content-Type' => $mimeType,
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    public function delete(string $path): bool
    {
        if (!Storage::disk($this->disk)->exists($path)) {
            return false;
        }

        return Storage::disk($this->disk)->delete($path);
    }

    public function exists(string $path): bool
    {
        return Storage::disk($this->disk)->exists($path);
    }

    public function fullPath(string $path): string
    {
        return Storage::disk($this->disk)->path($path);
    }

    protected function validateType(string $type): void
    {
        if (!array_key_exists($type, $this->typeDirectories)) {
            throw new InvalidArgumentException(
                "Invalid file type: {$type}. Supported types: " . implode(', ', array_keys($this->typeDirectories))
            );
        }
    }

    public function getDisk(): string
    {
        return $this->disk;
    }

    public function getSupportedTypes(): array
    {
        return array_keys($this->typeDirectories);
    }
}
