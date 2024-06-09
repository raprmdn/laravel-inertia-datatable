<?php

namespace App\Http\Controllers;

use App\Http\Requests\QueryParamsRequest;
use App\Http\Resources\RoleResource;
use App\Services\UserService;
use Spatie\Permission\Models\Role;

class UsersController extends Controller
{
    protected UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

	public function index(QueryParamsRequest $request)
	{
        $users = $this->userService->index();
        $roles = Role::all();

        RoleResource::withoutWrapping();

        return inertia('Users/Index', [
            'users' => $users,
            'roles' => RoleResource::collection($roles),
        ]);
	}
}
