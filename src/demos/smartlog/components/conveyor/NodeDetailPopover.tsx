'use client';

import { RiCloseLine, RiArrowRightUpLine, RiAlertLine } from 'react-icons/ri';
import { useAppStore } from '@sl/store/useAppStore';
import Badge from '@sl/components/ui/Badge';
import type { NodeStatus } from '@sl/types';

const STATUS_CONFIG: Record<NodeStatus, { label: string; variant: React.ComponentProps<typeof Badge>['variant'] }> = {
  normal:   { label: '정상', variant: 'normal' },
  warning:  { label: '주의', variant: 'warning' },
  critical: { label: '병목', variant: 'critical' },
  error:    { label: '오류', variant: 'critical' },
  idle:     { label: '유휴', variant: 'idle' },
};

interface NodeDetailPopoverProps {
  nodeId: string | null;
  onClose: () => void;
}

export default function NodeDetailPopover({ nodeId, onClose }: NodeDetailPopoverProps) {
  const { conveyorNodes, actions, alerts } = useAppStore();

  if (!nodeId) return null;

  const node = conveyorNodes.find((n) => n.id === nodeId);
  if (!node) return null;

  const sc = STATUS_CONFIG[node.status];
  const relatedAction = actions.find(
    (a) => a.affectedNodeId === nodeId && a.status === 'pending'
  );
  const relatedAlert = alerts.find(
    (a) => a.equipmentId.includes(nodeId) && a.status !== 'resolved'
  );

  const efficiency = Math.round((node.throughput / node.designThroughput) * 100);

  return (
    <div
      className="flex flex-col h-full animate-slide-in-right"
      style={{
        background: 'var(--bg-elevated)',
        borderLeft: '1px solid var(--border-default)',
      }}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white/90">{node.label}</span>
          <Badge variant={sc.variant} size="sm">{sc.label}</Badge>
        </div>
        <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors">
          <RiCloseLine size={15} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {/* 핵심 지표 */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: '현재 처리량', value: `${node.throughput}`, unit: '박스/h', highlight: node.utilizationRate >= 90 },
            { label: '설계 처리량', value: `${node.designThroughput}`, unit: '박스/h', highlight: false },
            { label: '가동률', value: `${node.utilizationRate}%`, unit: '', highlight: node.utilizationRate >= 90 },
            { label: '백로그', value: `${node.backlog}`, unit: '박스', highlight: node.backlog > 20 },
          ].map((item) => (
            <div key={item.label} className="rounded-md p-2.5"
              style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-subtle)' }}>
              <div className="text-[10px] mb-1" style={{ color: 'var(--text-muted)' }}>{item.label}</div>
              <div className="text-sm font-mono font-semibold"
                style={{ color: item.highlight ? '#f87171' : 'rgba(255,255,255,0.85)' }}>
                {item.value}<span className="text-[10px] font-normal ml-0.5"
                  style={{ color: 'var(--text-muted)' }}>{item.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 처리 효율 바 */}
        <div>
          <div className="flex items-center justify-between mb-1.5 text-[11px]">
            <span style={{ color: 'var(--text-muted)' }}>설계 대비 처리 효율</span>
            <span className="font-mono" style={{ color: efficiency >= 90 ? '#f87171' : efficiency >= 75 ? '#fbbf24' : '#34d399' }}>
              {efficiency}%
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${efficiency}%`,
                background: efficiency >= 90 ? '#ef4444' : efficiency >= 75 ? '#f59e0b' : '#10b981',
              }}
            />
          </div>
        </div>

        {/* 설비 알람 */}
        {relatedAlert && (
          <div className="rounded-md p-3"
            style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <div className="flex items-center gap-1.5 mb-1">
              <RiAlertLine size={11} className="text-amber-400" />
              <span className="text-[11px] font-medium text-amber-400">설비 이상 감지</span>
            </div>
            <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
              {relatedAlert.message}
            </p>
          </div>
        )}

        {/* AI 추천 연동 */}
        {relatedAction && (
          <div className="rounded-md p-3"
            style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[11px]">🤖</span>
              <span className="text-[11px] font-medium" style={{ color: '#c4b5fd' }}>AI 조치 추천</span>
            </div>
            <p className="text-[11px] mb-2" style={{ color: 'var(--text-secondary)' }}>
              {relatedAction.title}
            </p>
            <div className="flex gap-1.5 text-[10px]">
              {relatedAction.expectedEffects.map((eff) => (
                <span key={eff.metric} className="px-1.5 py-0.5 rounded"
                  style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}>
                  {eff.metric} {eff.before}→{eff.after}{eff.unit}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 노드 유형 */}
        <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
          <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>노드 유형: </span>
          {node.type}
        </div>
      </div>
    </div>
  );
}
