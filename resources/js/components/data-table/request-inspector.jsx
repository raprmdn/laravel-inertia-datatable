import { ChevronDownIcon, TerminalSquareIcon } from 'lucide-react';

const DisplayValue = ({ children }) => (
    <code className="font-mono text-xs break-all text-foreground">
        {children || 'None'}
    </code>
);

export default function RequestInspector({
    search,
    filters,
    sortColumn,
    sortDirection,
    perPage,
    page,
    queryString,
}) {
    const resolvedPage =
        page ?? Number(new URLSearchParams(queryString).get('page') ?? 1);

    return (
        <details className="group rounded-xl border border-border bg-muted/30">
            <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-medium focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
                <TerminalSquareIcon />
                Request inspector
                <span className="ml-auto text-xs font-normal text-muted-foreground">
                    URL state only
                </span>
                <ChevronDownIcon className="transition-transform group-open:rotate-180" />
            </summary>
            <div className="grid gap-4 border-t border-border p-4 md:grid-cols-2">
                <dl className="grid grid-cols-[7rem_1fr] gap-x-3 gap-y-2 text-sm">
                    <dt className="text-muted-foreground">Search</dt>
                    <dd>
                        <DisplayValue>{search}</DisplayValue>
                    </dd>
                    <dt className="text-muted-foreground">Raw filters</dt>
                    <dd>
                        <DisplayValue>{filters.join(', ')}</DisplayValue>
                    </dd>
                    <dt className="text-muted-foreground">Sort column</dt>
                    <dd>
                        <DisplayValue>{sortColumn}</DisplayValue>
                    </dd>
                    <dt className="text-muted-foreground">Direction</dt>
                    <dd>
                        <DisplayValue>{sortDirection}</DisplayValue>
                    </dd>
                    <dt className="text-muted-foreground">Per page</dt>
                    <dd>
                        <DisplayValue>{String(perPage)}</DisplayValue>
                    </dd>
                    <dt className="text-muted-foreground">Page</dt>
                    <dd>
                        <DisplayValue>{String(resolvedPage)}</DisplayValue>
                    </dd>
                </dl>
                <div className="flex min-w-0 flex-col gap-2">
                    <span className="text-sm text-muted-foreground">
                        Current query string
                    </span>
                    <pre className="overflow-x-auto rounded-lg bg-background p-3 font-mono text-xs whitespace-pre-wrap text-foreground">
                        {queryString || '(empty)'}
                    </pre>
                </div>
            </div>
        </details>
    );
}
