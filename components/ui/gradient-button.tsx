'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'rainbow' | 'sunset' | 'ocean' | 'forest' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  outline?: boolean;
}

export const GradientButton = ({ 
  children, 
  className,
  variant = 'rainbow',
  size = 'md',
  outline = false,
  ...props
}: GradientButtonProps) => {
  const variantStyles = {
    rainbow: 'from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600',
    sunset: 'from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600',
    ocean: 'from-cyan-500 via-blue-500 to-indigo-500 hover:from-cyan-600 hover:via-blue-600 hover:to-indigo-600',
    forest: 'from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600',
    purple: 'from-purple-500 via-fuchsia-500 to-pink-500 hover:from-purple-600 hover:via-fuchsia-600 hover:to-pink-600',
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  if (outline) {
    return (
      <button
        className={cn(
          'relative rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-800',
          sizeStyles[size],
          className
        )}
        {...props}
      >
        <span className={cn(
          'absolute inset-0 rounded-md bg-gradient-to-r animate-gradient shadow-md',
          variantStyles[variant]
        )}></span>
        <span className="absolute inset-[1px] rounded-md bg-white dark:bg-neutral-800"></span>
        <span className={cn(
          'relative bg-clip-text text-transparent bg-gradient-to-r animate-gradient',
          variantStyles[variant]
        )}>
          {children}
        </span>
      </button>
    );
  }

  return (
    <button
      className={cn(
        'relative rounded-md font-medium text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-800 shadow-md',
        sizeStyles[size],
        className
      )}
      {...props}
    >
      <span className={cn(
        'absolute inset-0 rounded-md bg-gradient-to-r animate-gradient',
        variantStyles[variant]
      )}></span>
      <span className="relative">
        {children}
      </span>
    </button>
  );
}; 