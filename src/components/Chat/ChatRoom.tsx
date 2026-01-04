import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../contexts/useAuth';
import { chatService } from '../../services/chat.service';
import type { Message as MessageType } from '../../types';
import Message from './Message';

const ChatRoom: React.FC = () => {
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const { currentUser } = useAuth();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (!currentUser) return;

        // Subscribe to real-time messages
        const unsubscribe = chatService.subscribeToMessages(currentUser.uid, (newMessages) => {
            setMessages(newMessages);
            setTimeout(scrollToBottom, 100);
        });

        return () => unsubscribe();
    }, [currentUser]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newMessage.trim() || !currentUser || sending) return;

        setSending(true);
        try {
            console.log("ChatRoom: Sending message as", currentUser.displayName);
            await chatService.sendMessage(newMessage.trim(), currentUser.uid, currentUser.displayName);
            setNewMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setSending(false);
        }
    };

    const handleHideMessage = async (messageId: string) => {
        if (!currentUser) return;

        try {
            await chatService.hideMessageForMe(messageId, currentUser.uid);
        } catch (error) {
            console.error('Failed to hide message:', error);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-900">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 text-center">No messages yet.<br />Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <Message
                            key={message.id}
                            message={message}
                            isMe={message.senderUID === currentUser?.uid}
                            onHide={() => handleHideMessage(message.id)}
                        />
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-gray-800 border-t border-gray-700 p-4">
                <form onSubmit={handleSend} className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-white placeholder-gray-400"
                        disabled={sending}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {sending ? (
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                />
                            </svg>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatRoom;
