<?php

namespace Database\Seeders;

use App\Enums\RoleEnum;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $this->updateOrCreateRoles();
        $this->updateOrCreatePermissions();
        $this->syncPermissionsByRole();

        app()[PermissionRegistrar::class]->forgetCachedPermissions();
    }

    private function updateOrCreateRoles(): void
    {
        collect(RoleEnum::cases())->each(function (RoleEnum $role): void {
            Role::updateOrCreate([
                'name' => $role->value,
                'guard_name' => 'web',
            ]);
        });
    }

    private function updateOrCreatePermissions(): void
    {
        collect($this->allPermissions())->each(function (string $permission): void {
            Permission::updateOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        });
    }

    private function syncPermissionsByRole(): void
    {
        Role::findByName(RoleEnum::Administrator->value)->syncPermissions($this->administratorPermissions());
        Role::findByName(RoleEnum::Author->value)->syncPermissions($this->authorPermissions());
        Role::findByName(RoleEnum::Moderator->value)->syncPermissions($this->moderatorPermissions());
    }

    private function allPermissions(): array
    {
        return array_unique(
            array_merge(
                $this->administratorPermissions(),
                $this->moderatorPermissions(),
                $this->authorPermissions(),
            )
        );
    }

    private function administratorPermissions(): array
    {
        return array_unique(
            array_merge(
                $this->moderatorPermissions(),
                $this->authorPermissions(),
                [
                    'user.view',
                    'post.restore',
                    'post.force-delete',
                    'category.create',
                    'category.update',
                    'category.delete',
                    'category.restore',
                    'category.force-delete',
                ],
            )
        );
    }

    private function moderatorPermissions(): array
    {
        return [
            'post.view',
            'post.update',
            'post.publish',
            'category.view',
        ];
    }

    private function authorPermissions(): array
    {
        return [
            'post.view',
            'post.create',
            'post.update',
            'post.delete',
        ];
    }
}
