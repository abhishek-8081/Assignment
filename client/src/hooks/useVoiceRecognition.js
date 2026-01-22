/*
 * useVoiceRecognition Hook
 * Custom hook for Japanese voice recognition using Web Speech API.
 */

import { useState, useCallback, useRef } from 'react';

export function useVoiceRecognition() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState(null);
    const recognitionRef = useRef(null);

    // Check browser support
    const isSupported = typeof window !== 'undefined' &&
        (window.SpeechRecognition || window.webkitSpeechRecognition);

    const startListening = useCallback(() => {
        if (!isSupported) {
            setError('Voice recognition not supported. Please use Chrome.');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        // Configure for Japanese language
        recognition.lang = 'ja-JP';
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            console.log('Voice recognition started');
            setIsListening(true);
            setError(null);
            setTranscript('');
        };

        recognition.onresult = (event) => {
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    finalTranscript += result[0].transcript;
                } else {
                    setTranscript(result[0].transcript);
                }
            }

            if (finalTranscript) {
                setTranscript(finalTranscript);
                console.log('Transcript:', finalTranscript);
            }
        };

        recognition.onend = () => {
            console.log('Voice recognition ended');
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);

            switch (event.error) {
                case 'no-speech':
                    setError('No speech detected. Please try again.');
                    break;
                case 'audio-capture':
                    setError('No microphone found.');
                    break;
                case 'not-allowed':
                    setError('Microphone permission denied.');
                    break;
                default:
                    setError(`Error: ${event.error}`);
            }
        };

        recognition.start();
    }, [isSupported]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    }, []);

    const clearTranscript = useCallback(() => {
        setTranscript('');
    }, []);

    return {
        isSupported,
        isListening,
        transcript,
        error,
        startListening,
        stopListening,
        clearTranscript
    };
}
