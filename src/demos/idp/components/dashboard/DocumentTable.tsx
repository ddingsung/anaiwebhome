'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import type { Document, DocumentStatus, DocumentType } from '@idp/lib/types'
import { StatusBadge } from '@idp/components/common/StatusBadge'
import { DocumentTypeBadge } from '@idp/components/common/DocumentTypeBadge'
import { FilterBar } from './FilterBar'

function formatDate(iso: string) {
  const d = new Date(iso)
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export function DocumentTable({ documents, highlightedId }: { documents: Document[]; highlightedId?: string | null }) {
  const router = useRouter()
  const [typeFilter, setTypeFilter] = useState<DocumentType | '전체'>('전체')
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | '전체'>('전체')
  const [search, setSearch] = useState('')

  const filtered = documents.filter((d) => {
    if (typeFilter !== '전체' && d.type !== typeFilter) return false
    if (statusFilter !== '전체' && d.status !== statusFilter) return false
    if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="bg-bg-surface rounded-card shadow-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h2 className="text-base font-semibold text-text-primary">처리 내역</h2>
        <FilterBar
          typeFilter={typeFilter}
          statusFilter={statusFilter}
          search={search}
          onTypeChange={setTypeFilter}
          onStatusChange={setStatusFilter}
          onSearchChange={setSearch}
        />
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-gray-50">
            {['문서명', '유형', '업로드', '추출 상태', '처리 시간', '담당자'].map((h) => (
              <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-text-tertiary uppercase tracking-wide">
                {h}
              </th>
            ))}
            <th className="px-4 py-2.5 w-8" />
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-10 text-center text-text-tertiary text-sm">
                검색 결과가 없습니다
              </td>
            </tr>
          ) : (
            filtered.map((doc) => (
              <tr
                key={doc.id}
                onClick={() => router.push(`/demo/idp/documents/${doc.id}`)}
                className={`border-b border-border last:border-0 hover:bg-gray-50 cursor-pointer transition-colors h-11 ${
                  doc.id === highlightedId ? 'bg-accent-light ring-1 ring-inset ring-accent/30' : ''
                }`}
              >
                <td className="px-4 py-2 max-w-xs">
                  <span className="truncate block text-text-primary font-medium">{doc.name}</span>
                </td>
                <td className="px-4 py-2">
                  <DocumentTypeBadge type={doc.type} />
                </td>
                <td className="px-4 py-2 text-text-secondary font-numeric whitespace-nowrap">
                  {formatDate(doc.uploadedAt)}
                </td>
                <td className="px-4 py-2">
                  <StatusBadge status={doc.status} />
                </td>
                <td className="px-4 py-2 text-text-secondary font-numeric">
                  {doc.processingTime ?? '—'}
                </td>
                <td className="px-4 py-2 text-text-secondary">
                  {doc.reviewedBy ?? '—'}
                </td>
                <td className="px-4 py-2">
                  <ChevronRight size={14} className="text-text-tertiary" />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
