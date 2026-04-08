'use client'

import { useState } from 'react'
import type { Document } from '@idp/lib/types'

interface MappingRow {
  erpField: string
  erpCode: string
  extractedLabel: string
  value: string
  status: 'matched' | 'review' | 'empty'
}

const ERP_MODULE: Record<string, string> = {
  '세금계산서': '회계 모듈 · 매입 전표',
  '발주서': '구매 모듈 · 발주 등록',
  '납품서': '재고 모듈 · 입고 처리',
  '거래명세서': '회계 모듈 · 비용 처리',
}

function buildMapping(doc: Document): MappingRow[] {
  const fm = Object.fromEntries(doc.fields.map((f) => [f.key, f]))
  const row = (erpField: string, erpCode: string, key: string, extractedLabel: string): MappingRow => {
    const f = fm[key]
    return {
      erpField,
      erpCode,
      extractedLabel,
      value: f?.value ?? '',
      status: !f || !f.value ? 'empty' : f.status === 'review_needed' ? 'review' : 'matched',
    }
  }

  if (doc.type === '세금계산서') return [
    row('공급업체', 'VENDOR_NAME', 'supplier_name', '공급자 상호'),
    row('공급업체 사업자번호', 'VENDOR_REG', 'supplier_reg', '공급자 사업자번호'),
    row('구매처', 'BUYER_NAME', 'buyer_name', '공급받는자 상호'),
    row('전표일자', 'DOC_DATE', 'issue_date', '작성일자'),
    row('공급가액', 'SUPPLY_AMT', 'supply_amount', '공급가액'),
    row('세액', 'TAX_AMT', 'tax_amount', '세액'),
    row('합계금액', 'TOTAL_AMT', 'total_amount', '합계금액'),
    row('품목명', 'ITEM_NAME', 'item_1_name', '품목명'),
  ]

  if (doc.type === '발주서') return [
    row('발주번호', 'PO_NO', 'order_no', '발주번호'),
    row('공급업체', 'VENDOR_NAME', 'vendor', '공급업체'),
    row('발주일자', 'ORDER_DATE', 'order_date', '발주일'),
    row('납기일자', 'DELIVERY_DATE', 'delivery_date', '납기일'),
    row('품목 1', 'ITEM1_NAME', 'item_1_name', '품목 1 명칭'),
    row('품목 1 수량', 'ITEM1_QTY', 'item_1_qty', '품목 1 수량'),
    row('품목 1 단가', 'ITEM1_PRICE', 'item_1_price', '품목 1 단가'),
    row('품목 2', 'ITEM2_NAME', 'item_2_name', '품목 2 명칭'),
    row('품목 2 수량', 'ITEM2_QTY', 'item_2_qty', '품목 2 수량'),
  ]

  if (doc.type === '납품서') return [
    row('납품번호', 'DN_NO', 'delivery_no', '납품번호'),
    row('납품업체', 'SUPPLIER', 'supplier', '납품업체'),
    row('납품일자', 'DN_DATE', 'delivery_date', '납품일'),
    row('수취인', 'RECIPIENT', 'recipient', '수취인'),
    row('품목 1', 'ITEM1_NAME', 'item_1_name', '품목 1'),
    row('품목 2', 'ITEM2_NAME', 'item_2_name', '품목 2'),
    row('품목 3', 'ITEM3_NAME', 'item_3_name', '품목 3'),
    row('총 수량', 'TOTAL_QTY', 'total_qty', '총 수량'),
    row('납품금액', 'TOTAL_AMT', 'total_amount', '납품금액'),
  ]

  // 거래명세서
  return [
    row('명세서번호', 'ST_NO', 'statement_no', '명세서번호'),
    row('거래처명', 'CLIENT_NAME', 'client_name', '거래처명'),
    row('거래기간', 'PERIOD', 'period', '거래기간'),
    row('용역 내용', 'SERVICE_DESC', 'service_desc', '용역 내용'),
    row('금액', 'AMOUNT', 'amount', '금액'),
  ]
}

interface Props {
  doc: Document
  onConfirm: (rows: MappingRow[]) => void
}

export function ErpMappingTable({ doc, onConfirm }: Props) {
  const [rows, setRows] = useState<MappingRow[]>(() => buildMapping(doc))

  const updateValue = (idx: number, value: string) => {
    setRows((prev) => prev.map((r, i) =>
      i === idx ? { ...r, value, status: value ? 'matched' : 'empty' } : r
    ))
  }

  const reviewCount = rows.filter((r) => r.status === 'review').length
  const emptyCount = rows.filter((r) => r.status === 'empty').length

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-bg-surface rounded-card shadow-card overflow-hidden mb-4">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-text-primary">ERP 필드 매핑 확인</h3>
            <p className="text-xs text-text-tertiary mt-0.5">{ERP_MODULE[doc.type]}</p>
          </div>
          <div className="flex items-center gap-2">
            {reviewCount > 0 && (
              <span className="text-xs px-2 py-0.5 bg-warning-light text-warning border border-amber-200 rounded-badge">
                ⚠ 검토 필요 {reviewCount}건
              </span>
            )}
            {emptyCount > 0 && (
              <span className="text-xs px-2 py-0.5 bg-gray-100 text-text-secondary border border-gray-200 rounded-badge">
                미입력 {emptyCount}건
              </span>
            )}
          </div>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-[1fr_120px_1.4fr_60px] gap-0 px-5 py-2 bg-gray-50 border-b border-border text-xs font-medium text-text-tertiary uppercase tracking-wide">
          <div>ERP 항목</div>
          <div>필드 코드</div>
          <div>추출된 값</div>
          <div>상태</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-border">
          {rows.map((row, idx) => (
            <div
              key={row.erpCode}
              className={`grid grid-cols-[1fr_120px_1.4fr_60px] gap-0 px-5 py-2.5 items-center ${
                row.status === 'review' ? 'bg-amber-50' : ''
              }`}
            >
              <div>
                <div className="text-sm text-text-primary">{row.erpField}</div>
                <div className="text-[10px] text-text-tertiary">{row.extractedLabel}</div>
              </div>
              <div className="text-xs text-text-tertiary font-mono">{row.erpCode}</div>
              <div>
                <input
                  value={row.value}
                  onChange={(e) => updateValue(idx, e.target.value)}
                  className={`w-full text-sm bg-transparent border-b py-0.5 focus:outline-none font-numeric ${
                    row.status === 'review'
                      ? 'border-warning text-warning focus:border-accent'
                      : row.status === 'empty'
                      ? 'border-gray-300 text-text-tertiary placeholder:text-text-tertiary focus:border-accent'
                      : 'border-transparent text-text-primary focus:border-accent'
                  }`}
                  placeholder="값 없음"
                />
              </div>
              <div className="flex justify-center">
                {row.status === 'matched' && <span className="text-success text-xs">✓</span>}
                {row.status === 'review' && <span className="text-warning text-xs">⚠</span>}
                {row.status === 'empty' && <span className="text-text-tertiary text-xs">—</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => onConfirm(rows)}
          className="h-10 px-6 text-sm text-white bg-accent rounded-button hover:opacity-90 transition-opacity font-medium"
        >
          ERP로 전송 →
        </button>
      </div>
    </div>
  )
}
