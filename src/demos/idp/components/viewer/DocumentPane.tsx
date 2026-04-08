'use client'

import { useState } from 'react'
import { ZoomIn, ZoomOut } from 'lucide-react'
import type { Document, Field } from '@idp/lib/types'
import { MockDocument } from './MockDocument'

function FieldOverlay({ field, highlighted }: { field: Field; highlighted: boolean }) {
  if (!field.boundingBox) return null
  const { x, y, width, height } = field.boundingBox
  const colorClass =
    field.status === 'review_needed'
      ? 'border-amber-400 bg-amber-100/30'
      : field.status === 'edited'
      ? 'border-green-500 bg-green-100/30'
      : 'border-indigo-300 bg-indigo-100/20'

  return (
    <div
      className={`absolute border-2 rounded-sm pointer-events-none transition-all ${colorClass} ${highlighted ? 'ring-2 ring-offset-1 ring-amber-400 scale-105 z-10' : ''}`}
      style={{
        left: `${x * 100}%`,
        top: `${y * 100}%`,
        width: `${width * 100}%`,
        height: `${height * 100}%`,
      }}
    />
  )
}

const DOC_W = 560
const DOC_H = Math.round(DOC_W * 1.414) // A4 비율 ~792px

interface DocumentPaneProps {
  doc: Document
  highlightedField?: string | null
  isExtracting?: boolean
}

export function DocumentPane({ doc, highlightedField, isExtracting }: DocumentPaneProps) {
  const [zoom, setZoom] = useState(1)

  return (
    <div className="flex flex-col h-full">
      {/* Zoom controls */}
      <div className="flex items-center justify-end gap-2 px-4 py-2 border-b border-border bg-bg-surface">
        <button
          onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-text-secondary"
        >
          <ZoomOut size={14} />
        </button>
        <span className="text-xs text-text-secondary font-numeric w-10 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-text-secondary"
        >
          <ZoomIn size={14} />
        </button>
      </div>

      {/* Document */}
      <div className="flex-1 overflow-auto bg-gray-200 p-6">
        {doc.status === 'processing' && !isExtracting ? (
          <div className="mx-auto bg-white rounded border border-gray-200 shadow-card p-8 space-y-4" style={{ width: '560px' }}>
            <div className="animate-pulse space-y-3">
              <div className="h-5 bg-gray-200 rounded w-1/3 mx-auto" />
              <div className="h-px bg-gray-200" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
              <div className="h-px bg-gray-200" />
              {[1,2,3,4].map((i) => (
                <div key={i} className="grid grid-cols-4 gap-2">
                  <div className="h-3 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded col-span-2" />
                  <div className="h-3 bg-gray-200 rounded" />
                </div>
              ))}
              <div className="h-px bg-gray-200" />
              <div className="flex justify-center pt-2">
                <div className="text-xs text-text-tertiary animate-pulse">AI가 문서를 분석하는 중...</div>
              </div>
            </div>
          </div>
        ) : doc.status === 'failed' ? (
          <div className="mx-auto bg-white rounded border border-gray-200 shadow-card p-8 flex flex-col items-center justify-center gap-3" style={{ width: '560px', minHeight: '200px' }}>
            <div className="text-3xl">⚠️</div>
            <div className="text-sm font-medium text-error">문서 파싱 실패</div>
            <p className="text-xs text-text-tertiary text-center">파일이 손상되었거나 지원하지 않는 형식입니다.<br />원본 문서를 미리보기할 수 없습니다.</p>
          </div>
        ) : (
          <div
            className="mx-auto"
            style={{ width: `${zoom * DOC_W}px`, height: `${zoom * DOC_H}px` }}
          >
            <div
              className="relative origin-top-left"
              style={{ width: `${DOC_W}px`, transform: `scale(${zoom})` }}
            >
              <MockDocument type={doc.type} fields={doc.fields} />
              {/* Overlays */}
              <div className="absolute inset-0 pointer-events-none">
                {doc.fields.map((field) => (
                  <FieldOverlay key={field.key} field={field} highlighted={field.key === highlightedField} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
