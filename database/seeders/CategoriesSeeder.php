<?php

namespace Database\Seeders;

use App\Models\Category;
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
        ])->each(fn (string $category) => Category::updateOrCreate(
            ['slug' => str()->slug($category)],
            ['name' => $category],
        ));
    }
}
