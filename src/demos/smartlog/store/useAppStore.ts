'use client';

import { create } from 'zustand';
import { computeTick } from '@sl/data/simulator';
import type {
  ActiveRole,
  AiAction,
  Dock,
  EquipmentAlert,
  KpiSnapshot,
  NodeStatus,
  OpsEvent,
  PolicyConfig,
  SimulationResult,
  Vehicle,
  ConveyorNode,
  ConveyorEdge,
} from '@sl/types';
import {
  SEED_VEHICLES,
  SEED_DOCKS,
  SEED_AI_ACTIONS,
  SEED_ALERTS,
  SEED_CENTER_KPIS,
  SEED_OPS_EVENTS,
  DEFAULT_POLICY_CONFIG,
  SEED_CONVEYOR_NODES,
  SEED_CONVEYOR_EDGES,
} from '@sl/data/seed';

interface AppStore {
  // 역할
  activeRole: ActiveRole;
  setActiveRole: (role: ActiveRole) => void;

  // KPI
  centerKpis: KpiSnapshot;
  updateKpis: (kpis: Partial<KpiSnapshot>) => void;

  // AI 액션
  actions: AiAction[];
  approveAction: (id: string) => void;
  rejectAction: (id: string) => void;
  addAction: (action: AiAction) => void;

  // 알림
  alerts: EquipmentAlert[];
  acknowledgeAlert: (id: string) => void;

  // 도크 / 차량
  docks: Dock[];
  vehicles: Vehicle[];
  assignVehicleToDock: (vehicleId: string, dockId: string) => void;

  // 컨베이어
  conveyorNodes: ConveyorNode[];
  conveyorEdges: ConveyorEdge[];
  updateConveyorNode: (id: string, updates: Partial<ConveyorNode>) => void;

  // 운영 이벤트
  opsEvents: OpsEvent[];

  // Shadow Twin
  policyConfig: PolicyConfig;
  updatePolicy: (config: Partial<PolicyConfig>) => void;
  simulationResult: SimulationResult | null;
  isSimulating: boolean;
  runSimulation: () => Promise<void>;
  promoteToLive: () => void;

  // 시뮬레이터
  simulatorRunning: boolean;
  intervalId: ReturnType<typeof setInterval> | null;
  startSimulator: () => void;
  stopSimulator: () => void;
  resetSimulator: () => void;

  // 경보 배너 순환
  activeBannerIndex: number;
  nextBanner: () => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  // 역할
  activeRole: 'controller',
  setActiveRole: (role) => set({ activeRole: role }),

  // KPI
  centerKpis: SEED_CENTER_KPIS,
  updateKpis: (kpis) =>
    set((state) => ({
      centerKpis: { ...state.centerKpis, ...kpis, timestamp: new Date().toISOString() },
    })),

