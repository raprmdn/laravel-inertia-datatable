import ButtonWithLoading from '@/components/button-with-loading.jsx';
import IconPack from '@/components/icon-pack.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer.jsx';
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
import { useIsMobile } from '@/hooks/use-mobile.jsx';
import { __ } from '@/lib/lang.jsx';
import { formatSnakeCase } from '@/lib/utils.js';
import { useForm, usePage } from '@inertiajs/react';
import { Search, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
});

const parsedFilter = (filter) => {
    const separator = filter.indexOf(':');

    if (separator < 1) {
        return null;
    }

    return {
        key: filter.slice(0, separator),
        value: filter.slice(separator + 1),
    };
};

const formatFilterDate = (value) => {
    const [day, month, year] = value.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    if (
        !day ||
        !month ||
        !year ||
        date.getUTCDate() !== day ||
        date.getUTCMonth() !== month - 1 ||
        date.getUTCFullYear() !== year
    ) {
        return value;
    }

    return dateFormatter.format(date);
};

const defaultGroups = (defaults, labels) =>
    Object.keys(defaults).reduce((groups, key) => {
        const isDate = key.endsWith('_from') || key.endsWith('_to');
        const id = isDate ? key.replace(/_(from|to)$/, '') : key;
        const existing = groups.find((group) => group.id === id);

        if (existing) {
            existing.keys.push(key);

            return groups;
        }

        groups.push({
            id,
            label: formatSnakeCase(id),
            keys: [key],
            labels: labels[id] ?? labels[key] ?? {},
            type: isDate ? 'date-range' : 'values',
        });

        return groups;
    }, []);

const defaultDeserialize = (filters, defaults) =>
    Object.keys(defaults).reduce((draft, key) => {
        const values = (filters ?? [])
            .map(parsedFilter)
            .filter((filter) => filter?.key === key)
            .map((filter) => filter.value);

        draft[key] = Array.isArray(defaults[key]) ? values : (values[0] ?? '');

        return draft;
    }, {});

const defaultSerialize = (draft) =>
    Object.entries(draft).flatMap(([key, values]) =>
        Array.isArray(values)
            ? values.map((value) => `${key}:${value}`)
            : values
              ? [`${key}:${values}`]
              : [],
    );

const RowsPerPageSelect = ({ limit, setParams, setTimeDebounce }) => (
    <Select
        value={limit}
        onValueChange={(value) => {
            setTimeDebounce(50);
            setParams((current) => ({ ...current, limit: value }));
        }}
    >
        <SelectTrigger className="w-18.75 shrink-0 cursor-pointer rounded-lg border-border bg-background focus:ring-0 focus:ring-offset-0 focus:outline-none data-[size=default]:h-10">
            <SelectValue placeholder="10" />
        </SelectTrigger>
        <SelectContent position="popper" className="mt-1 rounded-lg">
            {[10, 25, 50, 100].map((value) => (
                <SelectItem key={value} value={String(value)}>
                    {value}
                </SelectItem>
            ))}
        </SelectContent>
    </Select>
);

const SearchInput = ({
    placeholder,
    search,
    setParams,
    setTimeDebounce,
    onSearchChange,
}) => (
    <div className="relative w-full min-w-0">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
            placeholder={placeholder || 'Search'}
            aria-label={placeholder || 'Search'}
            className="h-10 w-full rounded-lg border-border bg-background pl-9"
            value={search || ''}
            onChange={(event) => {
                if (onSearchChange) {
                    onSearchChange(event.target.value);

                    return;
                }

                setTimeDebounce(500);
                setParams((current) => ({
                    ...current,
                    search: event.target.value,
                }));
            }}
        />
    </div>
);

