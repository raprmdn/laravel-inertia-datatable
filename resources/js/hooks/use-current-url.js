import { usePage } from '@inertiajs/react';
import { toUrl } from '@/lib/utils';

export function useCurrentUrl() {
    const page = usePage();
    const currentUrlPath = new URL(page.url, typeof window !== 'undefined'
        ? window.location.origin
        : 'http://localhost').pathname;

    const isCurrentUrl = (urlToCheck, currentUrl, startsWith = false) => {
        const urlToCompare = currentUrl ?? currentUrlPath;
        const urlString = toUrl(urlToCheck);

        const comparePath = (path) => startsWith ? urlToCompare.startsWith(path) : path === urlToCompare;

        if (!urlString.startsWith('http')) {
            return comparePath(urlString);
        }

        try {
            const absoluteUrl = new URL(urlString);

            return comparePath(absoluteUrl.pathname);
        }
        catch {
            return false;
        }
    };

    const isCurrentOrParentUrl = (urlToCheck, currentUrl) => {
        return isCurrentUrl(urlToCheck, currentUrl, true);
    };

    const whenCurrentUrl = (urlToCheck, ifTrue, ifFalse = null) => {
        return isCurrentUrl(urlToCheck) ? ifTrue : ifFalse;
    };

    return {
        currentUrl: currentUrlPath,
        isCurrentUrl,
        isCurrentOrParentUrl,
        whenCurrentUrl,
    };
}

