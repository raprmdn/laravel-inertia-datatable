const useSorting = (initialParams, setParams) => {
    const sort = (column) => {
        setParams((prevParams) => ({
            ...prevParams,
            col: column,
            sort: prevParams.sort ? (prevParams.sort === 'asc' ? 'desc' : 'asc') : 'asc',
        }));
    };

    return { sort };
};

export default useSorting;
