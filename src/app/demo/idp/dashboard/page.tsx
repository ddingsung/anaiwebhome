'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { KpiCard } from '@idp/components/dashboard/KpiCard'
import { UploadZone } from '@idp/components/dashboard/UploadZone'
import { DocumentTable } from '@idp/components/dashboard/DocumentTable'
import { getAllDocuments, addUploadedDoc, mockFieldsFor } from '@idp/lib/mock-data'
import type { Document } from '@idp/lib/types'

function getKpis(docs: Document[]) {
  const total = docs.filter((d) => !['pending', 'processing', 'failed'].includes(d.status)).length
  const reviewNeeded = docs.filter((d) => d.status === 'review_needed').length
  const submitted = docs.filter((d) => d.status === 'submitted').length
  return { total, reviewNeeded, submitted }
}

function generateUploadId() {
  return `upload-${Date.now().toString(36)}`
}

type DocType = '세금계산서' | '발주서' | '납품서' | '거래명세서'

function randomDocType(): DocType {
  const types: DocType[] = ['세금계산서', '발주서', '납품서', '거래명세서']
  return types[Math.floor(Math.random() * types.length)]
}

export default function DashboardPage() {
  const [documents, setDocuments] = useState<Document[]>(() => getAllDocuments())
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [uploadingName, setUploadingName] = useState<string | null>(null)
  const [uploadDone, setUploadDone] = useState(false)
  const [highlightedId, setHighlightedId] = useState<string | null>(null)
  const rafRef = useRef<number | null>(null)
  const isUploadingRef = useRef(false)

  useEffect(() => {
    setDocuments(getAllDocuments())
  }, [])

  const handleUploadStart = useCallback((fileName: string, typeHint?: string) => {
    if (isUploadingRef.current) return
    isUploadingRef.current = true

    const id = generateUploadId()
    const type = (typeHint as DocType) ?? randomDocType()
    const newDoc: Document = {
      id,
      name: fileName,
      type,
      status: 'pending',
      uploadedAt: new Date().toISOString(),
      fields: mockFieldsFor(type),
    }

    addUploadedDoc(newDoc)

    const duration = typeHint ? 800 : 1500
    setUploadingName(fileName)
    setUploadProgress(0)

    const startTime = Date.now()
    const tick = () => {
      const progress = Math.min(((Date.now() - startTime) / duration) * 100, 100)
      setUploadProgress(progress)
      if (progress < 100) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }
    rafRef.current = requestAnimationFrame(tick)

    setTimeout(() => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      setUploadProgress(null)
      setUploadingName(null)
      setUploadDone(true)
      setDocuments((prev) => [newDoc, ...prev])
      setHighlightedId(id)
      setTimeout(() => {
        setUploadDone(false)
        setHighlightedId(null)
        isUploadingRef.current = false
      }, 1200)
    }, duration)
  }, [])

  const { total, reviewNeeded, submitted } = getKpis(documents)

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h1 className="text-2xl font-bold text-text-primary mb-6">문서 처리 현황</h1>

      <div className="mb-6">
        <UploadZone
          onUploadStart={handleUploadStart}
          uploadProgress={uploadProgress}
          uploadingName={uploadingName}
          uploadDone={uploadDone}
        />
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <KpiCard label="오늘 처리 문서" value={total} sub="건" />
        <KpiCard label="절약된 입력 시간" value="47분" sub="수동 입력 대비 추정" />
        <KpiCard label="검수 필요" value={reviewNeeded} sub="건" accent />
        <KpiCard label="시스템 반영 완료" value={submitted} sub="건" />
      </div>

      <DocumentTable documents={documents} highlightedId={highlightedId} />
    </div>
  )
}
