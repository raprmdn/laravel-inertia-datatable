import { useCallback } from 'react';

function getInitial(name) {
    return Array.from(name)[0] ?? '';
}

export function useInitials() {
    return useCallback((fullName) => {
        const names = fullName.trim().split(/\s+/u).filter(Boolean);

        if (names.length === 0) {
            return '';
        }

        if (names.length === 1) {
            return getInitial(names[0]).toUpperCase();
        }

        const firstInitial = getInitial(names[0]);
        const lastInitial = getInitial(names[names.length - 1]);

        return `${firstInitial}${lastInitial}`.toUpperCase();
    }, []);
}

