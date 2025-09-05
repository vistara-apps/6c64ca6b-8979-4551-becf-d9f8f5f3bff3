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

  return (
    <div className={cn(
      'network-node group relative overflow-hidden',
      isConnected && 'border-accent border-opacity-50'
    )}>
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Network icon and status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${network.color}20` }}
          >
            {network.icon}
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">{network.name}</h3>
            <p className="text-sm text-text-secondary">{network.type}</p>
          </div>
        </div>
        
        {connection && (
          <ConnectionStatusIndicator 
            status={connection.status} 
            size="md"
          />
        )}
      </div>

      {/* Network stats */}
      {stats && isConnected && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          {stats.channels && (
            <div className="text-center">
              <div className="text-lg font-semibold text-text-primary">
                {formatNumber(stats.channels)}
              </div>
              <div className="text-xs text-text-secondary">Channels</div>
            </div>
          )}
          {stats.messages && (
            <div className="text-center">
              <div className="text-lg font-semibold text-text-primary">
                {formatNumber(stats.messages)}
              </div>
              <div className="text-xs text-text-secondary">Messages</div>
            </div>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleAction}
          disabled={isLoading}
          className={cn(
            'flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200',
            isConnected
              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
              : 'bg-accent/20 text-accent hover:bg-accent/30',
            isLoading && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Zap className="w-4 h-4" />
          )}
          <span>
            {isLoading 
              ? 'Processing...' 
              : isConnected 
                ? 'Disconnect' 
                : 'Connect'
            }
          </span>
        </button>

        {isConnected && (
          <div className="flex items-center space-x-2">
            <button className="p-2 text-text-secondary hover:text-text-primary transition-colors duration-200">
              <Settings2 className="w-4 h-4" />
            </button>
            <button className="p-2 text-text-secondary hover:text-text-primary transition-colors duration-200">
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Connection pulse effect */}
      {isConnected && (
        <div className="absolute top-2 right-2">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
        </div>
      )}
    </div>
  );
}
