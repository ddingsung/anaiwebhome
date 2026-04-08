'use client';

import { useState } from 'react';
import ConveyorTopologySVG from '@sl/components/conveyor/ConveyorTopologySVG';
import BottleneckAlertPanel from '@sl/components/conveyor/BottleneckAlertPanel';
import NodeDetailPopover from '@sl/components/conveyor/NodeDetailPopover';
import AiConveyorRecommendCard from '@sl/components/conveyor/AiConveyorRecommendCard';
import { useAppStore } from '@sl/store/useAppStore';
import { clsx } from 'clsx';

type LayerMode = 'throughput' | 'equipment' | 'backlog';

const LAYERS: { value: LayerMode; label: string }[] = [
  { value: 'throughput', label: '처리량' },
  { value: 'equipment',  label: '설비 상태' },
  { value: 'backlog',    label: '백로그' },
];

export default function ConveyorPage() {
  const [layer, setLayer] = useState<LayerMode>('throughput');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const { conveyorNodes, actions } = useAppStore();
  const criticalCount = conveyorNodes.filter((n) => n.status === 'critical').length;
  const warningCount  = conveyorNodes.filter((n) => n.status === 'warning').length;
  const totalThroughput = conveyorNodes.filter((n) => n.type === 'zone').reduce((s, n) => s + n.throughput, 0);

  const pendingConveyorAction = actions.find(
    (a) => a.type === 'conveyor_bypass' && a.status === 'pending'
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* 레이어 토글 + 요약 */}
      <div data-tour="conv-layers" className="flex items-center gap-4 px-4 py-2.5 shrink-0"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        {/* 레이어 탭 */}
        <div className="flex items-center gap-1 p-0.5 rounded-md"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
          {LAYERS.map((l) => (
            <button
              key={l.value}
              onClick={() => setLayer(l.value)}
              className={clsx(
                'px-3 py-1 text-xs rounded transition-all',
                layer === l.value ? 'text-white font-medium' : 'hover:text-white/70'
              )}
              style={
                layer === l.value
                  ? { background: 'var(--bg-overlay)', color: 'var(--text-primary)' }
                  : { color: 'var(--text-muted)' }
              }
            >
              {l.label}
            </button>
          ))}
        </div>

        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
          노드별 처리량·설비상태·백로그 실시간 모니터링
        </span>

        {/* 요약 KPI */}
        <div className="flex items-center gap-4 text-[11px] ml-auto">
          <span style={{ color: 'var(--text-muted)' }}>
            총 처리량 <span className="font-mono font-medium text-white/70">{totalThroughput} 박스/h</span>
          </span>
          {criticalCount > 0 && (
            <span className="flex items-center gap-1 text-red-400">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse-critical" />
              병목 {criticalCount}건
            </span>
          )}
          {warningCount > 0 && (
            <span className="flex items-center gap-1 text-amber-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              주의 {warningCount}건
            </span>
          )}
        </div>
      </div>

      {/* 메인 영역 */}
      <div className="flex flex-1 min-h-0">
        {/* 좌: 병목 감지 패널 + AI 추천 */}
        <div data-tour="conv-bottleneck" className="w-[220px] lg:w-[240px] xl:w-[260px] shrink-0 flex flex-col overflow-hidden"
          style={{ borderRight: '1px solid var(--border-subtle)' }}>
          <div className="flex-1 overflow-hidden">
            <BottleneckAlertPanel onSelectNode={setSelectedNodeId} />
          </div>
          {pendingConveyorAction && (
            <div className="p-3 shrink-0" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <AiConveyorRecommendCard actionId={pendingConveyorAction.id} />
            </div>
          )}
        </div>

        {/* 중: 토폴로지 SVG */}
        <div data-tour="conv-topology" className="flex-1 overflow-hidden">
          <ConveyorTopologySVG
            layer={layer}
            selectedNodeId={selectedNodeId}
            onSelectNode={(id) => setSelectedNodeId((prev) => (prev === id ? null : id))}
          />
        </div>

        {/* 우: 노드 상세 (선택시) */}
        {selectedNodeId && (
          <div className="w-[220px] lg:w-[240px] xl:w-[260px] shrink-0 overflow-hidden">
            <NodeDetailPopover
              nodeId={selectedNodeId}
              onClose={() => setSelectedNodeId(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
