<?php

namespace Database\Factories;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Agent;
use App\Models\Customer;
use App\Models\Order;
use Carbon\CarbonImmutable;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $status = fake()->randomElement(OrderStatus::cases());
        $placedAt = CarbonImmutable::instance(
            fake()->dateTimeBetween('2024-01-01', '2025-12-31 23:59:59'),
        );
        $shippedAt = in_array($status, [OrderStatus::SHIPPED, OrderStatus::DELIVERED], true)
            ? $placedAt->addDays(fake()->numberBetween(1, 7))
            : null;

        return [
            'customer_id' => Customer::factory(),
            'agent_id' => fake()->boolean(75) ? Agent::factory() : null,
            'order_number' => fake()->unique()->numerify('ORD-########'),
            'reference' => fake()->optional(0.7)->bothify('REF-####-????'),
            'status' => $status,
            'payment_status' => fake()->randomElement(PaymentStatus::cases()),
            'total_amount' => fake()->randomFloat(2, 25, 5000),
            'placed_at' => $placedAt,
            'shipped_at' => $shippedAt,
            'metadata' => [
                'source' => fake()->randomElement(['web', 'mobile', 'partner']),
                'flags' => fake()->randomElements(
                    ['gift', 'expedited', 'review'],
                    fake()->numberBetween(0, 3),
                ),
            ],
        ];
    }

    public function assigned(?Agent $agent = null): static
    {
        return $this->state(fn (): array => [
            'agent_id' => $agent?->getKey() ?? Agent::factory(),
        ]);
    }

    public function unassigned(): static
    {
        return $this->state(fn (): array => [
            'agent_id' => null,
        ]);
    }

    public function shipped(?DateTimeInterface $shippedAt = null): static
    {
        return $this->state(fn (): array => [
            'status' => OrderStatus::SHIPPED,
            'shipped_at' => $shippedAt ?? now(),
        ]);
    }

    public function unshipped(): static
    {
        return $this->state(fn (): array => [
            'shipped_at' => null,
        ]);
    }

    public function withSource(string $source = 'web'): static
    {
        return $this->state(function (array $attributes) use ($source): array {
            $metadata = is_array($attributes['metadata'] ?? null) ? $attributes['metadata'] : [];

            return [
                'metadata' => [...$metadata, 'source' => $source],
            ];
        });
    }

    /** @param list<string> $flags */
    public function withFlags(array $flags = ['gift']): static
    {
        return $this->state(function (array $attributes) use ($flags): array {
            $metadata = is_array($attributes['metadata'] ?? null) ? $attributes['metadata'] : [];

            return [
                'metadata' => [...$metadata, 'flags' => array_values($flags)],
            ];
        });
    }

    public function status(OrderStatus $status): static
    {
        return $this->state(fn (): array => [
            'status' => $status,
        ]);
    }

    public function paymentStatus(PaymentStatus $paymentStatus): static
    {
        return $this->state(fn (): array => [
            'payment_status' => $paymentStatus,
        ]);
    }
}
