import { useQuery, useMutation } from 'react-query';
import { useAuth } from '../contexts/AuthContext';
import {
  analyzeContent,
  generateMessageResponse,
  optimizeProfile,
  generateContentIdeas
} from '../lib/api/ai';

export function useContentAnalysis() {
  const analyzeMutation = useMutation(
    ({ content, options }: Parameters<typeof analyzeContent>) =>
      analyzeContent(content, options)
  );

  return {
    analyzeContent: analyzeMutation.mutate,
    isAnalyzing: analyzeMutation.isLoading,
    analysis: analyzeMutation.data,
    error: analyzeMutation.error
  };
}

export function useMessageGeneration() {
  const generateMutation = useMutation(
    ({ message, context }: Parameters<typeof generateMessageResponse>) =>
      generateMessageResponse(message, context)
  );

  return {
    generateResponse: generateMutation.mutate,
    isGenerating: generateMutation.isLoading,
    response: generateMutation.data,
    error: generateMutation.error
  };
}

export function useProfileOptimization() {
  const { user } = useAuth();

  const optimizeMutation = useMutation(
    ({ profile, options }: Parameters<typeof optimizeProfile>) =>
      optimizeProfile(profile, options)
  );

  return {
    optimizeProfile: optimizeMutation.mutate,
    isOptimizing: optimizeMutation.isLoading,
    optimization: optimizeMutation.data,
    error: optimizeMutation.error
  };
}

export function useContentIdeas() {
  const generateMutation = useMutation(
    ({ profile, options }: Parameters<typeof generateContentIdeas>) =>
      generateContentIdeas(profile, options)
  );

  return {
    generateIdeas: generateMutation.mutate,
    isGenerating: generateMutation.isLoading,
    ideas: generateMutation.data,
    error: generateMutation.error
  };
}

export function useAIAssistant() {
  const contentAnalysis = useContentAnalysis();
  const messageGeneration = useMessageGeneration();
  const profileOptimization = useProfileOptimization();
  const contentIdeas = useContentIdeas();

  return {
    content: contentAnalysis,
    messages: messageGeneration,
    profile: profileOptimization,
    ideas: contentIdeas,
    isProcessing:
      contentAnalysis.isAnalyzing ||
      messageGeneration.isGenerating ||
      profileOptimization.isOptimizing ||
      contentIdeas.isGenerating
  };
}