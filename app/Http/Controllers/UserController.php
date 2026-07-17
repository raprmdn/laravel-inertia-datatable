<?php

namespace App\Http\Controllers;

use App\Http\Resources\App\RoleResource;
use App\Http\Resources\App\UserResource;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Raprmdn\DataTables\Facades\DataTable;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $query = User::query();

        [$columnFilters, $allowedFilters, $dateRanges] = DataTable::parseFilters(
            [
                'status' => 'email_verified_at',
                'roles' => 'roles.name',
                'created_at' => 'created_at',
            ],
            aliases: [
                'status:verified' => 'status:NOT NULL',
                'status:unverified' => 'status:NULL',
            ]
        );

        [$sort, $allowedSorts] = DataTable::parseSort([
            'name' => 'name',
            'email' => 'email',
            'email_verified_at' => 'email_verified_at',
            'created_at' => 'created_at',
        ]);

        $users = DataTable::query($query)
            ->with('roles')
            ->searchable(['name', 'email', 'roles.name'])
            ->applyFilters($columnFilters)
            ->allowedFilters($allowedFilters)
            ->applyDateRanges($dateRanges)
            ->applySort($sort)
            ->allowedSorts($allowedSorts)
            ->perPage($request->integer('limit', 10))
            ->make();

        return Inertia::render('users/index', [
            'users' => UserResource::collection($users),
            'roles' => RoleResource::collection($this->roleOptions()),
        ]);
    }

    private function roleOptions(): EloquentCollection
    {
        return Role::query()
            ->select(['id', 'name'])
            ->orderBy('name')
            ->get();
    }
}
