<?php

use App\Http\Controllers\Api\OrderController;
use Illuminate\Support\Facades\Route;

Route::get('orders', [OrderController::class, 'index'])
    ->middleware('throttle:60,1')
    ->name('api.orders.index');
