import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  MessageSquare,
  Send,
  Sparkles,
  AlertCircle,
  Copy,
  CheckCircle
} from 'lucide-react';
import { useMessageGeneration } from '../../hooks/useAI';

interface MessageAssistantProps {
  subscriberId: string;
  previousMessages?: string[];
  onMessageGenerated?: (message: string) => void;
}

export function MessageAssistant({
  subscriberId,
  previousMessages = [],
  onMessageGenerated
}: MessageAssistantProps) {
  const [prompt, setPrompt] = useState('');
  const [copied, setCopied] = useState(false);
  const {
    generateResponse,
    isGenerating,
    response,
    error
  } = useMessageGeneration();

  const handleGenerate = async () => {
    try {
      await generateResponse({
        message: prompt,
        context: {
          previousMessages,
          subscriberHistory: {
            id: subscriberId,
            // Add more subscriber context
          }
        }
      });
    } catch (error) {
      console.error('Failed to generate message:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Bot className="w-5 h-5" />
            AI Message Assistant
          </h3>
          <Badge variant="default" icon={<Sparkles className="w-3 h-3" />}>
            AI Powered
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="What kind of message would you like to generate?"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              icon={<MessageSquare className="w-4 h-4" />}
            />
            <Button
              variant="primary"
              onClick={handleGenerate}
              loading={isGenerating}
              disabled={!prompt || isGenerating}
              icon={<Send className="w-4 h-4" />}
            >
              Generate
            </Button>
          </div>

          <AnimatePresence mode="wait">
            {error ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-red-400"
              >
                <AlertCircle className="w-4 h-4" />
                <span>Failed to generate message. Please try again.</span>
              </motion.div>
            ) : response ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Generated Message */}
                <div className="relative p-4 bg-purple-900/20 rounded-lg">
                  <p>{response.content}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      copyToClipboard(response.content);
                      onMessageGenerated?.(response.content);
                    }}
                    icon={copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>

                {/* Message Tone */}
                <div>
                  <p className="text-sm text-gray-400 mb-2">Message Tone</p>
                  <Badge variant="default">{response.tone}</Badge>
                </div>

                {/* Suggested Follow-ups */}
                <div>
                  <p className="text-sm text-gray-400 mb-2">Suggested Follow-ups</p>
                  <div className="space-y-2">
                    {response.suggestedFollowUps.map((followUp: string, i: number) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 bg-purple-900/10 rounded-lg"
                      >
                        <span>{followUp}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(followUp)}
                          icon={<Copy className="w-4 h-4" />}
                        >
                          Copy
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}