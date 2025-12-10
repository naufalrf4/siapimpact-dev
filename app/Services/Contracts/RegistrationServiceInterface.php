<?php

namespace App\Services\Contracts;

use App\Models\Applicant;

interface RegistrationServiceInterface
{
    public function validateAndCreate(array $data, array $files, string $ip): Applicant;

    public function checkIpLimit(string $ip): bool;

    public function isHoneypotFilled(array $data): bool;
}
