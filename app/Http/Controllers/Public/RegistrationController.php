<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegistrationRequest;
use App\Services\Contracts\RegistrationServiceInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;

class RegistrationController extends Controller
{
    public function __construct(
        protected RegistrationServiceInterface $registrationService
    ) {}

    public function create(): Response
    {
        return Inertia::render('Register/Index');
    }

    public function store(RegistrationRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $ip = $request->ip();

        if ($this->registrationService->isHoneypotFilled($validated)) {
            Log::warning('Registration honeypot triggered', [
                'ip_address' => $ip,
                'timestamp' => now()->toIso8601String(),
            ]);

            return back()->withErrors([
                'general' => 'Terjadi kesalahan saat memproses pendaftaran.',
            ]);
        }

        if ($this->registrationService->checkIpLimit($ip)) {
            Log::warning('Registration IP limit exceeded', [
                'ip_address' => $ip,
                'timestamp' => now()->toIso8601String(),
            ]);

            return back()->withErrors([
                'general' => 'Batas pengiriman harian telah tercapai. Silakan coba lagi besok.',
            ]);
        }

        $files = [
            'recommendation_letter' => $request->file('recommendation_letter'),
            'twibbon_screenshot' => $request->file('twibbon_screenshot'),
            'essay_file' => $request->file('essay_file'),
        ];

        try {
            $applicant = $this->registrationService->validateAndCreate($validated, $files, $ip);

            Log::info('Registration successful', [
                'applicant_id' => $applicant->id,
                'email' => $applicant->email,
                'ip_address' => $ip,
                'timestamp' => now()->toIso8601String(),
            ]);

            return redirect()->route('register.success');
        } catch (RuntimeException $e) {
            Log::error('Registration failed', [
                'ip_address' => $ip,
                'error' => $e->getMessage(),
                'timestamp' => now()->toIso8601String(),
            ]);

            return back()->withErrors([
                'general' => 'Terjadi kesalahan saat memproses pendaftaran. Silakan coba lagi.',
            ])->withInput($request->except(['recommendation_letter', 'twibbon_screenshot', 'essay_file']));
        }
    }

    public function success(): Response
    {
        return Inertia::render('Register/Success');
    }
}
