<?php

namespace App\Http\Controllers\Api;

use App\Enums\PostStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\Api\PostApiResource;
use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Raprmdn\DataTables\Facades\DataTable;

class PostController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        [$columnFilters, $allowedFilters, $dateRanges] = DataTable::parseFilters([
            'status' => 'status',
            'user_id' => 'user_id',
            'category' => 'categories.name',
            'created_at' => 'created_at',
        ]);
        [$sort, $allowedSorts] = DataTable::parseSort([
            'title' => 'title',
            'slug' => 'slug',
            'status' => 'status',
            'created_at' => 'created_at',
            'updated_at' => 'updated_at',
            'author' => 'user.name',
        ]);

        $posts = DataTable::query(Post::query()->select('posts.*'))
            ->with(['user', 'categories'])
            ->searchable(['title', 'slug', 'excerpt', 'user.name', 'categories.name'])
            ->applyFilters($columnFilters)
            ->allowedFilters($allowedFilters)
            ->applyDateRanges($dateRanges)
            ->applySort($sort)
            ->allowedSorts($allowedSorts)
            ->perPage($request->integer('limit', 10))
            ->make();

        return PostApiResource::collection($posts)->additional([
            'statuses' => PostStatus::options(),
            'categories' => $this->categoryOptions(),
            'authors' => $this->authorOptions(),
        ]);
    }

    private function categoryOptions(): EloquentCollection
    {
        return Category::query()
            ->select(['name', 'slug'])
            ->orderBy('name')
            ->get();
    }

    private function authorOptions(): EloquentCollection
    {
        return User::query()
            ->select(['id', 'name'])
            ->orderBy('name')
            ->get();
    }
}
