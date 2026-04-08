'use client'

import { useEffect, useState } from 'react'
import { MockDocument } from '@idp/components/viewer/MockDocument'
import type { Field } from '@idp/lib/types'
import type { CursorState } from '../FakeCursor'

// 고정된 데모용 필드 (doc-001 기반, 랜덤 없음)
const DEMO_FIELDS: Field[] = [
  { key: 'supplier_name',           label: '공급자 상호',         value: '(주)한국물산',   status: 'extracted',     confidence: 0.98, boundingBox: { x: 0.283, y: 0.116, width: 0.203, height: 0.024 } },
  { key: 'supplier_reg',            label: '공급자 사업자번호',   value: '123-45-67890',   status: 'extracted',     confidence: 0.97, boundingBox: { x: 0.283, y: 0.133, width: 0.203, height: 0.024 } },
  { key: 'supplier_representative', label: '공급자 대표자',       value: '홍길동',         status: 'extracted',     confidence: 0.94, boundingBox: { x: 0.283, y: 0.150, width: 0.203, height: 0.024 } },
  { key: 'buyer_name',              label: '공급받는자 상호',     value: '(주)테스트기업', status: 'extracted',     confidence: 0.95, boundingBox: { x: 0.727, y: 0.116, width: 0.203, height: 0.024 } },
  { key: 'issue_date',              label: '작성일자',            value: '2026-03-28',     status: 'extracted',     confidence: 0.99, boundingBox: { x: 0.059, y: 0.232, width: 0.176, height: 0.024 } },
  { key: 'supply_amount',           label: '공급가액',            value: '1,000,000',      status: 'extracted',     confidence: 0.91, boundingBox: { x: 0.235, y: 0.232, width: 0.176, height: 0.024 } },
  { key: 'tax_amount',              label: '세액',                value: '100,000',        status: 'extracted',     confidence: 0.95, boundingBox: { x: 0.412, y: 0.232, width: 0.176, height: 0.024 } },
  { key: 'total_amount',            label: '합계금액',            value: '1,050,000',      status: 'review_needed', confidence: 0.65, reviewNote: '합계 불일치', boundingBox: { x: 0.588, y: 0.232, width: 0.176, height: 0.024 } },
  { key: 'item_1_name',             label: '품목명',              value: 'IT 장비 임대',   status: 'extracted',     confidence: 0.92, boundingBox: { x: 0.353, y: 0.299, width: 0.148, height: 0.024 } },
  { key: 'supplier_short',          label: '공급자 약칭',         value: '한국물산',       status: 'extracted',     confidence: 0.99 },
]

// 순서대로 보여줄 필드 키 (5개, 0.6s 간격)
const REVEAL_KEYS = ['supplier_name', 'buyer_name', 'issue_date', 'supply_amount', 'total_amount']

interface Scene3Props { elapsed: number; onCursorUpdate: (s: CursorState) => void }

export function Scene3Extraction({ elapsed, onCursorUpdate }: Scene3Props) {
  const [revealedCount, setRevealedCount] = useState(0)

  // 커서 초기화 (씬3는 커서 숨김)
  useEffect(() => {
    onCursorUpdate({ x: 50, y: 50, clicking: false, visible: false })
  }, [onCursorUpdate])

  // 필드 순차 공개: 500ms 후 시작, 600ms 간격
  useEffect(() => {
    const count = elapsed < 500 ? 0 : Math.min(REVEAL_KEYS.length, Math.floor((elapsed - 500) / 600) + 1)
    setRevealedCount(count)
  }, [elapsed])

  // MockDocument에 전달할 필드: 공개된 필드만 값 표시, 나머지는 빈값
  const visibleFields: Field[] = DEMO_FIELDS.map((f) => {
    const revealIdx = REVEAL_KEYS.indexOf(f.key)
    if (revealIdx === -1) return f // REVEAL_KEYS에 없는 필드는 항상 표시
    if (revealIdx < revealedCount) return f
    return { ...f, value: '' }
  })

  return (
    <div className="w-full h-full bg-base flex animate-in fade-in duration-300">
      {/* 왼쪽: 문서 이미지 */}
      <div className="w-[58%] h-full overflow-hidden flex items-center justify-center p-6 bg-slate-100">
        <div className="w-full max-w-sm">
          <MockDocument type="세금계산서" fields={visibleFields} />
        </div>
      </div>

      {/* 오른쪽: 추출 필드 목록 */}
      <div className="w-[42%] h-full bg-surface border-l border-border flex flex-col">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <span className="text-accent">✦</span>
          <h3 className="text-base font-semibold text-text-primary">AI 추출 결과</h3>
          <span className="ml-auto text-sm text-text-tertiary">{revealedCount}/{REVEAL_KEYS.length} 필드</span>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          {REVEAL_KEYS.map((key, i) => {
            const field = DEMO_FIELDS.find((f) => f.key === key)!
            const revealed = i < revealedCount
            const confidence = field.confidence ?? 0
            const confLabel = confidence >= 0.9 ? '높음' : confidence >= 0.7 ? '보통' : '낮음'
            const confColor = confidence >= 0.9 ? 'text-success' : confidence >= 0.7 ? 'text-amber-500' : 'text-error'

            return (
              <div
                key={key}
                className={`rounded-card border p-4 transition-all duration-300 ${
                  revealed
                    ? field.status === 'review_needed'
                      ? 'border-amber-300 bg-amber-50'
                      : 'border-border bg-white'
                    : 'border-border bg-base opacity-30'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-text-secondary">{field.label}</span>
                  {revealed && (
                    <span
                      className={`text-xs font-semibold ${confColor} animate-in fade-in duration-200`}
                      style={{ animationDelay: '200ms' }}
                    >
                      ✦ {confLabel} {Math.round(confidence * 100)}%
                    </span>
                  )}
                </div>
                <div className="text-base font-medium text-text-primary font-mono min-h-[1.5rem]">
                  {revealed ? field.value || '—' : ''}
                </div>
                {revealed && field.status === 'review_needed' && (
                  <p className="text-xs text-amber-600 mt-1 animate-in fade-in duration-200">⚠ {field.reviewNote}</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
