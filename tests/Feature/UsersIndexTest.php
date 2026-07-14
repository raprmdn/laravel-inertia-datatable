<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;

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

test('users page supports status filters', function () {
    $user = User::factory()->create();
    $unverifiedUser = User::factory()->unverified()->create();

    $this->actingAs($user)
        ->get(route('users.index', ['filters' => ['status:unverified']]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('users/index')
            ->has('users.data', 1)
            ->where('users.data.0.email', $unverifiedUser->email)
        );
});

test('users page supports role filters', function () {
    $user = User::factory()->create();
    $administrator = Role::query()->create(['name' => 'administrator', 'guard_name' => 'web']);
    $author = Role::query()->create(['name' => 'author', 'guard_name' => 'web']);
    $administratorUser = User::factory()->create();
    $authorUser = User::factory()->create();

    $administratorUser->assignRole($administrator);
    $authorUser->assignRole($author);

    $this->actingAs($user)
        ->get(route('users.index', ['filters' => ['roles:administrator']]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('users/index')
            ->has('users.data', 1)
            ->where('users.data.0.email', $administratorUser->email)
            ->where('users.data.0.roles.0.name', 'administrator')
        );
});
