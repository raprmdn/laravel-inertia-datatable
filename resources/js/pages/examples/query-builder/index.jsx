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
import { formatSnakeCase } from '@/lib/utils.js';
import QueryBuilderFilters, {
    deserializeQueryBuilderFilters,
    queryBuilderFilterDefaults,
    queryBuilderFilterGroups,
    serializeQueryBuilderFilters,
} from '@/pages/examples/query-builder/partials/query-builder-filters.jsx';
import { Head, usePage } from '@inertiajs/react';
import { SearchXIcon } from 'lucide-react';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
});

const moneyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

const statusVariant = (status) => {
    if (status === 'cancelled') {
        return 'destructive';
    }

    if (status === 'delivered') {
        return 'default';
    }

    if (status === 'shipped') {
        return 'secondary';
    }

    return 'outline';
};

export default function QueryBuilderOrders() {
    const page = usePage();
    const {
        orders,
        selected_customer_options: selectedCustomerOptions = [],
        company_options: companyOptions = [],
        country_options: countryOptions = [],
        agent_options: agentOptions = [],
        statuses = [],
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
        route('examples.query-builder'),
        initialParams,
    );
    const { sort } = useSorting(filters, setParams);
    const rawFilters = Array.isArray(params.filters) ? params.filters : [];
    const sortColumn = params.col ?? 'placed_at';
    const sortDirection = params.sort ?? 'desc';

    const currentQuery = page.url.includes('?')
        ? `?${page.url.split('?')[1]}`
        : '';
    const currentPage = Number(
        new URLSearchParams(currentQuery).get('page') ?? 1,
    );

    return (
        <>
            <Head title="Query Builder" />

            <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 md:p-6">
                <ExampleHeader
                    lesson="Lesson 04 · Query Builder"
                    title="Joined Order Ledger"
                    description="Use the same package contract over Illuminate's Query Builder with explicit joins, qualified physical columns, selected aliases, and flat result rows."
                    features={[
                        'Query Builder',
                        'Explicit joins',
                        'Flat rows',
                        'Aggregate subquery',
                        'Collection options',
                    ]}
                />

                <section
                    className="flex flex-col gap-4"
                    aria-label="Query Builder orders table"
                >
                    <TableToolbar
                        placeholder="Search order or joined names"
                        search={params.search}
                        params={params}
                        setParams={setParams}
                        setTimeDebounce={setTimeDebounce}
                        filterTitle="Filter joined orders"
                        filterDescription="Display labels map to stable values across joined tables."
                        filterConfig={{
                            defaults: queryBuilderFilterDefaults,
                            deserialize: deserializeQueryBuilderFilters,
                            serialize: serializeQueryBuilderFilters,
                            groups: queryBuilderFilterGroups({
                                selectedCustomerOptions,
                                companyOptions,
                                countryOptions,
                                agentOptions,
                                statuses,
                            }),
                        }}
                        filters={({ data, setData }) => (
                            <QueryBuilderFilters
                                data={data}
                                setData={setData}
                                selectedCustomerOptions={
                                    selectedCustomerOptions
                                }
                                companyOptions={companyOptions}
                                countryOptions={countryOptions}
                                agentOptions={agentOptions}
                                statuses={statuses}
                            />
                        )}
                    />

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHeadSticky
                                    index={0}
                                    isLast
                                    className="min-w-56"
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
                                {[
                                    ['customer', 'Customer', 'min-w-52'],
                                    ['company', 'Company', 'min-w-48'],
                                    ['country', 'Country', 'min-w-48'],
                                    ['agent', 'Agent', 'min-w-44'],
                                    ['status', 'Status', 'min-w-32'],
                                    ['amount', 'Amount', 'min-w-32 text-right'],
                                    ['items', 'Items', 'min-w-24 text-right'],
                                    ['placed_at', 'Placed At', 'min-w-52'],
                                ].map(([key, title, className]) => (
                                    <TableHead key={key} className={className}>
                                        <TableSortHeader
                                            title={title}
                                            sort={
                                                sortColumn === key
                                                    ? sortDirection
                                                    : null
                                            }
                                            onClick={() => sort(key)}
                                        />
                                    </TableHead>
                                ))}
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
                                                {order.reference && (
                                                    <span className="font-sans text-xs font-normal text-muted-foreground">
                                                        {order.reference}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCellSticky>
                                        <TableCell>
                                            {order.customer_name}
                                        </TableCell>
                                        <TableCell>
                                            {order.company_name}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span>
                                                    {order.country_name}
                                                </span>
                                                <Badge variant="outline">
                                                    {order.country_code}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {order.agent_name ?? (
                                                <span className="text-muted-foreground">
                                                    Unassigned
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={statusVariant(
                                                    order.status,
                                                )}
                                            >
                                                {formatSnakeCase(order.status)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-mono tabular-nums">
                                            {moneyFormatter.format(
                                                Number(order.total_amount),
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right font-mono tabular-nums">
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
                                        colSpan={9}
                                        className="h-56 text-center"
                                    >
                                        <div className="mx-auto flex max-w-sm flex-col items-center gap-3 whitespace-normal">
                                            <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                                <SearchXIcon />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <p className="font-medium">
                                                    No matching ledger rows
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Broaden the joined-column
                                                    search or remove a filter.
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    <TablePagination meta={orders} />
                </section>

                <RequestInspector
                    search={params.search}
                    filters={rawFilters}
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    perPage={params.limit}
                    page={currentPage}
                    queryString={currentQuery}
                />
            </main>
        </>
    );
}

QueryBuilderOrders.layout = () => [
    DashboardLayout,
    {
        breadcrumbs: [
            { title: 'Overview', href: route('dashboard') },
            {
                title: 'Query Builder',
                href: route('examples.query-builder'),
            },
        ],
    },
];
