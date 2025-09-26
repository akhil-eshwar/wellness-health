# 🌟 Wellness Board

A modern, AI-powered wellness application built with React, TypeScript, Vite, and Tailwind CSS. Get personalized wellness tips based on your profile and save your favorites locally.

## ✨ Features

- **Personalized Profile Setup**: Input your age, gender, and wellness goals
- **AI-Generated Tips**: Get 5 personalized wellness tips using DeepSeek-V3.1 via OpenRouter
- **Detailed Explanations**: Tap any tip for detailed explanations and step-by-step advice
- **Favorites System**: Save your favorite tips with local storage persistence
- **Beautiful UI**: Modern, responsive design with Tailwind CSS
- **Smooth Navigation**: React Router for seamless screen transitions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenRouter API key (get one at [https://openrouter.ai/keys](https://openrouter.ai/keys))

### Installation

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your OpenRouter API key
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
VITE_AI_MODEL=deepseek/deepseek-v3
VITE_DEFAULT_TIP_COUNT=5
```

3. **Start the development server:**
```bash
npm run dev
```

4. **Build for production:**
```bash
npm run build
```

## 🔧 Configuration

The app uses OpenRouter to access the DeepSeek-V3.1 model. Make sure to:

1. Sign up at [OpenRouter](https://openrouter.ai)
2. Get your API key from [https://openrouter.ai/keys](https://openrouter.ai/keys)
3. Add the API key to your `.env` file

## 🚀 Deployment on Vercel

### Prerequisites for Deployment
1. Get an OpenRouter API key from [https://openrouter.ai/keys](https://openrouter.ai/keys)
2. Install Vercel CLI: `npm i -g vercel`
3. Have a Vercel account

### Deployment Steps

1. **Build the project locally to test:**
```bash
npm run build
```

2. **Deploy to Vercel:**
```bash
# Login to Vercel (if not already logged in)
vercel login

# Deploy the project
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N (for new deployment)
# - What's your project's name? wellness-board (or your preferred name)
# - In which directory is your code located? ./
```

3. **Set Environment Variables in Vercel:**

After deployment, you need to set the environment variables in your Vercel dashboard:

- Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
- Click on your project → Settings → Environment Variables
- Add these variables:

```
VITE_OPENROUTER_API_KEY = your_actual_openrouter_api_key
VITE_AI_MODEL = deepseek/deepseek-v3.1
VITE_DEFAULT_TIP_COUNT = 5
```

4. **Redeploy after setting environment variables:**
```bash
vercel --prod
```

### Important Security Notes
- The API key will be exposed in the frontend bundle since this is a client-side application
- Use OpenRouter's usage limits and monitoring to control costs
- Consider implementing rate limiting if needed
