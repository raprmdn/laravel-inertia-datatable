import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table.jsx";
import { usePage } from "@inertiajs/react";
import TableSortHeader from "@/Components/DataTable/TableSortHeader.jsx";
import TablePagination from "@/Components/DataTable/TablePagination.jsx";
import TableToolbar from "@/Components/DataTable/TableToolbar.jsx";
import TableFilter from "@/Components/DataTable/TableFilter.jsx";
import useDebouncedSearch from "@/hooks/useDebouncedSearch.js";
import useSorting from "@/hooks/useSorting.js";


export default function DataTable() {
    const { data: posts, links, meta } = usePage().props.posts;
    const { filters, categories } = usePage().props;
    const { params, setParams, setTimeDebounce } = useDebouncedSearch(
        route(route().current()),
        filters
    );
    const { sort } = useSorting(filters, setParams);

    const status = [
        {
            value: "published",
            label: "PUBLISHED",
        },
        {
            value: "draft",
            label: "DRAFT",
        },
        {
            value: "archived",
            label: "ARCHIVED",
        }
    ];

    const categoryOptions = categories.map((category) => ({
        value: category.slug,
        label: category.name
    }));

    return (
        <div className="space-y-4">
            <TableToolbar
                placeholder="Search post"
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
                    title="Categories"
                    filter="categories"
                    options={categoryOptions}
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
                                    title="Title"
                                    onClick={() => {
                                        setTimeDebounce(50)
                                        sort('title')
                                    }}
                                    sort={params.col === 'title' ? params.sort : null}
                                />
                            </TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Excerpt</TableHead>
                            <TableHead>Categories</TableHead>
                            <TableHead>
                                <TableSortHeader
                                    title="Author"
                                    onClick={() => {
                                        setTimeDebounce(50)
                                        sort('author')
                                    }}
                                    sort={params.col === 'author' ? params.sort : null}
                                />
                            </TableHead>
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
                            posts.length > 0 ? (
                                posts.map((post) => (
                                    <TableRow key={post.id} className="bg-white">
                                        <TableCell className="whitespace-nowrap max-w-[350px] truncate">{post.title}</TableCell>
                                        <TableCell className="max-w-[250px] truncate">
                                            {post.slug}
                                        </TableCell>
                                        <TableCell className="max-w-[250px] truncate">
                                            {post.excerpt}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            <div className="flex items-center gap-1">
                                                {
                                                    post.categories.map((category) => (
                                                        <span key={category.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            {category.name}
                                                        </span>
                                                    ))
                                                }
                                            </div>
                                        </TableCell>
                                        <TableCell>{post.user.name}</TableCell>
                                        <TableCell>
                                            {post.status === 'PUBLISHED' && <span className="inline-flex items-center rounded bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">PUBLISHED</span>}
                                            {post.status === 'DRAFT' && <span className="inline-flex items-center rounded bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20">DRAFT</span>}
                                            {post.status === 'ARCHIVED' && <span className="inline-flex items-center rounded bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">ARCHIVED</span>}
                                        </TableCell>
                                        <TableCell>{post.created_at}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-2">
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-24 text-center bg-white">
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
