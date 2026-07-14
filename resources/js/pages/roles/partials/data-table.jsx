import { usePage } from '@inertiajs/react';
import TablePagination from '@/components/data-table/table-pagination.jsx';
import TableRowEmptyState from '@/components/data-table/table-empty-state.jsx';
import TableSortHeader from '@/components/data-table/table-sort-header.jsx';
import TableToolbar from '@/components/data-table/table-toolbar.jsx';
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
    roleFilterDefaults,
    RoleFilters,
} from '@/pages/roles/partials/role-filters.jsx';

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
    const { data: roles, meta } = usePage().props.roles;
    const { filters } = usePage().props;
    const { params, setParams, setTimeDebounce } = useDebouncedSearch(
        route(route().current()),
        filters,
    );
    const { sort } = useSorting(filters, setParams);

    return (
        <div className="space-y-4">
            <TableToolbar
                placeholder={__('Search Role')}
                search={params.search}
                params={params}
                setParams={setParams}
                setTimeDebounce={setTimeDebounce}
                defaultFilterValues={roleFilterDefaults}
                filters={RoleFilters}
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
                                title={__('Guard')}
                                onClick={() => {
                                    setTimeDebounce(50);
                                    sort('guard');
                                }}
                                sort={
                                    params.col === 'guard' ? params.sort : null
                                }
                            />
                        </TableHead>
                        <TableHead>
                            <TableSortHeader
                                title={__('Users')}
                                onClick={() => {
                                    setTimeDebounce(50);
                                    sort('users');
                                }}
                                sort={
                                    params.col === 'users'
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
                    {roles.length > 0 ? (
                        roles.map((role) => (
                            <TableRow key={role.id}>
                                <TableCellSticky index={0} isLast={true}>
                                    {role.name}
                                </TableCellSticky>
                                <TableCell>{role.guard_name}</TableCell>
                                <TableCell>{role.users_count}</TableCell>
                                <TableCell>
                                    {formatCreatedAt(role.created_at)}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRowEmptyState colSpan={4} label="Role" />
                    )}
                </TableBody>
            </Table>

            <TablePagination meta={meta} />
        </div>
    );
}
