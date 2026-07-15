import { Button } from '@/components/ui/button.jsx';
import { cn } from '@/lib/utils.js';
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from 'lucide-react';

const SortIcon = ({ sort }) => {
    if (sort === 'desc') {
        return <ArrowDownIcon className="ml-1 size-3.5 text-primary" />;
    }

    if (sort === 'asc') {
        return <ArrowUpIcon className="ml-1 size-3.5 text-primary" />;
    }

    return <ArrowUpDownIcon className="ml-1 size-4 text-muted-foreground/60" />;
};

export default function TableSortHeader({ className, title, sort, ...props }) {
    return (
        <div className={cn('flex items-center', className)}>
            <Button
                variant="ghost"
                size="sm"
                className="-ml-2 flex h-8 cursor-pointer items-center rounded-lg border-none px-2 text-sm transition-colors hover:bg-background hover:text-foreground dark:hover:bg-zinc-800"
                {...props}
            >
                <span>{title}</span>
                <SortIcon sort={sort} />
            </Button>
        </div>
    );
}
