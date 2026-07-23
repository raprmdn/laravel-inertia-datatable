<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\CustomerOptionResource;
use App\Models\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Raprmdn\DataTables\Column;
use Raprmdn\DataTables\Facades\DataTable;

class CustomerOptionController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection|JsonResponse
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
                'has_more' => false,
            ]);
        }

        $request->query->set('search', $search);

        $customers = DataTable::query(
            Customer::query()
                ->select(['id', 'name'])
                ->orderBy('name')
                ->limit($limit + 1),
        )
            ->columnDefinitions([
                Column::group(['name', 'customer_number'])->searchable(),
            ])
            ->type('collection')
            ->make();

        return CustomerOptionResource::collection($customers->take($limit))
            ->additional(['has_more' => $customers->count() > $limit]);
    }
}
