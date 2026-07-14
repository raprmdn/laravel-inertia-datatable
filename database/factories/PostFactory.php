<?php

namespace Database\Factories;

use App\Enums\PostStatus;
use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PostFactory extends Factory
{
    public function definition(): array
    {
        $title = fake()->unique()->sentence(4);

        return [
            'user_id' => User::factory(),
            'title' => $title,
            'slug' => Str::slug($title).'-'.fake()->unique()->numberBetween(100000, 999999),
            'excerpt' => fake()->paragraph(),
            'content' => fake()->paragraphs(8, true),
            'status' => PostStatus::DRAFT->value,
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function (Post $post): void {
            $categories = Category::query()
                ->inRandomOrder()
                ->limit(fake()->numberBetween(1, 3))
                ->pluck('id');

            if ($categories->isEmpty()) {
                $categories = Category::factory()
                    ->count(3)
                    ->create()
                    ->pluck('id');
            }

            $post->categories()->sync($categories->all());
        });
    }
}
