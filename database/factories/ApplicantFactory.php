<?php

namespace Database\Factories;

use App\Models\Applicant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Applicant>
 */
class ApplicantFactory extends Factory
{
    protected $model = Applicant::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'full_name' => fake()->name(),
            'national_id' => fake()->numerify('################'), // 16 digits
            'birth_place' => fake()->city(),
            'birth_date' => fake()->date('Y-m-d', '-18 years'),
            'phone' => fake()->numerify('08##########'),
            'email' => fake()->unique()->safeEmail(),
            'domicile' => fake()->city(),
            'university' => fake()->randomElement([
                'Universitas Indonesia',
                'Institut Teknologi Bandung',
                'Universitas Gadjah Mada',
                'Universitas Airlangga',
                'Universitas Diponegoro',
            ]),
            'study_program' => fake()->randomElement([
                'Teknik Informatika',
                'Sistem Informasi',
                'Ilmu Komputer',
                'Teknik Elektro',
                'Manajemen',
            ]),
            'semester' => fake()->numberBetween(1, 14),
            'gpa' => fake()->randomFloat(2, 2.5, 4.0),
            'recommendation_letter_path' => 'recommendation_letters/' . fake()->uuid() . '.pdf',
            'twibbon_image_path' => 'twibbon_images/' . fake()->uuid() . '.jpg',
            'twibbon_screenshot_path' => 'twibbon_screenshots/' . fake()->uuid() . '.png',
            'essay_file_path' => 'essays/' . fake()->uuid() . '.pdf',
            'ip_address' => fake()->ipv4(),
        ];
    }
}
