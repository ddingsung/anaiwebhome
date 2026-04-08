import type { DefectLogEntry, KPISnapshot, KPIState, TimelineEvent } from '@sq/lib/types/inspection'
import { ChartSection } from './ChartSection'
import { DefectLogSection } from './DefectLogSection'
import { EventTimeline } from './EventTimeline'
import { KPISection } from './KPISection'

interface Props {
  kpi: KPIState
  defectLog: DefectLogEntry[]
  timeline: TimelineEvent[]
  history: KPISnapshot[]
  acknowledgedIds: Set<string>
  yieldThreshold: number
  onSelectDefect: (entry: DefectLogEntry) => void
}

export function AnalyticsPanel({
  kpi,
  defectLog,
  timeline,
  history,
  acknowledgedIds,
  yieldThreshold,
  onSelectDefect,
}: Props) {
  return (
    <div className="w-full h-full flex flex-col min-h-0">
      <KPISection kpi={kpi} yieldThreshold={yieldThreshold} />
      <ChartSection history={history} defectLog={defectLog} yieldThreshold={yieldThreshold} />
      <DefectLogSection
        defectLog={defectLog}
        acknowledgedIds={acknowledgedIds}
        onSelect={onSelectDefect}
      />
      <EventTimeline timeline={timeline} />
    </div>
  )
}
