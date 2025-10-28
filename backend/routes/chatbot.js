const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// @route   POST /api/chatbot/message
// @desc    Send message to ChatGPT
// @access  Public
router.post('/message', async (req, res) => {
    try {
        const { message, conversationHistory } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        if (!process.env.OPENAI_API_KEY) {
            return res.status(500).json({ error: 'OpenAI API key not configured' });
        }

        // Prepare messages for ChatGPT
        const messages = [
            {
                role: 'system',
                content: 'You are a helpful college assistant chatbot for College Guide app. You help students with academic questions, course information, exam schedules, and general college-related queries. Be friendly, concise, and helpful.'
            },
            ...(conversationHistory || []),
            {
                role: 'user',
                content: message
            }
        ];

        // Call OpenAI API
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: messages,
            max_tokens: 500,
            temperature: 0.7
        });

        const reply = completion.choices[0].message.content;

        res.json({
            success: true,
            reply: reply,
            usage: completion.usage
        });

    } catch (error) {
        console.error('ChatGPT API Error:', error);
        
        if (error.code === 'insufficient_quota') {
            return res.status(402).json({ 
                error: 'OpenAI API quota exceeded. Please add credits to your OpenAI account.' 
            });
        }
        
        if (error.code === 'invalid_api_key') {
            return res.status(401).json({ 
                error: 'Invalid OpenAI API key' 
            });
        }

        res.status(500).json({ 
            error: 'Error communicating with ChatGPT',
            message: error.message 
        });
    }
});

module.exports = router;
