import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import type { ContentItem, ScheduledPost } from '../../types/database';
import { createScheduledPost } from '../../lib/supabase';

interface ContentSchedulerProps {
  content: ContentItem;
  onSchedule: () => void;
}

export function ContentScheduler({ content, onSchedule }: ContentSchedulerProps) {
  const [scheduledTime, setScheduledTime] = useState<string>('');
  const [caption, setCaption] = useState(content.ai_caption || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSchedule = async () => {
    if (!scheduledTime) {
      setError('Please select a time to schedule');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createScheduledPost({
        creator_id: content.creator_id,
        content_id: content.id,
        scheduled_time: new Date(scheduledTime).toISOString(),
        caption,
        status: 'pending'
      });

      // Show OnlyFans warning
      toast((t) => (
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
          <div>
            <p className="font-medium">Manual Posting Required</p>
            <p className="text-sm text-gray-400">
              OnlyFans content must be posted manually. We'll remind you when it's time to post.
            </p>
          </div>
        </div>
      ), { duration: 6000 });

      onSchedule();
    } catch (err) {
      setError('Failed to schedule post. Please try again.');
      console.error('Error scheduling post:', err);
    } finally {
      setLoading(false);
    }
  };

  // Validate the scheduled time is in the future
  const validateScheduledTime = (time: string) => {
    const scheduledDate = new Date(time);
    const now = new Date();
    return scheduledDate > now;
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Schedule Post
        </h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Schedule Time
            </label>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <input
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => {
                  setScheduledTime(e.target.value);
                  if (!validateScheduledTime(e.target.value)) {
                    setError('Please select a future date and time');
                  } else {
                    setError(null);
                  }
                }}
                min={new Date().toISOString().slice(0, 16)}
                className="flex-1 bg-purple-900/20 border border-purple-800/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Caption
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={4}
              className="w-full bg-purple-900/20 border border-purple-800/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your caption..."
            />
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 text-yellow-400 mb-2">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Manual Posting Required</span>
            </div>
            <p className="text-sm text-gray-400">
              Due to OnlyFans restrictions, content must be posted manually. We'll send you a reminder when it's time to post.
            </p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 text-red-400 text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            variant="primary"
            onClick={handleSchedule}
            loading={loading}
            disabled={loading || !scheduledTime || !validateScheduledTime(scheduledTime)}
            className="w-full"
            icon={<Calendar className="w-4 h-4" />}
          >
            Schedule Reminder
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}