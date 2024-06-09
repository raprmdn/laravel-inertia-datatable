import React, { Fragment, useState } from 'react';
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/shadcn/ui/breadcrumb.jsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/shadcn/ui/dropdown-menu.jsx";
import { Link } from "@inertiajs/react";
import {
    Drawer, DrawerClose,
    DrawerContent,
    DrawerDescription, DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "@/shadcn/ui/drawer.jsx";
import { Button } from "@/shadcn/ui/button.jsx";
import { useMediaQuery } from "@/hooks/useMediaQuery.js";

const ITEMS_TO_DISPLAY = 3

export default function Breadcrumbs({ breadcrumbs }) {
    const [open, setOpen] = useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")

    return (
        <div className="-mt-3 sm:-mt-2 md:mt-0 mb-5">
            <Breadcrumb>
                <BreadcrumbList>
                    {breadcrumbs.length <= 2 ? (
                        breadcrumbs.map((item, index) => (
                            <Fragment key={index}>
                                <BreadcrumbItem key={index}>
                                    {item.href ? (
                                        <BreadcrumbLink asChild className="text-gray-400 hover:text-gray-800">
                                            <Link href={item.href}>{item.label}</Link>
                                        </BreadcrumbLink>
                                    ) : (
                                        <BreadcrumbPage className="text-gray-800">
                                            {item.label}
                                        </BreadcrumbPage>
                                    )}
                                </BreadcrumbItem>
                                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                            </Fragment>
                        ))
                    ) : (
                        <>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild className="text-gray-400 hover:text-gray-800">
                                    <Link href={breadcrumbs[0].href}>{breadcrumbs[0].label}</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />

                            {breadcrumbs.length > ITEMS_TO_DISPLAY && (
                                <>
                                    <BreadcrumbItem>
                                        {isDesktop ? (
                                            <DropdownMenu open={open} onOpenChange={setOpen}>
                                                <DropdownMenuTrigger
                                                    className="flex breadcrumbs-center gap-1 focus:outline-none"
                                                    aria-label="Toggle menu"
                                                >
                                                    <BreadcrumbEllipsis className="h-4 w-4 shrink-0" />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="start">
                                                    {breadcrumbs.slice(1, -2).map((item, index) => (
                                                        <DropdownMenuItem
                                                            key={index}
                                                            className="text-gray-800 focus:bg-gray-200/50"
                                                        >
                                                            <Link href={item.href || "#"}>{item.label}</Link>
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        ) : (
                                            <Drawer open={open} onOpenChange={setOpen}>
                                                <DrawerTrigger
                                                    className="focus:outline-none"
                                                    aria-label="Toggle Menu"
                                                >
                                                    <BreadcrumbEllipsis className="h-4 w-4 shrink-0" />
                                                </DrawerTrigger>
                                                <DrawerContent>
                                                    <DrawerHeader className="text-left">
                                                        <DrawerTitle className="text-sm text-gray-800">Navigate to</DrawerTitle>
                                                        <DrawerDescription className="text-xs text-gray-500">
                                                            Select a page to navigate to.
                                                        </DrawerDescription>
                                                    </DrawerHeader>
                                                    <div className="grid gap-1 px-4">
                                                        {breadcrumbs.slice(1, -2).map((item, index) => (
                                                            <Link
                                                                key={index}
                                                                href={item.href || "#"}
                                                                className="py-1 text-xs text-gray-900 underline underline-offset-1"
                                                            >
                                                                {item.label}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                    <DrawerFooter className="pt-4">
                                                        <DrawerClose asChild>
                                                            <Button
                                                                variant="outline"
                                                                className="border border-gray-300 h-8"
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

                            {breadcrumbs.slice(-ITEMS_TO_DISPLAY + 1).map((item, index) => (
                                <BreadcrumbItem key={index}>
                                    {item.href ? (
                                        <>
                                            <BreadcrumbLink
                                                asChild
                                                className="max-w-20 truncate md:max-w-none text-gray-400 hover:text-gray-800"
                                            >
                                                <Link href={item.href}>{item.label}</Link>
                                            </BreadcrumbLink>
                                            <BreadcrumbSeparator />
                                        </>
                                    ) : (
                                        <BreadcrumbPage className="max-w-20 truncate md:max-w-none text-gray-800 font-medium">
                                            {item.label}
                                        </BreadcrumbPage>
                                    )}
                                </BreadcrumbItem>
                            ))}
                        </>
                    )}
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    )
}
