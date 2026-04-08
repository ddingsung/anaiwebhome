'use client'

import { useEffect } from 'react'
import type { Document } from '@idp/lib/types'
import { AiInsights } from '@idp/components/submit/AiInsights'
import type { CursorState } from '../FakeCursor'

// doc-001 고정 데이터 (AiInsights에 필요한 최소 Document 구조)
const DEMO_DOC: Document = {
  id: 'doc-001',
  name: '(주)한국물산_세금계산서_2026-03-28.pdf',
  type: '세금계산서',
  status: 'submitted',
  uploadedAt: '2026-03-28T09:00:00',
  processedAt: '2026-03-28T09:00:45',
  processingTime: '45초',
  fields: [
    { key: 'supplier_name', label: '공급자 상호',   value: '(주)한국물산', status: 'extracted', confidence: 0.98 },
    { key: 'buyer_name',    label: '공급받는자 상호', value: '(주)테스트기업', status: 'extracted', confidence: 0.95 },
    { key: 'issue_date',    label: '작성일자',       value: '2026-03-28',   status: 'extracted', confidence: 0.99 },
    { key: 'supply_amount', label: '공급가액',       value: '1,000,000',    status: 'extracted', confidence: 0.91 },
    { key: 'tax_amount',    label: '세액',           value: '100,000',      status: 'extracted', confidence: 0.95 },
    { key: 'total_amount',  label: '합계금액',       value: '1,050,000',    status: 'review_needed', confidence: 0.65, reviewNote: '합계 불일치' },
    { key: 'item_1_name',   label: '품목명',         value: 'IT 장비 임대', status: 'extracted', confidence: 0.92 },
    { key: 'supplier_short', label: '공급자 약칭',   value: '한국물산',     status: 'extracted', confidence: 0.99 },
  ],
}

interface Scene6Props { elapsed: number; onCursorUpdate: (s: CursorState) => void }

export function Scene6Insights({ elapsed, onCursorUpdate }: Scene6Props) {
  useEffect(() => {
    onCursorUpdate({ x: 50, y: 50, clicking: false, visible: false })
  }, [onCursorUpdate])

  return (
    <div className="w-full h-full bg-base flex flex-col items-center justify-center animate-in fade-in duration-300">
      <div className="w-full max-w-lg px-4">
        {/* 전송 완료 헤더 */}
        <div className="text-center mb-6">
          <div className="text-3xl mb-2 animate-in zoom-in duration-300">✅</div>
          <p className="text-xs text-text-secondary">(주)한국물산_세금계산서_2026-03-28.pdf</p>
        </div>

        {/* AI 인사이트 카드 */}
        <AiInsights doc={DEMO_DOC} />
      </div>
    </div>
  )
}
