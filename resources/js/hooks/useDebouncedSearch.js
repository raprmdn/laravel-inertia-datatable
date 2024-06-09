import { useCallback, useEffect, useState } from 'react';
import { debounce, pickBy } from 'lodash';
import { router } from '@inertiajs/react';
import usePrevious from "@/hooks/usePrevious.js";

const useDebouncedSearch = (url, initialParams, initialTimeDebounce = 50) => {
    const [params, setParams] = useState(initialParams);
    const [timeDebounce, setTimeDebounce] = useState(initialTimeDebounce);
    const prevParams = usePrevious(params);

    const search = useCallback(
        debounce((params) => {
            router.get(url, pickBy(params), {
                replace: true,
                preserveScroll: true,
                preserveState: true,
                queryStringArrayFormat: 'indices',
            });
        }, timeDebounce),
        [timeDebounce]
    );

    useEffect(() => {
        if (prevParams) {
            search(params);
        }
    }, [params]);

    return { params, setParams, setTimeDebounce };
};

export default useDebouncedSearch;
