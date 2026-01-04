import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useInactivityTimer } from '../../hooks/useInactivityTimer';
import { useVisibilityChange } from '../../hooks/useVisibilityChange';

interface AppLayoutProps {
    children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isInChat = location.pathname === '/chat';

    // Navigate back to news feed on inactivity (60 seconds)
    const handleInactive = () => {
        if (isInChat) {
            navigate('/');
        }
    };

    useInactivityTimer({
        timeout: 60000, // 60 seconds
        onInactive: handleInactive,
    });

    // Navigate back to news feed when app goes to background
    useVisibilityChange({
        onHidden: () => {
            if (isInChat) {
                navigate('/');
            }
        },
    });

    // Handle back button navigation
    useEffect(() => {
        const handlePopState = () => {
            if (isInChat) {
                navigate('/');
            }
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [isInChat, navigate]);

    return <>{children}</>;
};

export default AppLayout;
