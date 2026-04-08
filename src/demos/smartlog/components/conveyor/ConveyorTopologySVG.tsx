'use client';

import { useAppStore } from '@sl/store/useAppStore';
import { clsx } from 'clsx';
import type { NodeStatus, ConveyorNodeType } from '@sl/types';

type LayerMode = 'throughput' | 'equipment' | 'backlog';

const STATUS_COLOR: Record<NodeStatus, string> = {
  normal:   '#10b981',
  warning:  '#f59e0b',
  critical: '#ef4444',
  error:    '#dc2626',
  idle:     '#374151',
};

const STATUS_BG: Record<NodeStatus, string> = {
  normal:   'rgba(16,185,129,0.15)',
  warning:  'rgba(245,158,11,0.15)',
  critical: 'rgba(239,68,68,0.20)',
  error:    'rgba(220,38,38,0.20)',
  idle:     'rgba(55,65,81,0.40)',
};

const NODE_SHAPE: Record<ConveyorNodeType, string> = {
  sorter:   '◇',
  merge:    '⬡',
  buffer:   '▭',
  diverter: '◈',
  straight: '─',
  zone:     '▣',
};

interface ConveyorTopologySVGProps {
  layer: LayerMode;
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
}

export default function ConveyorTopologySVG({ layer, selectedNodeId, onSelectNode }: ConveyorTopologySVGProps) {
  const { conveyorNodes, conveyorEdges } = useAppStore();

  const getNodeColor = (nodeId: string) => {
    const node = conveyorNodes.find((n) => n.id === nodeId);
    if (!node) return '#374151';
    if (layer === 'throughput') {
      const pct = node.utilizationRate;
      if (pct >= 90) return '#ef4444';
      if (pct >= 75) return '#f59e0b';
      return '#10b981';
    }
    if (layer === 'backlog') {
      if (node.backlog > 30) return '#ef4444';
      if (node.backlog > 15) return '#f59e0b';
      return '#10b981';
    }
    return STATUS_COLOR[node.status];
  };

  const getEdgeColor = (edgeId: string) => {
    const edge = conveyorEdges.find((e) => e.id === edgeId);
    if (!edge) return 'rgba(255,255,255,0.1)';
    if (!edge.active) return 'rgba(255,255,255,0.05)';
    if (edge.isAlternatePath) return 'rgba(6,182,212,0.4)';
    return 'rgba(255,255,255,0.2)';
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <svg viewBox="0 0 920 310" className="w-full h-full" style={{ maxHeight: '300px' }}>
        {/* 배경 그리드 */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
          </pattern>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="rgba(255,255,255,0.25)" />
          </marker>
          <marker id="arrowhead-cyan" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="rgba(6,182,212,0.6)" />
          </marker>
        </defs>
        <rect width="920" height="310" fill="url(#grid)" />

        {/* 엣지 (연결선) */}
        {conveyorEdges.map((edge) => {
          const src = conveyorNodes.find((n) => n.id === edge.source);
          const dst = conveyorNodes.find((n) => n.id === edge.target);
          if (!src || !dst) return null;

          // 노드 중심점 계산 (SVG 스케일: position.x * ~1.0 + 오프셋)
          const sx = src.position.x * 1.15 + 30;
          const sy = src.position.y * 1.0 + 55;
          const dx = dst.position.x * 1.15 + 30;
          const dy = dst.position.y * 1.0 + 55;

          const strokeColor = edge.isAlternatePath
            ? 'rgba(6,182,212,0.45)'
            : edge.active
            ? 'rgba(255,255,255,0.18)'
            : 'rgba(255,255,255,0.04)';

          return (
            <line
              key={edge.id}
              x1={sx} y1={sy} x2={dx} y2={dy}
              stroke={strokeColor}
              strokeWidth={edge.isAlternatePath ? 1.5 : 1}
              strokeDasharray={!edge.active ? '4 3' : edge.isAlternatePath ? '6 2' : 'none'}
              markerEnd={edge.active ? (edge.isAlternatePath ? 'url(#arrowhead-cyan)' : 'url(#arrowhead)') : undefined}
            />
          );
        })}

        {/* 노드 */}
        {conveyorNodes.map((node) => {
          const cx = node.position.x * 1.15 + 30;
          const cy = node.position.y * 1.0 + 55;
          const color = getNodeColor(node.id);
          const bg = STATUS_BG[node.status];
          const isSelected = selectedNodeId === node.id;
          const isCritical = node.status === 'critical';

          const nodeW = node.type === 'zone' ? 100 : node.type === 'buffer' ? 88 : 78;
          const nodeH = 54;

          return (
            <g
              key={node.id}
              onClick={() => onSelectNode(node.id)}
              style={{ cursor: 'pointer' }}
            >
              {/* 선택 링 */}
              {isSelected && (
                <rect
                  x={cx - nodeW / 2 - 3} y={cy - nodeH / 2 - 3}
                  width={nodeW + 6} height={nodeH + 6}
                  rx="7" fill="none"
                  stroke="rgba(6,182,212,0.6)" strokeWidth="1.5"
                />
              )}

              {/* critical 펄스 링 */}
              {isCritical && (
                <rect
                  x={cx - nodeW / 2 - 2} y={cy - nodeH / 2 - 2}
                  width={nodeW + 4} height={nodeH + 4}
                  rx="6" fill="none"
                  stroke="rgba(239,68,68,0.4)" strokeWidth="1"
                >
                  <animate attributeName="opacity" values="1;0.2;1" dur="1.5s" repeatCount="indefinite" />
                </rect>
              )}

              {/* 노드 박스 */}
              <rect
                x={cx - nodeW / 2} y={cy - nodeH / 2}
                width={nodeW} height={nodeH}
                rx="5"
                fill={bg}
                stroke={isSelected ? '#06b6d4' : color}
                strokeWidth={isSelected ? 1.5 : 1}
              />

              {/* 처리량 바 */}
              <rect
                x={cx - nodeW / 2 + 3} y={cy + nodeH / 2 - 5}
                width={nodeW - 6} height={3}
                rx="1.5" fill="rgba(255,255,255,0.06)"
              />
              <rect
                x={cx - nodeW / 2 + 3} y={cy + nodeH / 2 - 5}
                width={(nodeW - 6) * node.utilizationRate / 100} height={3}
                rx="1.5" fill={color}
              />

              {/* 노드 레이블 */}
              <text x={cx} y={cy - 7} textAnchor="middle" fontSize="12"
                fill="rgba(255,255,255,0.70)" fontWeight="500">
                {node.id}
              </text>

              {/* 수치 */}
              <text x={cx} y={cy + 12} textAnchor="middle" fontSize="15"
                fill={color} fontWeight="700">
                {layer === 'backlog' ? `${node.backlog}박스` : `${node.utilizationRate}%`}
              </text>
            </g>
          );
        })}

        {/* 범례 */}
        <g transform="translate(730, 10)">
          <rect width="165" height="56" rx="4" fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
          {[
            { color: '#10b981', label: '정상 (< 75%)' },
            { color: '#f59e0b', label: '주의 (75~90%)' },
            { color: '#ef4444', label: '병목 (> 90%)' },
          ].map((item, i) => (
            <g key={i} transform={`translate(10, ${12 + i * 14})`}>
              <rect width="8" height="8" rx="2" fill={`${item.color}33`} stroke={item.color} strokeWidth="0.8" />
              <text x="14" y="7.5" fontSize="8" fill="rgba(255,255,255,0.45)">{item.label}</text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
