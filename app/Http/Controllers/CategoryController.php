<?php

namespace App\Http\Controllers;

use App\Http\Requests\QueryParamsRequest;
use App\Services\CategoryService;

class CategoryController extends Controller
{
    private CategoryService $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    public function index(QueryParamsRequest $request)
    {
        $categories = $this->categoryService->index();

        return inertia('Category/Index', [
            'categories' => $categories,
        ]);
    }
}
