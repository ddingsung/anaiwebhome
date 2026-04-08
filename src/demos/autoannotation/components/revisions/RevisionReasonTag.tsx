import { cn } from '@aa/lib/utils'
import { REJECTION_REASON_LABELS, type RejectionReason } from '@aa/lib/types/task'

interface RevisionReasonTagProps {
  reason: RejectionReason
  className?: string
}

export function RevisionReasonTag({ reason, className }: RevisionReasonTagProps) {
  return (
    <span className={cn(
      'inline-flex items-center rounded border border-status-rejected/30',
      'bg-[#1a0a0a] px-1.5 py-0.5 text-[10px] text-status-rejected',
      className
    )}>
      {REJECTION_REASON_LABELS[reason]}
    </span>
  )
}
