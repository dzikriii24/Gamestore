<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->decimal('price', 8, 2);
            $table->decimal('discount', 5, 2)->default(0);
            $table->integer('rating')->default(0);
            $table->string('category');
            $table->string('platform')->default('PC');
            $table->string('developer');
            $table->string('publisher');
            $table->date('release_date');
            $table->string('image_url');
            $table->json('screenshots')->nullable();
            $table->string('video_url')->nullable();
            $table->json('tags')->nullable();
            $table->integer('age_rating')->default(18);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_trending')->default(false);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('games');
    }
};