'use client'

import { useEffect, useRef, useState } from 'react'
import { startInspectionEngine } from '@sq/lib/mock/inspectionDemo'
import type { EngineConfig, InspectionDemoState } from '@sq/lib/types/inspection'

const INITIAL_STATE: InspectionDemoState = {
  frame: {
    id: 'init',
    timestamp: Date.now(),
    mode: 'ai',
    boundingBoxes: [],
    isNG: false,
    inferenceTimeMs: 0,
    fps: 0,
  },
  kpi: {
    totalCount: 0,
    okCount: 0,
    ngCount: 0,
    yieldRate: 100,
    topDefectType: null,
  },
  defectLog: [],
  timeline: [],
}

const DEFAULT_CONFIG: EngineConfig = {
  ngRate: 0.07,
  intervalMs: 600,
  isPaused: false,
}

export function useInspectionDemo() {
  const [state, setState] = useState<InspectionDemoState>(INITIAL_STATE)
  const [isPaused, setIsPaused] = useState(false)
  const [config, setConfigState] = useState({
    ngRate: DEFAULT_CONFIG.ngRate,
    intervalMs: DEFAULT_CONFIG.intervalMs,
  })
  const [resetKey, setResetKey] = useState(0)
  const configRef = useRef<EngineConfig>({ ...DEFAULT_CONFIG })

  useEffect(() => {
    const stop = startInspectionEngine(setState, configRef)
    return stop
  }, [resetKey])

  function setConfig(next: Partial<{ ngRate: number; intervalMs: number }>) {
    setConfigState(prev => {
      const updated = { ...prev, ...next }
      Object.assign(configRef.current, updated)
      return updated
    })
  }

  function togglePause() {
    setIsPaused(prev => {
      const next = !prev
      configRef.current.isPaused = next
      return next
    })
  }

  function reset() {
    setState(INITIAL_STATE)
    setIsPaused(false)
    configRef.current.isPaused = false
    setResetKey(k => k + 1)
  }

  return { ...state, isPaused, config, setConfig, togglePause, reset }
}
