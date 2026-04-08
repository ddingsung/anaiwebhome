import { cn } from '@aa/lib/utils'
import { getConfidenceLevel, formatConfidence } from '@aa/lib/format'

interface ConfidenceBadgeProps {
  value: number
  className?: string
}

const LEVEL_STYLES = {
  high: 'text-conf-high',
  mid:  'text-conf-mid',
  low:  'text-conf-low',
}

export function ConfidenceBadge({ value, className }: ConfidenceBadgeProps) {
  const level = getConfidenceLevel(value)
  return (
    <span className={cn('font-mono text-[12px] tabular-nums', LEVEL_STYLES[level], className)}>
      {formatConfidence(value)}
    </span>
  )
}
