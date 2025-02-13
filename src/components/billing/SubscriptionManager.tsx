import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  AlertCircle,
  X,
  ArrowRight,
  Clock
} from 'lucide-react';
import { useSubscription } from '../../hooks/useSubscription';
import { cancelSubscription, updateSubscription } from '../../lib/stripe';
import { formatCurrency } from '../../lib/utils';

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
}

export function SubscriptionManager() {
  const { subscription, loading, error, mutate } = useSubscription();
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [processing, setProcessing] = useState(false);

  const plans: Plan[] = [
    {
      id: 'price_starter',
      name: 'Starter',
      price: 29,
      features: [
        'Basic content management',
        'Up to 100 scheduled posts',
        'Basic analytics',
        'Email support',
        'Single platform integration'
      ]
    },
    {
      id: 'price_professional',
      name: 'Professional',
      price: 79,
      features: [
        'Advanced content management',
        'Unlimited scheduled posts',
        'Advanced analytics',
        'Priority email support',
        'Multi-platform integration',
        'Basic AI automation',
        'Custom branding'
      ],
      popular: true
    },
    {
      id: 'price_enterprise',
      name: 'Enterprise',
      price: 299,
      features: [
        'Custom content management',
        'Unlimited everything',
        'Real-time analytics',
        '24/7 priority support',
        'All platform integrations',
        'Advanced AI automation',
        'Custom branding',
        'Dedicated account manager',
        'Custom AI training',
        'API access'
      ]
    }
  ];

  const handleUpdatePlan = async (planId: string) => {
    setProcessing(true);
    try {
      await updateSubscription(planId);
      await mutate();
    } catch (error) {
      console.error('Failed to update subscription:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleCancelSubscription = async () => {
    setProcessing(true);
    try {
      await cancelSubscription();
      await mutate();
      setShowConfirmCancel(false);
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
    } finally {
      setProcessing(false);
    }
  };

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
    <>
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrentPlan = subscription?.plan.id === plan.id;
          const canDowngrade = subscription && plan.price < subscription.plan.price;
          const canUpgrade = subscription && plan.price > subscription.plan.price;

          return (
            <Card key={plan.id} className={plan.popular ? 'border-creator-purple-500' : ''}>
              <CardContent className="p-6">
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge variant="primary">Most Popular</Badge>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-gray-400">/month</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {isCurrentPlan ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled
                  >
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    variant={plan.popular ? 'primary' : 'outline'}
                    className="w-full"
                    onClick={() => handleUpdatePlan(plan.id)}
                    loading={processing}
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    {canUpgrade ? 'Upgrade' : canDowngrade ? 'Downgrade' : 'Select Plan'}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Cancel Subscription Modal */}
      <AnimatePresence>
        {showConfirmCancel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-lg"
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Cancel Subscription</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowConfirmCancel(false)}
                      icon={<X className="w-4 h-4" />}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-400">
                      Are you sure you want to cancel your subscription? You'll lose access to:
                    </p>
                    <div className="space-y-2">
                      {subscription?.plan.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-yellow-400 mb-2">
                        <Clock className="w-5 h-5" />
                        <span className="font-medium">Access Until</span>
                      </div>
                      <p className="text-sm text-gray-400">
                        You'll continue to have access until{' '}
                        {new Date(subscription?.current_period_end!).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowConfirmCancel(false)}
                      >
                        Keep Subscription
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleCancelSubscription}
                        loading={processing}
                      >
                        Cancel Subscription
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}