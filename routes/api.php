<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::get('posts', [PostController::class, 'index'])->name('api.posts.index');
Route::get('categories', [CategoryController::class, 'index'])->name('api.categories.index');
Route::get('users', [UserController::class, 'index'])->name('api.users.index');
