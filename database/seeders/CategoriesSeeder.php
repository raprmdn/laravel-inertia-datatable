<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class CategoriesSeeder extends Seeder
{
    public function run(): void
    {
        collect([
            'Laravel',
            'PHP',
            'JavaScript',
            'Vue.js',
            'React.js',
            'Node.js',
            'Tailwind CSS',
            'Inertia.js',
        ])->each(fn ($category) => \App\Models\Category::create([
            'name' => $category,
            'slug' => str()->slug($category),
        ]));
    }
}
