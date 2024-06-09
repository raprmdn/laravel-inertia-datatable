import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table.jsx";
import { usePage } from "@inertiajs/react";
import TableSortHeader from "@/Components/DataTable/TableSortHeader.jsx";
import TablePagination from "@/Components/DataTable/TablePagination.jsx";
import TableToolbar from "@/Components/DataTable/TableToolbar.jsx";
import useDebouncedSearch from "@/hooks/useDebouncedSearch.js";
import useSorting from "@/hooks/useSorting.js";

export default function DataTable() {
    const { data: categories, links, meta } = usePage().props.categories;
    const { filters } = usePage().props;
    const { params, setParams, setTimeDebounce } = useDebouncedSearch(
        route(route().current()),
        filters
    );
    const { sort } = useSorting(filters, setParams);

    return (
        <div className="space-y-4">
            <TableToolbar
                placeholder="Search categories"
                search={params.search}
                params={params}
                setParams={setParams}
                setTimeDebounce={setTimeDebounce}
            />
            <div className="">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                <TableSortHeader
                                    title="Name"
                                    onClick={() => {
                                        setTimeDebounce(50)
                                        sort('name')
                                    }}
                                    sort={params.col === 'name' ? params.sort : null}
                                />
                            </TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            categories.length > 0 ? (
                                categories.map((category) => (
                                    <TableRow key={category.id} className="bg-white">
                                        <TableCell>{category.name}</TableCell>
                                        <TableCell>{category.slug}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-2">
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center bg-white">
                                        No results found.
                                    </TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </div>
            <TablePagination links={links} meta={meta} />
        </div>
    )
}
