import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Checkbox({ label, className = '', ...props }: CheckboxProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          {...props}
        />
        <motion.div
          className={`w-5 h-5 border-2 rounded transition-colors ${
            props.checked
              ? 'bg-creator-purple-500 border-creator-purple-500'
              : 'border-purple-800/50 hover:border-creator-purple-500'
          } ${className}`}
          whileTap={{ scale: 0.9 }}
        >
          {props.checked && (
            <Check className="w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          )}
        </motion.div>
      </div>
      {label && <span className="text-sm">{label}</span>}
    </label>
  );
}