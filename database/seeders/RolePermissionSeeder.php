<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $roles = collect([
            'Administrator',
            'Author',
            'Moderator',
        ]);

        $roles->each(function ($role) {
            \Spatie\Permission\Models\Role::create(['name' => $role]);
        });
    }
}
