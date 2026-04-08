import type { Document, DocumentType, Field } from './types'

const SUPPLIERS = ['(주)한국물산', '(주)대한상사', '(주)서울무역', '(주)부산기업', '(주)인천통상']
const SUPPLIERS_SHORT = ['한국물산', '대한상사', '서울무역', '부산기업', '인천통상']
const BUYERS = ['(주)테스트기업', '(주)샘플코리아', '(주)데모산업', '(주)예시기업', '(주)알파테크']
const REPS = ['홍길동', '김철수', '이영희', '박민준', '최수진']
const ADDRESSES = ['서울시 강남구', '서울시 서초구', '서울시 마포구', '경기도 성남시', '인천시 연수구']
const VENDORS = ['(주)부품나라', '(주)전자부품', '(주)기술상사', '(주)산업소재', '(주)부품마트']
const CONTACTS = ['이영희', '김대리', '박과장', '정부장', '최담당']
const LOGISTICS = ['(주)물류센터', '(주)한국택배', '(주)빠른배송', '(주)안전물류', '(주)신속운송']
const CLIENTS = ['(주)외주기업', '(주)크리에이티브', '(주)소프트웨어랩', '(주)디지털솔루션', '(주)테크파트너']
const ITEMS_TAX = ['소프트웨어 라이센스', 'IT 장비 임대', '컨설팅 서비스', '유지보수 서비스', '클라우드 이용료']
const ITEMS_PO1 = ['PCB 기판 A타입', 'LED 모듈', '센서 보드', 'MCU 칩셋', '전원 공급 장치']
const ITEMS_PO2 = ['전해 커패시터', '저항 세트', '트랜지스터', '다이오드 팩', '인덕터']
const ITEMS_DN = [['사무용 의자', '책상', '모니터 받침대'], ['복합기', '파쇄기', '화이트보드'], ['노트북', '키보드', '마우스'], ['서랍장', '책장', '파티션']]
const SERVICES = ['소프트웨어 개발 용역', '시스템 유지보수', 'UI/UX 디자인 용역', '데이터 분석 서비스', '네트워크 구축 용역']

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function randInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min }
function fmt(n: number) { return n.toLocaleString('ko-KR') }
function recentDate(daysAgo = 30) {
  const d = new Date()
  d.setDate(d.getDate() - randInt(0, daysAgo))
  return d.toISOString().split('T')[0]
}
function regNo() {
  return `${randInt(100,999)}-${randInt(10,99)}-${randInt(10000,99999)}`
}

