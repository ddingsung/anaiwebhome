'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Trash2 } from 'lucide-react'
import { useLabelingStore } from '@aa/store/labelingStore'
import { useLabelStore } from '@aa/store/labelStore'
import { getLabelColor } from '@aa/lib/mock/labels'
import { cn } from '@aa/lib/utils'
import type { Annotation } from '@aa/lib/types/annotation'

interface GroupProps {
  title: string
  annotations: Annotation[]
  imageId: string
  selectedAnnotationId: string | null
}

function AnnotationGroup({ title, annotations, imageId, selectedAnnotationId }: GroupProps) {
  const [collapsed, setCollapsed] = useState(false)
  const { selectAnnotation, removeAnnotation, updateAnnotationLabel } = useLabelingStore()
  const { labels } = useLabelStore()

  if (annotations.length === 0) return null

  return (
    <div>
      <button
        onClick={() => setCollapsed(c => !c)}
        className="flex w-full items-center gap-1.5 border-b border-border-muted px-3 py-1.5 text-[10px] font-medium uppercase tracking-wide text-text-muted hover:bg-bg-surface"
      >
        {collapsed
          ? <ChevronRight size={10} />
          : <ChevronDown size={10} />
        }
        {title} ({annotations.length})
      </button>
      {!collapsed && annotations.map(ann => {
        const color = getLabelColor(ann.label)
        const label = labels.find(l => l.id === ann.label)
        const isSelected = selectedAnnotationId === ann.id
        return (
          <div
            key={ann.id}
            onClick={() => selectAnnotation(ann.id)}
            className={cn(
              'group flex cursor-pointer items-center gap-2 border-b border-border-muted px-3 py-2 transition-colors',
              isSelected ? 'bg-accent-domain-muted' : 'hover:bg-bg-surface'
            )}
          >
            <span
              className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
              style={{ background: color }}
            />
            <div className="min-w-0 flex-1">
              {isSelected && updateAnnotationLabel ? (
                <select
                  value={ann.label}
                  onChange={e => { e.stopPropagation(); updateAnnotationLabel(imageId, ann.id, e.target.value) }}
                  onClick={e => e.stopPropagation()}
                  className="w-full rounded border border-border-strong bg-bg-surface px-1 py-0.5 text-[11px] text-text-primary focus:border-accent-domain focus:outline-none"
                >
                  {labels.map(l => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              ) : (
                <p className="truncate text-[11px] text-text-primary">
                  {label?.name ?? ann.label}
                </p>
              )}
              <p className="text-[10px] text-text-muted">
                {ann.type === 'bbox' ? '바운딩박스' : '폴리곤'}
              </p>
            </div>
            <button
              onClick={e => { e.stopPropagation(); removeAnnotation(imageId, ann.id) }}
              className="invisible flex-shrink-0 text-text-muted transition-colors hover:text-status-rejected group-hover:visible"
              aria-label="삭제"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )
      })}
    </div>
  )
}

interface Props {
  imageId: string
  annotations: Annotation[]
  selectedAnnotationId: string | null
}

export function AnnotationListPanel({ imageId, annotations, selectedAnnotationId }: Props) {
  const [search, setSearch] = useState('')

  const filtered = search
    ? annotations.filter(a => a.label.toLowerCase().includes(search.toLowerCase()))
    : annotations

  const bboxAnnotations = filtered.filter(a => a.type === 'bbox')
  const polygonAnnotations = filtered.filter(a => a.type === 'polygon')

  return (
    <div className="flex flex-col">
      <div className="border-b border-border-default px-3 py-2">
        <input
          type="text"
          placeholder="라벨 검색..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full rounded border border-border-muted bg-bg-surface px-2 py-1 text-[11px] text-text-primary placeholder:text-text-muted focus:border-accent-domain focus:outline-none"
        />
      </div>

      {annotations.length === 0 ? (
        <div className="flex h-24 items-center justify-center p-4 text-center text-[11px] text-text-muted">
          캔버스에서 바운딩박스 또는<br />폴리곤을 그려 객체를 추가하세요
        </div>
      ) : (
        <>
          <AnnotationGroup
            title="BBox"
            annotations={bboxAnnotations}
            imageId={imageId}
            selectedAnnotationId={selectedAnnotationId}
          />
          <AnnotationGroup
            title="Polygon"
            annotations={polygonAnnotations}
            imageId={imageId}
            selectedAnnotationId={selectedAnnotationId}
          />
          {search && filtered.length === 0 && (
            <div className="py-4 text-center text-[11px] text-text-muted">
              검색 결과 없음
            </div>
          )}
        </>
      )}
    </div>
  )
}
