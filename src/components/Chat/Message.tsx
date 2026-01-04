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
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                        }`}
                    onContextMenu={handleContextMenu}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    <p className="text-sm break-words">{message.text}</p>
                    <p
                        className={`text-xs mt-1 ${isMe ? 'text-blue-100' : 'text-gray-500'
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
                        <div className="absolute top-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-20 overflow-hidden">
                            <button
                                onClick={handleHideClick}
                                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition whitespace-nowrap"
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
