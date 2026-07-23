import ExampleHeader from '@/components/data-table/example-header.jsx';
import RequestInspector from '@/components/data-table/request-inspector.jsx';
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
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select.jsx';
import { Spinner } from '@/components/ui/spinner.jsx';
import { useClipboard } from '@/hooks/use-clipboard.js';
import DashboardLayout from '@/layouts/dashboard-layout.jsx';
import ApiFilters, {
    apiFilterDefaults,
    apiFilterGroups,
    deserializeApiFilters,
    serializeApiFilters,
} from '@/pages/examples/api/partials/api-filters.jsx';
import { Head, useHttp } from '@inertiajs/react';
import {
    CheckIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    CopyIcon,
    PlayIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const initialParams = {
    search: '',
    filters: [],
    col: 'placed_at',
    sort: 'desc',
    limit: '10',
    page: '1',
};

const presets = [
    {
        label: 'Latest orders',
        params: {},
    },
    {
        label: 'Pending orders',
        params: { filters: ['status:pending'] },
    },
    {
        label: 'Unassigned orders',
        params: { filters: ['assignment:unassigned'] },
    },
    {
        label: 'High-value web orders',
        params: { filters: ['amount:high', 'source:web'] },
    },
    {
        label: 'Gift orders',
        params: { filters: ['flag:gift'] },
    },
    {
        label: 'Orders from one country',
        params: { filters: ['country:US'] },
    },
    {
        label: 'Date-range example',
        params: {
            filters: ['placed_at_from:01-12-2025', 'placed_at_to:31-12-2026'],
        },
    },
    {
        label: 'Relationship search',
        params: { search: 'Avery Morgan' },
    },
];

const sortOptions = [
    ['placed_at', 'Placed date'],
    ['order', 'Order'],
    ['customer', 'Customer'],
    ['company', 'Company'],
    ['country', 'Country'],
    ['agent', 'Agent'],
    ['status', 'Status'],
    ['payment', 'Payment'],
    ['amount', 'Amount'],
    ['items', 'Items'],
];

const titleCase = (value) =>
    value
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');

const requestUrlFor = (params) => {
    const url = new URL(route('api.orders.index'));

    if (params.search.trim()) {
        url.searchParams.set('search', params.search.trim());
    }

    params.filters.forEach((filter) =>
        url.searchParams.append('filters[]', filter),
    );
    url.searchParams.set('col', params.col);
    url.searchParams.set('sort', params.sort);
    url.searchParams.set('limit', params.limit);
    url.searchParams.set('page', params.page);

    return url.toString();
};

const shellQuote = (value) => `'${value.replaceAll("'", "'\"'\"'")}'`;

const responseBody = (body) => {
    if (!body) {
        return null;
    }

    try {
        return JSON.parse(body);
    } catch {
        return body;
    }
};

function SelectField({ id, label, value, values, onChange }) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={id}>{label}</Label>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger id={id} className="w-full">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {values.map((option) => {
                        const optionValue = Array.isArray(option)
                            ? option[0]
                            : option;
                        const optionLabel = Array.isArray(option)
                            ? option[1]
                            : titleCase(option);

                        return (
                            <SelectItem key={optionValue} value={optionValue}>
                                {optionLabel}
                            </SelectItem>
                        );
                    })}
                </SelectContent>
            </Select>
        </div>
    );
}

