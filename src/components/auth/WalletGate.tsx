'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { Anchor } from 'lucide-react';

export function WalletGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { connected, connecting, disconnecting } = useWallet();

  useEffect(() => {
    if (!connected && !connecting && !disconnecting) {
      router.replace('/');
    }
  }, [connected, connecting, disconnecting, router]);

  if (connecting || (!connected && !disconnecting)) {
    return (
      <div className="min-h-screen protocol-bg text-[#f5f1ff] flex items-center justify-center px-6">
        <div className="max-w-md w-full rounded-[28px] border border-white/8 bg-[#0a0912]/80 backdrop-blur-xl p-8 text-center shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
            <Anchor className="h-6 w-6 text-white" />
          </div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#5a5475]">Private Protocol Surface</p>
          <h1 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">Verifying wallet session</h1>
          <p className="mt-3 text-sm leading-6 text-[#7d7699]">
            ACE keeps dashboard state private until a wallet session is active. If a session is not found, you&apos;ll be returned to the landing page.
          </p>
        </div>
      </div>
    );
  }

  if (!connected) return null;

  return <>{children}</>;
}
