'use client';

import * as React from 'react';

import { useIsMobile } from '@/hooks/use-is-mobile.jsx';
import { cn } from '@/lib/utils';

function Table({ className, ...props }) {
    return (
        <div
            data-slot="table-container"
            className="relative w-full overflow-x-auto rounded-xl border border-border bg-card shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
        >
            <table
                data-slot="table"
                className={cn(
                    'w-full caption-bottom text-sm text-foreground',
                    className,
                )}
                {...props}
            />
        </div>
    );
}

function TableHeader({ className, ...props }) {
    return (
        <thead
            data-slot="table-header"
            className={cn(
                'bg-muted text-muted-foreground dark:bg-zinc-900 dark:text-zinc-300 [&_tr]:border-b',
                className,
            )}
            {...props}
        />
    );
}

function TableBody({ className, ...props }) {
    return (
        <tbody
            data-slot="table-body"
            className={cn('[&_tr:last-child]:border-0', className)}
            {...props}
        />
    );
}

function TableFooter({ className, ...props }) {
    return (
        <tfoot
            data-slot="table-footer"
            className={cn(
                'border-t border-border bg-muted/40 font-medium dark:border-zinc-800 dark:bg-zinc-900 [&>tr]:last:border-b-0',
                className,
            )}
            {...props}
        />
    );
}

function TableRow({ className, ...props }) {
    return (
        <tr
            data-slot="table-row"
            className={cn(
                'border-b border-border bg-background text-foreground transition-colors has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:has-aria-expanded:bg-zinc-900 dark:data-[state=selected]:bg-zinc-900',
                className,
            )}
            {...props}
        />
    );
}

function TableHead({ className, ...props }) {
    return (
        <th
            data-slot="table-head"
            className={cn(
                'h-11 border-b border-border bg-muted px-6 text-left align-middle font-medium whitespace-nowrap text-muted-foreground dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
                className,
            )}
            {...props}
        />
    );
}

function TableCell({ className, ...props }) {
    return (
        <td
            data-slot="table-cell"
            className={cn(
                'border-b border-border px-6 py-3 align-middle whitespace-nowrap text-foreground dark:border-zinc-800 dark:text-zinc-100 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
                className,
            )}
            {...props}
        />
    );
}

function TableHeadSticky({ className, index = 0, isLast = false, ...props }) {
    const ref = React.useRef(null);
    const [left, setLeft] = React.useState(0);
    const isMobile = useIsMobile();

    React.useLayoutEffect(() => {
        const calculateOffset = () => {
            if (ref.current && index > 0 && !isMobile) {
                let offset = 0;
                let sibling = ref.current.previousElementSibling;

                while (
                    sibling &&
                    sibling.getAttribute('data-slot') === 'table-head-sticky'
                ) {
                    offset += sibling.offsetWidth;
                    sibling = sibling.previousElementSibling;
                }

                setLeft(offset);
            } else {
                setLeft(0);
            }
        };

        calculateOffset();
        window.addEventListener('resize', calculateOffset);

        return () => window.removeEventListener('resize', calculateOffset);
    }, [index, isMobile]);

    return (
        <th
            ref={ref}
            data-slot="table-head-sticky"
            className={cn(
                'bg-muted dark:bg-zinc-900',
                !isMobile && 'sticky z-20',
                'h-11 border-b border-border px-6 text-left align-middle font-medium whitespace-nowrap text-muted-foreground dark:border-zinc-800 dark:text-zinc-300',
                isLast &&
                    !isMobile &&
                    "after:absolute after:top-0 after:right-0 after:h-full after:w-px after:bg-border after:content-[''] dark:after:bg-zinc-800",
                className,
            )}
            style={{ left: !isMobile ? `${left}px` : undefined }}
            {...props}
        />
    );
}

function TableCellSticky({ className, index = 0, isLast = false, ...props }) {
    const ref = React.useRef(null);
    const [left, setLeft] = React.useState(0);
    const isMobile = useIsMobile();

    React.useLayoutEffect(() => {
        const calculateOffset = () => {
            if (ref.current && index > 0 && !isMobile) {
                let offset = 0;
                let sibling = ref.current.previousElementSibling;

                while (
                    sibling &&
                    sibling.getAttribute('data-slot') === 'table-cell-sticky'
                ) {
                    offset += sibling.offsetWidth;
                    sibling = sibling.previousElementSibling;
                }

                setLeft(offset);
            } else {
                setLeft(0);
            }
        };

        calculateOffset();
        window.addEventListener('resize', calculateOffset);

        return () => window.removeEventListener('resize', calculateOffset);
    }, [index, isMobile]);

    return (
        <td
            ref={ref}
            data-slot="table-cell-sticky"
            className={cn(
                'bg-background dark:bg-zinc-950',
                !isMobile && 'sticky z-10',
                'border-b border-border px-6 py-3 align-middle whitespace-nowrap text-foreground dark:border-zinc-800 dark:text-zinc-100',
                isLast &&
                    !isMobile &&
                    "after:absolute after:top-0 after:right-0 after:h-full after:w-px after:bg-border after:content-[''] dark:after:bg-zinc-800",
                className,
            )}
            style={{ left: !isMobile ? `${left}px` : undefined }}
            {...props}
        />
    );
}

function TableCaption({ className, ...props }) {
    return (
        <caption
            data-slot="table-caption"
            className={cn('mt-4 text-sm text-muted-foreground', className)}
            {...props}
        />
    );
}

export {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableHeadSticky,
    TableRow,
    TableCell,
    TableCellSticky,
    TableCaption,
};
