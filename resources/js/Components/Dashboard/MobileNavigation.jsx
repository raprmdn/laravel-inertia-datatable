import React, { Fragment } from 'react';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/shadcn/ui/sheet.jsx";
import { Button } from "@/shadcn/ui/button.jsx";
import {
    ChevronDown, LogOut,
    ServerIcon, Settings,
    User,
} from "lucide-react";
import { Link, usePage } from "@inertiajs/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/shadcn/ui/dropdown-menu.jsx";
import { clsx } from "clsx";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shadcn/ui/collapsible.jsx";
import useOpenSubMenu from "@/hooks/useOpenSubMenu.js";
import { Separator } from "@/shadcn/ui/separator.jsx";

function NavigationGroup({ nav, openMenuIdx, handleMenuClick }) {
    return (
        <>
            <li>
                <div className="text-xs font-light leading-7 text-gray-500">
                    {nav.group}
                </div>
            </li>
            {nav.menu.map((menu, menuIdx) => (
                <Fragment key={menuIdx}>
                    {menu.subs.length < 1 ? (
                        <li>
                            <NavigationLink
                                {...menu}
                            />
                        </li>
                    ) : (
                        <CollapsibleMenu
                            menu={menu}
                            isOpen={openMenuIdx === menuIdx}
                            onOpenChange={() => handleMenuClick(menuIdx)}
                        />
                    )}
                </Fragment>
            ))}
        </>
    );
}

function NavigationLink({ href, current, icon, name }) {
    return (
        <SheetClose asChild>
            <Link
                className={
                    clsx(
                        current ? 'bg-gray-200/50' : '',
                        'group flex items-center justify-between rounded-md px-2.5 py-[0.390rem] text-sm leading-6 text-gray-900 hover:bg-gray-200/50 transition duration-150'
                    )
                }
                href={href}
            >
            <span className="flex items-center gap-x-3 text-gray-900">
                {icon}
                {name}
            </span>
            </Link>
        </SheetClose>
    );
}

