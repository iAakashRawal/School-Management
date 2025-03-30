'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface FullHeightSectionProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
}

export const FullHeightSection = ({ children, className, innerClassName }: FullHeightSectionProps) => {
  return (
    <div 
      className={cn(
        'card-section-full flex flex-col',
        className
      )}
      style={{
        minHeight: 'calc(100vh - 7rem)', /* 4rem header + 1.5rem top padding + 1.5rem bottom padding */
      }}
    >
      <div className={cn(
        'bg-gray-100 dark:bg-neutral-700 rounded-md p-3 mb-4',
        innerClassName
      )}>
        {children}
      </div>
    </div>
  );
}; 