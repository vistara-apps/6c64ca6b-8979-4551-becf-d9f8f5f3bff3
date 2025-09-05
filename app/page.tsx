'use client';

import { useState, useEffect } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Name, Avatar } from '@coinbase/onchainkit/identity';
import { NetworkCard } from '@/components/NetworkCard';
import { PinnedItem } from '@/components/PinnedItem';
import { ChannelSelector } from '@/components/ChannelSelector';
import { NetworkVisualization } from '@/components/NetworkVisualization';
import { SUPPORTED_NETWORKS, MOCK_FARCASTER_CHANNELS, MOCK_CASTS } from '@/lib/constants';
import { Network, NetworkConnection, PinnedItem as PinnedItemType, FarcasterChannel } from '@/lib/types';
import { Search, Plus, Filter, Zap, Globe, MessageSquare, Pin, Settings2 } from 'lucide-react';

export default function HomePage() {
  const { setFrameReady } = useMiniKit();
  const [activeTab, setActiveTab] = useState<'networks' | 'pinned' | 'routing'>('networks');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [connectedNetworks, setConnectedNetworks] = useState<NetworkConnection[]>([]);
  const [pinnedItems, setPinnedItems] = useState<PinnedItemType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize MiniKit
  useEffect(() => {
    setFrameReady();
  }, [setFrameReady]);

  // Mock data initialization
  useEffect(() => {
    // Simulate some connected networks
    setConnectedNetworks([
      {
        connectionId: '1',
        userId: 'user1',
        networkId: 'farcaster',
        active: true,
        status: 'online',
        lastSync: new Date(),
      },
      {
        connectionId: '2',
        userId: 'user1',
        networkId: 'discord',
        active: true,
        status: 'pending',
      },
    ]);

    // Simulate some pinned items
    setPinnedItems([
      {
        itemId: '1',
        userId: 'user1',
        sourceNetwork: 'farcaster',
        sourceMessageId: '0x123',
        content: 'Just shipped a new feature for cross-chain messaging! The future of communication is here 🚀 https://example.com/feature',
        title: 'New Cross-Chain Feature',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        type: 'message',
        tags: ['development', 'blockchain'],
      },
      {
        itemId: '2',
        userId: 'user1',
        sourceNetwork: 'discord',
        sourceMessageId: 'msg456',
        content: 'Important meeting notes from the team sync. Key decisions made about the roadmap.',
        title: 'Team Sync Notes',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        type: 'message',
        tags: ['meeting', 'roadmap'],
      },
    ]);
  }, []);

  const handleNetworkConnect = async (networkId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newConnection: NetworkConnection = {
        connectionId: Date.now().toString(),
        userId: 'user1',
        networkId,
        active: true,
        status: 'online',
        lastSync: new Date(),
      };
      
      setConnectedNetworks(prev => [...prev, newConnection]);
    } catch (error) {
      console.error('Failed to connect network:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNetworkDisconnect = async (networkId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setConnectedNetworks(prev => 
        prev.filter(conn => conn.networkId !== networkId)
      );
    } catch (error) {
      console.error('Failed to disconnect network:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnpinItem = async (itemId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPinnedItems(prev => prev.filter(item => item.itemId !== itemId));
    } catch (error) {
      console.error('Failed to unpin item:', error);
    }
  };

  const handlePinCast = async (castHash: string) => {
    const cast = MOCK_CASTS.find(c => c.hash === castHash);
    if (!cast) return;

    const newPinnedItem: PinnedItemType = {
      itemId: Date.now().toString(),
      userId: 'user1',
      sourceNetwork: 'farcaster',
      sourceMessageId: cast.hash,
      content: cast.text,
      timestamp: new Date(cast.timestamp),
      type: 'message',
    };

    setPinnedItems(prev => [newPinnedItem, ...prev]);
  };

  const filteredNetworks = SUPPORTED_NETWORKS.filter(network =>
    network.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const connectedNetworkIds = connectedNetworks.map(conn => conn.networkId);
  const networkStats = {
    total: SUPPORTED_NETWORKS.length,
    connected: connectedNetworks.length,
    active: connectedNetworks.filter(conn => conn.status === 'online').length,
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-bg/80 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-screen-sm mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gradient">Nexus Weaver</h1>
              <p className="text-sm text-gray-400">Unify your communication</p>
            </div>
            
            <Wallet>
              <ConnectWallet>
                <Avatar className="h-8 w-8" />
                <Name />
              </ConnectWallet>
            </Wallet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-sm mx-auto px-4 py-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4">
          <div className="metric-card text-center">
            <div className="text-2xl font-bold text-accent">{networkStats.connected}</div>
            <div className="text-xs text-gray-400">Connected</div>
          </div>
          <div className="metric-card text-center">
            <div className="text-2xl font-bold text-primary">{networkStats.active}</div>
            <div className="text-xs text-gray-400">Active</div>
          </div>
          <div className="metric-card text-center">
            <div className="text-2xl font-bold text-gray-100">{pinnedItems.length}</div>
            <div className="text-xs text-gray-400">Pinned</div>
          </div>
        </div>

        {/* Network Visualization */}
        {connectedNetworks.length > 0 && (
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-gray-100 mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-accent" />
              Network Map
            </h2>
            <NetworkVisualization
              networks={[...SUPPORTED_NETWORKS]}
              connections={connectedNetworks}
            />
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-slate-800 rounded-lg p-1">
          {[
            { id: 'networks', label: 'Networks', icon: Globe },
            { id: 'pinned', label: 'Pinned', icon: Pin },
            { id: 'routing', label: 'Routing', icon: Zap },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-medium transition-all duration-200 ${
                activeTab === id
                  ? 'bg-accent text-white shadow-lg'
                  : 'text-gray-400 hover:text-gray-100 hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'networks' && (
          <div className="space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search networks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors duration-200"
              />
            </div>

            {/* Networks Grid */}
            <div className="grid gap-4">
              {filteredNetworks.map((network) => {
                const connection = connectedNetworks.find(
                  conn => conn.networkId === network.networkId
                );
                const isConnected = !!connection;

                return (
                  <NetworkCard
                    key={network.networkId}
                    network={network}
                    connection={connection}
                    variant={isConnected ? 'connected' : 'unconnected'}
                    onConnect={handleNetworkConnect}
                    onDisconnect={handleNetworkDisconnect}
                    stats={isConnected ? {
                      channels: network.networkId === 'farcaster' ? 12 : undefined,
                      messages: network.networkId === 'farcaster' ? 156 : undefined,
                      lastActivity: new Date(),
                    } : undefined}
                  />
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'pinned' && (
          <div className="space-y-6">
            {/* Recent Casts (for pinning) */}
            {connectedNetworkIds.includes('farcaster') && (
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-accent" />
                  Recent Casts
                </h3>
                <div className="space-y-4">
                  {MOCK_CASTS.map((cast) => (
                    <div key={cast.hash} className="p-4 bg-slate-800/50 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <img
                          src={cast.author.pfpUrl}
                          alt={cast.author.displayName}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium text-gray-100">
                              {cast.author.displayName}
                            </span>
                            <span className="text-gray-400 text-sm">
                              @{cast.author.username}
                            </span>
                          </div>
                          <p className="text-gray-100 text-sm mb-3">
                            {cast.text}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-gray-400 text-sm">
                              <span>{cast.replies} replies</span>
                              <span>{cast.reactions} reactions</span>
                              <span>{cast.recasts} recasts</span>
                            </div>
                            <button
                              onClick={() => handlePinCast(cast.hash)}
                              className="flex items-center space-x-1 px-3 py-1 bg-accent/20 text-accent rounded-full hover:bg-accent/30 transition-colors duration-200"
                            >
                              <Pin className="w-3 h-3" />
                              <span className="text-xs">Pin</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pinned Items */}
            <div>
              <h3 className="text-lg font-semibold text-gray-100 mb-4">
                Your Pinned Items ({pinnedItems.length})
              </h3>
              {pinnedItems.length > 0 ? (
                <div className="space-y-4">
                  {pinnedItems.map((item) => (
                    <PinnedItem
                      key={item.itemId}
                      item={item}
                      onUnpin={handleUnpinItem}
                    />
                  ))}
                </div>
              ) : (
                <div className="glass-card p-8 text-center">
                  <Pin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">
                    No pinned items yet. Pin important messages and links to access them here.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'routing' && (
          <div className="space-y-6">
            {/* Channel Selection */}
            {connectedNetworkIds.includes('farcaster') && (
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center">
                  <Settings2 className="w-5 h-5 mr-2 text-accent" />
                  Configure Routing
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  Select channels to monitor for intelligent message routing.
                </p>
                <ChannelSelector
                  channels={MOCK_FARCASTER_CHANNELS}
                  selectedChannels={selectedChannels}
                  onSelectionChange={setSelectedChannels}
                  maxSelections={5}
                />
              </div>
            )}

            {/* Routing Rules */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-gray-100 mb-4">
                Routing Rules
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-slate-800/50 rounded-lg border border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-100">
                      High Priority Messages
                    </span>
                    <div className="connection-indicator online" />
                  </div>
                  <p className="text-sm text-gray-400">
                    Route messages containing keywords: "urgent", "important", "@everyone"
                  </p>
                </div>
                
                <div className="p-4 bg-slate-800/50 rounded-lg border border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-100">
                      Mentions & DMs
                    </span>
                    <div className="connection-indicator online" />
                  </div>
                  <p className="text-sm text-gray-400">
                    Route all direct mentions and private messages
                  </p>
                </div>
              </div>
              
              <button className="w-full mt-4 btn-secondary">
                <Plus className="w-4 h-4 mr-2" />
                Add New Rule
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
