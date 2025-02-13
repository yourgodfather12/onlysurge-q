import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Calendar as CalendarIcon, Clock, Plus, Filter, Grid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ContentItem, ScheduledPost } from '../types/database';

export function Schedule() {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showScheduler, setShowScheduler] = useState(false);

  // Mock data for demonstration
  const scheduledPosts: (ScheduledPost & { content: ContentItem })[] = [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Content Schedule</h1>
          <p className="text-gray-400">Plan and schedule your content for maximum engagement.</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowScheduler(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Schedule Content
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex items-center gap-4">
              <div className="relative">
                <input
                  type="date"
                  value={selectedDate.toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="w-full bg-purple-900/20 border border-purple-800/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              <select className="bg-purple-900/20 border border-purple-800/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="all">All Platforms</option>
                <option value="onlyfans">OnlyFans</option>
                <option value="fansly">Fansly</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                icon={<Filter className="w-4 h-4" />}
              >
                Filters
              </Button>
            </div>
            <div className="flex rounded-lg overflow-hidden border border-purple-800/50">
              <button
                onClick={() => setViewMode('calendar')}
                className={`p-2 ${
                  viewMode === 'calendar'
                    ? 'bg-creator-purple-500 text-white'
                    : 'bg-purple-900/20 text-gray-400 hover:text-white hover:bg-purple-800/30'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${
                  viewMode === 'list'
                    ? 'bg-creator-purple-500 text-white'
                    : 'bg-purple-900/20 text-gray-400 hover:text-white hover:bg-purple-800/30'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'calendar' ? (
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }, (_, i) => {
                const date = new Date(selectedDate);
                date.setDate(date.getDate() - date.getDay() + i);
                const isToday = date.toDateString() === new Date().toDateString();
                const isSelected = date.toDateString() === selectedDate.toDateString();
                const hasContent = scheduledPosts.some(
                  post => new Date(post.scheduled_time).toDateString() === date.toDateString()
                );

                return (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDate(date)}
                    className={`aspect-square rounded-lg p-2 relative ${
                      isSelected
                        ? 'bg-creator-purple-500 text-white'
                        : isToday
                        ? 'bg-purple-900/40 text-white'
                        : 'bg-purple-900/20 hover:bg-purple-900/30'
                    }`}
                  >
                    <span className="text-sm">{date.getDate()}</span>
                    {hasContent && (
                      <span className="absolute bottom-1 right-1 w-2 h-2 bg-purple-400 rounded-full" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {scheduledPosts.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No scheduled content</h3>
                  <p className="text-gray-400 mb-6">
                    Start scheduling your content to maintain a consistent presence.
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => setShowScheduler(true)}
                    icon={<Plus className="w-4 h-4" />}
                  >
                    Schedule Content
                  </Button>
                </div>
              ) : (
                scheduledPosts.map((post) => (
                  <Card key={post.id}>
                    <div className="flex gap-4 p-4">
                      <div className="w-32 h-24 rounded-lg overflow-hidden bg-purple-900/20">
                        {post.content.media_type === 'image' ? (
                          <img
                            src={post.content.media_url}
                            alt={post.content.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <video
                            src={post.content.media_url}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{post.content.title}</h3>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>
                            {new Date(post.scheduled_time).toLocaleString()}
                          </span>
                        </div>
                        <p className="mt-2 text-sm">{post.caption}</p>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}