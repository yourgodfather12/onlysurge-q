import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Search, HelpCircle, MessageCircle, Book, Mail, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export function Help() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "How do I get started with OnlySurge?",
      answer: "Sign up for an account, complete your profile verification, and start uploading content. Our AI tools will help optimize your content for maximum engagement.",
      category: "Getting Started"
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept major credit cards, debit cards, and bank transfers. All payments are processed securely through our payment partners.",
      category: "Billing"
    },
    {
      question: "How does content automation work?",
      answer: "Our AI analyzes your content and automatically schedules posts at optimal times. You can set rules and preferences for different platforms.",
      category: "Features"
    },
    // Add more FAQs as needed
  ];

  const categories = Array.from(new Set(faqs.map(faq => faq.category)));

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Help Center</h1>
        <p className="text-gray-400">Find answers to common questions and get support.</p>
      </div>

      {/* Search and Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Input
            placeholder="Search for help..."
            icon={<Search className="w-4 h-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="bg-purple-900/20 border border-purple-800/50 rounded-lg px-3 py-2 text-white"
          value={selectedCategory || ''}
          onChange={(e) => setSelectedCategory(e.target.value || null)}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-900/20 rounded-lg">
                <MessageCircle className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold">Contact Support</h3>
                <p className="text-sm text-gray-400">Get help from our team</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-900/20 rounded-lg">
                <Book className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold">Documentation</h3>
                <p className="text-sm text-gray-400">Read our guides</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-900/20 rounded-lg">
                <Mail className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold">Email Support</h3>
                <p className="text-sm text-gray-400">Send us a message</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-8">
                <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-gray-400">
                  Try adjusting your search or browse all categories
                </p>
              </div>
            ) : (
              filteredFAQs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-purple-800/30 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedQuestion(
                      expandedQuestion === faq.question ? null : faq.question
                    )}
                    className="w-full flex items-center justify-between p-4 hover:bg-purple-900/20"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm px-2 py-1 rounded-full bg-purple-900/20">
                        {faq.category}
                      </span>
                      <span className="font-medium">{faq.question}</span>
                    </div>
                    {expandedQuestion === faq.question ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedQuestion === faq.question && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 bg-purple-900/20 border-t border-purple-800/30">
                          <p className="text-gray-300">{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contact Form */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Still need help?</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              label="Subject"
              placeholder="What do you need help with?"
            />
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Message
              </label>
              <textarea
                className="w-full bg-purple-900/20 border border-purple-800/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={4}
                placeholder="Describe your issue in detail..."
              />
            </div>
            <Button
              variant="primary"
              className="w-full"
              icon={<Mail className="w-4 h-4" />}
            >
              Send Message
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}