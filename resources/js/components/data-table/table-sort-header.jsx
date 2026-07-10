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

    return <ArrowUpDownIcon className="ml-1 size-4 text-primary" />;
};

export default function TableSortHeader({ className, title, sort, ...props }) {
    return (
        <div className={cn('flex items-center space-x-2', className)}>
            <Button
                variant="ghost"
                size="sm"
                className="-ml-2 flex h-8 cursor-pointer items-center rounded-sm border-none text-sm transition duration-150 hover:bg-muted hover:text-foreground"
                {...props}
            >
                <span>{title}</span>
                <SortIcon sort={sort} />
            </Button>
        </div>
    );
}
