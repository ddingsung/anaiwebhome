// 현재 시각 기준 N분 후 시간 문자열 반환 (HH:MM)
function etaFromNow(mins: number): string {
  const d = new Date(Date.now() + mins * 60000);
  return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
}

// 진행률 기준 ETA 계산 (총 하차 시간 = 60분 기준)
function calcEta(progress: number, totalMins = 60): string {
  const remainingMins = Math.round((100 - progress) / 100 * totalMins);
  return etaFromNow(remainingMins);
}

import type {
  Vehicle,
  Dock,
  ConveyorNode,
  ConveyorEdge,
  AiAction,
  EquipmentAlert,
  KpiSnapshot,
  OpsEvent,
  PolicyConfig,
} from '@sl/types';

// ─── 차량 더미 데이터 ─────────────────────────────────────────

export const SEED_VEHICLES: Vehicle[] = [
  {
    id: 'K-1234',
    licensePlate: '12가 1234',
    type: 'truck',
    cargoType: 'frozen',
    status: 'waiting',
    arrivalTime: etaFromNow(-47),
    waitingMinutes: 47,
    priority: 'urgent',
    assignedDockId: null,
    eta: null,
  },
  {
    id: 'K-5678',
    licensePlate: '34나 5678',
    type: 'truck',
    cargoType: 'ambient',
    status: 'waiting',
    arrivalTime: etaFromNow(-31),
    waitingMinutes: 31,
    priority: 'high',
    assignedDockId: null,
    eta: null,
  },
  {
    id: 'K-9012',
    licensePlate: '56다 9012',
    type: 'truck',
    cargoType: 'bulk',
    status: 'unloading',
    arrivalTime: etaFromNow(-8),
    waitingMinutes: 8,
    priority: 'normal',
    assignedDockId: 'D7',
    eta: etaFromNow(53),
  },
  {
    id: 'K-3456',
    licensePlate: '78라 3456',
    type: 'van',
    cargoType: 'hazmat',
    status: 'waiting',
    arrivalTime: etaFromNow(-5),
    waitingMinutes: 5,
    priority: 'urgent',
    assignedDockId: null,
    eta: null,
  },
  {
    id: 'K-7890',
    licensePlate: '90마 7890',
    type: 'truck',
    cargoType: 'ambient',
    status: 'docking',
    arrivalTime: etaFromNow(-12),
    waitingMinutes: 12,
    priority: 'normal',
    assignedDockId: 'D2',
    eta: etaFromNow(50),
  },
  {
    id: 'K-2345',
    licensePlate: '11바 2345',
    type: 'truck',
    cargoType: 'ambient',
    status: 'waiting',
    arrivalTime: etaFromNow(-2),
    waitingMinutes: 2,
    priority: 'normal',
    assignedDockId: null,
    eta: null,
  },
  {
    id: 'K-6789',
    licensePlate: '22사 6789',
    type: 'truck',
    cargoType: 'frozen',
    status: 'approaching',
    arrivalTime: etaFromNow(15),
    waitingMinutes: 0,
    priority: 'high',
    assignedDockId: null,
    eta: etaFromNow(15),
  },
  {
    id: 'K-0123',
    licensePlate: '33아 0123',
    type: 'truck',
    cargoType: 'ambient',
    status: 'unloading',
    arrivalTime: etaFromNow(-60),
    waitingMinutes: 0,
    priority: 'normal',
    assignedDockId: 'D1',
    eta: etaFromNow(20),
  },
];

// ─── 도크 더미 데이터 ─────────────────────────────────────────

