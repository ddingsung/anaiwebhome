'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { getDocument, getPrevNextIds, setDocumentStatus } from '@idp/lib/mock-data'
import { ProgressStepper } from '@idp/components/submit/ProgressStepper'
import { ErpRecord } from '@idp/components/submit/ErpRecord'
import { ErpMappingTable } from '@idp/components/submit/ErpMappingTable'
import { AiInsights } from '@idp/components/submit/AiInsights'

export default function SubmitPageClient() {
  const params = useParams<{ id: string }>()
  const id = params.id

  const doc = getDocument(id)
  const { next } = getPrevNextIds(id)

  const router = useRouter()
  const [phase, setPhase] = useState<'mapping' | 'submitting'>('mapping')
  const [done, setDone] = useState(false)

  const handleConfirm = useCallback(() => {
    setPhase('submitting')
  }, [])

  const handleComplete = useCallback(() => {
    setDocumentStatus(id, 'submitted')
    setDone(true)
  }, [id])

  if (!doc) {
    return (
      <div className="flex items-center justify-center h-screen text-text-tertiary">
        문서를 찾을 수 없습니다
      </div>
    )
  }

  if (phase === 'mapping') {
    return (
      <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => router.back()}
              className="text-sm text-text-tertiary hover:text-text-primary transition-colors"
            >
              ← 돌아가기
            </button>
          </div>
          <h2 className="text-xl font-bold text-text-primary text-center mb-1">
            {doc.name}
          </h2>
          <p className="text-sm text-text-secondary text-center mb-6">ERP 필드 매핑을 확인하고 전송하세요</p>
          <ErpMappingTable doc={doc} onConfirm={handleConfirm} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <h2 className="text-xl font-bold text-text-primary text-center mb-2">
          {doc.name}
        </h2>
        <p className="text-sm text-text-secondary text-center mb-6">사내 시스템 전송 중...</p>

        <ProgressStepper onComplete={handleComplete} />

        {done && (
          <div className="mt-4">
            <ErpRecord doc={doc} />
            <AiInsights doc={doc} />
            <div className="flex justify-center gap-3 mt-6">
              <Link
                href="/demo/idp/dashboard"
                className="h-10 px-5 flex items-center text-sm text-text-secondary border border-border rounded-button hover:bg-gray-50 transition-colors"
              >
                대시보드로
              </Link>
              {next && (
                <Link
                  href={`/demo/idp/documents/${next}`}
                  className="h-10 px-5 flex items-center text-sm text-white bg-accent rounded-button hover:opacity-90 transition-opacity font-medium"
                >
                  다음 문서 검수 →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
