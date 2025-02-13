import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Link,
  Unlink,
  RefreshCw,
  Settings,
  AlertCircle,
  CheckCircle,
  Lock
} from 'lucide-react';
import { usePlatformConnections } from '../../hooks/usePlatform';
import { OnlyFansAPI } from '../../lib/api/platforms/onlyfans';
import { FanslyAPI } from '../../lib/api/platforms/fansly';

interface PlatformConnectorProps {
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export function PlatformConnector({ onConnect, onDisconnect }: PlatformConnectorProps) {
  const [showSettings, setShowSettings] = useState(false);
  const {
    connections,
    isLoading,
    error,
    createConnection,
    deleteConnection,
    isCreating,
    isDeleting
  } = usePlatformConnections();

  const handleConnect = async (platform: 'onlyfans' | 'fansly') => {
    try {
      if (platform === 'onlyfans') {
        // Show manual connection instructions for OnlyFans
        setShowSettings(true);
      } else {
        // Redirect to Fansly OAuth
        window.location.href = `https://fansly.com/oauth/authorize?client_id=${
          import.meta.env.VITE_FANSLY_CLIENT_ID
        }&redirect_uri=${encodeURIComponent(
          `${window.location.origin}/auth/fansly/callback`
        )}&response_type=code&scope=basic,post,message`;
      }
    } catch (error) {
      console.error(`Failed to connect to ${platform}:`, error);
    }
  };

  const handleDisconnect = async (connectionId: string) => {
    try {
      await deleteConnection(connectionId);
      onDisconnect?.();
    } catch (error) {
      console.error('Failed to disconnect platform:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Platform Connections</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            icon={<Settings className="w-4 h-4" />}
          >
            Settings
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {error ? (
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span>Failed to load platform connections</span>
            </div>
          ) : (
            <div className="grid gap-4">
              {/* OnlyFans */}
              <div className="flex items-center justify-between p-4 bg-purple-900/20 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-purple-900/40 rounded-lg">
                    <Lock className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-medium">OnlyFans</h4>
                    <p className="text-sm text-gray-400">
                      {connections?.find(c => c.platform === 'onlyfans')
                        ? 'Connected'
                        : 'Not connected'}
                    </p>
                  </div>
                </div>
                {connections?.find(c => c.platform === 'onlyfans') ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDisconnect(
                      connections.find(c => c.platform === 'onlyfans')!.id
                    )}
                    loading={isDeleting}
                    icon={<Unlink className="w-4 h-4" />}
                  >
                    Disconnect
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleConnect('onlyfans')}
                    loading={isCreating}
                    icon={<Link className="w-4 h-4" />}
                  >
                    Connect
                  </Button>
                )}
              </div>

              {/* Fansly */}
              <div className="flex items-center justify-between p-4 bg-purple-900/20 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-purple-900/40 rounded-lg">
                    <img
                      src="https://fansly.com/favicon.ico"
                      alt="Fansly"
                      className="w-6 h-6"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">Fansly</h4>
                    <p className="text-sm text-gray-400">
                      {connections?.find(c => c.platform === 'fansly')
                        ? 'Connected'
                        : 'Not connected'}
                    </p>
                  </div>
                </div>
                {connections?.find(c => c.platform === 'fansly') ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDisconnect(
                      connections.find(c => c.platform === 'fansly')!.id
                    )}
                    loading={isDeleting}
                    icon={<Unlink className="w-4 h-4" />}
                  >
                    Disconnect
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleConnect('fansly')}
                    loading={isCreating}
                    icon={<Link className="w-4 h-4" />}
                  >
                    Connect
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Settings Modal */}
          <AnimatePresence>
            {showSettings && (
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
                        <h3 className="text-xl font-semibold">Platform Settings</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowSettings(false)}
                          icon={<X className="w-4 h-4" />}
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* OnlyFans Manual Connection */}
                        <div>
                          <h4 className="font-medium mb-4">OnlyFans Connection</h4>
                          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
                            <div className="flex items-center gap-2 text-yellow-400 mb-2">
                              <AlertCircle className="w-5 h-5" />
                              <span className="font-medium">Manual Connection Required</span>
                            </div>
                            <p className="text-sm text-gray-400">
                              Due to OnlyFans restrictions, you'll need to manually manage your content.
                              We'll provide scheduling reminders and analytics tracking.
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                              window.open('https://onlyfans.com/my/settings/account');
                            }}
                          >
                            Open OnlyFans Settings
                          </Button>
                        </div>

                        {/* Fansly Settings */}
                        <div>
                          <h4 className="font-medium mb-4">Fansly Settings</h4>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-purple-900/20 rounded-lg">
                              <div>
                                <p className="font-medium">Auto-Sync Content</p>
                                <p className="text-sm text-gray-400">
                                  Automatically sync content changes
                                </p>
                              </div>
                              <div className="w-12 h-6 bg-purple-900/40 rounded-full relative cursor-pointer">
                                <div className="absolute top-1 right-1 w-4 h-4 bg-purple-400 rounded-full" />
                              </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-purple-900/20 rounded-lg">
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

                        {/* Webhook Settings */}
                        <div>
                          <h4 className="font-medium mb-4">Webhooks</h4>
                          <div className="space-y-2">
                            <Input
                              label="Webhook URL"
                              placeholder="Enter your webhook URL"
                            />
                            <div className="flex flex-wrap gap-2">
                              {['content.created', 'content.updated', 'message.received'].map((event) => (
                                <Badge
                                  key={event}
                                  variant="outline"
                                  className="cursor-pointer"
                                >
                                  {event}
                                </Badge>
                              ))}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full mt-2"
                            >
                              Add Webhook
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}