export const SEED_DOCKS: Dock[] = [
  {
    id: 'D1',
    name: 'Dock 1',
    status: 'operating',
    currentVehicleId: 'K-0123',
    equipmentTypes: ['standard'],
    utilizationRate: 85,
    unloadingProgress: 60,
    estimatedCompletionTime: calcEta(60),   // ~24분 후
  },
  {
    id: 'D2',
    name: 'Dock 2',
    status: 'operating',
    currentVehicleId: 'K-7890',
    equipmentTypes: ['standard', 'bulk'],
    utilizationRate: 91,
    unloadingProgress: 30,
    estimatedCompletionTime: calcEta(30, 90), // ~63분 후
  },
  {
    id: 'D3',
    name: 'Dock 3',
    status: 'idle',
    currentVehicleId: null,
    equipmentTypes: ['frozen', 'standard'],
    utilizationRate: 0,
    unloadingProgress: 0,
    estimatedCompletionTime: null,
  },
  {
    id: 'D4',
    name: 'Dock 4',
    status: 'congested',
    currentVehicleId: 'K-5678',
    equipmentTypes: ['standard'],
    utilizationRate: 100,
    unloadingProgress: 10,
    estimatedCompletionTime: calcEta(10, 90), // ~81분 후 (혼잡)
  },
  {
    id: 'D5',
    name: 'Dock 5',
    status: 'idle',
    currentVehicleId: null,
    equipmentTypes: ['standard'],
    utilizationRate: 0,
    unloadingProgress: 0,
    estimatedCompletionTime: null,
  },
  {
    id: 'D6',
    name: 'Dock 6',
    status: 'maintenance',
    currentVehicleId: null,
    equipmentTypes: ['standard'],
    utilizationRate: 0,
    unloadingProgress: 0,
    estimatedCompletionTime: null,
  },
  {
    id: 'D7',
    name: 'Dock 7',
    status: 'operating',
    currentVehicleId: 'K-9012',
    equipmentTypes: ['bulk', 'standard'],
    utilizationRate: 72,
    unloadingProgress: 45,
    estimatedCompletionTime: calcEta(45, 75), // ~41분 후
  },
  {
    id: 'D8',
    name: 'Dock 8',
    status: 'error',
    currentVehicleId: null,
    equipmentTypes: ['standard'],
    utilizationRate: 0,
    unloadingProgress: 0,
    estimatedCompletionTime: null,
  },
  {
    id: 'D9',
    name: 'Dock 9',
    status: 'idle',
    currentVehicleId: null,
    equipmentTypes: ['frozen'],
    utilizationRate: 0,
    unloadingProgress: 0,
    estimatedCompletionTime: null,
  },
];

// ─── 컨베이어 노드 더미 데이터 ───────────────────────────────

export const SEED_CONVEYOR_NODES: ConveyorNode[] = [
  { id: 'DOCK-IN-1', type: 'zone', label: '입고 구역 A', throughput: 320, designThroughput: 400, utilizationRate: 80, backlog: 12, status: 'warning', position: { x: 60, y: 80 } },
  { id: 'DOCK-IN-2', type: 'zone', label: '입고 구역 B', throughput: 290, designThroughput: 400, utilizationRate: 72, backlog: 8, status: 'normal', position: { x: 60, y: 180 } },
  { id: 'SORT-A', type: 'sorter', label: 'Sorter A', throughput: 380, designThroughput: 500, utilizationRate: 76, backlog: 15, status: 'normal', position: { x: 200, y: 80 } },
  { id: 'SORT-B', type: 'sorter', label: 'Sorter B', throughput: 210, designThroughput: 500, utilizationRate: 42, backlog: 5, status: 'warning', position: { x: 200, y: 180 } },
  { id: 'MERGE-1', type: 'merge', label: 'Merge 1', throughput: 580, designThroughput: 750, utilizationRate: 94, backlog: 42, status: 'critical', position: { x: 340, y: 130 } },
  { id: 'BUFFER-02', type: 'buffer', label: 'Buffer 02', throughput: 480, designThroughput: 700, utilizationRate: 68, backlog: 28, status: 'warning', position: { x: 460, y: 130 } },
  { id: 'DIVERT-01', type: 'diverter', label: 'Diverter 01', throughput: 440, designThroughput: 600, utilizationRate: 73, backlog: 10, status: 'normal', position: { x: 580, y: 130 } },
  { id: 'ZONE-A', type: 'zone', label: '출고 구역 A', throughput: 220, designThroughput: 300, utilizationRate: 73, backlog: 5, status: 'normal', position: { x: 700, y: 80 } },
  { id: 'ZONE-B', type: 'zone', label: '출고 구역 B', throughput: 200, designThroughput: 300, utilizationRate: 66, backlog: 4, status: 'normal', position: { x: 700, y: 180 } },
];

export const SEED_CONVEYOR_EDGES: ConveyorEdge[] = [
  { id: 'e1', source: 'DOCK-IN-1', target: 'SORT-A', active: true, isAlternatePath: false },
  { id: 'e2', source: 'DOCK-IN-2', target: 'SORT-B', active: true, isAlternatePath: false },
  { id: 'e3', source: 'SORT-A', target: 'MERGE-1', active: true, isAlternatePath: false },
  { id: 'e4', source: 'SORT-B', target: 'MERGE-1', active: true, isAlternatePath: false },
  { id: 'e5', source: 'MERGE-1', target: 'BUFFER-02', active: true, isAlternatePath: false },
  { id: 'e6', source: 'BUFFER-02', target: 'DIVERT-01', active: true, isAlternatePath: false },
  { id: 'e7', source: 'DIVERT-01', target: 'ZONE-A', active: true, isAlternatePath: false },
  { id: 'e8', source: 'DIVERT-01', target: 'ZONE-B', active: true, isAlternatePath: false },
  { id: 'e9', source: 'SORT-B', target: 'BUFFER-02', active: false, isAlternatePath: true },
];

