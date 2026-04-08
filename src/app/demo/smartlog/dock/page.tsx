'use client';

import { useState } from 'react';
import YardMapSVG from '@sl/components/dock/YardMapSVG';
import DockSlotGrid from '@sl/components/dock/DockSlotGrid';
import WaitingVehicleQueue from '@sl/components/dock/WaitingVehicleQueue';
import AiDockRecommendCard from '@sl/components/dock/AiDockRecommendCard';
import DockDetailDrawer from '@sl/components/dock/DockDetailDrawer';
import { useAppStore } from '@sl/store/useAppStore';
import DockGanttChart from '@sl/components/dock/DockGanttChart';

export default function DockPage() {
  const [selectedDockId, setSelectedDockId] = useState<string | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const { actions } = useAppStore();

  const pendingDockAction = actions.find(
    (a) => a.type === 'dock_assignment' && a.status === 'pending'
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* 상단: 3컬럼 레이아웃 */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* 좌: 야드맵 + AI 추천 카드 */}
        <div data-tour="dock-yard" className="flex flex-col w-[320px] lg:w-[360px] xl:w-[420px] shrink-0 overflow-hidden"
          style={{ borderRight: '1px solid var(--border-subtle)' }}>
          <div className="flex-1 overflow-hidden">
            <YardMapSVG
              selectedDockId={selectedDockId}
              onSelectDock={setSelectedDockId}
            />
          </div>
          {pendingDockAction && (
            <div className="p-3 shrink-0" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <AiDockRecommendCard actionId={pendingDockAction.id} />
            </div>
          )}
        </div>

        {/* 중: 도크 슬롯 그리드 */}
        <div data-tour="dock-grid" className="flex-1 overflow-hidden"
          style={{ borderRight: '1px solid var(--border-subtle)' }}>
          <DockSlotGrid
            selectedDockId={selectedDockId}
            onSelectDock={(id) => {
              setSelectedDockId((prev) => (prev === id ? null : id));
            }}
          />
        </div>

        {/* 우: 대기 차량 큐 또는 도크 상세 드로어 */}
        <div data-tour="dock-queue" className="w-[220px] lg:w-[240px] xl:w-[260px] shrink-0 overflow-hidden">
          {selectedDockId ? (
            <DockDetailDrawer
              dockId={selectedDockId}
              onClose={() => setSelectedDockId(null)}
            />
          ) : (
            <WaitingVehicleQueue
              selectedVehicleId={selectedVehicleId}
              onSelectVehicle={setSelectedVehicleId}
            />
          )}
        </div>
      </div>

      {/* 하단: 간트 차트 */}
      <div data-tour="dock-gantt"><DockGanttChart /></div>
    </div>
  );
}
