'use client'

import { useState } from 'react'
import type { InspectionFrame, SystemTelemetry } from '@sq/lib/types/inspection'
import { StatusIndicator } from '@sq/components/ui/StatusIndicator'
import { DemoControlPanel } from '@sq/components/controls/DemoControlPanel'

interface Config {
  ngRate: number
  intervalMs: number
}

interface Props {
  frame: InspectionFrame
  telemetry: SystemTelemetry
  config: Config
  isPaused: boolean
  yieldThreshold: number
  isAlarm: boolean
  onConfigChange: (next: Partial<Config>) => void
  onTogglePause: () => void
  onThresholdChange: (value: number) => void
  onDownloadReport: () => void
  onReset: () => void
}

export function TopBar({
  frame,
  telemetry,
  config,
  isPaused,
  yieldThreshold,
  isAlarm,
  onConfigChange,
  onTogglePause,
  onThresholdChange,
  onDownloadReport,
  onReset,
}: Props) {
  const [open, setOpen] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  function handleDownload() {
    onDownloadReport()
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 1500)
  }

  return (
    <div className="h-[52px] flex-none bg-panel border-b border-border flex items-center px-4 gap-4 relative z-30">
      {/* Left: 운영 컨텍스트 */}
      <div className="flex items-center gap-2.5 flex-none">
        <span className="text-text-primary text-base font-semibold tracking-tight">
          Smart QA Vision
        </span>
        <span className="text-border">|</span>
        <span className="text-text-secondary text-sm">LINE-A</span>
        <span className="text-border">|</span>
        <span className="text-text-secondary text-sm">PCB-V3</span>
      </div>

      {/* Center: 알람 뱃지 + 모델 + Edge 상태 */}
      <div className="flex-1 flex items-center justify-center gap-3">
        {isAlarm && (
          <span className="animate-pulse px-3 py-1 rounded-full bg-state-warn/15 border border-state-warn/50 text-xs font-bold text-state-warn uppercase tracking-widest">
            ⚠ YIELD ALARM
          </span>
        )}
        <span className="text-text-secondary text-xs">
          {telemetry.modelName} {telemetry.modelVersion}
        </span>
        <StatusIndicator state={telemetry.edgeNodeState} label="EDGE" size="sm" />
      </div>

      {/* Right: 추론 성능 + 버튼들 */}
      <div className="flex items-center gap-2 flex-none">
        <span className="text-text-secondary text-xs num">
          {frame.inferenceTimeMs.toFixed(1)}ms
        </span>
        <span className="text-border text-xs">|</span>
        <span className="text-text-secondary text-xs num">
          {frame.fps.toFixed(1)} fps
        </span>
        <button
          className={`ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
            downloaded
              ? 'bg-state-normal/15 text-state-normal border border-state-normal/40'
              : 'bg-border/50 text-text-secondary hover:bg-border hover:text-text-primary border border-transparent'
          }`}
          onClick={handleDownload}
          aria-label="Download session report"
        >
          {downloaded ? '✓ 저장됨' : '↓ 리포트'}
        </button>
        <button
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors border ${
            open
              ? 'bg-border text-text-primary border-text-muted/30'
              : 'bg-border/50 text-text-secondary hover:bg-border hover:text-text-primary border-transparent'
          }`}
          onClick={() => setOpen(v => !v)}
          aria-label="Demo controls"
        >
          ⚙ 설정
        </button>
      </div>

      {/* 드롭다운 */}
      {open && (
        <>
          {/* 바깥 클릭 닫기 */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute top-full right-3 mt-1 z-50">
            <DemoControlPanel
              config={config}
              isPaused={isPaused}
              yieldThreshold={yieldThreshold}
              onConfigChange={onConfigChange}
              onTogglePause={onTogglePause}
              onThresholdChange={onThresholdChange}
              onReset={onReset}
            />
          </div>
        </>
      )}
    </div>
  )
}
