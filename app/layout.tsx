import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Nexus Weaver - Unify your communication, amplify your reach',
  description: 'A Base-native MiniApp that helps users map and centralize information across fragmented communication networks.',
  keywords: ['Base', 'MiniApp', 'Communication', 'Networks', 'Farcaster', 'Web3'],
  authors: [{ name: 'Nexus Weaver Team' }],
  openGraph: {
    title: 'Nexus Weaver',
    description: 'Unify your communication, amplify your reach.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
