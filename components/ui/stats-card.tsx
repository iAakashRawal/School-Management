'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: {
    value: string | number;
    type: 'increase' | 'decrease' | 'neutral';
  };
  className?: string;
  color?: 'pink' | 'purple' | 'indigo' | 'blue' | 'cyan' | 'teal' | 'green' | 'yellow' | 'orange' | 'red';
}

export const StatsCard = ({ 
  title, 
  value, 
  icon, 
  change, 
  className,
  color = 'blue' 
}: StatsCardProps) => {
  const colorStyles = {
    pink: 'bg-pink-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500',
    blue: 'bg-blue-500',
    cyan: 'bg-cyan-500',
    teal: 'bg-teal-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
  };

  const changeStyles = {
    increase: 'text-green-500',
    decrease: 'text-red-500',
    neutral: 'text-gray-500',
  };

  const changeIcons = {
    increase: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    ),
    decrease: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    ),
    neutral: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
      </svg>
    ),
  };

  return (
    <div className={cn(
      'relative bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden',
      className
    )}>
      <div className={cn('h-2', colorStyles[color])}></div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
          {icon && (
            <div className={cn('p-2 rounded-full', `bg-${color}-100 dark:bg-${color}-900/20`, `text-${color}-500`)}>
              {icon}
            </div>
          )}
        </div>
        <div className="flex items-end">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
          {change && (
            <div className={cn('ml-2 flex items-center text-sm', changeStyles[change.type])}>
              {changeIcons[change.type]}
              <span className="ml-1">{change.value}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const StatsCardGrid = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn(
      'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4',
      className
    )}>
      {children}
    </div>
  );
}; 