export default function ApiExplorer() {
    const [params, setParams] = useState(initialParams);
    const [searchDraft, setSearchDraft] = useState(initialParams.search);
    const [payload, setPayload] = useState(null);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState(null);
    const [copiedText, copy] = useClipboard();
    const { get, processing } = useHttp();
    const requestUrl = requestUrlFor(params);
    const curlCommand = `curl ${shellQuote(requestUrl)}`;
    const meta = payload?.meta;

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            setParams((current) => ({
                ...current,
                search: searchDraft.trim(),
                page: '1',
            }));
        }, 500);

        return () => window.clearTimeout(timeout);
    }, [searchDraft]);

    const update = (key, value) => {
        setParams((current) => ({
            ...current,
            [key]: value,
            page: key === 'page' ? value : '1',
        }));
    };

    const updateToolbarParams = (nextParams) => {
        setParams((current) => {
            const next =
                typeof nextParams === 'function'
                    ? nextParams(current)
                    : nextParams;

            return { ...next, page: '1' };
        });
    };

    const applyPreset = (preset) => {
        const nextParams = { ...initialParams, ...preset.params };

        setParams(nextParams);
        setSearchDraft(nextParams.search);
        setPayload(null);
        setError(null);
        setStatus(null);
    };

    const execute = async (nextParams = params) => {
        const nextUrl = requestUrlFor(nextParams);
        let handledError = false;

        setPayload(null);
        setError(null);
        setStatus(null);

        try {
            const data = await get(nextUrl, {
                onSuccess: (_, response) => setStatus(response.status),
                onError: (errors) => {
                    handledError = true;
                    setStatus(422);
                    setError({
                        message: 'The API rejected the request.',
                        body: { errors },
                    });
                },
                onHttpException: (response) => {
                    handledError = true;
                    setStatus(response.status);
                    setError({
                        message: `Request failed with status ${response.status}.`,
                        body: responseBody(response.data),
                    });
                },
                onNetworkError: (networkError) => {
                    handledError = true;
                    setError({
                        message:
                            networkError instanceof SyntaxError
                                ? 'The API returned malformed JSON.'
                                : 'The API could not be reached.',
                        body: null,
                    });
                },
            });

            if (data !== undefined) {
                setPayload(data);
            }
        } catch (requestError) {
            if (handledError) {
                return;
            }

            setError({
                message:
                    requestError instanceof SyntaxError
                        ? 'The API returned malformed JSON.'
                        : 'The request could not be completed.',
                body: null,
            });
        }
    };

    const requestPage = (page) => {
        const nextParams = { ...params, page: String(page) };
        setParams(nextParams);
        execute(nextParams);
    };

    return (
        <>
            <Head title="API Explorer" />

            <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 md:p-6">
                <ExampleHeader
                    lesson="Lesson 05 · Integration"
                    title="Order API Explorer"
                    description="Build and execute public JSON requests using the same search, filters, sorting, date, and pagination contract as every Inertia lesson."
                    features={[
                        'Eloquent API',
                        'useHttp',
                        'Resource pagination',
                        'Generated cURL',
                        'Public throttle',
                    ]}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Start with a seeded request</CardTitle>
                        <CardDescription>
                            Presets only update the public request state.
                            Execute when the generated URL matches the lesson
                            you want to inspect.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        {presets.map((preset) => (
                            <Button
                                key={preset.label}
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => applyPreset(preset)}
                            >
                                {preset.label}
                            </Button>
                        ))}
                    </CardContent>
                </Card>

                <TableToolbar
                    placeholder="Search order or relationship name"
                    search={searchDraft}
                    params={params}
                    setParams={updateToolbarParams}
                    setTimeDebounce={() => {}}
                    onSearchChange={setSearchDraft}
                    filterTitle="Filter API request"
                    filterDescription="Editing changes a draft. Apply commits filters to the generated request."
                    filterConfig={{
                        defaults: apiFilterDefaults,
                        deserialize: deserializeApiFilters,
                        serialize: serializeApiFilters,
                        groups: apiFilterGroups,
                    }}
                    filters={({ data, setData }) => (
                        <ApiFilters data={data} setData={setData} />
                    )}
                />

                <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                    <Card>
                        <CardHeader>
                            <CardTitle>Request options</CardTitle>
                            <CardDescription>
                                Sorting and page selection update the applied
                                request without executing it.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <SelectField
                                id="api-sort-column"
                                label="Sort column"
                                value={params.col}
                                values={sortOptions}
                                onChange={(value) => update('col', value)}
                            />
                            <SelectField
                                id="api-sort-direction"
                                label="Sort direction"
                                value={params.sort}
                                values={[
                                    ['asc', 'Ascending'],
                                    ['desc', 'Descending'],
                                ]}
                                onChange={(value) => update('sort', value)}
                            />
                            <div className="grid gap-2">
                                <Label htmlFor="api-page">Page</Label>
                                <Input
                                    id="api-page"
                                    type="number"
                                    min="1"
                                    value={params.page}
                                    onChange={(event) =>
                                        update('page', event.target.value)
                                    }
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex min-w-0 flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Generated request</CardTitle>
                                <CardDescription>
                                    The URL and cURL command are derived from
                                    the same state used by Execute.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <div className="grid gap-2">
                                    <Label>Request URL</Label>
                                    <pre className="overflow-x-auto rounded-lg border border-border bg-muted/40 p-3 font-mono text-xs whitespace-pre-wrap text-foreground">
                                        {requestUrl}
                                    </pre>
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center justify-between gap-3">
                                        <Label>cURL</Label>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => copy(curlCommand)}
                                        >
                                            {copiedText === curlCommand ? (
                                                <CheckIcon />
                                            ) : (
                                                <CopyIcon />
                                            )}
                                            {copiedText === curlCommand
                                                ? 'Copied'
                                                : 'Copy'}
                                        </Button>
                                    </div>
                                    <pre className="overflow-x-auto rounded-lg bg-zinc-950 p-3 font-mono text-xs whitespace-pre-wrap text-zinc-100">
                                        {curlCommand}
                                    </pre>
                                </div>
                                <Button
                                    type="button"
                                    onClick={() => execute()}
                                    disabled={processing}
                                >
                                    {processing ? <Spinner /> : <PlayIcon />}
                                    {processing
                                        ? 'Executing...'
                                        : 'Execute request'}
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="min-h-96">
                            <CardHeader>
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex flex-col gap-1">
                                        <CardTitle>JSON response</CardTitle>
                                        <CardDescription>
                                            Standard Laravel resource
                                            pagination.
                                        </CardDescription>
                                    </div>
                                    {status && (
                                        <Badge
                                            variant={
                                                status >= 200 && status < 300
                                                    ? 'secondary'
                                                    : 'destructive'
                                            }
                                        >
                                            HTTP {status}
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                {processing ? (
                                    <div className="flex min-h-56 items-center justify-center gap-2 text-sm text-muted-foreground">
                                        <Spinner /> Loading API response...
                                    </div>
                                ) : error ? (
                                    <div className="flex flex-col gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-4">
                                        <p className="font-medium text-destructive">
                                            {error.message}
                                        </p>
                                        {error.body && (
                                            <pre className="overflow-x-auto rounded-lg bg-background p-3 font-mono text-xs whitespace-pre-wrap text-foreground">
                                                {typeof error.body === 'string'
                                                    ? error.body
                                                    : JSON.stringify(
                                                          error.body,
                                                          null,
                                                          2,
                                                      )}
                                            </pre>
                                        )}
                                    </div>
                                ) : payload ? (
                                    <>
                                        {payload.data?.length === 0 && (
                                            <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
                                                The request succeeded but
                                                returned no orders.
                                            </div>
                                        )}
                                        {meta && (
                                            <dl className="grid grid-cols-2 gap-3 rounded-lg border border-border p-3 text-sm sm:grid-cols-3">
                                                {[
                                                    ['Page', meta.current_page],
                                                    [
                                                        'Last page',
                                                        meta.last_page,
                                                    ],
                                                    ['Per page', meta.per_page],
                                                    ['Total', meta.total],
                                                    ['From', meta.from ?? 0],
                                                    ['To', meta.to ?? 0],
                                                ].map(([label, value]) => (
                                                    <div
                                                        key={label}
                                                        className="flex flex-col gap-1"
                                                    >
                                                        <dt className="text-xs text-muted-foreground">
                                                            {label}
                                                        </dt>
                                                        <dd className="font-mono font-medium tabular-nums">
                                                            {value}
                                                        </dd>
                                                    </div>
                                                ))}
                                            </dl>
                                        )}
                                        <pre className="max-h-[38rem] overflow-auto rounded-lg bg-zinc-950 p-4 font-mono text-xs text-zinc-100">
                                            {JSON.stringify(payload, null, 2)}
                                        </pre>
                                        {meta && (
                                            <div className="flex items-center justify-between gap-3">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() =>
                                                        requestPage(
                                                            meta.current_page -
                                                                1,
                                                        )
                                                    }
                                                    disabled={
                                                        processing ||
                                                        meta.current_page <= 1
                                                    }
                                                >
                                                    <ChevronLeftIcon /> Previous
                                                </Button>
                                                <span className="text-sm text-muted-foreground">
                                                    Page {meta.current_page} of{' '}
                                                    {meta.last_page}
                                                </span>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() =>
                                                        requestPage(
                                                            meta.current_page +
                                                                1,
                                                        )
                                                    }
                                                    disabled={
                                                        processing ||
                                                        meta.current_page >=
                                                            meta.last_page
                                                    }
                                                >
                                                    Next <ChevronRightIcon />
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex min-h-56 items-center justify-center text-center text-sm text-muted-foreground">
                                        Choose a preset or edit the request,
                                        then execute it to inspect the JSON
                                        response.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <RequestInspector
                    search={params.search}
                    filters={params.filters}
                    sortColumn={params.col}
                    sortDirection={params.sort}
                    perPage={params.limit}
                    page={params.page}
                    queryString={new URL(requestUrl).search}
                />
            </main>
        </>
    );
}

ApiExplorer.layout = () => [
    DashboardLayout,
    {
        breadcrumbs: [
            { title: 'Overview', href: route('dashboard') },
            { title: 'API Explorer', href: route('examples.api-explorer') },
        ],
    },
];
