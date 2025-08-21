import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  message = '', 
  className = '' 
}) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  const containerClasses = {
    small: 'gap-2',
    medium: 'gap-3',
    large: 'gap-4'
  };

  return (
    <div className={cn(
      'flex flex-col items-center justify-center',
      containerClasses[size],
      className
    )}>
      <div className={cn(
        'animate-spin rounded-full border-2 border-muted border-t-primary',
        sizeClasses[size]
      )} />
      {message && (
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;