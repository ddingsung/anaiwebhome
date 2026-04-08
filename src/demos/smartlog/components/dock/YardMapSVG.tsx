'use client';

import { RiMapLine as MapIcon } from 'react-icons/ri';
import { useAppStore } from '@sl/store/useAppStore';
import type { DockStatus } from '@sl/types';
import PanelHeader from '@sl/components/ui/PanelHeader';

const DOCK_STATUS_FILL: Record<DockStatus, string> = {
  operating:   '#10b981',
  congested:   '#ef4444',
  idle:        '#374151',
  error:       '#dc2626',
  maintenance: '#d97706',
};

const DOCK_STATUS_STROKE: Record<DockStatus, string> = {
  operating:   '#34d399',
  congested:   '#f87171',
  idle:        '#4b5563',
  error:       '#f87171',
  maintenance: '#fbbf24',
};

interface DockRect {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
}

const DOCK_POSITIONS: DockRect[] = [
  { id: 'D1', x: 30,  y: 60,  w: 60, h: 40, label: 'D1' },
  { id: 'D2', x: 110, y: 60,  w: 60, h: 40, label: 'D2' },
  { id: 'D3', x: 190, y: 60,  w: 60, h: 40, label: 'D3' },
  { id: 'D4', x: 270, y: 60,  w: 60, h: 40, label: 'D4' },
  { id: 'D5', x: 350, y: 60,  w: 60, h: 40, label: 'D5' },
  { id: 'D6', x: 30,  y: 170, w: 60, h: 40, label: 'D6' },
  { id: 'D7', x: 110, y: 170, w: 60, h: 40, label: 'D7' },
  { id: 'D8', x: 190, y: 170, w: 60, h: 40, label: 'D8' },
  { id: 'D9', x: 270, y: 170, w: 60, h: 40, label: 'D9' },
];

// 대기 구역 차량 위치
const WAITING_SPOTS = [
  { x: 60, y: 260 }, { x: 130, y: 260 }, { x: 200, y: 260 },
  { x: 270, y: 260 }, { x: 340, y: 260 },
];

interface YardMapSVGProps {
  selectedDockId: string | null;
  onSelectDock: (id: string) => void;
}

