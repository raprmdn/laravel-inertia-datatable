<?php

namespace App\Http\Controllers;

use App\Http\Resources\App\OrderResource;
use App\Models\Agent;
use App\Models\Company;
use App\Models\Country;
use App\Models\Customer;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;
use Raprmdn\DataTables\Column;
use Raprmdn\DataTables\Facades\DataTable;

class RelationshipOrderController extends Controller
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
            'placed_at',
        ]))
            ->with([
                'customer:id,company_id,customer_number,name',
                'customer.company:id,country_id,name',
                'customer.company.country:id,code,name',
                'agent:id,name',
            ])
            ->withCount('items')
            ->columnDefinitions([
                Column::make('order', 'order_number')
                    ->searchable()
                    ->sortable(),
                Column::make('customer', 'customer.name')
                    ->searchable()
                    ->filterable('customer.name')
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

        return Inertia::render('examples/relationships/index', [
            'orders' => OrderResource::collection($orders),
            'selected_customer_options' => $this->selectedCustomerOptions($filters),
            'company_options' => $this->options(
                Company::query()->orderBy('name')->limit(200)->pluck('name', 'id'),
            ),
            'country_options' => $this->options(
                Country::query()->orderBy('name')->limit(200)->pluck('name', 'code'),
            ),
            'agent_options' => $this->options(
                Agent::query()->orderBy('name')->limit(200)->pluck('name', 'id'),
            ),
        ]);
    }

    /** @return list<array{value: string, label: string}> */
    private function selectedCustomerOptions(array $filters): array
    {
        $customerNames = collect($filters)
            ->filter(fn (string $filter): bool => str_starts_with($filter, 'customer:'))
            ->map(fn (string $filter): string => substr($filter, strlen('customer:')))
            ->filter()
            ->unique()
            ->values();

        if ($customerNames->isEmpty()) {
            return [];
        }

        return $this->options(
            Customer::query()
                ->whereIn('name', $customerNames)
                ->orderBy('name')
                ->pluck('name', 'name'),
        );
    }

    /**
     * @param  Collection<int|string, string>  $options
     * @return list<array{value: string, label: string}>
     */
    private function options(Collection $options): array
    {
        return $options
            ->map(fn (string $label, int|string $value): array => [
                'value' => (string) $value,
                'label' => $label,
            ])
            ->values()
            ->all();
    }
}
