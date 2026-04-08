'use client'

// components/status/SystemStatusBar.tsx
import type { SystemTelemetry } from '@sq/lib/types/inspection'
import { StatusIndicator } from '@sq/components/ui/StatusIndicator'

interface Props {
  telemetry: SystemTelemetry
}

function formatCalibration(lastTs: number): string {
  const elapsedMin = Math.max(0, Math.floor((Date.now() - lastTs) / 60000))
  if (elapsedMin < 60) return `${elapsedMin}m ago`
  const h = Math.floor(elapsedMin / 60)
  const m = elapsedMin % 60
  return `${h}h ${m}m ago`
}

export function SystemStatusBar({ telemetry }: Props) {
  return (
    <div className="h-[36px] flex-none bg-panel border-t border-border flex items-center px-3 gap-4">
      {/* Left: 장비 상태 */}
      <div className="flex items-center gap-3 flex-none">
        <StatusIndicator state={telemetry.cameraState} label="CAM" size="sm" />
        <StatusIndicator state={telemetry.plcState}    label="PLC" size="sm" />
      </div>

      <span className="text-border">|</span>

      {/* Center: 시스템 헬스 수치 */}
      <div className="flex items-center gap-3">
        <span className="text-text-secondary text-xs num">
          CPU {telemetry.cpuPercent.toFixed(0)}%
        </span>
        <span className="text-text-secondary text-xs num">
          RAM {telemetry.ramUsedGb.toFixed(1)}GB
        </span>
        <span className="text-text-secondary text-xs num">
          {telemetry.temperatureCelsius.toFixed(0)}°C
        </span>
      </div>

      <span className="text-border">|</span>

      {/* Right: 모델 백엔드 + 캘리브레이션 */}
      <div className="flex items-center gap-3 flex-1 justify-end">
        <span className="text-text-muted text-xs">{telemetry.optimizer}</span>
        <span className="text-text-muted text-xs">
          Cal: {formatCalibration(telemetry.lastCalibrationTs)}
        </span>
      </div>
    </div>
  )
}
