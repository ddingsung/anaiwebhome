import type { Document } from './types'

export type InsightCard = {
  type: 'insight' | 'risk' | 'action'
  headline: string
  body: string
}

function getField(doc: Document, key: string): string {
  return doc.fields.find((f) => f.key === key)?.value ?? '—'
}

function hasReviewNeeded(doc: Document, key?: string): boolean {
  if (key) return doc.fields.find((f) => f.key === key)?.status === 'review_needed'
  return doc.fields.some((f) => f.status === 'review_needed')
}

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr)
  const today = new Date()
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export function generateInsights(doc: Document): InsightCard[] {
  if (doc.type === '세금계산서') {
    const taxAmount = getField(doc, 'tax_amount')
    const cards: InsightCard[] = [
      {
        type: 'insight',
        headline: `이번 달 세액 ${taxAmount}원 발생`,
        body: '분기 누적 세액을 확인하고 세무 신고 일정에 반영하세요.',
      },
    ]
    if (hasReviewNeeded(doc)) {
      cards.push({
        type: 'risk',
        headline: '합계금액 불일치가 감지됐습니다',
        body: '수정된 값이 ERP에 반영됐는지 확인하고, 필요시 거래처에 수정 세금계산서를 요청하세요.',
      })
    }
    cards.push({
      type: 'action',
      headline: '세금계산서 5년 보관 의무',
      body: '세금계산서는 발행일로부터 5년간 보관 의무가 있습니다. 문서 보관함을 확인하세요.',
    })
    return cards.slice(0, 3)
  }

  if (doc.type === '발주서') {
    const vendor = getField(doc, 'vendor')
    const deliveryDate = getField(doc, 'delivery_date')
    const vendorContact = getField(doc, 'vendor_contact')
    const cards: InsightCard[] = [
      {
        type: 'insight',
        headline: `${vendor}에 발주가 완료됐습니다`,
        body: `납기일(${deliveryDate})까지 납품 확인이 필요합니다.`,
      },
    ]
    if (deliveryDate !== '—') {
      const days = daysUntil(deliveryDate)
      if (days >= 0 && days <= 7) {
        cards.push({
          type: 'risk',
          headline: `납기일이 ${days}일 후입니다`,
          body: '공급업체 납품 일정을 재확인하고, 지연 가능성에 대비해 대안을 검토하세요.',
        })
      }
    }
    cards.push({
      type: 'action',
      headline: `담당자 ${vendorContact}에게 접수 확인 연락`,
      body: '발주서 접수 여부를 확인하고, 품목 및 납기일이 정확히 전달됐는지 확인하세요.',
    })
    return cards.slice(0, 3)
  }

  if (doc.type === '납품서') {
    const totalQty = getField(doc, 'total_qty')
    const supplier = getField(doc, 'supplier')
    const cards: InsightCard[] = [
      {
        type: 'insight',
        headline: `총 ${totalQty}개 품목 납품 완료`,
        body: '재고 시스템 업데이트 여부를 확인하세요.',
      },
    ]
    if (hasReviewNeeded(doc, 'total_amount')) {
      cards.push({
        type: 'risk',
        headline: '납품금액 불일치가 감지됐습니다',
        body: '거래처 청구서와 대조 후 금액을 확정하세요. 불일치 시 공급업체에 수정 요청이 필요합니다.',
      })
    }
    cards.push({
      type: 'action',
      headline: `${supplier} 대금 지급 일정 확인`,
      body: '입고 검수 완료 후 계약상 지급 기한 내에 대금을 처리하세요.',
    })
    return cards.slice(0, 3)
  }

  // 거래명세서
  const period = getField(doc, 'period')
  const amount = getField(doc, 'amount')
  const serviceDesc = getField(doc, 'service_desc')
  const cards: InsightCard[] = [
    {
      type: 'insight',
      headline: `${period} 용역비 ${amount}원 반영 완료`,
      body: '월별 외주 비용 추적 항목에 반영됐는지 확인하세요.',
    },
  ]
  if (hasReviewNeeded(doc, 'client_name')) {
    cards.push({
      type: 'risk',
      headline: '거래처명이 불확실합니다',
      body: '계약서와 대조 후 정확한 거래처명을 확정하세요. 오기재 시 세무 처리에 문제가 생길 수 있습니다.',
    })
  }
  cards.push({
    type: 'action',
    headline: `다음 달 ${serviceDesc} 갱신 여부 확인`,
    body: '계약 만료일 또는 갱신 조건을 사전에 확인하고, 필요 시 재계약 절차를 진행하세요.',
  })
  return cards.slice(0, 3)
}
