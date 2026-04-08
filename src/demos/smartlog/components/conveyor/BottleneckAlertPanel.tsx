'use client';

import { RiAlertLine, RiArrowRightUpLine, RiTimeLine } from 'react-icons/ri';
import { useAppStore } from '@sl/store/useAppStore';
import Badge from '@sl/components/ui/Badge';
import PanelHeader from '@sl/components/ui/PanelHeader';

interface BottleneckAlertPanelProps {
  onSelectNode: (id: string) => void;
}

export default function BottleneckAlertPanel({ onSelectNode }: BottleneckAlertPanelProps) {
  const { conveyorNodes, actions } = useAppStore();

  const bottlenecks = conveyorNodes
    .filter((n) => n.status === 'critical' || n.status === 'warning')
    .sort((a, b) => b.utilizationRate - a.utilizationRate);

  const pendingBypassAction = actions.find(
    (a) => a.type === 'conveyor_bypass' && a.status === 'pending'
  );

  return (
    <div className="flex flex-col h-full">
      <PanelHeader
        icon={<RiAlertLine size={13} className="text-amber-400" />}
        title="병목 감지"
        description="처리 지연 구간 알림"
        badge={
          <Badge
            variant={bottlenecks.some((n) => n.status === 'critical') ? 'critical' : 'warning'}
            dot
          >
            {bottlenecks.length}건
          </Badge>
        }
      />

      <div className="flex-1 overflow-y-auto">
        {bottlenecks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-24 gap-1.5">
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>병목 없음</span>
          </div>
        ) : (
          bottlenecks.map((node) => {
            const isCritical = node.status === 'critical';
            const relatedAction = actions.find(
              (a) => a.affectedNodeId === node.id && a.status === 'pending'
            );

            return (
              <div
                key={node.id}
                className="px-4 py-3 cursor-pointer hover:bg-white/3 transition-colors"
                style={{ borderBottom: '1px solid var(--border-subtle)' }}
                onClick={() => onSelectNode(node.id)}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <RiAlertLine
                    size={12}
                    className={isCritical ? 'text-red-400 animate-pulse-critical' : 'text-amber-400'}
                  />
                  <span className="text-xs font-medium text-white/80 flex-1">{node.label}</span>
                  <Badge variant={isCritical ? 'critical' : 'warning'} size="sm">
                    {isCritical ? '병목' : '주의'}
                  </Badge>
                </div>

                {/* 처리량 */}
                <div className="flex items-center gap-2 mb-1">
                  <RiArrowRightUpLine size={10} style={{ color: isCritical ? '#f87171' : '#fbbf24' }} />
                  <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                    처리량 {node.throughput}/{node.designThroughput} 박스/h
                  </span>
                  <span className="text-[11px] font-mono font-medium"
                    style={{ color: isCritical ? '#f87171' : '#fbbf24' }}>
                    {node.utilizationRate}%
                  </span>
                </div>

                {/* 백로그 */}
                <div className="flex items-center gap-2 mb-2">
                  <RiTimeLine size={10} style={{ color: 'var(--text-muted)' }} />
                  <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    백로그 {node.backlog}박스 (임계 20 {node.backlog > 20 ? '초과' : '이하'})
                  </span>
                </div>

                {/* 처리량 바 */}
                <div className="h-1 rounded-full overflow-hidden mb-2"
                  style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${node.utilizationRate}%`,
                      background: isCritical ? '#ef4444' : '#f59e0b',
                    }}
                  />
                </div>

                {/* AI 추천 연동 */}
                {relatedAction && (
                  <div className="text-[10px] flex items-center gap-1"
                    style={{ color: '#a78bfa' }}>
                    <span>🤖</span>
                    <span>AI 우회 추천 대기 중</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
