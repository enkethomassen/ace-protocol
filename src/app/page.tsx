'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight,
  Anchor,
  Shield,
  Zap,
  BrainCircuit,
  Wallet,
  ChevronDown,
  Lock,
  Activity,
  Timer,
} from 'lucide-react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useRouter } from 'next/navigation';
import { ProtocolFlowAnimation } from '@/components/landing/ProtocolFlowAnimation';

/* ============================================================
   ACE Protocol — Landing Page
   ============================================================ */

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 32 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      delay,
    },
  };
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function LaunchButton({ className, variant = 'primary' }: { className?: string; variant?: 'primary' | 'secondary' }) {
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  const router = useRouter();

  return (
    <button
      onClick={() => (connected ? router.push('/dashboard') : setVisible(true))}
      className={
        variant === 'primary'
          ? `inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold tracking-tight text-[#070810] transition-all duration-200 hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] ${className ?? ''}`
          : `inline-flex items-center justify-center gap-2 rounded-full border border-[#2a2b45] bg-[#0e0f1a] px-7 py-3.5 text-sm font-medium tracking-tight text-[#b3b5c9] transition-all duration-200 hover:border-[#3a3c55] hover:bg-[#131420] hover:text-white ${className ?? ''}`
      }
    >
      {connected ? (
        <>
          Enter Dashboard <ArrowRight className="h-4 w-4" />
        </>
      ) : (
        <>
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </>
      )}
    </button>
  );
}

/* ─── Section helpers ─── */

function Section({
  id,
  children,
  className,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`relative ${className ?? ''}`}>
      <div className="mx-auto max-w-[1200px] px-6 md:px-8">{children}</div>
    </section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#54566e]">
      {children}
    </p>
  );
}

/* ─── Components ─── */

