import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  User,
  DollarSign,
  Tag,
  Lightbulb,
  Copy,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useProfileOptimization } from '../../hooks/useAI';
import type { CreatorProfile } from '../../types/database';

interface ProfileOptimizerProps {
  profile: CreatorProfile;
  onOptimizationComplete?: (optimization: any) => void;
}

export function ProfileOptimizer({
  profile,
  onOptimizationComplete
}: ProfileOptimizerProps) {
  const [copied, setCopied] = useState(false);
  const {
    optimizeProfile,
    isOptimizing,
    optimization,
    error
  } = useProfileOptimization();

  const handleOptimize = async () => {
    try {
      await optimizeProfile({
        profile: {
          bio: profile.bio || '',
          niche: 'content_creator', // Add proper niche detection
          goals: 'growth' // Add proper goals detection
        }
      });
      onOptimizationComplete?.(optimization);
    } catch (error) {
      console.error('Failed to optimize profile:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Profile Optimization
          </h3>
          <Button
            variant="primary"
            onClick={handleOptimize}
            loading={isOptimizing}
            disabled={isOptimizing}
            icon={<Sparkles className="w-4 h-4" />}
          >
            {isOptimizing ? 'Optimizing...' : 'Optimize Profile'}
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
              className="flex items-center gap-2 text-red-400"
            >
              <AlertCircle className="w-4 h-4" />
              <span>Failed to optimize profile. Please try again.</span>
            </motion.div>
          ) : optimization ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Optimized Bio */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Optimized Bio
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(optimization.optimizedBio)}
                    icon={copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <div className="p-4 bg-purple-900/20 rounded-lg">
                  <p>{optimization.optimizedBio}</p>
                </div>
              </div>

              {/* Suggested Tags */}
              <div>
                <h4 className="font-medium flex items-center gap-2 mb-2">
                  <Tag className="w-4 h-4" />
                  Suggested Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {optimization.suggestedTags.map((tag: string, i: number) => (
                    <Badge key={i} variant="default">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Content Ideas */}
              <div>
                <h4 className="font-medium flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4" />
                  Content Ideas
                </h4>
                <div className="space-y-2">
                  {optimization.contentIdeas.map((idea: string, i: number) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 bg-purple-900/10 rounded-lg"
                    >
                      <span>{idea}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(idea)}
                        icon={<Copy className="w-4 h-4" />}
                      >
                        Copy
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Recommendations */}
              <div>
                <h4 className="font-medium flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4" />
                  Pricing Recommendations
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-purple-900/20 rounded-lg text-center">
                    <p className="text-sm text-gray-400 mb-1">Subscription</p>
                    <p className="text-xl font-bold">
                      ${optimization.pricingRecommendations.subscription}
                    </p>
                  </div>
                  <div className="p-4 bg-purple-900/20 rounded-lg text-center">
                    <p className="text-sm text-gray-400 mb-1">Messages</p>
                    <p className="text-xl font-bold">
                      ${optimization.pricingRecommendations.messages}
                    </p>
                  </div>
                  <div className="p-4 bg-purple-900/20 rounded-lg text-center">
                    <p className="text-sm text-gray-400 mb-1">Custom Content</p>
                    <p className="text-xl font-bold">
                      ${optimization.pricingRecommendations.customContent}
                    </p>
                  </div>
                </div>
              </div>
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
                Optimize Your Profile
              </h3>
              <p className="text-gray-400 mb-6">
                Get AI-powered suggestions to enhance your profile and boost engagement
              </p>
              <Button
                variant="primary"
                onClick={handleOptimize}
                icon={<Sparkles className="w-4 h-4" />}
              >
                Start Optimization
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}