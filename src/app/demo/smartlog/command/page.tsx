'use client';

import AiActionFeed from '@sl/components/command/AiActionFeed';
import DockMiniMap from '@sl/components/command/DockMiniMap';
import ConveyorMiniMap from '@sl/components/command/ConveyorMiniMap';
import EquipAlertPanel from '@sl/components/command/EquipAlertPanel';
import CommandKpis from '@sl/components/command/CommandKpis';

export default function CommandPage() {

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Tier 1: KPI 요약 */}
      <div data-tour="cmd-kpi"><CommandKpis /></div>

      {/* Tier 2 + 3: 메인 패널 */}
      <div
        className="flex flex-1 min-h-0 overflow-hidden"
        style={{ gap: '2px', background: 'rgba(255,255,255,0.07)' }}
      >
        {/* Tier 3: AI 액션 피드 (보조) */}
        <div
          data-tour="cmd-ai-feed"
          className="w-[220px] lg:w-[240px] xl:w-[270px] shrink-0 overflow-hidden"
          style={{ background: 'var(--bg-base)' }}
        >
          <AiActionFeed />
        </div>

        {/* Tier 2: 도크 현황 (운영 핵심) */}
        <div
          data-tour="cmd-dock"
          className="flex-1 min-w-0 overflow-hidden"
          style={{ borderTop: '2px solid rgba(6,182,212,0.30)', background: 'var(--bg-surface, var(--bg-elevated))' }}
        >
          <DockMiniMap />
        </div>

        {/* Tier 2: 컨베이어 흐름 — lg 이상에서만 표시 */}
        <div
          data-tour="cmd-conveyor"
          className="hidden lg:block lg:w-[190px] xl:w-[220px] shrink-0 overflow-hidden"
          style={{
            borderTop: '2px solid rgba(6,182,212,0.30)',
            borderLeft: '1px solid rgba(6,182,212,0.12)',
            background: 'var(--bg-surface, var(--bg-elevated))',
          }}
        >
          <ConveyorMiniMap />
        </div>

        {/* Tier 3: 설비 알림 — lg 이상에서만 표시 */}
        <div
          data-tour="cmd-alerts"
          className="hidden lg:block lg:w-[190px] xl:w-[220px] shrink-0 overflow-hidden"
          style={{ background: 'var(--bg-base)' }}
        >
          <EquipAlertPanel />
        </div>
      </div>

    </div>
  );
}
