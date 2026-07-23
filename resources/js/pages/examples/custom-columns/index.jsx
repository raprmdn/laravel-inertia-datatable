import ExampleHeader from '@/components/data-table/example-header.jsx';
import RequestInspector from '@/components/data-table/request-inspector.jsx';
import TablePagination from '@/components/data-table/table-pagination.jsx';
import TableSortHeader from '@/components/data-table/table-sort-header.jsx';
import TableToolbar from '@/components/data-table/table-toolbar.jsx';
import { Badge } from '@/components/ui/badge.jsx';
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
import CustomColumnFilters, {
    customColumnFilterDefaults,
    customColumnFilterGroups,
    deserializeCustomColumnFilters,
    serializeCustomColumnFilters,
} from '@/pages/examples/custom-columns/partials/custom-column-filters.jsx';
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

export default function CustomColumns() {
    const page = usePage();
    const { orders, statuses = [], filters = {} } = page.props;
    const initialParams = {
        search: filters.search ?? '',
        filters: Array.isArray(filters.filters) ? filters.filters : [],
        col: filters.col ?? null,
        sort: filters.sort ?? null,
        limit: Number(filters.limit ?? 10),
    };
    const { params, setParams, setTimeDebounce } = useDebouncedSearch(
        route('examples.custom-columns'),
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
            <Head title="Custom Columns" />

            <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 md:p-6">
                <ExampleHeader
                    lesson="Lesson 03 · Advanced columns"
                    title="Custom Columns"
                    description="Translate readable request values into null checks, JSON operations, grouped business filters, and deterministic business sorting without exposing SQL choices to the URL."
                    features={[
                        'Filter aliases',
                        'JSON equality',
                        'JSON contains',
                        'Filter callback',
                        'Sort callback',
                    ]}
                />

                <section
                    className="flex flex-col gap-4"
                    aria-label="Custom columns orders table"
                >
                    <TableToolbar
                        placeholder="Search order, customer, or agent"
                        search={params.search}
                        params={params}
                        setParams={setParams}
                        setTimeDebounce={setTimeDebounce}
                        filterTitle="Filter custom columns"
                        filterDescription="Aliases, JSON values, and amount bands remain raw filters[] entries."
                        filterConfig={{
                            defaults: customColumnFilterDefaults,
                            deserialize: deserializeCustomColumnFilters,
                            serialize: serializeCustomColumnFilters,
                            groups: customColumnFilterGroups(statuses),
                        }}
                        filters={({ data, setData }) => (
                            <CustomColumnFilters
                                data={data}
                                setData={setData}
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
                                    className="min-w-64"
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
                                <TableHead>
                                    <TableSortHeader
                                        title="Status"
                                        sort={
                                            sortColumn === 'status'
                                                ? sortDirection
                                                : null
                                        }
                                        onClick={() => sort('status')}
                                    />
                                </TableHead>
                                <TableHead className="min-w-44">
                                    Shipping
                                </TableHead>
                                <TableHead className="min-w-44">
                                    Assignment
                                </TableHead>
                                <TableHead>Source</TableHead>
                                <TableHead className="min-w-52">
                                    Flags
                                </TableHead>
                                <TableHead className="text-right">
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
                                                    {order.customer?.name}
                                                    {order.reference
                                                        ? ` · ${order.reference}`
                                                        : ''}
                                                </span>
                                            </div>
                                        </TableCellSticky>
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
                                        <TableCell>
                                            {order.agent?.name ?? (
                                                <span className="text-muted-foreground">
                                                    Unassigned
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {formatSnakeCase(
                                                    order.source ?? 'unknown',
                                                )}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {order.flags.length > 0 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {order.flags.map((flag) => (
                                                        <Badge
                                                            key={flag}
                                                            variant="secondary"
                                                        >
                                                            {formatSnakeCase(
                                                                flag,
                                                            )}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    None
                                                </span>
                                            )}
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
                                        colSpan={8}
                                        className="h-56 text-center"
                                    >
                                        <div className="mx-auto flex max-w-sm flex-col items-center gap-3 whitespace-normal">
                                            <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                                <SearchXIcon />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <p className="font-medium">
                                                    No matching custom columns
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Remove an alias, JSON, or
                                                    amount filter to broaden the
                                                    request.
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

CustomColumns.layout = () => [
    DashboardLayout,
    {
        breadcrumbs: [
            { title: 'Overview', href: route('dashboard') },
            {
                title: 'Custom Columns',
                href: route('examples.custom-columns'),
            },
        ],
    },
];
