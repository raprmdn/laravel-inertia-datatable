import { TableCell, TableRow } from '@/components/ui/table.jsx';
import { __ } from '@/lib/lang.jsx';

export default function TableRowEmptyState({ colSpan = 1, label }) {
    return (
        <TableRow>
            <TableCell colSpan={colSpan} className="h-24 text-center">
                <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <span className="text-sm font-medium">{__('Empty')}</span>
                </div>
                <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                        {__('No :key found', { key: __(label) })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {__('Once available, it will appear in this table.')}
                    </p>
                </div>
            </TableCell>
        </TableRow>
    );
}
