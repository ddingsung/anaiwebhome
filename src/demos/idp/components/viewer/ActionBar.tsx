'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface ActionBarProps {
  docId: string
  status: string
  reviewNeededCount?: number
  onHold?: () => void
  onApprove?: () => void
  onReprocess?: () => void
}

export function ActionBar({ docId, status, reviewNeededCount = 0, onHold, onApprove, onReprocess }: ActionBarProps) {
  const router = useRouter()
  const [approved, setApproved] = useState(false)
  const approveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleApprove = () => {
    onApprove?.()
    setApproved(true)
    if (approveTimer.current) clearTimeout(approveTimer.current)
    approveTimer.current = setTimeout(() => setApproved(false), 2000)
  }

  const isReviewNeeded = status === 'review_needed'
  const isReviewDone = status === 'review_done'
  const isSubmitted = status === 'submitted'
  const isFailed = status === 'failed'
  const hasReviewNeeded = reviewNeededCount > 0

  return (
    <div className="sticky bottom-0 z-30 bg-bg-surface border-t border-border px-6 h-14 flex items-center justify-end gap-3">
      {(isReviewNeeded || isReviewDone) && (
        <>
          {isReviewDone && (
            <button
              onClick={onHold}
              className="h-10 px-4 text-sm text-text-secondary border border-border rounded-button hover:bg-gray-50 transition-colors"
            >
              보류
            </button>
          )}
          <button
            onClick={onReprocess}
            className="h-10 px-4 text-sm text-text-secondary border border-border rounded-button hover:bg-gray-50 transition-colors"
          >
            재처리
          </button>
          {isReviewNeeded && (
            <button
              onClick={handleApprove}
              disabled={hasReviewNeeded}
              title={hasReviewNeeded ? `검수 필요 항목 ${reviewNeededCount}건을 먼저 확인하세요` : undefined}
              className="h-10 px-4 text-sm rounded-button transition-colors border border-border disabled:opacity-40 disabled:cursor-not-allowed text-text-primary hover:bg-gray-50 disabled:hover:bg-transparent"
            >
              {approved ? '✓ 검수 완료됨' : `검수 완료${hasReviewNeeded ? ` (${reviewNeededCount})` : ''}`}
            </button>
          )}
          <button
            onClick={() => router.push(`/demo/idp/documents/${docId}/submit`)}
            className="h-10 px-5 text-sm text-white bg-accent rounded-button hover:opacity-90 transition-opacity font-medium"
          >
            사내 시스템으로 기입 →
          </button>
        </>
      )}
      {isSubmitted && (
        <span className="text-sm text-success font-medium">✓ 시스템 반영 완료</span>
      )}
      {isFailed && (
        <button
          onClick={onReprocess}
          className="h-10 px-4 text-sm text-error border border-error rounded-button hover:bg-error-light transition-colors"
        >
          재처리 요청
        </button>
      )}
    </div>
  )
}