// ─── AI 액션 더미 데이터 ─────────────────────────────────────

export const SEED_AI_ACTIONS: AiAction[] = [
  {
    id: 'ACT-2024-0847',
    type: 'dock_assignment',
    priority: 'urgent',
    status: 'pending',
    title: 'K-1234 → Dock 3 배정',
    description: '냉동화물 차량 K-1234를 냉동 설비 보유 Dock 3에 즉시 배정',
    createdAt: '09:53',
    affectedDockId: 'D3',
    affectedVehicleId: 'K-1234',
    evidence: [
      { type: 'metric', label: 'Dock 3 상태', value: '12분째 비어있음', significance: 'primary' },
      { type: 'metric', label: 'K-1234 화물 유형', value: '냉동 (-18°C)', significance: 'primary' },
      { type: 'threshold', label: '대기 시간', value: '47분 (임계값 20분 초과)', significance: 'primary' },
      { type: 'historical', label: 'Dock 3 냉동 장비', value: '냉동 전용 장비 보유 확인', significance: 'supporting' },
    ],
    expectedEffects: [
      { metric: '대기 시간', before: 47, after: 8, unit: '분', confidence: 0.94 },
      { metric: '도크 가동률', before: 78, after: 82, unit: '%', confidence: 0.87 },
    ],
    riskLevel: 'low',
  },
  {
    id: 'ACT-2024-0848',
    type: 'conveyor_bypass',
    priority: 'high',
    status: 'pending',
    title: 'MERGE-1 우회 경로 활성화',
    description: 'SORT-B → BUFFER-03 → DIVERT-02 우회 경로로 MERGE-1 부하 분산',
    createdAt: '09:55',
    affectedNodeId: 'MERGE-1',
    evidence: [
      { type: 'metric', label: 'MERGE-1 처리량', value: '94% (설계 대비)', significance: 'primary' },
      { type: 'threshold', label: '백로그', value: '42박스 (임계값 20 초과)', significance: 'primary' },
      { type: 'prediction', label: '포화 예측', value: '15분 이내 처리 불가 상태', significance: 'primary' },
      { type: 'historical', label: '우회 경로 실적', value: '과거 3회 적용 시 평균 8분 복구', significance: 'supporting' },
    ],
    expectedEffects: [
      { metric: '처리량 회복', before: 580, after: 720, unit: '박스/h', confidence: 0.89 },
      { metric: '백로그 해소', before: 42, after: 8, unit: '박스', confidence: 0.82 },
    ],
    riskLevel: 'low',
  },
  {
    id: 'ACT-2024-0849',
    type: 'equipment_maintenance',
    priority: 'normal',
    status: 'pending',
    title: 'Sort-B 점검 예약',
    description: 'Sort-B 진동 이상 징후 감지 — 다음 유휴 시간대 예방 점검 예약',
    createdAt: '09:57',
    affectedNodeId: 'SORT-B',
    evidence: [
      { type: 'metric', label: 'Sort-B 진동값', value: '3.2mm/s (경고 기준 2.5 초과)', significance: 'primary' },
      { type: 'prediction', label: '고장 예측', value: '48시간 내 센서 오류 가능성 68%', significance: 'primary' },
      { type: 'historical', label: '유사 패턴', value: '지난해 동일 이상 후 3일 내 가동 중단 이력', significance: 'supporting' },
    ],
    expectedEffects: [
      { metric: '고장 위험', before: 68, after: 8, unit: '%', confidence: 0.76 },
    ],
    riskLevel: 'low',
  },
  {
    id: 'ACT-2024-0832',
    type: 'dock_assignment',
    priority: 'high',
    status: 'completed',
    title: 'K-8821 → Dock 1 배정',
    description: '입고 긴급 화물 K-8821을 Dock 1에 배정 완료',
    createdAt: '08:41',
    evidence: [],
    expectedEffects: [
      { metric: '대기 시간', before: 35, after: 6, unit: '분', confidence: 0.91 },
    ],
    actualEffects: [
      { metric: '대기 시간', before: 35, after: 7, unit: '분', measuredAt: '08:53' },
    ],
    riskLevel: 'low',
  },
  {
    id: 'ACT-2024-0821',
    type: 'conveyor_bypass',
    priority: 'urgent',
    status: 'completed',
    title: 'SORT-A 우회 경로 활성화',
    description: '오전 피크 시간대 SORT-A 과부하 대응 우회 경로 적용',
    createdAt: '08:05',
    evidence: [],
    expectedEffects: [
      { metric: '처리량', before: 890, after: 1100, unit: '박스/h', confidence: 0.85 },
    ],
    actualEffects: [
      { metric: '처리량', before: 890, after: 1080, unit: '박스/h', measuredAt: '08:20' },
    ],
    riskLevel: 'low',
  },
];

