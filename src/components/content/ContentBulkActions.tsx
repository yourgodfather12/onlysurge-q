import React from 'react';
import { Calendar, Trash2, Download, Share2, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';
import type { ContentItem } from '../../types/database';

interface ContentBulkActionsProps {
  selectedItems: ContentItem[];
  onSchedule: () => void;
  onDelete: () => void;
  onDownload: () => void;
  onShare: () => void;
  onClear: () => void;
}

export function ContentBulkActions({
  selectedItems,
  onSchedule,
  onDelete,
  onDownload,
  onShare,
  onClear
}: ContentBulkActionsProps) {
  if (selectedItems.length === 0) return null;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      className="fixed bottom-0 left-0 right-0 bg-purple-900/90 backdrop-blur-sm border-t border-purple-800/50 p-4 z-50"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm">
            {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            icon={<X className="w-4 h-4" />}
            className="text-gray-400 hover:text-white"
          >
            Clear
          </Button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSchedule}
            icon={<Calendar className="w-4 h-4" />}
            className="w-full"
          >
            Schedule
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onShare}
            icon={<Share2 className="w-4 h-4" />}
            className="w-full"
          >
            Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDownload}
            icon={<Download className="w-4 h-4" />}
            className="w-full"
          >
            Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            icon={<Trash2 className="w-4 h-4" />}
            className="w-full text-red-400 hover:text-red-300"
          >
            Delete
          </Button>
        </div>
      </div>
    </motion.div>
  );
}