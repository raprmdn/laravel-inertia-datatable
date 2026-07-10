import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command.jsx';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover.jsx';
import { Separator } from '@/components/ui/separator.jsx';
import { cn } from '@/lib/utils.js';
import { CheckIcon, CirclePlusIcon } from 'lucide-react';

const FilterBadges = ({ selectedValues, options }) => (
    <>
        <Separator orientation="vertical" className="mx-2 h-4" />
        <Badge
            variant="secondary"
            className="rounded-sm px-1 font-normal lg:hidden"
        >
            {selectedValues.length}
        </Badge>
        <div className="hidden space-x-1 lg:flex">
            {selectedValues.length > 2 ? (
                <Badge
                    variant="secondary"
                    className="rounded-sm bg-muted px-1 font-normal"
                >
                    {selectedValues.length} selected
                </Badge>
            ) : (
                options
                    .filter((option) => selectedValues.includes(option.value))
                    .map((option) => (
                        <Badge
                            variant="secondary"
                            key={option.value}
                            className="rounded-sm bg-muted px-1 font-normal"
                        >
                            {option.label}
                        </Badge>
                    ))
            )}
        </div>
    </>
);

const FilterOptions = ({
    options,
    params,
    filter,
    onSelectFilter,
    multiple,
}) => (
    <CommandList>
        <CommandEmpty>No filters found.</CommandEmpty>
        <CommandGroup>
            {options.map((option) => {
                const isSelected = params.filters?.includes(
                    `${filter}:${option.value}`,
                );

                return (
                    <CommandItem
                        key={option.value}
                        value={option.value}
                        onSelect={onSelectFilter}
                        className="cursor-pointer"
                    >
                        <div
                            className={cn(
                                'mr-2 flex size-4 items-center justify-center',
                                isSelected
                                    ? 'text-white'
                                    : 'opacity-50 [&_svg]:invisible',
                                multiple
                                    ? 'rounded border border-border bg-muted'
                                    : 'bg-transparent',
                            )}
                        >
                            <CheckIcon className="size-4" />
                        </div>
                        {option.icon && (
                            <option.icon className="mr-2 size-4 text-muted-foreground" />
                        )}
                        <span>{option.label}</span>
                    </CommandItem>
                );
            })}
        </CommandGroup>
    </CommandList>
);

const ClearFilters = ({ clearFilters }) => (
    <>
        <CommandSeparator />
        <CommandGroup>
            <CommandItem
                onSelect={clearFilters}
                className="cursor-pointer justify-center text-center"
            >
                Clear filters
            </CommandItem>
        </CommandGroup>
    </>
);

export default function TableFilter({
    params,
    setParams,
    setTimeDebounce,
    title,
    filter,
    options,
    multiple = true,
    clearButton = true,
}) {
    const [selectedValues, setSelectedValues] = useState([]);

    const onSelectFilter = (value) => {
        const nextFilter = `${filter}:${value}`;
        let filters = params?.filters ? [...params.filters] : [];

        if (multiple) {
            filters = filters.includes(nextFilter)
                ? filters.filter((filter) => filter !== nextFilter)
                : [...filters, nextFilter];
        } else {
            filters = [
                ...filters.filter((item) => !item.startsWith(`${filter}:`)),
                nextFilter,
            ];
        }

        setTimeDebounce(50);
        setParams({ ...params, filters });
    };

    const clearFilters = () => {
        setSelectedValues([]);
        setTimeDebounce(50);
        setParams({
            ...params,
            filters: (params.filters || []).filter(
                (item) => !item.startsWith(`${filter}:`),
            ),
        });
    };

    useEffect(() => {
        if (params.filters) {
            setSelectedValues(
                params.filters
                    .filter((item) => item.startsWith(`${filter}:`))
                    .map((item) => item.split(':')[1]),
            );
        }
    }, [params.filters, filter]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-full cursor-pointer rounded-xl border-dashed text-xs transition duration-150 hover:bg-muted md:w-auto"
                >
                    <CirclePlusIcon className="size-4" />
                    {title}
                    {selectedValues.length > 0 && (
                        <FilterBadges
                            selectedValues={selectedValues}
                            options={options}
                        />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 md:w-[200px]" align="start">
                <Command>
                    <CommandInput placeholder={title} className="text-sm" />
                    <FilterOptions
                        options={options}
                        params={params}
                        filter={filter}
                        onSelectFilter={onSelectFilter}
                        multiple={multiple}
                    />
                    {clearButton && selectedValues.length > 0 && (
                        <ClearFilters clearFilters={clearFilters} />
                    )}
                </Command>
            </PopoverContent>
        </Popover>
    );
}
