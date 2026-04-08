import { clsx } from 'clsx';

type BadgeVariant = 'critical' | 'warning' | 'normal' | 'idle' | 'info' | 'ai' | 'ghost';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  size?: BadgeSize;
  className?: string;
  dot?: boolean;
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  critical: 'bg-red-500/10 text-red-400 border-red-500/20',
  warning:  'bg-amber-500/10 text-amber-400 border-amber-500/20',
  normal:   'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  idle:     'bg-white/5 text-white/40 border-white/10',
  info:     'bg-blue-500/10 text-blue-400 border-blue-500/20',
  ai:       'bg-violet-500/10 text-violet-400 border-violet-500/20',
  ghost:    'bg-transparent text-white/40 border-white/10',
};

const DOT_COLORS: Record<BadgeVariant, string> = {
  critical: 'bg-red-400',
  warning:  'bg-amber-400',
  normal:   'bg-emerald-400',
  idle:     'bg-white/30',
  info:     'bg-blue-400',
  ai:       'bg-violet-400',
  ghost:    'bg-white/20',
};

export default function Badge({ variant, children, size = 'sm', className, dot }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded border font-medium',
        size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs',
        VARIANT_STYLES[variant],
        className
      )}
    >
      {dot && (
        <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', DOT_COLORS[variant])} />
      )}
      {children}
    </span>
  );
}
