<?php

namespace App\Http\Controllers\Api;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\Api\OrderResource;
use App\Models\Order;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Raprmdn\DataTables\Column;
use Raprmdn\DataTables\Facades\DataTable;

class OrderController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
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
            'payment_status',
            'total_amount',
            'placed_at',
            'shipped_at',
            'metadata',
        ]))
            ->with([
                'customer:id,company_id,name',
                'customer.company:id,country_id,name',
                'customer.company.country:id,code,name',
                'agent:id,name',
            ])
            ->withCount('items')
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
                Column::make('company', 'customer.company.name')
                    ->searchable()
                    ->filterable('customer.company.id')
                    ->sortable(),
                Column::make('country', 'customer.company.country.name')
                    ->searchable()
                    ->filterable('customer.company.country.code')
                    ->sortable(),
                Column::make('agent', 'agent.name')
                    ->searchable()
                    ->filterable('agent.id')
                    ->sortable(),
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
                Column::make('payment', 'payment_status')
                    ->filterable()
                    ->sortable(),
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
                Column::make('items', 'items_count')->sortable(),
                Column::make('placed_at')
                    ->dateRange()
                    ->sortable(),
            ])
            ->applyFilters($filters)
            ->applySort(is_string($sort) ? $sort : null)
            ->orderBy('placed_at', 'desc')
            ->perPage($request->integer('limit', 10))
            ->make();

        return OrderResource::collection($orders);
    }
}
