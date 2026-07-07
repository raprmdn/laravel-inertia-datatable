<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\RoleApiResource;
use App\Http\Resources\Api\UserApiResource;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Raprmdn\DataTables\Facades\DataTable;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        [$columnFilters, $dateRanges] = DataTable::parseFilters([
            'role' => 'roles.name',
            'created_at' => 'created_at',
        ]);
        [$sort, $allowedSorts] = DataTable::parseSort($request->string('col')->toString(), [
            'name' => 'name',
            'email' => 'email',
            'created_at' => 'created_at',
            'updated_at' => 'updated_at',
            'posts_count' => 'posts_count',
        ]);

        $users = DataTable::query(User::query()->withCount('posts'))
            ->with(['roles'])
            ->searchable(['name', 'email', 'roles.name'])
            ->applyFilters($columnFilters)
            ->allowedFilters(['roles.name', 'created_at'])
            ->applyDateRanges($dateRanges)
            ->applySort($sort)
            ->allowedSorts($allowedSorts)
            ->perPage($request->integer('limit', 10))
            ->make();

        return UserApiResource::collection($users)->additional([
            'roles' => RoleApiResource::collection($this->roleOptions()),
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
