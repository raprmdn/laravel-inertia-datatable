<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect('login');
});

Route::get('/dashboard', function () {
    return Inertia::render('Index');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {

    Route::controller(\App\Http\Controllers\UsersController::class)->group(function () {
        Route::get('/users', 'index')->name('users.index');
    });

    Route::controller(\App\Http\Controllers\RoleController::class)->group(function () {
        Route::get('/roles', 'index')->name('roles.index');
    });

    Route::controller(\App\Http\Controllers\CategoryController::class)->group(function () {
        Route::get('/categories', 'index')->name('categories.index');
    });

    Route::controller(\App\Http\Controllers\PostController::class)->group(function () {
        Route::get('/posts', 'index')->name('posts.index');
    });

});

require __DIR__.'/auth.php';
