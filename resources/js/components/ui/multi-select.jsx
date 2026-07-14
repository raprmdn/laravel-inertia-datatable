import * as React from 'react';
import { cva } from 'class-variance-authority';
import { CheckIcon, ChevronDown, WandSparkles, XIcon } from 'lucide-react';

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

const multiSelectVariants = cva(
    'm-1 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110',
    {
        variants: {
            variant: {
                default:
                    'rounded border-muted bg-muted text-primary hover:bg-muted/80',
                secondary:
                    'border-border bg-secondary text-secondary-foreground hover:bg-secondary/80',
                destructive:
                    'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
                inverted: 'inverted',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

export const MultiSelect = React.forwardRef(
    (
        {
            options,
            onValueChange,
            variant,
            value,
            defaultValue = [],
            placeholder = '',
            placeholderSearch = 'Search',
            animation = 0,
            maxCount = 3,
            modalPopover = false,
            className,
            ...props
        },
        ref,
    ) => {
        const [selectedValues, setSelectedValues] = React.useState(
            value ?? defaultValue,
        );
        const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
        const [isAnimating, setIsAnimating] = React.useState(false);

        React.useEffect(() => {
            if (value) {
                setSelectedValues(value);
            }
        }, [value]);

        const handleInputKeyDown = (event) => {
            if (event.key === 'Enter') {
                setIsPopoverOpen(true);
            } else if (event.key === 'Backspace' && !event.currentTarget.value) {
                const nextSelectedValues = [...selectedValues];
                nextSelectedValues.pop();
                setSelectedValues(nextSelectedValues);
                onValueChange(nextSelectedValues);
            }
        };

        const toggleOption = (option) => {
            const nextSelectedValues = selectedValues.includes(option)
                ? selectedValues.filter((value) => value !== option)
                : [...selectedValues, option];

            setSelectedValues(nextSelectedValues);
            onValueChange(nextSelectedValues);
        };

        const handleClear = () => {
            setSelectedValues([]);
            onValueChange([]);
        };

        const clearExtraOptions = () => {
            const nextSelectedValues = selectedValues.slice(0, maxCount);
            setSelectedValues(nextSelectedValues);
            onValueChange(nextSelectedValues);
        };

        return (
            <Popover
                open={isPopoverOpen}
                onOpenChange={setIsPopoverOpen}
                modal={modalPopover}
            >
                <PopoverTrigger asChild>
                    <Button
                        ref={ref}
                        {...props}
                        className={cn(
                            'flex h-auto min-h-10 w-full items-center justify-between rounded-md border border-input bg-transparent p-1 font-normal shadow-xs transition-[color,box-shadow] outline-none hover:bg-transparent',
                            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                            'disabled:cursor-not-allowed disabled:opacity-50',
                            '[&_svg]:pointer-events-auto',
                            className,
                        )}
                    >
                        {selectedValues.length > 0 ? (
                            <div className="flex w-full items-center justify-between">
                                <div className="flex flex-wrap items-center">
                                    {selectedValues
                                        .slice(0, maxCount)
                                        .map((selectedValue) => {
                                            const option = options.find(
                                                (option) =>
                                                    option.value ===
                                                    selectedValue,
                                            );
                                            const IconComponent = option?.icon;

                                            return (
                                                <Badge
                                                    key={selectedValue}
                                                    className={cn(
                                                        isAnimating &&
                                                            'animate-bounce',
                                                        multiSelectVariants({
                                                            variant,
                                                        }),
                                                    )}
                                                    style={{
                                                        animationDuration: `${animation}s`,
                                                    }}
                                                >
                                                    {IconComponent && (
                                                        <IconComponent className="mr-2 size-4" />
                                                    )}
                                                    {option?.label}
                                                    <span
                                                        role="button"
                                                        tabIndex={-1}
                                                        className="ml-1 inline-flex items-center justify-center"
                                                        onMouseDown={(event) => {
                                                            event.preventDefault();
                                                            event.stopPropagation();
                                                        }}
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            event.stopPropagation();
                                                            toggleOption(
                                                                selectedValue,
                                                            );
                                                        }}
                                                    >
                                                        <XIcon className="size-3 cursor-pointer text-primary" />
                                                    </span>
                                                </Badge>
                                            );
                                        })}

                                    {selectedValues.length > maxCount && (
                                        <Badge
                                            className={cn(
                                                'border-border bg-transparent text-muted-foreground hover:bg-transparent',
                                                isAnimating &&
                                                    'animate-bounce',
                                                multiSelectVariants({
                                                    variant,
                                                }),
                                            )}
                                            style={{
                                                animationDuration: `${animation}s`,
                                            }}
                                        >
                                            {`+ ${selectedValues.length - maxCount} more`}
                                            <span
                                                role="button"
                                                tabIndex={-1}
                                                className="ml-1 inline-flex items-center justify-center"
                                                onMouseDown={(event) => {
                                                    event.preventDefault();
                                                    event.stopPropagation();
                                                }}
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    event.stopPropagation();
                                                    clearExtraOptions();
                                                }}
                                            >
                                                <XIcon className="size-3 cursor-pointer text-muted-foreground transition-colors hover:text-foreground" />
                                            </span>
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <XIcon
                                        className="mx-2 size-4 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            handleClear();
                                        }}
                                    />
                                    <Separator
                                        orientation="vertical"
                                        className="flex h-full min-h-6 bg-border"
                                    />
                                    <ChevronDown className="mx-2 size-4 cursor-pointer text-muted-foreground opacity-50" />
                                </div>
                            </div>
                        ) : (
                            <div className="mx-auto flex w-full items-center justify-between">
                                <span
                                    className="mx-3 text-sm text-muted-foreground"
                                    data-slot="placeholder"
                                >
                                    {placeholder}
                                </span>
                                <ChevronDown className="mx-2 size-4 cursor-pointer text-muted-foreground opacity-50" />
                            </div>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-(--radix-popover-trigger-width) rounded-md border border-border p-0 shadow-md"
                    align="start"
                    onEscapeKeyDown={() => setIsPopoverOpen(false)}
                >
                    <Command>
                        <CommandInput
                            placeholder={placeholderSearch}
                            onKeyDown={handleInputKeyDown}
                            className="text-sm text-foreground placeholder:text-muted-foreground"
                        />
                        <CommandList>
                            <CommandEmpty className="py-4 text-center text-sm text-muted-foreground">
                                No results found.
                            </CommandEmpty>
                            <CommandGroup>
                                {options.map((option) => {
                                    const isSelected = selectedValues.includes(
                                        option.value,
                                    );

                                    return (
                                        <CommandItem
                                            key={option.value}
                                            onSelect={() =>
                                                toggleOption(option.value)
                                            }
                                            className="cursor-pointer focus:bg-muted focus:text-primary data-[selected=true]:bg-muted data-[selected=true]:text-primary"
                                        >
                                            <div
                                                data-slot="check"
                                                className={cn(
                                                    'mr-2 flex size-4 items-center justify-center rounded border border-primary',
                                                    isSelected
                                                        ? 'border-primary bg-primary'
                                                        : '[&_svg]:invisible',
                                                )}
                                            >
                                                <CheckIcon className="size-4 text-primary-foreground" />
                                            </div>
                                            {option.icon && (
                                                <option.icon className="mr-2 size-4 text-muted-foreground" />
                                            )}
                                            <span className="text-sm">
                                                {option.label}
                                            </span>
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                            <CommandSeparator className="bg-border" />
                            <CommandGroup>
                                <div className="flex items-center justify-between">
                                    {selectedValues.length > 0 && (
                                        <>
                                            <CommandItem
                                                onSelect={handleClear}
                                                className="flex-1 cursor-pointer justify-center text-sm text-muted-foreground focus:bg-muted focus:text-primary"
                                            >
                                                Clear
                                            </CommandItem>
                                            <Separator
                                                orientation="vertical"
                                                className="flex h-full min-h-6 bg-border"
                                            />
                                        </>
                                    )}
                                    <CommandItem
                                        onSelect={() => setIsPopoverOpen(false)}
                                        className="max-w-full flex-1 cursor-pointer justify-center text-sm text-muted-foreground focus:bg-muted focus:text-primary"
                                    >
                                        Close
                                    </CommandItem>
                                </div>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
                {animation > 0 && selectedValues.length > 0 && (
                    <WandSparkles
                        className={cn(
                            'my-2 size-3 cursor-pointer',
                            isAnimating
                                ? 'text-primary'
                                : 'text-muted-foreground',
                        )}
                        onClick={() => setIsAnimating(!isAnimating)}
                    />
                )}
            </Popover>
        );
    },
);

MultiSelect.displayName = 'MultiSelect';
