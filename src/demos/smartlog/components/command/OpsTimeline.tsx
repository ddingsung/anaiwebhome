'use client';

import { useAppStore } from '@sl/store/useAppStore';
import { clsx } from 'clsx';
import type { OpsEvent } from '@sl/types';
import { RiTimeLine } from 'react-icons/ri';
import PanelHeader from '@sl/components/ui/PanelHeader';

const EVENT_COLORS: Record<OpsEvent['type'], string> = {
  vehicle_arrival:  'bg-blue-400',
  bottleneck:       'bg-red-400',
  ai_action:        'bg-violet-400',
  equipment_alert:  'bg-amber-400',
  policy_change:    'bg-cyan-400',
};

const SEVERITY_COLORS: Record<string, string> = {
  critical: 'text-red-400',
  warning:  'text-amber-400',
  info:     'text-white/60',
};

export default function OpsTimeline() {
  const { opsEvents } = useAppStore();

  const sorted = [...opsEvents].reverse();

  return (
    <div
      className="flex flex-col h-full"
      style={{ borderTop: '1px solid var(--border-subtle)' }}
    >
      <PanelHeader
        icon={<RiTimeLine size={12} />}
        title="오늘 운영 이벤트"
        description="시간순 운영 이력 타임라인"
        badge={
          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
            {opsEvents.length}건
          </span>
        }
      />

      {/* 타임라인 스크롤 */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex items-center gap-0 h-full px-4 min-w-max">
          {opsEvents.map((event, idx) => (
            <div key={event.id} className="flex items-center">
              {/* 이벤트 노드 */}
              <div className="flex flex-col items-center gap-1 px-3 py-2 group cursor-default relative">
                {/* 시각 */}
                <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                  {event.time}
                </span>

                {/* 점 */}
                <div
                  className={clsx(
                    'w-2.5 h-2.5 rounded-full border-2',
                    EVENT_COLORS[event.type],
                    event.severity === 'critical' && 'animate-pulse-critical'
                  )}
                  style={{ borderColor: 'var(--bg-base)' }}
                />

                {/* 제목 */}
                <span
                  className={clsx(
                    'text-[10px] text-center max-w-[80px] leading-snug',
                    event.severity ? SEVERITY_COLORS[event.severity] : 'text-white/50'
                  )}
                >
                  {event.title}
                </span>

                {/* 호버 툴팁 */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2
                  opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10
                  rounded-lg p-2.5 w-48 text-[10px] leading-relaxed"
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-secondary)',
                  }}>
                  <div className="font-medium text-white/80 mb-1">{event.title}</div>
                  {event.description}
                </div>
              </div>

              {/* 연결선 */}
              {idx < opsEvents.length - 1 && (
                <div className="w-8 h-px" style={{ background: 'var(--border-subtle)' }} />
              )}
            </div>
          ))}

          {/* 현재 시각 표시 */}
          <div className="flex flex-col items-center gap-1 px-3">
            <span className="text-[10px] font-mono" style={{ color: 'var(--accent-primary)' }}>
              현재
            </span>
            <div
              className="w-2.5 h-2.5 rounded-full animate-pulse"
              style={{ background: 'var(--accent-primary)' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
