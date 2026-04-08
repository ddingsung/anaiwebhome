'use client';

import { useAppStore } from '@sl/store/useAppStore';
import { clsx } from 'clsx';
import { RiLayoutGridLine } from 'react-icons/ri';
import type { Dock, DockStatus } from '@sl/types';
import PanelHeader from '@sl/components/ui/PanelHeader';

const STATUS_CONFIG: Record<DockStatus, { label: string; bg: string; border: string; text: string; dot: string }> = {
  operating:   { label: '운영중', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.30)',  text: '#34d399', dot: 'bg-emerald-400' },
  congested:   { label: '혼잡',  bg: 'rgba(239,68,68,0.10)',   border: 'rgba(239,68,68,0.35)',   text: '#f87171', dot: 'bg-red-400 animate-pulse-critical' },
  idle:        { label: '대기',  bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.08)', text: 'rgba(255,255,255,0.25)', dot: 'bg-white/15' },
  error:       { label: '오류',  bg: 'rgba(239,68,68,0.07)',   border: 'rgba(239,68,68,0.25)',   text: '#f87171', dot: 'bg-red-500' },
  maintenance: { label: '점검',  bg: 'rgba(245,158,11,0.06)',  border: 'rgba(245,158,11,0.20)',  text: 'rgba(245,158,11,0.6)', dot: 'bg-amber-400/60' },
};

const CARGO_LABELS: Record<string, string> = {
  frozen:  '냉동',
  ambient: '상온',
  hazmat:  '위험물',
  bulk:    '벌크',
};

interface DockSlotGridProps {
  selectedDockId: string | null;
  onSelectDock: (id: string) => void;
}

function DockSlot({ dock, selected, onClick }: { dock: Dock; selected: boolean; onClick: () => void }) {
  const cfg = STATUS_CONFIG[dock.status];
  const { vehicles } = useAppStore();
  const vehicle = vehicles.find((v) => v.id === dock.currentVehicleId);

  return (
    <div
      onClick={onClick}
      className="rounded-lg p-3 cursor-pointer transition-all flex flex-col h-full"
      style={{
        background: selected ? 'rgba(6,182,212,0.08)' : cfg.bg,
        border: `1px solid ${selected ? 'rgba(6,182,212,0.5)' : cfg.border}`,
        boxShadow: selected ? '0 0 0 1px rgba(6,182,212,0.25)' : 'none',
      }}
    >
      {/* 도크명 + 상태 */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-white/80">{dock.id}</span>
        <div className="flex items-center gap-1">
          <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', cfg.dot)} />
          <span className="text-[10px]" style={{ color: cfg.text }}>{cfg.label}</span>
        </div>
      </div>

      {/* 장비 유형 뱃지 */}
      <div className="flex flex-wrap gap-1 mb-2">
        {dock.equipmentTypes.map((eq) => (
          <span
            key={eq}
            className="text-[9px] px-1 py-0.5 rounded"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)' }}
          >
            {eq === 'frozen' ? '❄ 냉동' : eq === 'bulk' ? '📦 벌크' : '📋 표준'}
          </span>
        ))}
      </div>

      {/* 현재 차량 */}
      {vehicle ? (
        <div className="text-[10px] truncate" style={{ color: 'rgba(255,255,255,0.45)' }}>
          {vehicle.id} · {CARGO_LABELS[vehicle.cargoType]}
        </div>
      ) : (
        <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.20)' }}>—</div>
      )}

      {/* 하차 진행률 — 아래로 밀기 */}
      <div className="flex-1" />
      {dock.unloadingProgress > 0 && (
        <div className="mt-2">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.3)' }}>하차 진행</span>
            <span className="text-[9px] font-mono" style={{ color: cfg.text }}>{dock.unloadingProgress}%</span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${dock.unloadingProgress}%`, background: cfg.text }}
            />
          </div>
        </div>
      )}

      {/* 완료 예정 */}
      {dock.estimatedCompletionTime && (
        <div className="mt-1.5 text-[9px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
          완료 예정 {dock.estimatedCompletionTime}
        </div>
      )}
    </div>
  );
}

export default function DockSlotGrid({ selectedDockId, onSelectDock }: DockSlotGridProps) {
  const { docks } = useAppStore();

  const operating = docks.filter((d) => d.status === 'operating').length;
  const congested = docks.filter((d) => d.status === 'congested').length;
  const idle = docks.filter((d) => d.status === 'idle').length;

  return (
    <div className="flex flex-col h-full">
      <PanelHeader
        icon={<RiLayoutGridLine size={13} />}
        title="도크 슬롯"
        description="9개 슬롯 실시간 배정 현황"
        badge={
          <div className="flex items-center gap-2 text-[10px]">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />{operating}
            </span>
            <span className="flex items-center gap-1 text-red-400">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />{congested}
            </span>
            <span className="font-mono" style={{ color: 'var(--text-muted)' }}>
              {Math.round((operating / docks.length) * 100)}% 가동
            </span>
          </div>
        }
      />

      {/* 그리드 */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-3 gap-2 h-full" style={{ gridAutoRows: '1fr' }}>
          {docks.map((dock) => (
            <DockSlot
              key={dock.id}
              dock={dock}
              selected={selectedDockId === dock.id}
              onClick={() => onSelectDock(dock.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
