import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  className = ''
}: SkeletonProps) {
  const baseStyles = 'bg-purple-900/20 animate-pulse';
  
  const variants = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };

  const styles = {
    width: width || (variant === 'text' ? '100%' : 'auto'),
    height: height || (variant === 'text' ? '1em' : 'auto')
  };

  return (
    <motion.div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={styles}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    />
  );
}