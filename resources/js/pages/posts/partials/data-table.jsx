import { usePage } from '@inertiajs/react';
import { useState } from 'react';
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
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip.jsx';
import useDebouncedSearch from '@/hooks/use-debounced-search.js';
import useSorting from '@/hooks/use-sorting.js';
import { __ } from '@/lib/lang.jsx';
import { formatSnakeCase } from '@/lib/utils.js';
import {
    postFilterDefaults,
    PostFilters,
} from '@/pages/posts/partials/post-filters.jsx';

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
    const { data: posts, meta } = usePage().props.posts;
    const {
        filters,
        selected_authors: selectedAuthors = [],
        statuses = [],
    } = usePage().props;
    const [cachedAuthors, setCachedAuthors] = useState([]);
    const { params, setParams, setTimeDebounce } = useDebouncedSearch(
        route(route().current()),
        filters,
    );
    const { sort } = useSorting(filters, setParams);
    const knownAuthors = Array.from(
        new Map(
            [...cachedAuthors, ...selectedAuthors].map((author) => [
                String(author.value),
                { ...author, value: String(author.value) },
            ]),
        ).values(),
    );
    const authorLabels = Object.fromEntries(
        knownAuthors.map((author) => [author.value, author.label]),
    );

    (params.filters ?? [])
        .filter((filter) => filter.startsWith('author:'))
        .map((filter) => filter.split(':')[1])
        .forEach((authorId) => {
            authorLabels[authorId] ??= __('Unknown author');
        });

    const cacheAuthors = (authors) => {
        setCachedAuthors((currentAuthors) =>
            Array.from(
                new Map(
                    [...currentAuthors, ...authors].map((author) => [
                        String(author.value),
                        { ...author, value: String(author.value) },
                    ]),
                ).values(),
            ),
        );
    };
    const filterValueLabels = {
        author: authorLabels,
        status: Object.fromEntries(
            statuses.map((status) => [status.value, __(status.label)]),
        ),
    };

    return (
        <div className="space-y-4">
            <TableToolbar
                placeholder={__('Search :key', { key: __('Posts') })}
                search={params.search}
                params={params}
                setParams={setParams}
                setTimeDebounce={setTimeDebounce}
                defaultFilterValues={postFilterDefaults}
                filterValueLabels={filterValueLabels}
                filters={({ data, setData }) => (
                    <PostFilters
                        data={data}
                        setData={setData}
                        selectedAuthors={(data.author ?? [])
                            .map((authorId) =>
                                knownAuthors.find(
                                    (author) =>
                                        author.value === String(authorId),
                                ),
                            )
                            .filter(Boolean)}
                        onSelectedAuthorsChange={cacheAuthors}
                    />
                )}
            />

            <Table>
                <TableHeader>
                    <TableRow className="bg-green-white">
                        <TableHeadSticky
                            index={0}
                            isLast={true}
                            className="max-w-[320px] min-w-[240px] whitespace-normal"
                        >
                            <TableSortHeader
                                title={__('Title')}
                                onClick={() => {
                                    setTimeDebounce(50);
                                    sort('title');
                                }}
                                sort={
                                    params.col === 'title' ? params.sort : null
                                }
                            />
                        </TableHeadSticky>
                        <TableHead className="w-[220px] max-w-[220px]">
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
                        <TableHead className="w-[320px] max-w-[320px]">
                            <TableSortHeader
                                title={__('Excerpt')}
                                onClick={() => {
                                    setTimeDebounce(50);
                                    sort('excerpt');
                                }}
                                sort={
                                    params.col === 'excerpt'
                                        ? params.sort
                                        : null
                                }
                            />
                        </TableHead>
                        <TableHead>{__('Categories')}</TableHead>
                        <TableHead>
                            <TableSortHeader
                                title={__('Author')}
                                onClick={() => {
                                    setTimeDebounce(50);
                                    sort('author');
                                }}
                                sort={
                                    params.col === 'author' ? params.sort : null
                                }
                            />
                        </TableHead>
                        <TableHead>
                            <TableSortHeader
                                title={__('Status')}
                                onClick={() => {
                                    setTimeDebounce(50);
                                    sort('status');
                                }}
                                sort={
                                    params.col === 'status' ? params.sort : null
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
                    {posts.length > 0 ? (
                        posts.map((post) => {
                            const categories = post.categories ?? [];
                            // ponytail: cap visible badges at three to keep table rows compact.
                            const visibleCategories = categories.slice(0, 3);
                            const remainingCategories = categories.slice(3);

                            return (
                                <TableRow key={post.id}>
                                    <TableCellSticky
                                        index={0}
                                        isLast={true}
                                        className="max-w-[320px] min-w-[240px] whitespace-normal"
                                    >
                                        {post.title ?? '-'}
                                    </TableCellSticky>
                                    <TableCell className="w-[220px] max-w-[220px]">
                                        {post.slug ? (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span
                                                        tabIndex={0}
                                                        className="block max-w-[220px] truncate rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                                    >
                                                        {post.slug}
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent className="max-w-sm break-all whitespace-normal">
                                                    {post.slug}
                                                </TooltipContent>
                                            </Tooltip>
                                        ) : (
                                            '-'
                                        )}
                                    </TableCell>
                                    <TableCell className="w-[320px] max-w-[320px]">
                                        {post.excerpt ? (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span
                                                        tabIndex={0}
                                                        className="block max-w-[320px] truncate rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                                    >
                                                        {post.excerpt}
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent className="max-w-sm break-words whitespace-normal">
                                                    {post.excerpt}
                                                </TooltipContent>
                                            </Tooltip>
                                        ) : (
                                            '-'
                                        )}
                                    </TableCell>
                                    <TableCell className="max-w-[320px] whitespace-normal">
                                        {visibleCategories.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {visibleCategories.map(
                                                    (category) => (
                                                        <Badge
                                                            key={category.id}
                                                            variant="secondary"
                                                        >
                                                            {category.name}
                                                        </Badge>
                                                    ),
                                                )}
                                                {remainingCategories.length >
                                                    0 && (
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Badge
                                                                variant="secondary"
                                                                tabIndex={0}
                                                                className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                                            >
                                                                +
                                                                {
                                                                    remainingCategories.length
                                                                }{' '}
                                                                {__('more')}
                                                            </Badge>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="max-w-sm break-words whitespace-normal">
                                                            {remainingCategories
                                                                .map(
                                                                    (
                                                                        category,
                                                                    ) =>
                                                                        category.name,
                                                                )
                                                                .join(', ')}
                                                        </TooltipContent>
                                                    </Tooltip>
                                                )}
                                            </div>
                                        ) : (
                                            '-'
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {post.author?.name ?? '-'}
                                    </TableCell>
                                    <TableCell>
                                        {post.status ? (
                                            <Badge variant="secondary">
                                                {__(
                                                    statuses.find(
                                                        (status) =>
                                                            status.value ===
                                                            post.status,
                                                    )?.label ??
                                                        formatSnakeCase(
                                                            post.status,
                                                        ),
                                                )}
                                            </Badge>
                                        ) : (
                                            '-'
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {formatCreatedAt(post.created_at)}
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    ) : (
                        <TableRowEmptyState colSpan={7} label="Post" />
                    )}
                </TableBody>
            </Table>

            <TablePagination meta={meta} />
        </div>
    );
}
