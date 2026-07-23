<?php

use App\Http\Controllers\AdvancedOrderController;
use App\Http\Controllers\Api\CustomerOptionController;
use App\Http\Controllers\BasicOrderController;
use App\Http\Controllers\LegacyOrderController;
use App\Http\Controllers\MigrationOrderController;
use App\Http\Controllers\QueryBuilderOrderController;
use App\Http\Controllers\RelationshipOrderController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/dashboard')->name('home');
Route::inertia('dashboard', 'dashboard')->name('dashboard');
Route::get('examples/basic-orders', [BasicOrderController::class, 'index'])->name('examples.basic-orders');
Route::get('examples/relationships', [RelationshipOrderController::class, 'index'])->name('examples.relationships');
Route::get('examples/custom-columns', [AdvancedOrderController::class, 'index'])->name('examples.custom-columns');
Route::get('examples/query-builder', [QueryBuilderOrderController::class, 'index'])->name('examples.query-builder');
Route::inertia('examples/api', 'examples/api/index')->name('examples.api-explorer');
Route::get('examples/migration', [MigrationOrderController::class, 'index'])->name('examples.migration.current');
Route::get('examples/migration/legacy', [LegacyOrderController::class, 'index'])->name('examples.migration.legacy');
Route::get('api/customers/options', [CustomerOptionController::class, 'index'])
    ->middleware('throttle:60,1')
    ->name('api.customers.options');

require __DIR__.'/settings.php';
