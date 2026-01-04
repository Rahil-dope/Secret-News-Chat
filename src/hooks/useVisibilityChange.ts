import { useEffect } from 'react';

interface UseVisibilityChangeOptions {
    onHidden: () => void;
}

export const useVisibilityChange = ({ onHidden }: UseVisibilityChangeOptions) => {
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                onHidden();
            }
        };

        const handleBlur = () => {
            onHidden();
        };

        // Listen for visibility change
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Listen for window blur (when app goes to background)
        window.addEventListener('blur', handleBlur);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
        };
    }, [onHidden]);
};