  // AI 액션
  actions: SEED_AI_ACTIONS,
  approveAction: (id) => {
    const state = get();
    const action = state.actions.find((a) => a.id === id);
    if (!action) return;

    // 1) executing 상태로 먼저 전환 (스펙 요구사항)
    set({ actions: state.actions.map((a) => a.id === id ? { ...a, status: 'executing' as const } : a) });

    // 2) 사이드이펙트 계산 후 completed로 전환
    let kpiUpdates: Partial<KpiSnapshot> = {};
    const extraUpdates: Partial<typeof state> = {};

    if (action.type === 'dock_assignment' && action.affectedVehicleId && action.affectedDockId) {
      extraUpdates.vehicles = state.vehicles.map((v) =>
        v.id === action.affectedVehicleId ? { ...v, status: 'docking' as const, assignedDockId: action.affectedDockId! } : v
      );
      extraUpdates.docks = state.docks.map((d) =>
        d.id === action.affectedDockId ? { ...d, status: 'operating' as const, currentVehicleId: action.affectedVehicleId! } : d
      );
      const reduction = 8 + Math.floor(Math.random() * 5); // 8~12
      kpiUpdates.avgWaitingMinutes = Math.max(5, state.centerKpis.avgWaitingMinutes - reduction);
    } else if (action.type === 'conveyor_bypass' && action.affectedNodeId) {
      const nodeId = action.affectedNodeId;
      extraUpdates.conveyorNodes = state.conveyorNodes.map((n) => {
        if (n.id !== nodeId) return n;
        const newRate = Math.max(10, n.utilizationRate - 20 - Math.floor(Math.random() * 6));
        const newBacklog = Math.round(n.backlog * 0.4);
        const newThroughput = n.throughput + 150 + Math.floor(Math.random() * 51);
        return {
          ...n,
          utilizationRate: newRate,
          backlog: newBacklog,
          throughput: newThroughput,
          status: (newRate >= 90 ? 'critical' : newRate >= 75 ? 'warning' : 'normal') as NodeStatus,
        };
      });
      const gain = 100 + Math.floor(Math.random() * 51);
      kpiUpdates.throughput = Math.min(1600, state.centerKpis.throughput + gain);
    } else if (action.type === 'equipment_maintenance' && action.affectedNodeId) {
      const targetAlert = state.alerts.find((a) => a.equipmentId === action.affectedNodeId);
      if (targetAlert) {
        extraUpdates.alerts = state.alerts.map((a) =>
          a.id === targetAlert.id ? { ...a, status: 'acknowledged' as const } : a
        );
      }
    }

    const actualEffects = action.expectedEffects.map((e) => ({
      metric: e.metric,
      before: e.before,
      after: e.after,
      unit: e.unit,
      measuredAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    }));

    set({
      ...extraUpdates,
      centerKpis: {
        ...state.centerKpis,
        ...kpiUpdates,
        pendingActions: Math.max(0, state.centerKpis.pendingActions - 1),
        timestamp: new Date().toISOString(),
      },
      actions: state.actions.map((a) =>
        a.id === id ? { ...a, status: 'completed' as const, actualEffects } : a
      ),
    });
  },
  rejectAction: (id) =>
    set((state) => ({
      centerKpis: {
        ...state.centerKpis,
        pendingActions: Math.max(0, state.centerKpis.pendingActions - 1),
        timestamp: new Date().toISOString(),
      },
      actions: state.actions.map((a) =>
        a.id === id ? { ...a, status: 'rejected' as const } : a
      ),
    })),
  addAction: (action) =>
    set((state) => ({ actions: [action, ...state.actions] })),

