<?php

namespace App\Services;

use App\Models\Applicant;
use App\Services\Contracts\DashboardServiceInterface;
use Illuminate\Support\Facades\DB;

class DashboardService implements DashboardServiceInterface
{
    public function getStatistics(): array
    {
        $summary = Applicant::query()
            ->selectRaw('COUNT(*) as total_applicants')
            ->selectRaw('MAX(created_at) as latest_submission')
            ->selectRaw('AVG(gpa) as avg_gpa')
            ->first();

        $byUniversity = Applicant::query()
            ->select('university', DB::raw('COUNT(*) as count'))
            ->groupBy('university')
            ->orderByDesc('count')
            ->get()
            ->map(fn ($item) => [
                'university' => $item->university,
                'count' => (int) $item->count,
            ])
            ->toArray();

        $byDomicile = Applicant::query()
            ->select('domicile', DB::raw('COUNT(*) as count'))
            ->groupBy('domicile')
            ->orderByDesc('count')
            ->get()
            ->map(fn ($item) => [
                'domicile' => $item->domicile,
                'count' => (int) $item->count,
            ])
            ->toArray();

        $bySemester = Applicant::query()
            ->select('semester', DB::raw('COUNT(*) as count'))
            ->groupBy('semester')
            ->orderBy('semester')
            ->get()
            ->map(fn ($item) => [
                'semester' => (int) $item->semester,
                'count' => (int) $item->count,
            ])
            ->toArray();

        // GPA Distribution in ranges
        $gpaDistribution = Applicant::query()
            ->selectRaw("
                CASE 
                    WHEN gpa >= 3.75 THEN '3.75-4.00'
                    WHEN gpa >= 3.50 THEN '3.50-3.74'
                    WHEN gpa >= 3.25 THEN '3.25-3.49'
                    WHEN gpa >= 3.00 THEN '3.00-3.24'
                    ELSE '< 3.00'
                END as gpa_range,
                COUNT(*) as count
            ")
            ->groupBy('gpa_range')
            ->orderByRaw("
                CASE gpa_range
                    WHEN '3.75-4.00' THEN 1
                    WHEN '3.50-3.74' THEN 2
                    WHEN '3.25-3.49' THEN 3
                    WHEN '3.00-3.24' THEN 4
                    ELSE 5
                END
            ")
            ->get()
            ->map(fn ($item) => [
                'range' => $item->gpa_range,
                'count' => (int) $item->count,
            ])
            ->toArray();

        // Daily registrations for last 30 days
        $dailyRegistrations = Applicant::query()
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn ($item) => [
                'date' => \Carbon\Carbon::parse($item->date)->format('d M'),
                'count' => (int) $item->count,
            ])
            ->toArray();

        return [
            'total_applicants' => (int) ($summary->total_applicants ?? 0),
            'latest_submission' => $summary->latest_submission,
            'avg_gpa' => (float) ($summary->avg_gpa ?? 0),
            'by_university' => $byUniversity,
            'by_domicile' => $byDomicile,
            'by_semester' => $bySemester,
            'gpa_distribution' => $gpaDistribution,
            'daily_registrations' => $dailyRegistrations,
        ];
    }
}
