<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class UserRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = Role::query()->pluck('name');

        if ($roles->isEmpty()) {
            return;
        }

        User::query()
            ->doesntHave('roles')
            ->eachById(fn (User $user) => $user->assignRole($roles->random()));
    }
}
