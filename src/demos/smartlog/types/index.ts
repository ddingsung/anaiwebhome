// ─── YMS 계층 ─────────────────────────────────────────────────

export type CargoType = 'ambient' | 'frozen' | 'hazmat' | 'bulk';
export type VehicleStatus =
  | 'reserved'
  | 'approaching'
  | 'waiting'
  | 'docking'
  | 'unloading'
  | 'departed';
export type Priority = 'urgent' | 'high' | 'normal' | 'low';

export interface Vehicle {
  id: string;
  licensePlate: string;
  type: 'truck' | 'van';
  cargoType: CargoType;
  status: VehicleStatus;
  arrivalTime: string;
  waitingMinutes: number;
  priority: Priority;
  assignedDockId: string | null;
  eta: string | null;
}

export type DockStatus = 'idle' | 'operating' | 'congested' | 'error' | 'maintenance';

export interface Dock {
  id: string;
  name: string;
  status: DockStatus;
  currentVehicleId: string | null;
  equipmentTypes: ('frozen' | 'standard' | 'bulk')[];
  utilizationRate: number;
  unloadingProgress: number;
  estimatedCompletionTime: string | null;
}

// ─── WES 계층 ─────────────────────────────────────────────────

export type ConveyorNodeType =
  | 'sorter'
  | 'merge'
  | 'buffer'
  | 'diverter'
  | 'straight'
  | 'zone';

export type NodeStatus = 'normal' | 'warning' | 'critical' | 'error' | 'idle';

export interface ConveyorNode {
  id: string;
  type: ConveyorNodeType;
  label: string;
  throughput: number;
  designThroughput: number;
  utilizationRate: number;
  backlog: number;
  status: NodeStatus;
  position: { x: number; y: number };
}

export interface ConveyorEdge {
  id: string;
  source: string;
  target: string;
  active: boolean;
  isAlternatePath: boolean;
}

// ─── AI Action 계층 ───────────────────────────────────────────

export type ActionType =
  | 'dock_assignment'
  | 'conveyor_bypass'
  | 'equipment_maintenance'
  | 'worker_reallocation'
  | 'priority_change';

export type ActionStatus = 'pending' | 'executing' | 'completed' | 'rejected';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface Evidence {
  type: 'metric' | 'threshold' | 'prediction' | 'historical';
  label: string;
  value: string;
  significance: 'primary' | 'supporting';
}

export interface ExpectedEffect {
  metric: string;
  before: number;
  after: number;
  unit: string;
  confidence: number;
}

export interface ActualEffect {
  metric: string;
  before: number;
  after: number;
  unit: string;
  measuredAt: string;
}

export interface AiAction {
  id: string;
  type: ActionType;
  priority: Priority;
  status: ActionStatus;
  title: string;
  description: string;
  createdAt: string;
  evidence: Evidence[];
  expectedEffects: ExpectedEffect[];
  actualEffects?: ActualEffect[];
  riskLevel: RiskLevel;
  affectedDockId?: string;
  affectedNodeId?: string;
  affectedVehicleId?: string;
}

// ─── 설비 알람 ────────────────────────────────────────────────

export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertType =
  | 'vibration'
  | 'temperature'
  | 'sensor_error'
  | 'jam'
  | 'speed_deviation';

export interface EquipmentAlert {
  id: string;
  equipmentId: string;
  equipmentLabel: string;
  alertType: AlertType;
  severity: AlertSeverity;
  message: string;
  affectedLines: string[];
  detectedAt: string;
  operationalImpact: 'high' | 'medium' | 'low';
  status: 'active' | 'acknowledged' | 'resolved';
}

// ─── Digital Twin 계층 ────────────────────────────────────────

export interface PolicyConfig {
  dockAssignmentStrategy: 'fifo' | 'priority' | 'hybrid';
  conveyorBypassThreshold: number;
  bufferLimit: number;
  workerReallocationEnabled: boolean;
  priorityWeights: {
    cargoType: number;
    waitingTime: number;
    dockEquipment: number;
  };
}

export interface KpiSnapshot {
  throughput: number;
  avgWaitingMinutes: number;
  dockUtilization: number;
  bottleneckCount: number;
  activeAlerts: number;
  pendingActions: number;
  timestamp: string;
}

export interface TimeSeriesPoint {
  time: string;
  live: number;
  shadow: number;
}

export interface ImprovementItem {
  metric: string;
  liveBefore: number;
  shadowAfter: number;
  unit: string;
  improvementPct: number;
  positive: boolean;
}

export interface SimulationResult {
  liveKpis: KpiSnapshot;
  shadowKpis: KpiSnapshot;
  timeSeriesComparison: TimeSeriesPoint[];
  validationConfidence: number;
  riskAssessment: RiskLevel;
  improvementSummary: ImprovementItem[];
}

// ─── 앱 전역 ─────────────────────────────────────────────────

export type ActiveRole = 'controller' | 'supervisor' | 'operator';

export interface OpsEvent {
  id: string;
  time: string;
  type: 'vehicle_arrival' | 'bottleneck' | 'ai_action' | 'equipment_alert' | 'policy_change';
  title: string;
  description: string;
  severity?: AlertSeverity;
}
