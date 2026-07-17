<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\CategoryApiResource;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Raprmdn\DataTables\Facades\DataTable;

class CategoryController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        [$columnFilters, $allowedFilters, $dateRanges] = DataTable::parseFilters([
            'created_at' => 'created_at',
        ]);
        [$sort, $allowedSorts] = DataTable::parseSort([
            'name' => 'name',
            'slug' => 'slug',
            'created_at' => 'created_at',
            'updated_at' => 'updated_at',
            'posts_count' => 'posts_count',
        ]);

        $categories = DataTable::query(Category::query())
            ->withCount('posts')
            ->searchable(['name', 'slug'])
            ->applyFilters($columnFilters)
            ->allowedFilters($allowedFilters)
            ->applyDateRanges($dateRanges)
            ->applySort($sort)
            ->allowedSorts($allowedSorts)
            ->perPage($request->integer('limit', 10))
            ->make();

        return CategoryApiResource::collection($categories);
    }
}
