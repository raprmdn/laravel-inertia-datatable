import * as React from 'react';
import { CheckIcon, ChevronDown, XIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import {
    Command,
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
import { Spinner } from '@/components/ui/spinner.jsx';
import { cn } from '@/lib/utils.js';

export const MultiSelectAPI = React.forwardRef(
    (
        {
            options = [],
            value = [],
            selectedOptions = [],
            onValueChange,
            searchValue = '',
            onSearchValueChange,
            loading = false,
            error = null,
            hasMore = false,
            minimumSearchLength = 2,
            placeholder = '',
            searchPlaceholder = 'Search...',
            loadingText = 'Searching...',
            minimumSearchText = `Type at least ${minimumSearchLength} characters to search.`,
            noResultsText = 'No results found.',
            moreResultsText = 'More results available. Refine your search.',
            clearText = 'Clear',
            closeText = 'Close',
            unknownOptionLabel = 'Unknown option',
            maxCount = 3,
            modalPopover = false,
            disabled = false,
            className,
            ...props
        },
        ref,
    ) => {
        const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
        const optionCache = React.useRef(new Map());
        const normalizedValues = value.map(String);
        const normalizedOptions = options.map((option) => ({
            ...option,
            value: String(option.value),
        }));
        const normalizedSelectedOptions = selectedOptions.map((option) => ({
            ...option,
            value: String(option.value),
        }));

        React.useEffect(() => {
            [...normalizedSelectedOptions, ...normalizedOptions].forEach(
                (option) => optionCache.current.set(option.value, option),
            );
        }, [options, selectedOptions]);

        const resolveOption = (selectedValue) =>
            normalizedSelectedOptions.find(
                (option) => option.value === selectedValue,
            ) ??
            normalizedOptions.find(
                (option) => option.value === selectedValue,
            ) ??
            optionCache.current.get(selectedValue) ?? {
                value: selectedValue,
                label: unknownOptionLabel,
            };

        const updateValues = (nextValues) => {
            onValueChange(
                nextValues,
                nextValues.map((selectedValue) =>
                    resolveOption(selectedValue),
                ),
            );
        };

        const toggleOption = (selectedValue) => {
            const normalizedValue = String(selectedValue);
            const nextValues = normalizedValues.includes(normalizedValue)
                ? normalizedValues.filter((item) => item !== normalizedValue)
                : [...normalizedValues, normalizedValue];

            updateValues(nextValues);
        };

        const removeOption = (event, selectedValue) => {
            event.preventDefault();
            event.stopPropagation();
            toggleOption(selectedValue);
        };

        const handleBadgeKeyDown = (event, selectedValue) => {
            if (event.key === 'Enter' || event.key === ' ') {
                removeOption(event, selectedValue);
            }
        };

        const handleInputKeyDown = (event) => {
            if (
                event.key === 'Backspace' &&
                !event.currentTarget.value &&
                normalizedValues.length > 0
            ) {
                updateValues(normalizedValues.slice(0, -1));
            }
        };

        const searchLength = searchValue.trim().length;
        const showMinimumSearchHint =
            searchLength < minimumSearchLength;

        return (
            <Popover
                open={isPopoverOpen}
                onOpenChange={setIsPopoverOpen}
                modal={modalPopover}
            >
                <PopoverTrigger asChild>
                    <Button
                        ref={ref}
                        type="button"
                        disabled={disabled}
                        aria-expanded={isPopoverOpen}
                        {...props}
                        className={cn(
                            'flex h-auto min-h-10 w-full items-center justify-between rounded-md border border-input bg-transparent p-1 font-normal shadow-xs transition-[color,box-shadow] outline-none hover:bg-transparent',
                            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                            'disabled:cursor-not-allowed disabled:opacity-50',
                            '[&_svg]:pointer-events-auto',
                            className,
                        )}
                    >
                        {normalizedValues.length > 0 ? (
                            <div className="flex w-full items-center justify-between">
                                <div className="flex flex-wrap items-center">
                                    {normalizedValues
                                        .slice(0, maxCount)
                                        .map((selectedValue) => {
                                            const option =
                                                resolveOption(selectedValue);

                                            return (
                                                <Badge
                                                    key={selectedValue}
                                                    variant="secondary"
                                                    className="m-1 rounded"
                                                >
                                                    {option.label}
                                                    <span
                                                        role="button"
                                                        tabIndex={0}
                                                        aria-label={`Remove ${option.label}`}
                                                        className="ml-1 inline-flex items-center justify-center rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                                        onMouseDown={(event) => {
                                                            event.preventDefault();
                                                            event.stopPropagation();
                                                        }}
                                                        onClick={(event) =>
                                                            removeOption(
                                                                event,
                                                                selectedValue,
                                                            )
                                                        }
                                                        onKeyDown={(event) =>
                                                            handleBadgeKeyDown(
                                                                event,
                                                                selectedValue,
                                                            )
                                                        }
                                                    >
                                                        <XIcon className="size-3" />
                                                    </span>
                                                </Badge>
                                            );
                                        })}

                                    {normalizedValues.length > maxCount && (
                                        <Badge
                                            variant="outline"
                                            className="m-1"
                                        >
                                            +{normalizedValues.length - maxCount}{' '}
                                            more
                                        </Badge>
                                    )}
                                </div>

                                <div className="flex items-center">
                                    <span
                                        role="button"
                                        tabIndex={0}
                                        aria-label={clearText}
                                        className="mx-2 inline-flex items-center rounded-sm text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                        onMouseDown={(event) => {
                                            event.preventDefault();
                                            event.stopPropagation();
                                        }}
                                        onClick={(event) => {
                                            event.preventDefault();
                                            event.stopPropagation();
                                            onValueChange([], []);
                                        }}
                                        onKeyDown={(event) => {
                                            if (
                                                event.key === 'Enter' ||
                                                event.key === ' '
                                            ) {
                                                event.preventDefault();
                                                event.stopPropagation();
                                                onValueChange([], []);
                                            }
                                        }}
                                    >
                                        <XIcon />
                                    </span>
                                    <Separator
                                        orientation="vertical"
                                        className="h-6"
                                    />
                                    <ChevronDown className="mx-2 text-muted-foreground opacity-50" />
                                </div>
                            </div>
                        ) : (
                            <div className="mx-auto flex w-full items-center justify-between">
                                <span className="mx-3 text-sm text-muted-foreground">
                                    {placeholder}
                                </span>
                                <ChevronDown className="mx-2 text-muted-foreground opacity-50" />
                            </div>
                        )}
                    </Button>
                </PopoverTrigger>

                <PopoverContent
                    className="w-(--radix-popover-trigger-width) rounded-md border border-border p-0 shadow-md"
                    align="start"
                    onEscapeKeyDown={() => setIsPopoverOpen(false)}
                >
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder={searchPlaceholder}
                            value={searchValue}
                            disabled={disabled}
                            onValueChange={onSearchValueChange}
                            onKeyDown={handleInputKeyDown}
                        />
                        <CommandList>
                            {showMinimumSearchHint ? (
                                <div
                                    role="status"
                                    className="py-6 text-center text-sm text-muted-foreground"
                                >
                                    {minimumSearchText}
                                </div>
                            ) : loading ? (
                                <div
                                    role="status"
                                    className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground"
                                >
                                    <Spinner />
                                    {loadingText}
                                </div>
                            ) : error ? (
                                <div
                                    role="alert"
                                    className="py-6 text-center text-sm text-destructive"
                                >
                                    {error}
                                </div>
                            ) : normalizedOptions.length === 0 ? (
                                <div className="py-6 text-center text-sm text-muted-foreground">
                                    {noResultsText}
                                </div>
                            ) : (
                                <CommandGroup>
                                    {normalizedOptions.map((option) => {
                                        const isSelected =
                                            normalizedValues.includes(
                                                option.value,
                                            );

                                        return (
                                            <CommandItem
                                                key={option.value}
                                                value={option.value}
                                                onSelect={() =>
                                                    toggleOption(option.value)
                                                }
                                                className="cursor-pointer"
                                            >
                                                <div
                                                    data-slot="check"
                                                    className={cn(
                                                        'mr-2 flex size-4 items-center justify-center rounded border border-primary',
                                                        isSelected
                                                            ? 'bg-primary'
                                                            : '[&_svg]:invisible',
                                                    )}
                                                >
                                                    <CheckIcon className="text-primary-foreground" />
                                                </div>
                                                <span>{option.label}</span>
                                            </CommandItem>
                                        );
                                    })}
                                </CommandGroup>
                            )}

                            {hasMore && !loading && !error && (
                                <div className="px-3 py-2 text-center text-xs text-muted-foreground">
                                    {moreResultsText}
                                </div>
                            )}

                            <CommandSeparator />
                            <CommandGroup>
                                <div className="flex items-center justify-between">
                                    {normalizedValues.length > 0 && (
                                        <>
                                            <CommandItem
                                                onSelect={() =>
                                                    onValueChange([], [])
                                                }
                                                className="flex-1 cursor-pointer justify-center"
                                            >
                                                {clearText}
                                            </CommandItem>
                                            <Separator
                                                orientation="vertical"
                                                className="h-6"
                                            />
                                        </>
                                    )}
                                    <CommandItem
                                        onSelect={() =>
                                            setIsPopoverOpen(false)
                                        }
                                        className="max-w-full flex-1 cursor-pointer justify-center"
                                    >
                                        {closeText}
                                    </CommandItem>
                                </div>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        );
    },
);

MultiSelectAPI.displayName = 'MultiSelectAPI';