export function mockFieldsFor(type: DocumentType): Field[] {
  if (type === '세금계산서') {
    const supplierIdx = randInt(0, SUPPLIERS.length - 1)
    const supplyBase = randInt(3, 30) * 100000
    const tax = Math.round(supplyBase * 0.1)
    const totalWrong = supplyBase + tax - randInt(1, 5) * 10000
    const date = recentDate()
    const qty = randInt(1, 5)
    const itemPrice = Math.round(supplyBase / qty)
    return [
      { key: 'supplier_name',           label: '공급자 상호',           value: SUPPLIERS[supplierIdx], status: 'extracted',     confidence: 0.98, boundingBox: { x: 0.283, y: 0.116, width: 0.203, height: 0.024 } },
      { key: 'supplier_reg',            label: '공급자 사업자번호',      value: regNo(),                status: 'extracted',     confidence: 0.97, boundingBox: { x: 0.283, y: 0.133, width: 0.203, height: 0.024 } },
      { key: 'supplier_representative', label: '공급자 대표자',          value: pick(REPS),             status: 'extracted',     confidence: 0.94, boundingBox: { x: 0.283, y: 0.150, width: 0.203, height: 0.024 } },
      { key: 'supplier_address',        label: '공급자 주소',            value: pick(ADDRESSES),        status: 'extracted',     confidence: 0.88, boundingBox: { x: 0.283, y: 0.167, width: 0.203, height: 0.024 } },
      { key: 'buyer_name',              label: '공급받는자 상호',        value: pick(BUYERS),           status: 'extracted',     confidence: 0.95, boundingBox: { x: 0.727, y: 0.116, width: 0.203, height: 0.024 } },
      { key: 'buyer_reg',               label: '공급받는자 사업자번호',  value: regNo(),                status: 'extracted',     confidence: 0.96, boundingBox: { x: 0.727, y: 0.133, width: 0.203, height: 0.024 } },
      { key: 'buyer_representative',    label: '공급받는자 대표자',      value: pick(REPS),             status: 'extracted',     confidence: 0.93, boundingBox: { x: 0.727, y: 0.150, width: 0.203, height: 0.024 } },
      { key: 'buyer_address',           label: '공급받는자 주소',        value: pick(ADDRESSES),        status: 'extracted',     confidence: 0.87, boundingBox: { x: 0.727, y: 0.167, width: 0.203, height: 0.024 } },
      { key: 'issue_date',              label: '작성일자',               value: date,                   status: 'extracted',     confidence: 0.99, boundingBox: { x: 0.059, y: 0.232, width: 0.176, height: 0.024 } },
      { key: 'supply_amount',           label: '공급가액',               value: fmt(supplyBase),        status: 'extracted',     confidence: 0.91, boundingBox: { x: 0.235, y: 0.232, width: 0.176, height: 0.024 } },
      { key: 'tax_amount',              label: '세액',                   value: fmt(tax),               status: 'extracted',     confidence: 0.95, boundingBox: { x: 0.412, y: 0.232, width: 0.176, height: 0.024 } },
      { key: 'total_amount',            label: '합계금액',               value: fmt(totalWrong),        status: 'review_needed', confidence: 0.65, reviewNote: `공급가액(${fmt(supplyBase)}) + 세액(${fmt(tax)}) = ${fmt(supplyBase + tax)}이어야 하나 ${fmt(totalWrong)}으로 추출됨`, boundingBox: { x: 0.588, y: 0.232, width: 0.176, height: 0.024 } },
      { key: 'item_1_name',             label: '품목명',                 value: pick(ITEMS_TAX),        status: 'extracted',     confidence: 0.92, boundingBox: { x: 0.353, y: 0.299, width: 0.148, height: 0.024 } },
      { key: 'item_1_qty',              label: '품목 수량',              value: String(qty),            status: 'extracted',     confidence: 0.99, boundingBox: { x: 0.648, y: 0.299, width: 0.148, height: 0.024 } },
      { key: 'item_1_price',            label: '품목 단가',              value: fmt(itemPrice),         status: 'extracted',     confidence: 0.94, boundingBox: { x: 0.795, y: 0.299, width: 0.148, height: 0.024 } },
      { key: 'supplier_short',          label: '공급자 약칭',            value: SUPPLIERS_SHORT[supplierIdx], status: 'extracted', confidence: 0.99 },
    ]
  }
  if (type === '발주서') {
    const date = recentDate()
    const deliveryDate = new Date(date)
    deliveryDate.setDate(deliveryDate.getDate() + randInt(7, 21))
    const qty1 = randInt(3, 20)
    const price1 = randInt(2, 10) * 10000
    const qty2 = randInt(50, 200)
    const price2 = randInt(10, 200) * 100
    const dateStr = date.replace(/-/g, '')
    return [
      { key: 'order_no',       label: '발주번호',    value: `PO-${dateStr}-${randInt(100,999)}`,       status: 'extracted',     confidence: 0.94, boundingBox: { x: 0.282, y: 0.097, width: 0.195, height: 0.024 } },
      { key: 'vendor',         label: '공급업체',    value: pick(VENDORS),                             status: 'extracted',     confidence: 0.91, boundingBox: { x: 0.732, y: 0.097, width: 0.195, height: 0.024 } },
      { key: 'vendor_contact', label: '담당자',      value: pick(CONTACTS),                            status: 'extracted',     confidence: 0.89, boundingBox: { x: 0.732, y: 0.114, width: 0.195, height: 0.024 } },
      { key: 'order_date',     label: '발주일',      value: date,                                      status: 'extracted',     confidence: 0.98, boundingBox: { x: 0.282, y: 0.114, width: 0.195, height: 0.024 } },
      { key: 'delivery_date',  label: '납기일',      value: deliveryDate.toISOString().split('T')[0],  status: 'extracted',     confidence: 0.93, boundingBox: { x: 0.282, y: 0.131, width: 0.195, height: 0.024 } },
      { key: 'item_1_name',    label: '품목 1 명칭', value: pick(ITEMS_PO1),                           status: 'extracted',     confidence: 0.88, boundingBox: { x: 0.235, y: 0.202, width: 0.176, height: 0.024 } },
      { key: 'item_1_qty',     label: '품목 1 수량', value: String(qty1),                              status: 'review_needed', confidence: 0.49, reviewNote: `수량 인식 불확실 — "${qty1}" 또는 "${qty1 - 2}"로 판독 가능`, boundingBox: { x: 0.588, y: 0.202, width: 0.176, height: 0.024 } },
      { key: 'item_1_price',   label: '품목 1 단가', value: fmt(price1),                               status: 'extracted',     confidence: 0.87, boundingBox: { x: 0.765, y: 0.202, width: 0.176, height: 0.024 } },
      { key: 'item_2_name',    label: '품목 2 명칭', value: pick(ITEMS_PO2),                           status: 'extracted',     confidence: 0.91, boundingBox: { x: 0.235, y: 0.226, width: 0.176, height: 0.024 } },
      { key: 'item_2_qty',     label: '품목 2 수량', value: String(qty2),                              status: 'extracted',     confidence: 0.96, boundingBox: { x: 0.588, y: 0.226, width: 0.176, height: 0.024 } },
      { key: 'item_2_price',   label: '품목 2 단가', value: fmt(price2),                               status: 'extracted',     confidence: 0.93, boundingBox: { x: 0.765, y: 0.226, width: 0.176, height: 0.024 } },
    ]
  }
  if (type === '납품서') {
    const date = recentDate()
    const dateStr = date.replace(/-/g, '')
    const itemSet = pick(ITEMS_DN)
    const qty = randInt(10, 100)
    const unitPrices = [randInt(20, 80) * 1000, randInt(50, 150) * 1000, randInt(5, 30) * 1000]
    const totalQty = qty * 3
    const totalAmt = unitPrices.reduce((s, p) => s + p * qty, 0) - randInt(1, 5) * 10000
    return [
      { key: 'delivery_no',   label: '납품번호',      value: `DN-${dateStr}-${randInt(100,999)}`, status: 'extracted',     confidence: 0.97, boundingBox: { x: 0.367, y: 0.097, width: 0.560, height: 0.024 } },
      { key: 'supplier',      label: '납품업체',      value: pick(LOGISTICS),                     status: 'extracted',     confidence: 0.96, boundingBox: { x: 0.367, y: 0.114, width: 0.560, height: 0.024 } },
      { key: 'delivery_date', label: '납품일',        value: date,                                status: 'extracted',     confidence: 0.99, boundingBox: { x: 0.367, y: 0.131, width: 0.560, height: 0.024 } },
      { key: 'recipient',     label: '수취인',        value: `${pick(BUYERS)} 구매팀`,            status: 'extracted',     confidence: 0.94, boundingBox: { x: 0.367, y: 0.147, width: 0.560, height: 0.024 } },
      { key: 'item_1_name',   label: '품목 1',        value: itemSet[0],                          status: 'extracted',     confidence: 0.97, boundingBox: { x: 0.059, y: 0.219, width: 0.221, height: 0.024 } },
      { key: 'item_1_qty',    label: '품목 1 수량',   value: String(qty),                         status: 'extracted',     confidence: 0.95, boundingBox: { x: 0.500, y: 0.219, width: 0.221, height: 0.024 } },
      { key: 'item_2_name',   label: '품목 2',        value: itemSet[1],                          status: 'extracted',     confidence: 0.96, boundingBox: { x: 0.059, y: 0.244, width: 0.221, height: 0.024 } },
      { key: 'item_2_qty',    label: '품목 2 수량',   value: String(qty),                         status: 'extracted',     confidence: 0.95, boundingBox: { x: 0.500, y: 0.244, width: 0.221, height: 0.024 } },
      { key: 'item_3_name',   label: '품목 3',        value: itemSet[2],                          status: 'extracted',     confidence: 0.94, boundingBox: { x: 0.059, y: 0.269, width: 0.221, height: 0.024 } },
      { key: 'item_3_qty',    label: '품목 3 수량',   value: String(qty),                         status: 'extracted',     confidence: 0.93, boundingBox: { x: 0.500, y: 0.269, width: 0.221, height: 0.024 } },
      { key: 'total_qty',     label: '총 수량',       value: String(totalQty),                    status: 'extracted',     confidence: 0.95, boundingBox: { x: 0.500, y: 0.293, width: 0.221, height: 0.024 } },
      { key: 'total_amount',  label: '납품금액',      value: fmt(totalAmt),                       status: 'review_needed', confidence: 0.68, reviewNote: '단가 × 수량 합산값과 불일치', boundingBox: { x: 0.721, y: 0.293, width: 0.221, height: 0.024 } },
    ]
  }
  // 거래명세서
  const date = recentDate()
  const startDate = new Date(date)
  startDate.setDate(1)
  const amount = randInt(20, 100) * 100000
  const dateStr = date.replace(/-/g, '')
  const clientIdx = randInt(0, CLIENTS.length - 1)
  const client2 = CLIENTS[(clientIdx + 1) % CLIENTS.length]
  return [
    { key: 'statement_no', label: '명세서번호', value: `ST-${dateStr}-${randInt(100,999)}`,                                   status: 'extracted',     confidence: 0.91, boundingBox: { x: 0.514, y: 0.097, width: 0.413, height: 0.024 } },
    { key: 'client_name',  label: '거래처명',   value: `${CLIENTS[clientIdx]} 또는 ${client2}`,                               status: 'review_needed', confidence: 0.58, reviewNote: '인감 도장이 텍스트를 가려 거래처명 인식 불확실 (두 후보 모두 가능성 있음)', boundingBox: { x: 0.514, y: 0.114, width: 0.413, height: 0.024 } },
    { key: 'period',       label: '거래기간',   value: `${startDate.toISOString().split('T')[0]} ~ ${date}`,                  status: 'extracted',     confidence: 0.94, boundingBox: { x: 0.514, y: 0.131, width: 0.413, height: 0.024 } },
    { key: 'service_desc', label: '용역 내용',  value: pick(SERVICES),                                                        status: 'extracted',     confidence: 0.89, boundingBox: { x: 0.514, y: 0.147, width: 0.413, height: 0.024 } },
    { key: 'item_1_name',  label: '항목',       value: '용역비',                                                              status: 'extracted',     confidence: 0.92, boundingBox: { x: 0.059, y: 0.219, width: 0.294, height: 0.024 } },
    { key: 'amount',       label: '금액',       value: fmt(amount),                                                           status: 'extracted',     confidence: 0.93, boundingBox: { x: 0.647, y: 0.219, width: 0.294, height: 0.024 } },
  ]
}

