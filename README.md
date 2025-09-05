# Nexus Weaver

**Unify your communication, amplify your reach.**

A Base-native MiniApp that helps users map and centralize information across fragmented communication networks.

## Features

### 🌐 Unified Network Directory
- Automatically discover and list all active communication networks
- Searchable interface for all connected platforms
- Real-time connection status monitoring

### 🔗 Cross-Network Connectivity Insights
- Visualize how users and data flow between different networks
- Interactive network map showing connections and activity
- Connection health monitoring and diagnostics

### ⚡ Intelligent Message Routing
- Configure rules to route messages to preferred networks
- Priority-based message filtering and forwarding
- Automated notification management

### 📌 Centralized Info Snippets
- Pin important messages and links from any network
- Searchable personal hub for fragmented information
- Tag and categorize pinned content

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Blockchain**: Base (via OnchainKit & MiniKit)
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Supabase for data storage
- **APIs**: Farcaster (Neynar), OpenAI (optional)
- **TypeScript**: Full type safety throughout

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Base-compatible wallet

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nexus-weaver
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in your API keys:
- `NEXT_PUBLIC_ONCHAINKIT_API_KEY`: Get from [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)
- `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Get from [Supabase](https://supabase.com/)
- `NEYNAR_API_KEY`: Get from [Neynar](https://neynar.com/) for Farcaster integration

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Architecture

### Data Model

- **User**: Core user entity with wallet address and preferences
- **Network**: Supported communication platforms (Farcaster, Discord, etc.)
- **NetworkConnection**: User's connections to specific networks
- **PinnedItem**: Important content saved from any network

### Design System

- **Colors**: Dark theme with purple/green accent palette
- **Typography**: Clean, readable font hierarchy
- **Components**: Modular, reusable UI components
- **Motion**: Smooth transitions and micro-interactions

## Usage

### Connecting Networks

1. Navigate to the Networks tab
2. Click "Connect" on any supported network
3. Follow the authentication flow
4. View your connected networks in the visualization

### Pinning Content

1. Browse recent content from connected networks
2. Click the "Pin" button on important messages
3. Access pinned content in the Pinned tab
4. Search and filter your saved items

### Setting Up Routing

1. Go to the Routing tab
2. Select channels to monitor
3. Configure routing rules based on keywords or conditions
4. Enable intelligent message forwarding

## Business Model

- **Free Tier**: Basic network discovery and mapping
- **Premium**: $0.01 per integrated network/user for advanced features
- **Features**: Intelligent routing, centralized hub search, AI summarization

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue on GitHub or contact the development team.

---

Built with ❤️ for the Base ecosystem
