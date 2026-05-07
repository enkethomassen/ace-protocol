'use client';
import { Bell, FlaskConical, Anchor } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn, formatShortAddress } from '@/lib/utils';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';

const PAGE_TITLES: Record<string, { title: string; sub: string }> = {
  '/dashboard':    { title: 'Bridge',        sub: 'Your cashflow command center' },
  '/vault':        { title: 'Vault',          sub: 'Capital allocation & strategies' },
  '/payments':     { title: 'Payments',       sub: 'Scheduled & recurring payouts' },
  '/history':      { title: 'Voyage Log',     sub: 'Complete transaction history' },
  '/ai':           { title: 'AI Crew',        sub: 'Cashflow intelligence & recommendations' },
  '/architecture': { title: 'Architecture',   sub: 'System design & documentation' },
  '/activity':     { title: 'Activity',       sub: 'Execution log & decisions' },
};

export function Topbar() {
  const { isSimulationMode, setSimulationMode, insights } = useApp();
  const { publicKey, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const pathname = usePathname();
  const page = PAGE_TITLES[pathname] ?? { title: 'ACE Protocol', sub: '' };
  const unread = insights.filter(i => i.type === 'alert').length;

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center justify-between px-5 py-3 border-b border-[#1c1d2e] bg-[#070810]/90 backdrop-blur-md sticky top-0 z-40"
    >
      {/* Mobile logo + page title */}
      <div className="flex items-center gap-3">
        <div className="lg:hidden w-7 h-7 rounded-xl bg-gradient-to-br from-[#ff6b2b] to-[#f4a935] flex items-center justify-center fire-glow">
          <Anchor className="w-3.5 h-3.5 text-white" />
        </div>
        <div>
          <h1 className="text-[15px] font-bold text-white leading-tight tracking-tight">{page.title}</h1>
          <p className="hidden sm:block text-[11px] text-[#3a3c55] leading-none">{page.sub}</p>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Simulation toggle */}
        {!connected && (
          <button
            onClick={() => setSimulationMode(!isSimulationMode)}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-medium transition-all border',
              isSimulationMode
                ? 'bg-amber-500/8 text-amber-400/80 border-amber-500/20 hover:bg-amber-500/12'
                : 'bg-white/4 text-[#54566e] border-[#1c1d2e] hover:bg-white/6',
            )}
          >
            <FlaskConical className="w-3 h-3" />
            <span className="hidden sm:inline">{isSimulationMode ? 'Sim' : 'Live'}</span>
          </button>
        )}

        {/* Notifications */}
        <Link
          href="/ai"
          className="relative p-2 rounded-xl text-[#54566e] hover:text-white hover:bg-white/4 transition-all"
        >
          <Bell className="w-4 h-4" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-[14px] h-[14px] rounded-full bg-orange-500 text-white text-[8px] font-bold flex items-center justify-center">
              {unread}
            </span>
          )}
        </Link>

        {/* Wallet */}
        {connected && publicKey ? (
          <button
            onClick={() => disconnect()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/8 border border-emerald-500/20 text-[11px] text-emerald-400 hover:bg-emerald-500/14 transition-all font-medium"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="hidden sm:inline">{formatShortAddress(publicKey.toBase58())}</span>
          </button>
        ) : (
          <button
            onClick={() => setVisible(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/12 border border-orange-500/25 text-[11px] text-orange-400 hover:bg-orange-500/18 transition-all font-semibold"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </motion.header>
  );
}
