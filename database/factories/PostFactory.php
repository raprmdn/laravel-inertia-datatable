<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PostFactory extends Factory
{
    protected $model = Post::class;

    public function definition(): array
    {
        return [
            'user_id'    => User::factory(),
            'title'      => $title = $this->faker->sentence(),
            'slug'       => str()->slug($title) . '-' . $this->faker->randomNumber(),
            'excerpt'    => $this->faker->text(),
            'content'    => $this->faker->text(1000),
            'status'     => $this->faker->randomElement(\App\Enums\PostEnum::values()),
        ];
    }

    public function withCategories(): PostFactory
    {
        return $this->afterCreating(function (Post $post) {
            $categories = Category::inRandomOrder()->take(rand(1, 3))->get();
            $post->categories()->attach($categories);
        });
    }
}
