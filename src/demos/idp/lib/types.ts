export type DocumentStatus = 'pending' | 'processing' | 'review_needed' | 'review_done' | 'submitted' | 'failed'
export type DocumentType = '세금계산서' | '발주서' | '납품서' | '거래명세서'
export type FieldStatus = 'extracted' | 'review_needed' | 'edited' | 'confirmed'

export interface BoundingBox {
  x: number      // 문서 이미지 내 비율 (0~1)
  y: number
  width: number
  height: number
}

export interface Field {
  key: string
  label: string
  value: string
  originalValue?: string   // AI 최초 추출값 (수정된 경우)
  status: FieldStatus
  reviewNote?: string
  confidence?: number
  boundingBox?: BoundingBox
}

export interface Document {
  id: string
  name: string
  type: DocumentType
  status: DocumentStatus
  uploadedAt: string
  processedAt?: string
  reviewedBy?: string
  processingTime?: string
  fields: Field[]
}
