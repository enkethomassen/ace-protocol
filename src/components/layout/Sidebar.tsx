'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Flame, LayoutDashboard, Wallet, CreditCard,
  History, Cpu, BookOpen, Anchor, Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { useApp } from '@/context/AppContext';
import { motion } from 'framer-motion';

const NAV = [
  { href: '/dashboard',    label: 'Bridge',   icon: LayoutDashboard },
  { href: '/vault',        label: 'Vault',    icon: Wallet },
  { href: '/payments',     label: 'Payments', icon: CreditCard },
  { href: '/history',      label: 'Log',      icon: History },
  { href: '/activity',     label: 'Activity', icon: Activity },
  { href: '/ai',           label: 'AI Crew',  icon: Cpu, badge: 'new' as const },
  { href: '/architecture', label: 'Charts',   icon: BookOpen },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isWalletConnected } = useApp();

  return (
    <aside className="hidden lg:flex flex-col w-[220px] shrink-0 border-r border-[#1c1d2e] bg-[#070810] min-h-screen">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[#1c1d2e]">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#ff6b2b] to-[#f4a935] flex items-center justify-center fire-glow shrink-0">
          <Anchor className="w-4 h-4 text-white" />
        </div>
        <div>
          <span className="text-[13px] font-bold text-white tracking-tight leading-none">ACE Protocol</span>
          <p className="text-[9px] text-[#3a3c55] leading-none mt-0.5 tracking-wide uppercase">Adaptive Cashflow</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-px">
        {NAV.map(({ href, label, icon: Icon, badge }, i) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <motion.div
              key={href}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={href}
                className={cn(
                  'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-colors duration-150 group',
                  active ? 'text-white' : 'text-[#54566e] hover:text-gray-200 hover:bg-white/4',
                )}
              >
                {active && (
                  <motion.div
                    layoutId="sidebar-pill"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/12 to-transparent border border-orange-500/20"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon className={cn(
                  'w-[15px] h-[15px] shrink-0 relative z-10 transition-colors',
                  active ? 'text-orange-400' : 'text-[#3a3c55] group-hover:text-[#54566e]',
                )} />
                <span className="flex-1 relative z-10 font-medium">{label}</span>
                {badge && (
                  <Badge variant="fire" className="text-[9px] relative z-10 px-1.5 py-0">
                    {badge}
                  </Badge>
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 pb-5 border-t border-[#1c1d2e] pt-4 space-y-1.5">
        <div className="flex items-center gap-2">
          <div className={cn(
            'w-1.5 h-1.5 rounded-full shrink-0',
            isWalletConnected ? 'bg-emerald-400' : 'bg-[#3a3c55]',
          )} />
          <span className="text-[10px] text-[#3a3c55] font-medium">
            {isWalletConnected ? 'Live · Devnet' : 'Simulation Mode'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Flame className="w-2.5 h-2.5 text-orange-500/35 shrink-0" />
          <p className="text-[9px] text-[#2a2c40] tracking-wide">v0.1.0-alpha · Solana Devnet</p>
        </div>
      </div>
    </aside>
  );
}
