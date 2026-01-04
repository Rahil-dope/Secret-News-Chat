import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { authService } from '../services/auth.service';
import type { User, AuthContextType } from '../types';
import { AuthContext } from './auth-context';
import { generateAnimalName } from '../utils/nameGenerator';

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    // Check if user has a profile in Firestore
                    const userRef = doc(db, 'users', firebaseUser.uid);
                    const userSnap = await getDoc(userRef);
                    let displayName = '';

                    if (userSnap.exists()) {
                        displayName = userSnap.data().displayName;
                        console.log("AuthContext: Found existing profile", displayName);
                    } else {
                        // Generate and save new animal name
                        displayName = generateAnimalName();
                        console.log("AuthContext: Generated new name", displayName);
                        await setDoc(userRef, {
                            displayName,
                            email: firebaseUser.email,
                            createdAt: serverTimestamp(),
                            uid: firebaseUser.uid
                        });
                        console.log("AuthContext: Saved new profile");
                    }

                    setCurrentUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        displayName,
                    });
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                    // Fallback to basic auth user if Firestore fails
                    setCurrentUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                    });
                }
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
