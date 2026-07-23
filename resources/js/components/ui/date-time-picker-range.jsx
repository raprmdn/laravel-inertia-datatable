import { CalendarIcon } from 'lucide-react';
import { format, parse } from 'date-fns';
import { Button } from '@/components/ui/button.jsx';
import { Calendar } from '@/components/ui/calendar.jsx';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover.jsx';
import { __ } from '@/lib/lang.jsx';
import { cn } from '@/lib/utils.js';

export function DatePickerWithRange({
    className,
    classNameButton,
    value,
    onChange,
    placeholderText = 'Pick a date range',
    htmlFor = 'date-range',
    disabled = false,
    numberOfMonths = 2,
}) {
    const parseValue = (val) => {
        if (!val) return null;
        if (val instanceof Date) return val;

        return parse(val, 'dd-MM-yyyy', new Date());
    };

    const date = {
        from: parseValue(value?.from),
        to: parseValue(value?.to),
    };

    const handleSelect = (selectedDate) => {
        if (disabled) return;

        if (onChange) {
            onChange(selectedDate);
        }
    };

    return (
        <div className={cn('grid gap-2', className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id={htmlFor}
                        variant="border"
                        disabled={disabled}
                        className={cn(
                            'w-full justify-start text-left font-normal',
                            !date?.from && !date?.to
                                ? 'text-muted-foreground hover:text-muted-foreground'
                                : 'text-foreground hover:text-foreground',
                            disabled &&
                                'cursor-not-allowed bg-muted text-muted-foreground',
                            classNameButton,
                        )}
                    >
                        <CalendarIcon className="mr-2 size-4 text-muted-foreground" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, 'd MMMM yyyy')} -{' '}
                                    {format(date.to, 'd MMMM yyyy')}
                                </>
                            ) : (
                                format(date.from, 'd MMMM yyyy')
                            )
                        ) : (
                            <span className="text-muted-foreground">
                                {__(placeholderText)}
                            </span>
                        )}
                    </Button>
                </PopoverTrigger>
                {!disabled && (
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from || new Date()}
                            selected={date}
                            onSelect={handleSelect}
                            numberOfMonths={numberOfMonths}
                        />
                    </PopoverContent>
                )}
            </Popover>
        </div>
    );
}
