<?php

namespace App\Http\Controllers;

use App\Http\Resources\App\RoleResource;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Raprmdn\DataTables\Facades\DataTable;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function index(Request $request): Response
    {
        [$columnFilters, $allowedFilters] = DataTable::parseFilters([
            'guard' => 'guard_name',
        ]);

        [$sort, $allowedSorts] = DataTable::parseSort(
            $request->string('col')->toString(),
            [
                'name' => 'name',
                'guard' => 'guard_name',
                'users' => 'users_count',
                'created_at' => 'created_at',
            ],
        );

        $roles = DataTable::query(Role::query())
            ->withCount(['users'])
            ->searchable(['name'])
            ->applyFilters($columnFilters)
            ->allowedFilters($allowedFilters)
            ->applySort($sort)
            ->allowedSorts($allowedSorts)
            ->perPage($request->integer('limit', 10))
            ->make();

        return Inertia::render('roles/index', [
            'roles' => RoleResource::collection($roles),
            'guards' => [
                ['label' => 'Web', 'value' => 'web'],
                ['label' => 'API', 'value' => 'api'],
            ],
        ]);
    }
}
