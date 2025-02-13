import React from 'react';
import { motion } from 'framer-motion';

interface TabsProps {
  tabs: {
    id: string;
    label: string;
    icon?: React.ReactNode;
    disabled?: boolean;
  }[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function Tabs({ 
  tabs, 
  activeTab, 
  onChange, 
  variant = 'default',
  size = 'md',
  fullWidth = false
}: TabsProps) {
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const variants = {
    pills: (
      <div className={`flex flex-wrap gap-2 ${fullWidth ? 'w-full' : ''}`}>
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => !tab.disabled && onChange(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full transition-colors
              ${sizes[size]}
              ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}
              ${activeTab === tab.id
                ? 'bg-creator-purple-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-purple-900/20'
              }
              ${fullWidth ? 'flex-1' : ''}
            `}
            whileHover={!tab.disabled ? { scale: 1.02 } : undefined}
            whileTap={!tab.disabled ? { scale: 0.98 } : undefined}
          >
            {tab.icon}
            {tab.label}
          </motion.button>
        ))}
      </div>
    ),
    underline: (
      <div className={`flex ${fullWidth ? 'w-full' : ''}`}>
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => !tab.disabled && onChange(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2 relative
              ${sizes[size]}
              ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}
              ${activeTab === tab.id
                ? 'text-white'
                : 'text-gray-400 hover:text-white'
              }
              ${fullWidth ? 'flex-1' : ''}
            `}
          >
            {tab.icon}
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-creator-purple-500"
              />
            )}
          </motion.button>
        ))}
      </div>
    ),
    default: (
      <div className={`relative border-b border-purple-800/30 ${fullWidth ? 'w-full' : ''}`}>
        <div className="flex">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => !tab.disabled && onChange(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 relative
                ${sizes[size]}
                ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                ${activeTab === tab.id
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
                }
                ${fullWidth ? 'flex-1' : ''}
              `}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-creator-purple-500"
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    )
  };

  return variants[variant];
}