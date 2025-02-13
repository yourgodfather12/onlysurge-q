import React from 'react';
import { motion } from 'framer-motion';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export function Switch({
  checked,
  onChange,
  size = 'md',
  disabled = false,
  className = ''
}: SwitchProps) {
  const sizes = {
    sm: {
      switch: 'w-8 h-4',
      thumb: 'w-3 h-3',
      translate: 'translate-x-4'
    },
    md: {
      switch: 'w-10 h-5',
      thumb: 'w-4 h-4',
      translate: 'translate-x-5'
    },
    lg: {
      switch: 'w-12 h-6',
      thumb: 'w-5 h-5',
      translate: 'translate-x-6'
    }
  };

  return (
    <motion.button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onChange(!checked)}
      className={`
        relative inline-flex shrink-0 cursor-pointer rounded-full
        transition-colors duration-200 ease-in-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-creator-purple-500
        ${checked ? 'bg-creator-purple-500' : 'bg-purple-900/20'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${sizes[size].switch}
        ${className}
      `}
      whileTap={{ scale: 0.95 }}
    >
      <motion.span
        className={`
          pointer-events-none inline-block rounded-full bg-white shadow transform
          ring-0 transition duration-200 ease-in-out
          ${sizes[size].thumb}
        `}
        animate={{
          x: checked ? sizes[size].translate.split('-')[1] : 0
        }}
      />
    </motion.button>
  );
}