"use client"

import * as React from "react"

import { useIsMobile } from "@/hooks/use-is-mobile.jsx"
import { cn } from "@/lib/utils"

function Table({
                   className,
                   ...props
               }) {
    return (
        <div data-slot="table-container" className="relative w-full overflow-x-auto rounded-xl border">
            <table
                data-slot="table"
                className={cn("w-full caption-bottom text-sm", className)}
                {...props} />
        </div>
    );
}

function TableHeader({
                         className,
                         ...props
                     }) {
    return (
            <thead
                data-slot="table-header"
                className={cn("bg-white [&_tr]:border-b", className)}
                {...props} />
    );
}

function TableBody({
                       className,
                       ...props
                   }) {
    return (
        <tbody
            data-slot="table-body"
            className={cn("[&_tr:last-child]:border-0", className)}
            {...props} />
    );
}

function TableFooter({
                         className,
                         ...props
                     }) {
    return (
            <tfoot
                data-slot="table-footer"
                className={cn("border-t bg-white font-medium [&>tr]:last:border-b-0", className)}
                {...props} />
    );
}

function TableRow({
                      className,
                      ...props
                  }) {
    return (
        <tr
            data-slot="table-row"
            className={cn(
                "border-b bg-white text-foreground transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted",
                className
            )}
            {...props} />
    );
}

function TableHead({
                       className,
                       ...props
                   }) {
    return (
        <th
            data-slot="table-head"
            className={cn(
                "h-11 whitespace-nowrap border-b px-6 text-left align-middle font-medium text-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
                className
            )}
            {...props} />
    );
}

function TableCell({
                       className,
                       ...props
                   }) {
    return (
        <td
            data-slot="table-cell"
            className={cn(
                "border-b px-6 py-3 align-middle whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
                className
            )}
            {...props} />
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

                while (sibling && sibling.getAttribute("data-slot") === "table-head-sticky") {
                    offset += sibling.offsetWidth;
                    sibling = sibling.previousElementSibling;
                }

                setLeft(offset);
            } else {
                setLeft(0);
            }
        };

        calculateOffset();
        window.addEventListener("resize", calculateOffset);

        return () => window.removeEventListener("resize", calculateOffset);
    }, [index, isMobile]);

    return (
        <th
            ref={ref}
            data-slot="table-head-sticky"
            className={cn(
                "bg-green-white",
                !isMobile && "sticky z-10",
                "h-11 whitespace-nowrap border-b px-6 text-left align-middle font-medium text-foreground",
                isLast && !isMobile && "after:absolute after:top-0 after:right-0 after:h-full after:w-1 after:bg-green-white after:content-['']",
                className
            )}
            style={{ left: !isMobile ? `${left}px` : undefined }}
            {...props} />
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

                while (sibling && sibling.getAttribute("data-slot") === "table-cell-sticky") {
                    offset += sibling.offsetWidth;
                    sibling = sibling.previousElementSibling;
                }

                setLeft(offset);
            } else {
                setLeft(0);
            }
        };

        calculateOffset();
        window.addEventListener("resize", calculateOffset);

        return () => window.removeEventListener("resize", calculateOffset);
    }, [index, isMobile]);

    return (
        <td
            ref={ref}
            data-slot="table-cell-sticky"
            className={cn(
                "bg-white",
                !isMobile && "sticky z-10",
                "border-b px-6 py-3 align-middle whitespace-nowrap text-foreground",
                isLast && !isMobile && "after:absolute after:top-0 after:right-0 after:h-full after:w-1 after:bg-green-white after:content-['']",
                className
            )}
            style={{ left: !isMobile ? `${left}px` : undefined }}
            {...props} />
    );
}

function TableCaption({
                          className,
                          ...props
                      }) {
    return (
        <caption
            data-slot="table-caption"
            className={cn("mt-4 text-sm text-muted-foreground", className)}
            {...props} />
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
}
