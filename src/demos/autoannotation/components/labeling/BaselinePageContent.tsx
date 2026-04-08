'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { MousePointer2, Square, Pentagon, Maximize, Sparkles, HelpCircle } from 'lucide-react'
import { useLabelingStore } from '@aa/store/labelingStore'
import { LABELING_POOL, ROBOFLOW_ANNOTATIONS } from '@aa/lib/mock/roboflow'
import { LabelingCanvas } from '@aa/components/labeling/LabelingCanvas'
import { ImageListPanel } from '@aa/components/labeling/ImageListPanel'
import { LabelPanel } from '@aa/components/labeling/LabelPanel'
import { LabelingGuideModal } from '@aa/components/labeling/LabelingGuideModal'
import { cn } from '@aa/lib/utils'

const TOOLS = [
  { key: 'select'  as const, icon: MousePointer2, label: '선택' },
  { key: 'bbox'    as const, icon: Square,        label: '바운딩박스' },
  { key: 'polygon' as const, icon: Pentagon,      label: '폴리곤' },
]

export default function BaselinePageContent() {
  const { images, activeTool, setActiveTool, addMockImages, fillAnnotations } = useLabelingStore()
  const fitFnRef = useRef<(() => void) | null>(null)
  const mockAddedRef = useRef(false)
  const [showGuide, setShowGuide] = useState(false)

  useEffect(() => {
    if (mockAddedRef.current) return
    mockAddedRef.current = true
    addMockImages(LABELING_POOL)
    if (!localStorage.getItem('labeling-guide-seen')) {
      setShowGuide(true)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleFitRequest = useCallback((fn: () => void) => {
    fitFnRef.current = fn
  }, [])

  const handleAutoFill = () => {
    const mockedImages = images.filter(i => i.isMocked)
    mockedImages.forEach((img, idx) => {
      const pool = LABELING_POOL[idx]
      if (!pool) return
      const ann = ROBOFLOW_ANNOTATIONS[pool.taskId]
      if (!ann) return
      fillAnnotations(img.id, ann.annotations.map(a => ({ ...a, confidence: 100 })))
    })
  }

  const allLabeled = images.length > 0 && images.filter(i => i.isMocked).every(i => i.status === 'labeled')

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="flex h-10 flex-shrink-0 items-center gap-1 border-b border-border-default bg-bg-panel px-3">
        <span className="mr-2 text-[11px] text-text-muted">도구</span>
        {TOOLS.map(tool => (
          <button
            key={tool.key}
            onClick={() => setActiveTool(tool.key)}
            title={tool.label}
            className={cn(
              'flex h-7 items-center gap-1.5 rounded px-2.5 text-[11px] transition-colors',
              activeTool === tool.key
                ? 'bg-accent-domain-muted text-accent-domain-text'
                : 'text-text-muted hover:bg-bg-surface hover:text-text-secondary'
            )}
          >
            <tool.icon size={13} />
            {tool.label}
          </button>
        ))}
        <div className="mx-3 h-4 w-px bg-border-default" />
        <button
          onClick={() => fitFnRef.current?.()}
          title="화면 맞춤"
          className="flex h-7 items-center gap-1.5 rounded px-2.5 text-[11px] text-text-muted transition-colors hover:bg-bg-surface hover:text-text-secondary"
        >
          <Maximize size={13} />
          화면 맞춤
        </button>
        <div className="mx-3 h-4 w-px bg-border-default" />
        <button
          onClick={handleAutoFill}
          disabled={allLabeled}
          className={cn(
            'flex h-7 items-center gap-1.5 rounded px-2.5 text-[11px] transition-colors',
            allLabeled
              ? 'text-text-muted opacity-40 cursor-not-allowed'
              : 'text-accent-domain-text hover:bg-accent-domain-muted'
          )}
        >
          <Sparkles size={13} />
          데모 라벨 자동 채우기
        </button>
        <button
          onClick={() => setShowGuide(true)}
          title="사용 가이드"
          className="flex h-7 items-center gap-1.5 rounded px-2.5 text-[11px] text-text-muted transition-colors hover:bg-bg-surface hover:text-text-secondary"
        >
          <HelpCircle size={13} />
          가이드
        </button>
        <div className="ml-auto flex items-center gap-3 text-[11px] text-text-muted">
          <span>bbox · 폴리곤 공통 라벨 체계 사용</span>
          <span className="text-border-strong">|</span>
          <span>스크롤: 줌 · 드래그: 이동</span>
        </div>
      </div>

      {showGuide && (
        <LabelingGuideModal onClose={() => {
          localStorage.setItem('labeling-guide-seen', '1')
          setShowGuide(false)
        }} />
      )}

      {/* Main 3-panel */}
      <div className="flex flex-1 overflow-hidden">
        <ImageListPanel />
        <div className="flex-1 overflow-hidden">
          <LabelingCanvas onFitRequest={handleFitRequest} />
        </div>
        <LabelPanel />
      </div>
    </div>
  )
}
