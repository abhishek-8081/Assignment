/**
 * TravelBuddy - トラベルバディ
 * Professional Japanese Voice Travel Assistant
 * Split Layout: Info Panel (Left) + Chat Interface (Right)
 */

import { useEffect, useRef, useState } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import { useVoiceRecognition } from './hooks/useVoiceRecognition';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);

  const {
    isConnected,
    weather,
    aiResponse,
    aiLoading,
    getWeather,
    getAiResponse
  } = useWebSocket();

  const {
    isSupported: voiceSupported,
    isListening,
    transcript,
    error: voiceError,
    startListening,
    stopListening,
    clearTranscript
  } = useVoiceRecognition();

  const weatherFetched = useRef(false);
  const lastTranscript = useRef('');
  const chatRef = useRef(null);

  const getTime = () => {
    return new Date().toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, aiLoading]);

  useEffect(() => {
    if (isConnected && !weatherFetched.current) {
      weatherFetched.current = true;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => getWeather(position.coords.latitude, position.coords.longitude),
          () => getWeather(35.6762, 139.6503),
          { timeout: 10000 }
        );
      } else {
        getWeather(35.6762, 139.6503);
      }
    }
  }, [isConnected, getWeather]);

  useEffect(() => {
    if (!isListening && transcript && transcript.trim() !== '' && transcript !== lastTranscript.current) {
      lastTranscript.current = transcript;
      setMessages(prev => [...prev, {
        type: 'user',
        content: transcript,
        timestamp: getTime()
      }]);
      clearTranscript();
      getAiResponse(transcript, weather);
    }
  }, [isListening, transcript, weather, getAiResponse, clearTranscript]);

  useEffect(() => {
    if (aiResponse) {
      setMessages(prev => [...prev, {
        type: 'ai',
        content: aiResponse,
        timestamp: getTime()
      }]);
    }
  }, [aiResponse]);

  const handleVoiceClick = () => {
    isListening ? stopListening() : startListening();
  };

  return (
    <div className="app">
      {/* Left Panel - Info & Specifications */}
      <aside className="info-panel">
        <div className="brand">
          <div className="brand-logo"><img src="/logo.png" alt="TravelBuddy" /></div>
          <h1 className="brand-name">TravelBuddy</h1>
          <p className="brand-tagline">トラベルバディ</p>
        </div>

        <div className="info-section">
          <h3>About</h3>
          <p>
            TravelBuddy is an AI-powered travel assistant that helps you
            plan outings based on real-time weather conditions and your preferences.
          </p>
        </div>

        <div className="info-section">
          <h3>Features</h3>
          <ul className="feature-list">
            <li>
              <span className="feature-icon">Voice</span>
              Japanese Voice Recognition
            </li>
            <li>
              <span className="feature-icon">API</span>
              Real-time Weather Data
            </li>
            <li>
              <span className="feature-icon">AI</span>
              GPT-powered Suggestions
            </li>
            <li>
              <span className="feature-icon">WS</span>
              WebSocket Communication
            </li>
          </ul>
        </div>

        <div className="info-section">
          <h3>Technology Stack</h3>
          <div className="tech-stack">
            <span className="tech-badge">React</span>
            <span className="tech-badge">Node.js</span>
            <span className="tech-badge">Socket.IO</span>
            <span className="tech-badge">OpenAI</span>
            <span className="tech-badge">Web Speech API</span>
          </div>
        </div>

        <div className="info-section">
          <h3>How to Use</h3>
          <ol className="steps-list">
            <li>Click the voice button</li>
            <li>Speak in Japanese</li>
            <li>Get AI travel suggestions</li>
          </ol>
        </div>

        <footer className="info-footer">
          <p>Developed by Abhishek Kumar</p>
        </footer>
      </aside>

      {/* Right Panel - Chat Interface */}
      <main className="chat-panel">
        {/* Header */}
        <header className="chat-header">
          <div className="header-left">
            <h2>TravelBuddy Assistant</h2>
            <span className={`status ${isConnected ? 'online' : 'offline'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          {weather && (
            <div className="weather-info">
              <span className="weather-temp">{weather.temperature}°C</span>
              <span className="weather-location">{weather.location}</span>
              <span className="weather-condition">{weather.condition}</span>
            </div>
          )}
        </header>

        {/* Chat Messages */}
        <div className="chat-messages" ref={chatRef}>
          {messages.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon"><img src="/logo.png" alt="TravelBuddy" /></div>
              <h3>Welcome to TravelBuddy</h3>
              <p>Start speaking in Japanese to get personalized travel and outing suggestions based on the current weather.</p>
              <div className="example-queries">
                <span>Try asking:</span>
                <code>今日はどこに行けばいい？</code>
                <code>天気がいいからピクニックしたい</code>
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.type}`}>
              <div className="message-avatar">
                {msg.type === 'user' ? 'You' : 'AI'}
              </div>
              <div className="message-content">
                <div className="message-text">{msg.content}</div>
                <div className="message-time">{msg.timestamp}</div>
              </div>
            </div>
          ))}

          {aiLoading && (
            <div className="message ai">
              <div className="message-avatar">AI</div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="input-area">
          {voiceError && <div className="error-message">{voiceError}</div>}

          {isListening && (
            <div className="listening-indicator">
              <div className="sound-wave">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
              <span>Listening...</span>
            </div>
          )}

          <button
            className={`voice-button ${isListening ? 'active' : ''}`}
            onClick={handleVoiceClick}
            disabled={!voiceSupported || !isConnected}
          >
            {isListening ? 'Stop Recording' : 'Start Voice Input'}
          </button>
          <p className="input-hint">Click to speak in Japanese (日本語で話してください)</p>
        </div>
      </main>
    </div>
  );
}

export default App;
