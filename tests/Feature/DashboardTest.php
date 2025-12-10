<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_login_when_accessing_dashboard_redirect()
    {
        $response = $this->get('/dashboard');
        $response->assertRedirect('/admin/dashboard');
    }

    public function test_authenticated_users_can_visit_the_admin_dashboard()
    {
        $this->actingAs($user = User::factory()->create());

        $this->get(route('admin.dashboard'))->assertOk();
    }
}
