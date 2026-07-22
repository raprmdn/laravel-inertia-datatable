<?php

namespace Database\Factories;

use App\Models\Agent;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Agent>
 */
class AgentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'team' => fake()->optional(0.8)->randomElement(['North', 'Central', 'South']),
            'active' => fake()->boolean(90),
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn (): array => [
            'active' => false,
        ]);
    }
}
