import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { authService } from '../services/auth.service';
import type { User, AuthContextType } from '../types';
import { AuthContext } from './auth-context';

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setCurrentUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                });
            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signup = async (email: string, password: string) => {
        await authService.signup(email, password);
    };

    const login = async (email: string, password: string) => {
        await authService.login(email, password);
    };

    const logout = async () => {
        await authService.logout();
    };

    const value: AuthContextType = {
        currentUser,
        loading,
        login,
        signup,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
