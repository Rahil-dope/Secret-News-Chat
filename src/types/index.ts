import type { Timestamp } from 'firebase/firestore';

export interface User {
    uid: string;
    email: string | null;
    displayName?: string;
}

export interface Message {
    id: string;
    text: string;
    senderUID: string;
    senderName?: string;
    timestamp: Timestamp | null; // Firebase Timestamp
    hiddenFor: string[];
}

export interface NewsArticle {
    id: string;
    title: string;
    description: string;
    category: string;
    timestamp: string;
    imageUrl?: string;
}

export interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}
