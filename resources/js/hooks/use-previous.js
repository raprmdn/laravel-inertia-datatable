import { useEffect, useRef } from "react";

export default function usePrevious(value) {
    const ref = useRef();

    useEffect(() => {
        ref.current = value;
    });

    // eslint-disable-next-line react-hooks/refs
    return ref.current;
}
