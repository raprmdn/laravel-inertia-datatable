<?php

namespace App\Http\Controllers;

use App\Services\RoleService;

class RoleController extends Controller
{
    private RoleService $roleService;

    public function __construct(RoleService $roleService)
    {
        $this->roleService = $roleService;
    }

    public function index()
    {
        $roles = $this->roleService->index();

        return inertia('Roles/Index', [
            'roles' => $roles
        ]);
    }
}
