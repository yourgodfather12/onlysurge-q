import React from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Progress } from '../ui/Progress';
import { Badge } from '../ui/Badge';
import {
  HardDrive,
  FileText,
  Bot,
  Code,
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';
import { useUsage } from '../../hooks/useUsage';
import { formatBytes } from '../../lib/utils';

export function UsageOverview() {
  const { usage, loading, error } = useUsage();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-creator-purple-500 border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-gray-400">Loading usage metrics...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center gap-3 text-red-400">
            <AlertTriangle className="w-5 h-5" />
            <p>Failed to load usage metrics</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const metrics = [
    {
      name: 'Storage',
      icon: <HardDrive className="w-5 h-5" />,
      used: usage?.storage.used || 0,
      limit: usage?.storage.limit || 0,
      format: formatBytes
    },
    {
      name: 'Posts',
      icon: <FileText className="w-5 h-5" />,
      used: usage?.posts.count || 0,
      limit: usage?.posts.limit || 0,
      format: (n: number) => n.toLocaleString()
    },
    {
      name: 'Automations',
      icon: <Bot className="w-5 h-5" />,
      used: usage?.automations.active || 0,
      limit: usage?.automations.limit || 0,
      format: (n: number) => n.toLocaleString()
    },
    {
      name: 'API Calls',
      icon: <Code className="w-5 h-5" />,
      used: usage?.apiCalls.count || 0,
      limit: usage?.apiCalls.limit || 0,
      format: (n: number) => n.toLocaleString()
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Usage & Limits</h2>
          <Button
            variant="outline"
            icon={<ArrowUpRight className="w-4 h-4" />}
          >
            Upgrade Plan
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {metrics.map((metric) => {
            const percentage = (metric.used / metric.limit) * 100;
            const isWarning = percentage >= 80;
            const isExceeded = percentage >= 100;

            return (
              <div key={metric.name}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-900/20 rounded-lg">
                      {metric.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{metric.name}</h3>
                      <p className="text-sm text-gray-400">
                        {metric.format(metric.used)} of {metric.format(metric.limit)} used
                      </p>
                    </div>
                  </div>
                  {isWarning && (
                    <Badge
                      variant={isExceeded ? 'error' : 'warning'}
                      icon={<AlertTriangle className="w-3 h-3" />}
                    >
                      {isExceeded ? 'Exceeded' : 'Near Limit'}
                    </Badge>
                  )}
                </div>
                <Progress
                  value={percentage}
                  variant={
                    isExceeded
                      ? 'error'
                      : isWarning
                      ? 'warning'
                      : 'default'
                  }
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}