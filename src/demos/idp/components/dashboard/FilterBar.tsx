'use client'

import { Search } from 'lucide-react'
import type { DocumentStatus, DocumentType } from '@idp/lib/types'

const TYPES: Array<DocumentType | '전체'> = ['전체', '세금계산서', '발주서', '납품서', '거래명세서']
const STATUSES: Array<DocumentStatus | '전체'> = ['전체', 'pending', 'review_needed', 'review_done', 'submitted', 'processing', 'failed']
const STATUS_LABELS: Record<DocumentStatus, string> = {
  pending: '추출 대기',
  review_needed: '검수 필요',
  review_done: '검수 완료',
  submitted: '전송 완료',
  processing: '처리 중',
  failed: '실패',
}

interface FilterBarProps {
  typeFilter: DocumentType | '전체'
  statusFilter: DocumentStatus | '전체'
  search: string
  onTypeChange: (v: DocumentType | '전체') => void
  onStatusChange: (v: DocumentStatus | '전체') => void
  onSearchChange: (v: string) => void
}

export function FilterBar({
  typeFilter, statusFilter, search,
  onTypeChange, onStatusChange, onSearchChange,
}: FilterBarProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
        <input
          type="text"
          placeholder="문서명 검색..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9 pl-8 pr-3 text-sm border border-border rounded-button bg-bg-surface text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent w-52"
        />
      </div>
      <select
        value={typeFilter}
        onChange={(e) => onTypeChange(e.target.value as DocumentType | '전체')}
        className="h-9 px-3 text-sm border border-border rounded-button bg-bg-surface text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
      >
        {TYPES.map((t) => <option key={t}>{t}</option>)}
      </select>
      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value as DocumentStatus | '전체')}
        className="h-9 px-3 text-sm border border-border rounded-button bg-bg-surface text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s === '전체' ? '전체 상태' : STATUS_LABELS[s]}
          </option>
        ))}
      </select>
    </div>
  )
}
