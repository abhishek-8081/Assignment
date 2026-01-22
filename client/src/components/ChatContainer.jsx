/**
 * ChatContainer Component
 * =======================
 * Contains the chat history and auto-scrolls to newest messages.
 */

import React, { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import './ChatContainer.css';

export function ChatContainer({ messages, isLoading }) {
    const containerRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="chat-container" ref={containerRef}>
            {messages.length === 0 && (
                <div className="chat-empty">
                    <div className="chat-empty-icon">Chat</div>
                    <p>Start speaking in Japanese to begin the conversation</p>
                </div>
            )}

            {messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
            ))}

            {isLoading && (
                <div className="chat-message ai">
                    <div className="message-avatar">AI</div>
                    <div className="message-content">
                        <div className="message-bubble typing">
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
