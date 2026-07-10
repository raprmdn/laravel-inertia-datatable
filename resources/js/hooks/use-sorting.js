export default function useSorting(filters, setParams) {
    void filters;

    const sort = (column) => {
        setParams((params) => ({
            ...params,
            col: column,
            sort:
                params?.col === column && params?.sort === 'asc'
                    ? 'desc'
                    : 'asc',
        }));
    };

    return { sort };
}
