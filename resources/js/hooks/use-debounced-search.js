// import { useCallback, useEffect, useState } from 'react';
// import { debounce, pickBy } from 'lodash';
// import { router } from '@inertiajs/react';
// import usePrevious from '@/hooks/use-previous.js';
//
// const useDebouncedSearch = (url, initialParams, initialTimeDebounce = 50) => {
//     const [params, setParams] = useState(initialParams);
//     const [timeDebounce, setTimeDebounce] = useState(initialTimeDebounce);
//     const prevParams = usePrevious(params);
//
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     const search = useCallback(
//         debounce((params) => {
//             router.get(url, pickBy(params), {
//                 replace: true,
//                 preserveScroll: true,
//                 preserveState: true,
//                 queryStringArrayFormat: 'indices',
//             });
//         }, timeDebounce),
//         [timeDebounce],
//     );
//
//     useEffect(() => {
//         if (prevParams) {
//             search(params);
//         }
//     }, [params]);
//
//     return { params, setParams, setTimeDebounce };
// };
//
// export default useDebouncedSearch;

import { useCallback, useEffect, useState } from 'react';
import { debounce, pickBy } from 'lodash';
import { router } from '@inertiajs/react';
import usePrevious from '@/hooks/use-previous.js';

const useDebouncedSearch = (url, initialParams, initialTimeDebounce = 50) => {
    const [params, setParams] = useState(initialParams);
    const [timeDebounce, setTimeDebounce] = useState(initialTimeDebounce);

    const prevParams = usePrevious(params);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const search = useCallback(
        debounce((nextParams) => {
            router.get(url, pickBy(nextParams), {
                replace: true,
                preserveScroll: true,
                preserveState: true,
                queryStringArrayFormat: 'indices',
            });
        }, timeDebounce),
        [url, timeDebounce],
    );

    useEffect(() => {
        if (prevParams) {
            search(params);
        }

        // Intentionally only trigger searches when params change.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    useEffect(() => {
        return () => {
            search.cancel();
        };
    }, [search]);

    return {
        params,
        setParams,
        setTimeDebounce,
    };
};

export default useDebouncedSearch;

