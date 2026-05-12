'use client';
// ============================================================
// ACE Protocol — Top-level Providers
// Privy handles wallet connection, auth, and session management.
// Network-aware: solanaClusters updates when the user switches network.
// ============================================================

import React from 'react';
import { PrivyProvider } from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';
import { AppProvider } from '@/context/AppContext';
import { useProtocolStore } from '@/lib/store/useProtocolStore';

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? '';

const MAINNET_RPC =
  process.env.NEXT_PUBLIC_SOLANA_MAINNET_RPC ??
  process.env.NEXT_PUBLIC_SOLANA_RPC ??
  'https://api.mainnet-beta.solana.com';

const DEVNET_RPC =
  process.env.NEXT_PUBLIC_SOLANA_DEVNET_RPC ??
  'https://api.devnet.solana.com';

// ── Inner provider — reads network from store so Privy config stays in sync ──
function PrivyNetworkProvider({ children }: { children: React.ReactNode }) {
  const network = useProtocolStore((s) => s.network);
  const rpcEndpoint = network === 'mainnet' ? MAINNET_RPC : DEVNET_RPC;
  const clusterName = network === 'mainnet' ? 'mainnet-beta' : 'devnet';

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        loginMethods: ['wallet'],
        appearance: {
          theme: 'dark',
          accentColor: '#9d5cff',
          logo: '/icon.svg',
          showWalletLoginFirst: true,
          walletList: ['phantom', 'solflare', 'backpack'],
        },
        externalWallets: {
          solana: {
            connectors: toSolanaWalletConnectors({ shouldAutoConnect: true }),
          },
        },
        solanaClusters: [{ name: clusterName as 'devnet' | 'mainnet-beta', rpcUrl: rpcEndpoint }],
        embeddedWallets: {
          createOnLogin: 'off',
        },
      }}
    >
      <AppProvider>{children}</AppProvider>
    </PrivyProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  // During SSR / static build NEXT_PUBLIC_PRIVY_APP_ID is not available.
  // Skip PrivyProvider so the build doesn't crash — auth runs client-side only.
  if (!PRIVY_APP_ID) {
    return <AppProvider>{children}</AppProvider>;
  }

  return <PrivyNetworkProvider>{children}</PrivyNetworkProvider>;
}
