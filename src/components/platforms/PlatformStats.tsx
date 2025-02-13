import React from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  DollarSign,
  Heart,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useOnlyFans, useFansly } from '../../hooks/usePlatform';

export function PlatformStats() {
  const { api: onlyFansApi, isLoading: onlyFansLoading } = useOnlyFans();
  const { api: fanslyApi, isLoading: fanslyLoading } = useFansly();

  // Combine stats from both platforms
  const stats = {
    followers: 0,
    posts: 0,
    engagement: 0,
    revenue: 0
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Platform Performance</h3>
          <Button
            variant="outline"
            size="sm"
            icon={<RefreshCw className="w-4 h-4" />}
          >
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-purple-900/20 rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm">Total Followers</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.followers}</h3>
                </div>
                <div className="p-2 bg-purple-900/40 rounded-lg">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-400">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+12.5% this month</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 bg-purple-900/20 rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm">Total Posts</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.posts}</h3>
                </div>
                <div className="p-2 bg-purple-900/40 rounded-lg">
                  <FileText className="w-5 h-5 text-purple-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-400">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+8.2% this month</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 bg-purple-900/20 rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm">Engagement Rate</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.engagement}%</h3>
                </div>
                <div className="p-2 bg-purple-900/40 rounded-lg">
                  <Heart className="w-5 h-5 text-purple-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-400">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+3.1% this month</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 bg-purple-900/20 rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm">Total Revenue</p>
                  <h3 className="text-2xl font-bold mt-1">${stats.revenue}</h3>
                </div>
                <div className="p-2 bg-purple-900/40 rounded-lg">
                  <DollarSign className="w-5 h-5 text-purple-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-400">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+15.3% this month</span>
              </div>
            </motion.div>
          </div>

          {/* Platform Breakdown */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* OnlyFans Stats */}
            <div className="p-6 bg-purple-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Lock className="w-6 h-6 text-purple-400" />
                  <h4 className="font-semibold">OnlyFans</h4>
                </div>
                <Badge variant="outline">Connected</Badge>
              </div>

              {onlyFansLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-creator-purple-500 border-t-transparent rounded-full" />
                </div>
              ) : onlyFansApi ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Subscribers</p>
                      <p className="text-xl font-bold">2,451</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Revenue</p>
                      <p className="text-xl font-bold">$12,450</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-purple-800/30">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Monthly Growth</span>
                      <span className="text-green-400">+8.2%</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Connect OnlyFans to view stats</p>
                </div>
              )}
            </div>

            {/* Fansly Stats */}
            <div className="p-6 bg-purple-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <img
                    src="https://fansly.com/favicon.ico"
                    alt="Fansly"
                    className="w-6 h-6"
                  />
                  <h4 className="font-semibold">Fansly</h4>
                </div>
                <Badge variant="outline">Connected</Badge>
              </div>

              {fanslyLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-creator-purple-500 border-t-transparent rounded-full" />
                </div>
              ) : fanslyApi ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Subscribers</p>
                      <p className="text-xl font-bold">1,832</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Revenue</p>
                      <p className="text-xl font-bold">$8,920</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-purple-800/30">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Monthly Growth</span>
                      <span className="text-green-400">+12.5%</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Connect Fansly to view stats</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}