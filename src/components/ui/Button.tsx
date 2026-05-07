'use client';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

type Variant = 'fire' | 'outline' | 'ghost' | 'danger' | 'success';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  fire: 'bg-gradient-to-r from-[#ff6b2b] to-[#f4a935] text-white font-semibold hover:opacity-88 active:scale-[0.98] shadow-lg shadow-orange-950/50',
  outline: 'border border-[#1c1d2e] text-gray-300 hover:border-orange-500/40 hover:text-white bg-transparent active:scale-[0.98]',
  ghost: 'text-[#54566e] hover:text-white hover:bg-white/5 bg-transparent active:scale-[0.98]',
  danger: 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 active:scale-[0.98]',
  success: 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 active:scale-[0.98]',
};

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-xl',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-6 py-3 text-sm font-semibold rounded-xl',
};

export function Button({
  children,
  variant = 'fire',
  size = 'md',
  className,
  disabled,
  loading,
  onClick,
  type = 'button',
  fullWidth,
}: {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
  fullWidth?: boolean;
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className,
      )}
    >
      {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
      {children}
    </button>
  );
}
