'use client';
import { AppShell } from '@/components/layout/AppShell';
import { CashflowSummary } from '@/components/dashboard/CashflowSummary';
import { InsightsFeed } from '@/components/dashboard/InsightsFeed';
import { ExecutionQuality } from '@/components/dashboard/ExecutionQuality';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { AllocationChart } from '@/components/charts/AllocationChart';
import { YieldChart } from '@/components/charts/YieldChart';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useApp } from '@/context/AppContext';
import { Loader2, Plus, RefreshCw, Anchor, TrendingUp } from 'lucide-react';
import { formatUsd, formatPercent } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.06 } } },
  item: {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  },
};

export default function DashboardPage() {
  const { vault, summary, transactions, isLoading, refreshVault } = useApp();
  const router = useRouter();

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-7 h-7 text-orange-400 animate-spin" />
            <p className="text-xs text-[#54566e]">Charting your course…</p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!vault || !summary) return null;

  return (
    <AppShell>
      <motion.div
        variants={stagger.container}
        initial="hidden"
        animate="show"
        className="max-w-6xl mx-auto space-y-4"
      >
        {/* Vault hero banner */}
        <motion.div variants={stagger.item}>
          <div className="relative rounded-2xl overflow-hidden border border-[#1c1d2e] bg-[#0e0f1a] p-6">
            {/* Background glow */}
            <div
              className="absolute inset-0 opacity-100 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 55% 80% at 0% 50%, rgba(255,107,43,0.07) 0%, transparent 70%), radial-gradient(ellipse 40% 60% at 100% 50%, rgba(244,169,53,0.04) 0%, transparent 70%)',
              }}
            />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center">
                    <Anchor className="w-3 h-3 text-white" />
                  </div>
                  <Badge variant="success">Active Vault</Badge>
                  <Badge variant="muted">Devnet</Badge>
                </div>
                <h2 className="text-[2rem] font-bold text-white tracking-tight">{formatUsd(vault.totalDeposited)}</h2>
                <p className="text-[#54566e] text-xs mt-0.5">Total capital under management</p>
                <div className="flex items-center gap-3 mt-2.5 text-xs">
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <TrendingUp className="w-3 h-3" />
                    {formatPercent(vault.apy)} APY
                  </span>
                  <span className="text-[#2a2c40]">·</span>
                  <span className="text-[#54566e]">Risk: {vault.riskLevel}</span>
                  <span className="text-[#2a2c40]">·</span>
                  <span className="text-[#54566e] font-mono text-[10px]">#{vault.id.slice(-6)}</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" size="sm" onClick={refreshVault}>
                  <RefreshCw className="w-3.5 h-3.5" />
                  Refresh
                </Button>
                <Button size="sm" onClick={() => router.push('/vault')}>
                  <Plus className="w-3.5 h-3.5" />
                  Deposit
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Summary stats */}
        <motion.div variants={stagger.item}>
          <CashflowSummary summary={summary} />
        </motion.div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-3 gap-4">

          {/* Left column */}
          <div className="lg:col-span-2 space-y-4">
            <motion.div variants={stagger.item}>
              <InsightsFeed />
            </motion.div>

            <motion.div variants={stagger.item}>
              <Card>
                <CardHeader>
                  <CardTitle>Cumulative Yield — 30 Days</CardTitle>
                  <span className="text-xs text-emerald-400 font-semibold">
                    +{formatUsd(summary.totalEarnedYield)}
                  </span>
                </CardHeader>
                <YieldChart />
              </Card>
            </motion.div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <motion.div variants={stagger.item}>
              <Card>
                <CardHeader>
                  <CardTitle>Capital Allocation</CardTitle>
                </CardHeader>
                <AllocationChart vault={vault} />
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {[
                    { label: 'Yield',    value: vault.yieldBalance,   color: '#10b981' },
                    { label: 'Reserve',  value: vault.reserveBalance,  color: '#f4a935' },
                    { label: 'Liquid',   value: vault.liquidBalance,   color: '#ff6b2b' },
                    { label: 'Payments', value: vault.paymentsBalance, color: '#0ea5e9' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="flex items-center gap-2 text-[11px]">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                      <span className="text-[#54566e]">{label}</span>
                      <span className="ml-auto text-gray-300 font-medium">{formatUsd(value, 0)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            <motion.div variants={stagger.item}>
              <ExecutionQuality metrics={summary.executionQuality} />
            </motion.div>
          </div>
        </div>

        {/* Recent activity */}
        <motion.div variants={stagger.item}>
          <RecentActivity transactions={transactions} />
        </motion.div>
      </motion.div>
    </AppShell>
  );
}
