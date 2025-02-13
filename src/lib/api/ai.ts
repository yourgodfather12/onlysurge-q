import { Configuration, OpenAIApi } from 'openai';
import { supabase } from '../supabase';
import { toast } from 'react-hot-toast';

const configuration = new Configuration({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

interface ContentAnalysis {
  caption: string;
  hashtags: string[];
  bestTime: string;
  engagementScore: number;
  contentWarnings: string[];
  targetAudience: string[];
  suggestedPrice: number | null;
  seoOptimization: {
    title: string;
    description: string;
    keywords: string[];
  };
}

interface MessageResponse {
  content: string;
  tone: string;
  suggestedFollowUps: string[];
}

export async function analyzeContent(
  content: {
    title?: string;
    description?: string;
    mediaType: 'image' | 'video';
    mediaUrl?: string;
  },
  options?: {
    platform?: string;
    audiencePreferences?: any;
    previousPerformance?: any;
  }
): Promise<ContentAnalysis> {
  try {
    // Prepare prompt with content details and context
    const prompt = `Analyze this content for a creator platform:
      Title: ${content.title || 'N/A'}
      Description: ${content.description || 'N/A'}
      Media Type: ${content.mediaType}
      Platform: ${options?.platform || 'All platforms'}
      
      Previous performance context: ${JSON.stringify(options?.previousPerformance || {})}
      
      Provide analysis including:
      1. Engaging caption
      2. Relevant hashtags
      3. Best posting time
      4. Predicted engagement score
      5. Content warnings if any
      6. Target audience segments
      7. Suggested pricing
      8. SEO optimization suggestions`;

    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1000
    });

    const response = completion.data.choices[0].message?.content;
    if (!response) throw new Error('No response from AI');

    // Parse AI response into structured format
    const analysis = JSON.parse(response);

    // Store analysis in database
    await supabase.from('content_analysis').insert({
      content_id: content.title, // Use appropriate ID
      analysis,
      created_at: new Date().toISOString()
    });

    return analysis;
  } catch (error) {
    console.error('Content analysis error:', error);
    toast.error('Failed to analyze content');
    throw error;
  }
}

export async function generateMessageResponse(
  message: string,
  context: {
    subscriberHistory?: any;
    previousMessages?: string[];
    subscriberPreferences?: any;
  }
): Promise<MessageResponse> {
  try {
    const prompt = `Generate a response to this subscriber message:
      Message: ${message}
      
      Context:
      Subscriber History: ${JSON.stringify(context.subscriberHistory || {})}
      Previous Messages: ${JSON.stringify(context.previousMessages || [])}
      Preferences: ${JSON.stringify(context.subscriberPreferences || {})}
      
      Provide:
      1. Engaging response
      2. Appropriate tone
      3. Suggested follow-up messages`;

    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 500
    });

    const response = completion.data.choices[0].message?.content;
    if (!response) throw new Error('No response from AI');

    return JSON.parse(response);
  } catch (error) {
    console.error('Message generation error:', error);
    toast.error('Failed to generate message response');
    throw error;
  }
}

export async function optimizeProfile(
  profile: {
    bio?: string;
    niche?: string;
    goals?: string;
  },
  options?: {
    platform?: string;
    targetAudience?: any;
    competitorAnalysis?: any;
  }
): Promise<{
  optimizedBio: string;
  suggestedTags: string[];
  contentIdeas: string[];
  pricingRecommendations: {
    subscription: number;
    messages: number;
    customContent: number;
  };
}> {
  try {
    const prompt = `Optimize this creator profile:
      Current Bio: ${profile.bio || 'N/A'}
      Niche: ${profile.niche || 'N/A'}
      Goals: ${profile.goals || 'N/A'}
      
      Platform: ${options?.platform || 'All platforms'}
      Target Audience: ${JSON.stringify(options?.targetAudience || {})}
      Competitor Analysis: ${JSON.stringify(options?.competitorAnalysis || {})}
      
      Provide:
      1. Optimized bio
      2. Relevant tags/keywords
      3. Content ideas
      4. Pricing recommendations`;

    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1000
    });

    const response = completion.data.choices[0].message?.content;
    if (!response) throw new Error('No response from AI');

    return JSON.parse(response);
  } catch (error) {
    console.error('Profile optimization error:', error);
    toast.error('Failed to optimize profile');
    throw error;
  }
}

export async function generateContentIdeas(
  profile: {
    niche?: string;
    recentContent?: any[];
    topPerforming?: any[];
  },
  options?: {
    count?: number;
    platform?: string;
    contentType?: 'image' | 'video' | 'all';
  }
): Promise<{
  ideas: Array<{
    title: string;
    description: string;
    type: 'image' | 'video';
    estimatedEngagement: number;
    suggestedTiming: string;
    requiredResources: string[];
  }>;
}> {
  try {
    const prompt = `Generate content ideas for this creator:
      Niche: ${profile.niche || 'N/A'}
      Recent Content: ${JSON.stringify(profile.recentContent || [])}
      Top Performing: ${JSON.stringify(profile.topPerforming || [])}
      
      Platform: ${options?.platform || 'All platforms'}
      Content Type: ${options?.contentType || 'all'}
      Number of Ideas: ${options?.count || 5}
      
      For each idea provide:
      1. Title and description
      2. Content type
      3. Estimated engagement
      4. Best timing
      5. Required resources`;

    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.9,
      max_tokens: 1000
    });

    const response = completion.data.choices[0].message?.content;
    if (!response) throw new Error('No response from AI');

    return JSON.parse(response);
  } catch (error) {
    console.error('Content ideas generation error:', error);
    toast.error('Failed to generate content ideas');
    throw error;
  }
}