function CollapsibleMenu({ menu, isOpen, onOpenChange }) {
    return (
        <Collapsible
            open={isOpen}
            onOpenChange={onOpenChange}
            className="w-full"
        >
            <CollapsibleTrigger
                className="[&[data-state=open]>div>div>svg]:rotate-180 mb-1"
                asChild
            >
                <Button
                    variant="ghost"
                    className={
                        clsx(
                            menu.current ? 'bg-gray-200/50' : '',
                            'px-2.5 py-[0.390rem] text-sm leading-6 gap-3 flex w-full justify-start items-center hover:bg-gray-200/50 whitespace-normal h-auto text-left transition duration-150'
                        )
                    }
                >
                    <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-x-3 font-normal">
                            <span className="flex items-center">
                                {menu.icon}
                            </span>
                            {menu.name}
                        </div>
                        <div>
                            <ChevronDown
                                size={18}
                                className="transition-transform duration-200"
                            />
                        </div>
                    </div>
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent
                className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down space-y-1"
            >
                <div className="ml-4 mt-0.5 border-l border-gray-200 p-0">
                    <ul className="space-y-1">
                        {menu.subs.map((sub, idx) => (
                            <li key={idx}>
                                <SheetClose asChild>
                                    <Link
                                        href={sub.href}
                                        className={clsx(
                                            sub.current ? 'bg-gray-200/50' : '',
                                            'text-gray-900 pl-5 px-2.5 py-[0.390rem] text-sm leading-6 group flex items-center gap-3 rounded-r-lg hover:bg-gray-200/50 transition duration-150'
                                        )}
                                    >
                                        {sub.icon}
                                        {sub.name}
                                    </Link>
                                </SheetClose>
                            </li>
                        ))}
                    </ul>
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}

export default function MobileNavigation({ navigations }) {
    const { auth } = usePage().props;
    const { openMenuIndex, handleMenuClick } = useOpenSubMenu(navigations);

    return (
        <>
            <div className="sticky top-0 z-20 -mx-3.5 mb-6 border-b bg-background sm:-mx-6">
                <nav className="flex items-center justify-between px-4 py-3 sm:px-6">
                    <div className="flex items-center">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="block focus:outline-none lg:hidden border-0 -mr-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24}
                                         fill="none" viewBox="0 0 24 24" className="size-5">
                                        <path stroke="currentColor" strokeLinecap="round"
                                              strokeLinejoin="round" strokeWidth="1.5"
                                              d="M2.75 12h18.5M2.75 5.75h18.5m-18.5 12.5h8.75"/>
                                    </svg>
                                    <span className="sr-only">Toggle navigation menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="flex flex-col">
                                <div className="py-6 sm:mb-6 border-b">
                                    <Link className="flex shrink-0 items-center"
                                          href={route('dashboard')}
                                    >
                                        <ServerIcon className="mr-2 size-5 shrink-0"/>
                                        <span className="text-sm font-semibold">RAPRMDN</span>
                                    </Link>
                                </div>

                                <nav className="flex flex-1 flex-col">
                                    <ul role="list" className="flex flex-1 flex-col gap-y-1">
                                        {navigations.map((nav, idx) => (
                                            <Fragment key={idx}>
                                                <NavigationGroup
                                                    nav={nav}
                                                    openMenuIdx={openMenuIndex}
                                                    handleMenuClick={handleMenuClick}
                                                />
                                            </Fragment>
                                        ))}
                                    </ul>
                                </nav>

                                <div className="">
                                    <div className="mb-4 mt-auto w-full rounded-lg border bg-gray-50 shadow-sm">
                                        <a href="#"
                                           className="flex items-center gap-x-4 px-3 py-3 text-sm leading-[1.10rem]"
                                        >
                                            <span
                                                className="relative flex shrink-0 overflow-hidden rounded-full size-8"><img
                                                className="aspect-square h-full w-full"
                                                src="https://github.com/raprmdn.png"/>
                                            </span>
                                            <div>
                                                <span className="sr-only">Your profile</span>
                                                <span aria-hidden="true"
                                                      className="font-semibold text-gray-900">
                                                    {auth.user.name}
                                                </span>
                                                <span
                                                    aria-hidden="true"
                                                    className="block text-xs text-gray-500"
                                                >
                                                    {auth.user.email}
                                                </span>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                        <Separator orientation="vertical" className="shrink-0 bg-border w-[1px] mr-4 h-6 lg:hidden"/>
                    </div>
                    <div className="flex items-center gap-x-4">
                        <button type="button" aria-haspopup="dialog" aria-expanded="false"
                                aria-controls="radix-:rc:" data-state="closed"
                                className="group relative">
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24}
                                 fill="none" viewBox="0 0 24 24" className="size-4">
                                <path stroke="currentColor" strokeWidth="1.5"
                                      d="M16 18.25c-.673 1.766-2.21 3-4 3s-3.327-1.234-4-3m-3.326 0h14.652a1 1 0 0 0 .987-1.16l-1.358-8.417a7.045 7.045 0 0 0-13.91 0l-1.358 8.418a1 1 0 0 0 .987 1.159Z"/>
                            </svg>
                            <div
                                className="absolute -right-2 -top-2 grid size-4 scale-90 place-content-center rounded bg-red-500 text-[8px] font-semibold text-white transition-transform group-hover:scale-125">
                            20
                            </div>
                        </button>
                        <Separator orientation="vertical" className="shrink-0 bg-border w-[1px] h-6"/>
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary"
                                        size="icon"
                                        className="group cursor-pointer rounded-full focus:outline-none focus:ring-0"
                                >
                                    <span
                                        className="relative flex shrink-0 overflow-hidden rounded-full size-9 focus:outline-none focus:ring-0">
                                        <img
                                            className="aspect-square h-full w-full"
                                            src="https://github.com/raprmdn.png"
                                        />
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <div className="px-2.5 py-1.5">
                                    <p className="block text-sm text-gray-800 font-medium truncate">
                                        {auth.user.name}
                                    </p>
                                    <p className="text-xs text-gray-600 truncate">
                                        {auth.user.email}
                                    </p>
                                </div>
                                <DropdownMenuSeparator/>
                                <DropdownMenuGroup>
                                    <DropdownMenuItem className="focus:bg-gray-200/50">
                                        <User className="mr-2 h-4 w-4"/>
                                        <span>Profile</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="focus:bg-gray-200/50">
                                        <Settings className="mr-2 h-4 w-4"/>
                                        <span>Settings</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator/>
                                    <Link
                                        as="button"
                                        method="post"
                                        href={route('logout')}
                                        className="block w-full"
                                    >
                                        <DropdownMenuItem
                                            className="focus:bg-gray-200/50 cursor-pointer"
                                        >
                                            <LogOut className="mr-2 h-4 w-4"/>
                                            <span>Logout</span>
                                        </DropdownMenuItem>
                                    </Link>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </nav>
            </div>
        </>
    )
}
