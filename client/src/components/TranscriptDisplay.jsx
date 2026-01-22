/**
 * TranscriptDisplay Component
 * ===========================
 * Displays the recognized voice text from speech recognition.
 */

import React from 'react';
import './TranscriptDisplay.css';

export function TranscriptDisplay({ transcript, isListening, error }) {
    return (
        <div className="section">
            <div className="section-title">📝 認識されたテキスト (Recognized Text)</div>
            <div className="section-content">
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {!error && isListening && !transcript && (
                    <div className="listening-state">
                        聞いています... (Listening...)
                    </div>
                )}

                {!error && transcript && (
                    <div className="transcript">
                        {transcript}
                    </div>
                )}

                {!error && !isListening && !transcript && (
                    <div className="placeholder">
                        ボタンをクリックして日本語で話してください。
                        <br />(Click the button and speak in Japanese)
                    </div>
                )}
            </div>
        </div>
    );
}
