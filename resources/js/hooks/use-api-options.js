import { useHttp } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function useApiOptions({
    url,
    minimumCharacters = 2,
    debounce = 300,
    limit = 20,
}) {
    const [options, setOptions] = useState([]);
    const [search, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const debounceRef = useRef(null);
    const requestTokenRef = useRef(0);
    const { get, cancel } = useHttp();

    const setSearch = useCallback(
        (rawSearch) => {
            const nextSearch = rawSearch ?? '';
            const query = nextSearch.trim();

            setSearchValue(nextSearch);
            clearTimeout(debounceRef.current);
            requestTokenRef.current += 1;
            const requestToken = requestTokenRef.current;

            cancel();
            setOptions([]);
            setError(false);
            setHasMore(false);

            if (query.length < minimumCharacters) {
                setLoading(false);

                return;
            }

            setLoading(true);
            debounceRef.current = setTimeout(async () => {
                const requestUrl = new URL(url, window.location.origin);
                requestUrl.searchParams.set('search', query);
                requestUrl.searchParams.set('limit', String(limit));

                try {
                    const response = await get(requestUrl.toString());

                    if (requestToken !== requestTokenRef.current) {
                        return;
                    }

                    const results = Array.isArray(response?.data)
                        ? response.data
                        : [];

                    setOptions(
                        results.map((option) => ({
                            ...option,
                            value: String(option.value),
                        })),
                    );
                    setHasMore(Boolean(response?.meta?.has_more));
                } catch {
                    if (requestToken !== requestTokenRef.current) {
                        return;
                    }

                    setOptions([]);
                    setError(true);
                } finally {
                    if (requestToken === requestTokenRef.current) {
                        setLoading(false);
                    }
                }
            }, debounce);
        },
        [cancel, debounce, get, limit, minimumCharacters, url],
    );

    useEffect(() => {
        return () => {
            clearTimeout(debounceRef.current);
            requestTokenRef.current += 1;
            cancel();
        };
    }, [cancel]);

    return {
        options,
        search,
        setSearch,
        loading,
        error,
        hasMore,
    };
}
