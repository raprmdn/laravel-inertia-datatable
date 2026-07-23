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
use Raprmdn\DataTables\Facades\DataTable;

class LegacyOrderController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = array_values(array_filter(
            (array) $request->query('filters', []),
            'is_string',
        ));

        [$columnFilters, $allowedFilters, $dateRanges] = DataTable::parseFilters(
            $filters,
            [
                'status' => 'status',
                'payment' => 'payment_status',
                'customer' => 'customer.id',
                'shipping' => 'shipped_at',
                'placed_at' => 'placed_at',
            ],
            [
                'shipping:shipped' => 'shipping:NOT NULL',
                'shipping:unshipped' => 'shipping:NULL',
            ],
        );
        [$sort, $allowedSorts] = DataTable::parseSort(
            $request->query('col'),
            [
                'order' => 'order_number',
                'customer' => 'customer.name',
                'status' => 'status',
                'payment' => 'payment_status',
                'amount' => 'total_amount',
                'placed_at' => 'placed_at',
            ],
        );

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
            ->searchable(['order_number', 'reference', 'customer.name'])
            ->applyFilters($columnFilters)
            ->allowedFilters($allowedFilters)
            ->applyDateRanges($dateRanges)
            ->applySort($sort)
            ->allowedSorts($allowedSorts)
            ->orderBy('placed_at', 'desc')
            ->perPage($request->integer('limit', 10))
            ->make();

        return Inertia::render('examples/migration/index', [
            'implementation' => 'legacy',
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
