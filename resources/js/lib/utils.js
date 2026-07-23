import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function toUrl(url) {
    return typeof url === 'string' ? url : url.url;
}

export function formatSnakeCase(value) {
    if (!value) return '';
    return value
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
