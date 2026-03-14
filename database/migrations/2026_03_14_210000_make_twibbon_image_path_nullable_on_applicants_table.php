<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('applicants', function (Blueprint $table) {
            $table->string('twibbon_image_path', 500)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('applicants')
            ->whereNull('twibbon_image_path')
            ->update(['twibbon_image_path' => '']);

        Schema::table('applicants', function (Blueprint $table) {
            $table->string('twibbon_image_path', 500)->nullable(false)->change();
        });
    }
};
