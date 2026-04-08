import { cn } from '@aa/lib/utils'
import { formatRelativeTime } from '@aa/lib/format'
import { StatusBadge } from './StatusBadge'
import { ConfidenceBadge } from './ConfidenceBadge'
import type { Task } from '@aa/lib/types/task'

interface WorklistRowProps {
  task: Task
  isSelected: boolean
  isChecked: boolean
  onClick: () => void
  onCheck: (e: React.MouseEvent) => void
}

export function WorklistRow({ task, isSelected, isChecked, onClick, onCheck }: WorklistRowProps) {
  return (
    <div
      role="row"
      aria-selected={isSelected}
      onClick={onClick}
      className={cn(
        'grid cursor-pointer select-none border-b border-border-muted',
        'items-center px-3 py-2 transition-colors',
        'grid-cols-[20px_1fr_90px_70px_40px_72px]',
        isSelected
          ? 'bg-accent-domain-muted'
          : 'hover:bg-bg-surface'
      )}
    >
      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => {}}
        onClick={(e) => { e.stopPropagation(); onCheck(e) }}
        className="h-3.5 w-3.5 cursor-pointer accent-accent-domain"
      />

      <div className="min-w-0 pr-2">
        <p className="truncate text-[12px] text-text-primary">{task.filename}</p>
        <p className="text-[10px] text-text-muted">
          피부병변 · 객체 {task.annotationCount}개
          {task.revisionCount > 0 && (
            <span className="ml-1 text-status-revision">수정 {task.revisionCount}회</span>
          )}
        </p>
      </div>

      <div>
        <StatusBadge status={task.status} />
      </div>

      <ConfidenceBadge value={task.confidence} />

      <span className={cn(
        'text-[11px]',
        task.revisionCount > 0 ? 'text-status-revision' : 'text-text-muted'
      )}>
        {task.revisionCount > 0 ? `${task.revisionCount}회` : '—'}
      </span>

      <span className="text-[10px] text-text-muted">
        {formatRelativeTime(task.processedAt)}
      </span>
    </div>
  )
}
