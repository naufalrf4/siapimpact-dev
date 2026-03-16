<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Applicant;
use App\Services\Contracts\FileStorageServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\StreamedResponse;

class FileDownloadController extends Controller
{
    protected array $validTypes = [
        'recommendation_letter',
        'twibbon_image',
        'twibbon_screenshot',
        'essay',
    ];

    protected array $typeLabels = [
        'recommendation_letter' => 'Recommendation_Letter',
        'twibbon_image' => 'Instagram_Follow_Proof',
        'twibbon_screenshot' => 'Twibbon_Screenshot',
        'essay' => 'Essay',
    ];

    public function __construct(
        protected FileStorageServiceInterface $fileStorageService
    ) {}

    public function download(Request $request, int $id, string $type): StreamedResponse
    {
        if (!in_array($type, $this->validTypes, true)) {
            abort(404, 'Invalid file type');
        }

        $applicant = Applicant::find($id);
        if (!$applicant) {
            abort(404, 'Applicant not found');
        }

        $path = $this->fileStorageService->getPath($applicant, $type);
        if (!$path) {
            abort(404, 'File not found');
        }

        $filename = $this->generateFilename($applicant, $type, $path);

        Log::info('File download', [
            'admin_user_id' => $request->user()->id,
            'applicant_id' => $applicant->id,
            'file_type' => $type,
            'timestamp' => now()->toIso8601String(),
        ]);

        return $this->fileStorageService->download($path, $filename);
    }

    protected function generateFilename(Applicant $applicant, string $type, string $path): string
    {
        $sanitizedName = preg_replace('/[^a-zA-Z0-9_]/', '_', $applicant->full_name);
        $sanitizedName = preg_replace('/_+/', '_', $sanitizedName);
        $sanitizedName = trim($sanitizedName, '_');

        $extension = pathinfo($path, PATHINFO_EXTENSION);

        $typeLabel = $this->typeLabels[$type] ?? ucfirst($type);

        return "{$sanitizedName}_{$typeLabel}.{$extension}";
    }
}
