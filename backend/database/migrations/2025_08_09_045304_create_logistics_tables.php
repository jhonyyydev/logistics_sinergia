<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Products
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('type', 50);
            $table->date('date_creation');
            $table->timestamps();
        });

        // Deliveries
        Schema::create('deliveries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->string('product_type', 50);
            $table->integer('quantity');
            $table->date('log_date');
            $table->date('delivery_date');
            $table->decimal('shipping_price', 10, 2);
            $table->decimal('final_price', 10, 2);
            $table->string('guide', 10)->unique();
            $table->string('delivery_type', 50);
            $table->timestamps();
        });

        // Destinations
        Schema::create('destinations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('location');
            $table->integer('capacity')->nullable();
            $table->string('destination_type', 50);
            $table->timestamps();
        });

        // Transport Units
        Schema::create('transport_units', function (Blueprint $table) {
            $table->id();
            $table->string('identifier')->unique();
            $table->string('unit_type', 50);
            $table->boolean('active')->default(true);
            $table->timestamps();
        });

        // Transport Deliveries
        Schema::create('transport_deliveries', function (Blueprint $table) {
            $table->unsignedBigInteger('delivery_id')->primary();
            $table->foreign('delivery_id')->references('id')->on('deliveries')->cascadeOnDelete();

            $table->foreignId('transport_unit_id')->constrained('transport_units')->cascadeOnDelete();
            $table->foreignId('destination_id')->constrained('destinations')->cascadeOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transport_deliveries');
        Schema::dropIfExists('transport_units');
        Schema::dropIfExists('destinations');
        Schema::dropIfExists('deliveries');
        Schema::dropIfExists('products');
    }
};
