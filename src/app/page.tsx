'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Anchor, Zap, Shield, TrendingUp, ArrowRight,
  Coins, Clock, BarChart3, Cpu, ChevronRight,
} from 'lucide-react';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay },
});

const features = [
  {
    icon: TrendingUp,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    title: 'Automated Yield',
    desc: 'Idle capital is automatically routed into yield-bearing strategies while maintaining your liquidity buffer.',
  },
  {
    icon: Clock,
    color: 'text-sky-400',
    bg: 'bg-sky-400/10',
    title: 'Scheduled Payments',
    desc: 'Set recurring payments and bill automation. ACE reserves funds and executes on time — no manual steps.',
  },
  {
    icon: Zap,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    title: 'Execution Intelligence',
    desc: 'MEV-aware routing picks the optimal moment to execute swaps and rebalances, minimising slippage and fees.',
  },
  {
    icon: Cpu,
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
    title: 'AI Cashflow Engine',
    desc: 'The on-board policy engine predicts spending pressure and recommends allocation changes before you need them.',
  },
  {
    icon: Shield,
    color: 'text-rose-400',
    bg: 'bg-rose-400/10',
    title: 'Non-Custodial Vaults',
    desc: 'PDA-owned vault accounts on Solana. Your keys, your capital. ACE never holds funds outside protocol-defined rules.',
  },
  {
    icon: Coins,
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
    title: 'Real-World Off-Ramps',
    desc: 'Integrated payment rails let you settle obligations directly to bank accounts from your on-chain vault.',
  },
];

