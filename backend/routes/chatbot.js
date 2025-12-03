const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @route   POST /api/chatbot/message
// @desc    Send message to Gemini
// @access  Public
router.post('/message', async (req, res) => {
    try {
        const { message, conversationHistory } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: 'Gemini API key not configured' });
        }

        // Get the model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Prepare history for Gemini
        // Gemini uses 'user' and 'model' roles
        const history = (conversationHistory || []).map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        // Start chat with history
        const chat = model.startChat({
            history: history,
            generationConfig: {
                maxOutputTokens: 500,
            },
        });

        // Send message
        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        res.json({
            success: true,
            reply: text,
        });

    } catch (error) {
        console.error('Gemini API Error:', error);
        
        res.status(500).json({ 
            error: 'Error communicating with Gemini',
            message: error.message
        });
    }
});

module.exports = router;
