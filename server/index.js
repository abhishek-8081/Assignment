/*
 * TravelBuddy WebSocket Server
 * 
 * Backend server that handles:
 * - WebSocket connections via Socket.IO
 * - Weather data from OpenWeatherMap API
 * - AI responses from OpenAI ChatGPT
 */

require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const axios = require('axios');
const OpenAI = require('openai');

// Configuration
const PORT = process.env.PORT || 3001;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: OPENAI_API_KEY
});

// Create Express app and HTTP server
const app = express();
app.use(cors());
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'TravelBuddy Server is running',
        websocket: 'Connect via Socket.IO on this port'
    });
});

// WebSocket connection handler
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Handle weather requests
    socket.on('get-weather', async (data) => {
        console.log('Weather request received');

        try {
            const { latitude, longitude } = data;

            if (!latitude || !longitude) {
                throw new Error('Latitude and longitude are required');
            }

            if (!WEATHER_API_KEY) {
                throw new Error('Weather API key not configured');
            }

            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=ja&appid=${WEATHER_API_KEY}`;
            const response = await axios.get(url);
            const weatherData = response.data;

            const weather = {
                location: weatherData.name,
                temperature: Math.round(weatherData.main.temp),
                condition: weatherData.weather[0].description,
                conditionMain: weatherData.weather[0].main,
                humidity: weatherData.main.humidity,
                icon: weatherData.weather[0].icon
            };

            console.log('Weather data fetched:', weather.location);

            socket.emit('weather-response', {
                success: true,
                data: weather
            });

        } catch (error) {
            console.error('Weather error:', error.message);
            socket.emit('weather-response', {
                success: false,
                error: error.message
            });
        }
    });

    // Handle AI response requests
    socket.on('get-ai-response', async (data) => {
        console.log('AI request received');

        try {
            const { voiceText, weather } = data;

            if (!voiceText) {
                throw new Error('Voice text is required');
            }

            if (!OPENAI_API_KEY) {
                throw new Error('OpenAI API key not configured');
            }

            // System prompt for the AI (in Japanese for better responses)
            const systemPrompt = `You are a friendly Japanese travel assistant.
Based on the user's request and current weather, provide helpful travel suggestions.
Respond in Japanese, keeping it concise (2-3 sentences).`;

            const userMessage = `User said: ${voiceText}

Current weather:
Location: ${weather ? weather.location : 'Unknown'}
Temperature: ${weather ? weather.temperature + '°C' : 'Unknown'}
Condition: ${weather ? weather.condition : 'Unknown'}

Please provide a travel suggestion based on this.`;

            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userMessage }
                ],
                temperature: 0.7,
                max_tokens: 256
            });

            const aiResponse = completion.choices[0].message.content;
            console.log('AI response generated');

            socket.emit('ai-response', {
                success: true,
                data: aiResponse
            });

        } catch (error) {
            console.error('AI error:', error.message);
            socket.emit('ai-response', {
                success: false,
                error: error.message
            });
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Start the server
server.listen(PORT, () => {
    console.log('');
    console.log('='.repeat(45));
    console.log('TravelBuddy Server');
    console.log('='.repeat(45));
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('WebSocket ready for connections');
    console.log('');
    console.log('Environment Status:');
    console.log(`  Weather API Key: ${WEATHER_API_KEY ? 'Configured' : 'Missing'}`);
    console.log(`  OpenAI API Key: ${OPENAI_API_KEY ? 'Configured' : 'Missing'}`);
    console.log('');
});
