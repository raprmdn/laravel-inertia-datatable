import { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import ButtonWithLoading from '@/components/button-with-loading.jsx';
import IconPack from '@/components/icon-pack.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover.jsx';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select.jsx';
import { Separator } from '@/components/ui/separator.jsx';
import { __ } from '@/lib/lang.jsx';
import { formatSnakeCase } from '@/lib/utils.js';
import { Search, XIcon } from 'lucide-react';

const RowsPerPageSelect = ({
    limit,
    setLimit,
    setParams,
    params,
    setTimeDebounce,
}) => (
    <Select
        value={limit}
        onValueChange={(value) => {
            setLimit(value);
            setTimeDebounce(50);
            setParams({ ...params, limit: value });
        }}
    >
        <SelectTrigger className="w-[75px] cursor-pointer rounded-xl focus:ring-0 focus:ring-offset-0 focus:outline-none data-[size=default]:h-10">
            <SelectValue placeholder="10" />
        </SelectTrigger>
        <SelectContent position="popper" className="mt-1 rounded-xl">
            {[10, 25, 50, 100].map((limit) => (
                <SelectItem
                    key={limit}
                    value={`${limit}`}
                    className="cursor-pointer text-foreground focus:bg-muted"
                >
                    {limit}
                </SelectItem>
            ))}
        </SelectContent>
    </Select>
);

const SearchInput = ({
    placeholder,
    search,
    setParams,
    params,
    setTimeDebounce,
}) => (
    <div className="relative w-full min-w-0 sm:w-[250px]">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
            placeholder={placeholder || 'Search'}
            className="h-10 w-full rounded-xl pl-9"
            value={search || ''}
            onChange={(event) => {
                setParams({ ...params, search: event.target.value });
                setTimeDebounce(500);
            }}
        />
    </div>
);

const FilterBadges = ({
    appliedFilters,
    params,
    setParams,
    setTimeDebounce,
    setData,
    emptyDefaults,
}) => {
    if (!appliedFilters?.length) return null;

    const humanizeKey = (key) =>
        key
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

    const groups = appliedFilters.reduce((acc, filter) => {
        const [rawKey, value] = filter.split(':');
        const isDate = rawKey.endsWith('_from') || rawKey.endsWith('_to');
        const key = isDate ? rawKey.replace(/_(from|to)$/, '') : rawKey;

        if (!acc[key]) {
            acc[key] = { type: isDate ? 'date' : 'list', values: {} };
        }

        if (isDate) {
            acc[key].values[rawKey.endsWith('_from') ? 'from' : 'to'] = value;
        } else {
            acc[key].items = [...(acc[key].items || []), value];
        }

        return acc;
    }, {});

    const removeFilters = (key, type) => {
        const prefix = type === 'date' ? `${key}_` : `${key}:`;
        const nextFilters = appliedFilters.filter(
            (filter) => !filter.startsWith(prefix),
        );

        setTimeDebounce(50);
        setParams({ ...params, filters: nextFilters });

        if (emptyDefaults) {
            if (type === 'date') {
                [`${key}_from`, `${key}_to`].forEach((field) => {
                    if (field in emptyDefaults) {
                        setData(field, emptyDefaults[field]);
                    }
                });
            } else {
                setData(key, emptyDefaults[key]);
            }
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            {Object.entries(groups).map(([key, group]) => (
                <div
                    key={key}
                    className="flex h-8 items-center gap-1 rounded-md border border-border bg-white px-2.5 shadow-xs dark:bg-background"
                >
                    <span className="text-xs font-medium text-foreground capitalize">
                        {humanizeKey(key)}
                    </span>

                    <Separator orientation="vertical" className="mx-1 h-4" />

                    <div className="flex items-center gap-1">
                        {group.type === 'date' ? (
                            <Badge className="rounded-sm bg-muted text-primary">
                                {`${group.values.from || ''} - ${group.values.to || ''}`}
                            </Badge>
                        ) : group.items.length > 3 ? (
                            <Badge className="rounded-sm bg-muted text-primary">
                                {group.items.length} {__('selected')}
                            </Badge>
                        ) : (
                            group.items.map((value) => (
                                <Badge
                                    key={value}
                                    className="rounded-sm bg-muted text-primary"
                                >
                                    {formatSnakeCase(value)}
                                </Badge>
                            ))
                        )}
                    </div>

                    <Separator orientation="vertical" className="mx-1 h-4" />
                    <button
                        type="button"
                        onClick={() => removeFilters(key, group.type)}
                        className="cursor-pointer text-muted-foreground hover:text-foreground"
                    >
                        <XIcon className="size-3" />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default function TableToolbar({
    placeholder,
    params,
    setParams,
    setTimeDebounce,
    search,
    filters,
    defaultFilterValues = {},
}) {
    const [limit, setLimit] = useState((params.limit || 10).toString());
    const [openFilter, setOpenFilter] = useState(false);
    const { filters: filterProps } = usePage().props;

    const parseFilters = (filtersArray = []) =>
        Object.keys(defaultFilterValues).reduce((acc, key) => {
            const isArray = Array.isArray(defaultFilterValues[key]);
            const matched = (filtersArray || [])
                .filter((filter) => filter.startsWith(`${key}:`))
                .map((filter) => filter.split(':')[1]);
            acc[key] = isArray ? matched : (matched[0] ?? '');

            return acc;
        }, {});

    const emptyDefaults = Object.keys(defaultFilterValues).reduce(
        (acc, key) => {
            acc[key] = Array.isArray(defaultFilterValues[key]) ? [] : '';

            return acc;
        },
        {},
    );

    const { data, setData } = useForm(
        parseFilters(filterProps?.filters ?? params?.filters),
    );

    const applyFilter = () => {
        const filtersArray = Object.entries(data).flatMap(([key, values]) =>
            Array.isArray(values)
                ? values.map((value) => `${key}:${value}`)
                : values
                  ? [`${key}:${values}`]
                  : [],
        );

        setTimeDebounce(50);
        setParams({ ...params, filters: filtersArray });

        setOpenFilter(false);
    };

    const resetFilter = () => {
        Object.keys(emptyDefaults).forEach((key) => {
            setData(key, emptyDefaults[key]);
        });

        setTimeDebounce(50);
        setParams({ ...params, filters: [] });

        setOpenFilter(false);
    };

    const hasAnyFilterApplied = () =>
        Array.isArray(params?.filters) && params.filters.length > 0;

    const keepOpenForNestedPopover = (event) => {
        const target = event.target;

        if (!(target instanceof HTMLElement)) {
            return;
        }

        if (
            target.closest(
                '[data-slot="popover-content"], [data-slot="select-content"], [data-slot="calendar"], [data-radix-popper-content-wrapper]',
            )
        ) {
            event.preventDefault();
        }
    };

    return (
        <>
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 md:flex-none">
                    <SearchInput
                        placeholder={placeholder}
                        search={search}
                        setParams={setParams}
                        params={params}
                        setTimeDebounce={setTimeDebounce}
                    />
                    {filters && (
                        <Popover open={openFilter} onOpenChange={setOpenFilter}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={
                                        openFilter || hasAnyFilterApplied()
                                            ? 'filter-active'
                                            : 'filter-outline'
                                    }
                                    className="h-10 rounded-xl shadow-xs"
                                >
                                    {hasAnyFilterApplied() ? (
                                        <IconPack.FilterApplied className="size-5" />
                                    ) : openFilter ? (
                                        <IconPack.FilterFilled className="size-4" />
                                    ) : (
                                        <IconPack.Filter className="size-4" />
                                    )}
                                    <span className="hidden md:block">
                                        {__('Filter')}
                                    </span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                align="start"
                                sideOffset={8}
                                className="w-[calc(100vw-2rem)] rounded-xl p-0 sm:w-[380px] md:w-[420px]"
                                onInteractOutside={keepOpenForNestedPopover}
                            >
                                <div className="space-y-4 p-5">
                                    <div className="space-y-1.5">
                                        <h2 className="text-lg font-bold text-foreground">
                                            {__('Filters')}
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            {__(
                                                'Filter data to display by applying one or more filters.',
                                            )}
                                        </p>
                                    </div>

                                    <div>
                                        {typeof filters === 'function'
                                            ? filters({ data, setData })
                                            : filters}
                                    </div>
                                </div>

                                <div className="border-t border-dashed p-4">
                                    <div className="grid gap-2 sm:grid-cols-3">
                                        <Button
                                            type="button"
                                            variant="filter-outline"
                                            onClick={() => setOpenFilter(false)}
                                        >
                                            {__('Close')}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="filter-outline"
                                            onClick={resetFilter}
                                            disabled={!hasAnyFilterApplied()}
                                        >
                                            {__('Reset Filter')}
                                        </Button>
                                        <ButtonWithLoading
                                            type="button"
                                            variant="primary"
                                            processing={false}
                                            label={__('Apply Filter')}
                                            onClick={applyFilter}
                                        />
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}
                </div>

                <div className="flex items-center gap-1.5">
                    <p className="hidden text-sm text-foreground md:block">
                        {__('Show')}
                    </p>
                    <RowsPerPageSelect
                        limit={limit}
                        setLimit={setLimit}
                        setParams={setParams}
                        params={params}
                        setTimeDebounce={setTimeDebounce}
                    />
                </div>
            </div>

            {filters && (
                <FilterBadges
                    appliedFilters={params?.filters}
                    params={params}
                    setParams={setParams}
                    setTimeDebounce={setTimeDebounce}
                    setData={setData}
                    emptyDefaults={emptyDefaults}
                />
            )}
        </>
    );
}
