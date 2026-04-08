import type { DocumentType, Field } from '@idp/lib/types'

function fv(fields: Field[], key: string, fallback = '—') {
  return fields.find((f) => f.key === key)?.value || fallback
}

export function MockDocument({ type, fields }: { type: DocumentType; fields: Field[] }) {
  switch (type) {
    case '세금계산서': return <TaxInvoice fields={fields} />
    case '발주서': return <PurchaseOrder fields={fields} />
    case '납품서': return <DeliveryNote fields={fields} />
    case '거래명세서': return <TransactionStatement fields={fields} />
  }
}

function DocWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white w-full aspect-[1/1.414] shadow-modal relative font-mono text-[9px] leading-tight p-8 border border-gray-200">
      {children}
    </div>
  )
}

function TaxInvoice({ fields }: { fields: Field[] }) {
  const supplyAmt = fv(fields, 'supply_amount')
  const tax = fv(fields, 'tax_amount')
  const total = fv(fields, 'total_amount')
  const issueDate = fv(fields, 'issue_date')
  const [, m, d] = issueDate.split('-')
  const shortName = fv(fields, 'supplier_short', fv(fields, 'supplier_name', '').replace('(주)', '').trim())

  return (
    <DocWrapper>
      <div className="text-center text-base font-bold mb-4 tracking-widest">세금계산서</div>
      <div className="border border-gray-400 mb-3">
        <div className="grid grid-cols-2 divide-x divide-gray-400">
          <div className="p-2">
            <div className="font-bold mb-1">공급자</div>
            <div className="grid grid-cols-2 gap-x-1 gap-y-0.5">
              <span className="text-gray-500">상호</span><span>{fv(fields, 'supplier_name')}</span>
              <span className="text-gray-500">등록번호</span><span>{fv(fields, 'supplier_reg')}</span>
              <span className="text-gray-500">대표자</span><span>{fv(fields, 'supplier_representative')}</span>
              <span className="text-gray-500">주소</span><span>{fv(fields, 'supplier_address')}</span>
            </div>
          </div>
          <div className="p-2">
            <div className="font-bold mb-1">공급받는자</div>
            <div className="grid grid-cols-2 gap-x-1 gap-y-0.5">
              <span className="text-gray-500">상호</span><span>{fv(fields, 'buyer_name')}</span>
              <span className="text-gray-500">등록번호</span><span>{fv(fields, 'buyer_reg')}</span>
              <span className="text-gray-500">대표자</span><span>{fv(fields, 'buyer_representative')}</span>
              <span className="text-gray-500">주소</span><span>{fv(fields, 'buyer_address')}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="border border-gray-400 mb-3">
        <div className="bg-gray-100 grid grid-cols-5 divide-x divide-gray-400 text-center">
          {['작성일자', '공급가액', '세액', '합계금액', '비고'].map((h) => (
            <div key={h} className="p-1 font-bold">{h}</div>
          ))}
        </div>
        <div className="grid grid-cols-5 divide-x divide-gray-400 text-center">
          <div className="p-1">{issueDate}</div>
          <div className="p-1">{supplyAmt}</div>
          <div className="p-1">{tax}</div>
          <div className="p-1 text-red-600 font-bold">{total}</div>
          <div className="p-1"></div>
        </div>
      </div>
      <div className="border border-gray-400">
        <div className="bg-gray-100 grid grid-cols-6 divide-x divide-gray-400 text-center">
          {['월', '일', '품목', '규격', '수량', '단가'].map((h) => (
            <div key={h} className="p-1 font-bold">{h}</div>
          ))}
        </div>
        <div className="grid grid-cols-6 divide-x divide-gray-400 text-center">
          <div className="p-1">{m}</div>
          <div className="p-1">{d}</div>
          <div className="p-1">{fv(fields, 'item_1_name')}</div>
          <div className="p-1">—</div>
          <div className="p-1">{fv(fields, 'item_1_qty')}</div>
          <div className="p-1">{fv(fields, 'item_1_price')}</div>
        </div>
      </div>
      <div className="absolute bottom-16 right-10 w-14 h-14 border-2 border-red-400 rounded-full opacity-30 flex items-center justify-center text-red-400 font-bold text-[8px] rotate-12">
        {shortName}
      </div>
    </DocWrapper>
  )
}