const FilterBadges = ({
    appliedFilters,
    groups,
    setParams,
    setTimeDebounce,
}) => {
    if (!appliedFilters.length) {
        return null;
    }

    const parsedFilters = appliedFilters.map(parsedFilter).filter(Boolean);
    const configuredKeys = new Set(groups.flatMap((group) => group.keys));
    const fallbackGroups = Array.from(
        new Set(
            parsedFilters
                .map((filter) => filter.key)
                .filter((key) => !configuredKeys.has(key)),
        ),
    ).map((key) => ({
        id: key,
        label: formatSnakeCase(key),
        keys: [key],
        labels: {},
        type: 'values',
    }));
    const visibleGroups = [...groups, ...fallbackGroups]
        .map((group) => ({
            ...group,
            filters: parsedFilters.filter((filter) =>
                group.keys.includes(filter.key),
            ),
        }))
        .filter((group) => group.filters.length > 0);

    const groupValue = (group) => {
        if (group.type === 'date-range') {
            const from = group.filters.find((filter) =>
                filter.key.endsWith('_from'),
            )?.value;
            const to = group.filters.find((filter) =>
                filter.key.endsWith('_to'),
            )?.value;

            if (from && to) {
                return `${formatFilterDate(from)} - ${formatFilterDate(to)}`;
            }

            return from
                ? `From ${formatFilterDate(from)}`
                : `Through ${formatFilterDate(to)}`;
        }

        return Array.from(new Set(group.filters.map((filter) => filter.value)))
            .map(
                (value) =>
                    group.labels?.[value] ?? formatSnakeCase(value) ?? value,
            )
            .join(', ');
    };

    const removeGroup = (group) => {
        const nextFilters = appliedFilters.filter(
            (filter) => !group.keys.includes(parsedFilter(filter)?.key),
        );

        setTimeDebounce(50);
        setParams((current) => ({ ...current, filters: nextFilters }));
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            {visibleGroups.map((group) => {
                const value = groupValue(group);
                const fullLabel = `${group.label}: ${value}`;

                return (
                    <Badge
                        key={group.id}
                        variant="outline"
                        className="flex h-8 max-w-full items-center gap-1.5 rounded-md px-2.5 font-normal"
                        title={fullLabel}
                    >
                        <span className="shrink-0 text-xs font-medium">
                            {group.label}:
                        </span>
                        <span className="max-w-72 truncate text-xs">
                            {value}
                        </span>
                        <button
                            type="button"
                            onClick={() => removeGroup(group)}
                            aria-label={`Remove ${group.label} filters`}
                            className="shrink-0 rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                        >
                            <XIcon className="size-3" />
                        </button>
                    </Badge>
                );
            })}
        </div>
    );
};

const FilterActions = ({
    hasAppliedFilters,
    hasDraftFilters,
    onClose,
    onReset,
    onApply,
    mobile = false,
}) => (
    <div className={mobile ? 'grid gap-2' : 'grid gap-2 sm:grid-cols-3'}>
        <Button
            type="button"
            variant="filter-outline"
            className="h-8 rounded-lg px-3 text-xs"
            onClick={onClose}
        >
            {__('Close')}
        </Button>
        <Button
            type="button"
            variant="filter-outline"
            className="h-8 rounded-lg px-3 text-xs"
            onClick={onReset}
            disabled={!hasAppliedFilters && !hasDraftFilters}
        >
            {__('Reset Filter')}
        </Button>
        <ButtonWithLoading
            type="button"
            variant="primary"
            className="h-8 rounded-lg px-3 text-xs"
            processing={false}
            label={__('Apply Filter')}
            onClick={onApply}
        />
    </div>
);

const DesktopFilterPanel = ({ title, description, children, ...actions }) => (
    <>
        <div className="border-b border-border px-4 py-3">
            <div className="flex flex-col gap-1">
                <h2 className="text-base font-semibold">{title}</h2>
                <p className="text-xs leading-relaxed text-muted-foreground">
                    {description}
                </p>
            </div>
        </div>
        <div className="px-4 py-4">{children}</div>
        <div className="border-t border-border bg-muted/30 p-4">
            <FilterActions {...actions} />
        </div>
    </>
);

