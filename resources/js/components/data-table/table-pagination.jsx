import { Link } from '@inertiajs/react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { __ } from '@/lib/lang.jsx';
import { cn } from '@/lib/utils.js';

export default function TablePagination({ meta }) {
    if (!meta) {
        return null;
    }

    return (
        <div className="flex flex-col items-center justify-center gap-4 lg:flex-row lg:justify-between">
            <div className="text-center lg:text-left">
                <p className="text-sm text-foreground">
                    {__('Showing')}{' '}
                    <span className="font-medium">{meta.from || 0}</span>{' '}
                    {__('to')}{' '}
                    <span className="font-medium">{meta.to || 0}</span>{' '}
                    {__('of')} <span className="font-medium">{meta.total}</span>{' '}
                    {__('entries')}
                </p>
            </div>

            <div className="w-full lg:w-auto">
                <nav
                    aria-label="Pagination"
                    className="isolate flex w-full justify-center -space-x-px rounded-md lg:inline-flex lg:w-auto lg:shadow-xs"
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
                                    className={cn(
                                        'relative inline-flex items-center rounded-l-md px-2 py-2 text-foreground inset-ring inset-ring-border hover:bg-primary hover:text-primary-foreground focus:z-20 focus:outline-offset-0',
                                        !link.url &&
                                            'pointer-events-none opacity-50',
                                    )}
                                >
                                    <ChevronLeftIcon
                                        aria-hidden="true"
                                        className="size-5"
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
                                    className={cn(
                                        'relative inline-flex items-center rounded-r-md px-2 py-2 text-foreground inset-ring inset-ring-border hover:bg-primary hover:text-primary-foreground focus:z-20 focus:outline-offset-0',
                                        !link.url &&
                                            'pointer-events-none opacity-50',
                                    )}
                                >
                                    <span className="sr-only">Next</span>
                                    <ChevronRightIcon
                                        aria-hidden="true"
                                        className="size-5"
                                    />
                                </Link>
                            );
                        }

                        if (link.label === '...') {
                            return (
                                <span
                                    key={index}
                                    className="relative hidden items-center px-4 py-2 text-sm font-semibold text-foreground inset-ring inset-ring-border focus:outline-offset-0 lg:inline-flex"
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
                                className={cn(
                                    'relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20',
                                    link.active
                                        ? 'z-10 bg-primary text-primary-foreground inset-ring inset-ring-border focus:outline-offset-0'
                                        : 'text-foreground inset-ring inset-ring-border hover:bg-primary hover:text-primary-foreground focus:outline-offset-0',
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
