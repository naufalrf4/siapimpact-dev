<?php

namespace App\Services;

use App\Models\Applicant;
use App\Services\Contracts\FileStorageServiceInterface;
use App\Services\Contracts\RegistrationServiceInterface;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class RegistrationService implements RegistrationServiceInterface
{
    protected int $maxSubmissionsPerIpPerDay;

    protected string $honeypotField = 'website';

    public function __construct(
        protected FileStorageServiceInterface $fileStorageService
    ) {
        $this->maxSubmissionsPerIpPerDay = (int) config('siapimpact.max_submissions_per_ip_per_day', 5);
    }

    public function validateAndCreate(array $data, array $files, string $ip): Applicant
    {
        $storedPaths = [];

        try {
            return DB::transaction(function () use ($data, $files, $ip, &$storedPaths) {
                $fileTypes = [
                    'recommendation_letter' => 'recommendation_letter',
                    'twibbon_screenshot' => 'twibbon_screenshot',
                    'essay_file' => 'essay',
                ];

                foreach ($fileTypes as $formField => $storageType) {
                    if (isset($files[$formField]) && $files[$formField] instanceof UploadedFile) {
                        $path = $this->fileStorageService->store($files[$formField], $storageType);
                        $storedPaths[$storageType] = $path;
                    }
                }

                $applicantData = $this->prepareApplicantData($data, $storedPaths, $ip);

                return Applicant::create($applicantData);
            });
        } catch (\Throwable $e) {
            $this->rollbackStoredFiles($storedPaths);
            throw new RuntimeException('Failed to create registration: ' . $e->getMessage(), 0, $e);
        }
    }

    public function checkIpLimit(string $ip): bool
    {
        $count = Applicant::fromIpToday($ip)->count();

        return $count >= $this->maxSubmissionsPerIpPerDay;
    }

    public function isHoneypotFilled(array $data): bool
    {
        if (!isset($data[$this->honeypotField])) {
            return false;
        }

        return !empty($data[$this->honeypotField]);
    }

    protected function prepareApplicantData(array $data, array $storedPaths, string $ip): array
    {
        return [
            'full_name' => $data['full_name'],
            'national_id' => $data['national_id'],
            'birth_place' => $data['birth_place'],
            'birth_date' => $data['birth_date'],
            'phone' => $data['phone'],
            'email' => $data['email'],
            'domicile' => $data['domicile'],
            'university' => $data['university'],
            'study_program' => $data['study_program'],
            'semester' => $data['semester'],
            'gpa' => $data['gpa'],
            'recommendation_letter_path' => $storedPaths['recommendation_letter'] ?? null,
            'twibbon_image_path' => null,
            'twibbon_screenshot_path' => $storedPaths['twibbon_screenshot'] ?? null,
            'essay_file_path' => $storedPaths['essay'] ?? null,
            'ip_address' => $ip,
        ];
    }

    protected function rollbackStoredFiles(array $storedPaths): void
    {
        foreach ($storedPaths as $path) {
            try {
                $this->fileStorageService->delete($path);
            } catch (\Throwable) {
            }
        }
    }

    public function getMaxSubmissionsPerIpPerDay(): int
    {
        return $this->maxSubmissionsPerIpPerDay;
    }

    public function setMaxSubmissionsPerIpPerDay(int $max): void
    {
        $this->maxSubmissionsPerIpPerDay = $max;
    }
}
