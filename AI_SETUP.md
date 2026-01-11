# 🤖 AI Integration & Setup Guide

Novav3 uses a hybrid AI architecture to provide the best generation quality and speed.

## 🔑 Required API Keys

To use all features, you need to configure the following environment variables in your `.env` file:

```env
# 1. Kie.ai (Primary Generation Engine)
# Get from: https://kie.ai
VITE_KIE_KEY=your_kie_key_here

# 2. OpenAI (Smart Prompt Enhancement)
# Get from: https://platform.openai.com
VITE_OPENAI_API_KEY=your_openai_key_here
```

## 🚀 Setup Steps

1. **Create `.env` file**: Copy `.env.example` or create a new one in the root directory.
2. **Add Your Keys**: Paste your keys from the providers above.
3. **Restart Server**:
   ```bash
   npm run dev
   ```

## 🎯 How to Generate

### ✨ Smart Prompt (OpenAI)
- Add a **Text Node** and enter a simple idea (e.g., "A neon car").
- Connect it to a **Master Prompt (Помощник)** node.
- Click **"Improve with AI"**. The AI will expand your prompt for better results.

### 🖼️ HQ Images (Kie.ai - Flux Pro)
- Connect a **Text Node** to an **Image Node**.
- Select **"Flux Pro"** or **"GPT Image"** in settings.
- Click **"Generate Image"**.

### 🎥 Pro Video (Kie.ai - Sora 2 / Kling 2.6)
- **Text-to-Video**: Connect **Text Node** → **Video Node**.
- **Image-to-Video**: Connect **Image Node** (with result) → **Video Node**.
- Select **"Sora 2"** or **"Kling 2.6"** for cinematic results.

## 🔐 Security Note
- Your keys are stored locally in `.env` and are never committed to Git.
- In the browser, keys are cached in `localStorage` for convenience but remain on your device.

## 📊 Recommendations
- **Kie.ai**: Best for high-end cinematic video and character consistency.
- **OpenAI**: Essential for complex, multi-layered visual prompts.

