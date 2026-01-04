import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    type User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '../config/firebase';

export const authService = {
    // Sign up with email and password
    async signup(email: string, password: string): Promise<FirebaseUser> {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    },

    // Login with email and password
    async login(email: string, password: string): Promise<FirebaseUser> {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    },

    // Logout
    async logout(): Promise<void> {
        await signOut(auth);
    },

    // Get current user
    getCurrentUser(): FirebaseUser | null {
        return auth.currentUser;
    },
};