export const MOCK_DOCUMENTS: Document[] = [
  {
    id: 'doc-001',
    name: '(주)한국물산_세금계산서_2026-03-28.pdf',
    type: '세금계산서',
    status: 'review_needed',
    uploadedAt: '2026-03-30T09:12:00',
    processedAt: '2026-03-30T09:12:08',
    processingTime: '8초',
    fields: [
      { key: 'supplier_name', label: '공급자 상호', value: '(주)한국물산', status: 'extracted', confidence: 0.98, boundingBox: { x: 0.283, y: 0.116, width: 0.203, height: 0.024 } },
      { key: 'supplier_reg', label: '공급자 사업자번호', value: '123-45-67890', status: 'extracted', confidence: 0.97, boundingBox: { x: 0.283, y: 0.133, width: 0.203, height: 0.024 } },
      { key: 'supplier_representative', label: '공급자 대표자', value: '홍길동', status: 'extracted', confidence: 0.94, boundingBox: { x: 0.283, y: 0.150, width: 0.203, height: 0.024 } },
      { key: 'supplier_address', label: '공급자 주소', value: '서울시 강남구', status: 'extracted', confidence: 0.88, boundingBox: { x: 0.283, y: 0.167, width: 0.203, height: 0.024 } },
      { key: 'supplier_short', label: '공급자 약칭', value: '한국물산', status: 'extracted', confidence: 0.99 },
      { key: 'buyer_name', label: '공급받는자 상호', value: '(주)테스트기업', status: 'extracted', confidence: 0.95, boundingBox: { x: 0.727, y: 0.116, width: 0.203, height: 0.024 } },
      { key: 'buyer_reg', label: '공급받는자 사업자번호', value: '456-78-90123', status: 'extracted', confidence: 0.96, boundingBox: { x: 0.727, y: 0.133, width: 0.203, height: 0.024 } },
      { key: 'buyer_representative', label: '공급받는자 대표자', value: '김철수', status: 'extracted', confidence: 0.93, boundingBox: { x: 0.727, y: 0.150, width: 0.203, height: 0.024 } },
      { key: 'buyer_address', label: '공급받는자 주소', value: '경기도 성남시', status: 'extracted', confidence: 0.87, boundingBox: { x: 0.727, y: 0.167, width: 0.203, height: 0.024 } },
      { key: 'issue_date', label: '작성일자', value: '2026-03-28', status: 'extracted', confidence: 0.99, boundingBox: { x: 0.059, y: 0.232, width: 0.176, height: 0.024 } },
      { key: 'supply_amount', label: '공급가액', value: '1,000,000', status: 'review_needed', reviewNote: '공급가액과 총액 불일치: 세액 합산 시 1,100,000이 되어야 합니다', confidence: 0.72, boundingBox: { x: 0.235, y: 0.232, width: 0.176, height: 0.024 } },
      { key: 'tax_amount', label: '세액', value: '100,000', status: 'extracted', confidence: 0.91, boundingBox: { x: 0.412, y: 0.232, width: 0.176, height: 0.024 } },
      { key: 'total_amount', label: '합계금액', value: '1,050,000', status: 'review_needed', reviewNote: '공급가액(1,000,000) + 세액(100,000) = 1,100,000이어야 하나 1,050,000으로 추출됨', confidence: 0.65, boundingBox: { x: 0.588, y: 0.232, width: 0.176, height: 0.024 } },
      { key: 'item_1_name', label: '품목명', value: 'IT 장비 임대', status: 'extracted', confidence: 0.92, boundingBox: { x: 0.353, y: 0.299, width: 0.148, height: 0.024 } },
      { key: 'item_1_qty', label: '품목 수량', value: '2', status: 'extracted', confidence: 0.99, boundingBox: { x: 0.648, y: 0.299, width: 0.148, height: 0.024 } },
      { key: 'item_1_price', label: '품목 단가', value: '500,000', status: 'extracted', confidence: 0.94, boundingBox: { x: 0.795, y: 0.299, width: 0.148, height: 0.024 } },
    ],
  },
  {
    id: 'doc-002',
    name: '(주)서울상사_세금계산서_2026-03-29.pdf',
    type: '세금계산서',
    status: 'submitted',
    uploadedAt: '2026-03-30T08:45:00',
    processedAt: '2026-03-30T08:45:06',
    processingTime: '6초',
    reviewedBy: '김검수',
    fields: [
      { key: 'supplier_name', label: '공급자 상호', value: '(주)서울상사', status: 'extracted', confidence: 0.99 },
      { key: 'supplier_reg', label: '공급자 사업자번호', value: '234-56-78901', status: 'extracted', confidence: 0.98 },
      { key: 'supplier_representative', label: '공급자 대표자', value: '이영희', status: 'extracted', confidence: 0.95, boundingBox: { x: 0.283, y: 0.150, width: 0.203, height: 0.024 } },
      { key: 'supplier_address', label: '공급자 주소', value: '서울시 서초구', status: 'extracted', confidence: 0.89, boundingBox: { x: 0.283, y: 0.167, width: 0.203, height: 0.024 } },
      { key: 'supplier_short', label: '공급자 약칭', value: '서울상사', status: 'extracted', confidence: 0.99 },
      { key: 'buyer_name', label: '공급받는자 상호', value: '(주)테스트기업', status: 'extracted', confidence: 0.97, boundingBox: { x: 0.727, y: 0.116, width: 0.203, height: 0.024 } },
      { key: 'buyer_reg', label: '공급받는자 사업자번호', value: '456-78-90123', status: 'extracted', confidence: 0.97, boundingBox: { x: 0.727, y: 0.133, width: 0.203, height: 0.024 } },
      { key: 'buyer_representative', label: '공급받는자 대표자', value: '김철수', status: 'extracted', confidence: 0.94, boundingBox: { x: 0.727, y: 0.150, width: 0.203, height: 0.024 } },
      { key: 'buyer_address', label: '공급받는자 주소', value: '경기도 성남시', status: 'extracted', confidence: 0.88, boundingBox: { x: 0.727, y: 0.167, width: 0.203, height: 0.024 } },
      { key: 'issue_date', label: '작성일자', value: '2026-03-29', status: 'extracted', confidence: 0.99 },
      { key: 'supply_amount', label: '공급가액', value: '2,500,000', status: 'extracted', confidence: 0.96 },
      { key: 'tax_amount', label: '세액', value: '250,000', status: 'extracted', confidence: 0.95 },
      { key: 'total_amount', label: '합계금액', value: '2,750,000', status: 'confirmed', confidence: 0.99 },
      { key: 'item_1_name', label: '품목명', value: '클라우드 이용료', status: 'extracted', confidence: 0.93, boundingBox: { x: 0.353, y: 0.299, width: 0.148, height: 0.024 } },
      { key: 'item_1_qty', label: '품목 수량', value: '1', status: 'extracted', confidence: 0.99, boundingBox: { x: 0.648, y: 0.299, width: 0.148, height: 0.024 } },
      { key: 'item_1_price', label: '품목 단가', value: '2,500,000', status: 'extracted', confidence: 0.96, boundingBox: { x: 0.795, y: 0.299, width: 0.148, height: 0.024 } },
    ],
  },
  {
    id: 'doc-003',
    name: '발주서_2026-03-28_부품구매.pdf',
    type: '발주서',
    status: 'review_needed',
    uploadedAt: '2026-03-30T09:30:00',
    processedAt: '2026-03-30T09:30:11',
    processingTime: '11초',
    fields: [
      { key: 'order_no', label: '발주번호', value: 'PO-2026-0328', status: 'extracted', confidence: 0.94, boundingBox: { x: 0.282, y: 0.097, width: 0.195, height: 0.024 } },
      { key: 'vendor', label: '공급업체', value: '(주)부품나라', status: 'extracted', confidence: 0.91, boundingBox: { x: 0.732, y: 0.097, width: 0.195, height: 0.024 } },
      { key: 'vendor_contact', label: '담당자', value: '박과장', status: 'extracted', confidence: 0.89, boundingBox: { x: 0.732, y: 0.114, width: 0.195, height: 0.024 } },
      { key: 'order_date', label: '발주일', value: '2026-03-28', status: 'extracted', confidence: 0.98, boundingBox: { x: 0.282, y: 0.114, width: 0.195, height: 0.024 } },
      { key: 'delivery_date', label: '납기일', value: '2026-04-10', status: 'extracted', confidence: 0.93, boundingBox: { x: 0.282, y: 0.131, width: 0.195, height: 0.024 } },
      { key: 'item_1_name', label: '품목 1 명칭', value: 'PCB 기판 A타입', status: 'extracted', confidence: 0.88, boundingBox: { x: 0.235, y: 0.202, width: 0.176, height: 0.024 } },
      { key: 'item_1_qty', label: '품목 1 수량', value: '5', status: 'review_needed', reviewNote: '문서 손상으로 인해 "5" 또는 "3"으로 판독 불명확 (confidence 49%)', confidence: 0.49, boundingBox: { x: 0.588, y: 0.202, width: 0.176, height: 0.024 } },
      { key: 'item_1_price', label: '품목 1 단가', value: '45,000', status: 'extracted', confidence: 0.87, boundingBox: { x: 0.765, y: 0.202, width: 0.176, height: 0.024 } },
      { key: 'item_2_name', label: '품목 2 명칭', value: '전해 커패시터', status: 'extracted', confidence: 0.91, boundingBox: { x: 0.235, y: 0.226, width: 0.176, height: 0.024 } },
      { key: 'item_2_qty', label: '품목 2 수량', value: '100', status: 'extracted', confidence: 0.96, boundingBox: { x: 0.588, y: 0.226, width: 0.176, height: 0.024 } },
      { key: 'item_2_price', label: '품목 2 단가', value: '500', status: 'extracted', confidence: 0.93, boundingBox: { x: 0.765, y: 0.226, width: 0.176, height: 0.024 } },
    ],
  },
  {
    id: 'doc-004',
    name: '발주서_2026-03-27_소모품.pdf',
    type: '발주서',
    status: 'review_done',
    uploadedAt: '2026-03-29T16:20:00',
    processedAt: '2026-03-29T16:20:09',
    processingTime: '9초',
    reviewedBy: '이검수',
    fields: [
      { key: 'order_no', label: '발주번호', value: 'PO-2026-0327', status: 'extracted', confidence: 0.96, boundingBox: { x: 0.282, y: 0.097, width: 0.195, height: 0.024 } },
      { key: 'vendor', label: '공급업체', value: '(주)사무용품점', status: 'extracted', confidence: 0.93, boundingBox: { x: 0.732, y: 0.097, width: 0.195, height: 0.024 } },
      { key: 'vendor_contact', label: '담당자', value: '정부장', status: 'extracted', confidence: 0.90, boundingBox: { x: 0.732, y: 0.114, width: 0.195, height: 0.024 } },
      { key: 'order_date', label: '발주일', value: '2026-03-27', status: 'extracted', confidence: 0.99, boundingBox: { x: 0.282, y: 0.114, width: 0.195, height: 0.024 } },
      { key: 'delivery_date', label: '납기일', value: '2026-04-05', status: 'extracted', confidence: 0.94, boundingBox: { x: 0.282, y: 0.131, width: 0.195, height: 0.024 } },
      { key: 'item_1_name', label: '품목 1 명칭', value: 'A4 복사지 (500매)', status: 'extracted', confidence: 0.95, boundingBox: { x: 0.235, y: 0.202, width: 0.176, height: 0.024 } },
      { key: 'item_1_qty', label: '품목 1 수량', value: '20', originalValue: '2O', status: 'edited', reviewNote: '영문자 O와 숫자 0 혼동으로 "2O"로 추출됨 → "20"으로 수정', confidence: 0.52, boundingBox: { x: 0.588, y: 0.202, width: 0.176, height: 0.024 } },
      { key: 'item_1_price', label: '품목 1 단가', value: '4,000', status: 'extracted', confidence: 0.95, boundingBox: { x: 0.765, y: 0.202, width: 0.176, height: 0.024 } },
      { key: 'item_2_name', label: '품목 2 명칭', value: '볼펜 (12개입)', status: 'extracted', confidence: 0.92, boundingBox: { x: 0.235, y: 0.226, width: 0.176, height: 0.024 } },
      { key: 'item_2_qty', label: '품목 2 수량', value: '10', status: 'extracted', confidence: 0.97, boundingBox: { x: 0.588, y: 0.226, width: 0.176, height: 0.024 } },
      { key: 'item_2_price', label: '품목 2 단가', value: '3,500', status: 'extracted', confidence: 0.94, boundingBox: { x: 0.765, y: 0.226, width: 0.176, height: 0.024 } },
      { key: 'total_amount', label: '합계금액', value: '120,000', status: 'confirmed', confidence: 0.97 },
    ],
  },
  {
    id: 'doc-005',
    name: '납품서_2026-03-30_긴급배송.pdf',
    type: '납품서',
    status: 'pending',
    uploadedAt: '2026-03-30T10:05:00',
    fields: [
      { key: 'delivery_no', label: '납품번호', value: 'DN-20260330-417', status: 'extracted', confidence: 0.97 },
      { key: 'supplier', label: '납품업체', value: '(주)빠른배송', status: 'extracted', confidence: 0.95 },
      { key: 'delivery_date', label: '납품일', value: '2026-03-30', status: 'extracted', confidence: 0.99 },
      { key: 'recipient', label: '수취인', value: '(주)샘플코리아 구매팀', status: 'extracted', confidence: 0.93 },
      { key: 'item_1_name', label: '품목 1', value: '노트북', status: 'extracted', confidence: 0.96 },
      { key: 'item_1_qty', label: '품목 1 수량', value: '10', status: 'extracted', confidence: 0.95 },
      { key: 'item_2_name', label: '품목 2', value: '키보드', status: 'extracted', confidence: 0.95 },
      { key: 'item_2_qty', label: '품목 2 수량', value: '10', status: 'extracted', confidence: 0.94 },
      { key: 'item_3_name', label: '품목 3', value: '마우스', status: 'extracted', confidence: 0.94 },
      { key: 'item_3_qty', label: '품목 3 수량', value: '10', status: 'extracted', confidence: 0.93 },
      { key: 'total_qty', label: '총 수량', value: '30', status: 'extracted', confidence: 0.97 },
      { key: 'total_amount', label: '납품금액', value: '8,450,000', status: 'review_needed', reviewNote: '단가 × 수량 합산값과 불일치', confidence: 0.67 },
    ],
  },
  {
    id: 'doc-006',
    name: '납품서_2026-03-29_정기배송.pdf',
    type: '납품서',
    status: 'submitted',
    uploadedAt: '2026-03-29T14:00:00',
    processedAt: '2026-03-29T14:00:07',
    processingTime: '7초',
    reviewedBy: '박검수',
    fields: [
      { key: 'delivery_no', label: '납품번호', value: 'DN-2026-0329', status: 'extracted', confidence: 0.97, boundingBox: { x: 0.367, y: 0.097, width: 0.560, height: 0.024 } },
      { key: 'supplier', label: '납품업체', value: '(주)물류센터', status: 'extracted', confidence: 0.96, boundingBox: { x: 0.367, y: 0.114, width: 0.560, height: 0.024 } },
      { key: 'delivery_date', label: '납품일', value: '2026-03-29', status: 'extracted', confidence: 0.99, boundingBox: { x: 0.367, y: 0.131, width: 0.560, height: 0.024 } },
      { key: 'recipient', label: '수취인', value: '(주)테스트기업 구매팀', status: 'extracted', confidence: 0.94, boundingBox: { x: 0.367, y: 0.147, width: 0.560, height: 0.024 } },
      { key: 'item_1_name', label: '품목 1', value: '복합기', status: 'extracted', confidence: 0.97, boundingBox: { x: 0.059, y: 0.219, width: 0.221, height: 0.024 } },
      { key: 'item_1_qty', label: '품목 1 수량', value: '50', status: 'extracted', confidence: 0.95, boundingBox: { x: 0.500, y: 0.219, width: 0.221, height: 0.024 } },
      { key: 'item_2_name', label: '품목 2', value: '파쇄기', status: 'extracted', confidence: 0.96, boundingBox: { x: 0.059, y: 0.244, width: 0.221, height: 0.024 } },
      { key: 'item_2_qty', label: '품목 2 수량', value: '50', status: 'extracted', confidence: 0.95, boundingBox: { x: 0.500, y: 0.244, width: 0.221, height: 0.024 } },
      { key: 'item_3_name', label: '품목 3', value: '화이트보드', status: 'extracted', confidence: 0.94, boundingBox: { x: 0.059, y: 0.269, width: 0.221, height: 0.024 } },
      { key: 'item_3_qty', label: '품목 3 수량', value: '50', status: 'extracted', confidence: 0.93, boundingBox: { x: 0.500, y: 0.269, width: 0.221, height: 0.024 } },
      { key: 'total_qty', label: '총 수량', value: '150', status: 'confirmed', confidence: 0.98, boundingBox: { x: 0.500, y: 0.293, width: 0.221, height: 0.024 } },
      { key: 'total_amount', label: '납품금액', value: '3,750,000', status: 'confirmed', confidence: 0.97, boundingBox: { x: 0.721, y: 0.293, width: 0.221, height: 0.024 } },
    ],
  },
  {
    id: 'doc-007',
    name: '거래명세서_2026-03-28_외주용역.pdf',
    type: '거래명세서',
    status: 'review_needed',
    uploadedAt: '2026-03-30T09:55:00',
    processedAt: '2026-03-30T09:55:10',
    processingTime: '10초',
    fields: [
      { key: 'statement_no', label: '명세서번호', value: 'ST-2026-0328', status: 'extracted', confidence: 0.91, boundingBox: { x: 0.514, y: 0.097, width: 0.413, height: 0.024 } },
      { key: 'client_name', label: '거래처명', value: '(주)외주기업 또는 (주)외주기술', status: 'review_needed', reviewNote: '인감 도장이 텍스트를 가려 거래처명 인식 불확실 (두 후보 모두 가능성 있음)', confidence: 0.58, boundingBox: { x: 0.514, y: 0.114, width: 0.413, height: 0.024 } },
      { key: 'period', label: '거래기간', value: '2026-03-01 ~ 2026-03-28', status: 'extracted', confidence: 0.94, boundingBox: { x: 0.514, y: 0.131, width: 0.413, height: 0.024 } },
      { key: 'service_desc', label: '용역 내용', value: '소프트웨어 개발 용역', status: 'extracted', confidence: 0.89, boundingBox: { x: 0.514, y: 0.147, width: 0.413, height: 0.024 } },
      { key: 'item_1_name', label: '항목', value: '용역비', status: 'extracted', confidence: 0.92, boundingBox: { x: 0.059, y: 0.219, width: 0.294, height: 0.024 } },
      { key: 'amount', label: '금액', value: '5,000,000', status: 'extracted', confidence: 0.93, boundingBox: { x: 0.647, y: 0.219, width: 0.294, height: 0.024 } },
    ],
  },
  {
    id: 'doc-008',
    name: '거래명세서_손상파일_재시도필요.pdf',
    type: '거래명세서',
    status: 'failed',
    uploadedAt: '2026-03-30T08:30:00',
    fields: [],
  },
]

