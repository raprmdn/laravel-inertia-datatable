import ExampleHeader from '@/components/data-table/example-header.jsx';
import RequestInspector from '@/components/data-table/request-inspector.jsx';
import TablePagination from '@/components/data-table/table-pagination.jsx';
import TableSortHeader from '@/components/data-table/table-sort-header.jsx';
import TableToolbar from '@/components/data-table/table-toolbar.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import {
    Table,
    TableBody,
    TableCell,
    TableCellSticky,
    TableHead,
    TableHeadSticky,
    TableHeader,
    TableRow,
} from '@/components/ui/table.jsx';
import DashboardLayout from '@/layouts/dashboard-layout.jsx';
import useDebouncedSearch from '@/hooks/use-debounced-search.js';
import useSorting from '@/hooks/use-sorting.js';
import RelationshipFilters, {
    deserializeRelationshipFilters,
    relationshipFilterDefaults,
    relationshipFilterGroups,
    serializeRelationshipFilters,
} from '@/pages/examples/relationships/partials/relationship-filters.jsx';
import { Head, usePage } from '@inertiajs/react';
import { SearchXIcon } from 'lucide-react';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
});

export default function Relationships() {
    const page = usePage();
    const {
        orders,
        selected_customer_options: selectedCustomerOptions = [],
        company_options: companyOptions = [],
        country_options: countryOptions = [],
        agent_options: agentOptions = [],
        filters = {},
    } = page.props;
    const initialParams = {
        search: filters.search ?? '',
        filters: Array.isArray(filters.filters) ? filters.filters : [],
        col: filters.col ?? null,
        sort: filters.sort ?? null,
        limit: Number(filters.limit ?? 10),
    };
    const { params, setParams, setTimeDebounce } = useDebouncedSearch(
        route('examples.relationships'),
        initialParams,
    );
    const { sort } = useSorting(filters, setParams);
    const rawFilters = Array.isArray(params.filters) ? params.filters : [];
    const sortColumn = params.col ?? 'placed_at';
    const sortDirection = params.sort ?? 'desc';

    const currentQuery = page.url.includes('?')
        ? `?${page.url.split('?')[1]}`
        : '';

    return (
        <>
            <Head title="Orders & Customers" />

            <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 md:p-6">
                <ExampleHeader
                    lesson="Lesson 02 · Relationships"
                    title="Orders & Customers"
                    description="Keep public table keys readable while each capability targets the relationship source best suited to search, filtering, or sorting."
                    features={[
                        'Customer name filters',
                        'Nested relations',
                        'Eager loading',
                        'Count aliases',
                        'Capability sources',
                    ]}
                />

                <section
                    className="flex flex-col gap-4"
                    aria-label="Relationship orders table"
                >
                    <TableToolbar
                        placeholder="Search orders or relationships"
                        search={params.search}
                        params={params}
                        setParams={setParams}
                        setTimeDebounce={setTimeDebounce}
                        filterTitle="Filter relationships"
                        filterDescription="Customer filters use names; other relationship filters use IDs or country codes."
                        filterConfig={{
                            defaults: relationshipFilterDefaults,
                            deserialize: deserializeRelationshipFilters,
                            serialize: serializeRelationshipFilters,
                            groups: relationshipFilterGroups({
                                selectedCustomerOptions,
                                companyOptions,
                                countryOptions,
                                agentOptions,
                            }),
                        }}
                        filters={({ data, setData }) => (
                            <RelationshipFilters
                                data={data}
                                setData={setData}
                                selectedCustomerOptions={
                                    selectedCustomerOptions
                                }
                                companyOptions={companyOptions}
                                countryOptions={countryOptions}
                                agentOptions={agentOptions}
                            />
                        )}
                    />

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHeadSticky
                                    index={0}
                                    isLast
                                    className="min-w-52"
                                >
                                    <TableSortHeader
                                        title="Order"
                                        sort={
                                            sortColumn === 'order'
                                                ? sortDirection
                                                : null
                                        }
                                        onClick={() => sort('order')}
                                    />
                                </TableHeadSticky>
                                <TableHead className="min-w-52">
                                    <TableSortHeader
                                        title="Customer"
                                        sort={
                                            sortColumn === 'customer'
                                                ? sortDirection
                                                : null
                                        }
                                        onClick={() => sort('customer')}
                                    />
                                </TableHead>
                                <TableHead className="min-w-48">
                                    <TableSortHeader
                                        title="Company"
                                        sort={
                                            sortColumn === 'company'
                                                ? sortDirection
                                                : null
                                        }
                                        onClick={() => sort('company')}
                                    />
                                </TableHead>
                                <TableHead className="min-w-48">
                                    <TableSortHeader
                                        title="Country"
                                        sort={
                                            sortColumn === 'country'
                                                ? sortDirection
                                                : null
                                        }
                                        onClick={() => sort('country')}
                                    />
                                </TableHead>
                                <TableHead className="min-w-44">
                                    <TableSortHeader
                                        title="Agent"
                                        sort={
                                            sortColumn === 'agent'
                                                ? sortDirection
                                                : null
                                        }
                                        onClick={() => sort('agent')}
                                    />
                                </TableHead>
                                <TableHead>
                                    <TableSortHeader
                                        title="Items"
                                        sort={
                                            sortColumn === 'items'
                                                ? sortDirection
                                                : null
                                        }
                                        onClick={() => sort('items')}
                                    />
                                </TableHead>
                                <TableHead className="min-w-52">
                                    <TableSortHeader
                                        title="Placed At"
                                        sort={
                                            sortColumn === 'placed_at'
                                                ? sortDirection
                                                : null
                                        }
                                        onClick={() => sort('placed_at')}
                                    />
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.data.length > 0 ? (
                                orders.data.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCellSticky
                                            index={0}
                                            isLast
                                            className="font-mono font-medium"
                                        >
                                            <div className="flex flex-col gap-1">
                                                <span>
                                                    {order.order_number}
                                                </span>
                                                <span className="text-xs font-normal text-muted-foreground">
                                                    {order.reference ??
                                                        'No reference'}
                                                </span>
                                            </div>
                                        </TableCellSticky>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <span className="font-medium">
                                                    {order.customer?.name}
                                                </span>
                                                <span className="font-mono text-xs text-muted-foreground">
                                                    {
                                                        order.customer
                                                            ?.customer_number
                                                    }
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {order.company?.name}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span>
                                                    {order.country?.name}
                                                </span>
                                                <Badge variant="outline">
                                                    {order.country?.code}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {order.agent?.name ?? (
                                                <span className="text-muted-foreground">
                                                    Unassigned
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-mono tabular-nums">
                                            {order.items_count}
                                        </TableCell>
                                        <TableCell>
                                            {dateFormatter.format(
                                                new Date(order.placed_at),
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="h-56 text-center"
                                    >
                                        <div className="mx-auto flex max-w-sm flex-col items-center gap-3 whitespace-normal">
                                            <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                                <SearchXIcon />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <p className="font-medium">
                                                    No matching relationships
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Remove a customer-name or
                                                    stable-value filter
                                                    or broaden the relationship
                                                    search.
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    <TablePagination meta={orders.meta} />
                </section>

                <RequestInspector
                    search={params.search}
                    filters={rawFilters}
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    perPage={params.limit}
                    queryString={currentQuery}
                />
            </main>
        </>
    );
}

Relationships.layout = () => [
    DashboardLayout,
    {
        breadcrumbs: [
            { title: 'Overview', href: route('dashboard') },
            {
                title: 'Orders & Customers',
                href: route('examples.relationships'),
            },
        ],
    },
];
