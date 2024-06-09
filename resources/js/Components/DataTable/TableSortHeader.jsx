import { cn } from "@/lib/utils.js";
import { Button } from "@/shadcn/ui/button.jsx";
import {
    ArrowDownIcon,
    ArrowUpIcon,
    ChevronsUpDownIcon,
} from "lucide-react";
import React from "react";

const SortIcon = ({ sort }) => {
    if (sort === "desc") return <ArrowDownIcon className="ml-2 h-3.5 w-3.5" />;
    if (sort === "asc") return <ArrowUpIcon className="ml-2 h-3.5 w-3.5" />;
    return <ChevronsUpDownIcon className="ml-2 h-4 w-4" />;
};

export default function TableSortHeader({ className, title, sort, ...props }) {
    return (
        <div className={cn("flex items-center space-x-2", className)}>
            <Button
                variant="ghost"
                size="sm"
                className="flex items-center -ml-0.5 h-8 hover:bg-gray-200 border-none"
                {...props}
            >
                <span>{title}</span>
                <SortIcon sort={sort} />
            </Button>
        </div>
    );
}
