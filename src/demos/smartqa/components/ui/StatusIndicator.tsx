import type { SystemState } from '@sq/lib/types/inspection'

const STATE_COLORS: Record<SystemState, string> = {
  normal:      '#3ecf6a',
  warn:        '#e8a820',
  ng:          '#d94040',
  offline:     '#4b5563',
  manual:      '#4f86cc',
  calibrating: '#e07830',
  stale:       '#8a8a8a',
}

interface Props {
  state: SystemState
  label?: string
  size?: 'sm' | 'md'
}

export function StatusIndicator({ state, label, size = 'md' }: Props) {
  const dotPx = size === 'sm' ? 6 : 8
  return (
    <span className="flex items-center gap-1.5">
      <span
        className="rounded-full flex-none"
        style={{ width: dotPx, height: dotPx, backgroundColor: STATE_COLORS[state] }}
      />
      {label && (
        <span className="text-xs text-text-secondary font-medium">{label}</span>
      )}
    </span>
  )
}
