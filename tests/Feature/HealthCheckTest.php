<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

it('reports application health', function () {
    $this->get('/up')->assertSuccessful();
});

it('honors the scheme forwarded by the trusted proxy', function () {
    Route::get('/proxy-scheme', fn (Request $request): string => $request->getScheme());

    $this->withHeader('X-Forwarded-Proto', 'https')
        ->get('/proxy-scheme')
        ->assertSuccessful()
        ->assertSeeText('https');
});
