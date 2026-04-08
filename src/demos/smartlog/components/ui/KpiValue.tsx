import { RiArrowRightUpLine, RiArrowRightDownLine, RiSubtractLine } from 'react-icons/ri';
import { clsx } from 'clsx';

interface KpiValueProps {
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'flat';
  trendLabel?: string;
  trendPositive?: boolean; // true면 up이 좋음, false면 down이 좋음
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZE_STYLES = {
  sm:  'text-lg',
  md:  'text-2xl',
  lg:  'text-3xl',
  xl:  'text-4xl',
};

export default function KpiValue({
  value,
  unit,
  trend,
  trendLabel,
  trendPositive = true,
  size = 'md',
  className,
}: KpiValueProps) {
  const isGood =
    trend === undefined
      ? undefined
      : trendPositive
      ? trend === 'up'
      : trend === 'down';

  const trendColor =
    isGood === undefined
      ? 'text-white/40'
      : isGood
      ? 'text-emerald-400'
      : 'text-red-400';

  return (
    <div className={clsx('flex items-baseline gap-1.5', className)}>
      <span className={clsx('font-mono font-semibold text-white/92', SIZE_STYLES[size])}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </span>
      {unit && (
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {unit}
        </span>
      )}
      {trend && trendLabel && (
        <span className={clsx('flex items-center gap-0.5 text-xs', trendColor)}>
          {trend === 'up' && <RiArrowRightUpLine size={12} />}
          {trend === 'down' && <RiArrowRightDownLine size={12} />}
          {trend === 'flat' && <RiSubtractLine size={12} />}
          {trendLabel}
        </span>
      )}
    </div>
  );
}
