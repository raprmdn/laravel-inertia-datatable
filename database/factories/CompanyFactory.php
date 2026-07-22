<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\Country;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Company>
 */
class CompanyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->company();

        return [
            'country_id' => Country::factory(),
            'slug' => Str::slug($name).'-'.fake()->unique()->numberBetween(100000, 999999),
            'name' => $name,
        ];
    }
}
