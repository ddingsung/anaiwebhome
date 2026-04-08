import Link from 'next/link'
import { formatRelativeTime } from '@aa/lib/format'
import { StatusBadge } from './StatusBadge'
import { ConfidenceBadge } from './ConfidenceBadge'
import { RevisionReasonTag } from '@aa/components/revisions/RevisionReasonTag'
import { getAnnotationsForTask } from '@aa/lib/mock/annotations'
import { SKIN_LABELS } from '@aa/lib/mock/labels'
import type { Task, RejectionReason } from '@aa/lib/types/task'

interface PreviewPanelProps {
  task: Task | null
  showAction?: boolean
}

export function PreviewPanel({ task, showAction = true }: PreviewPanelProps) {
  if (!task) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-[13px] text-text-muted">
        항목을 선택하면 미리보기가 표시됩니다
      </div>
    )
  }

  const taskAnnotations = getAnnotationsForTask(task.id)
  const annotations = taskAnnotations?.annotations ?? []

  const labelCounts = annotations.reduce<Record<string, number>>((acc, ann) => {
    acc[ann.label] = (acc[ann.label] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border-default px-3 py-2.5">
        <div>
          <p className="text-[12px] font-medium text-text-primary">{task.filename}</p>
          <div className="mt-1 flex items-center gap-2">
            <StatusBadge status={task.status} />
            <ConfidenceBadge value={task.confidence} />
          </div>
        </div>
      </div>

      <div className="relative bg-[#0d0d0d]" style={{ height: '180px' }}>
        <img
          src={task.thumbnailUrl}
          alt={task.filename}
          className="h-full w-full object-contain"
        />
      </div>

      {annotations.length > 0 && (
        <div className="border-b border-border-default px-3 py-2">
          <p className="mb-1.5 text-[10px] uppercase tracking-wide text-text-muted">감지된 병변</p>
          <div className="flex flex-wrap gap-1">
            {Object.entries(labelCounts).map(([labelId, count]) => {
              const labelDef = SKIN_LABELS.find(l => l.id === labelId)
              return (
                <span
                  key={labelId}
                  className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px]"
                  style={{ backgroundColor: `${labelDef?.color ?? '#666'}22`, color: labelDef?.color ?? '#aaa' }}
                >
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: labelDef?.color ?? '#666' }}
                  />
                  {labelDef?.name ?? labelId}
                  {count > 1 && <span className="opacity-60">×{count}</span>}
                </span>
              )
            })}
          </div>
        </div>
      )}

      <div className="flex-1 p-3 space-y-1.5">
        <div className="flex justify-between text-[12px]">
          <span className="text-text-muted">객체 수</span>
          <span className="font-medium text-text-secondary">{task.annotationCount}개</span>
        </div>
        <div className="flex justify-between text-[12px]">
          <span className="text-text-muted">수정 횟수</span>
          <span className="text-text-secondary">{task.revisionCount}회</span>
        </div>
        {task.assignee && (
          <div className="flex justify-between text-[12px]">
            <span className="text-text-muted">담당자</span>
            <span className="text-text-secondary">{task.assignee}</span>
          </div>
        )}
        <div className="flex justify-between text-[12px]">
          <span className="text-text-muted">처리 시각</span>
          <span className="text-text-secondary">{formatRelativeTime(task.processedAt)}</span>
        </div>

        {!showAction && task.rejectionReasons && task.rejectionReasons.length > 0 && (
          <div className="pt-2">
            <p className="mb-1.5 text-[10px] uppercase tracking-wide text-text-muted">반려 사유</p>
            <div className="flex flex-wrap gap-1">
              {task.rejectionReasons.map(r => (
                <RevisionReasonTag key={r} reason={r as RejectionReason} />
              ))}
            </div>
            {task.rejectionNote && (
              <p className="mt-2 text-[11px] text-text-muted leading-relaxed">{task.rejectionNote}</p>
            )}
          </div>
        )}
      </div>

      {showAction && (
        <div className="border-t border-border-default p-3">
          <Link
            href={`/review/${task.id}`}
            className="flex w-full items-center justify-center rounded bg-accent-domain px-3 py-2 text-[12px] font-medium text-white transition-colors hover:bg-blue-600"
          >
            검토 시작
          </Link>
        </div>
      )}
    </div>
  )
}
