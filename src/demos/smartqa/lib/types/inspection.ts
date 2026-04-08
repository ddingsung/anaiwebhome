export type SystemState =
  | 'normal'
  | 'warn'
  | 'ng'
  | 'offline'
  | 'manual'
  | 'calibrating'
  | 'stale'

export type DefectType =
  | 'SCRATCH'
  | 'VOID'
  | 'OPEN'
  | 'CRACK'
  | 'BRIDGE'
  | 'FOREIGN'

export type ViewerMode = 'ai' | 'raw' | 'split'

export type EventType = 'detect' | 'reject' | 'acknowledge' | 'system'

export interface BoundingBox {
  id: string
  x: number        // 0~1 정규화 좌표
  y: number
  width: number
  height: number
  defectType: DefectType
  confidence: number  // 0~1
}

export interface InspectionFrame {
  id: string
  timestamp: number
  mode: ViewerMode
  boundingBoxes: BoundingBox[]
  isNG: boolean
  inferenceTimeMs: number
  fps: number
}

export interface KPIState {
  totalCount: number
  okCount: number
  ngCount: number
  yieldRate: number   // 0~100
  topDefectType: DefectType | null
}

export interface DefectLogEntry {
  id: string
  timestamp: number
  defectType: DefectType
  confidence: number
  thumbnailUrl?: string
  frameId: string
}

export interface TimelineEvent {
  id: string
  timestamp: number
  type: EventType
  label: string
  state?: SystemState
}

export interface SystemTelemetry {
  cpuPercent: number
  ramUsedGb: number
  temperatureCelsius: number
  cameraState: SystemState
  plcState: SystemState
  edgeNodeState: SystemState
  modelName: string
  modelVersion: string
  optimizer: string
  lastCalibrationTs: number
}

export interface InspectionDemoState {
  frame: InspectionFrame
  kpi: KPIState
  defectLog: DefectLogEntry[]
  timeline: TimelineEvent[]
}

export interface EngineConfig {
  ngRate: number      // 0~1, 기본 0.07
  intervalMs: number  // tick 간격(ms), 기본 600
  isPaused: boolean
}

export interface KPISnapshot {
  timestamp: number
  yieldRate: number  // 0~100
  ngCount: number
}
