import OpenAI from 'openai';
import type { WellnessTip, UserProfile } from '../context/AppContext';

// Initialize OpenRouter client (OpenAI-compatible)
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': window.location.origin, // Optional, for including your app on openrouter.ai rankings
    'X-Title': 'Wellness Board', // Optional, shows in rankings on openrouter.ai
  },
  dangerouslyAllowBrowser: true, // Required for frontend usage
});

const AI_MODEL = import.meta.env.VITE_AI_MODEL || 'deepseek/deepseek-chat-v3.1';
const DEFAULT_TIP_COUNT = parseInt(import.meta.env.VITE_DEFAULT_TIP_COUNT || '5');

// Helper function to clean AI response and extract JSON
function cleanJsonResponse(content: string): string {
  // Remove markdown code blocks if present
  let cleanedContent = content
    .replace(/```json\s*/g, '')
    .replace(/```\s*/g, '')
    .trim();
  
  // Remove control characters that can break JSON parsing
  // This includes characters like \u0000-\u001F (control characters)
  cleanedContent = cleanedContent.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
  
  // Also clean up any problematic escaped characters in strings
  cleanedContent = cleanedContent.replace(/\\[\u0000-\u001F]/g, '');
  
  return cleanedContent;
}

export class AIService {
  static async generateWellnessTips(profile: UserProfile): Promise<WellnessTip[]> {
    try {
      const prompt = `Generate ${DEFAULT_TIP_COUNT} personalized wellness tips for a ${profile.age}-year-old ${profile.gender} with the wellness goal: "${profile.wellnessGoal}".

For each tip, provide:
1. A short, catchy title (max 6 words)
2. A brief description (max 20 words)
3. An appropriate category (fitness, nutrition, mental-health, sleep, mindfulness, or lifestyle)
4. An emoji icon that represents the tip

Return the response as a JSON array with this exact structure:
[
  {
    "title": "Morning Stretch Routine",
    "shortDescription": "Start your day with gentle stretches to boost energy and flexibility",
    "category": "fitness",
    "icon": "🧘‍♀️"
  }
]

Make sure the tips are practical, actionable, and tailored to the user's age, gender, and wellness goal.`;

      const response = await openai.chat.completions.create({
        model: AI_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a professional wellness coach. Provide personalized, evidence-based wellness advice. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from AI service');
      }

      // Clean and parse the JSON response
      const cleanedContent = cleanJsonResponse(content);
      const tipsData = JSON.parse(cleanedContent);
      
      // Transform to WellnessTip format
      const tips: WellnessTip[] = tipsData.map((tip: any, index: number) => ({
        id: `tip-${Date.now()}-${index}`,
        title: tip.title,
        shortDescription: tip.shortDescription,
        icon: tip.icon,
        category: tip.category,
        isFavorite: false,
      }));

      return tips;
    } catch (error) {
      console.error('Error generating wellness tips:', error);
      throw new Error('Failed to generate wellness tips. Please check your API key and try again.');
    }
  }

  static async generateDetailedExplanation(tip: WellnessTip, profile: UserProfile): Promise<{
    detailedExplanation: string;
    stepByStepAdvice: string[];
  }> {
    try {
      const prompt = `Provide a detailed explanation and step-by-step advice for this wellness tip:

Title: ${tip.title}
Description: ${tip.shortDescription}
Category: ${tip.category}

User Profile:
- Age: ${profile.age}
- Gender: ${profile.gender}
- Wellness Goal: ${profile.wellnessGoal}

Please provide:
1. A detailed explanation (2-3 paragraphs) about why this tip is beneficial and how it relates to their wellness goal
2. 5-7 specific, actionable steps they can follow to implement this tip

Return the response as JSON with this exact structure:
{
  "detailedExplanation": "Detailed explanation here...",
  "stepByStepAdvice": [
    "Step 1: Do this...",
    "Step 2: Then do this...",
    "Step 3: Continue with..."
  ]
}`;

      const response = await openai.chat.completions.create({
        model: AI_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a professional wellness coach. Provide detailed, personalized advice based on scientific evidence. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.6,
        max_tokens: 1000,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from AI service');
      }

      const cleanedContent = cleanJsonResponse(content);
      
      // Add additional validation and error handling for JSON parsing
      let result;
      try {
        result = JSON.parse(cleanedContent);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Cleaned content:', cleanedContent);
        
        // Try to extract JSON from the content if it's embedded in other text
        const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            result = JSON.parse(jsonMatch[0]);
          } catch (secondParseError) {
            console.error('Second JSON Parse Error:', secondParseError);
            throw new Error('Invalid JSON response from AI service');
          }
        } else {
          throw new Error('No valid JSON found in AI response');
        }
      }
      
      // Validate the result structure
      if (!result.detailedExplanation || !result.stepByStepAdvice) {
        throw new Error('Invalid response structure from AI service');
      }
      
      return {
        detailedExplanation: result.detailedExplanation,
        stepByStepAdvice: Array.isArray(result.stepByStepAdvice) ? result.stepByStepAdvice : [],
      };
    } catch (error) {
      console.error('Error generating detailed explanation:', error);
      throw new Error('Failed to generate detailed explanation. Please try again.');
    }
  }
}