'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ColorfulSectionProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'rainbow' | 'sunset' | 'ocean' | 'forest' | 'purple';
  fullHeight?: boolean;
}

export const ColorfulSection = ({ 
  children, 
  className, 
  variant = 'rainbow',
  fullHeight = true
}: ColorfulSectionProps) => {
  const variantStyles = {
    rainbow: 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500',
    sunset: 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500',
    ocean: 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500',
    forest: 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500',
    purple: 'bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500',
  };

  return (
    <div 
      className={cn(
        'rounded-lg shadow-lg p-1',
        variantStyles[variant],
        className
      )}
      style={fullHeight ? {
        minHeight: 'calc(100vh - 6rem)',
      } : {}}
    >
      <div className="bg-white dark:bg-neutral-800 rounded-lg h-full p-6 shadow-none">
        {children}
      </div>
    </div>
  );
};

interface ColorAccentProps {
  children: React.ReactNode;
  className?: string;
  color?: 'pink' | 'purple' | 'indigo' | 'blue' | 'cyan' | 'teal' | 'green' | 'yellow' | 'orange' | 'red';
}

export const ColorAccent = ({ 
  children, 
  className, 
  color = 'blue'
}: ColorAccentProps) => {
  const colorStyles = {
    pink: 'border-l-pink-500 bg-pink-50 dark:bg-pink-900/20',
    purple: 'border-l-purple-500 bg-purple-50 dark:bg-purple-900/20',
    indigo: 'border-l-indigo-500 bg-indigo-50 dark:bg-indigo-900/20',
    blue: 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20',
    cyan: 'border-l-cyan-500 bg-cyan-50 dark:bg-cyan-900/20',
    teal: 'border-l-teal-500 bg-teal-50 dark:bg-teal-900/20',
    green: 'border-l-green-500 bg-green-50 dark:bg-green-900/20',
    yellow: 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
    orange: 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/20',
    red: 'border-l-red-500 bg-red-50 dark:bg-red-900/20',
  };

  return (
    <div className={cn(
      'p-4 rounded-md border-l-4 shadow-md',
      colorStyles[color],
      className
    )}>
      {children}
    </div>
  );
};

interface ColorfulCardProps {
  children: React.ReactNode;
  className?: string;
  color?: 'pink' | 'purple' | 'indigo' | 'blue' | 'cyan' | 'teal' | 'green' | 'yellow' | 'orange' | 'red';
  title?: string;
}

export const ColorfulCard = ({ 
  children, 
  className, 
  color = 'blue',
  title
}: ColorfulCardProps) => {
  const colorStyles = {
    pink: 'bg-gradient-to-b from-white to-pink-50 dark:from-neutral-800 dark:to-pink-900/10',
    purple: 'bg-gradient-to-b from-white to-purple-50 dark:from-neutral-800 dark:to-purple-900/10',
    indigo: 'bg-gradient-to-b from-white to-indigo-50 dark:from-neutral-800 dark:to-indigo-900/10',
    blue: 'bg-gradient-to-b from-white to-blue-50 dark:from-neutral-800 dark:to-blue-900/10',
    cyan: 'bg-gradient-to-b from-white to-cyan-50 dark:from-neutral-800 dark:to-cyan-900/10',
    teal: 'bg-gradient-to-b from-white to-teal-50 dark:from-neutral-800 dark:to-teal-900/10',
    green: 'bg-gradient-to-b from-white to-green-50 dark:from-neutral-800 dark:to-green-900/10',
    yellow: 'bg-gradient-to-b from-white to-yellow-50 dark:from-neutral-800 dark:to-yellow-900/10',
    orange: 'bg-gradient-to-b from-white to-orange-50 dark:from-neutral-800 dark:to-orange-900/10',
    red: 'bg-gradient-to-b from-white to-red-50 dark:from-neutral-800 dark:to-red-900/10',
  };

  const headerStyles = {
    pink: 'bg-pink-500 text-white',
    purple: 'bg-purple-500 text-white',
    indigo: 'bg-indigo-500 text-white',
    blue: 'bg-blue-500 text-white',
    cyan: 'bg-cyan-500 text-white',
    teal: 'bg-teal-500 text-white',
    green: 'bg-green-500 text-white',
    yellow: 'bg-yellow-500 text-white',
    orange: 'bg-orange-500 text-white',
    red: 'bg-red-500 text-white',
  };

  return (
    <div className={cn(
      'rounded-lg shadow-md overflow-hidden border-0',
      colorStyles[color],
      className
    )}>
      {title && (
        <div className={cn('px-4 py-3 font-medium', headerStyles[color])}>
          {title}
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}; 