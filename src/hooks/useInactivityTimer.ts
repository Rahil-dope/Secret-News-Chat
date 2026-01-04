import { useEffect, useRef, useCallback } from 'react';

interface UseInactivityTimerOptions {
    timeout: number; // in milliseconds
    onInactive: () => void;
}

export const useInactivityTimer = ({ timeout, onInactive }: UseInactivityTimerOptions) => {
    const timeoutRef = useRef<number | null>(null);

    const resetTimer = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = window.setTimeout(() => {
            onInactive();
        }, timeout);
    }, [timeout, onInactive]);

    useEffect(() => {
        // Events to detect user activity
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

        // Reset timer on any user activity
        events.forEach((event) => {
            document.addEventListener(event, resetTimer);
        });

        // Start the initial timer
        resetTimer();

        // Cleanup
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            events.forEach((event) => {
                document.removeEventListener(event, resetTimer);
            });
        };
    }, [resetTimer]);

    return { resetTimer };
};
