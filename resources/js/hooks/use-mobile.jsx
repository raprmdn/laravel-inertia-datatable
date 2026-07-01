import { useSyncExternalStore } from 'react';

const MOBILE_BREAKPOINT = 768;

const mql = typeof window === 'undefined'
    ? undefined
    : window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

function mediaQueryListener(callback) {
    if (!mql) {
        return () => { };
    }

    mql.addEventListener('change', callback);

    return () => {
        mql.removeEventListener('change', callback);
    };
}

function isSmallerThanBreakpoint() {
    return mql?.matches ?? false;
}

function getServerSnapshot() {
    return false;
}

export function useIsMobile() {
    return useSyncExternalStore(mediaQueryListener, isSmallerThanBreakpoint, getServerSnapshot);
}

