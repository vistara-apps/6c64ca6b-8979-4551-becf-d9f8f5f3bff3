'use client';

import { useState, useEffect } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Name, Avatar } from '@coinbase/onchainkit/identity';
import { NetworkCard } from '@/components/NetworkCard';
import { PinnedItem } from '@/components/PinnedItem';
import { ChannelSelector } from '@/components/ChannelSelector';
import { NetworkVisualization } from '@/components/NetworkVisualization';
import { NetworkCardSkeleton, PinnedItemSkeleton, InlineLoading } from '@/components/LoadingStates';
import { ToastProvider, useSuccessToast, useErrorToast } from '@/components/Toast';
import { NetworkEmptyState, PinnedEmptyState, SearchEmptyState } from '@/components/EmptyState';
import { SUPPORTED_NETWORKS, MOCK_FARCASTER_CHANNELS, MOCK_CASTS } from '@/lib/constants';
import { Network, NetworkConnection, PinnedItem as PinnedItemType, FarcasterChannel } from '@/lib/types';
import { Search, Plus, Filter, Zap, Globe, MessageSquare, Pin, Settings2 } from 'lucide-react';

function HomePageContent() {
  const { setFrameReady } = useMiniKit();
  const [activeTab, setActiveTab] = useState<'networks' | 'pinned' | 'routing'>('networks');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [connectedNetworks, setConnectedNetworks] = useState<NetworkConnection[]>([]);
  const [pinnedItems, setPinnedItems] = useState<PinnedItemType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();

  // Initialize MiniKit
  useEffect(() => {
    setFrameReady();
  }, [setFrameReady]);

  // Mock data initialization with loading simulation
  useEffect(() => {
    const initializeData = async () => {
      setIsInitialLoading(true);
      
      // Simulate API loading time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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
      
      setIsInitialLoading(false);
    };
    
    initializeData();
  }, []);

  const handleNetworkConnect = async (networkId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const network = SUPPORTED_NETWORKS.find(n => n.networkId === networkId);
      const newConnection: NetworkConnection = {
        connectionId: Date.now().toString(),
        userId: 'user1',
        networkId,
        active: true,
        status: 'online',
        lastSync: new Date(),
      };
      
      setConnectedNetworks(prev => [...prev, newConnection]);
      successToast(
        'Network Connected',
        `Successfully connected to ${network?.name || networkId}`
      );
    } catch (error) {
      console.error('Failed to connect network:', error);
      errorToast(
        'Connection Failed',
        'Unable to connect to the network. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNetworkDisconnect = async (networkId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const network = SUPPORTED_NETWORKS.find(n => n.networkId === networkId);
      setConnectedNetworks(prev => 
        prev.filter(conn => conn.networkId !== networkId)
      );
      successToast(
        'Network Disconnected',
        `Disconnected from ${network?.name || networkId}`
      );
    } catch (error) {
      console.error('Failed to disconnect network:', error);
      errorToast(
        'Disconnection Failed',
        'Unable to disconnect from the network. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnpinItem = async (itemId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPinnedItems(prev => prev.filter(item => item.itemId !== itemId));
      successToast('Item Unpinned', 'Item removed from your pinned collection');
    } catch (error) {
      console.error('Failed to unpin item:', error);
      errorToast('Unpin Failed', 'Unable to unpin item. Please try again.');
    }
  };

  const handlePinCast = async (castHash: string) => {
    const cast = MOCK_CASTS.find(c => c.hash === castHash);
    if (!cast) return;

    try {
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
      successToast('Cast Pinned', 'Added to your pinned collection');
    } catch (error) {
      console.error('Failed to pin cast:', error);
      errorToast('Pin Failed', 'Unable to pin cast. Please try again.');
    }
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
      {/* Enhanced Header with better accessibility */}
      <header className="sticky top-0 z-50 bg-bg/90 backdrop-blur-md border-b border-border-primary">
        <div className="max-w-screen-sm mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="heading-2 text-gradient">Nexus Weaver</h1>
              <p className="body-small text-text-secondary">Unify your communication</p>
            </div>
            
            <div className="flex-shrink-0">
              <Wallet>
                <ConnectWallet>
                  <Avatar className="h-10 w-10" />
                  <Name className="body-medium" />
                </ConnectWallet>
              </Wallet>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Main Content */}
      <main className="max-w-screen-sm mx-auto px-4 py-6 space-y-6" role="main">
        {/* Skip link for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-accent text-white px-4 py-2 rounded-lg z-50"
        >
          Skip to main content
        </a>

        {/* Enhanced Stats Overview */}
        <section 
          id="main-content"
          className="grid grid-cols-3 gap-4"
          aria-label="Network statistics overview"
        >
          <div className="metric-card text-center" role="status" aria-label="Connected networks">
            <div className="heading-2 text-accent">{networkStats.connected}</div>
            <div className="caption">Connected</div>
          </div>
          <div className="metric-card text-center" role="status" aria-label="Active networks">
            <div className="heading-2 text-success">{networkStats.active}</div>
            <div className="caption">Active</div>
          </div>
          <div className="metric-card text-center" role="status" aria-label="Pinned items">
            <div className="heading-2 text-text-primary">{pinnedItems.length}</div>
            <div className="caption">Pinned</div>
          </div>
        </section>

        {/* Network Visualization */}
        {connectedNetworks.length > 0 && (
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-accent" />
              Network Map
            </h2>
            <NetworkVisualization
              networks={SUPPORTED_NETWORKS}
              connections={connectedNetworks}
            />
          </div>
        )}

        {/* Enhanced Tab Navigation */}
        <nav 
          className="flex space-x-1 bg-surface rounded-xl p-1"
          role="tablist"
          aria-label="Main navigation"
        >
          {[
            { id: 'networks', label: 'Networks', icon: Globe },
            { id: 'pinned', label: 'Pinned', icon: Pin },
            { id: 'routing', label: 'Routing', icon: Zap },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`tab-button ${activeTab === id ? 'active' : 'inactive'}`}
              role="tab"
              aria-selected={activeTab === id}
              aria-controls={`${id}-panel`}
              id={`${id}-tab`}
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* Enhanced Tab Content */}
        {activeTab === 'networks' && (
          <section
            id="networks-panel"
            role="tabpanel"
            aria-labelledby="networks-tab"
            className="space-y-6"
          >
            {/* Enhanced Search */}
            <div className="relative">
              <Search 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-tertiary" 
                aria-hidden="true"
              />
              <input
                type="text"
                placeholder="Search networks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                aria-label="Search networks"
              />
            </div>

            {/* Networks Grid with Loading and Empty States */}
            {isInitialLoading ? (
              <div className="grid gap-4">
                <NetworkCardSkeleton count={3} />
              </div>
            ) : filteredNetworks.length === 0 ? (
              searchQuery ? (
                <SearchEmptyState 
                  query={searchQuery}
                  onClear={() => setSearchQuery('')}
                />
              ) : (
                <NetworkEmptyState />
              )
            ) : (
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
            )}
          </section>
        )}

        {activeTab === 'pinned' && (
          <section
            id="pinned-panel"
            role="tabpanel"
            aria-labelledby="pinned-tab"
            className="space-y-6"
          >
            {/* Recent Casts (for pinning) */}
            {connectedNetworkIds.includes('farcaster') && (
              <div className="glass-card p-6">
                <h3 className="heading-3 text-text-primary mb-4 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-accent" aria-hidden="true" />
                  Recent Casts
                </h3>
                <div className="space-y-4 scrollbar-thin max-h-96 overflow-y-auto">
                  {MOCK_CASTS.map((cast) => (
                    <article key={cast.hash} className="p-4 bg-surface/50 rounded-lg card-interactive">
                      <div className="flex items-start space-x-3">
                        <img
                          src={cast.author.pfpUrl}
                          alt={`${cast.author.displayName} profile picture`}
                          className="w-10 h-10 rounded-full flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="heading-4 truncate">
                              {cast.author.displayName}
                            </span>
                            <span className="body-small text-text-secondary">
                              @{cast.author.username}
                            </span>
                          </div>
                          <p className="body-medium text-text-primary mb-3">
                            {cast.text}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 body-small text-text-secondary">
                              <span>{cast.replies} replies</span>
                              <span>{cast.reactions} reactions</span>
                              <span>{cast.recasts} recasts</span>
                            </div>
                            <button
                              onClick={() => handlePinCast(cast.hash)}
                              className="flex items-center space-x-1 px-3 py-2 bg-accent/20 text-accent rounded-lg hover:bg-accent/30 transition-colors duration-200 touch-target"
                              aria-label={`Pin cast by ${cast.author.displayName}`}
                            >
                              <Pin className="w-3 h-3" aria-hidden="true" />
                              <span className="body-small">Pin</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* Pinned Items Section */}
            <section>
              <h3 className="heading-3 text-text-primary mb-4">
                Your Pinned Items ({pinnedItems.length})
              </h3>
              {isInitialLoading ? (
                <PinnedItemSkeleton count={2} />
              ) : pinnedItems.length > 0 ? (
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
                <PinnedEmptyState 
                  onExplore={() => setActiveTab('networks')}
                />
              )}
            </section>
          </section>
        )}

        {activeTab === 'routing' && (
          <section
            id="routing-panel"
            role="tabpanel"
            aria-labelledby="routing-tab"
            className="space-y-6"
          >
            {/* Enhanced Channel Selection */}
            {connectedNetworkIds.includes('farcaster') && (
              <div className="glass-card p-6">
                <h3 className="heading-3 text-text-primary mb-4 flex items-center">
                  <Settings2 className="w-5 h-5 mr-2 text-accent" aria-hidden="true" />
                  Configure Routing
                </h3>
                <p className="body-medium text-text-secondary mb-6">
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

            {/* Enhanced Routing Rules */}
            <div className="glass-card p-6">
              <h3 className="heading-3 text-text-primary mb-4">
                Routing Rules
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-surface/50 rounded-lg border border-border-primary card-interactive">
                  <div className="flex items-center justify-between mb-2">
                    <span className="heading-4 text-text-primary">
                      High Priority Messages
                    </span>
                    <div 
                      className="connection-indicator online" 
                      aria-label="Rule is active"
                      title="Rule is active"
                    />
                  </div>
                  <p className="body-small text-text-secondary">
                    Route messages containing keywords: "urgent", "important", "@everyone"
                  </p>
                </div>
                
                <div className="p-4 bg-surface/50 rounded-lg border border-border-primary card-interactive">
                  <div className="flex items-center justify-between mb-2">
                    <span className="heading-4 text-text-primary">
                      Mentions & DMs
                    </span>
                    <div 
                      className="connection-indicator online" 
                      aria-label="Rule is active"
                      title="Rule is active"
                    />
                  </div>
                  <p className="body-small text-text-secondary">
                    Route all direct mentions and private messages
                  </p>
                </div>
              </div>
              
              <button className="w-full mt-6 btn-secondary">
                <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
                Add New Rule
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

// Main component with ToastProvider wrapper
export default function HomePage() {
  return (
    <ToastProvider>
      <HomePageContent />
    </ToastProvider>
  );
}
