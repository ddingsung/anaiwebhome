'use client';

import { cx } from '@sl/lib/utils';
import KpiValue from '@sl/components/ui/KpiValue';

interface KpiSummaryCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'flat';
  trendLabel?: string;
  trendPositive?: boolean;
  status?: 'normal' | 'warning' | 'critical' | 'idle';
  subLabel?: string;
  icon?: React.ReactNode;
}

const STATUS_STYLE: Record<string, React.CSSProperties> = {
  critical: {
    background: 'rgba(239,68,68,0.07)',
    borderColor: 'rgba(239,68,68,0.35)',
    boxShadow: '0 0 16px rgba(239,68,68,0.10)',
  },
  warning: {
    background: 'rgba(245,158,11,0.05)',
    borderColor: 'rgba(245,158,11,0.25)',
    boxShadow: '0 0 12px rgba(245,158,11,0.07)',
  },
  normal: {
    background: 'var(--bg-surface)',
    borderColor: 'rgba(16,185,129,0.15)',
  },
  idle: {
    background: 'var(--bg-surface)',
    borderColor: 'var(--border-subtle)',
  },
};

const ICON_COLOR: Record<string, string> = {
  critical: '#f87171',
  warning:  '#fbbf24',
  normal:   'rgba(255,255,255,0.20)',
  idle:     'rgba(255,255,255,0.15)',
};

export default function KpiSummaryCard({
  label,
  value,
  unit,
  trend,
  trendLabel,
  trendPositive = true,
  status = 'normal',
  subLabel,
  icon,
}: KpiSummaryCardProps) {
  return (
    <div
      className="rounded-lg p-4 flex flex-col gap-1.5 border"
      style={STATUS_STYLE[status]}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium tracking-wide uppercase" style={{ color: 'var(--text-muted)' }}>
          {label}
        </span>
        {icon && (
          <span style={{ color: ICON_COLOR[status] }}>
            {icon}
          </span>
        )}
      </div>

      <KpiValue
        value={value}
        unit={unit}
        trend={trend}
        trendLabel={trendLabel}
        trendPositive={trendPositive}
        size="lg"
      />

      {subLabel && (
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {subLabel}
        </span>
      )}
    </div>
  );
}
