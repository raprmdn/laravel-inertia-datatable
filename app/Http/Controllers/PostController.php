<?php

namespace App\Http\Controllers;

use App\Enums\PostStatus;
use App\Http\Resources\App\PostResource;
use App\Models\Category;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Raprmdn\DataTables\Facades\DataTable;

class PostController extends Controller
{
    public function index(Request $request): Response
    {
        [$columnFilters, $allowedFilters, $dateRanges] = DataTable::parseFilters(
            $request->query('filters', []),
            [
                'author' => 'user.name',
                'category' => 'categories.slug',
                'status' => 'status',
                'created_at' => 'created_at',
            ],
        );

        [$sort, $allowedSorts] = DataTable::parseSort([
            'title' => 'title',
            'slug' => 'slug',
            'excerpt' => 'excerpt',
            'author' => 'user.name',
            'status' => 'status',
            'created_at' => 'created_at',
        ]);

        $posts = DataTable::query(Post::query())
            ->with(['user:id,name', 'categories:id,name'])
            ->searchable(['title', 'slug', 'excerpt', 'user.name'])
            ->applyFilters($columnFilters)
            ->allowedFilters($allowedFilters)
            ->applyDateRanges($dateRanges)
            ->applySort($sort)
            ->allowedSorts($allowedSorts)
            ->perPage($request->integer('limit', 10))
            ->make();

        return Inertia::render('posts/index', [
            'posts' => PostResource::collection($posts),
            'categories' => Category::query()
                ->select(['name', 'slug'])
                ->orderBy('name')
                ->get(),
            'selected_authors' => $this->selectedAuthorOptions($columnFilters),
            'statuses' => PostStatus::options(),
        ]);
    }

    private function selectedAuthorOptions(array $columnFilters): array
    {
        return collect($columnFilters)
            ->filter(fn (string $filter): bool => str_starts_with($filter, 'user.name:'))
            ->map(fn (string $filter): string => explode(':', $filter, 2)[1])
            ->filter(fn (string $name): bool => $name !== '')
            ->unique()
            ->map(fn (string $name): array => [
                'value' => $name,
                'label' => $name,
            ])
            ->values()
            ->all();
    }
}
