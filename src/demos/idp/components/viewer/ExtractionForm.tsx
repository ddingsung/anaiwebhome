'use client'

import { useState, useRef } from 'react'
import type { Document, Field } from '@idp/lib/types'
import { saveDocumentFields } from '@idp/lib/mock-data'
import { ExtractedField } from './ExtractedField'

const FIELD_GROUPS: Record<string, string[]> = {
  '문서 정보': ['order_no', 'delivery_no', 'statement_no', 'issue_date', 'order_date', 'delivery_date', 'period'],
  '거래처 정보': ['supplier_name', 'supplier_reg', 'supplier_representative', 'supplier_address', 'buyer_name', 'buyer_reg', 'buyer_representative', 'buyer_address', 'client_name', 'vendor', 'vendor_contact', 'recipient'],
  '품목 정보': ['item_1_name', 'item_1_qty', 'item_1_price', 'item_2_name', 'item_2_qty', 'item_2_price', 'item_3_name', 'item_3_qty', 'item_3_price', 'service_desc'],
  '금액 정보': ['supply_amount', 'tax_amount', 'total_amount', 'amount', 'total_qty'],
}

// 문서 렌더링용 내부 필드 — 추출 폼에 노출하지 않음
const INTERNAL_FIELDS = new Set(['supplier_short'])

function groupFields(fields: Field[]): Array<{ group: string; fields: Field[] }> {
  const used = new Set<string>()
  const result: Array<{ group: string; fields: Field[] }> = []

  for (const [group, keys] of Object.entries(FIELD_GROUPS)) {
    const grouped = fields.filter((f) => keys.includes(f.key))
    if (grouped.length > 0) {
      grouped.forEach((f) => used.add(f.key))
      result.push({ group, fields: grouped })
    }
  }

  const rest = fields.filter((f) => !used.has(f.key))
  if (rest.length > 0) result.push({ group: '기타', fields: rest })

  return result
}

interface ExtractionFormProps {
  doc: Document
  onFieldFocus?: (key: string) => void
  onFieldsChange?: (fields: Field[]) => void
  onReprocess?: () => void
  onExtract?: () => void
  animateIn?: boolean
}

export function ExtractionForm({ doc, onFieldFocus, onFieldsChange, onReprocess, onExtract, animateIn }: ExtractionFormProps) {
  const [fields, setFields] = useState<Field[]>(doc.fields)
  const [saved, setSaved] = useState(false)
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  if (doc.status === 'pending') {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-8 text-center">
        <div className="w-12 h-12 bg-accent-light rounded-full flex items-center justify-center mb-4">
          <span className="text-accent text-xl">✦</span>
        </div>
        <p className="text-sm font-semibold text-text-primary mb-1">텍스트 추출 준비 완료</p>
        <p className="text-xs text-text-tertiary mb-6">AI가 문서에서 자동으로 텍스트를 추출합니다</p>
        <button
          onClick={onExtract}
          className="px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-button hover:opacity-90 transition-opacity"
        >
          AI 텍스트 추출 시작
        </button>
      </div>
    )
  }

  if (doc.status === 'processing') {
    return (
      <div className="p-4 space-y-3">
        {[1,2,3,4,5,6].map((i) => (
          <div key={i} className="animate-pulse space-y-1">
            <div className="h-3 bg-gray-200 rounded w-1/3" />
            <div className="h-8 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (doc.status === 'failed') {
    return (
      <div className="p-6 text-center">
        <div className="text-error text-sm font-medium mb-2">문서 파싱 실패</div>
        <p className="text-text-tertiary text-xs mb-4">파일이 손상되었거나 지원하지 않는 형식입니다.</p>
        <button
          onClick={onReprocess}
          className="px-4 py-2 text-sm bg-accent text-white rounded-button hover:opacity-90 transition-opacity"
        >
          재시도
        </button>
      </div>
    )
  }

  const handleEdit = (key: string, value: string) => {
    setFields((prev) => {
      const updated = prev.map((f) =>
        f.key === key
          ? { ...f, value, status: 'edited' as const, originalValue: f.originalValue ?? f.value }
          : f
      )
      saveDocumentFields(doc.id, updated)
      onFieldsChange?.(updated)
      return updated
    })
    if (savedTimer.current) clearTimeout(savedTimer.current)
    setSaved(true)
    savedTimer.current = setTimeout(() => setSaved(false), 1500)
  }

  const groups = groupFields(fields.filter((f) => !INTERNAL_FIELDS.has(f.key)))
  let animIdx = 0

  return (
    <div className="divide-y divide-border">
      {saved && (
        <div className="sticky top-0 z-10 px-4 py-2 bg-success/10 border-b border-success/20 flex items-center gap-1.5">
          <span className="text-success text-xs font-medium">✓ 저장됨</span>
        </div>
      )}
      {groups.map(({ group, fields: gFields }) => (
        <div key={group} className="p-4">
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wide mb-3">{group}</h3>
          <div className="space-y-1">
            {gFields.map((field) => {
              const idx = animIdx++
              return (
                <div
                  key={field.key}
                  className={animateIn ? 'animate-in fade-in slide-in-from-top-1 duration-300 fill-mode-both' : ''}
                  style={animateIn ? { animationDelay: `${idx * 60}ms` } : undefined}
                >
                  <ExtractedField field={field} onEdit={handleEdit} onFocus={onFieldFocus} />
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
