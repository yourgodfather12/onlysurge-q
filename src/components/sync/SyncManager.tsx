import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  StopCircle
} from 'lucide-react';
import { useSync, useSyncStatus } from '../../hooks/useSync';

export function SyncManager() {
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const {
    startSync,
    cancelSync,
    isSyncing,
    isCancelling,
    error: syncError
  } = useSync();

  const {
    status: syncStatus,
    isLoading: isLoadingStatus,
    error: statusError
  } = useSyncStatus(activeJobId || undefined);

  const handleStartSync = async () => {
    try {
      const jobId = await startSync({
        platforms: ['onlyfans', 'fansly'],
        contentTypes: ['image', 'video']
      });
      setActiveJobId(jobId);
    } catch (error) {
      console.error('Failed to start sync:', error);
    }
  };

  const handleCancelSync = async () => {
    if (!activeJobId) return;
    try {
      await cancelSync(activeJobId);
    } catch (error) {
      console.error('Failed to cancel sync:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Content Synchronization</h3>
          <Button
            variant="primary"
            onClick={handleStartSync}
            loading={isSyncing}
            disabled={isSyncing || !!activeJobId}
            icon={<RefreshCw className="w-4 h-4" />}
          >
            Start Sync
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {(syncError || statusError) && (
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span>
                {syncError
                  ? 'Failed to start sync'
                  : 'Failed to get sync status'}
              </span>
            </div>
          )}

          {activeJobId && syncStatus && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {syncStatus.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : syncStatus.status === 'failed' ? (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  ) : (
                    <Clock className="w-5 h-5 text-yellow-400" />
                  )}
                  <span className="font-medium">
                    {syncStatus.status.charAt(0).toUpperCase() +
                      syncStatus.status.slice(1)}
                  </span>
                </div>
                {syncStatus.status === 'pending' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelSync}
                    loading={isCancelling}
                    icon={<StopCircle className="w-4 h-4" />}
                  >
                    Cancel
                  </Button>
                )}
              </div>

              {syncStatus.status === 'processing' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{syncStatus.progress || 0}%</span>
                  </div>
                  <Progress value={syncStatus.progress || 0} />
                </div>
              )}

              {syncStatus.result && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-purple-900/20 rounded-lg">
                    <p className="text-sm text-gray-400">Synced Items</p>
                    <p className="text-xl font-bold">
                      {syncStatus.result.syncedCount}
                    </p>
                  </div>
                  <div className="p-4 bg-purple-900/20 rounded-lg">
                    <p className="text-sm text-gray-400">Failed Items</p>
                    <p className="text-xl font-bold">
                      {syncStatus.result.failedCount}
                    </p>
                  </div>
                </div>
              )}

              {syncStatus.error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm text-red-400">{syncStatus.error}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}