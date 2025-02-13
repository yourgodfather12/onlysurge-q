import OpenAI from 'openai';
import { toast } from 'react-hot-toast';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  console.warn('OpenAI API key is missing. AI features will be mocked.');
}

const openai = new OpenAI({
  apiKey: apiKey || 'dummy-key',
  dangerouslyAllowBrowser: true
});

// Mock responses when API key is missing
const mockResponses = {
  caption: "Check out my latest content! 🔥 #trending #viral",
  hashtags: ["trending", "viral", "content", "creator"],
  bestTime: new Date().toISOString(),
  engagementScore: 85
};

function handleOpenAIError(error: any, fallback: any) {
  console.error('OpenAI API Error:', error);
  
  let errorMessage = 'An error occurred with AI processing';
  if (error.response?.status === 429) {
    errorMessage = 'Rate limit exceeded. Please try again later.';
  } else if (error.response?.status === 401) {
    errorMessage = 'API key is invalid or expired';
  }
  
  toast.error(errorMessage);
  return fallback;
}

export async function generateCaption(description: string): Promise<string> {
  if (!apiKey) return mockResponses.caption;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert content creator assistant. Generate engaging, professional captions that drive engagement while maintaining appropriate content guidelines."
        },
        {
          role: "user",
          content: `Generate a caption for this content: ${description}`
        }
      ],
      max_tokens: 100
    });

    return response.choices[0].message.content || mockResponses.caption;
  } catch (error) {
    return handleOpenAIError(error, mockResponses.caption);
  }
}

export async function analyzeContent(description: string): Promise<{
  hashtags: string[];
  bestTime: string;
  engagementScore: number;
}> {
  if (!apiKey) return mockResponses;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an AI content analyzer for OnlyFans. Analyze content and provide hashtags, best posting time, and predicted engagement score."
        },
        {
          role: "user",
          content: `Analyze this content and provide JSON response with hashtags, bestTime (ISO string), and engagementScore (0-100): ${description}`
        }
      ]
    });

    try {
      const analysis = JSON.parse(response.choices[0].message.content || '{}');
      return {
        hashtags: analysis.hashtags || mockResponses.hashtags,
        bestTime: analysis.bestTime || mockResponses.bestTime,
        engagementScore: analysis.engagementScore || mockResponses.engagementScore
      };
    } catch (error) {
      return handleOpenAIError(error, mockResponses);
    }
  } catch (error) {
    return handleOpenAIError(error, mockResponses);
  }
}

export async function generateProfileSuggestions(profile: {
  bio?: string;
  niche?: string;
  goals?: string;
}): Promise<{
  bio: string;
  displayName: string;
  bannerDescription: string;
  profilePicSuggestions: string[];
}> {
  if (!apiKey) {
    return {
      bio: "Creative content creator passionate about sharing unique experiences.",
      displayName: "Creator",
      bannerDescription: "Subscribe for exclusive content",
      profilePicSuggestions: []
    };
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an AI profile optimization expert for OnlyFans creators. Generate engaging and professional profile suggestions."
        },
        {
          role: "user",
          content: `Generate profile suggestions for a creator with these details: ${JSON.stringify(profile)}`
        }
      ]
    });

    try {
      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      return handleOpenAIError(error, {
        bio: "Creative content creator passionate about sharing unique experiences.",
        displayName: "Creator",
        bannerDescription: "Subscribe for exclusive content",
        profilePicSuggestions: []
      });
    }
  } catch (error) {
    return handleOpenAIError(error, {
      bio: "Creative content creator passionate about sharing unique experiences.",
      displayName: "Creator",
      bannerDescription: "Subscribe for exclusive content",
      profilePicSuggestions: []
    });
  }
}

export async function generateMessageResponse(
  message: string,
  context: {
    previousMessages?: string[];
    subscriberInfo?: {
      subscriptionLength: number;
      spendingLevel: string;
      interests?: string[];
    };
  }
): Promise<string> {
  if (!apiKey) {
    return "Thank you for your message! I'll get back to you soon. 😊";
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an AI message assistant for OnlyFans creators. Generate personalized, engaging responses that maintain professionalism and encourage subscriber retention."
        },
        {
          role: "user",
          content: `Generate a response to this message with the following context: ${JSON.stringify({
            message,
            context
          })}`
        }
      ]
    });

    return response.choices[0].message.content || "Thank you for your message! I'll get back to you soon. 😊";
  } catch (error) {
    return handleOpenAIError(error, "Thank you for your message! I'll get back to you soon. 😊");
  }
}