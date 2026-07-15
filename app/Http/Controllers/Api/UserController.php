<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\RoleApiResource;
use App\Http\Resources\Api\UserApiResource;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Raprmdn\DataTables\Facades\DataTable;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function options(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'limit' => ['nullable', 'integer', 'min:1'],
        ]);

        $search = trim($validated['search'] ?? '');
        $limit = min((int) ($validated['limit'] ?? 20), 20);

        if (mb_strlen($search) < 2) {
            return response()->json([
                'data' => [],
                'meta' => ['has_more' => false],
            ]);
        }

        $users = User::query()
            ->select('name')
            ->where('name', 'like', "%{$search}%")
            ->distinct()
            ->orderBy('name')
            ->limit($limit + 1)
            ->get();

        return response()->json([
            'data' => $users
                ->take($limit)
                ->map(fn (User $user): array => [
                    'value' => $user->name,
                    'label' => $user->name,
                ])
                ->values(),
            'meta' => ['has_more' => $users->count() > $limit],
        ]);
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        [$columnFilters, $allowedFilters, $dateRanges] = DataTable::parseFilters([
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
            ->allowedFilters($allowedFilters)
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
