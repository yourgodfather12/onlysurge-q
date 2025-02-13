import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Progress } from '../ui/Progress';
import { Badge } from '../ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Clock,
  TrendingUp,
  Users,
  DollarSign,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useContentAnalysis } from '../../hooks/useAI';
import type { ContentItem } from '../../types/database';

interface ContentAnalyzerProps {
  content: ContentItem;
  onAnalysisComplete?: (analysis: any) => void;
}

export function ContentAnalyzer({ content, onAnalysisComplete }: ContentAnalyzerProps) {
  const { analyzeContent, isAnalyzing, analysis, error } = useContentAnalysis();
  const [showDetails, setShowDetails] = useState(false);

  const handleAnalyze = async () => {
    try {
      await analyzeContent({
        content: {
          title: content.title,
          description: content.description || '',
          mediaType: content.media_type,
          mediaUrl: content.media_url
        },
        options: {
          platform: 'all'
        }
      });
      onAnalysisComplete?.(analysis);
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            AI Content Analysis
          </h3>
          <Button
            variant="primary"
            onClick={handleAnalyze}
            loading={isAnalyzing}
            disabled={isAnalyzing}
            icon={<Sparkles className="w-4 h-4" />}
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Content'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-red-400 mb-4"
            >
              <AlertCircle className="w-5 h-5" />
              <span>Failed to analyze content. Please try again.</span>
            </motion.div>
          ) : analysis ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Engagement Score */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Engagement Score</span>
                  <span className="text-2xl font-bold">{analysis.engagementScore}%</span>
                </div>
                <Progress value={analysis.engagementScore} />
              </div>

              {/* Best Posting Time */}
              <div className="flex items-center justify-between p-4 bg-purple-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="font-medium">Best Time to Post</p>
                    <p className="text-sm text-gray-400">
                      {new Date(analysis.bestTime).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Schedule post for best time
                  }}
                >
                  Schedule
                </Button>
              </div>

              {/* Target Audience */}
              <div>
                <h4 className="font-medium mb-2">Target Audience</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.targetAudience.map((audience: string, i: number) => (
                    <Badge
                      key={i}
                      variant="default"
                      icon={<Users className="w-3 h-3" />}
                    >
                      {audience}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Suggested Price */}
              {analysis.suggestedPrice && (
                <div className="flex items-center justify-between p-4 bg-purple-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="font-medium">Suggested Price</p>
                      <p className="text-sm text-gray-400">
                        Based on content quality and market analysis
                      </p>
                    </div>
                  </div>
                  <span className="text-xl font-bold">
                    ${analysis.suggestedPrice.toFixed(2)}
                  </span>
                </div>
              )}

              {/* Content Warnings */}
              {analysis.contentWarnings.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Content Warnings</h4>
                  <div className="space-y-2">
                    {analysis.contentWarnings.map((warning: string, i: number) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-yellow-400"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>{warning}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Show More Details */}
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? 'Show Less' : 'Show More Details'}
              </Button>

              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    {/* SEO Optimization */}
                    <div>
                      <h4 className="font-medium mb-2">SEO Optimization</h4>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-gray-400">Title</p>
                          <p>{analysis.seoOptimization.title}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Description</p>
                          <p>{analysis.seoOptimization.description}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Keywords</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {analysis.seoOptimization.keywords.map((keyword: string, i: number) => (
                              <Badge key={i} variant="outline">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hashtags */}
                    <div>
                      <h4 className="font-medium mb-2">Suggested Hashtags</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.hashtags.map((tag: string, i: number) => (
                          <Badge
                            key={i}
                            variant="default"
                            icon={<TrendingUp className="w-3 h-3" />}
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Generated Caption */}
                    <div>
                      <h4 className="font-medium mb-2">Generated Caption</h4>
                      <div className="p-4 bg-purple-900/20 rounded-lg">
                        <p>{analysis.caption}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Analyze Your Content
              </h3>
              <p className="text-gray-400 mb-6">
                Get AI-powered insights to optimize your content for maximum engagement
              </p>
              <Button
                variant="primary"
                onClick={handleAnalyze}
                icon={<Sparkles className="w-4 h-4" />}
              >
                Start Analysis
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}