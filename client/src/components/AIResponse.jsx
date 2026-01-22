/*
 * AIResponse Component
 * Displays AI-generated suggestions from voice input and weather.
 */

import React from 'react';
import './AIResponse.css';

export function AIResponse({ response, loading, error }) {
    return (
        <div className="section">
            <div className="section-title">AI Suggestion</div>
            <div className="section-content">
                {loading && (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <span>AI is thinking...</span>
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        Failed to get AI response.
                        <br /><small>Error: {error}</small>
                    </div>
                )}

                {!loading && !error && response && (
                    <div className="ai-response">
                        {response}
                    </div>
                )}

                {!loading && !error && !response && (
                    <div className="placeholder">
                        AI will suggest based on your voice input and weather
                    </div>
                )}
            </div>
        </div>
    );
}
