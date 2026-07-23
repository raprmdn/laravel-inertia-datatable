import { Link } from '@inertiajs/react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { __ } from '@/lib/lang.jsx';
import { cn } from '@/lib/utils.js';

export default function TablePagination({ meta }) {
    if (!meta) {
        return null;
    }

    return (
        <div className="flex flex-col items-center justify-center gap-3 lg:flex-row lg:justify-between">
            <div className="text-center lg:text-left">
                <p className="text-sm text-muted-foreground dark:text-zinc-400">
                    {__('Showing')}{' '}
                    <span className="font-medium text-foreground dark:text-zinc-100">
                        {meta.from || 0}
                    </span>{' '}
                    {__('to')}{' '}
                    <span className="font-medium text-foreground dark:text-zinc-100">
                        {meta.to || 0}
                    </span>{' '}
                    {__('of')}{' '}
                    <span className="font-medium text-foreground dark:text-zinc-100">
                        {meta.total}
                    </span>{' '}
                    {__('entries')}
                </p>
            </div>

            <div className="w-full min-w-0 lg:w-auto">
                <nav
                    aria-label="Pagination"
                    className="isolate flex w-full flex-wrap items-center justify-center gap-1 lg:w-auto"
                >
                    {(meta.links || []).map((link, index) => {
                        const currentPage = meta.current_page;
                        const totalLinks = meta.links.length;

                        if (index === 0) {
                            return (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    preserveScroll
                                    preserveState
                                    aria-disabled={!link.url}
                                    tabIndex={link.url ? undefined : -1}
                                    className={cn(
                                        'relative inline-flex size-9 items-center justify-center rounded-md border border-border bg-background text-foreground shadow-xs transition-colors hover:bg-muted hover:text-foreground focus:z-20 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900',
                                        !link.url &&
                                            'pointer-events-none bg-muted/40 text-muted-foreground opacity-40 dark:bg-zinc-900 dark:text-zinc-500',
                                    )}
                                >
                                    <span className="sr-only">Previous</span>
                                    <ChevronLeftIcon
                                        aria-hidden="true"
                                        className="size-4"
                                    />
                                </Link>
                            );
                        }

                        if (index === totalLinks - 1) {
                            return (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    preserveScroll
                                    preserveState
                                    aria-disabled={!link.url}
                                    tabIndex={link.url ? undefined : -1}
                                    className={cn(
                                        'relative inline-flex size-9 items-center justify-center rounded-md border border-border bg-background text-foreground shadow-xs transition-colors hover:bg-muted hover:text-foreground focus:z-20 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900',
                                        !link.url &&
                                            'pointer-events-none bg-muted/40 text-muted-foreground opacity-40 dark:bg-zinc-900 dark:text-zinc-500',
                                    )}
                                >
                                    <span className="sr-only">Next</span>
                                    <ChevronRightIcon
                                        aria-hidden="true"
                                        className="size-4"
                                    />
                                </Link>
                            );
                        }

                        if (link.label === '...') {
                            return (
                                <span
                                    key={index}
                                    className="relative hidden size-9 items-center justify-center rounded-md border border-border bg-background text-sm font-medium text-muted-foreground shadow-xs lg:inline-flex dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-500"
                                >
                                    ...
                                </span>
                            );
                        }

                        const pageNumber = Number(link.page ?? link.label);
                        const showOnMobile =
                            pageNumber === currentPage ||
                            pageNumber === currentPage - 1 ||
                            pageNumber === currentPage + 1;

                        return (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                preserveScroll
                                preserveState
                                aria-current={link.active ? 'page' : undefined}
                                className={cn(
                                    'relative inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2 text-sm font-medium shadow-xs transition-colors focus:z-20 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                                    link.active
                                        ? 'z-10 border-primary bg-primary text-primary-foreground shadow-sm dark:border-primary'
                                        : 'border-border bg-background text-foreground hover:bg-muted hover:text-foreground dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900',
                                    !showOnMobile && 'hidden lg:inline-flex',
                                )}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
