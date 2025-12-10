<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Seeder for creating initial admin user account.
 * 
 * Requirements: 5.2
 * 
 * This seeder creates a default admin account for the SIAP Impact / SAKINA
 * admin dashboard. The credentials should be changed immediately after
 * first login in production environments.
 */
class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@siapimpact.id'],
            [
                'name' => 'Admin SIAP Impact',
                'email' => 'admin@siapimpact.id',
                'password' => Hash::make('SiapImpact2025!'),
                'email_verified_at' => now(),
            ]
        );
    }
}
