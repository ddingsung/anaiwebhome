'use client'

import { useRef } from 'react'
import { Upload, CheckCircle2, Circle } from 'lucide-react'
import { useLabelingStore } from '@aa/store/labelingStore'
import { cn } from '@aa/lib/utils'

export function ImageListPanel() {
  const inputRef = useRef<HTMLInputElement>(null)
  const { images, selectedImageId, selectImage, addImages } = useLabelingStore()

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'))
    if (imageFiles.length > 0) addImages(imageFiles)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  const labeled   = images.filter(i => i.status === 'labeled').length
  const unlabeled = images.filter(i => i.status === 'unlabeled').length

  return (
    <div className="flex h-full w-52 flex-shrink-0 flex-col border-r border-border-default bg-bg-panel">
      {/* Upload zone */}
      <div
        className="flex-shrink-0 border-b border-border-default p-2"
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
      >
        <button
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center gap-1.5 rounded border border-dashed border-border-strong px-3 py-3 text-center transition-colors hover:border-accent-domain hover:bg-accent-domain/5"
        >
          <Upload size={16} className="text-text-muted" />
          <span className="text-[11px] text-text-secondary">이미지 업로드</span>
          <span className="text-[10px] text-text-muted">여러 장 선택 가능</span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
        />
      </div>

      {/* Stats */}
      {images.length > 0 && (
        <div className="flex flex-shrink-0 items-center gap-3 border-b border-border-default px-3 py-1.5">
          <span className="text-[10px] text-text-muted">전체 {images.length}</span>
          <span className="text-[10px] text-status-approved">완료 {labeled}</span>
          <span className="text-[10px] text-text-muted">대기 {unlabeled}</span>
        </div>
      )}

      {/* Image list */}
      <div className="flex-1 overflow-y-auto">
        {images.length === 0 ? (
          <div className="flex h-full items-center justify-center p-4 text-center text-[11px] text-text-muted">
            이미지를 업로드하면<br />여기에 목록이 표시됩니다
          </div>
        ) : (
          images.map(img => (
            <button
              key={img.id}
              onClick={() => selectImage(img.id)}
              className={cn(
                'flex w-full items-center gap-2 border-b border-border-muted px-3 py-2 text-left transition-colors',
                selectedImageId === img.id
                  ? 'bg-accent-domain-muted'
                  : 'hover:bg-bg-surface'
              )}
            >
              {/* Thumbnail */}
              <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded bg-[#0d0d0d]">
                <img
                  src={img.url}
                  alt={img.filename}
                  className="h-full w-full object-cover"
                  style={img.isMocked ? { filter: 'blur(3px)' } : undefined}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] text-text-primary">{img.filename}</p>
                <div className="mt-0.5 flex items-center gap-1">
                  {img.status === 'labeled' ? (
                    <>
                      <CheckCircle2 size={10} className="text-status-approved" />
                      <span className="text-[10px] text-status-approved">완료</span>
                    </>
                  ) : (
                    <>
                      <Circle size={10} className="text-text-muted" />
                      <span className="text-[10px] text-text-muted">
                        {img.annotations.length > 0 ? `${img.annotations.length}개 작업 중` : '미완료'}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
