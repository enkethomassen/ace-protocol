'use client';
// ============================================================
// ACE Protocol — Activity Log Page
// Every protocol decision is logged with human explanation.
// AI panel shows live explanations generated from vault state.
// ============================================================

import { useEffect, useState, useCallback } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getLog, subscribeLog } from '@/lib/activityLog';
import type { LogEntry } from '@/lib/activityLog';
import { useApp } from '@/context/AppContext';
import type { InsightRequest, InsightResponse } from '@/app/api/insights/route';
import {
  ArrowDownLeft, Zap, ShieldCheck, TrendingUp, AlertCircle,
  Settings, ArrowUpRight, Clock, Cpu, RefreshCw, Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const typeConfig: Record<LogEntry['type'], { icon: React.ComponentType<{ className?: string }>; color: string; label: string }> = {
  deposit:            { icon: ArrowDownLeft, color: 'text-emerald-400 bg-emerald-500/10', label: 'Deposit' },
  withdraw:           { icon: ArrowUpRight,  color: 'text-orange-400 bg-orange-500/10',  label: 'Withdraw' },
  payment:            { icon: Zap,           color: 'text-yellow-400 bg-yellow-500/10',  label: 'Payment' },
  execution_decision: { icon: Clock,         color: 'text-sky-400 bg-sky-500/10',         label: 'Execution' },
  policy:             { icon: Settings,      color: 'text-purple-400 bg-purple-500/10',   label: 'Policy' },
  yield:              { icon: TrendingUp,    color: 'text-emerald-400 bg-emerald-500/10', label: 'Yield' },
  reserve:            { icon: ShieldCheck,   color: 'text-blue-400 bg-blue-500/10',       label: 'Reserve' },
  error:              { icon: AlertCircle,   color: 'text-red-400 bg-red-500/10',          label: 'Error' },
};

function formatTs(ts: number): string {
  return new Date(ts * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

export default function ActivityPage() {
  const { vault, payments } = useApp();
  const [entries, setEntries] = useState<LogEntry[]>(getLog);
  const [insight, setInsight] = useState<InsightResponse | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  useEffect(() => {
    const unsub = subscribeLog(() => setEntries(getLog()));
    return unsub;
  }, []);

  const fetchInsight = useCallback(async () => {
    if (!vault) return;
    setLoadingInsight(true);

    const now = Math.floor(Date.now() / 1000);
    const safetyWindow = 7 * 86400;
    const upcoming = payments.filter(p => p.status === 'scheduled' && p.nextDue < now + safetyWindow);
    const totalUpcomingUsd = upcoming.reduce((s, p) => s + p.amountUsd, 0);
    const reserveRatio = vault.totalDeposited > 0
      ? Math.round((vault.reserveBalance / vault.totalDeposited) * 100)
      : 0;
    const reserveCoverage: InsightRequest['reserveCoverage'] =
      reserveRatio >= 15 ? 'healthy' : reserveRatio >= 8 ? 'warning' : 'critical';

    const body: InsightRequest = {
      reserveCoverage,
      upcomingPayments: upcoming.length,
      totalUpcomingUsd,
      executionUrgency: upcoming.some(p => p.nextDue < now + 86400) ? 'high'
        : upcoming.some(p => p.nextDue < now + 3 * 86400) ? 'medium' : 'low',
      estimatedFee: 0.000045,
      reserveRatio,
      freeBalance: vault.liquidBalance,
      investableBalance: vault.yieldBalance,
    };

    try {
      const res = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) setInsight(await res.json());
    } catch { /* silent */ }
    setLoadingInsight(false);
  }, [vault, payments]);

  // Auto-fetch on first load
  useEffect(() => {
    if (!vault) return;
    const timer = setTimeout(() => fetchInsight(), 0);
    return () => clearTimeout(timer);
  }, [vault]); // eslint-disable-line react-hooks/exhaustive-deps

  const counts = entries.reduce<Record<string, number>>((acc, e) => {
    acc[e.type] = (acc[e.type] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-5">

        {/* Header */}
        <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-900/15 via-[#13131a] to-[#0c0c13] p-5">
          <h2 className="text-lg font-bold text-white">Execution Activity Log</h2>
          <p className="text-sm text-gray-400 mt-1">
            Every decision the ACE engine makes is recorded here with its reason.
            No black-box behavior.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {Object.entries(counts).map(([type, count]) => {
              const cfg = typeConfig[type as LogEntry['type']];
              if (!cfg) return null;
              const Icon = cfg.icon;
              return (
                <span key={type} className={cn('flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium', cfg.color)}>
                  <Icon className="w-2.5 h-2.5" />
                  {cfg.label}: {count}
                </span>
              );
            })}
          </div>
        </div>

        {/* AI Insight Panel */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-sky-400" />
              <CardTitle>AI Execution Insight</CardTitle>
              <Badge variant="ocean" className="text-[10px]">
                {insight?.generatedBy ?? 'not loaded'}
              </Badge>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={fetchInsight}
              disabled={loadingInsight || !vault}
            >
              {loadingInsight
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <RefreshCw className="w-3.5 h-3.5" />}
              Refresh
            </Button>
          </CardHeader>

          {loadingInsight && !insight && (
            <div className="flex items-center gap-3 py-6 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
              Generating insight from vault state…
            </div>
          )}

          {!loadingInsight && !vault && (
            <p className="text-sm text-gray-600 py-4">Connect a wallet or use simulation mode to generate insights.</p>
          )}

          {insight && (
            <div className="space-y-3">
              {/* Summary */}
              <div className="p-3 rounded-xl bg-sky-500/5 border border-sky-500/15">
                <p className="text-xs font-semibold text-sky-400 mb-1">Summary</p>
                <p className="text-sm text-gray-300 leading-relaxed">{insight.summary}</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {/* Reserve */}
                <div className="p-3 rounded-xl bg-white/3 border border-[#2a2a3a]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-yellow-400" />
                    <p className="text-xs font-semibold text-yellow-400">Reserve Logic</p>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{insight.reserveExplanation}</p>
                </div>

                {/* Execution */}
                <div className="p-3 rounded-xl bg-white/3 border border-[#2a2a3a]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Clock className="w-3.5 h-3.5 text-orange-400" />
                    <p className="text-xs font-semibold text-orange-400">Execution Timing</p>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{insight.executionExplanation}</p>
                </div>
              </div>

              {/* Recommendation */}
              <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                <p className="text-xs font-semibold text-emerald-400 mb-1">Recommendation</p>
                <p className="text-sm text-gray-300 leading-relaxed">{insight.recommendation}</p>
              </div>

              <p className="text-[10px] text-gray-700 italic">
                AI provides explanations only. All fund movements require explicit user action.
                Generated by: {insight.generatedBy}
              </p>
            </div>
          )}
        </Card>

        {/* Log */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Feed</CardTitle>
            <span className="text-xs text-gray-600">{entries.length} events</span>
          </CardHeader>
          <div className="space-y-1">
            {entries.length === 0 && (
              <p className="text-sm text-gray-600 py-8 text-center">No activity yet. Interact with the vault to see logs.</p>
            )}
            {entries.map(entry => {
              const cfg = typeConfig[entry.type];
              const Icon = cfg.icon;
              return (
                <div
                  key={entry.id}
                  className="flex items-start gap-3 py-3 px-2 border-b border-[#1a1a24] last:border-0 hover:bg-white/2 rounded-lg transition-all group"
                >
                  <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5', cfg.color)}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium">{entry.message}</p>
                    {entry.detail && (
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{entry.detail}</p>
                    )}
                    {entry.txSig && (
                      <a
                        href={`https://solscan.io/tx/${entry.txSig}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-mono text-gray-700 hover:text-sky-400 transition-colors mt-0.5 block"
                      >
                        tx: {entry.txSig.slice(0, 20)}…
                      </a>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-gray-700 font-mono">{formatTs(entry.timestamp)}</span>
                    <div className="mt-1">
                      <Badge variant="muted" className="text-[9px]">{cfg.label}</Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
