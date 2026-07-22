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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')
                ->constrained()
                ->restrictOnDelete();
            $table->foreignId('agent_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();
            $table->string('order_number')->unique();
            $table->string('reference')->nullable()->index();
            $table->string('status')->index();
            $table->string('payment_status')->index();
            $table->decimal('total_amount', 12, 2)->index();
            $table->dateTime('placed_at')->index();
            $table->dateTime('shipped_at')->nullable()->index();
            $table->json('metadata')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
