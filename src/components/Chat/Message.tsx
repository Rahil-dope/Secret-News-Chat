import React, { useState, useRef } from 'react';
import type { Message as MessageType } from '../../types';
import { formatTimestamp } from '../../utils/date';

interface MessageProps {
    message: MessageType;
    isMe: boolean;
    onHide: () => void;
}

const Message: React.FC<MessageProps> = ({ message, isMe, onHide }) => {
    const [showMenu, setShowMenu] = useState(false);
    const timeoutRef = useRef<number | null>(null);

    const handleTouchStart = () => {
        const timer = window.setTimeout(() => {
            setShowMenu(true);
        }, 500); // 500ms long press
        timeoutRef.current = timer;
    };

    const handleTouchEnd = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowMenu(true);
    };

    const handleHideClick = () => {
        onHide();
        setShowMenu(false);
    };

    return (
        <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
            <div className="relative max-w-[70%]">
                <div
                    className={`rounded-lg px-4 py-2 ${isMe
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-700 text-gray-200 rounded-bl-none'
                        }`}
                    onContextMenu={handleContextMenu}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    <div className={`text-xs mb-1 font-bold ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                        {message.senderName || 'Anonymous'}
                    </div>
                    <p className="text-sm break-words">{message.text}</p>
                    <p
                        className={`text-xs mt-1 ${isMe ? 'text-blue-100' : 'text-gray-400'
                            }`}
                    >
                        {formatTimestamp(message.timestamp)}
                    </p>
                </div>

                {/* Context Menu */}
                {showMenu && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowMenu(false)}
                        />
                        <div className="absolute top-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-20 overflow-hidden">
                            <button
                                onClick={handleHideClick}
                                className="block w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-700 transition whitespace-nowrap"
                            >
                                Hide for me
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Message;
