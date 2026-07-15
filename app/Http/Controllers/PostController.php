<?php

namespace App\Http\Controllers;

use App\Enums\PostStatus;
use App\Http\Resources\App\PostResource;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
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
                'author' => 'user_id',
                'status' => 'status',
                'created_at' => 'created_at',
            ],
        );

        [$sort, $allowedSorts] = DataTable::parseSort($request->string('col')->toString(), [
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
            'authors' => $this->authorOptions(),
            'statuses' => $this->statusOptions(),
        ]);
    }

    private function authorOptions(): EloquentCollection
    {
        return User::query()
            ->select(['id', 'name'])
            ->orderBy('name')
            ->get();
    }

    private function statusOptions(): array
    {
        return collect(PostStatus::cases())
            ->map(fn (PostStatus $status) => [
                'label' => str($status->value)->headline()->toString(),
                'value' => $status->value,
            ])
            ->all();
    }
}
