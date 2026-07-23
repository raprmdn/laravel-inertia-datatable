import ExampleHeader from '@/components/data-table/example-header.jsx';
import RequestInspector from '@/components/data-table/request-inspector.jsx';
import TablePagination from '@/components/data-table/table-pagination.jsx';
import TableSortHeader from '@/components/data-table/table-sort-header.jsx';
import TableToolbar from '@/components/data-table/table-toolbar.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card.jsx';
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
import MigrationFilters, {
    deserializeMigrationFilters,
    migrationFilterDefaults,
    migrationFilterGroups,
    serializeMigrationFilters,
} from '@/pages/examples/migration/partials/migration-filters.jsx';
import { Head, router, usePage } from '@inertiajs/react';
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

const migrationMappings = [
    ['searchable([...])', 'Column::make() / Column::group()->searchable()'],
    ['parseFilters()', 'filterable() sources'],
    ['parseSort()', 'sortable() sources'],
    ['allowedFilters()', 'definition capabilities'],
    ['allowedSorts()', 'definition capabilities'],
    ['parser aliases', 'filterAliases()'],
    ['legacy JSON handling', 'jsonContains()'],
    ['global custom filtering', 'filterUsing()'],
];

const compactParams = (params) =>
    Object.fromEntries(
        Object.entries(params).filter(([, value]) =>
            Array.isArray(value)
                ? value.length > 0
                : value !== null && value !== undefined && value !== '',
        ),
    );

const statusVariant = (status) => {
    if (status === 'cancelled' || status === 'failed') {
        return 'destructive';
    }

    if (status === 'delivered' || status === 'paid') {
        return 'default';
    }

    return status === 'shipped' || status === 'authorized'
        ? 'secondary'
        : 'outline';
};

export default function MigrationComparison() {
    const page = usePage();
    const {
        implementation,
        orders,
        customer_options: customers = [],
        statuses = [],
        payment_statuses: paymentStatuses = [],
        filters = {},
    } = page.props;
    const customerOptions = customers.map((customer) => ({
        value: String(customer.id),
        label: customer.name,
    }));
    const initialParams = {
        search: filters.search ?? '',
        filters: Array.isArray(filters.filters) ? filters.filters : [],
        col: filters.col ?? null,
        sort: filters.sort ?? null,
        limit: Number(filters.limit ?? 10),
    };
    const routeName =
        implementation === 'legacy'
            ? 'examples.migration.legacy'
            : 'examples.migration.current';
    const { params, setParams, setTimeDebounce } = useDebouncedSearch(
        route(routeName),
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

    const toggle = (nextImplementation) => {
        const nextRoute =
            nextImplementation === 'legacy'
                ? 'examples.migration.legacy'
                : 'examples.migration.current';

        router.get(
            route(nextRoute),
            compactParams({ ...params, page: currentPage }),
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                queryStringArrayFormat: 'indices',
            },
        );
    };

    return (
        <>
            <Head title="Legacy to v0.6" />

            <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 md:p-6">
                <ExampleHeader
                    lesson="Lesson 06 · Migration"
                    title="Legacy parser to ColumnDefinitions"
                    description="Run one Order table through either implementation and compare the configuration style without changing the public request contract."
                    features={[
                        'One shared table',
                        'Parser helpers',
                        'ColumnDefinitions',
                        'Behavior parity',
                        'Stateful toggle',
                    ]}
                />

                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex flex-col gap-1">
                                <CardTitle>
                                    Change configuration, not behavior
                                </CardTitle>
                                <CardDescription>
                                    The URL, query, resource, and table stay the
                                    same while capabilities move into column
                                    definitions.
                                </CardDescription>
                            </div>
                            <Badge variant="secondary">
                                {implementation === 'legacy'
                                    ? 'Legacy parser active'
                                    : 'ColumnDefinitions active'}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-5">
                        <div className="flex flex-wrap gap-2">
                            <Button
                                type="button"
                                variant={
                                    implementation === 'current'
                                        ? 'default'
                                        : 'outline'
                                }
                                onClick={() => toggle('current')}
                            >
                                ColumnDefinitions
                            </Button>
                            <Button
                                type="button"
                                variant={
                                    implementation === 'legacy'
                                        ? 'default'
                                        : 'outline'
                                }
                                onClick={() => toggle('legacy')}
                            >
                                Legacy parser
                            </Button>
                        </div>

                        <div className="overflow-hidden rounded-lg border border-border text-xs">
                            <div className="grid grid-cols-2 gap-4 bg-muted px-4 py-2 font-medium text-muted-foreground">
                                <span>Parser-based API</span>
                                <span>ColumnDefinitions</span>
                            </div>
                            {migrationMappings.map(([legacy, current]) => (
                                <div
                                    key={legacy}
                                    className="grid grid-cols-2 gap-4 border-t border-border px-4 py-3 font-mono"
                                >
                                    <code>{legacy}</code>
                                    <code className="text-primary">
                                        {current}
                                    </code>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <section
                    className="flex flex-col gap-4"
                    aria-label="Migration comparison orders table"
                >
                    <TableToolbar
                        key={implementation}
                        placeholder="Search order, reference, or customer"
                        search={params.search}
                        params={params}
                        setParams={setParams}
                        setTimeDebounce={setTimeDebounce}
                        filterTitle="Filter migration example"
                        filterDescription="Both implementations receive the same raw filters[] values."
                        filterConfig={{
                            defaults: migrationFilterDefaults,
                            deserialize: deserializeMigrationFilters,
                            serialize: serializeMigrationFilters,
                            groups: migrationFilterGroups({
                                statuses,
                                paymentStatuses,
                                customerOptions,
                            }),
                        }}
                        filters={({ data, setData }) => (
                            <MigrationFilters
                                data={data}
                                setData={setData}
                                statuses={statuses}
                                paymentStatuses={paymentStatuses}
                                customerOptions={customerOptions}
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
                                    ['status', 'Status', 'min-w-32'],
                                    ['payment', 'Payment', 'min-w-32'],
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
                                <TableHead className="min-w-44">
                                    Shipping
                                </TableHead>
                                <TableHead className="min-w-32 text-right">
                                    <TableSortHeader
                                        title="Amount"
                                        sort={
                                            sortColumn === 'amount'
                                                ? sortDirection
                                                : null
                                        }
                                        onClick={() => sort('amount')}
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
                                                <span className="font-sans text-xs font-normal text-muted-foreground">
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
                                            <Badge
                                                variant={statusVariant(
                                                    order.status,
                                                )}
                                            >
                                                {formatSnakeCase(order.status)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={statusVariant(
                                                    order.payment_status,
                                                )}
                                            >
                                                {formatSnakeCase(
                                                    order.payment_status,
                                                )}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <span>
                                                    {order.shipped_at
                                                        ? 'Shipped'
                                                        : 'Unshipped'}
                                                </span>
                                                {order.shipped_at && (
                                                    <span className="text-xs text-muted-foreground">
                                                        {dateFormatter.format(
                                                            new Date(
                                                                order.shipped_at,
                                                            ),
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-mono tabular-nums">
                                            {moneyFormatter.format(
                                                Number(order.total_amount),
                                            )}
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
                                                    No matching migration rows
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Both implementations return
                                                    the same empty result for
                                                    this request.
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
                    page={currentPage}
                    queryString={currentQuery}
                />
            </main>
        </>
    );
}

MigrationComparison.layout = () => [
    DashboardLayout,
    {
        breadcrumbs: [
            { title: 'Overview', href: route('dashboard') },
            {
                title: 'Legacy to v0.6',
                href: route('examples.migration.current'),
            },
        ],
    },
];
