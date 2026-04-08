import type { DocumentType } from '@idp/lib/types'

const TYPE_COLORS: Record<DocumentType, string> = {
  '세금계산서': 'bg-purple-50 text-purple-700 border-purple-200',
  '발주서':    'bg-blue-50 text-blue-700 border-blue-200',
  '납품서':    'bg-teal-50 text-teal-700 border-teal-200',
  '거래명세서': 'bg-orange-50 text-orange-700 border-orange-200',
}

export function DocumentTypeBadge({ type }: { type: DocumentType }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium border rounded-badge ${TYPE_COLORS[type]}`}
    >
      {type}
    </span>
  )
}