// 업로드된 임시 문서 저장소 (클라이언트 세션 유지)
const uploadedDocs = new Map<string, Document>()

// mock 문서 포함 모든 문서의 런타임 오버라이드 (필드 편집, 상태 변경)
const documentOverrides = new Map<string, Partial<Document>>()

export function addUploadedDoc(doc: Document) {
  uploadedDocs.set(doc.id, doc)
}

export function updateUploadedDoc(id: string, updates: Partial<Document>) {
  const existing = uploadedDocs.get(id)
  if (existing) uploadedDocs.set(id, { ...existing, ...updates })
}

export function saveDocumentFields(id: string, fields: import('./types').Field[]) {
  documentOverrides.set(id, { ...documentOverrides.get(id), fields })
  const existing = uploadedDocs.get(id)
  if (existing) uploadedDocs.set(id, { ...existing, fields })
}

export function setDocumentStatus(id: string, status: import('./types').DocumentStatus) {
  documentOverrides.set(id, { ...documentOverrides.get(id), status })
  const existing = uploadedDocs.get(id)
  if (existing) uploadedDocs.set(id, { ...existing, status })
}

export function getAllDocuments(): Document[] {
  const uploadedList = Array.from(uploadedDocs.values())
  const uploadedIds = new Set(uploadedList.map((d) => d.id))
  const mockWithOverrides = MOCK_DOCUMENTS.map((d) => {
    const override = documentOverrides.get(d.id)
    return override ? { ...d, ...override } : d
  })
  return [...uploadedList, ...mockWithOverrides.filter((d) => !uploadedIds.has(d.id))]
}

export function getDocument(id: string): Document | undefined {
  const base = uploadedDocs.get(id) ?? MOCK_DOCUMENTS.find((d) => d.id === id)
  if (!base) return undefined
  const override = documentOverrides.get(id)
  return override ? { ...base, ...override } : base
}

export function getPrevNextIds(id: string): { prev: string | null; next: string | null } {
  const all = getAllDocuments()
  const idx = all.findIndex((d) => d.id === id)
  return {
    prev: idx > 0 ? all[idx - 1].id : null,
    next: idx < all.length - 1 ? all[idx + 1].id : null,
  }
}
