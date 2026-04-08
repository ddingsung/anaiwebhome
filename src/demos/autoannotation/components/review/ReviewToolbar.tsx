'use client'

import { ZoomIn, ZoomOut, Maximize, Eye, EyeOff, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { StatusBadge } from '@aa/components/worklist/StatusBadge'
import { ConfidenceBadge } from '@aa/components/worklist/ConfidenceBadge'
import { useReviewStore } from '@aa/store/reviewStore'
import type { Task } from '@aa/lib/types/task'

interface ReviewToolbarProps {
  task: Task
  nextTaskId?: string
  onApprove: () => void
  onApproveWithEdit: () => void
  onSendToRevision: () => void
}

export function ReviewToolbar({ task, nextTaskId, onApprove, onApproveWithEdit, onSendToRevision }: ReviewToolbarProps) {
  const { zoomIn, zoomOut, resetZoom, showOverlay, toggleOverlay, openRejectionForm, hasModifiedAnnotations } = useReviewStore()

  return (
    <div className="flex h-11 flex-shrink-0 items-center justify-between border-b border-border-default bg-bg-panel px-3">
      <div className="flex items-center gap-3">
        <span className="max-w-[200px] truncate text-[12px] font-medium text-text-primary">
          {task.filename}
        </span>
        <StatusBadge status={task.status} />
        <ConfidenceBadge value={task.confidence} />
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={zoomOut}
          title="축소"
          className="flex h-7 w-7 items-center justify-center rounded text-text-muted transition-colors hover:bg-bg-surface hover:text-text-secondary"
        >
          <ZoomOut size={14} />
        </button>
        <button
          onClick={resetZoom}
          title="화면 맞춤"
          className="flex h-7 w-7 items-center justify-center rounded text-text-muted transition-colors hover:bg-bg-surface hover:text-text-secondary"
        >
          <Maximize size={14} />
        </button>
        <button
          onClick={zoomIn}
          title="확대"
          className="flex h-7 w-7 items-center justify-center rounded text-text-muted transition-colors hover:bg-bg-surface hover:text-text-secondary"
        >
          <ZoomIn size={14} />
        </button>
        <div className="mx-1 h-4 w-px bg-border-strong" />
        <button
          onClick={toggleOverlay}
          title={showOverlay ? '오버레이 숨기기' : '오버레이 표시'}
          className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${
            showOverlay
              ? 'bg-accent-domain-muted text-accent-domain-text'
              : 'text-text-muted hover:bg-bg-surface hover:text-text-secondary'
          }`}
        >
          {showOverlay ? <Eye size={14} /> : <EyeOff size={14} />}
        </button>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={onApprove}
          className="rounded bg-status-approved/20 px-3 py-1.5 text-[11px] font-medium text-status-approved transition-colors hover:bg-status-approved/30"
        >
          승인
        </button>
        <button
          onClick={onApproveWithEdit}
          disabled={!hasModifiedAnnotations}
          title={hasModifiedAnnotations ? undefined : '라벨을 수정하면 활성화됩니다'}
          className={`rounded border px-3 py-1.5 text-[11px] font-medium transition-colors ${
            hasModifiedAnnotations
              ? 'border-accent-domain text-accent-domain-text hover:bg-accent-domain-muted'
              : 'border-border-strong text-text-muted cursor-not-allowed opacity-50'
          }`}
        >
          수정 후 승인
        </button>
        <button
          onClick={onSendToRevision}
          className="rounded border border-status-revision/40 px-3 py-1.5 text-[11px] font-medium text-status-revision transition-colors hover:bg-status-revision/10"
        >
          수정 요청
        </button>
        <button
          onClick={openRejectionForm}
          className="rounded border border-status-rejected/40 px-3 py-1.5 text-[11px] font-medium text-status-rejected transition-colors hover:bg-[#1a0808]"
        >
          반려
        </button>
        {nextTaskId && (
          <>
            <div className="mx-1 h-4 w-px bg-border-strong" />
            <Link
              href={`/review/${nextTaskId}`}
              className="flex items-center gap-1 rounded border border-border-strong px-2 py-1.5 text-[11px] text-text-muted transition-colors hover:text-text-secondary"
            >
              다음 항목 <ChevronRight size={12} />
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