  // 알림
  alerts: SEED_ALERTS,
  acknowledgeAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === id ? { ...a, status: 'acknowledged' as const } : a
      ),
    })),

  // 도크 / 차량
  docks: SEED_DOCKS,
  vehicles: SEED_VEHICLES,
  assignVehicleToDock: (vehicleId, dockId) =>
    set((state) => ({
      vehicles: state.vehicles.map((v) =>
        v.id === vehicleId ? { ...v, assignedDockId: dockId, status: 'docking' as const } : v
      ),
      docks: state.docks.map((d) =>
        d.id === dockId ? { ...d, currentVehicleId: vehicleId, status: 'operating' as const } : d
      ),
    })),

  // 컨베이어
  conveyorNodes: SEED_CONVEYOR_NODES,
  conveyorEdges: SEED_CONVEYOR_EDGES,
  updateConveyorNode: (id, updates) =>
    set((state) => ({
      conveyorNodes: state.conveyorNodes.map((n) =>
        n.id === id ? { ...n, ...updates } : n
      ),
    })),

  // 운영 이벤트
  opsEvents: SEED_OPS_EVENTS,

  // Shadow Twin
  policyConfig: DEFAULT_POLICY_CONFIG,
  updatePolicy: (config) =>
    set((state) => ({
      policyConfig: { ...state.policyConfig, ...config },
      simulationResult: null,
    })),
  simulationResult: null,
  isSimulating: false,
  runSimulation: async () => {
    set({ isSimulating: true });
    await new Promise((r) => setTimeout(r, 2200));

    const { policyConfig, centerKpis } = get();
    const { dockAssignmentStrategy, conveyorBypassThreshold, bufferLimit, priorityWeights } = policyConfig;

    // 도크 배정 전략: hybrid > priority > fifo
    const strategyBoost = dockAssignmentStrategy === 'hybrid' ? 0.12
      : dockAssignmentStrategy === 'priority' ? 0.07 : 0.02;
    // 컨베이어 우회: 임계값 낮을수록 우회 더 자주 → 처리량 증가
    const bypassBoost = Math.max(0, (85 - conveyorBypassThreshold) / 100 * 0.10);
    // 버퍼: 클수록 안정적 처리량
    const bufferBoost = ((bufferLimit - 5) / 45) * 0.04;
    const throughputGain = Math.min(0.26, strategyBoost + bypassBoost + bufferBoost);

    // 대기시간: 전략 + 대기시간 가중치
    const strategyWaitSave = dockAssignmentStrategy === 'hybrid' ? 0.38
      : dockAssignmentStrategy === 'priority' ? 0.26 : 0.08;
    const waitWeightSave = ((priorityWeights.waitingTime - 10) / 50) * 0.12;
    const waitingReduction = Math.min(0.55, strategyWaitSave + waitWeightSave);

    // 가동률 개선: 전략에 따라 차등
    const utilBoost = dockAssignmentStrategy === 'hybrid' ? 8
      : dockAssignmentStrategy === 'priority' ? 5 : 2;

    // 병목: 임계값이 낮을수록 적음
    const bottlenecks = conveyorBypassThreshold < 65 ? 0
      : conveyorBypassThreshold < 78 ? 1 : 2;

    const shadowKpis = {
      throughput: Math.round(centerKpis.throughput * (1 + throughputGain)),
      avgWaitingMinutes: Math.round(centerKpis.avgWaitingMinutes * (1 - waitingReduction)),
      dockUtilization: Math.min(98, centerKpis.dockUtilization + utilBoost),
      bottleneckCount: Math.max(0, bottlenecks),
      activeAlerts: centerKpis.activeAlerts,
      pendingActions: 1,
      timestamp: new Date().toISOString(),
    };

    // 타임시리즈: shadow가 점진적으로 수렴 (6포인트에 걸쳐 램프업)
    const timePoints = Array.from({ length: 12 }, (_, i) => {
      const ramp = Math.min(1, i / 5);
      return {
        time: `${(9 + Math.floor(i / 2)).toString().padStart(2, '0')}:${i % 2 === 0 ? '00' : '30'}`,
        live: centerKpis.throughput + Math.round((Math.random() - 0.5) * 100),
        shadow: Math.round(centerKpis.throughput * (1 + throughputGain * ramp) + (Math.random() - 0.5) * 60),
      };
    });

    // 신뢰도: 극단적 설정일수록 조금 낮아짐
    const confidence = Math.max(0.82, 0.97 - Math.abs(conveyorBypassThreshold - 72) / 200);
    const risk: 'low' | 'medium' | 'high' = throughputGain > 0.18 ? 'medium' : 'low';

    set({
      isSimulating: false,
      simulationResult: {
        liveKpis: centerKpis,
        shadowKpis,
        timeSeriesComparison: timePoints,
        validationConfidence: Math.round(confidence * 100) / 100,
        riskAssessment: risk,
        improvementSummary: [
          {
            metric: '처리량',
            liveBefore: centerKpis.throughput,
            shadowAfter: shadowKpis.throughput,
            unit: '박스/h',
            improvementPct: Math.round(throughputGain * 100),
            positive: true,
          },
          {
            metric: '평균 대기시간',
            liveBefore: centerKpis.avgWaitingMinutes,
            shadowAfter: shadowKpis.avgWaitingMinutes,
            unit: '분',
            improvementPct: Math.round(waitingReduction * 100),
            positive: true,
          },
          {
            metric: '도크 가동률',
            liveBefore: centerKpis.dockUtilization,
            shadowAfter: shadowKpis.dockUtilization,
            unit: '%',
            improvementPct: utilBoost,
            positive: true,
          },
          {
            metric: '병목 발생',
            liveBefore: centerKpis.bottleneckCount,
            shadowAfter: shadowKpis.bottleneckCount,
            unit: '건',
            improvementPct: centerKpis.bottleneckCount > 0
              ? Math.round((1 - bottlenecks / centerKpis.bottleneckCount) * 100)
              : bottlenecks === 0 ? 100 : 0,
            positive: true,
          },
        ],
      },
    });
  },
  promoteToLive: () => {
    const { simulationResult } = get();
    if (!simulationResult) return;

    const throughputItem = simulationResult.improvementSummary[0];
    const monitoringAction: AiAction = {
      id: `act-policy-${Date.now()}`,
      type: 'priority_change',
      priority: 'high',
      status: 'pending',
      title: '신규 정책 안정화 모니터링',
      description: 'Shadow 정책이 LIVE에 승격되었습니다. 처음 4시간 동안 처리량 및 대기시간을 집중 모니터링하고 이상 발생 시 즉시 롤백 준비를 권장합니다.',
      createdAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      riskLevel: simulationResult.riskAssessment,
      evidence: [
        {
          type: 'prediction',
          label: 'Shadow 처리량 예측 개선',
          value: `+${throughputItem?.improvementPct ?? 0}%`,
          significance: 'primary',
        },
        {
          type: 'historical',
          label: '정책 변경 후 안정화 소요',
          value: '평균 3.2시간',
          significance: 'supporting',
        },
      ],
      expectedEffects: [
        {
          metric: '처리량',
          before: simulationResult.liveKpis.throughput,
          after: simulationResult.shadowKpis.throughput,
          unit: '박스/h',
          confidence: simulationResult.validationConfidence,
        },
        {
          metric: '평균 대기시간',
          before: simulationResult.liveKpis.avgWaitingMinutes,
          after: simulationResult.shadowKpis.avgWaitingMinutes,
          unit: '분',
          confidence: simulationResult.validationConfidence,
        },
      ],
    };

    set((state) => ({
      centerKpis: {
        ...simulationResult.shadowKpis,
        pendingActions: state.centerKpis.pendingActions + 1,
        timestamp: new Date().toISOString(),
      },
      simulationResult: null,
      actions: [monitoringAction, ...state.actions],
      opsEvents: [
        {
          id: `evt-${Date.now()}`,
          time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
          type: 'policy_change',
          title: 'Shadow 정책 LIVE 승격',
          description: `새 정책 적용 완료 — 처리량 +${throughputItem?.improvementPct}% 개선 예상`,
          severity: 'info',
        },
        ...state.opsEvents,
      ],
    }));
  },

  // 시뮬레이터
  simulatorRunning: false,
  intervalId: null,
  startSimulator: () => {
    if (get().intervalId !== null) return; // prevent double-start
    const id = setInterval(() => {
      const { centerKpis, docks, vehicles, conveyorNodes } = get();
      const next = computeTick({ centerKpis, docks, vehicles, conveyorNodes });
      set(next);
    }, 3000);
    set({ simulatorRunning: true, intervalId: id });
  },
  stopSimulator: () => {
    const { intervalId } = get();
    if (intervalId !== null) clearInterval(intervalId);
    set({ simulatorRunning: false, intervalId: null });
  },
  resetSimulator: () => {
    const { intervalId } = get();
    if (intervalId !== null) clearInterval(intervalId);
    set({
      simulatorRunning: false,
      intervalId: null,
      centerKpis: SEED_CENTER_KPIS,
      docks: SEED_DOCKS,
      vehicles: SEED_VEHICLES,
      conveyorNodes: SEED_CONVEYOR_NODES,
      conveyorEdges: SEED_CONVEYOR_EDGES,
      actions: SEED_AI_ACTIONS,
      alerts: SEED_ALERTS,
      opsEvents: SEED_OPS_EVENTS,
    });
  },

  // 경보 배너
  activeBannerIndex: 0,
  nextBanner: () =>
    set((state) => {
      const activeAlerts = state.alerts.filter((a) => a.status === 'active');
      return {
        activeBannerIndex:
          activeAlerts.length > 0
            ? (state.activeBannerIndex + 1) % activeAlerts.length
            : 0,
      };
    }),
}));

// 앱 시작 시 시뮬레이터 자동 실행
if (typeof window !== 'undefined') {
  setTimeout(() => useAppStore.getState().startSimulator(), 0);
}
