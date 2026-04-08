import type { Task } from '@aa/lib/types/task'

const ISIC_FULL = (id: string) => `https://isic-archive.s3.amazonaws.com/images/${id}.jpg`
const ISIC_THUMB = (id: string) => `https://isic-archive.s3.amazonaws.com/thumbnails/${id}_thumbnail.jpg`

function isic(id: string) {
  return { imageUrl: ISIC_FULL(id), thumbnailUrl: ISIC_THUMB(id) }
}

const h = (hours: number) => new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()
const m = (mins: number)  => new Date(Date.now() - mins  * 60 * 1000).toISOString()

export const MOCK_TASKS: Task[] = [
  // ── 검토 대기 (pending / ai_done) ──────────────────────────────────
  {
    id: 'task-001', filename: 'IMG_20240312_004521.jpg',
    ...isic('ISIC_0024310'),
    status: 'pending', confidence: 94.2, annotationCount: 3,
    revisionCount: 0, assignee: '김수연', processedAt: m(13),
  },
  {
    id: 'task-003', filename: 'IMG_20240312_002130.jpg',
    ...isic('ISIC_0024306'),
    status: 'pending', confidence: 88.5, annotationCount: 5,
    revisionCount: 0, assignee: '김수연', processedAt: m(45),
  },
  {
    id: 'task-004', filename: 'IMG_20240312_001005.jpg',
    ...isic('ISIC_0000000'),
    status: 'pending', confidence: 96.1, annotationCount: 2,
    revisionCount: 0, processedAt: h(1),
  },
  {
    id: 'task-005', filename: 'IMG_20240311_223412.jpg',
    ...isic('ISIC_0000001'),
    status: 'pending', confidence: 82.3, annotationCount: 4,
    revisionCount: 0, processedAt: h(2),
  },
  {
    id: 'task-006', filename: 'IMG_20240311_215030.jpg',
    ...isic('ISIC_0000002'),
    status: 'ai_done', confidence: 87.4, annotationCount: 2,
    revisionCount: 0, processedAt: h(3),
  },
  {
    id: 'task-007', filename: 'IMG_20240311_210155.jpg',
    ...isic('ISIC_0000003'),
    status: 'ai_done', confidence: 63.1, annotationCount: 3,
    revisionCount: 0, processedAt: h(4),
  },
  {
    id: 'task-008', filename: 'IMG_20240311_201840.jpg',
    ...isic('ISIC_0000004'),
    status: 'ai_done', confidence: 91.7, annotationCount: 1,
    revisionCount: 0, processedAt: h(5),
  },

  // ── 수정 필요 / 반려 ───────────────────────────────────────────────
  {
    id: 'task-002', filename: 'IMG_20240312_003847.jpg',
    ...isic('ISIC_0024370'),
    status: 'revision', confidence: 71.8, annotationCount: 1,
    revisionCount: 2, assignee: '이지훈', processedAt: m(28),
    rejectionReasons: ['boundary_error'],
  },
  {
    id: 'task-009', filename: 'IMG_20240311_193022.jpg',
    ...isic('ISIC_0000005'),
    status: 'rejected', confidence: 55.3, annotationCount: 2,
    revisionCount: 3, assignee: '박민준', processedAt: h(6),
    rejectionReasons: ['label_error', 'missing_object'],
    rejectionNote: '라벨이 잘못 지정되어 있고 우측 하단 병변이 누락됨',
  },
  {
    id: 'task-010', filename: 'IMG_20240311_184510.jpg',
    ...isic('ISIC_0000006'),
    status: 'rejected', confidence: 68.9, annotationCount: 4,
    revisionCount: 1, assignee: '이지훈', processedAt: h(7),
    rejectionReasons: ['false_positive'],
  },

  // ── 승인 완료 ──────────────────────────────────────────────────────
  {
    id: 'task-011', filename: 'IMG_20240311_175634.jpg',
    ...isic('ISIC_0000007'),
    status: 'approved', confidence: 95.8, annotationCount: 2,
    revisionCount: 0, assignee: '김수연', processedAt: h(8),
    approvedAt: h(7.5), approvedBy: '김수연', reviewDurationSeconds: 145,
  },
  {
    id: 'task-012', filename: 'IMG_20240311_170201.jpg',
    ...isic('ISIC_0000008'),
    status: 'approved', confidence: 89.2, annotationCount: 3,
    revisionCount: 1, assignee: '박민준', processedAt: h(10),
    approvedAt: h(9), approvedBy: '박민준', reviewDurationSeconds: 320,
  },
  {
    id: 'task-013', filename: 'IMG_20240311_161845.jpg',
    ...isic('ISIC_0000009'),
    status: 'approved', confidence: 97.3, annotationCount: 1,
    revisionCount: 0, processedAt: h(12),
    approvedAt: h(11.5), approvedBy: '이지훈', reviewDurationSeconds: 88,
  },
  {
    id: 'task-014', filename: 'IMG_20240311_153020.jpg',
    ...isic('ISIC_0000010'),
    status: 'approved', confidence: 93.4, annotationCount: 2,
    revisionCount: 0, assignee: '김수연', processedAt: h(14),
    approvedAt: h(13.5), approvedBy: '김수연', reviewDurationSeconds: 112,
  },
  {
    id: 'task-015', filename: 'IMG_20240311_144410.jpg',
    ...isic('ISIC_0000011'),
    status: 'approved', confidence: 78.6, annotationCount: 3,
    revisionCount: 1, assignee: '이지훈', processedAt: h(16),
    approvedAt: h(15), approvedBy: '이지훈', reviewDurationSeconds: 430,
  },
  {
    id: 'task-016', filename: 'IMG_20240311_135801.jpg',
    ...isic('ISIC_0000012'),
    status: 'approved', confidence: 91.1, annotationCount: 1,
    revisionCount: 0, processedAt: h(18),
    approvedAt: h(17.5), approvedBy: '박민준', reviewDurationSeconds: 67,
  },
  {
    id: 'task-017', filename: 'IMG_20240311_131250.jpg',
    ...isic('ISIC_0000013'),
    status: 'approved', confidence: 85.7, annotationCount: 4,
    revisionCount: 0, assignee: '박민준', processedAt: h(20),
    approvedAt: h(19), approvedBy: '박민준', reviewDurationSeconds: 198,
  },
  {
    id: 'task-018', filename: 'IMG_20240311_122633.jpg',
    ...isic('ISIC_0000014'),
    status: 'approved', confidence: 96.9, annotationCount: 2,
    revisionCount: 0, assignee: '김수연', processedAt: h(22),
    approvedAt: h(21.5), approvedBy: '김수연', reviewDurationSeconds: 95,
  },
  {
    id: 'task-019', filename: 'IMG_20240311_114015.jpg',
    ...isic('ISIC_0000015'),
    status: 'approved', confidence: 72.4, annotationCount: 3,
    revisionCount: 2, assignee: '이지훈', processedAt: h(24),
    approvedAt: h(23), approvedBy: '이지훈', reviewDurationSeconds: 512,
  },
  {
    id: 'task-020', filename: 'IMG_20240311_105442.jpg',
    ...isic('ISIC_0000016'),
    status: 'approved', confidence: 88.3, annotationCount: 2,
    revisionCount: 0, processedAt: h(26),
    approvedAt: h(25.5), approvedBy: '박민준', reviewDurationSeconds: 143,
  },
  {
    id: 'task-021', filename: 'IMG_20240311_100830.jpg',
    ...isic('ISIC_0000017'),
    status: 'approved', confidence: 94.6, annotationCount: 1,
    revisionCount: 0, assignee: '김수연', processedAt: h(28),
    approvedAt: h(27.5), approvedBy: '김수연', reviewDurationSeconds: 78,
  },
  {
    id: 'task-022', filename: 'IMG_20240311_092215.jpg',
    ...isic('ISIC_0000018'),
    status: 'approved', confidence: 81.2, annotationCount: 3,
    revisionCount: 1, assignee: '박민준', processedAt: h(30),
    approvedAt: h(29), approvedBy: '박민준', reviewDurationSeconds: 367,
  },
  {
    id: 'task-023', filename: 'IMG_20240311_083601.jpg',
    ...isic('ISIC_0000019'),
    status: 'approved', confidence: 90.5, annotationCount: 2,
    revisionCount: 0, processedAt: h(32),
    approvedAt: h(31.5), approvedBy: '이지훈', reviewDurationSeconds: 124,
  },
  {
    id: 'task-024', filename: 'IMG_20240311_074948.jpg',
    ...isic('ISIC_0000020'),
    status: 'approved', confidence: 76.8, annotationCount: 4,
    revisionCount: 1, assignee: '이지훈', processedAt: h(34),
    approvedAt: h(33), approvedBy: '이지훈', reviewDurationSeconds: 445,
  },
  {
    id: 'task-025', filename: 'IMG_20240311_070335.jpg',
    ...isic('ISIC_0000021'),
    status: 'approved', confidence: 98.1, annotationCount: 1,
    revisionCount: 0, assignee: '김수연', processedAt: h(36),
    approvedAt: h(35.5), approvedBy: '김수연', reviewDurationSeconds: 55,
  },
  {
    id: 'task-026', filename: 'IMG_20240311_061722.jpg',
    ...isic('ISIC_0000022'),
    status: 'approved', confidence: 87.9, annotationCount: 2,
    revisionCount: 0, processedAt: h(38),
    approvedAt: h(37.5), approvedBy: '박민준', reviewDurationSeconds: 160,
  },
  {
    id: 'task-027', filename: 'IMG_20240311_053108.jpg',
    ...isic('ISIC_0000023'),
    status: 'approved', confidence: 92.3, annotationCount: 3,
    revisionCount: 0, assignee: '박민준', processedAt: h(40),
    approvedAt: h(39), approvedBy: '박민준', reviewDurationSeconds: 210,
  },
  {
    id: 'task-028', filename: 'IMG_20240311_044455.jpg',
    ...isic('ISIC_0000024'),
    status: 'approved', confidence: 69.7, annotationCount: 2,
    revisionCount: 2, assignee: '이지훈', processedAt: h(42),
    approvedAt: h(41), approvedBy: '이지훈', reviewDurationSeconds: 580,
  },
  {
    id: 'task-029', filename: 'IMG_20240311_035842.jpg',
    ...isic('ISIC_0000025'),
    status: 'approved', confidence: 95.2, annotationCount: 1,
    revisionCount: 0, processedAt: h(44),
    approvedAt: h(43.5), approvedBy: '김수연', reviewDurationSeconds: 82,
  },
  {
    id: 'task-030', filename: 'IMG_20240311_031229.jpg',
    ...isic('ISIC_0000026'),
    status: 'approved', confidence: 83.6, annotationCount: 3,
    revisionCount: 1, assignee: '김수연', processedAt: h(46),
    approvedAt: h(45), approvedBy: '김수연', reviewDurationSeconds: 295,
  },
]

export function getTaskById(id: string): Task | null {
  return MOCK_TASKS.find(t => t.id === id) ?? null
}

export function getTasksByStatus(status: Task['status']): Task[] {
  return MOCK_TASKS.filter(t => t.status === status)
}

export function getAIResultTasks(): Task[] {
  return MOCK_TASKS.filter(t => t.status === 'ai_done' || t.status === 'pending')
}
