<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RolePermissionSeeder::class,
            CategoriesSeeder::class,
        ]);

        User::factory()
            ->count(2500)
            ->create();

        User::factory()
            ->count(2500)
            ->unverified()
            ->create();

        $this->seedPosts();

        $this->call(UserRoleSeeder::class);
    }

    private function seedPosts(): void
    {
        $userIds = User::query()
            ->pluck('id')
            ->all();

        if ($userIds === []) {
            return;
        }

        $remaining = 200000;
        $chunkSize = 5000;

        while ($remaining > 0) {
            $count = min($chunkSize, $remaining);

            Post::factory()
                ->count($count)
                ->state(fn () => [
                    'user_id' => fake()->randomElement($userIds),
                ])
                ->create();

            $remaining -= $count;
        }
    }
}
