<?php

namespace Database\Seeders;

use App\Models\Applicant;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class ApplicantSeeder extends Seeder
{
    public function run(): void
    {
        // Create diverse applicants with varied characteristics
        $universities = [
            'Universitas Indonesia',
            'Institut Teknologi Bandung',
            'Universitas Gadjah Mada',
            'Institut Teknologi Sepuluh Nopember',
            'Universitas Airlangga',
            'Universitas Brawijaya',
            'Universitas Diponegoro',
            'Universitas Padjadjaran',
            'Universitas Sebelas Maret',
            'Universitas Hasanuddin',
            'Universitas Andalas',
            'Universitas Negeri Semarang',
            'Institut Pertanian Bogor',
            'Universitas Pendidikan Indonesia',
            'Telkom University',
        ];

        $domiciles = [
            'Jakarta',
            'Bandung',
            'Surabaya',
            'Yogyakarta',
            'Semarang',
            'Medan',
            'Makassar',
            'Palembang',
            'Tangerang',
            'Depok',
            'Bekasi',
            'Malang',
            'Solo',
            'Denpasar',
            'Padang',
        ];

        // Create 80 applicants with distributed characteristics
        for ($i = 0; $i < 80; $i++) {
            // Distribute semesters (more in mid-range)
            $semesterDistribution = [3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 8];
            $semester = $semesterDistribution[array_rand($semesterDistribution)];

            // Distribute GPA (bell curve, most around 3.3-3.7)
            $gpaDistribution = [
                2.85, 2.95, // Low
                3.00, 3.10, 3.15, 3.20, 3.25, // Lower mid
                3.30, 3.35, 3.40, 3.45, 3.50, 3.55, 3.60, 3.65, 3.70, // Mid (most common)
                3.75, 3.80, 3.85, 3.90, // Upper mid
                3.95, 4.00, // High
            ];
            $gpa = $gpaDistribution[array_rand($gpaDistribution)];

            // Distribute registration dates (last 60 days, with clusters)
            $daysAgo = rand(1, 60);
            if (rand(1, 100) <= 40) {
                // 40% within last 2 weeks
                $daysAgo = rand(1, 14);
            }
            $createdAt = Carbon::now()->subDays($daysAgo)->subHours(rand(0, 23))->subMinutes(rand(0, 59));

            Applicant::factory()->create([
                'university' => $universities[array_rand($universities)],
                'domicile' => $domiciles[array_rand($domiciles)],
                'semester' => $semester,
                'gpa' => $gpa,
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ]);
        }
    }
}
