'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface PanelProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
}

export const Panel = ({ children, className, variant = 'default' }: PanelProps) => {
  const variantStyles = {
    default: 'bg-gray-100 dark:bg-neutral-700',
    primary: 'bg-indigo-100 dark:bg-indigo-900',
    secondary: 'bg-blue-100 dark:bg-blue-900',
    accent: 'bg-purple-100 dark:bg-purple-900',
  };

  return (
    <div className={cn(
      'rounded-md p-3 mb-4',
      variantStyles[variant],
      className
    )}>
      {children}
    </div>
  );
};

interface SectionWithPanelsProps {
  children: React.ReactNode;
  className?: string;
  fullHeight?: boolean;
}

export const SectionWithPanels = ({ 
  children, 
  className,
  fullHeight = true
}: SectionWithPanelsProps) => {
  return (
    <div 
      className={cn(
        fullHeight ? 'card-section-full' : 'card-section',
        'flex flex-col',
        className
      )}
      style={fullHeight ? {
        minHeight: 'calc(100vh - 7rem)',
      } : {}}
    >
      {children}
    </div>
  );
}; 