<?php

namespace App\Http\Controllers;

use App\Http\Resources\Api\UserApiResource;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Raprmdn\DataTables\Facades\DataTable;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        [$columnFilters, $dateRanges] = DataTable::parseFilters([
            'email_verified_at' => 'email_verified_at',
            'created_at' => 'created_at',
        ]);
        [$sort, $allowedSorts] = DataTable::parseSort($request->string('col')->toString(), [
            'name' => 'name',
            'email' => 'email',
            'email_verified_at' => 'email_verified_at',
            'created_at' => 'created_at',
        ]);

        $users = DataTable::query(User::query())
            ->searchable(['name', 'email'])
            ->applyFilters($columnFilters)
            ->allowedFilters(['email_verified_at', 'created_at'])
            ->applyDateRanges($dateRanges)
            ->applySort($sort)
            ->allowedSorts($allowedSorts)
            ->perPage($request->integer('limit', 10))
            ->make();

        return Inertia::render('users/index', [
            'users' => UserApiResource::collection($users),
        ]);
    }
}
