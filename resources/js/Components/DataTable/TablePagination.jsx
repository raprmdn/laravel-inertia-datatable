import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react";
import { Link } from "@inertiajs/react";

const PaginationLink = ({ href, srText, icon: Icon, hiddenOnMd }) => (
    <Link
        preserveScroll
        preserveState
        href={href}
        className={`h-8 w-8 p-0 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-background shadow-sm hover:bg-gray-50 ${hiddenOnMd ? 'hidden md:inline-flex' : ''}`}
    >
        <span className="sr-only">{srText}</span>
        <Icon className="h-4 w-4" />
    </Link>
);

export default function TablePagination({ links, meta }) {
    return (
        <div className="flex items-center justify-between">
            <div className="hidden md:block">
                <p className="text-xs text-nile-blue">
                    Showing <span className="font-bold">{meta.from || 0}</span> to <span className="font-bold">{meta.to || 0}</span> of <span className="font-bold">{meta.total}</span> entries
                </p>
            </div>

            <div className="block md:hidden space-x-1">
                <PaginationLink href={links.first} srText="Go to first page" icon={ChevronsLeftIcon} />
                <PaginationLink href={links.prev} srText="Go to previous page" icon={ChevronLeftIcon} />
            </div>

            <div className="text-xs text-gray-900 font-bold">
                {meta.current_page} / {meta.last_page}
            </div>

            <div className="flex items-center space-x-2">
                <PaginationLink href={links.first} srText="Go to first page" icon={ChevronsLeftIcon} hiddenOnMd />
                <PaginationLink href={links.prev} srText="Go to previous page" icon={ChevronLeftIcon} hiddenOnMd />
                <PaginationLink href={links.next} srText="Go to next page" icon={ChevronRightIcon} />
                <PaginationLink href={links.last} srText="Go to last page" icon={ChevronsRightIcon} />
            </div>
        </div>
    );
}
