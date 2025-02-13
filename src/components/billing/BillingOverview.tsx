import React from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Progress } from '../ui/Progress';
import { Badge } from '../ui/Badge';
import {
  CreditCard,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  Download
} from 'lucide-react';
import { useSubscription } from '../../hooks/useSubscription';
import { formatCurrency } from '../../lib/utils';

export function BillingOverview() {
  const { subscription, loading, error } = useSubscription();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-creator-purple-500 border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-gray-400">Loading subscription details...</p>
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
            <p>Failed to load subscription details</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Subscription Overview</h2>
          <Badge
            variant={subscription?.status === 'active' ? 'success' : 'warning'}
            icon={subscription?.status === 'active' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
          >
            {subscription?.status === 'active' ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Current Plan */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{subscription?.plan.name}</h3>
                <p className="text-gray-400">{formatCurrency(subscription?.plan.price)} / month</p>
              </div>
              <Button variant="outline">Change Plan</Button>
            </div>
            <div className="space-y-4">
              {subscription?.plan.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Billing Period */}
          <div className="p-4 rounded-lg bg-purple-900/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                <span className="font-medium">Current Period</span>
              </div>
              <span className="text-sm text-gray-400">
                {new Date(subscription?.current_period_end!).toLocaleDateString()}
              </span>
            </div>
            <Progress
              value={
                ((Date.now() - new Date(subscription?.current_period_start!).getTime()) /
                (new Date(subscription?.current_period_end!).getTime() - new Date(subscription?.current_period_start!).getTime())) * 100
              }
              className="mt-2"
            />
          </div>

          {/* Payment Method */}
          <div className="p-4 rounded-lg bg-purple-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="font-medium">Payment Method</p>
                  <p className="text-sm text-gray-400">
                    {subscription?.payment_method?.brand} ending in {subscription?.payment_method?.last_four}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">Update</Button>
            </div>
          </div>

          {/* Recent Invoice */}
          {subscription?.latest_invoice && (
            <div className="p-4 rounded-lg bg-purple-900/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Latest Invoice</p>
                  <p className="text-sm text-gray-400">
                    {new Date(subscription.latest_invoice.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Download className="w-4 h-4" />}
                  onClick={() => window.open(subscription.latest_invoice.pdf_url)}
                >
                  Download
                </Button>
              </div>
            </div>
          )}

          {/* Cancel Subscription */}
          <div className="pt-6 border-t border-purple-800/30">
            <Button
              variant="outline"
              className="w-full text-red-400 hover:text-red-300"
            >
              Cancel Subscription
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}