/*
 * WeatherDisplay Component
 * Shows current weather information including location, temperature, and condition.
 */

import React from 'react';
import './WeatherDisplay.css';

export function WeatherDisplay({ weather, loading, error }) {
    return (
        <div className="section">
            <div className="section-title">Current Weather</div>
            <div className="section-content">
                {loading && (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <span>Fetching weather...</span>
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        Failed to fetch weather.
                        <br /><small>Error: {error}</small>
                    </div>
                )}

                {!loading && !error && weather && (
                    <div className="weather-info">
                        <div className="weather-item">
                            <div className="label">Location</div>
                            <div className="value">{weather.location}</div>
                        </div>
                        <div className="weather-item">
                            <div className="label">Temperature</div>
                            <div className="value">{weather.temperature}°C</div>
                        </div>
                        <div className="weather-item">
                            <div className="label">Condition</div>
                            <div className="value">{weather.condition}</div>
                        </div>
                    </div>
                )}

                {!loading && !error && !weather && (
                    <div className="placeholder">
                        Getting location...
                    </div>
                )}
            </div>
        </div>
    );
}
