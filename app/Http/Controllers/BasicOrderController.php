<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Http\Resources\App\OrderResource;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Raprmdn\DataTables\Column;
use Raprmdn\DataTables\Facades\DataTable;

class BasicOrderController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = array_values(array_filter(
            (array) $request->query('filters', []),
            'is_string',
        ));
        $sort = $request->query('col');

        $orders = DataTable::query(Order::query()->select([
            'id',
            'order_number',
            'reference',
            'status',
            'payment_status',
            'total_amount',
            'placed_at',
        ]))
            ->columnDefinitions([
                Column::group(['order_number', 'reference'])
                    ->searchable()
                    ->sortable(),
                Column::group(['status', 'payment_status'])
                    ->filterable()
                    ->sortable(),
                Column::make('total_amount')->sortable(),
                Column::make('placed_at')
                    ->dateRange()
                    ->sortable(),
            ])
            ->applyFilters($filters)
            ->applySort(is_string($sort) ? $sort : null)
            ->orderBy('placed_at', 'desc')
            ->perPage($request->integer('limit', 10))
            ->make();

        return Inertia::render('examples/basic-orders/index', [
            'orders' => OrderResource::collection($orders),
            'statuses' => OrderStatus::options(),
            'payment_statuses' => PaymentStatus::options(),
        ]);
    }
}
