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
            'status' => fake()->randomElement(
                array_column(PostStatus::cases(), 'value'),
            ),
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function (Post $post): void {
            static $categoryIds;

            $categoryIds ??= Category::query()
                ->pluck('id')
                ->all();

            if ($categoryIds === []) {
                $categoryIds = Category::factory()
                    ->count(3)
                    ->create()
                    ->pluck('id')
                    ->all();
            }

            $maximum = min(3, count($categoryIds));
            $count = fake()->numberBetween(1, $maximum);

            $post->categories()->sync(
                fake()->randomElements($categoryIds, $count),
            );
        });
    }
}
