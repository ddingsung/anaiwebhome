import type { Document } from '@idp/lib/types'

function getErpFields(doc: Document): Record<string, string> {
  const fieldMap = Object.fromEntries(doc.fields.map((f) => [f.key, f.value]))
  return {
    '문서 유형': doc.type,
    '문서 번호': fieldMap['order_no'] ?? fieldMap['statement_no'] ?? fieldMap['delivery_no'] ?? `${doc.type.slice(0,2)}-${doc.id.split('-')[1]}`,
    '거래처명': fieldMap['supplier_name'] ?? fieldMap['client_name'] ?? fieldMap['vendor'] ?? '—',
    '거래 일자': fieldMap['issue_date'] ?? fieldMap['order_date'] ?? fieldMap['delivery_date'] ?? '—',
    '합계 금액': fieldMap['total_amount'] ?? fieldMap['amount'] ?? '—',
    '검수자': doc.reviewedBy ?? '(현재 세션)',
    '반영 시각': new Date().toLocaleString('ko-KR'),
  }
}

export function ErpRecord({ doc }: { doc: Document }) {
  const fields = getErpFields(doc)
  return (
    <div className="bg-bg-surface rounded-card shadow-card p-6 max-w-lg mx-auto">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-2 h-2 rounded-full bg-success" />
        <h3 className="text-sm font-semibold text-text-primary">ERP 반영 완료</h3>
        <span className="text-xs text-success bg-success-light px-2 py-0.5 rounded-badge border border-green-200">
          전송됨
        </span>
      </div>
      <dl className="space-y-3">
        {Object.entries(fields).map(([key, value]) => (
          <div key={key} className="flex items-baseline gap-3">
            <dt className="text-xs text-text-secondary w-28 flex-shrink-0">{key}</dt>
            <dd className="text-sm font-medium text-text-primary font-numeric">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
