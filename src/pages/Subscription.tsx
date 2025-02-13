import React from 'react';
import { SubscriptionManager } from '../components/billing/SubscriptionManager';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { CheckCircle, HelpCircle } from 'lucide-react';

export function Subscription() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Choose Your Plan</h1>
        <p className="text-gray-400">Select the perfect plan for your content creation needs.</p>
      </div>

      {/* Feature Comparison */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Plan Features</h2>
            <Button
              variant="outline"
              size="sm"
              icon={<HelpCircle className="w-4 h-4" />}
            >
              Compare Plans
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-800/30">
                  <th className="text-left py-3 px-4">Feature</th>
                  <th className="text-left py-3 px-4">Starter</th>
                  <th className="text-left py-3 px-4">
                    <div className="flex items-center gap-2">
                      Professional
                      <Badge variant="primary">Popular</Badge>
                    </div>
                  </th>
                  <th className="text-left py-3 px-4">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {[
                  'Content Management',
                  'Scheduled Posts',
                  'Analytics',
                  'Support',
                  'Platform Integration',
                  'AI Automation',
                  'Custom Branding',
                  'API Access'
                ].map((feature, i) => (
                  <tr key={i} className="border-b border-purple-800/30">
                    <td className="py-3 px-4">{feature}</td>
                    <td className="py-3 px-4">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </td>
                    <td className="py-3 px-4">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </td>
                    <td className="py-3 px-4">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Plans */}
      <SubscriptionManager />
    </div>
  );
}