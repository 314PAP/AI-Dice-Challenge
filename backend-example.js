/**
 * Backend API Server for Real AI Integration
 * Potřebujete nainstalovat: npm install express openai @anthropic-ai/sdk @google/generative-ai cors dotenv
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// AI SDK imports
const { OpenAI } = require('openai');
const { Anthropic } = require('@anthropic-ai/sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize AI clients
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);

// AI Response endpoint
app.post('/api/ai-response', async (req, res) => {
    try {
        const { aiType, prompt, maxTokens = 50 } = req.body;
        
        let response;
        
        switch (aiType) {
            case 'chatgpt':
                const openaiResponse = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: "Odpovídáš krátce, vtipně a přátelsky. Používáš emojis. Hrajete kostičkovou hru Farkle."
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    max_tokens: maxTokens,
                    temperature: 0.8
                });
                response = openaiResponse.choices[0].message.content.trim();
                break;
                
            case 'claude':
                const claudeResponse = await anthropic.messages.create({
                    model: "claude-3-haiku-20240307",
                    max_tokens: maxTokens,
                    messages: [
                        {
                            role: "user",
                            content: `${prompt}\n\nOdpovídej jako Claude AI - moudrě, uvážlivě, strategicky. Krátce (max 50 znaků).`
                        }
                    ]
                });
                response = claudeResponse.content[0].text.trim();
                break;
                
            case 'gemini':
                const model = genAI.getGenerativeModel({ model: "gemini-pro" });
                const geminiResult = await model.generateContent(`${prompt}\n\nOdpovídej jako Gemini AI - analyticky, fakticky, založeně na datech. Krátce (max 50 znaků).`);
                const geminiResponse = await geminiResult.response;
                response = geminiResponse.text().trim();
                break;
                
            default:
                throw new Error(`Unsupported AI type: ${aiType}`);
        }
        
        res.json({ response });
        
    } catch (error) {
        console.error('AI API Error:', error);
        res.status(500).json({ 
            error: 'AI API call failed',
            fallback: getFallbackResponse(req.body.aiType)
        });
    }
});

// Fallback responses when AI fails
function getFallbackResponse(aiType) {
    const fallbacks = {
        chatgpt: "Hmm, něco se pokazilo! 🤔",
        claude: "Zajímavá situace...",
        gemini: "Analyzuji data..."
    };
    return fallbacks[aiType] || "...";
}

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`🤖 AI Backend Server running on port ${PORT}`);
    console.log('Required environment variables:');
    console.log('- OPENAI_API_KEY');
    console.log('- ANTHROPIC_API_KEY'); 
    console.log('- GOOGLE_AI_KEY');
});

module.exports = app;
