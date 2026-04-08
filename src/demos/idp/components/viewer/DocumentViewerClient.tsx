'use client'

import { useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { getDocument, getPrevNextIds, setDocumentStatus, saveDocumentFields } from '@idp/lib/mock-data'
import { ViewerTopBar } from '@idp/components/viewer/ViewerTopBar'
import { DocumentPane } from '@idp/components/viewer/DocumentPane'
import { ExtractionForm } from '@idp/components/viewer/ExtractionForm'
import { ActionBar } from '@idp/components/viewer/ActionBar'
import type { DocumentStatus } from '@idp/lib/types'

export default function DocumentViewerClient() {
  const params = useParams<{ id: string }>()
  const id = params.id

  const originalDoc = getDocument(id)
  const { prev, next } = getPrevNextIds(id)

  const [status, setStatus] = useState<DocumentStatus>(
    originalDoc?.status ?? 'processing'
  )
  const [highlightedField, setHighlightedField] = useState<string>('')
  const [reviewNeededCount, setReviewNeededCount] = useState(
    () => originalDoc?.fields.filter((f) => f.status === 'review_needed').length ?? 0
  )
  const [reprocessCount, setReprocessCount] = useState(0)
  const [isExtracting, setIsExtracting] = useState(false)
  const [animateIn, setAnimateIn] = useState(false)

  const handleExtract = useCallback(() => {
    if (!originalDoc) return
    setIsExtracting(true)
    setAnimateIn(false)
    setStatus('processing')
    setTimeout(() => {
      const fields = originalDoc.fields
      setDocumentStatus(id, 'review_needed')
      setReviewNeededCount(fields.filter((f) => f.status === 'review_needed').length)
      setStatus('review_needed')
      setIsExtracting(false)
      setAnimateIn(true)
      setReprocessCount((c) => c + 1)
    }, 2000)
  }, [id, originalDoc])

  const handleReprocess = useCallback(() => {
    if (!originalDoc) return
    setIsExtracting(true)
    setAnimateIn(false)
    setDocumentStatus(id, 'processing')
    setStatus('processing')
    setTimeout(() => {
      const fields = originalDoc.fields
      saveDocumentFields(id, fields)
      setDocumentStatus(id, 'review_needed')
      setReviewNeededCount(fields.filter((f) => f.status === 'review_needed').length)
      setStatus('review_needed')
      setIsExtracting(false)
      setAnimateIn(true)
      setReprocessCount((c) => c + 1)
    }, 2500)
  }, [id, originalDoc])

  if (!originalDoc) {
    return (
      <div className="flex items-center justify-center h-screen text-text-tertiary">
        문서를 찾을 수 없습니다
      </div>
    )
  }

  const doc = { ...originalDoc, status }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <ViewerTopBar doc={doc} prevId={prev} nextId={next} />
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        <div className="lg:w-[58%] h-[50vh] lg:h-auto border-b lg:border-b-0 lg:border-r border-border overflow-hidden flex flex-col">
          <DocumentPane key={doc.id} doc={doc} highlightedField={highlightedField} isExtracting={isExtracting} />
        </div>
        <div className="lg:w-[42%] flex-1 overflow-y-auto flex flex-col pb-14">
          <div className="px-5 py-3 border-b border-border sticky top-0 bg-bg-surface z-10">
            <h2 className="text-sm font-semibold text-text-primary">추출된 필드</h2>
          </div>
          <ExtractionForm
            key={`${doc.id}-${reprocessCount}`}
            doc={doc}
            onFieldFocus={setHighlightedField}
            onFieldsChange={(fields) =>
              setReviewNeededCount(fields.filter((f) => f.status === 'review_needed').length)
            }
            onReprocess={handleReprocess}
            onExtract={handleExtract}
            animateIn={animateIn}
          />
        </div>
      </div>
      <ActionBar
        docId={id}
        status={status}
        reviewNeededCount={reviewNeededCount}
        onHold={() => { setStatus('review_needed'); setDocumentStatus(id, 'review_needed') }}
        onApprove={() => { setStatus('review_done'); setDocumentStatus(id, 'review_done') }}
        onReprocess={handleReprocess}
      />
    </div>
  )
}
