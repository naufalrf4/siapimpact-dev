<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegistrationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Identity fields (Requirements 1.1)
            'full_name' => ['required', 'string', 'max:255'],
            'national_id' => ['required', 'string', 'size:16', 'unique:applicants,national_id'],
            'birth_place' => ['required', 'string', 'max:255'],
            'birth_date' => ['required', 'date', 'before:today'],
            'phone' => ['required', 'string', 'max:20'],
            'email' => ['required', 'email', 'max:255', 'unique:applicants,email'],
            'domicile' => ['required', 'string', 'max:255'],

            // Academic fields (Requirements 1.2)
            'university' => ['required', 'string', 'max:255'],
            'study_program' => ['required', 'string', 'max:255'],
            'semester' => ['required', 'integer', 'min:1', 'max:14'],
            'gpa' => ['required', 'numeric', 'min:0', 'max:4'],

            // File uploads (Requirements 5.2, 5.3)
            // Document files: max 10MB for recommendation letter and essay
            // Image files: max 5MB for twibbon images
            'recommendation_letter' => ['required', 'file', 'mimes:pdf', 'max:10240'],
            'twibbon_screenshot' => ['required', 'file', 'mimes:jpg,jpeg,png', 'max:5120'],
            'essay_file' => ['required', 'file', 'mimes:pdf', 'max:10240'],

            // Honeypot field (Requirements 4.2)
            // Must be empty - if filled, it's likely a bot
            'website' => ['size:0'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'national_id.size' => 'NIK harus terdiri dari 16 digit.',
            'national_id.unique' => 'NIK sudah terdaftar dalam sistem.',
            'email.unique' => 'Email sudah terdaftar dalam sistem.',
            'birth_date.before' => 'Tanggal lahir harus sebelum hari ini.',
            'semester.min' => 'Semester minimal adalah 1.',
            'semester.max' => 'Semester maksimal adalah 14.',
            'gpa.min' => 'IPK minimal adalah 0.',
            'gpa.max' => 'IPK maksimal adalah 4.',
            'recommendation_letter.mimes' => 'Surat rekomendasi harus berformat PDF.',
            'recommendation_letter.max' => 'Ukuran surat rekomendasi maksimal 10MB.',
            'twibbon_screenshot.mimes' => 'Screenshot twibbon harus berformat JPG atau PNG.',
            'twibbon_screenshot.max' => 'Ukuran screenshot twibbon maksimal 5MB.',
            'essay_file.mimes' => 'Essay harus berformat PDF.',
            'essay_file.max' => 'Ukuran essay maksimal 10MB.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'full_name' => 'nama lengkap',
            'national_id' => 'NIK',
            'birth_place' => 'tempat lahir',
            'birth_date' => 'tanggal lahir',
            'phone' => 'nomor telepon',
            'email' => 'email',
            'domicile' => 'domisili',
            'university' => 'universitas',
            'study_program' => 'program studi',
            'semester' => 'semester',
            'gpa' => 'IPK',
            'recommendation_letter' => 'surat rekomendasi',
            'twibbon_screenshot' => 'screenshot twibbon',
            'essay_file' => 'essay',
        ];
    }
}
