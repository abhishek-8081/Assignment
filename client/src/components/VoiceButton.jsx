/**
 * VoiceButton Component
 * =====================
 * Button for starting/stopping Japanese voice recognition.
 * Shows visual feedback when listening.
 */

import React from 'react';
import './VoiceButton.css';

export function VoiceButton({ isListening, onClick, disabled }) {
    return (
        <button
            className={`voice-button ${isListening ? 'listening' : ''}`}
            onClick={onClick}
            disabled={disabled}
        >
            {isListening ? (
                <>Listening...</>
            ) : (
                <>Speak in Japanese</>
            )}
        </button>
    );
}
