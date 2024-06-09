<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Services\CategoryService;
use App\Services\PostService;

class PostController extends Controller
{
    private PostService $postService;
    private CategoryService $categoryService;

    public function __construct(
        PostService $postService,
        CategoryService $categoryService
    )
    {
        $this->postService = $postService;
        $this->categoryService = $categoryService;
    }

    public function index()
    {
        $posts = $this->postService->index();
        $categories = $this->categoryService->all();

        CategoryResource::withoutWrapping();

        return inertia('Post/Index', [
            'posts' => $posts,
            'categories' => CategoryResource::collection($categories),
        ]);
    }
}
