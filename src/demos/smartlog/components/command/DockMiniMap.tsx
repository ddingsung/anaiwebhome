'use client';

import { useRouter } from 'next/navigation';
import { useAppStore } from '@sl/store/useAppStore';
import { clsx } from 'clsx';
import type { DockStatus } from '@sl/types';
import { RiLayoutGridLine } from 'react-icons/ri';
import PanelHeader from '@sl/components/ui/PanelHeader';

const STATUS_COLORS: Record<DockStatus, string> = {
  operating:   'bg-emerald-500/20 border-emerald-500/40 text-emerald-400',
  congested:   'bg-red-500/20 border-red-500/40 text-red-400',
  idle:        'bg-white/5 border-white/10 text-white/25',
  error:       'bg-red-500/15 border-red-500/30 text-red-500',
  maintenance: 'bg-amber-500/10 border-amber-500/25 text-amber-500/60',
};

const STATUS_LABEL: Record<DockStatus, string> = {
  operating:   '운영중',
  congested:   '혼잡',
  idle:        '대기',
  error:       '오류',
  maintenance: '점검',
};

export default function DockMiniMap() {
  const { docks } = useAppStore();
  const router = useRouter();

  const operatingCount = docks.filter((d) => d.status === 'operating').length;
  const congestedCount = docks.filter((d) => d.status === 'congested').length;
  const idleCount = docks.filter((d) => d.status === 'idle').length;

  return (
    <div
      className="flex flex-col h-full cursor-pointer group"
      onClick={() => router.push('/dock')}
    >
      <PanelHeader
        icon={<RiLayoutGridLine size={12} />}
        title="도크 현황"
        description="도크별 운영 상태 및 차량 배정 현황"
        badge={
          <div className="flex items-center gap-2 text-[10px]">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span style={{ color: 'var(--text-muted)' }}>운영 {operatingCount}</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <span style={{ color: 'var(--text-muted)' }}>혼잡 {congestedCount}</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <span style={{ color: 'var(--text-muted)' }}>대기 {idleCount}</span>
            </span>
          </div>
        }
      />

      {/* 도크 그리드 */}
      <div className="flex-1 p-3 grid grid-cols-3 gap-2" style={{ gridAutoRows: '1fr' }}>
        {docks.map((dock) => (
          <div
            key={dock.id}
            className={clsx(
              'rounded px-1.5 border text-center flex flex-col justify-center',
              STATUS_COLORS[dock.status],
              dock.status === 'congested' && 'animate-pulse-warning'
            )}
          >
            <div className="text-[10px] font-semibold">{dock.id}</div>
            <div className="text-[9px] mt-0.5 opacity-70 truncate">
              {dock.currentVehicleId ?? STATUS_LABEL[dock.status]}
            </div>
            <div className="mt-1 h-0.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-current opacity-50"
                style={{ width: `${dock.unloadingProgress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-2 text-[10px] text-center opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: 'var(--accent-primary)' }}>
        클릭하여 도크 상세 보기 →
      </div>
    </div>
  );
}
