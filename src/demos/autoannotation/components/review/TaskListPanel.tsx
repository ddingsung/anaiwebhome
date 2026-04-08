import Link from 'next/link'
import { cn } from '@aa/lib/utils'
import { StatusBadge } from '@aa/components/worklist/StatusBadge'
import { ConfidenceBadge } from '@aa/components/worklist/ConfidenceBadge'
import type { Task } from '@aa/lib/types/task'

interface TaskListPanelProps {
  tasks: Task[]
  currentTaskId: string
}

export function TaskListPanel({ tasks, currentTaskId }: TaskListPanelProps) {
  const currentIndex = tasks.findIndex(t => t.id === currentTaskId)
  const pendingCount = tasks.filter(t => t.status === 'pending' || t.status === 'ai_done').length
  const revisionCount = tasks.filter(t => t.status === 'revision').length

  return (
    <div className="flex h-full w-[280px] flex-shrink-0 flex-col border-r border-border-default bg-bg-panel">
      <div className="flex-shrink-0 border-b border-border-default px-3 py-2.5 space-y-1">
        <p className="text-[12px] font-semibold text-text-primary">
          검토 대기열
        </p>
        <div className="flex items-center gap-3 text-[11px] text-text-muted">
          <span>
            <span className="text-text-secondary font-medium">{currentIndex + 1}</span>
            <span> / {tasks.length}</span>
          </span>
          {pendingCount > 0 && (
            <span className="rounded bg-bg-surface px-1.5 py-0.5 text-[10px]">
              대기 {pendingCount}
            </span>
          )}
          {revisionCount > 0 && (
            <span className="rounded bg-status-revision/10 px-1.5 py-0.5 text-[10px] text-status-revision">
              수정 {revisionCount}
            </span>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {tasks.map((task, idx) => (
          <Link
            key={task.id}
            href={`/review/${task.id}`}
            className={cn(
              'flex items-center gap-2 border-b border-border-muted p-2 transition-colors',
              task.id === currentTaskId
                ? 'bg-accent-domain-muted'
                : 'hover:bg-bg-surface'
            )}
          >
            <span className="w-4 flex-shrink-0 text-center text-[10px] text-text-muted">
              {idx + 1}
            </span>
            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded bg-bg-surface">
              <img
                src={task.thumbnailUrl}
                alt={task.filename}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] text-text-primary">{task.filename}</p>
              <div className="mt-0.5 flex items-center gap-1.5">
                <StatusBadge status={task.status} />
                <ConfidenceBadge value={task.confidence} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
