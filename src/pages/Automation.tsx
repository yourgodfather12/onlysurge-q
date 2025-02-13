import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, MessageSquare, Calendar, Settings, Plus, Clock, Zap, ToggleLeft as Toggle, Edit2, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

interface AutomationRule {
  id: number;
  name: string;
  type: 'message' | 'post' | 'engagement';
  active: boolean;
  conditions: string[];
  actions: string[];
}

export function Automation() {
  const [activeTab, setActiveTab] = useState<'rules' | 'templates' | 'settings'>('rules');
  const [showNewRule, setShowNewRule] = useState(false);

  // Mock data for demonstration
  const automationRules: AutomationRule[] = [
    {
      id: 1,
      name: 'Welcome Message',
      type: 'message',
      active: true,
      conditions: ['New subscriber'],
      actions: ['Send welcome message', 'Add to subscriber list']
    },
    {
      id: 2,
      name: 'Daily Post',
      type: 'post',
      active: true,
      conditions: ['Time is 9:00 AM', 'Content available'],
      actions: ['Post to OnlyFans', 'Post to Fansly']
    },
    {
      id: 3,
      name: 'Engagement Boost',
      type: 'engagement',
      active: false,
      conditions: ['Post older than 2 hours', 'Less than 10 likes'],
      actions: ['Send notification to subscribers']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Automation</h1>
          <p className="text-gray-400">Set up automated tasks to save time and increase engagement.</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowNewRule(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Create Rule
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeTab === 'rules' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('rules')}
          icon={<Bot className="w-4 h-4" />}
        >
          Rules
        </Button>
        <Button
          variant={activeTab === 'templates' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('templates')}
          icon={<MessageSquare className="w-4 h-4" />}
        >
          Templates
        </Button>
        <Button
          variant={activeTab === 'settings' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('settings')}
          icon={<Settings className="w-4 h-4" />}
        >
          Settings
        </Button>
      </div>

      {/* Rules List */}
      {activeTab === 'rules' && (
        <div className="grid gap-4">
          {automationRules.map((rule) => (
            <Card key={rule.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${
                      rule.type === 'message'
                        ? 'bg-blue-500/20 text-blue-400'
                        : rule.type === 'post'
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-pink-500/20 text-pink-400'
                    }`}>
                      {rule.type === 'message' ? (
                        <MessageSquare className="w-5 h-5" />
                      ) : rule.type === 'post' ? (
                        <Calendar className="w-5 h-5" />
                      ) : (
                        <Zap className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{rule.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          rule.active
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {rule.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="mt-2 space-y-2">
                        <div>
                          <p className="text-sm text-gray-400">When:</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {rule.conditions.map((condition, i) => (
                              <span
                                key={i}
                                className="text-xs px-2 py-1 rounded-full bg-purple-900/20"
                              >
                                {condition}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Then:</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {rule.actions.map((action, i) => (
                              <span
                                key={i}
                                className="text-xs px-2 py-1 rounded-full bg-purple-900/20"
                              >
                                {action}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Edit2 className="w-4 h-4" />}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Toggle className="w-4 h-4" />}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Trash2 className="w-4 h-4" />}
                      className="text-red-400 hover:text-red-300"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Templates */}
      {activeTab === 'templates' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Message Templates</h3>
              <Button
                variant="outline"
                size="sm"
                icon={<Plus className="w-4 h-4" />}
              >
                Add Template
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Welcome Message', 'Follow-up', 'Special Offer'].map((template, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-lg bg-purple-900/20"
                >
                  <div>
                    <h4 className="font-medium">{template}</h4>
                    <p className="text-sm text-gray-400">
                      Used in {Math.floor(Math.random() * 10)} automation rules
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Edit2 className="w-4 h-4" />}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Trash2 className="w-4 h-4" />}
                      className="text-red-400 hover:text-red-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings */}
      {activeTab === 'settings' && (
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Automation Settings</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-4">General Settings</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-purple-900/20">
                    <div>
                      <p className="font-medium">Enable AI Responses</p>
                      <p className="text-sm text-gray-400">
                        Let AI handle common messages and interactions
                      </p>
                    </div>
                    <div className="w-12 h-6 bg-purple-900/40 rounded-full relative cursor-pointer">
                      <div className="absolute top-1 left-1 w-4 h-4 bg-purple-400 rounded-full" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-purple-900/20">
                    <div>
                      <p className="font-medium">Auto-Schedule Posts</p>
                      <p className="text-sm text-gray-400">
                        Automatically schedule posts for optimal engagement times
                      </p>
                    </div>
                    <div className="w-12 h-6 bg-purple-900/40 rounded-full relative cursor-pointer">
                      <div className="absolute top-1 right-1 w-4 h-4 bg-purple-400 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">Notification Settings</h4>
                <div className="space-y-4">
                  {[
                    'When automation rule is triggered',
                    'When AI responds to messages',
                    'When scheduled post is published'
                  ].map((setting, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 rounded-lg bg-purple-900/20"
                    >
                      <p>{setting}</p>
                      <div className="w-12 h-6 bg-purple-900/40 rounded-full relative cursor-pointer">
                        <div className={`absolute top-1 ${
                          i % 2 === 0 ? 'right-1' : 'left-1'
                        } w-4 h-4 bg-purple-400 rounded-full`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* New Rule Modal */}
      <AnimatePresence>
        {showNewRule && (
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
                    <h3 className="text-xl font-semibold">Create Automation Rule</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<X className="w-4 h-4" />}
                      onClick={() => setShowNewRule(false)}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Rule Name
                      </label>
                      <Input placeholder="Enter rule name..." />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Rule Type
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { icon: <MessageSquare className="w-4 h-4" />, label: 'Message' },
                          { icon: <Calendar className="w-4 h-4" />, label: 'Post' },
                          { icon: <Zap className="w-4 h-4" />, label: 'Engagement' }
                        ].map((type) => (
                          <button
                            key={type.label}
                            className="flex items-center justify-center gap-2 p-3 rounded-lg bg-purple-900/20 hover:bg-purple-900/30"
                          >
                            {type.icon}
                            <span>{type.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Conditions
                      </label>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <select className="flex-1 bg-purple-900/20 border border-purple-800/50 rounded-lg px-3 py-2 text-white">
                            <option>Select condition...</option>
                            <option>Time of day</option>
                            <option>New subscriber</option>
                            <option>Message received</option>
                          </select>
                          <Button
                            variant="outline"
                            size="sm"
                            icon={<Plus className="w-4 h-4" />}
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Actions
                      </label>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <select className="flex-1 bg-purple-900/20 border border-purple-800/50 rounded-lg px-3 py-2 text-white">
                            <option>Select action...</option>
                            <option>Send message</option>
                            <option>Create post</option>
                            <option>Add tag</option>
                          </select>
                          <Button
                            variant="outline"
                            size="sm"
                            icon={<Plus className="w-4 h-4" />}
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowNewRule(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        icon={<CheckCircle className="w-4 h-4" />}
                      >
                        Create Rule
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}