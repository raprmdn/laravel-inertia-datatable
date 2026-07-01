import { cn } from '@/lib/utils.js';
import { Button } from '@/components/ui/button.jsx';
import { Spinner } from '@/components/ui/spinner.jsx';

export default function ButtonWithLoading({ className, labelClassName, processing, label, ...props }) {
    return (
        <Button
            className={cn(
                'relative transition duration-150 active:scale-99',
                className,
            )}
            disabled={processing}
            {...props}
        >
            <span className={cn('transition-opacity duration-150', processing ? 'opacity-0' : 'opacity-100', labelClassName)}>
                {label}
            </span>
            {processing && (
                <span className="absolute inset-0 flex items-center justify-center">
                    <Spinner />
                </span>
            )}
        </Button>
    );
}
