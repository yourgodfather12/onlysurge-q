import React from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { BarChart2, TrendingUp, Users, Clock } from 'lucide-react';
import { StatsChart } from '../charts/StatsChart';
import type { ContentItem } from '../../types/database';

interface ContentAnalyticsProps {
  content: ContentItem;
}

export function ContentAnalytics({ content }: ContentAnalyticsProps) {
  // Mock data for demonstration
  const viewsData = Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    value: Math.floor(Math.random() * 1000) + 100,
  }));

  const engagementData = Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    value: Math.floor(Math.random() * 100),
  }));

  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <BarChart2 className="w-5 h-5" />
          Content Analytics
        </h3>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-purple-900/20 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Users className="w-4 h-4" />
              <span className="text-sm">Total Views</span>
            </div>
            <p className="text-2xl font-bold">4,521</p>
            <span className="text-sm text-green-400">+12.5% this week</span>
          </div>
          <div className="bg-purple-900/20 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">Engagement Rate</span>
            </div>
            <p className="text-2xl font-bold">8.2%</p>
            <span className="text-sm text-green-400">+3.1% this week</span>
          </div>
          <div className="bg-purple-900/20 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Avg. View Time</span>
            </div>
            <p className="text-2xl font-bold">2:45</p>
            <span className="text-sm text-green-400">+0.5% this week</span>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-4">Views Over Time</h4>
            <div className="h-48">
              <StatsChart data={viewsData} color="#9333ea" />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-4">Engagement Rate</h4>
            <div className="h-48">
              <StatsChart data={engagementData} color="#ec4899" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}