export default function YardMapSVG({ selectedDockId, onSelectDock }: YardMapSVGProps) {
  const { docks, vehicles } = useAppStore();

  const waitingVehicles = vehicles.filter(
    (v) => v.status === 'waiting' || v.status === 'approaching'
  );

  return (
    <div className="flex flex-col h-full">
      <PanelHeader
        icon={<MapIcon size={12} />}
        title="야드 배치도"
        description="차량 위치 및 도크 연결 현황"
        badge={
          <div className="flex items-center gap-2 text-[10px]" style={{ color: 'var(--text-muted)' }}>
            {[
              { color: '#10b981', label: '운영중' },
              { color: '#ef4444', label: '혼잡' },
              { color: '#4b5563', label: '대기' },
              { color: '#d97706', label: '점검' },
            ].map(({ color, label }) => (
              <span key={label} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm" style={{ background: color }} />
                {label}
              </span>
            ))}
          </div>
        }
      />

      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <svg
          viewBox="0 0 460 320"
          className="w-full h-full"
          style={{ maxHeight: '280px' }}
        >
          {/* 창고 벽 */}
          <rect x="10" y="20" width="440" height="80" rx="4"
            fill="rgba(255,255,255,0.03)"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
          <rect x="10" y="130" width="440" height="80" rx="4"
            fill="rgba(255,255,255,0.03)"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
          <text x="430" y="65" textAnchor="end" fontSize="9" fill="rgba(255,255,255,0.2)">창고 A동</text>
          <text x="430" y="175" textAnchor="end" fontSize="9" fill="rgba(255,255,255,0.2)">창고 B동</text>

          {/* 도로 라인 */}
          <line x1="10" y1="120" x2="450" y2="120"
            stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="10" y1="230" x2="450" y2="230"
            stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />

          {/* 도크 슬롯 */}
          {DOCK_POSITIONS.map((dp) => {
            const dock = docks.find((d) => d.id === dp.id);
            if (!dock) return null;
            const fill = DOCK_STATUS_FILL[dock.status];
            const stroke = DOCK_STATUS_STROKE[dock.status];
            const isSelected = selectedDockId === dp.id;
            const isCongested = dock.status === 'congested';

            return (
              <g key={dp.id} onClick={() => onSelectDock(dp.id)} style={{ cursor: 'pointer' }}>
                <rect
                  x={dp.x} y={dp.y} width={dp.w} height={dp.h}
                  rx="3"
                  fill={`${fill}22`}
                  stroke={isSelected ? '#06b6d4' : stroke}
                  strokeWidth={isSelected ? 2 : 1}
                  opacity={isCongested ? undefined : 1}
                >
                  {isCongested && (
                    <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" />
                  )}
                </rect>

                {/* 차량이 있으면 트럭 아이콘 */}
                {dock.currentVehicleId && (
                  <rect
                    x={dp.x + dp.w / 2 - 10} y={dp.y + 6} width={20} height={14}
                    rx="2" fill={fill} opacity="0.6"
                  />
                )}

                <text x={dp.x + dp.w / 2} y={dp.y + dp.h - 8}
                  textAnchor="middle" fontSize="10" fontWeight="600"
                  fill={isSelected ? '#06b6d4' : 'rgba(255,255,255,0.7)'}
                >
                  {dp.label}
                </text>

                {/* 하차 진행 바 */}
                {dock.unloadingProgress > 0 && (
                  <>
                    <rect x={dp.x + 4} y={dp.y + dp.h - 5} width={dp.w - 8} height={2}
                      rx="1" fill="rgba(255,255,255,0.08)" />
                    <rect x={dp.x + 4} y={dp.y + dp.h - 5}
                      width={(dp.w - 8) * dock.unloadingProgress / 100} height={2}
                      rx="1" fill={fill} />
                  </>
                )}
              </g>
            );
          })}

          {/* 대기 구역 라벨 */}
          <text x="20" y="255" fontSize="9" fill="rgba(255,255,255,0.2)">대기 구역</text>

          {/* 대기 차량 */}
          {WAITING_SPOTS.map((spot, idx) => {
            const vehicle = waitingVehicles[idx];
            if (!vehicle) {
              return (
                <rect key={idx} x={spot.x - 15} y={spot.y} width={30} height={20}
                  rx="2" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="1"
                  strokeDasharray="3 2" />
              );
            }
            const isUrgent = vehicle.priority === 'urgent';
            const isFrozen = vehicle.cargoType === 'frozen';
            return (
              <g key={vehicle.id}>
                <rect
                  x={spot.x - 15} y={spot.y} width={30} height={20}
                  rx="2"
                  fill={isUrgent ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.08)'}
                  stroke={isUrgent ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.15)'}
                  strokeWidth="1"
                />
                <text x={spot.x} y={spot.y + 9} textAnchor="middle" fontSize="7"
                  fill={isUrgent ? '#fca5a5' : 'rgba(255,255,255,0.5)'} fontWeight="600">
                  {vehicle.id.slice(-4)}
                </text>
                {isFrozen && (
                  <text x={spot.x + 11} y={spot.y + 6} fontSize="7" fill="#93c5fd">❄</text>
                )}
                {isUrgent && (
                  <circle cx={spot.x - 11} cy={spot.y + 4} r="3" fill="#ef4444">
                    <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />
                  </circle>
                )}
              </g>
            );
          })}

          {/* 차량 진입 화살표 */}
          <path d="M 420 270 L 410 260 L 415 260 L 415 248 L 425 248 L 425 260 L 430 260 Z"
            fill="rgba(6,182,212,0.2)" stroke="rgba(6,182,212,0.4)" strokeWidth="0.5" />
          <text x="415" y="288" textAnchor="middle" fontSize="8" fill="rgba(6,182,212,0.5)">입구</text>
        </svg>
      </div>
    </div>
  );
}
