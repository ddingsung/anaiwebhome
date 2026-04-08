'use client';

import { RiCloseLine, RiTimeLine, RiTempColdLine, RiArchiveLine, RiAlertLine, RiTruckLine, RiToolsLine } from 'react-icons/ri';
import { useAppStore } from '@sl/store/useAppStore';
import Badge from '@sl/components/ui/Badge';
import type { DockStatus, CargoType } from '@sl/types';

const STATUS_CONFIG: Record<DockStatus, { label: string; variant: React.ComponentProps<typeof Badge>['variant'] }> = {
  operating:   { label: '운영중', variant: 'normal' },
  congested:   { label: '혼잡',  variant: 'critical' },
  idle:        { label: '대기',  variant: 'idle' },
  error:       { label: '오류',  variant: 'critical' },
  maintenance: { label: '점검',  variant: 'warning' },
};

const CARGO_ICONS: Record<CargoType, React.ReactNode> = {
  frozen:  <RiTempColdLine size={12} className="text-blue-400" />,
  ambient: <RiArchiveLine size={12} className="text-white/40" />,
  hazmat:  <RiAlertLine size={12} className="text-red-400" />,
  bulk:    <RiTruckLine size={12} className="text-violet-400" />,
};

interface DockDetailDrawerProps {
  dockId: string | null;
  onClose: () => void;
}

export default function DockDetailDrawer({ dockId, onClose }: DockDetailDrawerProps) {
  const { docks, vehicles, alerts } = useAppStore();

  if (!dockId) return null;

  const dock = docks.find((d) => d.id === dockId);
  if (!dock) return null;

  const vehicle = vehicles.find((v) => v.id === dock.currentVehicleId);
  const dockAlerts = alerts.filter(
    (a) => a.equipmentId.toLowerCase().includes(dockId.toLowerCase()) && a.status !== 'resolved'
  );
  const sc = STATUS_CONFIG[dock.status];

  return (
    <div
      className="flex flex-col h-full animate-slide-in-right"
      style={{
        background: 'var(--bg-elevated)',
        borderLeft: '1px solid var(--border-default)',
        width: '280px',
      }}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white/90">{dock.name}</span>
          <Badge variant={sc.variant} size="sm">{sc.label}</Badge>
        </div>
        <button
          onClick={onClose}
          className="text-white/30 hover:text-white/60 transition-colors"
        >
          <RiCloseLine size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* 장비 유형 */}
        <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="text-[11px] mb-2" style={{ color: 'var(--text-muted)' }}>지원 장비</div>
          <div className="flex flex-wrap gap-1.5">
            {dock.equipmentTypes.map((eq) => (
              <span key={eq} className="flex items-center gap-1 px-2 py-1 rounded text-[11px]"
                style={{ background: 'var(--bg-overlay)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                {eq === 'frozen' ? '❄ 냉동' : eq === 'bulk' ? '📦 벌크' : '📋 표준'}
              </span>
            ))}
          </div>
        </div>

        {/* 현재 작업 */}
        <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="text-[11px] mb-2" style={{ color: 'var(--text-muted)' }}>현재 작업 차량</div>
          {vehicle ? (
            <div className="rounded-md p-3" style={{ background: 'var(--bg-overlay)' }}>
              <div className="flex items-center gap-2 mb-2">
                {CARGO_ICONS[vehicle.cargoType]}
                <span className="text-sm font-semibold text-white/85">{vehicle.id}</span>
              </div>
              <div className="grid grid-cols-2 gap-y-1.5 text-[11px]">
                <span style={{ color: 'var(--text-muted)' }}>화물 유형</span>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {vehicle.cargoType === 'frozen' ? '냉동' : vehicle.cargoType === 'ambient' ? '상온' : vehicle.cargoType === 'hazmat' ? '위험물' : '벌크'}
                </span>
                <span style={{ color: 'var(--text-muted)' }}>도착 시각</span>
                <span style={{ color: 'var(--text-secondary)' }}>{vehicle.arrivalTime}</span>
                <span style={{ color: 'var(--text-muted)' }}>완료 예정</span>
                <span style={{ color: 'var(--text-secondary)' }}>{dock.estimatedCompletionTime ?? '—'}</span>
              </div>
              {dock.unloadingProgress > 0 && (
                <div className="mt-2.5">
                  <div className="flex justify-between text-[10px] mb-1">
                    <span style={{ color: 'var(--text-muted)' }}>하차 진행률</span>
                    <span style={{ color: 'var(--accent-primary)' }}>{dock.unloadingProgress}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${dock.unloadingProgress}%`, background: 'var(--accent-primary)' }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>배정된 차량 없음</p>
          )}
        </div>

        {/* 도크 가동률 */}
        <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>가동률</span>
            <span className="text-xs font-mono font-semibold" style={{ color: 'var(--accent-primary)' }}>
              {dock.utilizationRate}%
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${dock.utilizationRate}%`,
                background: dock.utilizationRate >= 85 ? '#10b981' : dock.utilizationRate >= 70 ? '#f59e0b' : '#ef4444',
              }}
            />
          </div>
        </div>

        {/* 설비 알람 */}
        {dockAlerts.length > 0 && (
          <div className="px-4 py-3">
            <div className="flex items-center gap-1.5 mb-2">
              <RiToolsLine size={11} style={{ color: 'var(--text-muted)' }} />
              <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>설비 알림</span>
            </div>
            {dockAlerts.map((al) => (
              <div key={al.id} className="rounded p-2 text-[11px]"
                style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
                <div className="font-medium text-red-400 mb-0.5">{al.alertType}</div>
                <div style={{ color: 'var(--text-secondary)' }}>{al.message}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
