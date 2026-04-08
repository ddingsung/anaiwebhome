'use client'

import { useState, useRef } from 'react'
import { Upload, FileText } from 'lucide-react'

const SAMPLE_FILES = [
  '세금계산서 샘플',
  '발주서 샘플',
  '납품서 샘플',
  '거래명세서 샘플',
]

interface UploadZoneProps {
  onUploadStart?: (fileName: string, typeHint?: string) => void
  uploadProgress?: number | null
  uploadingName?: string | null
  uploadDone?: boolean
}

const SAMPLE_TYPE_MAP: Record<string, string> = {
  '세금계산서 샘플': '세금계산서',
  '발주서 샘플': '발주서',
  '납품서 샘플': '납품서',
  '거래명세서 샘플': '거래명세서',
}

export function UploadZone({ onUploadStart, uploadProgress, uploadingName, uploadDone }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [showDemoNotice, setShowDemoNotice] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dragCounter = useRef(0)
  const sampleCountRef = useRef<Record<string, number>>({})
  const demoNoticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    dragCounter.current++
    setIsDragging(true)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDragLeave = () => {
    dragCounter.current--
    if (dragCounter.current === 0) setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    dragCounter.current = 0
    setIsDragging(false)
    showNotice()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = ''
    showNotice()
  }

  const showNotice = () => {
    setShowDemoNotice(true)
    if (demoNoticeTimer.current) clearTimeout(demoNoticeTimer.current)
    demoNoticeTimer.current = setTimeout(() => setShowDemoNotice(false), 2500)
  }

  if (uploadDone) {
    return (
      <div className="border-2 border-dashed border-success bg-success-light rounded-card p-8 text-center">
        <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-white text-lg">✓</span>
        </div>
        <p className="text-sm font-medium text-success">업로드 완료</p>
      </div>
    )
  }

  if (uploadProgress != null) {
    return (
      <div className="relative border-2 border-dashed border-accent bg-accent-light rounded-card p-8 text-center">
        <Upload className="mx-auto mb-3 text-accent" size={28} />
        <p className="text-sm font-medium text-text-primary mb-1">
          {uploadingName ? `"${uploadingName}" 업로드 중...` : '업로드 중...'}
        </p>
        <div className="mx-auto mt-3 w-48 h-1.5 bg-indigo-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-100"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
        <p className="text-xs text-accent mt-2">{Math.round(uploadProgress)}%</p>
      </div>
    )
  }

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`relative border-2 border-dashed rounded-card p-8 text-center cursor-pointer transition-colors ${
        isDragging
          ? 'border-accent bg-accent-light'
          : showDemoNotice
          ? 'border-amber-300 bg-amber-50'
          : 'border-border hover:border-accent hover:bg-accent-light/30'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.tiff"
        className="hidden"
        onChange={handleChange}
      />
      <Upload className={`mx-auto mb-3 ${showDemoNotice ? 'text-amber-400' : 'text-text-tertiary'}`} size={28} />
      {showDemoNotice ? (
        <>
          <p className="text-sm font-medium text-amber-600 mb-1">데모 모드에서는 파일 업로드가 제한됩니다</p>
          <p className="text-xs text-amber-500 mb-4">아래 샘플 버튼을 사용해주세요</p>
        </>
      ) : (
        <>
          <p className="text-sm font-medium text-text-primary mb-1">
            파일을 드래그하거나 클릭해서 업로드
          </p>
          <p className="text-xs text-text-tertiary mb-4">
            PDF, JPG, PNG, TIFF 지원 · 최대 20MB
          </p>
        </>
      )}
      <div className="flex flex-wrap justify-center gap-2" onClick={(e) => e.stopPropagation()}>
        {SAMPLE_FILES.map((name) => (
          <button
            key={name}
            onClick={() => {
              const count = (sampleCountRef.current[name] ?? 0) + 1
              sampleCountRef.current[name] = count
              const fileName = count === 1 ? `${name}.pdf` : `${name} #${count}.pdf`
              onUploadStart?.(fileName, SAMPLE_TYPE_MAP[name])
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-surface border border-border rounded-button text-xs text-text-secondary hover:border-accent hover:text-accent transition-colors"
          >
            <FileText size={12} />
            {name}
          </button>
        ))}
      </div>
    </div>
  )
}
