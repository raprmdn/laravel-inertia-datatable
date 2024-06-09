import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table.jsx";
import { usePage } from "@inertiajs/react";
import TableSortHeader from "@/Components/DataTable/TableSortHeader.jsx";
import TablePagination from "@/Components/DataTable/TablePagination.jsx";
import TableToolbar from "@/Components/DataTable/TableToolbar.jsx";
import TableFilter from "@/Components/DataTable/TableFilter.jsx";
import { BadgeAlertIcon, BadgeCheckIcon } from "lucide-react";
import useDebouncedSearch from "@/hooks/useDebouncedSearch.js";
import useSorting from "@/hooks/useSorting.js";


export default function DataTable() {
    const { data: users, links, meta } = usePage().props.users;
    const { filters, roles } = usePage().props;
    const { params, setParams, setTimeDebounce } = useDebouncedSearch(
        route(route().current()),
        filters
    );
    const { sort } = useSorting(filters, setParams);

    const status = [
        {
            value: "verified",
            label: "Verified",
            icon: BadgeCheckIcon
        },
        {
            value: "unverified",
            label: "Unverified",
            icon: BadgeAlertIcon
        }
    ];

    const rolesOptions = roles.map((role) => ({
        value: role.name,
        label: role.name
    }));

    return (
        <div className="space-y-4">
            <TableToolbar
                placeholder="Search user"
                search={params.search}
                params={params}
                setParams={setParams}
                setTimeDebounce={setTimeDebounce}
            />
            <div className="flex flex-col gap-1 sm:flex-row sm:space-x-1">
                <TableFilter
                    title="Status"
                    filter="status"
                    options={status}
                    params={params}
                    setParams={setParams}
                    setTimeDebounce={setTimeDebounce}
                />
                <TableFilter
                    title="Roles"
                    filter="roles"
                    options={rolesOptions}
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
                            <TableHead>
                                <TableSortHeader
                                    title="Email"
                                    onClick={() => {
                                        setTimeDebounce(50)
                                        sort('email')
                                    }}
                                    sort={params.col === 'email' ? params.sort : null}
                                />
                            </TableHead>
                            <TableHead>Roles</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>
                                <TableSortHeader
                                    title="Created at"
                                    onClick={() => {
                                        setTimeDebounce(50)
                                        sort('created_at')
                                    }}
                                    sort={params.col === 'created_at' ? params.sort : null}
                                />
                            </TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            users.length > 0 ? (
                                users.map((user) => (
                                    <TableRow key={user.id} className="bg-white">
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {
                                                    user.roles.map((role) => (
                                                        <span key={role.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            {role.name}
                                                        </span>
                                                    ))
                                                }
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {
                                                user.is_verified_email
                                                    ? <span className="inline-flex items-center rounded bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Verified</span>
                                                    : <span className="inline-flex items-center rounded bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">Unverified</span>
                                            }
                                        </TableCell>
                                        <TableCell>{user.created_at}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-2">
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center bg-white">
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