// ─── 설비 알람 더미 데이터 ───────────────────────────────────

export const SEED_ALERTS: EquipmentAlert[] = [
  {
    id: 'ALT-001',
    equipmentId: 'CONV-03',
    equipmentLabel: 'Conveyor 03',
    alertType: 'vibration',
    severity: 'warning',
    message: '진동값 3.2mm/s 감지 — 경고 기준(2.5) 초과',
    affectedLines: ['L3', 'L4'],
    detectedAt: '09:41',
    operationalImpact: 'medium',
    status: 'active',
  },
  {
    id: 'ALT-002',
    equipmentId: 'SORT-B',
    equipmentLabel: 'Sorter B',
    alertType: 'sensor_error',
    severity: 'warning',
    message: '센서 #3 응답 지연 210ms — 정상 기준(50ms) 초과',
    affectedLines: ['L2'],
    detectedAt: '09:52',
    operationalImpact: 'medium',
    status: 'active',
  },
  {
    id: 'ALT-003',
    equipmentId: 'DOCK-8',
    equipmentLabel: 'Dock 8 리프트',
    alertType: 'jam',
    severity: 'critical',
    message: '리프트 잼 발생 — 운영 중단',
    affectedLines: [],
    detectedAt: '09:30',
    operationalImpact: 'high',
    status: 'acknowledged',
  },
];

// ─── 센터 KPI 더미 데이터 ────────────────────────────────────

export const SEED_CENTER_KPIS: KpiSnapshot = {
  throughput: 1240,
  avgWaitingMinutes: 23,
  dockUtilization: 78,
  bottleneckCount: 2,
  activeAlerts: 3,
  pendingActions: 3,
  timestamp: new Date().toISOString(),
};

// ─── 운영 이벤트 타임라인 더미 데이터 ───────────────────────

export const SEED_OPS_EVENTS: OpsEvent[] = [
  { id: 'evt-01', time: '06:00', type: 'vehicle_arrival', title: '센터 오픈', description: '일일 운영 시작, 초기 도크 배정 완료', severity: 'info' },
  { id: 'evt-02', time: '07:30', type: 'vehicle_arrival', title: '첫 입고 피크 시작', description: '차량 12대 동시 도착, 야드 진입 시작', severity: 'info' },
  { id: 'evt-03', time: '08:05', type: 'ai_action', title: 'AI: SORT-A 우회 적용', description: '오전 피크 대응, 처리량 +190 박스/h 회복', severity: 'info' },
  { id: 'evt-04', time: '08:41', type: 'ai_action', title: 'AI: K-8821 긴급 배정', description: 'Dock 1 배정, 대기 35분→7분 단축', severity: 'info' },
  { id: 'evt-05', time: '09:30', type: 'equipment_alert', title: 'Dock 8 리프트 잼', description: '즉시 운영 중단, 수동 조치 진행 중', severity: 'critical' },
  { id: 'evt-06', time: '09:41', type: 'equipment_alert', title: 'CONV-03 진동 감지', description: '경고 기준 초과, AI 점검 예약 추천 생성', severity: 'warning' },
  { id: 'evt-07', time: '09:53', type: 'bottleneck', title: 'MERGE-1 병목 감지', description: '처리량 94%, 15분 내 포화 예측', severity: 'critical' },
  { id: 'evt-08', time: '09:55', type: 'ai_action', title: 'AI: 우회 경로 추천', description: 'MERGE-1 우회 승인 대기 중', severity: 'warning' },
];

// ─── 기본 정책 설정 ──────────────────────────────────────────

export const DEFAULT_POLICY_CONFIG: PolicyConfig = {
  dockAssignmentStrategy: 'fifo',
  conveyorBypassThreshold: 78,
  bufferLimit: 20,
  workerReallocationEnabled: true,
  priorityWeights: {
    cargoType: 40,
    waitingTime: 35,
    dockEquipment: 25,
  },
};
