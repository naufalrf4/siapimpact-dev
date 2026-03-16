<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Applicant;
use App\Services\Contracts\ApplicantServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ApplicantController extends Controller
{
    public function __construct(
        protected ApplicantServiceInterface $applicantService
    ) {}

    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->input('search'),
            'university' => $request->input('university'),
            'domicile' => $request->input('domicile'),
            'sort_by' => $request->input('sort_by', 'created_at'),
            'sort_direction' => $request->input('sort_direction', 'desc'),
        ];

        $perPage = (int) $request->input('per_page', 20);
        $perPage = min(max($perPage, 10), 100);

        $applicants = $this->applicantService->getPaginated($filters, $perPage);

        $universities = Applicant::query()
            ->select('university')
            ->distinct()
            ->orderBy('university')
            ->pluck('university');

        $domiciles = Applicant::query()
            ->select('domicile')
            ->distinct()
            ->orderBy('domicile')
            ->pluck('domicile');

        return Inertia::render('Admin/Applicants/Index', [
            'applicants' => $applicants,
            'filters' => $filters,
            'universities' => $universities,
            'domiciles' => $domiciles,
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $applicant = $this->applicantService->getById($id);

        if (!$applicant) {
            return response()->json([
                'message' => 'Applicant not found',
            ], 404);
        }

        return response()->json([
            'applicant' => [
                'id' => $applicant->id,
                'full_name' => $applicant->full_name,
                'national_id' => $applicant->national_id,
                'birth_place' => $applicant->birth_place,
                'birth_date' => $applicant->birth_date->format('Y-m-d'),
                'phone' => $applicant->phone,
                'email' => $applicant->email,
                'domicile' => $applicant->domicile,
                'university' => $applicant->university,
                'study_program' => $applicant->study_program,
                'semester' => $applicant->semester,
                'gpa' => $applicant->gpa,
                'has_recommendation_letter' => !empty($applicant->recommendation_letter_path),
                'has_instagram_follow_proof' => !empty($applicant->twibbon_image_path),
                'has_twibbon_screenshot' => !empty($applicant->twibbon_screenshot_path),
                'has_essay_file' => !empty($applicant->essay_file_path),
                'created_at' => $applicant->created_at->toIso8601String(),
                'ip_address' => $applicant->ip_address,
            ],
        ]);
    }
}
