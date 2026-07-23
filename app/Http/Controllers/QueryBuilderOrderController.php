<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use Illuminate\Database\Query\Builder;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Raprmdn\DataTables\Column;
use Raprmdn\DataTables\Facades\DataTable;

class QueryBuilderOrderController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = array_values(array_filter(
            (array) $request->query('filters', []),
            'is_string',
        ));
        $sort = $request->query('col');

        $itemCounts = DB::table('order_items')
            ->select('order_id')
            ->selectRaw('COUNT(*) as items_count')
            ->groupBy('order_id');

        $query = DB::table('orders')
            ->join('customers', 'customers.id', '=', 'orders.customer_id')
            ->join('companies', 'companies.id', '=', 'customers.company_id')
            ->join('countries', 'countries.id', '=', 'companies.country_id')
            ->leftJoin('agents', 'agents.id', '=', 'orders.agent_id')
            ->leftJoinSub($itemCounts, 'item_counts', function (JoinClause $join): void {
                $join->on('item_counts.order_id', '=', 'orders.id');
            })
            ->select([
                'orders.id',
                'orders.order_number',
                'orders.reference',
                'customers.name as customer_name',
                'companies.name as company_name',
                'countries.name as country_name',
                'countries.code as country_code',
                'agents.name as agent_name',
                'orders.status',
                'orders.total_amount',
                'orders.placed_at',
                'item_counts.items_count',
            ]);

        $orders = DataTable::query($query)
            ->columnDefinitions([
                Column::group([
                    'order' => 'orders.order_number',
                    'order_reference' => 'orders.reference',
                ])->searchable(),
                Column::make('order')->sortable('orders.order_number'),
                Column::make('customer', 'customers.name')
                    ->searchable()
                    ->filterable('customers.id')
                    ->sortable(),
                Column::make('company', 'companies.name')
                    ->searchable()
                    ->filterable('companies.id')
                    ->sortable(),
                Column::make('country', 'countries.name')
                    ->searchable()
                    ->filterable('countries.code')
                    ->sortable(),
                Column::make('agent', 'agents.name')
                    ->searchable()
                    ->filterable('agents.id')
                    ->sortable(),
                Column::make('status', 'orders.status')
                    ->filterable()
                    ->sortable(),
                Column::make('amount', 'orders.total_amount')->sortable(),
                Column::make('items', 'items_count')->sortable(),
                Column::make('placed_at', 'orders.placed_at')
                    ->dateRange()
                    ->sortable(),
            ])
            ->applyFilters($filters)
            ->applySort(is_string($sort) ? $sort : null)
            ->orderBy('orders.placed_at', 'desc')
            ->perPage($request->integer('limit', 10))
            ->make()
            ->through(fn (object $order): array => [
                'id' => (int) $order->id,
                'order_number' => $order->order_number,
                'reference' => $order->reference,
                'customer_name' => $order->customer_name,
                'company_name' => $order->company_name,
                'country_name' => $order->country_name,
                'country_code' => $order->country_code,
                'agent_name' => $order->agent_name,
                'status' => $order->status,
                'total_amount' => $order->total_amount,
                'items_count' => (int) ($order->items_count ?? 0),
                'placed_at' => Carbon::parse($order->placed_at)->toJSON(),
            ]);

        return Inertia::render('examples/query-builder/index', [
            'orders' => $orders,
            'selected_customer_options' => $this->selectedCustomerOptions($filters),
            'company_options' => $this->options(
                DB::table('companies')
                    ->select(['id as value', 'name as label'])
                    ->orderBy('name')
                    ->limit(200),
            ),
            'country_options' => $this->options(
                DB::table('countries')
                    ->select(['code as value', 'name as label'])
                    ->orderBy('name')
                    ->limit(200),
            ),
            'agent_options' => $this->options(
                DB::table('agents')
                    ->select(['id as value', 'name as label'])
                    ->orderBy('name')
                    ->limit(200),
            ),
            'statuses' => OrderStatus::options(),
        ]);
    }

    /** @return list<array{value: string, label: string}> */
    private function selectedCustomerOptions(array $filters): array
    {
        $customerIds = collect($filters)
            ->filter(fn (string $filter): bool => str_starts_with($filter, 'customer:'))
            ->map(fn (string $filter): string => substr($filter, strlen('customer:')))
            ->filter(fn (string $id): bool => ctype_digit($id))
            ->unique()
            ->values();

        if ($customerIds->isEmpty()) {
            return [];
        }

        return $this->options(
            DB::table('customers')
                ->select(['id as value', 'name as label'])
                ->whereIn('id', $customerIds)
                ->orderBy('name'),
        );
    }

    /** @return list<array{value: string, label: string}> */
    private function options(Builder $query): array
    {
        return $query
            ->get()
            ->map(fn (object $option): array => [
                'value' => (string) $option->value,
                'label' => $option->label,
            ])
            ->all();
    }
}
