import type { KpiSnapshot, Dock, Vehicle, ConveyorNode, NodeStatus } from '@sl/types';

export interface TickInput {
  centerKpis: KpiSnapshot;
  docks: Dock[];
  vehicles: Vehicle[];
  conveyorNodes: ConveyorNode[];
}

export interface TickOutput {
  centerKpis: KpiSnapshot;
  docks: Dock[];
  vehicles: Vehicle[];
  conveyorNodes: ConveyorNode[];
}

const TOTAL_UNLOAD_MINS = 60; // 하차 총 소요 기준시간 (간트 ETA 계산용)

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function calcEta(progress: number): string {
  const remainingMins = Math.round((100 - progress) / 100 * TOTAL_UNLOAD_MINS);
  const d = new Date(Date.now() + remainingMins * 60000);
  return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function timeNow(): string {
  return new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function jitter(range: number): number {
  return Math.round((Math.random() * 2 - 1) * range);
}

function nodeStatus(rate: number): NodeStatus {
  if (rate >= 90) return 'critical';
  if (rate >= 75) return 'warning';
  return 'normal';
}

export function computeTick(input: TickInput): TickOutput {
  const { centerKpis, docks, vehicles, conveyorNodes } = input;

  // KPI 변동
  const nextKpis: KpiSnapshot = {
    ...centerKpis,
    throughput: clamp(centerKpis.throughput + jitter(30), 800, 1600),
    avgWaitingMinutes: clamp(centerKpis.avgWaitingMinutes + jitter(1), 5, 60),
    dockUtilization: clamp(centerKpis.dockUtilization + jitter(2), 40, 98),
    timestamp: new Date().toISOString(),
  };

  // 도크 언로딩 진행 (operating 상태만 진행 — congested/idle/maintenance/error는 고정)
  const completedVehicleIds = new Set<string>();
  const nextDocks = docks.map((dock) => {
    if (dock.status !== 'operating') return dock; // congested 포함 나머지 상태 제외
    const increment = 3 + Math.floor(Math.random() * 3); // 3~5
    const nextProgress = dock.unloadingProgress + increment;
    if (nextProgress >= 100) {
      if (dock.currentVehicleId) completedVehicleIds.add(dock.currentVehicleId);
      return {
        ...dock,
        unloadingProgress: 0,
        status: 'idle' as const,
        currentVehicleId: null,
        estimatedCompletionTime: null,
      };
    }
    return { ...dock, unloadingProgress: nextProgress, estimatedCompletionTime: calcEta(nextProgress) };
  });

  // 완료된 도크의 차량 → departed, 대기 차량 waitingMinutes +1
  const nextVehicles = vehicles.map((v) => {
    if (completedVehicleIds.has(v.id)) {
      return { ...v, status: 'departed' as const };
    }
    if (v.status === 'waiting') {
      return { ...v, waitingMinutes: Math.min(v.waitingMinutes + 1, 120) };
    }
    return v;
  });

  // 새로 idle이 된 도크에 대기 차량 자동 배정
  const PRIORITY_RANK: Record<string, number> = { urgent: 0, high: 1, normal: 2, low: 3 };
  const newlyIdleDocks = nextDocks.filter((nd) => {
    if (nd.status !== 'idle') return false;
    const orig = docks.find((od) => od.id === nd.id);
    return orig?.status === 'operating'; // 방금 완료된 도크
  });

  const waitingQueue = nextVehicles
    .filter((v) => v.status === 'waiting')
    .sort((a, b) => {
      const pr = (PRIORITY_RANK[a.priority] ?? 3) - (PRIORITY_RANK[b.priority] ?? 3);
      return pr !== 0 ? pr : b.waitingMinutes - a.waitingMinutes;
    });

  const dockAssignments: Record<string, string> = {}; // dockId → vehicleId
  const assignedIds = new Set<string>();
  for (const dock of newlyIdleDocks) {
    const next = waitingQueue.find((v) => !assignedIds.has(v.id));
    if (!next) break;
    dockAssignments[dock.id] = next.id;
    assignedIds.add(next.id);
  }

  const finalDocks = Object.keys(dockAssignments).length > 0
    ? nextDocks.map((dock) => {
        const vid = dockAssignments[dock.id];
        if (!vid) return dock;
        return {
          ...dock,
          status: 'operating' as const,
          currentVehicleId: vid,
          unloadingProgress: 0,
          estimatedCompletionTime: calcEta(0),
        };
      })
    : nextDocks;

  const finalVehicles = assignedIds.size > 0
    ? nextVehicles.map((v) => {
        if (!assignedIds.has(v.id)) return v;
        const dockId = Object.entries(dockAssignments).find(([, vid]) => vid === v.id)?.[0];
        return { ...v, status: 'docking' as const, assignedDockId: dockId ?? null, arrivalTime: timeNow() };
      })
    : nextVehicles;

  // 컨베이어 노드 utilization 변동
  const nextNodes = conveyorNodes.map((node) => {
    const nextRate = clamp(node.utilizationRate + jitter(3), 10, 99);
    return {
      ...node,
      utilizationRate: nextRate,
      status: nodeStatus(nextRate),
    };
  });

  return {
    centerKpis: nextKpis,
    docks: finalDocks,
    vehicles: finalVehicles,
    conveyorNodes: nextNodes,
  };
}
