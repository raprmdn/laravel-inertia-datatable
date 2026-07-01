import { cn } from '@/lib/utils';

export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p {...props} className={cn('text-xs text-red-600 dark:text-red-400', className)}>
            {message}
        </p>
    ) : null;
}

