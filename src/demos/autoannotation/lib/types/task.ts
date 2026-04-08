export type TaskStatus =
  | 'pending'    // 검토 대기
  | 'ai_done'    // AI 처리 완료
  | 'revision'   // 수정 필요
  | 'rejected'   // 반려됨
  | 'approved'   // 승인 완료

export type RejectionReason =
  | 'label_error'      // 라벨 오류
  | 'boundary_error'   // 경계 오류
  | 'missing_object'   // 누락된 객체
  | 'false_positive'   // 오탐
  | 'other'            // 기타

export const REJECTION_REASON_LABELS: Record<RejectionReason, string> = {
  label_error:     '라벨 오류',
  boundary_error:  '경계 오류',
  missing_object:  '누락된 객체',
  false_positive:  '오탐',
  other:           '기타',
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  pending:   '검토 대기',
  ai_done:   'AI 처리 완료',
  revision:  '수정 필요',
  rejected:  '반려됨',
  approved:  '승인 완료',
}

export interface Task {
  id: string
  filename: string
  imageUrl: string
  thumbnailUrl: string
  status: TaskStatus
  confidence: number        // 0~100, 어노테이션 평균 신뢰도
  annotationCount: number   // 객체 수
  revisionCount: number
  assignee?: string
  processedAt: string       // ISO 8601
  rejectionReasons?: RejectionReason[]
  rejectionNote?: string
  approvedAt?: string
  approvedBy?: string
  reviewDurationSeconds?: number
}
