/**
 * ChatMessage Component
 * =====================
 * Displays a single chat message bubble.
 * User messages appear on the right, AI messages on the left.
 */

import React from 'react';
import './ChatMessage.css';

export function ChatMessage({ message }) {
    const { type, content, timestamp } = message;

    const isUser = type === 'user';

    return (
        <div className={`chat-message ${isUser ? 'user' : 'ai'}`}>
            <div className="message-avatar">
                {isUser ? 'You' : 'AI'}
            </div>
            <div className="message-content">
                <div className="message-bubble">
                    {content}
                </div>
                <div className="message-time">
                    {timestamp}
                </div>
            </div>
        </div>
    );
}