function PurchaseOrder({ fields }: { fields: Field[] }) {
  return (
    <DocWrapper>
      <div className="text-center text-base font-bold mb-4 tracking-widest">발 주 서</div>
      <div className="grid grid-cols-2 gap-2 mb-4 text-[9px]">
        <div className="border border-gray-400 p-2">
          <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
            <span className="text-gray-500">발주번호</span><span>{fv(fields, 'order_no')}</span>
            <span className="text-gray-500">발주일</span><span>{fv(fields, 'order_date')}</span>
            <span className="text-gray-500">납기일</span><span>{fv(fields, 'delivery_date')}</span>
          </div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
            <span className="text-gray-500">공급업체</span><span>{fv(fields, 'vendor')}</span>
            <span className="text-gray-500">담당자</span><span>{fv(fields, 'vendor_contact')}</span>
          </div>
        </div>
      </div>
      <div className="border border-gray-400">
        <div className="bg-gray-100 grid grid-cols-5 divide-x divide-gray-400 text-center">
          {['품목코드', '품명', '규격', '수량', '단가'].map((h) => (
            <div key={h} className="p-1 font-bold">{h}</div>
          ))}
        </div>
        <div className="grid grid-cols-5 divide-x divide-gray-400 text-center bg-amber-50">
          <div className="p-1">—</div>
          <div className="p-1">{fv(fields, 'item_1_name')}</div>
          <div className="p-1">—</div>
          <div className="p-1 text-amber-700 font-bold">{fv(fields, 'item_1_qty')} (?)</div>
          <div className="p-1">{fv(fields, 'item_1_price')}</div>
        </div>
        <div className="grid grid-cols-5 divide-x divide-gray-400 text-center">
          <div className="p-1">—</div>
          <div className="p-1">{fv(fields, 'item_2_name')}</div>
          <div className="p-1">—</div>
          <div className="p-1">{fv(fields, 'item_2_qty')}</div>
          <div className="p-1">{fv(fields, 'item_2_price')}</div>
        </div>
      </div>
    </DocWrapper>
  )
}

function DeliveryNote({ fields }: { fields: Field[] }) {
  return (
    <DocWrapper>
      <div className="text-center text-base font-bold mb-4 tracking-widest">납 품 서</div>
      <div className="border border-gray-400 mb-4 p-2">
        <div className="grid grid-cols-3 gap-x-4 gap-y-0.5">
          <span className="text-gray-500">납품번호</span><span className="col-span-2">{fv(fields, 'delivery_no')}</span>
          <span className="text-gray-500">납품업체</span><span className="col-span-2">{fv(fields, 'supplier')}</span>
          <span className="text-gray-500">납품일</span><span className="col-span-2">{fv(fields, 'delivery_date')}</span>
          <span className="text-gray-500">수취인</span><span className="col-span-2">{fv(fields, 'recipient')}</span>
        </div>
      </div>
      <div className="border border-gray-400">
        <div className="bg-gray-100 grid grid-cols-4 divide-x divide-gray-400 text-center">
          {['품목', '규격', '수량', '단가'].map((h) => (
            <div key={h} className="p-1 font-bold">{h}</div>
          ))}
        </div>
        {[
          [fv(fields, 'item_1_name'), '—', fv(fields, 'item_1_qty'), '—'],
          [fv(fields, 'item_2_name'), '—', fv(fields, 'item_2_qty'), '—'],
          [fv(fields, 'item_3_name'), '—', fv(fields, 'item_3_qty'), '—'],
        ].map((row, i) => (
          <div key={i} className="grid grid-cols-4 divide-x divide-gray-400 text-center">
            {row.map((cell, j) => <div key={j} className="p-1">{cell}</div>)}
          </div>
        ))}
        <div className="grid grid-cols-4 divide-x divide-gray-400 text-center font-bold bg-gray-50">
          <div className="p-1 col-span-2 text-right pr-2">합계</div>
          <div className="p-1">{fv(fields, 'total_qty')}</div>
          <div className="p-1">{fv(fields, 'total_amount')}</div>
        </div>
      </div>
    </DocWrapper>
  )
}

function TransactionStatement({ fields }: { fields: Field[] }) {
  const client = fv(fields, 'client_name').split(' 또는 ')[0]
  return (
    <DocWrapper>
      <div className="text-center text-base font-bold mb-4 tracking-widest">거 래 명 세 서</div>
      <div className="border border-gray-400 mb-4 p-2">
        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
          <span className="text-gray-500">명세서번호</span><span>{fv(fields, 'statement_no')}</span>
          <span className="text-gray-500">거래처명</span>
          <span className="relative">
            {client}
            <span className="absolute inset-0 bg-red-200 opacity-40 rounded" />
          </span>
          <span className="text-gray-500">거래기간</span><span>{fv(fields, 'period')}</span>
          <span className="text-gray-500">용역 내용</span><span>{fv(fields, 'service_desc')}</span>
        </div>
      </div>
      <div className="border border-gray-400">
        <div className="bg-gray-100 grid grid-cols-3 divide-x divide-gray-400 text-center">
          {['항목', '기간', '금액'].map((h) => (
            <div key={h} className="p-1 font-bold">{h}</div>
          ))}
        </div>
        <div className="grid grid-cols-3 divide-x divide-gray-400 text-center">
          <div className="p-1">{fv(fields, 'item_1_name', '용역비')}</div>
          <div className="p-1">{fv(fields, 'period', '').split(' ~ ')[0]?.slice(0, 7)}</div>
          <div className="p-1">{fv(fields, 'amount')}</div>
        </div>
        <div className="grid grid-cols-3 divide-x divide-gray-400 text-center font-bold bg-gray-50">
          <div className="p-1 col-span-2 text-right pr-2">합계</div>
          <div className="p-1">{fv(fields, 'amount')}</div>
        </div>
      </div>
      <div className="absolute top-28 left-24 w-16 h-16 border-2 border-red-500 rounded-full opacity-40 flex items-center justify-center text-red-500 font-bold text-[7px] rotate-6">
        {client.replace('(주)', '').trim()}<br/>대표인
      </div>
    </DocWrapper>
  )
}
