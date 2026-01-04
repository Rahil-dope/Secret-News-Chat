import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
    doc,
    updateDoc,
    arrayUnion,
    getDoc,
    type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Message } from '../types';

export const chatService = {
    // Send a new message
    async sendMessage(text: string, senderUID: string, senderName?: string): Promise<void> {
        await addDoc(collection(db, 'messages'), {
            text,
            senderUID,
            senderName: senderName || 'Anonymous',
            timestamp: serverTimestamp(),
            hiddenFor: [],
        });
    },

    // Listen to messages in real-time
    subscribeToMessages(
        currentUserUID: string,
        callback: (messages: Message[]) => void
    ): Unsubscribe {
        const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));

        return onSnapshot(q, (snapshot) => {
            const messages: Message[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                // Filter out messages hidden for current user
                if (!data.hiddenFor?.includes(currentUserUID)) {
                    messages.push({
                        id: doc.id,
                        text: data.text,
                        senderUID: data.senderUID,
                        senderName: data.senderName,
                        timestamp: data.timestamp,
                        hiddenFor: data.hiddenFor || [],
                    });
                }
            });
            callback(messages);
        });
    },

    // Hide message for current user
    async hideMessageForMe(messageId: string, userUID: string): Promise<void> {
        const messageRef = doc(db, 'messages', messageId);
        await updateDoc(messageRef, {
            hiddenFor: arrayUnion(userUID),
        });
    },

    // Check if user is in allowed list
    async isUserAllowed(userUID: string): Promise<boolean> {
        try {
            const configRef = doc(db, 'config', 'allowedUsers');
            const configSnap = await getDoc(configRef);

            if (configSnap.exists()) {
                const uids = configSnap.data().uids || [];
                return uids.includes(userUID);
            }

            // If config doesn't exist, allow all authenticated users for development
            return true;
        } catch (error) {
            console.error('Error checking allowed users:', error);
            // Default to allowing authenticated users if check fails
            return true;
        }
    },
};
