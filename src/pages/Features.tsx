import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  Zap,
  Bot,
  BarChart2,
  Calendar,
  MessageSquare,
  Globe,
  Shield,
  Clock,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

export function Features() {
  const features = [
    {
      title: 'AI-Powered Content Creation',
      description: 'Let our advanced AI assist you in creating engaging content that resonates with your audience.',
      icon: <Bot className="w-6 h-6" />,
      benefits: [
        'Smart caption generation',
        'Hashtag optimization',
        'Content performance prediction',
        'Automated scheduling'
      ]
    },
    {
      title: 'Advanced Analytics',
      description: 'Make data-driven decisions with comprehensive analytics and insights.',
      icon: <BarChart2 className="w-6 h-6" />,
      benefits: [
        'Real-time performance tracking',
        'Audience insights',
        'Revenue analytics',
        'Growth trends'
      ]
    },
    {
      title: 'Smart Scheduling',
      description: 'Post at the perfect time with AI-optimized scheduling.',
      icon: <Calendar className="w-6 h-6" />,
      benefits: [
        'Best time predictions',
        'Automated posting',
        'Cross-platform scheduling',
        'Content calendar'
      ]
    },
    {
      title: 'Automated Messaging',
      description: 'Engage with your audience efficiently using smart automation.',
      icon: <MessageSquare className="w-6 h-6" />,
      benefits: [
        'Auto-replies',
        'Message templates',
        'Bulk messaging',
        'Engagement tracking'
      ]
    },
    {
      title: 'Multi-Platform Support',
      description: 'Manage all your content platforms from a single dashboard.',
      icon: <Globe className="w-6 h-6" />,
      benefits: [
        'Cross-platform posting',
        'Unified inbox',
        'Content synchronization',
        'Platform-specific optimization'
      ]
    },
    {
      title: 'Security & Privacy',
      description: 'Enterprise-grade security to protect your content and data.',
      icon: <Shield className="w-6 h-6" />,
      benefits: [
        'End-to-end encryption',
        'Two-factor authentication',
        'Content watermarking',
        'Access controls'
      ]
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
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                  Powerful Features for
                </span>
                <br />
                Content Creators
              </h1>
              <p className="text-xl text-gray-400 mb-8">
                Everything you need to create, manage, and grow your content business
              </p>
              <Button
                variant="primary"
                size="lg"
                icon={<Zap className="w-5 h-5" />}
              >
                Get Started Free
              </Button>
            </motion.div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <Card className="h-full">
                  <CardContent className="p-8">
                    <div className="p-3 bg-purple-900/20 rounded-lg w-fit mb-6">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-gray-400 mb-6">{feature.description}</p>
                    <ul className="space-y-3">
                      {feature.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <Card>
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                Join thousands of creators who are already using OnlySurge to scale their content creation and engagement.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<ArrowRight className="w-5 h-5" />}
                >
                  Start Free Trial
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  icon={<Clock className="w-5 h-5" />}
                >
                  Schedule Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}