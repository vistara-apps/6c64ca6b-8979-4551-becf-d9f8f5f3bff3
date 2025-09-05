'use client';

import { useState } from 'react';
import { PinnedItem as PinnedItemType } from '@/lib/types';
import { cn, formatTimestamp, truncateText, extractUrls } from '@/lib/utils';
import { Pin, ExternalLink, Trash2, MessageSquare, Link as LinkIcon } from 'lucide-react';

interface PinnedItemProps {
  item: PinnedItemType;
  onUnpin?: (itemId: string) => void;
  variant?: 'message' | 'link';
}

export function PinnedItem({
  item,
  onUnpin,
  variant,
}: PinnedItemProps) {
  const [isUnpinning, setIsUnpinning] = useState(false);
  
  const urls = extractUrls(item.content);
  const hasUrls = urls.length > 0;
  const displayVariant = variant || (hasUrls ? 'link' : 'message');

  const handleUnpin = async () => {
    if (isUnpinning || !onUnpin) return;
    
    setIsUnpinning(true);
    try {
      await onUnpin(item.itemId);
    } catch (error) {
      console.error('Failed to unpin item:', error);
    } finally {
      setIsUnpinning(false);
    }
  };

  const handleOpenUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="glass-card p-4 group hover:bg-opacity-90 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center',
            displayVariant === 'link' 
              ? 'bg-blue-500/20 text-blue-400' 
              : 'bg-purple-500/20 text-purple-400'
          )}>
            {displayVariant === 'link' ? (
              <LinkIcon className="w-4 h-4" />
            ) : (
              <MessageSquare className="w-4 h-4" />
            )}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-100">
              {item.sourceNetwork}
            </div>
            <div className="text-xs text-gray-400">
              {formatTimestamp(item.timestamp)}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleUnpin}
            disabled={isUnpinning}
            className="p-1.5 text-gray-400 hover:text-red-400 transition-colors duration-200"
            title="Unpin item"
          >
            {isUnpinning ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mb-3">
        {item.title && (
          <h4 className="font-medium text-gray-100 mb-2 line-clamp-2">
            {item.title}
          </h4>
        )}
        <p className="text-gray-400 text-sm leading-relaxed">
          {truncateText(item.content, 200)}
        </p>
      </div>

      {/* URLs */}
      {hasUrls && (
        <div className="space-y-2">
          {urls.slice(0, 2).map((url, index) => (
            <button
              key={index}
              onClick={() => handleOpenUrl(url)}
              className="flex items-center space-x-2 w-full p-2 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors duration-200 text-left"
            >
              <ExternalLink className="w-4 h-4 text-accent flex-shrink-0" />
              <span className="text-sm text-gray-400 truncate">
                {url}
              </span>
            </button>
          ))}
          {urls.length > 2 && (
            <div className="text-xs text-gray-400 text-center">
              +{urls.length - 2} more links
            </div>
          )}
        </div>
      )}

      {/* Tags */}
      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {item.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
          {item.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full">
              +{item.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Pin indicator */}
      <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-40 transition-opacity duration-200">
        <Pin className="w-4 h-4 text-accent" />
      </div>
    </div>
  );
}
