import React from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';
import { Calendar, Clock, BarChart2, MessageCircle, Share2, Edit2, Trash2 } from 'lucide-react';
import type { ContentItem } from '../../types/database';
import { getMediaUrl } from '../../lib/supabase';

interface ContentDetailsProps {
  content: ContentItem;
  onEdit: () => void;
  onDelete: () => void;
  onSchedule: () => void;
}

export function ContentDetails({ content, onEdit, onDelete, onSchedule }: ContentDetailsProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Media Preview */}
      <Card>
        <div className="aspect-video relative overflow-hidden rounded-t-2xl">
          {content.media_type === 'image' ? (
            <img
              src={getMediaUrl(content.media_url)}
              alt={content.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              src={getMediaUrl(content.media_url)}
              className="w-full h-full object-cover"
              controls
            />
          )}
        </div>
        <CardContent className="mt-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">{content.title}</h2>
              <p className="text-gray-400">{content.description}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                icon={<Edit2 className="w-4 h-4" />}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onDelete}
                icon={<Trash2 className="w-4 h-4" />}
              >
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Analysis */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <BarChart2 className="w-5 h-5" />
              AI Analysis
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">
                  Suggested Caption
                </h4>
                <p className="text-white">{content.ai_caption}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">
                  Hashtags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {content.ai_hashtags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded-full bg-creator-purple-500/20 text-creator-purple-300 text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">
                    Best Time to Post
                  </h4>
                  <div className="flex items-center gap-2 text-white">
                    <Clock className="w-4 h-4" />
                    {new Date(content.ai_best_time || '').toLocaleString()}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">
                    Engagement Score
                  </h4>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-700 rounded-full">
                      <motion.div
                        className="h-full bg-creator-purple-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${content.ai_engagement_score}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                    <span className="text-white">
                      {content.ai_engagement_score}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Actions
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                variant="primary"
                onClick={onSchedule}
                className="w-full"
                icon={<Calendar className="w-4 h-4" />}
              >
                Schedule Post
              </Button>
              <Button
                variant="outline"
                className="w-full"
                icon={<MessageCircle className="w-4 h-4" />}
              >
                Generate Message Template
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}