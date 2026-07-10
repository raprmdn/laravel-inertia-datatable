import { usePage } from '@inertiajs/react';
import TablePagination from '@/components/data-table/table-pagination.jsx';
import TableRowEmptyState from '@/components/data-table/table-empty-state.jsx';
import TableSortHeader from '@/components/data-table/table-sort-header.jsx';
import TableToolbar from '@/components/data-table/table-toolbar.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import {
    Table,
    TableBody,
    TableCell,
    TableCellSticky,
    TableHead,
    TableHeader,
    TableHeadSticky,
    TableRow,
} from '@/components/ui/table.jsx';
import useDebouncedSearch from '@/hooks/use-debounced-search.js';
import useSorting from '@/hooks/use-sorting.js';
import { __ } from '@/lib/lang.jsx';
import {
    userFilterDefaults,
    UserFilters,
} from '@/pages/users/partials/user-filters.jsx';

const formatCreatedAt = (createdAt) => {
    if (!createdAt) {
        return '-';
    }

    if (createdAt?.dFY_tf) {
        return `${createdAt.dFY_tf}${createdAt.Hi ? `, ${createdAt.Hi}` : ''}`;
    }

    return createdAt;
};

export default function DataTable() {
    const { data: users, meta } = usePage().props.users;
    const { filters } = usePage().props;
    const { params, setParams, setTimeDebounce } = useDebouncedSearch(
        route(route().current()),
        filters,
    );
    const { sort } = useSorting(filters, setParams);

    return (
        <div className="space-y-4">
            <TableToolbar
                placeholder={__('Search :key', { key: __('Users') })}
                search={params.search}
                params={params}
                setParams={setParams}
                setTimeDebounce={setTimeDebounce}
                defaultFilterValues={userFilterDefaults}
                filters={UserFilters}
            />

            <Table>
                <TableHeader>
                    <TableRow className="bg-green-white">
                        <TableHeadSticky index={0} isLast={true}>
                            <TableSortHeader
                                title={__('Name')}
                                onClick={() => {
                                    setTimeDebounce(50);
                                    sort('name');
                                }}
                                sort={
                                    params.col === 'name' ? params.sort : null
                                }
                            />
                        </TableHeadSticky>
                        <TableHead>
                            <TableSortHeader
                                title={__('Email')}
                                onClick={() => {
                                    setTimeDebounce(50);
                                    sort('email');
                                }}
                                sort={
                                    params.col === 'email' ? params.sort : null
                                }
                            />
                        </TableHead>
                        <TableHead>
                            <TableSortHeader
                                title={__('Email Verified')}
                                onClick={() => {
                                    setTimeDebounce(50);
                                    sort('email_verified_at');
                                }}
                                sort={
                                    params.col === 'email_verified_at'
                                        ? params.sort
                                        : null
                                }
                            />
                        </TableHead>
                        <TableHead>
                            <TableSortHeader
                                title={__('Created at')}
                                onClick={() => {
                                    setTimeDebounce(50);
                                    sort('created_at');
                                }}
                                sort={
                                    params.col === 'created_at'
                                        ? params.sort
                                        : null
                                }
                            />
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    {user.name}
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    {user.email_verified_at ? (
                                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                            {__('Verified')}
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                                            {__('Unverified')}
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {formatCreatedAt(user.created_at)}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRowEmptyState colSpan={4} label="User" />
                    )}
                </TableBody>
            </Table>

            <TablePagination meta={meta} />
        </div>
    );
}
