'use client';
import { Zap, Clock, CheckCircle2, TrendingDown } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import type { ExecutionQualityMetric } from '@/types';
import { cn } from '@/lib/utils';

export function ExecutionQuality({ metrics }: { metrics: ExecutionQualityMetric }) {
  const stats = [
    { label: 'Avg slippage',      value: `${metrics.avgSlippage.toFixed(1)} bps`, icon: TrendingDown,  color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Exec time',         value: `${metrics.avgExecutionTime.toFixed(1)}s`, icon: Clock,        color: 'text-sky-400',     bg: 'bg-sky-500/10' },
    { label: 'Success rate',      value: `${metrics.successRate.toFixed(1)}%`,     icon: CheckCircle2,  color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Saved vs baseline', value: `$${metrics.savedVsBaseline.toFixed(2)}`, icon: Zap,           color: 'text-yellow-400',  bg: 'bg-yellow-500/10' },
  ];

  return (
    <Card>
      <CardHeader><CardTitle>Execution Quality</CardTitle></CardHeader>
      <div className="grid grid-cols-2 gap-2">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-[#1c1d2e] hover:border-[#2a2b45] transition-colors"
          >
            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', bg)}>
              <Icon className={cn('w-3.5 h-3.5', color)} />
            </div>
            <div>
              <p className="text-[10px] text-[#54566e]">{label}</p>
              <p className="text-[13px] font-bold text-white leading-tight">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
