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
import BasicOrderFilters, {
    basicOrderFilterDefaults,
    basicOrderFilterGroups,
    deserializeBasicOrderFilters,
    serializeBasicOrderFilters,
} from '@/pages/examples/basic-orders/partials/basic-order-filters.jsx';
import { Head, usePage } from '@inertiajs/react';
import { SearchXIcon } from 'lucide-react';

const moneyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

const dateFormatter = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
});

const badgeVariant = (value) => {
    if (value === 'cancelled' || value === 'failed') {
        return 'destructive';
    }

    if (value === 'delivered' || value === 'paid') {
        return 'default';
    }

    if (value === 'shipped' || value === 'authorized') {
        return 'secondary';
    }

    return 'outline';
};

const formatDate = (value) => {
    if (!value) {
        return 'Not placed';
    }

    return dateFormatter.format(new Date(value));
};

export default function BasicOrders() {
    const page = usePage();
    const {
        orders,
        statuses = [],
        payment_statuses: paymentStatuses = [],
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
        route('examples.basic-orders'),
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
            <Head title="Basic Orders" />

            <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 md:p-6">
                <ExampleHeader
                    lesson="Lesson 01 · Core workflow"
                    title="Basic Orders"
                    description="Start with a focused Eloquent query, declare public column capabilities, and let the package apply safe search, raw filters, sorting, and pagination from the URL."
                    features={[
                        'Implicit sources',
                        'Column groups',
                        'Raw filters',
                        'Date range',
                        'URL state',
                    ]}
                />

                <section
                    className="flex flex-col gap-4"
                    aria-label="Orders table"
                >
                    <TableToolbar
                        placeholder="Search order or reference"
                        search={params.search}
                        params={params}
                        setParams={setParams}
                        setTimeDebounce={setTimeDebounce}
                        filterTitle="Filter orders"
                        filterDescription="Values use the package's raw column:value contract."
                        filterConfig={{
                            defaults: basicOrderFilterDefaults,
                            deserialize: deserializeBasicOrderFilters,
                            serialize: serializeBasicOrderFilters,
                            groups: basicOrderFilterGroups(
                                statuses,
                                paymentStatuses,
                            ),
                        }}
                        filters={({ data, setData }) => (
                            <BasicOrderFilters
                                data={data}
                                setData={setData}
                                statuses={statuses}
                                paymentStatuses={paymentStatuses}
                            />
                        )}
                    />

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHeadSticky
                                    index={0}
                                    isLast
                                    className="min-w-48"
                                >
                                    <TableSortHeader
                                        title="Order"
                                        sort={
                                            sortColumn === 'order_number'
                                                ? sortDirection
                                                : null
                                        }
                                        onClick={() => sort('order_number')}
                                    />
                                </TableHeadSticky>
                                <TableHead className="min-w-44">
                                    <TableSortHeader
                                        title="Reference"
                                        sort={
                                            sortColumn === 'reference'
                                                ? sortDirection
                                                : null
                                        }
                                        onClick={() => sort('reference')}
                                    />
                                </TableHead>
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
                                <TableHead>
                                    <TableSortHeader
                                        title="Payment"
                                        sort={
                                            sortColumn === 'payment_status'
                                                ? sortDirection
                                                : null
                                        }
                                        onClick={() => sort('payment_status')}
                                    />
                                </TableHead>
                                <TableHead className="text-right">
                                    <TableSortHeader
                                        title="Amount"
                                        sort={
                                            sortColumn === 'total_amount'
                                                ? sortDirection
                                                : null
                                        }
                                        onClick={() => sort('total_amount')}
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
                                            {order.order_number}
                                        </TableCellSticky>
                                        <TableCell>
                                            {order.reference ? (
                                                <span className="font-mono text-xs">
                                                    {order.reference}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    Not provided
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={badgeVariant(
                                                    order.status,
                                                )}
                                            >
                                                {formatSnakeCase(order.status)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={badgeVariant(
                                                    order.payment_status,
                                                )}
                                            >
                                                {formatSnakeCase(
                                                    order.payment_status,
                                                )}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-mono tabular-nums">
                                            {moneyFormatter.format(
                                                Number(order.total_amount),
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(order.placed_at)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="h-56 text-center"
                                    >
                                        <div className="mx-auto flex max-w-sm flex-col items-center gap-3 whitespace-normal">
                                            <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                                <SearchXIcon />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <p className="font-medium">
                                                    No matching orders
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Remove a filter or try a
                                                    broader order or reference
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

BasicOrders.layout = () => [
    DashboardLayout,
    {
        breadcrumbs: [
            { title: 'Overview', href: route('dashboard') },
            { title: 'Basic Orders', href: route('examples.basic-orders') },
        ],
    },
];
