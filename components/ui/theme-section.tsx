'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ThemeSectionProps {
  children: React.ReactNode;
  className?: string;
  fullHeight?: boolean;
}

export const ThemeSection = ({ children, className, fullHeight = true }: ThemeSectionProps) => {
  return (
    <div 
      className={cn(
        fullHeight ? 'card-section-full' : 'card-section',
        className
      )}
    >
      {children}
    </div>
  );
}; 