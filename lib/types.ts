// Core data model types
export interface User {
  userId: string;
  farcasterId?: string;
  walletAddress: string;
  connectedNetworks: string[];
  preferences: UserPreferences;
}

export interface UserPreferences {
  preferredNetwork?: string;
  routingRules: RoutingRule[];
  notificationSettings: NotificationSettings;
}

export interface RoutingRule {
  id: string;
  sourceNetwork: string;
  targetNetwork: string;
  conditions: string[];
  active: boolean;
}

export interface NotificationSettings {
  enableRouting: boolean;
  enableDigest: boolean;
  digestFrequency: 'daily' | 'weekly';
}

export interface Network {
  networkId: string;
  name: string;
  type: 'farcaster' | 'discord' | 'slack' | 'telegram' | 'other';
  apiUrl?: string;
  icon?: string;
  color?: string;
}

export interface NetworkConnection {
  connectionId: string;
  userId: string;
  networkId: string;
  credentials?: Record<string, any>;
  active: boolean;
  lastSync?: Date;
  status: 'online' | 'offline' | 'pending' | 'error';
}

export interface PinnedItem {
  itemId: string;
  userId: string;
  sourceNetwork: string;
  sourceMessageId: string;
  content: string;
  title?: string;
  url?: string;
  timestamp: Date;
  tags?: string[];
  type: 'message' | 'link' | 'file';
}

export interface FarcasterCast {
  hash: string;
  author: {
    fid: number;
    username: string;
    displayName: string;
    pfpUrl?: string;
  };
  text: string;
  timestamp: string;
  replies: number;
  reactions: number;
  recasts: number;
  embeds?: Array<{
    url?: string;
    castId?: {
      fid: number;
      hash: string;
    };
  }>;
}

export interface FarcasterChannel {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  followerCount?: number;
  hostFids?: number[];
}

// Component prop types
export interface NetworkCardProps {
  network: Network;
  connection?: NetworkConnection;
  onConnect?: (networkId: string) => void;
  onDisconnect?: (networkId: string) => void;
  variant?: 'connected' | 'unconnected';
}

export interface PinnedItemProps {
  item: PinnedItem;
  onUnpin?: (itemId: string) => void;
  variant?: 'message' | 'link';
}

export interface ConnectionStatusIndicatorProps {
  status: 'online' | 'offline' | 'pending' | 'error';
  size?: 'sm' | 'md' | 'lg';
}

export interface ChannelSelectorProps {
  channels: FarcasterChannel[];
  selectedChannels: string[];
  onSelectionChange: (channelIds: string[]) => void;
  variant?: 'multiSelect';
}
