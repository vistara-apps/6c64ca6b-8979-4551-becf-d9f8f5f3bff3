export const SUPPORTED_NETWORKS = [
  {
    networkId: 'farcaster',
    name: 'Farcaster',
    type: 'farcaster' as const,
    icon: '🟣',
    color: '#8B5CF6',
    description: 'Decentralized social network',
  },
  {
    networkId: 'discord',
    name: 'Discord',
    type: 'discord' as const,
    icon: '💬',
    color: '#5865F2',
    description: 'Voice, video, and text communication',
  },
  {
    networkId: 'slack',
    name: 'Slack',
    type: 'slack' as const,
    icon: '💼',
    color: '#4A154B',
    description: 'Business communication platform',
  },
  {
    networkId: 'telegram',
    name: 'Telegram',
    type: 'telegram' as const,
    icon: '✈️',
    color: '#0088CC',
    description: 'Cloud-based instant messaging',
  },
] as const;

export const MOCK_FARCASTER_CHANNELS = [
  {
    id: 'base',
    name: 'Base',
    description: 'Official Base network channel',
    imageUrl: '/api/placeholder/40/40',
    followerCount: 125000,
  },
  {
    id: 'farcaster',
    name: 'Farcaster',
    description: 'Protocol discussions and updates',
    imageUrl: '/api/placeholder/40/40',
    followerCount: 89000,
  },
  {
    id: 'crypto',
    name: 'Crypto',
    description: 'General cryptocurrency discussions',
    imageUrl: '/api/placeholder/40/40',
    followerCount: 156000,
  },
  {
    id: 'defi',
    name: 'DeFi',
    description: 'Decentralized finance discussions',
    imageUrl: '/api/placeholder/40/40',
    followerCount: 78000,
  },
];

export const MOCK_CASTS = [
  {
    hash: '0x123',
    author: {
      fid: 1,
      username: 'basebuilder',
      displayName: 'Base Builder',
      pfpUrl: '/api/placeholder/32/32',
    },
    text: 'Just shipped a new feature for cross-chain messaging! The future of communication is here 🚀',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    replies: 12,
    reactions: 45,
    recasts: 8,
  },
  {
    hash: '0x456',
    author: {
      fid: 2,
      username: 'cryptodev',
      displayName: 'Crypto Developer',
      pfpUrl: '/api/placeholder/32/32',
    },
    text: 'Working on integrating multiple communication networks into a single interface. The fragmentation problem is real!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    replies: 8,
    reactions: 23,
    recasts: 5,
  },
];

export const API_ENDPOINTS = {
  NEYNAR_BASE: 'https://api.neynar.com/v2',
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
} as const;

export const FEATURE_FLAGS = {
  ENABLE_AI_SUMMARIZATION: false,
  ENABLE_CROSS_NETWORK_ROUTING: true,
  ENABLE_REAL_TIME_SYNC: false,
} as const;
