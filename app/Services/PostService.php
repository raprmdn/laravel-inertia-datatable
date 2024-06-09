<?php

namespace App\Services;

use App\Facades\DataTable;
use App\Http\Resources\PostResource;
use App\Models\Category;
use App\Models\Post;

class PostService
{
    public function index(): \Illuminate\Http\Resources\Json\AnonymousResourceCollection
    {
        $query = Post::query();
        $categories = Category::all();

        $pluckReplace = $categories->pluck('slug')->map(function ($slug) {
            return 'categories.slug:' . $slug;
        })->toArray();

        $filters = str_replace(
            $categories->pluck('slug')->map(fn($slug) => 'categories:' . $slug)->toArray(),
            $pluckReplace,
            request()->query('filters') ?? []
        );

        $query->join('users', 'users.id', '=', 'posts.user_id')
            ->select('posts.*', 'users.name as author');

        $result = DataTable::query($query)
            ->with(['user', 'categories'])
            ->searchable(['title', 'user.name', 'categories.name'])
            ->applyFilters($filters)
            ->allowedFilters(array_merge(
            ['status:published', 'status:draft', 'status:archived'],
                $pluckReplace
            ))
            ->allowedSorts(['title', 'created_at', 'author'])
            ->make();

        return PostResource::collection($result);
    }
}
