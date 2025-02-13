import React from 'react';
import { PublicNavigation } from '../components/PublicNavigation';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { 
  Mail, 
  MessageSquare, 
  Phone, 
  MapPin,
  Send,
  ArrowRight
} from 'lucide-react';

export function Contact() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative">
        {/* Animated gradient background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-black to-pink-900/30 animate-gradient-xy" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(144,63,249,0.1),transparent_50%)] animate-pulse-slow" />
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4">
          <PublicNavigation />

          <div className="py-20">
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                  Get in Touch
                </span>
              </h1>
              <p className="text-xl text-gray-400">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>

            {/* Contact Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-20">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Email Us</h3>
                  <p className="text-gray-400 mb-4">
                    We'll respond within 24 hours
                  </p>
                  <a href="mailto:support@onlysurge.com" className="text-purple-400 hover:text-purple-300">
                    support@onlysurge.com
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
                  <p className="text-gray-400 mb-4">
                    Available 24/7 for urgent help
                  </p>
                  <Button variant="outline" size="sm">
                    Start Chat
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Call Us</h3>
                  <p className="text-gray-400 mb-4">
                    Mon-Fri from 8am to 5pm
                  </p>
                  <a href="tel:+1234567890" className="text-purple-400 hover:text-purple-300">
                    +1 (234) 567-890
                  </a>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card>
              <CardContent className="p-8">
                <div className="max-w-2xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Input
                      label="First Name"
                      placeholder="Enter your first name"
                    />
                    <Input
                      label="Last Name"
                      placeholder="Enter your last name"
                    />
                    <Input
                      label="Email"
                      type="email"
                      placeholder="Enter your email"
                      icon={<Mail className="w-4 h-4" />}
                    />
                    <Input
                      label="Phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      icon={<Phone className="w-4 h-4" />}
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Message
                    </label>
                    <textarea
                      rows={6}
                      className="w-full bg-purple-900/20 border border-purple-800/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <Button
                    variant="primary"
                    className="w-full"
                    icon={<Send className="w-4 h-4" />}
                  >
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Office Location */}
            <div className="mt-20 text-center">
              <Card>
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Visit Our Office</h3>
                  <p className="text-gray-400 mb-6">
                    123 Creator Street, Suite 100<br />
                    San Francisco, CA 94105
                  </p>
                  <Button
                    variant="outline"
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    Get Directions
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}