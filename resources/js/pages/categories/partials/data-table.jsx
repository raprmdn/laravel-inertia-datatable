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
    const { data: categories, meta } = usePage().props.categories;
    const { filters } = usePage().props;
    const { params, setParams, setTimeDebounce } = useDebouncedSearch(
        route(route().current()),
        filters,
    );
    const { sort } = useSorting(filters, setParams);

    return (
        <div className="space-y-4">
            <TableToolbar
                placeholder={__('Search Category')}
                search={params.search}
                params={params}
                setParams={setParams}
                setTimeDebounce={setTimeDebounce}
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
                                title={__('Slug')}
                                onClick={() => {
                                    setTimeDebounce(50);
                                    sort('slug');
                                }}
                                sort={
                                    params.col === 'slug' ? params.sort : null
                                }
                            />
                        </TableHead>
                        <TableHead>
                            <TableSortHeader
                                title={__('Posts')}
                                onClick={() => {
                                    setTimeDebounce(50);
                                    sort('posts');
                                }}
                                sort={
                                    params.col === 'posts' ? params.sort : null
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
                    {categories.length > 0 ? (
                        categories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCellSticky index={0} isLast={true}>
                                    {category.name ?? '-'}
                                </TableCellSticky>
                                <TableCell>{category.slug ?? '-'}</TableCell>
                                <TableCell>
                                    {category.posts_count ?? '-'}
                                </TableCell>
                                <TableCell>
                                    {formatCreatedAt(category.created_at)}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRowEmptyState colSpan={4} label="Category" />
                    )}
                </TableBody>
            </Table>

            <TablePagination meta={meta} />
        </div>
    );
}
