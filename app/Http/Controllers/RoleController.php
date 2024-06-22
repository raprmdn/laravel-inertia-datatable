<?php

namespace App\Http\Controllers;

use App\Http\Requests\QueryParamsRequest;
use App\Services\RoleService;

class RoleController extends Controller
{
    private RoleService $roleService;

    public function __construct(RoleService $roleService)
    {
        $this->roleService = $roleService;
    }

    public function index(QueryParamsRequest $request)
    {
        $roles = $this->roleService->index();

        return inertia('Roles/Index', [
            'roles' => $roles
        ]);
    }
}
