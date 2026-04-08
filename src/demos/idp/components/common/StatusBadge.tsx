import type { DocumentStatus } from '@idp/lib/types'

const STATUS_CONFIG: Record<DocumentStatus, { label: string; className: string }> = {
  pending: {
    label: '추출 대기',
    className: 'bg-gray-50 text-gray-500 border-gray-200',
  },
  processing: {
    label: '처리 중',
    className: 'bg-gray-100 text-gray-600 border-gray-200',
  },
  review_needed: {
    label: '검수 필요',
    className: 'bg-warning-light text-warning border-amber-200',
  },
  review_done: {
    label: '검수 완료',
    className: 'bg-accent-light text-accent border-indigo-200',
  },
  submitted: {
    label: '전송 완료',
    className: 'bg-success-light text-success border-green-200',
  },
  failed: {
    label: '실패',
    className: 'bg-error-light text-error border-red-200',
  },
}

export function StatusBadge({ status }: { status: DocumentStatus }) {
  const { label, className } = STATUS_CONFIG[status]
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium border rounded-badge ${className}`}
    >
      {label}
    </span>
  )
}
