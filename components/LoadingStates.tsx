'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export function Skeleton({ className, children, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('loading-pulse bg-surface/50 rounded', className)}
      {...props}
    >
      {children}
    </div>
  );
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div
      className={cn(
        'loading-spinner',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

interface NetworkCardSkeletonProps {
  count?: number;
}

export function NetworkCardSkeleton({ count = 1 }: NetworkCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="network-node animate-pulse"
          role="status"
          aria-label="Loading network information"
        >
          {/* Header skeleton */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center space-x-4 flex-1">
              <Skeleton className="w-14 h-14 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="w-3 h-3 rounded-full" />
              <Skeleton className="w-2 h-2 rounded-full" />
            </div>
          </div>

          {/* Stats skeleton */}
          <div className="mb-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-surface/30 rounded-lg">
                <Skeleton className="h-6 w-8 mx-auto mb-1" />
                <Skeleton className="h-3 w-12 mx-auto" />
              </div>
              <div className="text-center p-3 bg-surface/30 rounded-lg">
                <Skeleton className="h-6 w-8 mx-auto mb-1" />
                <Skeleton className="h-3 w-12 mx-auto" />
              </div>
            </div>
          </div>

          {/* Action buttons skeleton */}
          <div className="flex items-center justify-between gap-3">
            <Skeleton className="h-12 flex-1 rounded-lg" />
            <div className="flex items-center space-x-1">
              <Skeleton className="w-11 h-11 rounded-lg" />
              <Skeleton className="w-11 h-11 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

interface PinnedItemSkeletonProps {
  count?: number;
}

export function PinnedItemSkeleton({ count = 3 }: PinnedItemSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="glass-card p-5 animate-pulse"
          role="status"
          aria-label="Loading pinned item"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3 flex-1">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="w-8 h-8 rounded-lg" />
          </div>
          
          <div className="space-y-2 mb-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      ))}
    </>
  );
}

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  className?: string;
}

export function LoadingOverlay({ 
  isVisible, 
  message = 'Loading...', 
  className 
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 bg-bg/80 backdrop-blur-sm z-50 flex items-center justify-center',
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="glass-card p-8 text-center max-w-sm mx-4">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="body-medium text-text-primary">{message}</p>
      </div>
    </div>
  );
}

interface InlineLoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function InlineLoading({ 
  message = 'Loading...', 
  size = 'md', 
  className 
}: InlineLoadingProps) {
  return (
    <div
      className={cn('flex items-center justify-center space-x-3 py-8', className)}
      role="status"
      aria-live="polite"
    >
      <LoadingSpinner size={size} />
      <span className="body-medium text-text-secondary">{message}</span>
    </div>
  );
}

interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
  showLabel?: boolean;
  label?: string;
}

export function ProgressBar({ 
  progress, 
  className, 
  showLabel = false, 
  label = 'Progress' 
}: ProgressBarProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="body-small text-text-secondary">{label}</span>
          <span className="body-small text-text-secondary">{Math.round(clampedProgress)}%</span>
        </div>
      )}
      <div
        className="w-full bg-surface rounded-full h-2 overflow-hidden"
        role="progressbar"
        aria-valuenow={clampedProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 ease-out"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}
