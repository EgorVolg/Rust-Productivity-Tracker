import { useCallback, useEffect, useRef, useState } from "react";

export function useToast(duration = 1500) {
    const [message, setMessage] = useState<string | null>(null);
    const timerRef = useRef<number | null>(null);

    useEffect(() => () => {
        if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    }, []);

    const show = useCallback((msg: string) => {
        if (timerRef.current !== null) window.clearTimeout(timerRef.current);
        setMessage(msg);
        timerRef.current = window.setTimeout(() => {
            setMessage(null);
            timerRef.current = null;
        }, duration);
    }, [duration]);

    const hide = useCallback(() => {
        if (timerRef.current !== null) window.clearTimeout(timerRef.current);
        setMessage(null);
        timerRef.current = null;
    }, []);

    return { message, show, hide };
}