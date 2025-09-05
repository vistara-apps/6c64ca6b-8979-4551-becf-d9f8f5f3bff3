'use client';

import { cn } from '@/lib/utils';
import { LucideIcon, Globe, Pin, Search, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  size = 'md',
}: EmptyStateProps) {
  const sizeClasses = {
    sm: {
      container: 'py-8 px-6',
      icon: 'w-8 h-8 mb-3',
      title: 'heading-4',
      description: 'body-small',
    },
    md: {
      container: 'py-12 px-8',
      icon: 'w-12 h-12 mb-4',
      title: 'heading-3',
      description: 'body-medium',
    },
    lg: {
      container: 'py-16 px-10',
      icon: 'w-16 h-16 mb-6',
      title: 'heading-2',
      description: 'body-large',
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div
      className={cn(
        'glass-card text-center animate-fade-in',
        currentSize.container,
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center">
        <div className="p-4 bg-surface/50 rounded-full mb-4">
          <Icon 
            className={cn(currentSize.icon, 'text-text-tertiary')}
            aria-hidden="true"
          />
        </div>
        
        <h3 className={cn(currentSize.title, 'text-text-primary mb-2')}>
          {title}
        </h3>
        
        <p className={cn(currentSize.description, 'text-text-secondary max-w-md')}>
          {description}
        </p>
        
        {action && (
          <button
            onClick={action.onClick}
            className={cn(
              'mt-6 px-6 py-3 rounded-lg font-medium transition-all duration-200 touch-target',
              action.variant === 'primary' || !action.variant
                ? 'btn-primary'
                : 'btn-secondary'
            )}
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}

// Specialized empty state components for common use cases
interface NetworkEmptyStateProps {
  onConnect?: () => void;
  className?: string;
}

export function NetworkEmptyState({ onConnect, className }: NetworkEmptyStateProps) {
  return (
    <EmptyState
      icon={Globe}
      title="No Networks Connected"
      description="Connect to your communication networks to start unifying your messages and content across platforms."
      action={onConnect ? {
        label: "Connect Your First Network",
        onClick: onConnect,
        variant: 'primary'
      } : undefined}
      className={className}
    />
  );
}

interface PinnedEmptyStateProps {
  onExplore?: () => void;
  className?: string;
}

export function PinnedEmptyState({ onExplore, className }: PinnedEmptyStateProps) {
  return (
    <EmptyState
      icon={Pin}
      title="No Pinned Items Yet"
      description="Pin important messages, links, and content from your connected networks to access them quickly here."
      action={onExplore ? {
        label: "Explore Networks",
        onClick: onExplore,
        variant: 'secondary'
      } : undefined}
      className={className}
      size="md"
    />
  );
}

interface SearchEmptyStateProps {
  query: string;
  onClear?: () => void;
  className?: string;
}

export function SearchEmptyState({ query, onClear, className }: SearchEmptyStateProps) {
  return (
    <EmptyState
      icon={Search}
      title="No Results Found"
      description={`We couldn't find anything matching "${query}". Try adjusting your search terms or browse all available options.`}
      action={onClear ? {
        label: "Clear Search",
        onClick: onClear,
        variant: 'secondary'
      } : undefined}
      className={className}
      size="sm"
    />
  );
}

interface ErrorEmptyStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorEmptyState({ 
  title = "Something Went Wrong",
  description = "We encountered an error while loading this content. Please try again or contact support if the problem persists.",
  onRetry,
  className 
}: ErrorEmptyStateProps) {
  return (
    <EmptyState
      icon={AlertCircle}
      title={title}
      description={description}
      action={onRetry ? {
        label: "Try Again",
        onClick: onRetry,
        variant: 'primary'
      } : undefined}
      className={className}
    />
  );
}

interface LoadingEmptyStateProps {
  title?: string;
  description?: string;
  className?: string;
}

export function LoadingEmptyState({ 
  title = "Loading...",
  description = "Please wait while we fetch your data.",
  className 
}: LoadingEmptyStateProps) {
  return (
    <div
      className={cn(
        'glass-card text-center py-12 px-8 animate-fade-in',
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center">
        <div className="p-4 bg-surface/50 rounded-full mb-4">
          <div className="w-12 h-12 loading-spinner text-text-tertiary" />
        </div>
        
        <h3 className="heading-3 text-text-primary mb-2">
          {title}
        </h3>
        
        <p className="body-medium text-text-secondary max-w-md">
          {description}
        </p>
      </div>
    </div>
  );
}
