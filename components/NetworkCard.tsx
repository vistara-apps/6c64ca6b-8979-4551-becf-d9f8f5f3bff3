'use client';

import { useState } from 'react';
import { Network, NetworkConnection } from '@/lib/types';
import { cn, formatNumber } from '@/lib/utils';
import { ConnectionStatusIndicator } from './ConnectionStatusIndicator';
import { ExternalLink, Settings2, Zap } from 'lucide-react';

interface NetworkCardProps {
  network: Network;
  connection?: NetworkConnection;
  onConnect?: (networkId: string) => void;
  onDisconnect?: (networkId: string) => void;
  variant?: 'connected' | 'unconnected';
  stats?: {
    channels?: number;
    messages?: number;
    lastActivity?: Date;
  };
}

export function NetworkCard({
  network,
  connection,
  onConnect,
  onDisconnect,
  variant = 'unconnected',
  stats,
}: NetworkCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      if (variant === 'connected' && onDisconnect) {
        await onDisconnect(network.networkId);
      } else if (variant === 'unconnected' && onConnect) {
        await onConnect(network.networkId);
      }
    } catch (error) {
      console.error('Network action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isConnected = variant === 'connected' || connection?.active;
  const statusText = connection?.status || 'disconnected';
  const lastSyncText = connection?.lastSync 
    ? `Last sync: ${connection.lastSync.toLocaleTimeString()}`
    : null;

  return (
    <article 
      className={cn(
        'network-node group relative overflow-hidden card-interactive',
        isConnected && 'border-accent/30'
      )}
      role="article"
      aria-labelledby={`network-${network.networkId}-title`}
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-accent/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Network header with improved hierarchy */}
      <header className="flex items-start justify-between mb-5">
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div 
            className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"
            style={{ backgroundColor: `${network.color}15`, color: network.color }}
            aria-hidden="true"
          >
            {network.icon}
          </div>
          <div className="min-w-0 flex-1">
            <h3 
              id={`network-${network.networkId}-title`}
              className="heading-4 truncate"
            >
              {network.name}
            </h3>
            <p className="body-small text-text-secondary capitalize">
              {network.type}
            </p>
            {lastSyncText && isConnected && (
              <p className="caption mt-1">
                {lastSyncText}
              </p>
            )}
          </div>
        </div>
        
        {/* Status indicator with better accessibility */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          {connection && (
            <>
              <ConnectionStatusIndicator 
                status={connection.status} 
                size="md"
              />
              <span className="sr-only">
                Connection status: {statusText}
              </span>
            </>
          )}
          {isConnected && (
            <div 
              className="w-2 h-2 bg-success rounded-full animate-pulse"
              aria-label="Active connection"
              title="Active connection"
            />
          )}
        </div>
      </header>

      {/* Enhanced network stats with better layout */}
      {stats && isConnected && (
        <div className="mb-5">
          <div className="grid grid-cols-2 gap-4">
            {stats.channels && (
              <div className="text-center p-3 bg-surface/30 rounded-lg">
                <div className="heading-3 text-accent">
                  {formatNumber(stats.channels)}
                </div>
                <div className="caption">Channels</div>
              </div>
            )}
            {stats.messages && (
              <div className="text-center p-3 bg-surface/30 rounded-lg">
                <div className="heading-3 text-primary">
                  {formatNumber(stats.messages)}
                </div>
                <div className="caption">Messages</div>
              </div>
            )}
          </div>
          {stats.lastActivity && (
            <div className="mt-3 text-center">
              <p className="caption">
                Last activity: {stats.lastActivity.toLocaleString()}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Enhanced action buttons with better accessibility */}
      <footer className="flex items-center justify-between gap-3">
        <button
          onClick={handleAction}
          disabled={isLoading}
          className={cn(
            'flex items-center space-x-2 px-5 py-3 rounded-lg font-medium transition-all duration-200 flex-1 justify-center touch-target',
            isConnected
              ? 'bg-error/20 text-error hover:bg-error/30 focus:bg-error/30'
              : 'bg-accent/20 text-accent hover:bg-accent/30 focus:bg-accent/30',
            isLoading && 'opacity-50 cursor-not-allowed'
          )}
          aria-describedby={`network-${network.networkId}-status`}
        >
          {isLoading ? (
            <>
              <div className="loading-spinner" aria-hidden="true" />
              <span>Processing...</span>
              <span className="sr-only">
                {isConnected ? 'Disconnecting from' : 'Connecting to'} {network.name}
              </span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" aria-hidden="true" />
              <span>
                {isConnected ? 'Disconnect' : 'Connect'}
              </span>
            </>
          )}
        </button>

        {/* Secondary actions for connected networks */}
        {isConnected && (
          <div className="flex items-center space-x-1">
            <button 
              className="btn-icon"
              aria-label={`Configure ${network.name} settings`}
              title={`Configure ${network.name} settings`}
            >
              <Settings2 className="w-4 h-4" />
            </button>
            <button 
              className="btn-icon"
              aria-label={`Open ${network.name} in new tab`}
              title={`Open ${network.name} in new tab`}
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        )}
      </footer>

      {/* Hidden status description for screen readers */}
      <div 
        id={`network-${network.networkId}-status`}
        className="sr-only"
      >
        {network.name} is currently {isConnected ? 'connected' : 'disconnected'}.
        {connection?.status && ` Status: ${connection.status}.`}
        {stats?.channels && ` ${stats.channels} channels available.`}
        {stats?.messages && ` ${stats.messages} messages synced.`}
      </div>
    </article>
  );
}
