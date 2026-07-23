<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Http\Resources\App\OrderResource;
use App\Models\Customer;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Raprmdn\DataTables\Column;
use Raprmdn\DataTables\Facades\DataTable;

class MigrationOrderController extends Controller
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
            'customer_id',
            'order_number',
            'reference',
            'status',
            'payment_status',
            'total_amount',
            'placed_at',
            'shipped_at',
        ]))
            ->with('customer:id,customer_number,name')
            ->columnDefinitions([
                Column::group([
                    'order' => 'order_number',
                    'reference' => 'reference',
                ])->searchable(),
                Column::make('order')->sortable('order_number'),
                Column::make('customer', 'customer.name')
                    ->searchable()
                    ->filterable('customer.id')
                    ->sortable(),
                Column::make('status')
                    ->filterable()
                    ->sortable(),
                Column::make('payment', 'payment_status')
                    ->filterable()
                    ->sortable(),
                Column::make('shipping', 'shipped_at')
                    ->filterable()
                    ->filterAliases([
                        'shipped' => 'NOT NULL',
                        'unshipped' => 'NULL',
                    ]),
                Column::make('amount', 'total_amount')->sortable(),
                Column::make('placed_at')
                    ->dateRange()
                    ->sortable(),
            ])
            ->applyFilters($filters)
            ->applySort(is_string($sort) ? $sort : null)
            ->orderBy('placed_at', 'desc')
            ->perPage($request->integer('limit', 10))
            ->make();

        return Inertia::render('examples/migration/index', [
            'implementation' => 'current',
            'orders' => OrderResource::collection($orders),
            'customer_options' => Customer::query()
                ->select(['id', 'name'])
                ->orderBy('name')
                ->limit(200)
                ->get(),
            'statuses' => OrderStatus::options(),
            'payment_statuses' => PaymentStatus::options(),
        ]);
    }
}
