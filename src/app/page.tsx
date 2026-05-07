'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Anchor, Shield, Zap, BrainCircuit, ChevronRight, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useRouter } from 'next/navigation';
import { ProtocolFlowAnimation } from '@/components/landing/ProtocolFlowAnimation';

/* ============================================================
   ACE Protocol — Redesigned Landing Page
   Spacious · Premium · Minimal · Professional
   ============================================================ */

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay },
});

function LaunchButton({ className, variant = 'primary' }: { className?: string; variant?: 'primary' | 'secondary' }) {
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  const router = useRouter();

  return (
    <button
      onClick={() => (connected ? router.push('/dashboard') : setVisible(true))}
      className={
        variant === 'primary'
          ? `inline-flex items-center justify-center gap-2 rounded-full bg-white text-[#07060d] px-7 py-3.5 text-sm font-semibold tracking-tight transition-all hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] ${className ?? ''}`
          : `inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-medium text-[#ece8ff] transition-all hover:bg-white/10 hover:border-white/25 ${className ?? ''}`
      }
    >
      {connected ? (
        <>
          Enter Dashboard <ArrowRight className="w-4 h-4" />
        </>
      ) : (
        <>
          <Wallet className="w-4 h-4" />
          Connect Wallet
        </>
      )}
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#7d7699]">
      {children}
    </p>
  );
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  const [r3fError, setR3fError] = useState(false);

  useEffect(() => {
    // Safety: if R3F fails to mount, fall back gracefully
    const timer = setTimeout(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) setR3fError(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="protocol-bg min-h-screen overflow-x-hidden font-sans text-[#f5f1ff]">

      {/* ─── NAV ─── */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#07060d]/60 backdrop-blur-2xl">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
              <Anchor className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[-0.02em] text-white">ACE Protocol</p>
              <p className="text-[10px] uppercase tracking-[0.26em] text-[#5a5475]">Adaptive Cashflow Engine</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-[13px] text-[#7d7699]">
            <a href="#flow" className="transition-colors hover:text-white">Protocol Flow</a>
            <a href="#principles" className="transition-colors hover:text-white">Principles</a>
            <a href="#access" className="transition-colors hover:text-white">Access</a>
          </div>

          <LaunchButton className="rounded-full px-5 py-2.5 text-xs" />
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative mx-auto max-w-6xl px-6 pt-32 pb-40 lg:pt-44 lg:pb-52">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute -left-32 top-24 h-72 w-72 rounded-full bg-violet-500/10 blur-[100px]" />
        <div className="pointer-events-none absolute -right-24 bottom-16 h-64 w-64 rounded-full bg-cyan-400/8 blur-[90px]" />

        <div className="relative grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <motion.div {...fadeUp(0)}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.24em] text-[#9a93b3]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]" />
                Solana-native protocol
              </span>
            </motion.div>

            <motion.h1
              {...fadeUp(0.08)}
              className="mt-10 max-w-3xl text-[clamp(2.8rem,6vw,5rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-white"
            >
              Execution-aware{" "}
              <span className="block pt-3 text-[#c9c4da]">cashflow automation.</span>
            </motion.h1>

            <motion.p
              {...fadeUp(0.14)}
              className="mt-8 max-w-xl text-lg leading-8 text-[#8f89ad]"
            >
              ACE separates reserve liquidity, investable capital, and payment obligations — so your recurring finances stay reliable under real network conditions.
            </motion.p>

            <motion.div {...fadeUp(0.2)} className="mt-10 flex flex-col gap-3 sm:flex-row">
              <LaunchButton variant="primary" />
              <a
                href="#flow"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-7 py-3.5 text-sm font-medium text-[#c9c4da] transition-all hover:bg-white/6 hover:text-white"
              >
                Explore the flow <ChevronRight className="h-4 w-4" />
              </a>
            </motion.div>
          </div>

          {/* 3D Scene */}
          <motion.div {...fadeUp(0.18)} className="relative rounded-[32px] border border-white/6 bg-[#0a0912]/40 p-4 backdrop-blur-sm">
            {r3fError ? (
              <div className="flex h-[420px] items-center justify-center text-sm text-[#5a5475]">
                <div className="text-center space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                    <Anchor className="w-5 h-5 text-[#7d7699]" />
                  </div>
                  <p>Protocol flow visualization</p>
                  <p className="text-xs text-[#3a3650]">Capital → Reserve → Investable → Payments</p>
                </div>
              </div>
            ) : (
              <ProtocolFlowAnimation />
            )}
          </motion.div>
        </div>
      </section>

      {/* ─── PRODUCT FLOW (4 steps, minimal) ─── */}
      <section id="flow" className="mx-auto max-w-6xl px-6 pb-40">
        <Reveal>
          <div className="mb-24 max-w-xl">
            <SectionLabel>How it works</SectionLabel>
            <h2 className="mt-4 text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold tracking-[-0.04em] text-white leading-tight">
              Capital enters. The engine decides the rest.
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            { num: '01', title: 'Deposit', desc: 'Capital flows into a deterministic vault. No generic pooling.' },
            { num: '02', title: 'Reserve Policy', desc: 'Upcoming obligations carve out protected liquidity before anything else.' },
            { num: '03', title: 'Investable Surplus', desc: 'Only excess capital is eligible for strategy routing. Safety first.' },
            { num: '04', title: 'Scheduled Settlement', desc: 'Payments execute around urgency, fees, and reliability — not fixed timers.' },
          ].map(({ num, title, desc }, i) => (
            <Reveal key={title} delay={i * 0.1}>
              <div className="group relative rounded-[28px] border border-white/6 bg-white/[0.02] p-7 transition-all hover:border-white/10 hover:bg-white/[0.04]">
                <span className="text-[11px] font-mono text-[#3a3650]">{num}</span>
                <h3 className="mt-5 text-lg font-semibold tracking-[-0.03em] text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#7d7699]">{desc}</p>
                <div className="mt-6 h-[1px] w-8 bg-white/10 transition-all group-hover:w-16 group-hover:bg-white/20" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── TRUST / PRINCIPLES ─── */}
      <section id="principles" className="mx-auto max-w-6xl px-6 pb-40">
        <Reveal>
          <div className="mb-24 max-w-xl">
            <SectionLabel>Trust surface</SectionLabel>
            <h2 className="mt-4 text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold tracking-[-0.04em] text-white leading-tight">
              Built to feel infrastructural, not theatrical.
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              icon: Shield,
              title: 'Non-custodial by design',
              desc: 'Your wallet controls the vault. ACE never holds keys or operates as a centralized intermediary.',
            },
            {
              icon: Zap,
              title: 'Deterministic policy logic',
              desc: 'Every allocation, rebalance, and execution decision follows inspectable, rule-based calculations.',
            },
            {
              icon: BrainCircuit,
              title: 'Explainable reasoning',
              desc: 'AI summarizes protocol state in human terms. It never signs, holds, or moves funds.',
            },
            {
              icon: Wallet,
              title: 'Wallet-gated dashboard',
              desc: 'The private dashboard is only accessible after wallet connection. No public leakage of positions.',
            },
          ].map(({ icon: Icon, title, desc }, i) => (
            <Reveal key={title} delay={i * 0.08}>
              <div className="flex gap-5 rounded-[24px] border border-white/6 bg-white/[0.02] p-7 transition-all hover:border-white/10 hover:bg-white/[0.04]">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.03]">
                  <Icon className="h-5 w-5 text-[#9a93b3]" />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#7d7699]">{desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── WALLET GATE ─── */}
      <section id="access" className="mx-auto max-w-6xl px-6 pb-32">
        <Reveal>
          <div className="relative overflow-hidden rounded-[36px] border border-white/8 bg-white/[0.02] px-8 py-20 text-center sm:px-16">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(192,132,252,0.12),transparent_50%)]" />
            <div className="relative">
              <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                <Anchor className="h-7 w-7 text-white" />
              </div>
              <SectionLabel>Private Protocol Surface</SectionLabel>
              <h2 className="mx-auto mt-5 max-w-lg text-[clamp(1.6rem,3vw,2.4rem)] font-semibold tracking-[-0.04em] text-white leading-tight">
                {connected ? 'Your dashboard is ready.' : 'Connect your wallet to enter.'}
              </h2>
              <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#7d7699]">
                The public site explains the system. The private dashboard is where reserve health, payment flows, activity history, and reasoning logs become available.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                {connected ? (
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[#07060d] transition-all hover:bg-white/90"
                  >
                    Open Dashboard <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() => setVisible(true)}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[#07060d] transition-all hover:bg-white/90"
                    >
                      <Wallet className="w-4 h-4" />
                      Connect Wallet
                    </button>
                    <Link
                      href="https://github.com/enkethomassen/ace-protocol"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-8 py-3.5 text-sm font-medium text-[#c9c4da] transition-all hover:bg-white/6"
                    >
                      View repository <ArrowRight className="h-4 w-4" />
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/5">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 text-sm text-[#5a5475] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
              <Anchor className="h-3.5 w-3.5 text-white" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-white">ACE Protocol</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#3a3650]">Adaptive Cashflow Engine</p>
            </div>
          </div>
          <p className="text-xs text-[#3a3650]">Execution-aware finance on Solana Devnet.</p>
        </div>
      </footer>
    </div>
  );
}
