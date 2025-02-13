import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { moderateContent } from '../../lib/contentApi';
import type { ContentItem } from '../../types/database';

interface ContentModerationProps {
  content: ContentItem;
  onModerationComplete: (approved: boolean) => void;
}

export function ContentModeration({ content, onModerationComplete }: ContentModerationProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    approved: boolean;
    reason?: string;
  } | null>(null);

  const handleModeration = async () => {
    setLoading(true);
    try {
      const moderationResult = await moderateContent(content.id);
      setResult(moderationResult);
      onModerationComplete(moderationResult.approved);
    } catch (error) {
      console.error('Moderation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Content Moderation
        </h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {result ? (
            <div className={`flex items-center gap-2 ${
              result.approved ? 'text-green-400' : 'text-red-400'
            }`}>
              {result.approved ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
              <span>
                {result.approved
                  ? 'Content approved'
                  : `Content rejected: ${result.reason}`}
              </span>
            </div>
          ) : (
            <Button
              variant="primary"
              onClick={handleModeration}
              loading={loading}
              className="w-full"
              icon={<Shield className="w-4 h-4" />}
            >
              Run Content Moderation
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}