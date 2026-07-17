<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Raprmdn\DataTables\Facades\DataTable;

class CategoryController extends Controller
{
    public function index(Request $request): Response
    {
        [$sort, $allowedSorts] = DataTable::parseSort(
            [
                'name' => 'name',
                'slug' => 'slug',
                'posts' => 'posts_count',
                'created_at' => 'created_at',
            ],
        );

        $categories = DataTable::query(Category::query())
            ->withCount('posts')
            ->searchable(['name', 'slug'])
            ->applySort($sort)
            ->allowedSorts($allowedSorts)
            ->orderBy('name', 'asc')
            ->perPage($request->integer('limit', 10))
            ->make();

        return Inertia::render('categories/index', [
            'categories' => CategoryResource::collection($categories),
        ]);
    }
}
