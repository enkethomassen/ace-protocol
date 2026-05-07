'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import {
  Anchor, ArrowRight, BrainCircuit, Clock3, Layers3,
  ShieldCheck, Sparkles, TimerReset, Wallet, Workflow, ChevronRight,
} from 'lucide-react';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay },
});

const protocolBuckets = [
  {
    icon: Layers3,
    title: 'Reserve Bucket',
    desc: 'Capital held close to execution so scheduled obligations have priority coverage before any optional deployment.',
  },
  {
    icon: Sparkles,
    title: 'Investable Bucket',
    desc: 'Excess balance is identified deterministically and can be routed into approved strategies without eroding reserve safety.',
  },
  {
    icon: Wallet,
    title: 'Free Balance',
    desc: 'Immediate liquidity remains available for user-directed actions instead of being buried inside hidden system flows.',
  },
  {
    icon: TimerReset,
    title: 'Execution Timing',
    desc: 'ACE sequences rebalances and payment flows around urgency, fee conditions, and reserve integrity rather than fixed timers.',
  },
];

const enginePillars = [
  {
    icon: Workflow,
    eyebrow: 'Execution Engine',
    title: 'Deterministic routing for recurring value movement',
    description:
      'ACE scores payment urgency, reserve pressure, and execution conditions before surfacing the next allowed protocol action.',
  },
  {
    icon: BrainCircuit,
    eyebrow: 'Explainable Intelligence',
    title: 'AI interprets protocol state instead of controlling funds',
    description:
      'Reasoning outputs summarize reserve posture, timing tradeoffs, and failure causes with user-facing explanations bounded by protocol facts.',
  },
  {
    icon: ShieldCheck,
    eyebrow: 'Self-Custody',
    title: 'Wallet-led access with reserve-aware safeguards',
    description:
      'The dashboard remains private to connected wallets, while execution stays transparent, auditable, and policy constrained.',
  },
];

function LaunchButton({ className, variant = 'primary' }: { className?: string; variant?: 'primary' | 'secondary' }) {
  const router = useRouter();
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();

  useEffect(() => {
    if (connected) router.push('/dashboard');
  }, [connected, router]);

  const base =
    variant === 'primary'
      ? 'violet-glow bg-[linear-gradient(135deg,#8b5cf6_0%,#d946ef_55%,#fb7185_100%)] text-white'
      : 'border border-white/10 bg-white/5 text-[#f5f1ff] hover:bg-white/8';

  return (
    <button
      onClick={() => (connected ? router.push('/dashboard') : setVisible(true))}
      className={`${base} ${className ?? ''}`}
    >
      {connected ? 'Enter Dashboard' : 'Connect Wallet'}
    </button>
  );
}