export default function LandingPage() {
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  const [r3fError, setR3fError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!document.querySelector('canvas')) setR3fError(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#070810] font-sans text-[#f0ede6] selection:bg-white/10">

      {/* ═══════════════════════════════════════════
          NAV
          ═══════════════════════════════════════════ */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-[#1c1d2e]/80 bg-[#070810]/80 backdrop-blur-2xl">
        <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between px-6 md:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff6b2b] to-[#f4a935] fire-glow">
              <Anchor className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[-0.02em] text-white">ACE Protocol</p>
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#54566e]">
                Adaptive Cashflow
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-10 text-[13px] text-[#54566e] md:flex">
            <a href="#protocol" className="transition-colors duration-200 hover:text-white">Protocol</a>
            <a href="#principles" className="transition-colors duration-200 hover:text-white">Principles</a>
            <a href="#access" className="transition-colors duration-200 hover:text-white">Access</a>
          </div>

          <LaunchButton className="px-5 py-2.5 text-xs" />
        </div>
      </nav>

      {/* ═══════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════ */}
      <div className="protocol-bg relative flex min-h-[100dvh] flex-col items-center justify-center pt-[72px]">
        <div className="relative mx-auto max-w-[720px] px-6 text-center md:px-8">
          <motion.div {...fadeUp(0)}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#2a2b45] bg-[#0e0f1a] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[#54566e]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Solana-native protocol
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.1)}
            className="mt-8 text-5xl font-semibold leading-[1.05] tracking-[-0.03em] text-white md:text-6xl lg:text-7xl"
          >
            Execution-aware
            <br />
            <span className="text-[#a8a4b8]">cashflow automation</span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.18)}
            className="mx-auto mt-6 max-w-[520px] text-base leading-[1.7] text-[#7b7698] md:text-lg"
          >
            ACE separates reserve liquidity, investable capital, and payment obligations — so your
            recurring finances stay reliable under real network conditions.
          </motion.p>

          <motion.div
            {...fadeUp(0.24)}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <LaunchButton variant="primary" />
            <a
              href="#protocol"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#2a2b45] bg-[#0e0f1a] px-7 py-3.5 text-sm font-medium text-[#8b89a3] transition-all duration-200 hover:border-[#3a3c55] hover:bg-[#131420] hover:text-white"
            >
              Explore the flow <ChevronDown className="h-4 w-4" />
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="flex h-10 w-6 items-start justify-center rounded-full border border-[#2a2b45] p-1.5">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="h-1.5 w-1.5 rounded-full bg-[#54566e]"
            />
          </div>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════
          3D PROTOCOL FLOW
          ═══════════════════════════════════════════ */}
      <div id="protocol" className="relative border-y border-[#1c1d2e] bg-[#0a0915]">
        <div className="mx-auto max-w-[1200px] px-6 py-16 md:px-8 md:py-24">
          <Reveal>
            <div className="mb-10 text-center md:mb-14">
              <Eyebrow>Protocol Architecture</Eyebrow>
              <h2 className="mx-auto mt-3 max-w-[480px] text-xl font-semibold leading-[1.3] tracking-[-0.01em] text-white md:text-2xl">
                Capital enters. The engine decides the rest.
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative overflow-hidden rounded-[20px] border border-[#2a2b45] bg-[#070810] p-2 shadow-2xl shadow-black/60">
              {r3fError ? (
                <div className="flex h-[400px] items-center justify-center md:h-[520px]">
                  <div className="text-center">
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#2a2b45] bg-[#0e0f1a]">
                      <Anchor className="h-6 w-6 text-[#54566e]" />
                    </div>
                    <p className="text-[15px] font-medium text-[#54566e]">
                      Protocol flow visualization
                    </p>
                    <p className="mt-2 text-sm text-[#3a3c55]">
                      Capital → Reserve → Investable → Payments
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-[400px] md:h-[520px]">
                  <ProtocolFlowAnimation />
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS — 4 Steps
          ═══════════════════════════════════════════ */}
      <div className="relative bg-[#070810]">
        <Section className="py-16 md:py-24">
          <Reveal>
            <div className="mb-12 md:mb-16">
              <Eyebrow>How it works</Eyebrow>
              <h2 className="mt-3 max-w-[380px] text-xl font-semibold leading-[1.3] tracking-[-0.01em] text-white md:text-2xl">
                Four decisions. One deterministic engine.
              </h2>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                num: '01',
                title: 'Deposit',
                desc: 'Capital flows into a deterministic vault. No generic pooling. No commingled risk.',
              },
              {
                num: '02',
                title: 'Reserve Policy',
                desc: 'Upcoming obligations carve out protected liquidity before anything else is allocated.',
              },
              {
                num: '03',
                title: 'Investable Surplus',
                desc: 'Only excess capital becomes eligible for strategy routing. Safety precedes yield.',
              },
              {
                num: '04',
                title: 'Scheduled Settlement',
                desc: 'Payments execute around urgency, fees, and reliability — not fixed block timers.',
              },
            ].map(({ num, title, desc }, i) => (
              <Reveal key={title} delay={i * 0.08}>
                <div className="group h-full rounded-[16px] border border-[#2a2b45] bg-[#0e0f1a] p-8 transition-all duration-300 hover:border-[#3a3c55]">
                  <span className="text-sm font-mono font-semibold text-[#ff6b2b]">{num}</span>
                  <h3 className="mt-5 text-[15px] font-semibold tracking-[-0.01em] text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-[1.65] text-[#7b7698]">{desc}</p>
                  <div className="mt-6 h-[1px] w-8 bg-[#2a2b45] transition-all duration-300 group-hover:w-12 group-hover:bg-[#3a3c55]" />
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      </div>

      {/* ═══════════════════════════════════════════
          TRUST / PRINCIPLES
          ═══════════════════════════════════════════ */}
      <div className="relative border-t border-[#1c1d2e] bg-[#0a0915]">
        <Section id="principles" className="py-16 md:py-24">
          <Reveal>
            <div className="mb-12 md:mb-16">
              <Eyebrow>Trust surface</Eyebrow>
              <h2 className="mt-3 max-w-[400px] text-xl font-semibold leading-[1.3] tracking-[-0.01em] text-white md:text-2xl">
                Built to feel infrastructural, not theatrical.
              </h2>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                icon: Lock,
                title: 'Non-custodial by design',
                desc: 'Your wallet controls the vault. ACE never holds keys or operates as a centralized intermediary.',
              },
              {
                icon: Activity,
                title: 'Deterministic policy logic',
                desc: 'Every allocation, rebalance, and execution decision follows inspectable, rule-based calculations.',
              },
              {
                icon: BrainCircuit,
                title: 'Explainable reasoning',
                desc: 'AI summarizes protocol state in human terms. It never signs, holds, or moves funds.',
              },
              {
                icon: Timer,
                title: 'Wallet-gated dashboard',
                desc: 'The private dashboard is only accessible after wallet connection. No public leakage of positions.',
              },
            ].map(({ icon: Icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 0.06}>
                <div className="flex gap-6 rounded-[16px] border border-[#2a2b45] bg-[#0e0f1a] p-8 transition-all duration-300 hover:border-[#3a3c55]">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#2a2b45] bg-[#131420]">
                    <Icon className="h-5 w-5 text-[#54566e]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-white">{title}</h3>
                    <p className="mt-3 text-sm leading-[1.65] text-[#7b7698]">{desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      </div>

      {/* ═══════════════════════════════════════════
          WALLET GATE
          ═══════════════════════════════════════════ */}
      <div className="relative bg-[#070810]">
        <Section id="access" className="py-16 md:py-24">
          <Reveal>
            <div className="relative overflow-hidden rounded-[20px] border border-[#2a2b45] bg-[#0e0f1a] px-10 py-16 text-center md:px-20 md:py-20">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(139,92,246,0.06),transparent_60%)]" />

              <div className="relative">
                <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff6b2b] to-[#f4a935] fire-glow">
                  <Anchor className="h-7 w-7 text-white" />
                </div>

                <Eyebrow>Private Protocol Surface</Eyebrow>

                <h2 className="mx-auto mt-4 max-w-[480px] text-xl font-semibold leading-[1.3] tracking-[-0.01em] text-white md:text-2xl">
                  {connected ? 'Your dashboard is ready.' : 'Connect your wallet to enter.'}
                </h2>

                <p className="mx-auto mt-4 max-w-[440px] text-sm leading-[1.65] text-[#7b7698] md:text-[15px]">
                  The public site explains the system. The private dashboard is where reserve health,
                  payment flows, activity history, and reasoning logs become available.
                </p>

                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  {connected ? (
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold tracking-tight text-[#070810] transition-all duration-200 hover:bg-white/90"
                    >
                      Open Dashboard <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <>
                      <button
                        onClick={() => setVisible(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold tracking-tight text-[#070810] transition-all duration-200 hover:bg-white/90"
                      >
                        <Wallet className="h-4 w-4" />
                        Connect Wallet
                      </button>
                      <Link
                        href="https://github.com/enkethomassen/ace-protocol"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-[#2a2b45] bg-[#131420] px-7 py-3.5 text-sm font-medium text-[#8b89a3] transition-all duration-200 hover:border-[#3a3c55] hover:bg-[#1a1c2e] hover:text-white"
                      >
                        View repository <ArrowRight className="h-4 w-4" />
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        </Section>
      </div>

      {/* ═══════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════ */}
      <footer className="border-t border-[#1c1d2e] bg-[#070810]">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-6 px-6 py-12 text-center sm:flex-row sm:justify-between sm:px-8 sm:text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff6b2b] to-[#f4a935]">
              <Anchor className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-white">ACE Protocol</p>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#3a3c55]">
                Adaptive Cashflow Engine
              </p>
            </div>
          </div>
          <p className="text-xs text-[#3a3c55]">
            Execution-aware finance on Solana Devnet.
          </p>
        </div>
      </footer>
    </div>
  );
}