export default function TableToolbar({
    placeholder,
    params,
    setParams,
    setTimeDebounce,
    search,
    filters,
    defaultFilterValues = {},
    filterValueLabels = {},
    filterConfig,
    filterTitle = __('Filters'),
    filterDescription = __(
        'Filter data to display by applying one or more filters.',
    ),
    onSearchChange,
}) {
    const [openFilter, setOpenFilter] = useState(false);
    const isMobile = useIsMobile();
    const { filters: sharedFilters } = usePage().props;
    const defaults = filterConfig?.defaults ?? defaultFilterValues;
    const deserializeFilters =
        filterConfig?.deserialize ??
        ((rawFilters) => defaultDeserialize(rawFilters, defaults));
    const serializeFilters = filterConfig?.serialize ?? defaultSerialize;
    const groups =
        filterConfig?.groups ?? defaultGroups(defaults, filterValueLabels);
    const appliedFilters = Array.isArray(params?.filters) ? params.filters : [];
    const { data, setData } = useForm(
        deserializeFilters(sharedFilters?.filters ?? appliedFilters),
    );

    useEffect(() => {
        if (!openFilter) {
            setData(
                deserializeFilters(sharedFilters?.filters ?? appliedFilters),
            );
        }
        // Applied URL filters replace the closed draft after navigation.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sharedFilters?.filters, openFilter]);

    const setFilterOpen = (open) => {
        setData(deserializeFilters(appliedFilters));
        setOpenFilter(open);
    };

    const applyFilter = () => {
        setTimeDebounce(50);
        setParams((current) => ({
            ...current,
            filters: serializeFilters(data),
        }));
        setFilterOpen(false);
    };

    const resetFilter = () => {
        setData(defaults);
        setTimeDebounce(50);
        setParams((current) => ({ ...current, filters: [] }));
        setFilterOpen(false);
    };

    const keepOpenForNestedPopover = (event) => {
        if (!(event.target instanceof HTMLElement)) {
            return;
        }

        if (
            event.target.closest(
                '[data-slot="popover-content"], [data-slot="select-content"], [data-slot="calendar"], [data-radix-popper-content-wrapper]',
            )
        ) {
            event.preventDefault();
        }
    };

    const hasAppliedFilters = appliedFilters.length > 0;
    const hasDraftFilters = serializeFilters(data).length > 0;
    const fields =
        typeof filters === 'function' ? filters({ data, setData }) : filters;
    const trigger = (
        <Button
            aria-label={__('Filter')}
            variant={
                openFilter || hasAppliedFilters
                    ? 'filter-active'
                    : 'filter-outline'
            }
            className="h-10 shrink-0 rounded-lg px-3 shadow-xs md:px-4"
        >
            <IconPack.Filter className="size-4" />
            <span className="hidden md:inline">{__('Filter')}</span>
        </Button>
    );
    const actions = {
        hasAppliedFilters,
        hasDraftFilters,
        onClose: () => setFilterOpen(false),
        onReset: resetFilter,
        onApply: applyFilter,
    };

    return (
        <div className="flex w-full flex-col gap-3">
            <div className="flex w-full min-w-0 items-center gap-2">
                <div className="min-w-0 flex-1 md:max-w-sm">
                    <SearchInput
                        placeholder={placeholder}
                        search={search}
                        setParams={setParams}
                        setTimeDebounce={setTimeDebounce}
                        onSearchChange={onSearchChange}
                    />
                </div>

                {filters && isMobile && (
                    <Drawer open={openFilter} onOpenChange={setFilterOpen}>
                        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
                        <DrawerContent className="max-h-[80dvh]">
                            <DrawerHeader className="shrink-0 border-b border-border text-left">
                                <DrawerTitle>{filterTitle}</DrawerTitle>
                                <DrawerDescription>
                                    {filterDescription}
                                </DrawerDescription>
                            </DrawerHeader>
                            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
                                {fields}
                            </div>
                            <DrawerFooter className="shrink-0 border-t border-border bg-background pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-8px_20px_-16px_rgb(0_0_0/0.45)]">
                                <FilterActions {...actions} mobile />
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                )}

                {filters && !isMobile && (
                    <Popover open={openFilter} onOpenChange={setFilterOpen}>
                        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
                        <PopoverContent
                            align="start"
                            sideOffset={8}
                            className="w-[420px] rounded-lg border-border bg-popover p-0 text-popover-foreground shadow-xl shadow-black/5"
                            onInteractOutside={keepOpenForNestedPopover}
                        >
                            <DesktopFilterPanel
                                title={filterTitle}
                                description={filterDescription}
                                {...actions}
                            >
                                {fields}
                            </DesktopFilterPanel>
                        </PopoverContent>
                    </Popover>
                )}

                <div className="flex shrink-0 items-center gap-1.5 md:ml-auto">
                    <p className="hidden text-sm text-muted-foreground md:block">
                        {__('Show')}
                    </p>
                    <RowsPerPageSelect
                        limit={String(params.limit || 10)}
                        setParams={setParams}
                        setTimeDebounce={setTimeDebounce}
                    />
                </div>
            </div>

            {filters && (
                <FilterBadges
                    appliedFilters={appliedFilters}
                    groups={groups}
                    setParams={setParams}
                    setTimeDebounce={setTimeDebounce}
                />
            )}
        </div>
    );
}
