'use client';
import { Lightbulb, AlertTriangle, TrendingUp, X, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useApp } from '@/context/AppContext';
import type { CashflowInsight } from '@/types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const typeIcon: Record<string, React.ReactNode> = {
  recommendation: <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />,
  alert:          <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />,
  prediction:     <TrendingUp className="w-3.5 h-3.5 text-sky-400" />,
};

const impactVariant: Record<string, 'fire' | 'gold' | 'ocean' | 'muted'> = {
  high:   'fire',
  medium: 'gold',
  low:    'ocean',
};

const typeBg: Record<string, string> = {
  recommendation: 'bg-yellow-500/5 border-yellow-500/15',
  alert:          'bg-orange-500/5 border-orange-500/20',
  prediction:     'bg-sky-500/5 border-sky-500/15',
};

export function InsightsFeed() {
  const { insights, dismissInsight } = useApp();

  if (!insights.length) {
    return (
      <Card>
        <CardHeader><CardTitle>AI Crew Insights</CardTitle></CardHeader>
        <p className="text-xs text-[#54566e] text-center py-6">All clear — no active recommendations.</p>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Crew Insights</CardTitle>
        <Badge variant="fire">{insights.length} active</Badge>
      </CardHeader>
      <div className="space-y-2">
        <AnimatePresence>
          {insights.map((insight, i) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.96 }}
              transition={{ delay: i * 0.05, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <InsightItem insight={insight} onDismiss={dismissInsight} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Card>
  );
}

function InsightItem({
  insight,
  onDismiss,
}: {
  insight: CashflowInsight;
  onDismiss: (id: string) => void;
}) {
  return (
    <div className={cn('flex gap-3 p-3 rounded-xl border transition-all', typeBg[insight.type])}>
      <div className="mt-0.5 shrink-0 w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center">
        {typeIcon[insight.type]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[13px] font-semibold text-white">{insight.title}</p>
          <button
            onClick={() => onDismiss(insight.id)}
            className="text-[#3a3c55] hover:text-[#54566e] shrink-0 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
        <p className="text-[11px] text-[#54566e] mt-0.5 leading-relaxed">{insight.description}</p>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant={impactVariant[insight.impact]}>{insight.impact}</Badge>
          <span className="text-[10px] text-[#3a3c55]">{(insight.confidence * 100).toFixed(0)}% confidence</span>
          {insight.action && (
            <button className="ml-auto flex items-center gap-0.5 text-[11px] text-orange-400 hover:text-orange-300 transition-colors font-medium">
              {insight.action.label} <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
