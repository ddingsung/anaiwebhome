'use client'

import { useState } from 'react'
import { useInspectionDemo } from '@sq/hooks/useInspectionDemo'
import { useSystemTelemetry } from '@sq/hooks/useSystemTelemetry'
import { useChartHistory } from '@sq/hooks/useChartHistory'
import { TopBar } from '@sq/components/topbar/TopBar'
import { InspectionViewer } from '@sq/components/viewer/InspectionViewer'
import { AnalyticsPanel } from '@sq/components/analytics/AnalyticsPanel'
import { SystemStatusBar } from '@sq/components/status/SystemStatusBar'
import { DefectModal } from '@sq/components/analytics/DefectModal'
import type { DefectLogEntry, TimelineEvent } from '@sq/lib/types/inspection'

function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}

export default function SmartQAPage() {
  const { frame, kpi, defectLog, timeline, isPaused, config, setConfig, togglePause, reset } =
    useInspectionDemo()
  const telemetry = useSystemTelemetry()
  const history = useChartHistory(kpi)

  const [selectedDefect, setSelectedDefect] = useState<DefectLogEntry | null>(null)
  const [acknowledgedIds, setAcknowledgedIds] = useState<Set<string>>(new Set())
  const [ackEvents, setAckEvents] = useState<TimelineEvent[]>([])
  const [yieldThreshold, setYieldThreshold] = useState(95)
  const isAlarm = kpi.totalCount > 0 && kpi.yieldRate < yieldThreshold

  const mergedTimeline = [...ackEvents, ...timeline]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 50)

  function handleReset() {
    setSelectedDefect(null)
    setAcknowledgedIds(new Set())
    setAckEvents([])
    reset()
  }

  function handleDownloadReport() {
    const report = {
      generatedAt: new Date().toISOString(),
      kpi,
      config: { ...config, yieldThreshold },
      defectLog,
      timeline: mergedTimeline,
    }
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `smart-qa-report-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleAcknowledge(id: string) {
    const defectType = selectedDefect?.defectType ?? ''
    setAcknowledgedIds(prev => new Set(prev).add(id))
    setAckEvents(prev =>
      [
        {
          id: uid(),
          timestamp: Date.now(),
          type: 'acknowledge' as const,
          label: `확인 처리: ${defectType}`,
          state: 'normal' as const,
        },
        ...prev,
      ].slice(0, 10),
    )
    setSelectedDefect(null)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#0d0f11] overflow-hidden">
      <TopBar
        frame={frame}
        telemetry={telemetry}
        config={config}
        isPaused={isPaused}
        yieldThreshold={yieldThreshold}
        isAlarm={isAlarm}
        onConfigChange={setConfig}
        onTogglePause={togglePause}
        onThresholdChange={setYieldThreshold}
        onDownloadReport={handleDownloadReport}
        onReset={handleReset}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="w-[65%] h-full bg-[#131619] border-r border-[#1e2329] overflow-hidden">
          <InspectionViewer frame={frame} />
        </div>

        <div className="w-[35%] h-full flex flex-col min-h-0 overflow-hidden">
          <AnalyticsPanel
            kpi={kpi}
            defectLog={defectLog}
            timeline={mergedTimeline}
            history={history}
            acknowledgedIds={acknowledgedIds}
            yieldThreshold={yieldThreshold}
            onSelectDefect={setSelectedDefect}
          />
        </div>
      </div>

      <SystemStatusBar telemetry={telemetry} />

      {selectedDefect && (
        <DefectModal
          defect={selectedDefect}
          onClose={() => setSelectedDefect(null)}
          onAcknowledge={handleAcknowledge}
        />
      )}
    </div>
  )
}
