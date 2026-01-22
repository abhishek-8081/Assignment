/*
 * useWebSocket Hook
 * Custom hook for managing Socket.IO connection to the backend.
 * Handles weather and AI response events.
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:3001';

export function useWebSocket() {
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);

    // Weather state
    const [weather, setWeather] = useState(null);
    const [weatherLoading, setWeatherLoading] = useState(false);
    const [weatherError, setWeatherError] = useState(null);

    // AI response state
    const [aiResponse, setAiResponse] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState(null);

    // Initialize socket connection
    useEffect(() => {
        socketRef.current = io(SOCKET_SERVER_URL);

        socketRef.current.on('connect', () => {
            console.log('Connected to server');
            setIsConnected(true);
        });

        socketRef.current.on('disconnect', () => {
            console.log('Disconnected from server');
            setIsConnected(false);
        });

        socketRef.current.on('weather-response', (response) => {
            console.log('Weather response received');
            setWeatherLoading(false);

            if (response.success) {
                setWeather(response.data);
                setWeatherError(null);
            } else {
                setWeatherError(response.error);
            }
        });

        socketRef.current.on('ai-response', (response) => {
            console.log('AI response received');
            setAiLoading(false);

            if (response.success) {
                setAiResponse(response.data);
                setAiError(null);
            } else {
                setAiError(response.error);
            }
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    const getWeather = useCallback((latitude, longitude) => {
        if (socketRef.current && isConnected) {
            setWeatherLoading(true);
            setWeatherError(null);
            socketRef.current.emit('get-weather', { latitude, longitude });
        }
    }, [isConnected]);

    const getAiResponse = useCallback((voiceText, weatherData) => {
        if (socketRef.current && isConnected) {
            setAiLoading(true);
            setAiError(null);
            socketRef.current.emit('get-ai-response', {
                voiceText,
                weather: weatherData
            });
        }
    }, [isConnected]);

    return {
        isConnected,
        weather,
        weatherLoading,
        weatherError,
        aiResponse,
        aiLoading,
        aiError,
        getWeather,
        getAiResponse
    };
}
