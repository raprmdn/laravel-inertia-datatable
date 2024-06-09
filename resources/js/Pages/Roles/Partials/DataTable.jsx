import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table.jsx";
import { usePage } from "@inertiajs/react";
import TableSortHeader from "@/Components/DataTable/TableSortHeader.jsx";
import TablePagination from "@/Components/DataTable/TablePagination.jsx";
import TableToolbar from "@/Components/DataTable/TableToolbar.jsx";
import TableFilter from "@/Components/DataTable/TableFilter.jsx";
import useDebouncedSearch from "@/hooks/useDebouncedSearch.js";
import useSorting from "@/hooks/useSorting.js";

const guard = [
    {
        value: "api",
        label: "API",
    },
    {
        value: "web",
        label: "Web",
    }
];

export default function DataTable() {
    const { data: roles, links, meta } = usePage().props.roles;
    const { filters } = usePage().props;
    const { params, setParams, setTimeDebounce } = useDebouncedSearch(
        route(route().current()),
        filters
    );
    const { sort } = useSorting(filters, setParams);

    return (
        <div className="space-y-4">
            <TableToolbar
                placeholder="Search role"
                search={params.search}
                params={params}
                setParams={setParams}
                setTimeDebounce={setTimeDebounce}
            />
            <div className="flex flex-col gap-1 sm:flex-row sm:space-x-1">
                <TableFilter
                    title="Guard"
                    filter="guard"
                    options={guard}
                    params={params}
                    setParams={setParams}
                    setTimeDebounce={setTimeDebounce}
                />
            </div>
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
                            <TableHead>Guard</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            roles.length > 0 ? (
                                roles.map((role) => (
                                    <TableRow key={role.id} className="bg-white">
                                        <TableCell>{role.name}</TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {role.guard_name}
                                            </span>
                                        </TableCell>
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
