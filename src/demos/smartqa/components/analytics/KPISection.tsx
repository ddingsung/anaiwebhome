// components/analytics/KPISection.tsx
import type { DefectType, KPIState } from '@sq/lib/types/inspection'

interface Props {
  kpi: KPIState
  yieldThreshold: number
}

const DEFECT_LABEL: Record<DefectType, string> = {
  SCRATCH: 'Scratch',
  VOID:    'Void',
  OPEN:    'Open',
  CRACK:   'Crack',
  BRIDGE:  'Bridge',
  FOREIGN: 'Foreign',
}

export function KPISection({ kpi, yieldThreshold }: Props) {
  const isAlarm = kpi.yieldRate < yieldThreshold
  return (
    <div className="flex-none px-3 py-3 border-b border-border">
      {/* 섹션 라벨 */}
      <p className="text-[10px] font-medium uppercase tracking-widest text-text-muted mb-2">
        Inspection KPI
      </p>

      {/* 수율 */}
      <div className="flex items-baseline gap-1 mb-2">
        <span className={`text-4xl font-bold num ${isAlarm ? 'text-state-warn' : 'text-text-primary'}`}>
          {kpi.yieldRate.toFixed(2)}
        </span>
        <span className="text-sm font-medium text-text-secondary">%</span>
        <span className="text-xs text-text-muted ml-1">yield</span>
        {isAlarm && (
          <span className="ml-auto text-[10px] font-medium text-state-warn uppercase tracking-widest">
            ⚠ ALARM
          </span>
        )}
      </div>

      {/* 카운트 */}
      <div className="flex gap-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-medium uppercase tracking-widest text-text-muted">Total</span>
          <span className="text-sm font-medium text-text-secondary num">{kpi.totalCount}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-medium uppercase tracking-widest text-text-muted">OK</span>
          <span className="text-sm font-medium text-state-normal num">{kpi.okCount}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-medium uppercase tracking-widest text-text-muted">NG</span>
          <span className="text-sm font-medium text-state-ng num">{kpi.ngCount}</span>
        </div>
        {kpi.topDefectType && (
          <div className="flex flex-col">
            <span className="text-[10px] font-medium uppercase tracking-widest text-text-muted">Top</span>
            <span className="text-xs font-medium text-state-warn">{DEFECT_LABEL[kpi.topDefectType]}</span>
          </div>
        )}
      </div>
    </div>
  )
}
