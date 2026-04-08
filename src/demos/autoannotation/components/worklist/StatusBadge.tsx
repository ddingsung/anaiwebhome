import { cn } from '@aa/lib/utils'
import { TASK_STATUS_LABELS, type TaskStatus } from '@aa/lib/types/task'

interface StatusBadgeProps {
  status: TaskStatus
  className?: string
}

const STATUS_STYLES: Record<TaskStatus, string> = {
  pending:  'bg-[hsl(var(--accent-domain-muted))] text-[hsl(var(--accent-domain-text))]',
  ai_done:  'bg-bg-surface text-text-secondary',
  revision: 'bg-[#2a1a0a] text-status-revision',
  rejected: 'bg-[#2a0f0f] text-status-rejected',
  approved: 'bg-[#0f2a1a] text-status-approved',
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium leading-none whitespace-nowrap',
      STATUS_STYLES[status],
      className
    )}>
      {TASK_STATUS_LABELS[status]}
    </span>
  )
}
