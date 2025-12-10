<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Applicant extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'full_name',
        'national_id',
        'birth_place',
        'birth_date',
        'phone',
        'email',
        'domicile',
        'university',
        'study_program',
        'semester',
        'gpa',
        'recommendation_letter_path',
        'twibbon_image_path',
        'twibbon_screenshot_path',
        'essay_file_path',
        'ip_address',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
            'gpa' => 'decimal:2',
            'semester' => 'integer',
        ];
    }

    /**
     * Scope to search by name, email, or university.
     *
     * @param Builder<Applicant> $query
     * @param string|null $term
     * @return Builder<Applicant>
     */
    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        if (empty($term)) {
            return $query;
        }

        $searchTerm = '%' . $term . '%';

        return $query->where(function (Builder $q) use ($searchTerm) {
            $q->where('full_name', 'like', $searchTerm)
              ->orWhere('email', 'like', $searchTerm)
              ->orWhere('university', 'like', $searchTerm);
        });
    }

    /**
     * Scope to filter by university.
     *
     * @param Builder<Applicant> $query
     * @param string|null $university
     * @return Builder<Applicant>
     */
    public function scopeByUniversity(Builder $query, ?string $university): Builder
    {
        if (empty($university)) {
            return $query;
        }

        return $query->where('university', $university);
    }

    /**
     * Scope to filter by domicile.
     *
     * @param Builder<Applicant> $query
     * @param string|null $domicile
     * @return Builder<Applicant>
     */
    public function scopeByDomicile(Builder $query, ?string $domicile): Builder
    {
        if (empty($domicile)) {
            return $query;
        }

        return $query->where('domicile', $domicile);
    }

    /**
     * Scope to get applicants from a specific IP address submitted today.
     * Used for IP-based rate limiting.
     *
     * @param Builder<Applicant> $query
     * @param string $ip
     * @return Builder<Applicant>
     */
    public function scopeFromIpToday(Builder $query, string $ip): Builder
    {
        return $query->where('ip_address', $ip)
                     ->whereDate('created_at', now()->toDateString());
    }
}
