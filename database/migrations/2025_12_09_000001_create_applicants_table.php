<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('applicants', function (Blueprint $table) {
            $table->id();

            // Identity fields
            $table->string('full_name', 255);
            $table->string('national_id', 16);
            $table->string('birth_place', 255);
            $table->date('birth_date');
            $table->string('phone', 20);
            $table->string('email', 255);
            $table->string('domicile', 255);

            // Academic fields
            $table->string('university', 255);
            $table->string('study_program', 255);
            $table->unsignedTinyInteger('semester');
            $table->decimal('gpa', 3, 2);

            // File path fields
            $table->string('recommendation_letter_path', 500);
            $table->string('twibbon_image_path', 500);
            $table->string('twibbon_screenshot_path', 500);
            $table->string('essay_file_path', 500);

            // Metadata fields
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();

            // Unique indexes
            $table->unique('email', 'applicants_email_unique');
            $table->unique('national_id', 'applicants_national_id_unique');

            // Regular indexes for filtering and sorting
            $table->index('university', 'applicants_university_index');
            $table->index('domicile', 'applicants_domicile_index');
            $table->index('created_at', 'applicants_created_at_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applicants');
    }
};
