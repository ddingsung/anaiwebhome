'use client'

import { useState } from 'react'
import { CheckCircle2, Plus, X } from 'lucide-react'
import { useLabelingStore } from '@aa/store/labelingStore'
import { useLabelStore } from '@aa/store/labelStore'
import { AnnotationListPanel } from '@aa/components/labeling/AnnotationListPanel'
import { cn } from '@aa/lib/utils'

const PRESET_COLORS = ['#ef4444','#f97316','#eab308','#22c55e','#3b82f6','#8b5cf6','#ec4899','#6b7280']

export function LabelPanel() {
  const { images, selectedImageId, selectedAnnotationId, submitImage } = useLabelingStore()
  const { labels, addLabel } = useLabelStore()
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(PRESET_COLORS[0])

  const selectedImage = images.find(i => i.id === selectedImageId) ?? null
  const annotations = selectedImage?.annotations ?? []

  const handleAddLabel = () => {
    if (!newName.trim()) return
    addLabel(newName.trim(), newColor)
    setNewName('')
    setNewColor(PRESET_COLORS[0])
    setAdding(false)
  }

  if (!selectedImage) {
    return (
      <div className="flex h-full w-64 flex-shrink-0 items-center justify-center border-l border-border-default bg-bg-panel text-[12px] text-text-muted">
        이미지를 선택하세요
      </div>
    )
  }

  return (
    <div className="flex h-full w-64 flex-shrink-0 flex-col border-l border-border-default bg-bg-panel">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border-default px-3 py-2">
        <p className="text-[10px] font-medium uppercase tracking-wide text-text-muted">
          객체 목록 ({annotations.length})
        </p>
      </div>

      {/* Annotation list */}
      <div className="flex-1 overflow-y-auto">
        <AnnotationListPanel
          imageId={selectedImage.id}
          annotations={annotations}
          selectedAnnotationId={selectedAnnotationId}
        />
      </div>

      {/* Label management */}
      <div className="flex-shrink-0 border-t border-border-default p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[10px] font-medium uppercase tracking-wide text-text-muted">
            라벨 ({labels.length})
          </p>
          <button
            onClick={() => setAdding(a => !a)}
            className="flex items-center gap-0.5 text-[10px] text-text-muted hover:text-text-secondary"
          >
            {adding ? <X size={10} /> : <Plus size={10} />}
            {adding ? '취소' : '추가'}
          </button>
        </div>

        {adding && (
          <div className="mb-2 flex flex-col gap-1.5">
            <input
              type="text"
              placeholder="라벨 이름"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddLabel()}
              autoFocus
              className="w-full rounded border border-border-muted bg-bg-surface px-2 py-1 text-[11px] text-text-primary placeholder:text-text-muted focus:border-accent-domain focus:outline-none"
            />
            <div className="flex items-center gap-1.5">
              <div className="flex gap-1">
                {PRESET_COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setNewColor(c)}
                    className="h-4 w-4 rounded-full transition-transform hover:scale-110"
                    style={{ background: c, outline: newColor === c ? `2px solid ${c}` : 'none', outlineOffset: '1px' }}
                  />
                ))}
              </div>
              <input
                type="color"
                value={newColor}
                onChange={e => setNewColor(e.target.value)}
                className="h-4 w-4 cursor-pointer rounded border-0 bg-transparent p-0"
                title="직접 선택"
              />
            </div>
            <button
              onClick={handleAddLabel}
              disabled={!newName.trim()}
              className="w-full rounded bg-accent-domain px-2 py-1 text-[11px] text-white disabled:opacity-40"
            >
              추가
            </button>
          </div>
        )}
      </div>

      {/* Submit button */}
      <div className="flex-shrink-0 border-t border-border-default p-3">
        <button
          onClick={() => submitImage(selectedImage.id)}
          disabled={annotations.length === 0 || selectedImage.status === 'labeled'}
          className={cn(
            'flex w-full items-center justify-center gap-1.5 rounded px-3 py-2 text-[12px] font-medium transition-colors',
            selectedImage.status === 'labeled'
              ? 'bg-status-approved/20 text-status-approved cursor-default'
              : 'bg-accent-domain text-white hover:bg-accent-domain/90 disabled:opacity-40 disabled:cursor-not-allowed'
          )}
        >
          {selectedImage.status === 'labeled' ? (
            <><CheckCircle2 size={13} /> 완료됨</>
          ) : (
            '라벨링 완료'
          )}
        </button>
      </div>
    </div>
  )
}
