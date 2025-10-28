# Chatbot Setup Guide

## Getting Your OpenAI API Key

### Step 1: Create OpenAI Account
1. Go to [https://platform.openai.com/signup](https://platform.openai.com/signup)
2. Sign up with your email or Google account
3. Verify your email address

### Step 2: Add Payment Method
1. Go to [https://platform.openai.com/account/billing](https://platform.openai.com/account/billing)
2. Click "Add payment method"
3. Add a credit/debit card
4. Add at least $5-10 in credits

**Note:** OpenAI requires payment info even for API usage. GPT-3.5-turbo is very cheap (~$0.002 per 1000 tokens).

### Step 3: Get API Key
1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Click "Create new secret key"
3. Give it a name (e.g., "College Guide Chatbot")
4. Copy the API key (starts with `sk-...`)
5. **Important:** Save it immediately - you won't see it again!

### Step 4: Add to Backend

#### For Local Development:
1. Open `backend/.env`
2. Replace `your-openai-api-key-here` with your actual API key:
   ```
   OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
   ```

#### For Render Deployment:
1. Go to your backend service on Render dashboard
2. Click "Environment" tab
3. Add new environment variable:
   - **Key:** `OPENAI_API_KEY`
   - **Value:** `sk-proj-xxxxxxxxxxxxxxxxxxxxx` (your API key)
4. Click "Save Changes"
5. Render will automatically redeploy

### Step 5: Test the Chatbot

1. Open your frontend
2. Click the chat icon in the bottom-right corner
3. Type a message like "What courses are available?"
4. The chatbot should respond!

## Chatbot Features

✅ **College-specific assistant** - Helps with academic questions
✅ **Conversation history** - Remembers context within the chat session
✅ **Beautiful UI** - Floating chat widget with smooth animations
✅ **Error handling** - Gracefully handles API errors

## Cost Estimation

- **GPT-3.5-turbo pricing:** ~$0.002 per 1000 tokens
- **Average chat message:** ~50-200 tokens
- **Example:** 1000 messages ≈ $0.20-0.40

Very affordable for a college project!

## Troubleshooting

### "Invalid API key" error
- Check that your API key starts with `sk-`
- Make sure there are no extra spaces
- Verify the key is active on OpenAI dashboard

### "Insufficient quota" error
- Add credits to your OpenAI account
- Check your usage at https://platform.openai.com/usage

### Chatbot not responding
- Check browser console for errors (F12)
- Verify backend is running
- Check that OPENAI_API_KEY is set in environment variables

## Alternative: Free Chatbot Options

If you don't want to use OpenAI (paid), you can modify the code to use free alternatives:

1. **Hugging Face API** (free tier available)
2. **Cohere API** (free tier available)
3. **Local LLM** (Ollama)

Let me know if you need help implementing any of these!
