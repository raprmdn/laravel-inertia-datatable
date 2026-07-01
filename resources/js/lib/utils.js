import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function toUrl(url) {
    return typeof url === 'string' ? url : url.url;
}

export const HasAbility = (arrAbilities, gates) => {
    if (typeof gates === 'string') {
        return arrAbilities?.includes(gates);
    }

    return gates?.some((item) => arrAbilities?.includes(item));
};

export function formatSnakeCase(value) {
    if (!value) return '';
    return value
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
