'use client';

import { useRouter } from 'next/navigation';
import { useAppStore } from '@sl/store/useAppStore';
import { RiPulseLine } from 'react-icons/ri';
import PanelHeader from '@sl/components/ui/PanelHeader';
import { ProgressBar } from '@sl/components/tremor/ProgressBar';
import type { NodeStatus } from '@sl/types';

const STATUS_VARIANT: Record<NodeStatus, 'success' | 'warning' | 'error' | 'neutral'> = {
  normal:   'success',
  warning:  'warning',
  critical: 'error',
  error:    'error',
  idle:     'neutral',
};

const STATUS_COLOR: Record<NodeStatus, string> = {
  normal:   '#10b981',
  warning:  '#f59e0b',
  critical: '#ef4444',
  error:    '#ef4444',
  idle:     'var(--text-muted)',
};

export default function ConveyorMiniMap() {
  const { conveyorNodes } = useAppStore();
  const router = useRouter();

  const criticalNodes = conveyorNodes.filter((n) => n.status === 'critical');
  const warningNodes = conveyorNodes.filter((n) => n.status === 'warning');

  return (
    <div
      className="flex flex-col h-full cursor-pointer group"
      onClick={() => router.push('/conveyor')}
    >
      <PanelHeader
        icon={<RiPulseLine size={12} />}
        title="컨베이어 흐름"
        description="구간별 처리량 및 병목 현황"
        badge={
          <div className="flex items-center gap-2 text-[10px]">
            {criticalNodes.length > 0 && (
              <span className="flex items-center gap-1 text-red-400">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse-critical" />
                병목 {criticalNodes.length}
              </span>
            )}
            {warningNodes.length > 0 && (
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                주의 {warningNodes.length}
              </span>
            )}
          </div>
        }
      />

      <div className="flex-1 px-4 py-3 flex flex-col justify-between overflow-hidden">
        {conveyorNodes.map((node) => (
          <div key={node.id} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[13px] truncate" style={{ color: 'var(--text-secondary)' }}>
                {node.label}
              </span>
              <span
                className="text-sm font-mono font-bold ml-2 shrink-0"
                style={{ color: STATUS_COLOR[node.status] }}
              >
                {node.utilizationRate}%
              </span>
            </div>
            <ProgressBar
              value={node.utilizationRate}
              variant={STATUS_VARIANT[node.status]}
              showAnimation
            />
          </div>
        ))}
      </div>

      <div
        className="px-4 py-2 text-[10px] text-center opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: 'var(--accent-primary)' }}
      >
        클릭하여 컨베이어 상세 보기 →
      </div>
    </div>
  );
}
