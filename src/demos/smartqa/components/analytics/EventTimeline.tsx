// components/analytics/EventTimeline.tsx
import type { EventType, TimelineEvent } from '@sq/lib/types/inspection'

interface Props {
  timeline: TimelineEvent[]
}

const EVENT_COLOR: Record<EventType, string> = {
  detect:      '#d94040',
  reject:      '#e8a820',
  acknowledge: '#4f86cc',
  system:      '#4b5563',
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('ko-KR', {
    hour12: false,
    hour:   '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function EventTimeline({ timeline }: Props) {
  return (
    <div
      className="flex-none [@media(max-height:768px)]:hidden flex flex-col overflow-hidden"
      style={{ height: 'clamp(80px, 15vh, 120px)' }}
    >
      {/* 섹션 라벨 */}
      <div className="flex-none px-3 py-1 border-b border-border">
        <p className="text-[10px] font-medium uppercase tracking-widest text-text-muted">
          Event Timeline
        </p>
      </div>

      {/* 이벤트 목록 */}
      <div className="flex-1 overflow-y-auto min-h-0 px-3 py-1 flex flex-col gap-0.5">
        {timeline.length === 0 ? (
          <span className="text-xs text-text-muted mt-1">Waiting for events…</span>
        ) : (
          timeline.slice(0, 8).map((event) => (
            <div key={event.id} className="flex items-center gap-2">
              <span
                className="flex-none rounded-full"
                style={{ width: 6, height: 6, backgroundColor: EVENT_COLOR[event.type] }}
              />
              <span className="text-[10px] text-text-muted num flex-none">
                {formatTime(event.timestamp)}
              </span>
              <span className="text-[10px] text-text-secondary truncate">{event.label}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
