<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Http\Resources\App\OrderResource;
use App\Models\Order;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Raprmdn\DataTables\Column;
use Raprmdn\DataTables\Facades\DataTable;

class AdvancedOrderController extends Controller
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
            'agent_id',
            'order_number',
            'reference',
            'status',
            'total_amount',
            'shipped_at',
            'metadata',
            'placed_at',
        ]))
            ->with([
                'customer:id,customer_number,name',
                'agent:id,name',
            ])
            ->columnDefinitions([
                Column::make('order', 'order_number')
                    ->searchable()
                    ->sortable(),
                Column::make('reference')->searchable(),
                Column::make('customer', 'customer.name')->searchable(),
                Column::make('agent', 'agent.name')->searchable(),
                Column::make('status')
                    ->filterable()
                    ->sortable()
                    ->sortUsing(function (Builder $query, string $direction): void {
                        $statuses = array_map(
                            fn (OrderStatus $status): string => $status->value,
                            OrderStatus::cases(),
                        );

                        if ($direction === 'desc') {
                            $statuses = array_reverse($statuses);
                        }

                        $column = $query->getQuery()->getGrammar()->wrap(
                            $query->qualifyColumn('status'),
                        );
                        $cases = implode(' ', array_map(
                            fn (int $index): string => "WHEN ? THEN {$index}",
                            array_keys($statuses),
                        ));

                        $query->orderByRaw(
                            "CASE {$column} {$cases} ELSE ".count($statuses).' END',
                            $statuses,
                        );
                    }),
                Column::make('shipping', 'shipped_at')
                    ->filterable()
                    ->filterAliases([
                        'shipped' => 'NOT NULL',
                        'unshipped' => 'NULL',
                    ]),
                Column::make('assignment', 'agent_id')
                    ->filterable()
                    ->filterAliases([
                        'assigned' => 'NOT NULL',
                        'unassigned' => 'NULL',
                    ]),
                Column::make('source', 'metadata->source')->filterable(),
                Column::make('flag', 'metadata->flags')
                    ->filterable()
                    ->jsonContains(),
                Column::make('amount', 'total_amount')
                    ->filterable()
                    ->filterUsing(function (Builder $query, array $values): void {
                        $bands = array_values(array_intersect(
                            ['low', 'medium', 'high'],
                            $values,
                        ));

                        if ($bands === []) {
                            return;
                        }

                        $column = $query->qualifyColumn('total_amount');

                        $query->where(function (Builder $query) use ($bands, $column): void {
                            foreach ($bands as $band) {
                                match ($band) {
                                    'low' => $query->orWhere($column, '<', 100),
                                    'medium' => $query->orWhereBetween($column, [100, 499.99]),
                                    'high' => $query->orWhere($column, '>=', 500),
                                };
                            }
                        });
                    })
                    ->sortable(),
                Column::make('placed_at')
                    ->dateRange()
                    ->sortable(),
            ])
            ->applyFilters($filters)
            ->applySort(is_string($sort) ? $sort : null)
            ->orderBy('placed_at')
            ->perPage($request->integer('limit', 10))
            ->make();

        return Inertia::render('examples/custom-columns/index', [
            'orders' => OrderResource::collection($orders),
            'statuses' => OrderStatus::options(),
        ]);
    }
}
