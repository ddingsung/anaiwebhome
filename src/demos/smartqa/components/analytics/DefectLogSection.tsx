// components/analytics/DefectLogSection.tsx
import type { DefectLogEntry, DefectType } from '@sq/lib/types/inspection'

interface Props {
  defectLog: DefectLogEntry[]
  acknowledgedIds: Set<string>
  onSelect: (entry: DefectLogEntry) => void
}

const DEFECT_COLOR: Record<DefectType, string> = {
  SCRATCH: '#e8a820',
  VOID:    '#d94040',
  OPEN:    '#4f86cc',
  CRACK:   '#d94040',
  BRIDGE:  '#e07830',
  FOREIGN: '#8a8a8a',
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('ko-KR', {
    hour12: false,
    hour:   '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function DefectLogSection({ defectLog, acknowledgedIds, onSelect }: Props) {
  return (
    <div className="flex-1 min-h-0 flex flex-col border-b border-border overflow-hidden">
      {/* 섹션 라벨 */}
      <div className="flex-none px-3 py-1.5 border-b border-border">
        <p className="text-[10px] font-medium uppercase tracking-widest text-text-muted">
          Defect Log
        </p>
      </div>

      {/* 목록 */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {defectLog.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-xs text-text-muted">No defects detected</span>
          </div>
        ) : (
          defectLog.map((entry) => {
            const acked = acknowledgedIds.has(entry.id)
            return (
              <div
                key={entry.id}
                className={`flex items-center gap-2 px-3 py-1.5 border-b border-border cursor-pointer hover:bg-border/30 transition-colors ${
                  acked ? 'opacity-40' : ''
                }`}
                onClick={() => onSelect(entry)}
              >
                {/* Thumbnail / fallback */}
                <div
                  className="flex-none w-8 h-8 rounded flex items-center justify-center text-[10px] font-bold text-bg"
                  style={{ backgroundColor: DEFECT_COLOR[entry.defectType] }}
                >
                  {entry.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={entry.thumbnailUrl}
                      alt={entry.defectType}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    entry.defectType[0]
                  )}
                </div>

                {/* 정보 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-xs font-medium ${acked ? 'line-through text-text-muted' : 'text-text-secondary'}`}>
                      {entry.defectType}
                    </span>
                    <span className="text-xs text-text-muted num">
                      {(entry.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <span className="text-[10px] text-text-muted num">{formatTime(entry.timestamp)}</span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
