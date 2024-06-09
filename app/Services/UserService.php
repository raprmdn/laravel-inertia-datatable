<?php

namespace App\Services;

use App\Facades\DataTable;
use App\Http\Resources\UserResource;
use App\Models\User;

class UserService
{
    public function index(): \Illuminate\Http\Resources\Json\AnonymousResourceCollection
    {
        $filters = str_replace(
            [
                'status:verified', 'status:unverified',
                'roles:Administrator', 'roles:Author', 'roles:Moderator',
            ],
            [
                'email_verified_at:NOT NULL', 'email_verified_at:NULL',
                'roles.name:Administrator', 'roles.name:Author', 'roles.name:Moderator',
            ],
            request()->query('filters') ?? []
        );

        $result = DataTable::query(User::query())
            ->with(['roles'])
            ->searchable(['name', 'email'])
            ->applyFilters($filters)
            ->allowedFilters([
                'email_verified_at:NOT NULL',
                'email_verified_at:NULL',
                'roles.name:Administrator',
                'roles.name:Author',
                'roles.name:Moderator',
            ])
            ->allowedSorts(['name', 'email', 'created_at'])
            ->make();

        return UserResource::collection($result);
    }
}
