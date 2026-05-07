'use client';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function StatCard({
  label,
  value,
  subValue,
  icon,
  accent = 'fire',
  className,
  delay = 0,
}: {
  label: string;
  value: string;
  subValue?: string;
  icon?: React.ReactNode;
  accent?: 'fire' | 'gold' | 'green' | 'ocean' | 'muted';
  className?: string;
  delay?: number;
}) {
  const accentBorder: Record<string, string> = {
    fire:  'border-orange-500/20',
    gold:  'border-yellow-500/20',
    green: 'border-emerald-500/20',
    ocean: 'border-sky-500/20',
    muted: 'border-white/8',
  };
  const accentGlow: Record<string, string> = {
    fire:  'from-orange-500/10 via-transparent to-transparent',
    gold:  'from-yellow-500/10 via-transparent to-transparent',
    green: 'from-emerald-500/10 via-transparent to-transparent',
    ocean: 'from-sky-500/10 via-transparent to-transparent',
    muted: 'from-white/4 via-transparent to-transparent',
  };
  const iconBg: Record<string, string> = {
    fire:  'bg-orange-500/15 text-orange-400',
    gold:  'bg-yellow-500/15 text-yellow-400',
    green: 'bg-emerald-500/15 text-emerald-400',
    ocean: 'bg-sky-500/15 text-sky-400',
    muted: 'bg-white/5 text-gray-400',
  };
  const barColor: Record<string, string> = {
    fire:  'from-orange-500 to-amber-400',
    gold:  'from-yellow-500 to-amber-300',
    green: 'from-emerald-500 to-teal-400',
    ocean: 'from-sky-500 to-cyan-400',
    muted: 'from-gray-600 to-gray-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay }}
      className={cn(
        'relative rounded-2xl border bg-gradient-to-br bg-[#0e0f1a] p-5 overflow-hidden',
        accentBorder[accent],
        accentGlow[accent],
        className,
      )}
    >
      {/* Top accent line */}
      <div className={cn(
        'absolute top-0 left-5 right-5 h-[1.5px] rounded-b-full bg-gradient-to-r opacity-70',
        barColor[accent],
      )} />

      <div className="flex items-start justify-between gap-3 mt-1">
        <div className="space-y-1.5 min-w-0">
          <p className="text-[10px] font-semibold text-[#54566e] uppercase tracking-[0.12em]">{label}</p>
          <p className="text-[1.6rem] font-bold text-white tracking-tight leading-none">{value}</p>
          {subValue && <p className="text-[11px] text-[#54566e]">{subValue}</p>}
        </div>
        {icon && (
          <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', iconBg[accent])}>
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
}
