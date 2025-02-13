import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { StatsChart } from '../components/charts/StatsChart';
import { Button } from '../components/ui/Button';
import {
  TrendingUp,
  Users,
  DollarSign,
  Heart,
  Calendar,
  Download,
  Filter
} from 'lucide-react';

export function Analytics() {
  const [dateRange, setDateRange] = useState('30d');

  // Mock data for demonstration
  const earningsData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    value: Math.floor(Math.random() * 1000) + 500,
  }));

  const followersData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    value: Math.floor(Math.random() * 100) + 50,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics</h1>
          <p className="text-gray-400">Track your growth and engagement metrics.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-purple-900/20 border border-purple-800/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button
            variant="outline"
            icon={<Download className="w-4 h-4" />}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Total Earnings</p>
                <h3 className="text-2xl font-bold mt-1">$24,500</h3>
              </div>
              <div className="p-2 bg-purple-900/20 rounded-lg">
                <DollarSign className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-400">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+12.5% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Total Subscribers</p>
                <h3 className="text-2xl font-bold mt-1">2,451</h3>
              </div>
              <div className="p-2 bg-purple-900/20 rounded-lg">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-400">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+8.2% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Engagement Rate</p>
                <h3 className="text-2xl font-bold mt-1">8.2%</h3>
              </div>
              <div className="p-2 bg-purple-900/20 rounded-lg">
                <Heart className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-400">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+3.1% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Active Subscriptions</p>
                <h3 className="text-2xl font-bold mt-1">1,890</h3>
              </div>
              <div className="p-2 bg-purple-900/20 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-400">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+5.3% this month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Earnings Overview</h3>
              <Button
                variant="ghost"
                size="sm"
                icon={<Filter className="w-4 h-4" />}
              >
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <StatsChart data={earningsData} color="#9333ea" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Subscriber Growth</h3>
              <Button
                variant="ghost"
                size="sm"
                icon={<Filter className="w-4 h-4" />}
              >
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <StatsChart data={followersData} color="#ec4899" />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">Top Performing Content</h3>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-800/30">
                  <th className="text-left py-3 px-4">Content</th>
                  <th className="text-left py-3 px-4">Views</th>
                  <th className="text-left py-3 px-4">Likes</th>
                  <th className="text-left py-3 px-4">Comments</th>
                  <th className="text-left py-3 px-4">Engagement</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }, (_, i) => (
                  <tr
                    key={i}
                    className="border-b border-purple-800/30 hover:bg-purple-900/20"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-900/20" />
                        <span>Content Title {i + 1}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{Math.floor(Math.random() * 10000)}</td>
                    <td className="py-3 px-4">{Math.floor(Math.random() * 1000)}</td>
                    <td className="py-3 px-4">{Math.floor(Math.random() * 100)}</td>
                    <td className="py-3 px-4">{(Math.random() * 10).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}