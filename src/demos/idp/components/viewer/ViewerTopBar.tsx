import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Document } from '@idp/lib/types'
import { StatusBadge } from '@idp/components/common/StatusBadge'
import { DocumentTypeBadge } from '@idp/components/common/DocumentTypeBadge'

function formatDateTime(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}

interface ViewerTopBarProps {
  doc: Document
  prevId: string | null
  nextId: string | null
}

export function ViewerTopBar({ doc, prevId, nextId }: ViewerTopBarProps) {
  return (
    <div className="sticky top-0 z-30 bg-bg-surface border-b border-border px-6 h-14 flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0">
        <Link
          href="/demo/idp/dashboard"
          className="text-text-tertiary hover:text-text-primary transition-colors flex-shrink-0"
        >
          <ChevronLeft size={20} />
        </Link>
        <span className="font-medium text-text-primary truncate max-w-xs">{doc.name}</span>
        <DocumentTypeBadge type={doc.type} />
        <StatusBadge status={doc.status} />
        <span className="text-xs text-text-tertiary hidden md:block">
          업로드 {formatDateTime(doc.uploadedAt)}
        </span>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        {prevId ? (
          <Link href={`/demo/idp/documents/${prevId}`} className="w-8 h-8 flex items-center justify-center rounded-button transition-colors hover:bg-gray-100 text-text-secondary">
            <ChevronLeft size={16} />
          </Link>
        ) : (
          <span className="w-8 h-8 flex items-center justify-center text-text-tertiary opacity-40 cursor-not-allowed">
            <ChevronLeft size={16} />
          </span>
        )}
        {nextId ? (
          <Link href={`/demo/idp/documents/${nextId}`} className="w-8 h-8 flex items-center justify-center rounded-button transition-colors hover:bg-gray-100 text-text-secondary">
            <ChevronRight size={16} />
          </Link>
        ) : (
          <span className="w-8 h-8 flex items-center justify-center text-text-tertiary opacity-40 cursor-not-allowed">
            <ChevronRight size={16} />
          </span>
        )}
      </div>
    </div>
  )
}
