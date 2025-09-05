'use client';

import { useState } from 'react';
import { FarcasterChannel } from '@/lib/types';
import { cn, formatNumber } from '@/lib/utils';
import { Check, Search } from 'lucide-react';

interface ChannelSelectorProps {
  channels: FarcasterChannel[];
  selectedChannels: string[];
  onSelectionChange: (channelIds: string[]) => void;
  variant?: 'multiSelect';
  maxSelections?: number;
}

export function ChannelSelector({
  channels,
  selectedChannels,
  onSelectionChange,
  variant = 'multiSelect',
  maxSelections,
}: ChannelSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    channel.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChannelToggle = (channelId: string) => {
    const isSelected = selectedChannels.includes(channelId);
    
    if (isSelected) {
      // Remove from selection
      onSelectionChange(selectedChannels.filter(id => id !== channelId));
    } else {
      // Add to selection (check max limit)
      if (maxSelections && selectedChannels.length >= maxSelections) {
        return; // Don't add if at max limit
      }
      onSelectionChange([...selectedChannels, channelId]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search channels..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors duration-200"
        />
      </div>

      {/* Selection summary */}
      {selectedChannels.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-accent/10 border border-accent/20 rounded-lg">
          <span className="text-sm text-gray-100">
            {selectedChannels.length} channel{selectedChannels.length !== 1 ? 's' : ''} selected
          </span>
          {maxSelections && (
            <span className="text-xs text-gray-400">
              {selectedChannels.length}/{maxSelections}
            </span>
          )}
        </div>
      )}

      {/* Channel list */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredChannels.map((channel) => {
          const isSelected = selectedChannels.includes(channel.id);
          const isDisabled = Boolean(maxSelections && 
            !isSelected && 
            selectedChannels.length >= maxSelections);

          return (
            <button
              key={channel.id}
              onClick={() => handleChannelToggle(channel.id)}
              disabled={isDisabled}
              className={cn(
                'w-full p-4 rounded-lg border transition-all duration-200 text-left',
                isSelected
                  ? 'bg-accent/20 border-accent text-gray-100'
                  : 'bg-slate-800 border-gray-600 hover:border-gray-500 text-gray-100',
                isDisabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {channel.imageUrl && (
                    <img
                      src={channel.imageUrl}
                      alt={channel.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <h4 className="font-medium">{channel.name}</h4>
                    {channel.description && (
                      <p className="text-sm text-gray-400 line-clamp-1">
                        {channel.description}
                      </p>
                    )}
                    {channel.followerCount && (
                      <p className="text-xs text-gray-400 mt-1">
                        {formatNumber(channel.followerCount)} followers
                      </p>
                    )}
                  </div>
                </div>
                
                {isSelected && (
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {filteredChannels.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>No channels found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
}
