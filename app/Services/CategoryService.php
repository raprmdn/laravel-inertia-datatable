<?php

namespace App\Services;

use App\Facades\DataTable;
use App\Http\Resources\CategoryResource;
use App\Models\Category;

class CategoryService
{
    public function index(): \Illuminate\Http\Resources\Json\AnonymousResourceCollection
    {
        $result = DataTable::query(Category::query())
            ->searchable(['name'])
            ->allowedSorts(['name'])
            ->make();

        return CategoryResource::collection($result);
    }

    public function all()
    {
        return Category::all();
    }
}
