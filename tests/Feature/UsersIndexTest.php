<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('users.index'));

    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the users page', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('users.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('users/index')
            ->has('users.data')
            ->has('users.meta')
        );
});

test('users page supports email verification filters', function () {
    $user = User::factory()->create();
    $unverifiedUser = User::factory()->unverified()->create();

    $this->actingAs($user)
        ->get(route('users.index', ['filters' => ['email_verified_at:NULL']]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('users/index')
            ->has('users.data', 1)
            ->where('users.data.0.email', $unverifiedUser->email)
        );
});
