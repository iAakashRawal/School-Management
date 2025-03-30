'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ContentPanelProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'info' | 'warning' | 'danger' | 'success';
}

export const ContentPanel = ({ 
  children, 
  className, 
  title,
  variant = 'default'
}: ContentPanelProps) => {
  const variantStyles = {
    default: 'bg-gray-100 dark:bg-neutral-700',
    primary: 'bg-indigo-50 dark:bg-indigo-900/30',
    secondary: 'bg-blue-50 dark:bg-blue-900/30',
    accent: 'bg-purple-50 dark:bg-purple-900/30',
    info: 'bg-cyan-50 dark:bg-cyan-900/30',
    warning: 'bg-amber-50 dark:bg-amber-900/30',
    danger: 'bg-red-50 dark:bg-red-900/30',
    success: 'bg-green-50 dark:bg-green-900/30',
  };

  const titleStyles = {
    default: 'text-gray-700 dark:text-gray-200',
    primary: 'text-indigo-700 dark:text-indigo-200',
    secondary: 'text-blue-700 dark:text-blue-200',
    accent: 'text-purple-700 dark:text-purple-200',
    info: 'text-cyan-700 dark:text-cyan-200',
    warning: 'text-amber-700 dark:text-amber-200',
    danger: 'text-red-700 dark:text-red-200',
    success: 'text-green-700 dark:text-green-200',
  };

  return (
    <div className={cn(
      'p-3 mb-4 rounded-md shadow-md',
      variantStyles[variant],
      className
    )}>
      {title && (
        <h3 className={cn('font-medium mb-2', titleStyles[variant])}>
          {title}
        </h3>
      )}
      <div>
        {children}
      </div>
    </div>
  );
}; 