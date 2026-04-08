'use client'

import { useEffect, useState } from 'react'
import type { SystemState, SystemTelemetry } from '@sq/lib/types/inspection'

const BASE: SystemTelemetry = {
  cpuPercent: 42,
  ramUsedGb: 3.8,
  temperatureCelsius: 58,
  cameraState: 'normal',
  plcState: 'normal',
  edgeNodeState: 'normal',
  modelName: 'ResNet-18',
  modelVersion: 'v2.1.4',
  optimizer: 'TensorRT',
  lastCalibrationTs: Date.now() - 2 * 60 * 60 * 1000,
}

function jitter(base: number, range: number): number {
  return Math.round((base + (Math.random() - 0.5) * range) * 10) / 10
}

function getEdgeState(cpu: number): SystemState {
  if (cpu > 90) return 'warn'
  return 'normal'
}

export function useSystemTelemetry(): SystemTelemetry {
  const [telemetry, setTelemetry] = useState<SystemTelemetry>(BASE)

  useEffect(() => {
    const id = setInterval(() => {
      setTelemetry((prev) => {
        const cpu = Math.min(99, Math.max(10, jitter(prev.cpuPercent, 8)))
        return {
          ...prev,
          cpuPercent: cpu,
          ramUsedGb: Math.min(15.9, Math.max(1, jitter(prev.ramUsedGb, 0.4))),
          temperatureCelsius: Math.min(95, Math.max(30, jitter(prev.temperatureCelsius, 2))),
          edgeNodeState: getEdgeState(cpu),
        }
      })
    }, 3000)
    return () => clearInterval(id)
  }, [])

  return telemetry
}
