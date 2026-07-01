import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb.jsx';
import { Button } from '@/components/ui/button.jsx';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer.jsx';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.jsx';
import { useMediaQuery } from '@/hooks/use-media-query.js';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

function BreadcrumbNavItem({ item, className }) {
    return (
        <BreadcrumbItem>
            {item.href ? (
                <BreadcrumbLink asChild className={className}>
                    <Link href={item.href}>{item.title}</Link>
                </BreadcrumbLink>
            ) : (
                <BreadcrumbPage className={className}>
                    {item.title}
                </BreadcrumbPage>
            )}
        </BreadcrumbItem>
    );
}

export default function DashboardBreadcrumbs({ breadcrumbs }) {
    if (!breadcrumbs || breadcrumbs.length === 0) return null;

    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery('(min-width: 768px)');

    const first = breadcrumbs[0];
    const last = breadcrumbs[breadcrumbs.length - 1];
    const secondToLast =
        breadcrumbs.length >= 2 ? breadcrumbs[breadcrumbs.length - 2] : null;

    // Items to collapse into ellipsis:
    // Desktop: items between first and second-to-last (when length >= 4)
    // Mobile: all items except last
    const shouldShowEllipsis =
        (isDesktop && breadcrumbs.length >= 4) ||
        (!isDesktop && breadcrumbs.length > 2);

    // Desktop ellipsis contains items between first and second-to-last
    const desktopCollapsedItems = breadcrumbs.slice(1, -2);
    // Mobile drawer contains all items except last
    const mobileCollapsedItems = breadcrumbs.slice(0, -1);

    const mutedClass =
        'max-w-40 truncate text-grey-neutral transition duration-150 hover:text-grey-neutral/90 md:max-w-none';
    const activeClass =
        'max-w-40 truncate text-iridium transition duration-150 hover:text-iridium/95 md:max-w-none';

    return (
        <div>
            <Breadcrumb>
                <BreadcrumbList>
                    {/* First item — always show on desktop when more than 1 item */}
                    {isDesktop && breadcrumbs.length > 1 && (
                        <>
                            <BreadcrumbNavItem
                                item={first}
                                className={mutedClass}
                            />
                            <BreadcrumbSeparator />
                        </>
                    )}

                    {/* Ellipsis for collapsed middle items */}
                    {shouldShowEllipsis && (
                        <>
                            <BreadcrumbItem>
                                {isDesktop ? (
                                    <DropdownMenu
                                        open={open}
                                        onOpenChange={setOpen}
                                    >
                                        <DropdownMenuTrigger
                                            className="flex cursor-pointer items-center gap-1 focus:outline-none"
                                            aria-label="Toggle menu"
                                        >
                                            <BreadcrumbEllipsis className="h-4 w-4 shrink-0" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start">
                                            {desktopCollapsedItems.map(
                                                (item, index) => (
                                                    <DropdownMenuItem
                                                        key={index}
                                                        className="text-grey-neutral focus:bg-grey-neutral/5"
                                                        asChild
                                                    >
                                                        {item.href ? (
                                                            <Link
                                                                href={item.href}
                                                            >
                                                                {item.title}
                                                            </Link>
                                                        ) : (
                                                            <span>
                                                                {item.title}
                                                            </span>
                                                        )}
                                                    </DropdownMenuItem>
                                                ),
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <Drawer
                                        open={open}
                                        onOpenChange={setOpen}
                                        shouldScaleBackground={true}
                                    >
                                        <DrawerTrigger
                                            className="focus:outline-none"
                                            aria-label="Toggle Menu"
                                        >
                                            <BreadcrumbEllipsis className="h-4 w-4 shrink-0" />
                                        </DrawerTrigger>
                                        <DrawerContent>
                                            <DrawerHeader className="text-left">
                                                <DrawerTitle className="text-iridium text-sm">
                                                    Navigate to
                                                </DrawerTitle>
                                                <DrawerDescription className="text-grey-neutral text-xs">
                                                    Select a page to navigate
                                                    to.
                                                </DrawerDescription>
                                            </DrawerHeader>
                                            <div className="grid gap-1 px-4">
                                                {mobileCollapsedItems.map(
                                                    (item, index) =>
                                                        item.href ? (
                                                            <Link
                                                                key={index}
                                                                href={item.href}
                                                                className="text-iridium py-1 text-xs underline underline-offset-1"
                                                                onClick={() =>
                                                                    setOpen(
                                                                        false,
                                                                    )
                                                                }
                                                            >
                                                                {item.title}
                                                            </Link>
                                                        ) : (
                                                            <span
                                                                key={index}
                                                                className="text-iridium py-1 text-xs"
                                                            >
                                                                {item.title}
                                                            </span>
                                                        ),
                                                )}
                                            </div>
                                            <DrawerFooter className="pt-4">
                                                <DrawerClose asChild>
                                                    <Button
                                                        variant="outline"
                                                        className="border-silver-neutral h-8 border"
                                                    >
                                                        Close
                                                    </Button>
                                                </DrawerClose>
                                            </DrawerFooter>
                                        </DrawerContent>
                                    </Drawer>
                                )}
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                        </>
                    )}

                    {/* Second-to-last item — always show on desktop when length >= 2 and it's not the first */}
                    {isDesktop && secondToLast && secondToLast !== first && (
                        <>
                            <BreadcrumbNavItem
                                item={secondToLast}
                                className={mutedClass}
                            />
                            <BreadcrumbSeparator />
                        </>
                    )}

                    {/* Last item */}
                    <BreadcrumbNavItem item={last} className={activeClass} />
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    );
}
