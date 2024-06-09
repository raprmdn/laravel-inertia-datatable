import React, { Fragment } from 'react';
import { Link, usePage } from "@inertiajs/react";
import { ChevronDown, ServerIcon } from "lucide-react";
import { clsx } from "clsx";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shadcn/ui/collapsible.jsx";
import { Button } from "@/shadcn/ui/button.jsx";
import useOpenSubMenu from "@/hooks/useOpenSubMenu.js";

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
                            </li>
                        ))}
                    </ul>
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}

export default function DesktopSidebar({ navigations }) {
    const { auth } = usePage().props;
    const {openMenuIndex, handleMenuClick} = useOpenSubMenu(navigations);

    return (

        <aside className="hidden bg-aside lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
            <div className="border-b bg-white px-6 shadow-sm">
                <Link className="flex h-[3.75rem] shrink-0 items-center focus:outline-none"
                      href={route('dashboard')}
                >
                    <ServerIcon className="mr-4 h-5 w-5 shrink-0 text-gray-500"/>
                    <span className="text-sm font-semibold">
                        RAPRMDN
                    </span>
                </Link>
            </div>
            <div className="flex grow flex-col gap-y-5 overflow-y-auto sm:px-6 bg-white sm:pt-5">
                <nav className="flex flex-1 flex-col p-4 lg:p-0">
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

                <div className="px-6 sm:px-0">
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
                                      className="font-semibold text-gray-900"
                                >
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
            </div>
        </aside>
    );
}
