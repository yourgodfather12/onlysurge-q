import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Link,
  Plus,
  Settings,
  CheckCircle,
  AlertCircle,
  X,
  RefreshCw,
  Lock
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
}

export function Integrations() {
  const [showSettings, setShowSettings] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  const integrations: Integration[] = [
    {
      id: 'onlyfans',
      name: 'OnlyFans',
      description: 'Connect your OnlyFans account to manage content and messages.',
      icon: 'https://source.unsplash.com/random/100x100?logo',
      status: 'connected',
      lastSync: '5 minutes ago'
    },
    {
      id: 'fansly',
      name: 'Fansly',
      description: 'Sync your Fansly account for cross-platform management.',
      icon: 'https://source.unsplash.com/random/100x100?brand',
      status: 'connected',
      lastSync: '10 minutes ago'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      description: 'Share and schedule content to Instagram.',
      icon: 'https://source.unsplash.com/random/100x100?social',
      status: 'disconnected'
    },
    {
      id: 'twitter',
      name: 'Twitter',
      description: 'Automatically post updates to Twitter.',
      icon: 'https://source.unsplash.com/random/100x100?bird',
      status: 'error'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Integrations</h1>
          <p className="text-gray-400">Connect and manage your platform integrations.</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowSettings(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Integration
        </Button>
      </div>

      {/* Active Integrations */}
      <div className="grid md:grid-cols-2 gap-6">
        {integrations.map((integration) => (
          <Card key={integration.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <img
                  src={integration.icon}
                  alt={integration.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{integration.name}</h3>
                      <p className="text-sm text-gray-400">{integration.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      integration.status === 'connected'
                        ? 'bg-green-500/20 text-green-400'
                        : integration.status === 'error'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {integration.status}
                    </span>
                  </div>
                  {integration.status === 'connected' && (
                    <div className="flex items-center gap-4 mt-4">
                      <span className="text-sm text-gray-400">
                        Last sync: {integration.lastSync}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<RefreshCw className="w-4 h-4" />}
                        >
                          Sync
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Settings className="w-4 h-4" />}
                          onClick={() => setSelectedIntegration(integration)}
                        >
                          Settings
                        </Button>
                      </div>
                    </div>
                  )}
                  {integration.status === 'disconnected' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      icon={<Link className="w-4 h-4" />}
                    >
                      Connect
                    </Button>
                  )}
                  {integration.status === 'error' && (
                    <div className="flex items-center gap-2 mt-4 text-sm text-red-400">
                      <AlertCircle className="w-4 h-4" />
                      <span>Connection error. Please reconnect.</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Available Integrations */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Available Integrations</h2>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              'TikTok',
              'YouTube',
              'Discord',
              'Telegram',
              'Reddit',
              'Snapchat'
            ].map((platform, i) => (
              <div
                key={i}
                className="p-4 rounded-lg bg-purple-900/20 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={`https://source.unsplash.com/random/100x100?logo${i}`}
                    alt={platform}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  <span>{platform}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Plus className="w-4 h-4" />}
                >
                  Add
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Integration Settings Modal */}
      <AnimatePresence>
        {selectedIntegration && (
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
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedIntegration.icon}
                        alt={selectedIntegration.name}
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                      <h3 className="text-xl font-semibold">
                        {selectedIntegration.name} Settings
                      </h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<X className="w-4 h-4" />}
                      onClick={() => setSelectedIntegration(null)}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-4">Sync Settings</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-purple-900/20">
                          <div>
                            <p className="font-medium">Auto-Sync</p>
                            <p className="text-sm text-gray-400">
                              Automatically sync content changes
                            </p>
                          </div>
                          <div className="w-12 h-6 bg-purple-900/40 rounded-full relative cursor-pointer">
                            <div className="absolute top-1 right-1 w-4 h-4 bg-purple-400 rounded-full" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-purple-900/20">
                          <div>
                            <p className="font-medium">Sync Frequency</p>
                            <p className="text-sm text-gray-400">
                              How often to check for changes
                            </p>
                          </div>
                          <select className="bg-purple-900/40 border border-purple-800/50 rounded-lg px-3 py-2 text-white">
                            <option>5 minutes</option>
                            <option>15 minutes</option>
                            <option>30 minutes</option>
                            <option>1 hour</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-4">API Settings</h4>
                      <div className="space-y-4">
                        <Input
                          label="API Key"
                          type="password"
                          value="••••••••••••••••"
                          icon={<Lock className="w-4 h-4" />}
                        />
                        <Input
                          label="Webhook URL"
                          value="https://api.onlysurge.com/webhook"
                          icon={<Link className="w-4 h-4" />}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        className="text-red-400 hover:text-red-300"
                      >
                        Disconnect
                      </Button>
                      <Button variant="primary">Save Changes</Button>
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