export default function LandingPage() {
  return (
    <div className="protocol-bg min-h-screen overflow-x-hidden font-sans text-[#f5f1ff]">

      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#07060d]/72 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <div className="violet-glow flex h-9 w-9 items-center justify-center rounded-2xl border border-fuchsia-400/20 bg-[linear-gradient(135deg,rgba(183,120,255,0.3),rgba(255,118,210,0.18))]">
              <Anchor className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[-0.02em] text-white">ACE Protocol</p>
              <p className="text-[10px] uppercase tracking-[0.26em] text-[#8c85aa]">Adaptive Cashflow Engine</p>
            </div>
          </div>
          <div className="hidden items-center gap-7 text-xs text-[#9a93b3] md:flex">
            <a href="#protocol" className="transition-colors hover:text-white">Protocol</a>
            <a href="#engine" className="transition-colors hover:text-white">Execution</a>
            <a href="#ai" className="transition-colors hover:text-white">AI reasoning</a>
            <a href="#trust" className="transition-colors hover:text-white">Trust</a>
          </div>
          <LaunchButton className="rounded-full px-5 py-2.5 text-xs font-semibold transition-opacity hover:opacity-95" />
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-14 px-5 pb-24 pt-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)] lg:items-center">
        <div>
          <motion.div {...fade(0)}>
            <span className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/18 bg-fuchsia-400/6 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.24em] text-fuchsia-200/78">
              <span className="h-2 w-2 rounded-full bg-fuchsia-300 shadow-[0_0_16px_rgba(217,70,239,0.8)]" />
              Solana devnet protocol surface
            </span>
          </motion.div>

          <motion.h1
            {...fade(0.06)}
            className="mt-7 max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl"
          >
            Automated cashflow,
            <span className="gradient-protocol block pb-2 pt-3">timed for execution reality.</span>
          </motion.h1>

          <motion.p
            {...fade(0.12)}
            className="mt-7 max-w-2xl text-lg leading-8 text-[#b3acc8] sm:text-xl"
          >
            ACE is an execution-aware cashflow engine for Solana. It separates reserve liquidity, investable capital, and payment obligations so recurring finance can stay reliable under real network conditions.
          </motion.p>

          <motion.div {...fade(0.18)} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <LaunchButton className="inline-flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold" />
            <a
              href="#protocol"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/4 px-6 py-3.5 text-sm font-medium text-[#ece8ff] transition-colors hover:bg-white/7"
            >
              Explore protocol flow <ChevronRight className="h-4 w-4" />
            </a>
          </motion.div>

          <motion.div
            {...fade(0.24)}
            className="mt-10 grid gap-3 text-sm text-[#c9c4da] sm:grid-cols-3"
          >
            {[
              'Recurring payment coordination',
              'Reserve-aware liquidity policy',
              'Explainable execution reasoning',
            ].map((item) => (
              <div key={item} className="glass-panel rounded-2xl border border-white/8 px-4 py-4">
                {item}
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div {...fade(0.14)} className="relative">
          <div className="pointer-events-none absolute -left-14 top-14 h-40 w-40 rounded-full bg-fuchsia-500/18 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 bottom-8 h-36 w-36 rounded-full bg-cyan-400/12 blur-3xl" />
          <div className="glass-panel relative overflow-hidden rounded-[32px] border border-white/10 p-5 shadow-[0_35px_120px_rgba(4,2,12,0.65)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(192,132,252,0.16),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.08),transparent_32%)]" />
            <div className="relative">
              <div className="flex items-center justify-between border-b border-white/8 pb-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#8f89ad]">Execution map</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">Reserve-aware flow control</h2>
                </div>
                <span className="rounded-full border border-fuchsia-400/18 bg-fuchsia-400/8 px-3 py-1 text-[11px] font-medium text-fuchsia-200/85">
                  Public overview only
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {[
                  { title: 'Incoming capital', body: 'Deposits enter a deterministic allocation policy instead of a generic wallet dashboard.' },
                  { title: 'Reserve checkpoint', body: 'Upcoming obligations and timing windows determine what must remain execution-ready.' },
                  { title: 'Investable surplus', body: 'Only excess liquidity becomes eligible for strategy routing under protocol constraints.' },
                  { title: 'Scheduled settlement', body: 'Payment execution is queued around urgency, fees, and reliability requirements.' },
                ].map(({ title, body }, index) => (
                  <div key={title} className="rounded-2xl border border-white/8 bg-black/18 p-4">
                    <div className="mb-2 flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/6 text-xs font-semibold text-fuchsia-100">
                        0{index + 1}
                      </span>
                      <p className="text-sm font-semibold text-white">{title}</p>
                    </div>
                    <p className="text-sm leading-6 text-[#b8b0d1]">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section id="protocol" className="mx-auto max-w-7xl px-5 pb-24">
        <motion.div {...fade(0)} className="mb-10 max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-fuchsia-200/70">Protocol explanation</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
            Four system buckets, each with a clear job.
          </h2>
          <p className="mt-4 text-base leading-7 text-[#b3acc8]">
            ACE avoids fuzzy “all balance in one pool” behavior. Every dollar-equivalent position is classified according to execution responsibility.
          </p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {protocolBuckets.map(({ icon: Icon, title, desc }, i) => (
            <motion.div key={title} {...fade(i * 0.06)} className="glass-panel card-hover rounded-[28px] border border-white/8 p-6">
              <div className="violet-glow mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-fuchsia-400/18 bg-[linear-gradient(135deg,rgba(139,92,246,0.24),rgba(217,70,239,0.14))]">
                <Icon className="h-5 w-5 text-fuchsia-100" />
              </div>
              <h3 className="text-lg font-semibold tracking-[-0.03em] text-white">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#b3acc8]">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="engine" className="mx-auto max-w-7xl px-5 pb-24">
        <div className="glass-panel rounded-[32px] border border-white/8 p-7 sm:p-10">
          <motion.div {...fade(0)} className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-fuchsia-200/70">Execution engine</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                Payment timing is a protocol concern, not a UI afterthought.
              </h2>
              <p className="mt-4 text-base leading-7 text-[#b3acc8]">
                Inspired by execution-first infrastructure thinking, ACE prioritizes timing windows, reserve coverage, and transaction reliability before capital is re-routed or a payment is sent.
              </p>
            </div>

            <div className="grid gap-4">
              {[
                {
                  title: 'Urgency scoring',
                  body: 'Recurring obligations are ranked by due date proximity, reserve coverage, and available liquid balance.',
                },
                {
                  title: 'Cost-aware batching',
                  body: 'Rebalances and settlement flows can be delayed or combined when urgency is low and network conditions are expensive.',
                },
                {
                  title: 'Priority execution',
                  body: 'When payment risk rises, the engine favors reliability and timely settlement over optional optimization.',
                },
              ].map(({ title, body }, i) => (
                <motion.div key={title} {...fade(i * 0.05)} className="rounded-[24px] border border-white/8 bg-black/16 p-5">
                  <div className="flex items-center gap-3">
                    <Clock3 className="h-4 w-4 text-fuchsia-200" />
                    <h3 className="text-sm font-semibold text-white">{title}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#b3acc8]">{body}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section id="ai" className="mx-auto max-w-7xl px-5 pb-24">
        <motion.div {...fade(0)} className="mb-10 max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-fuchsia-200/70">AI reasoning</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
            Explainable reasoning, never autonomous fund control.
          </h2>
          <p className="mt-4 text-base leading-7 text-[#b3acc8]">
            ACE uses deterministic protocol calculations first. AI is limited to summarizing state, clarifying reserve logic, and explaining execution decisions in human terms.
          </p>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-3">
          {enginePillars.map(({ icon: Icon, eyebrow, title, description }, i) => (
            <motion.div key={title} {...fade(i * 0.05)} className="glass-panel rounded-[28px] border border-white/8 p-6">
              <Icon className="h-5 w-5 text-fuchsia-200" />
              <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8f89ad]">{eyebrow}</p>
              <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-white">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#b3acc8]">{description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="trust" className="mx-auto max-w-7xl px-5 pb-24">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="glass-panel rounded-[30px] border border-white/8 p-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fuchsia-200/70">Trust surface</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">Built to feel infrastructural, not theatrical.</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              'Wallet-based access keeps dashboard data private.',
              'Reserve logic is deterministic and inspectable.',
              'Execution decisions remain visible to the user.',
              'AI never signs, holds, or moves funds.',
            ].map((item, i) => (
              <motion.div key={item} {...fade(i * 0.04)} className="glass-panel rounded-[24px] border border-white/8 p-5 text-sm leading-7 text-[#d7d2e7]">
                {item}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24">
        <motion.div {...fade(0)} className="glass-panel relative overflow-hidden rounded-[34px] border border-fuchsia-300/12 px-7 py-10 text-center sm:px-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(217,70,239,0.16),transparent_40%)]" />
          <div className="relative">
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-fuchsia-200/70">Launch protocol</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
              Connect your wallet to enter the private dashboard.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#b3acc8]">
              The public site explains the system. The private dashboard is where reserve health, recurring payment flows, activity history, and reasoning logs become available to the wallet owner.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <LaunchButton className="inline-flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold" />
              <Link
                href="https://github.com/enkethomassen/ace-protocol"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/4 px-6 py-3.5 text-sm font-medium text-[#ece8ff] transition-colors hover:bg-white/7"
              >
                View repository <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <footer className="border-t border-white/6 bg-black/18">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-[#8f89ad] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-2xl border border-fuchsia-400/20 bg-[linear-gradient(135deg,rgba(183,120,255,0.3),rgba(255,118,210,0.18))]">
              <Anchor className="h-3.5 w-3.5 text-white" />
            </div>
            <div>
              <p className="font-medium text-white">ACE Protocol</p>
              <p className="text-xs uppercase tracking-[0.2em] text-[#7d7699]">Adaptive Cashflow Engine</p>
            </div>
          </div>
          <p className="text-xs text-[#7d7699]">Execution-aware finance on Solana Devnet.</p>
        </div>
      </footer>
    </div>
  );
}