const stats = [
  { label: 'Target APY', value: '8–14%' },
  { label: 'Avg. Execution Save', value: '~0.4%' },
  { label: 'Reserve Buffer', value: '30 days' },
  { label: 'Network', value: 'Solana' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen orb-bg grid-bg font-sans text-[#f0ede6] overflow-x-hidden">

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 border-b border-[#1c1d2e] bg-[#070810]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center">
              <Anchor className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight">ACE Protocol</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-xs text-[#54566e]">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how" className="hover:text-white transition-colors">How it works</a>
            <a href="#stats" className="hover:text-white transition-colors">Stats</a>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-400 text-white hover:opacity-90 transition-opacity"
          >
            Launch App <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-5 pt-24 pb-20 text-center">
        <motion.div {...fade(0)}>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border border-orange-500/30 text-orange-400 bg-orange-500/5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse-fire" />
            Built on Solana · Devnet live
          </span>
        </motion.div>

        <motion.h1 {...fade(0.06)} className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
          Turn idle capital into{' '}
          <span className="gradient-fire">automated cashflow</span>
        </motion.h1>

        <motion.p {...fade(0.12)} className="text-[#54566e] text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
          ACE Protocol is a Solana-native financial automation engine. Deposit once, set your goals,
          and let ACE handle yield, reserves, and recurring payments — automatically.
        </motion.p>

        <motion.div {...fade(0.18)} className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 text-white font-semibold text-sm hover:opacity-90 transition-opacity fire-glow"
          >
            Launch Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#features"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl border border-[#1c1d2e] text-[#54566e] hover:text-white hover:border-[#2a2b45] font-medium text-sm transition-colors"
          >
            See features <ChevronRight className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Hero visual */}
        <motion.div {...fade(0.26)} className="mt-16 relative mx-auto max-w-3xl">
          <div className="rounded-2xl border border-[#1c1d2e] bg-[#0e0f1a] p-6 text-left shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs text-[#54566e] mb-1">Total under management</p>
                <p className="text-3xl font-bold text-white">$12,480.<span className="text-[#54566e]">00</span></p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full">
                <TrendingUp className="w-3.5 h-3.5" /> +8.4% APY
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Earning Yield', val: '$7,470', color: 'bg-emerald-400' },
                { label: 'Reserve', val: '$2,994', color: 'bg-amber-400' },
                { label: 'Spendable', val: '$1,248', color: 'bg-orange-400' },
                { label: 'Payments', val: '$768', color: 'bg-sky-400' },
              ].map(({ label, val, color }) => (
                <div key={label} className="rounded-lg border border-[#2a2a3a] bg-[#070810] p-3">
                  <div className={`w-2 h-2 rounded-full ${color} mb-2`} />
                  <p className="text-white font-semibold text-sm">{val}</p>
                  <p className="text-[#54566e] text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 h-1.5 rounded-full bg-[#1c1d2e] overflow-hidden flex gap-0.5">
              <div className="h-full bg-emerald-400 rounded-full" style={{ width: '60%' }} />
              <div className="h-full bg-amber-400 rounded-full" style={{ width: '24%' }} />
              <div className="h-full bg-orange-400 rounded-full" style={{ width: '10%' }} />
              <div className="h-full bg-sky-400 rounded-full" style={{ width: '6%' }} />
            </div>
          </div>
          {/* glow underneath */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-orange-500/10 blur-2xl rounded-full pointer-events-none" />
        </motion.div>
      </section>

      {/* ── Stats bar ── */}
      <section id="stats" className="border-y border-[#1c1d2e] bg-[#0e0f1a]">
        <div className="max-w-6xl mx-auto px-5 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {stats.map(({ label, value }, i) => (
            <motion.div key={label} {...fade(i * 0.06)}>
              <p className="text-2xl font-bold gradient-fire">{value}</p>
              <p className="text-xs text-[#54566e] mt-1">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="max-w-6xl mx-auto px-5 py-24">
        <motion.div {...fade(0)} className="text-center mb-14">
          <p className="text-xs text-orange-400 font-semibold uppercase tracking-widest mb-3">How it works</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Three steps to automated cashflow</h2>
        </motion.div>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { n: '01', title: 'Connect & Deposit', desc: 'Connect your Solana wallet and deposit USDC into your non-custodial ACE vault. You stay in control at all times.' },
            { n: '02', title: 'Set Your Goals', desc: 'Define your reserve target, upcoming payments, and yield preferences. The policy engine handles the rest.' },
            { n: '03', title: 'ACE Executes', desc: 'Capital is allocated, yield is harvested, reserves are maintained, and payments go out — all automatically and on-chain.' },
          ].map(({ n, title, desc }, i) => (
            <motion.div key={n} {...fade(i * 0.08)} className="card-hover rounded-2xl border border-[#1c1d2e] bg-[#0e0f1a] p-6">
              <p className="text-4xl font-bold gradient-fire mb-4">{n}</p>
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-[#54566e] text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="max-w-6xl mx-auto px-5 pb-24">
        <motion.div {...fade(0)} className="text-center mb-14">
          <p className="text-xs text-orange-400 font-semibold uppercase tracking-widest mb-3">Features</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Everything your cashflow needs</h2>
          <p className="text-[#54566e] mt-3 text-sm max-w-xl mx-auto">
            ACE combines DeFi yield, payment rails, and execution intelligence into one cohesive layer.
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, color, bg, title, desc }, i) => (
            <motion.div key={title} {...fade(i * 0.06)} className="card-hover rounded-2xl border border-[#1c1d2e] bg-[#0e0f1a] p-5">
              <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-4`}>
                <Icon className={`w-4.5 h-4.5 ${color}`} />
              </div>
              <h3 className="font-semibold text-white text-sm mb-1.5">{title}</h3>
              <p className="text-[#54566e] text-xs leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-5 pb-24">
        <motion.div {...fade(0)} className="rounded-2xl border border-orange-500/20 bg-gradient-to-br from-[#0e0f1a] to-[#130f0a] p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 100%, rgba(255,107,43,0.08) 0%, transparent 70%)' }}
          />
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center mx-auto mb-5">
              <Anchor className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              Ready to set sail?
            </h2>
            <p className="text-[#54566e] text-sm max-w-md mx-auto mb-8">
              Connect your wallet and launch the ACE dashboard to start automating your Solana cashflow today.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 text-white font-semibold text-sm hover:opacity-90 transition-opacity fire-glow"
            >
              Launch Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#1c1d2e] bg-[#070810]">
        <div className="max-w-6xl mx-auto px-5 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center">
              <Anchor className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs font-semibold text-[#54566e]">ACE Protocol</span>
          </div>
          <p className="text-xs text-[#2a2b45]">Adaptive Cashflow Engine · Built on Solana · Devnet</p>
          <div className="flex items-center gap-4 text-xs text-[#2a2b45]">
            <Link href="/dashboard" className="hover:text-[#54566e] transition-colors">Dashboard</Link>
            <Link href="/architecture" className="hover:text-[#54566e] transition-colors">Architecture</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
