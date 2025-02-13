import React from 'react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { 
  Users, 
  Rocket, 
  Shield, 
  Heart, 
  Globe, 
  Mail,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

export function About() {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
          Empowering Content Creators
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          OnlySurge is revolutionizing how creators manage and monetize their content across multiple platforms.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            variant="primary"
            size="lg"
            icon={<ArrowRight className="w-5 h-5" />}
          >
            Get Started
          </Button>
          <Button
            variant="outline"
            size="lg"
            icon={<Mail className="w-5 h-5" />}
          >
            Contact Us
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Creators', value: '10,000+', icon: <Users className="w-6 h-6" /> },
          { label: 'Total Revenue Generated', value: '$25M+', icon: <Rocket className="w-6 h-6" /> },
          { label: 'Platform Uptime', value: '99.99%', icon: <Shield className="w-6 h-6" /> },
          { label: 'Creator Satisfaction', value: '4.9/5', icon: <Heart className="w-6 h-6" /> }
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                </div>
                <div className="p-2 bg-purple-900/20 rounded-lg">
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features Section */}
      <div className="space-y-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose OnlySurge?</h2>
          <p className="text-gray-400">
            We provide everything you need to succeed in content creation
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'AI-Powered Automation',
              description: 'Let our AI handle the heavy lifting while you focus on creating amazing content.',
              icon: <Rocket className="w-8 h-8" />
            },
            {
              title: 'Cross-Platform Integration',
              description: 'Manage all your content platforms from a single, unified dashboard.',
              icon: <Globe className="w-8 h-8" />
            },
            {
              title: 'Advanced Analytics',
              description: 'Make data-driven decisions with our comprehensive analytics suite.',
              icon: <CheckCircle className="w-8 h-8" />
            }
          ].map((feature, i) => (
            <Card key={i}>
              <CardContent className="p-8">
                <div className="p-3 bg-purple-900/20 rounded-lg w-fit mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="space-y-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-gray-400">
            The passionate people behind OnlySurge
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }, (_, i) => (
            <Card key={i}>
              <CardContent className="p-6 text-center">
                <img
                  src={`https://source.unsplash.com/random/200x200?portrait=${i}`}
                  alt={`Team Member ${i + 1}`}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-bold mb-1">Team Member {i + 1}</h3>
                <p className="text-sm text-gray-400">
                  {['CEO', 'CTO', 'Head of Product', 'Head of Design'][i]}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <Card>
        <CardContent className="p-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
            <p className="text-gray-400 mb-8">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
            <div className="space-y-4">
              <Input
                placeholder="Your Name"
                className="bg-purple-900/20"
              />
              <Input
                type="email"
                placeholder="Your Email"
                className="bg-purple-900/20"
              />
              <textarea
                placeholder="Your Message"
                className="w-full h-32 bg-purple-900/20 border border-purple-800/50 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Button
                variant="primary"
                className="w-full"
                icon={<Mail className="w-4 h-4" />}
              >
                Send Message
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}