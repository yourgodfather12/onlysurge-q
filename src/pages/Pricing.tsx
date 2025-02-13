import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  CheckCircle, 
  XCircle, 
  Zap, 
  Rocket, 
  Crown,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

interface PricingTier {
  name: string;
  description: string;
  price: number;
  features: {
    included: string[];
    notIncluded: string[];
  };
  icon: React.ReactNode;
  popular?: boolean;
}

export function Pricing() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const tiers: PricingTier[] = [
    {
      name: 'Starter',
      description: 'Perfect for creators just getting started',
      price: billingCycle === 'monthly' ? 29 : 290,
      features: {
        included: [
          'Basic content management',
          'Up to 100 scheduled posts',
          'Basic analytics',
          'Email support',
          'Single platform integration'
        ],
        notIncluded: [
          'AI-powered automation',
          'Advanced analytics',
          'Priority support',
          'Custom branding',
          'API access'
        ]
      },
      icon: <Zap className="w-5 h-5" />
    },
    {
      name: 'Professional',
      description: 'For growing creators who need more power',
      price: billingCycle === 'monthly' ? 79 : 790,
      features: {
        included: [
          'Advanced content management',
          'Unlimited scheduled posts',
          'Advanced analytics',
          'Priority email support',
          'Multi-platform integration',
          'Basic AI automation',
          'Custom branding'
        ],
        notIncluded: [
          'Dedicated account manager',
          'Custom AI training',
          'API access'
        ]
      },
      icon: <Rocket className="w-5 h-5" />,
      popular: true
    },
    {
      name: 'Enterprise',
      description: 'Custom solutions for established creators',
      price: billingCycle === 'monthly' ? 299 : 2990,
      features: {
        included: [
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
        ],
        notIncluded: []
      },
      icon: <Crown className="w-5 h-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative">
        {/* Animated gradient background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-black to-pink-900/30 animate-gradient-xy" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(144,63,249,0.1),transparent_50%)] animate-pulse-slow" />
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4 py-20">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                Choose Your Growth Plan
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-400 mb-8"
            >
              Scale your content creation with the perfect plan for your needs
            </motion.p>

            {/* Billing Toggle */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-4 bg-purple-900/20 p-1 rounded-full"
            >
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-full transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-creator-purple-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-full transition-colors ${
                  billingCycle === 'yearly'
                    ? 'bg-creator-purple-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Yearly
                <span className="ml-1 text-xs text-creator-purple-400">
                  Save 20%
                </span>
              </button>
            </motion.div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {tiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (i + 1) }}
              >
                <Card className={`relative h-full ${
                  tier.popular ? 'border-creator-purple-500' : ''
                }`}>
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-creator-purple-500 text-white px-4 py-1 rounded-full text-sm">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-purple-900/20 rounded-lg">
                        {tier.icon}
                      </div>
                      <h3 className="text-xl font-bold">{tier.name}</h3>
                    </div>
                    <p className="text-gray-400 mb-6">{tier.description}</p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold">${tier.price}</span>
                      <span className="text-gray-400">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                    </div>
                    <Button
                      variant={tier.popular ? 'primary' : 'outline'}
                      className="w-full"
                      onClick={() => navigate('/signup')}
                      icon={<ArrowRight className="w-4 h-4" />}
                    >
                      Get Started
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <p className="font-medium mb-4">What's included:</p>
                        <ul className="space-y-3">
                          {tier.features.included.map((feature) => (
                            <li key={feature} className="flex items-center gap-2">
                              <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {tier.features.notIncluded.length > 0 && (
                        <div>
                          <p className="font-medium mb-4 text-gray-400">Not included:</p>
                          <ul className="space-y-3">
                            {tier.features.notIncluded.map((feature) => (
                              <li key={feature} className="flex items-center gap-2 text-gray-400">
                                <XCircle className="w-5 h-5 text-gray-500 shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto mt-20">
            <h2 className="text-2xl font-bold text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="grid gap-4">
              {[
                {
                  q: "Can I change plans later?",
                  a: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
                },
                {
                  q: "What payment methods do you accept?",
                  a: "We accept all major credit cards, debit cards, and PayPal. All payments are processed securely through our payment provider."
                },
                {
                  q: "Is there a free trial?",
                  a: "Yes, all plans come with a 14-day free trial. No credit card required to start."
                },
                {
                  q: "What happens after my trial ends?",
                  a: "After your trial ends, you'll be asked to choose a plan to continue using OnlySurge. Your data will be preserved."
                }
              ].map((faq, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <HelpCircle className="w-5 h-5 text-creator-purple-400 shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold mb-2">{faq.q}</h3>
                        <p className="text-gray-400">{faq.a}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center">
            <Card>
              <CardContent className="p-12">
                <h2 className="text-3xl font-bold mb-4">Ready to grow your audience?</h2>
                <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                  Join thousands of creators who are already using OnlySurge to scale their content creation and engagement.
                </p>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/signup')}
                  icon={<ArrowRight className="w-5 h-5" />}
                >
                  Start Your Free Trial
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}