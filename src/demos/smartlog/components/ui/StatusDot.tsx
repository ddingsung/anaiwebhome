import { clsx } from 'clsx';

type DotStatus = 'critical' | 'warning' | 'normal' | 'idle' | 'info';

interface StatusDotProps {
  status: DotStatus;
  pulse?: boolean;
  size?: 'sm' | 'md';
}

const STATUS_COLORS: Record<DotStatus, string> = {
  critical: 'bg-red-400',
  warning:  'bg-amber-400',
  normal:   'bg-emerald-400',
  idle:     'bg-white/20',
  info:     'bg-blue-400',
};

export default function StatusDot({ status, pulse, size = 'md' }: StatusDotProps) {
  return (
    <span
      className={clsx(
        'rounded-full inline-block shrink-0',
        size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2',
        STATUS_COLORS[status],
        pulse && (status === 'critical' ? 'animate-pulse-critical' : status === 'warning' ? 'animate-pulse-warning' : '')
      )}
    />
  );
}
