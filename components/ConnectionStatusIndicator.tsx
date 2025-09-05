'use client';

import { cn } from '@/lib/utils';

interface ConnectionStatusIndicatorProps {
  status: 'online' | 'offline' | 'pending' | 'error';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function ConnectionStatusIndicator({
  status,
  size = 'md',
  showLabel = false,
}: ConnectionStatusIndicatorProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const statusConfig = {
    online: {
      className: 'connection-indicator online',
      label: 'Online',
      color: 'bg-accent',
    },
    offline: {
      className: 'connection-indicator offline',
      label: 'Offline',
      color: 'bg-gray-500',
    },
    pending: {
      className: 'connection-indicator pending',
      label: 'Connecting',
      color: 'bg-yellow-500',
    },
    error: {
      className: 'connection-indicator error',
      label: 'Error',
      color: 'bg-red-500',
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center space-x-2">
      <div
        className={cn(
          'rounded-full',
          sizeClasses[size],
          config.color,
          status === 'pending' && 'animate-pulse',
          status === 'online' && 'shadow-focus-ring'
        )}
      />
      {showLabel && (
        <span className="text-sm text-gray-400">
          {config.label}
        </span>
      )}
    </div>
  );
}
