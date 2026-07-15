<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::get('categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::get('posts', [PostController::class, 'index'])->name('posts.index');
    Route::get('roles', [RoleController::class, 'index'])->name('roles.index');
    Route::get('users', [UserController::class, 'index'])->name('users.index');
});

require __DIR__.'/settings.php';
