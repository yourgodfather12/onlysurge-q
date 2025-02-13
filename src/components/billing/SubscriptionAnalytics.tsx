import React from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatsChart } from '../charts/StatsChart';
import { Progress } from '../ui/Progress';
import {
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { useSubscriptionAnalytics } from '../../hooks/useSubscriptionAnalytics';

export function SubscriptionAnalytics() {
  const { data, loading, error } = useSubscriptionAnalytics();
  const [timeRange, setTimeRange] = React.useState('30d');

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-creator-purple-500 border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-gray-400">Loading analytics...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <p>Failed to load analytics</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Monthly Revenue</p>
                <h3 className="text-2xl font-bold mt-1">
                  {formatCurrency(data?.revenue.monthly)}
                </h3>
              </div>
              <div className="p-2 bg-purple-900/20 rounded-lg">
                <DollarSign className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              {data?.revenue.growth >= 0 ? (
                <span className="text-green-400 flex items-center">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +{data.revenue.growth}% this month
                </span>
              ) : (
                <span className="text-red-400 flex items-center">
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                  {data.revenue.growth}% this month
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Active Subscribers</p>
                <h3 className="text-2xl font-bold mt-1">{data?.subscribers.active}</h3>
              </div>
              <div className="p-2 bg-purple-900/20 rounded-lg">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              {data?.subscribers.growth >= 0 ? (
                <span className="text-green-400 flex items-center">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +{data.subscribers.growth}% this month
                </span>
              ) : (
                <span className="text-red-400 flex items-center">
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                  {data.subscribers.growth}% this month
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Churn Rate</p>
                <h3 className="text-2xl font-bold mt-1">{data?.churnRate}%</h3>
              </div>
              <div className="p-2 bg-purple-900/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              {data?.churnRateChange >= 0 ? (
                <span className="text-red-400 flex items-center">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +{data.churnRateChange}% this month
                </span>
              ) : (
                <span className="text-green-400 flex items-center">
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                  {data.churnRateChange}% this month
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Avg. Subscription Length</p>
                <h3 className="text-2xl font-bold mt-1">{data?.avgSubscriptionLength} months</h3>
              </div>
              <div className="p-2 bg-purple-900/20 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              {data?.avgSubscriptionLengthChange >= 0 ? (
                <span className="text-green-400 flex items-center">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +{data.avgSubscriptionLengthChange}% this month
                </span>
              ) : (
                <span className="text-red-400 flex items-center">
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                  {data.avgSubscriptionLengthChange}% this month
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Revenue Overview</h3>
            <div className="flex items-center gap-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-purple-900/20 border border-purple-800/50 rounded-lg px-3 py-2 text-white"
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
        </CardHeader>
        <CardContent>
          <StatsChart data={data?.revenueData || []} color="#9061F9" />
        </CardContent>
      </Card>

      {/* Plan Distribution */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">Plan Distribution</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data?.planDistribution.map((plan) => (
              <div key={plan.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{plan.name}</span>
                  <span className="text-gray-400">{plan.percentage}%</span>
                </div>
                <Progress value={plan.percentage} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Retention Cohorts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Retention Cohorts</h3>
            <Button
              variant="outline"
              icon={<Filter className="w-4 h-4" />}
            >
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-800/30">
                  <th className="text-left py-3 px-4">Cohort</th>
                  <th className="text-left py-3 px-4">Size</th>
                  <th className="text-left py-3 px-4">1 Month</th>
                  <th className="text-left py-3 px-4">3 Months</th>
                  <th className="text-left py-3 px-4">6 Months</th>
                  <th className="text-left py-3 px-4">12 Months</th>
                </tr>
              </thead>
              <tbody>
                {data?.retentionCohorts.map((cohort) => (
                  <tr
                    key={cohort.date}
                    className="border-b border-purple-800/30 hover:bg-purple-900/20"
                  >
                    <td className="py-3 px-4">{cohort.date}</td>
                    <td className="py-3 px-4">{cohort.size}</td>
                    <td className="py-3 px-4">{cohort.retention.month1}%</td>
                    <td className="py-3 px-4">{cohort.retention.month3}%</td>
                    <td className="py-3 px-4">{cohort.retention.month6}%</td>
                    <td className="py-3 px-4">{cohort.retention.month12}%</td>
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