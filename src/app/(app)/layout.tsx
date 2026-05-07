'use client';

import { WalletGate } from '@/components/auth/WalletGate';

export default function ProtocolLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <WalletGate>{children}</WalletGate>;
}
