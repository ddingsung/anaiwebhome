'use client';

import { useAppStore } from '@sl/store/useAppStore';
import { clsx } from 'clsx';
import { RiTimeLine, RiTempColdLine, RiArchiveLine, RiAlertLine, RiTruckLine } from 'react-icons/ri';
import PanelHeader from '@sl/components/ui/PanelHeader';
import Badge from '@sl/components/ui/Badge';
import type { Vehicle, Priority, CargoType } from '@sl/types';

const PRIORITY_CONFIG: Record<Priority, { label: string; variant: React.ComponentProps<typeof Badge>['variant']; border: string }> = {
  urgent: { label: '긴급', variant: 'critical', border: 'border-l-red-500' },
  high:   { label: '높음', variant: 'warning',  border: 'border-l-amber-500' },
  normal: { label: '보통', variant: 'normal',   border: 'border-l-emerald-500/50' },
  low:    { label: '낮음', variant: 'idle',     border: 'border-l-white/10' },
};

const CARGO_CONFIG: Record<CargoType, { icon: React.ReactNode; label: string; color: string }> = {
  frozen:  { icon: <RiTempColdLine size={10} />, label: '냉동',  color: '#60a5fa' },
  ambient: { icon: <RiArchiveLine size={10} />,  label: '상온',  color: 'rgba(255,255,255,0.4)' },
  hazmat:  { icon: <RiAlertLine size={10} />,    label: '위험물', color: '#f87171' },
  bulk:    { icon: <RiTruckLine size={10} />,    label: '벌크',  color: '#a78bfa' },
};

const STATUS_LABEL: Record<string, string> = {
  reserved:   '예약',
  approaching: '접근중',
  waiting:    '대기',
  docking:    '진입중',
  unloading:  '하차중',
  departed:   '출차',
};

interface WaitingVehicleQueueProps {
  onSelectVehicle: (id: string) => void;
  selectedVehicleId: string | null;
}

function VehicleCard({ vehicle, rank, selected, onClick }: {
  vehicle: Vehicle;
  rank: number;
  selected: boolean;
  onClick: () => void;
}) {
  const pc = PRIORITY_CONFIG[vehicle.priority];
  const cc = CARGO_CONFIG[vehicle.cargoType];

  return (
    <div
      onClick={onClick}
      className={clsx(
        'rounded-lg p-3 cursor-pointer transition-all border-l-2',
        pc.border
      )}
      style={{
        background: selected ? 'rgba(6,182,212,0.06)' : 'var(--bg-elevated)',
        border: `1px solid ${selected ? 'rgba(6,182,212,0.4)' : 'var(--border-subtle)'}`,
        borderLeftWidth: '2px',
      }}
    >
      {/* 순위 + 차량번호 + 우선순위 */}
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className="w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center shrink-0"
          style={{
            background: rank <= 2 ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.06)',
            color: rank <= 2 ? '#f87171' : 'rgba(255,255,255,0.3)',
          }}
        >
          {rank}
        </span>
        <span className="text-xs font-semibold text-white/85 flex-1">{vehicle.id}</span>
        <Badge variant={pc.variant} size="sm">{pc.label}</Badge>
      </div>

      {/* 화물 유형 + 차종 */}
      <div className="flex items-center gap-3 mb-1.5">
        <span className="flex items-center gap-1 text-[11px]" style={{ color: cc.color }}>
          {cc.icon} {cc.label}
        </span>
        <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
          {vehicle.type === 'truck' ? '화물차' : '밴'}
        </span>
        <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
          {STATUS_LABEL[vehicle.status]}
        </span>
      </div>

      {/* 대기 시간 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-[11px]">
          <RiTimeLine size={10} style={{ color: vehicle.waitingMinutes > 20 ? '#f87171' : 'rgba(255,255,255,0.3)' }} />
          <span style={{ color: vehicle.waitingMinutes > 20 ? '#fca5a5' : 'rgba(255,255,255,0.45)' }}>
            대기 {vehicle.waitingMinutes}분
          </span>
          {vehicle.waitingMinutes > 20 && (
            <span className="text-[9px] text-red-400">(임계 초과)</span>
          )}
        </div>
        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
          도착 {vehicle.arrivalTime}
        </span>
      </div>
    </div>
  );
}

export default function WaitingVehicleQueue({ onSelectVehicle, selectedVehicleId }: WaitingVehicleQueueProps) {
  const { vehicles } = useAppStore();

  // 대기 중인 차량만, 우선순위 → 대기시간 순 정렬
  const priorityOrder: Record<Priority, number> = { urgent: 0, high: 1, normal: 2, low: 3 };
  const waiting = vehicles
    .filter((v) => v.status === 'waiting' || v.status === 'approaching')
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority] || b.waitingMinutes - a.waitingMinutes);

  const inDock = vehicles.filter((v) => v.status === 'docking' || v.status === 'unloading');

  return (
    <div className="flex flex-col h-full">
      <PanelHeader
        icon={<RiTruckLine size={13} />}
        title="대기 차량 큐"
        description="야드 진입 대기 중인 차량"
        badge={
          <span className="text-[10px]" style={{ color: waiting.some(v => v.waitingMinutes > 20) ? '#f87171' : 'var(--text-muted)' }}>
            대기 {waiting.length}대 · 작업중 {inDock.length}대
          </span>
        }
      />

      {/* 큐 목록 */}
      <div className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-2">
        {waiting.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 gap-2">
            <RiTruckLine size={20} style={{ color: 'var(--text-muted)' }} />
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>대기 차량 없음</p>
          </div>
        ) : (
          waiting.map((v, idx) => (
            <VehicleCard
              key={v.id}
              vehicle={v}
              rank={idx + 1}
              selected={selectedVehicleId === v.id}
              onClick={() => onSelectVehicle(v.id)}
            />
          ))
        )}

        {/* 구분선: 작업중 차량 */}
        {inDock.length > 0 && (
          <>
            <div className="flex items-center gap-2 py-1">
              <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>작업중</span>
              <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
            </div>
            {inDock.map((v, idx) => (
              <VehicleCard
                key={v.id}
                vehicle={v}
                rank={waiting.length + idx + 1}
                selected={selectedVehicleId === v.id}
                onClick={() => onSelectVehicle(v.id)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
