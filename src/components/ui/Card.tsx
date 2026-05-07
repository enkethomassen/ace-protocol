'use client';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function Card({
  children,
  className,
  hover = false,
  animate = false,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  animate?: boolean;
  delay?: number;
}) {
  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1], delay }}
        className={cn(
          'rounded-2xl border border-[#1c1d2e] bg-[#0e0f1a] p-5',
          hover && 'card-hover cursor-pointer',
          className,
        )}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-2xl border border-[#1c1d2e] bg-[#0e0f1a] p-5',
        hover && 'card-hover cursor-pointer',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('flex items-center justify-between mb-4', className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn('text-[11px] font-semibold text-[#54566e] uppercase tracking-[0.12em]', className)}>
      {children}
    </h3>
  );
}
