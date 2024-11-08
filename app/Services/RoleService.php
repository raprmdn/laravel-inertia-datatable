<?php

namespace App\Services;

use App\Facades\DataTable;
use App\Http\Resources\RoleResource;
use Spatie\Permission\Models\Role;

class RoleService
{
    public function index(): \Illuminate\Http\Resources\Json\AnonymousResourceCollection
    {
        $filters = str_replace(
            ['guard:web', 'guard:api',],
            ['guard_name:web', 'guard_name:api',],
            request()->query('filters') ?? []
        );
        $sort = str_replace(
            ['name'],
            ['name'],
            request()->query('col')
        );

        $result = DataTable::query(Role::query())
            ->searchable(['name'])
            ->applyFilters($filters)
            ->allowedFilters(['guard_name:web', 'guard_name:api'])
            ->applySort($sort)
            ->allowedSorts(['name'])
            ->make();

        return RoleResource::collection($result);
    }
}
