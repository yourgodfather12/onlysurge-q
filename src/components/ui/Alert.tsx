import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

interface AlertProps {
  title?: string;
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export function Alert({
  title,
  children,
  variant = 'info',
  dismissible,
  onDismiss,
  className = ''
}: AlertProps) {
  const variants = {
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      text: 'text-blue-400',
      icon: <Info className="w-5 h-5" />
    },
    success: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      text: 'text-green-400',
      icon: <CheckCircle className="w-5 h-5" />
    },
    warning: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
      text: 'text-yellow-400',
      icon: <AlertTriangle className="w-5 h-5" />
    },
    error: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      text: 'text-red-400',
      icon: <AlertCircle className="w-5 h-5" />
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`
          ${variants[variant].bg}
          ${variants[variant].border}
          border rounded-lg p-4
          ${className}
        `}
      >
        <div className="flex gap-3">
          <div className={variants[variant].text}>
            {variants[variant].icon}
          </div>
          <div className="flex-1">
            {title && (
              <h4 className={`font-medium mb-1 ${variants[variant].text}`}>
                {title}
              </h4>
            )}
            <div className="text-gray-300">{children}</div>
          </div>
          {dismissible && (
            <button
              onClick={onDismiss}
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}