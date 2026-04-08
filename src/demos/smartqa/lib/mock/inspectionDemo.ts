import type {
  BoundingBox,
  DefectLogEntry,
  DefectType,
  EngineConfig,
  InspectionDemoState,
  InspectionFrame,
  KPIState,
  TimelineEvent,
} from '@sq/lib/types/inspection'

const DEFECT_TYPES: DefectType[] = ['SCRATCH', 'VOID', 'OPEN', 'CRACK']

function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}

function pickDefect(): DefectType {
  return DEFECT_TYPES[Math.floor(Math.random() * DEFECT_TYPES.length)]
}

function getMostFrequent(log: DefectLogEntry[]): DefectType | null {
  if (log.length === 0) return null
  const counts: Partial<Record<DefectType, number>> = {}
  for (const e of log) counts[e.defectType] = (counts[e.defectType] ?? 0) + 1
  return Object.entries(counts).sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))[0][0] as DefectType
}

function generateFrame(isNG: boolean): InspectionFrame {
  const boundingBoxes: BoundingBox[] = isNG
    ? [{
        id: uid(),
        x: 0.15 + Math.random() * 0.55,
        y: 0.15 + Math.random() * 0.55,
        width: 0.06 + Math.random() * 0.14,
        height: 0.05 + Math.random() * 0.10,
        defectType: pickDefect(),
        confidence: 0.72 + Math.random() * 0.27,
      }]
    : []

  return {
    id: uid(),
    timestamp: Date.now(),
    mode: 'ai',
    boundingBoxes,
    isNG,
    inferenceTimeMs: 28 + Math.random() * 18,
    fps: 28 + Math.random() * 4,
  }
}

export function startInspectionEngine(
  callback: (state: InspectionDemoState) => void,
  configRef: { current: EngineConfig },
): () => void {
  let frameCount = 0
  let ngCount = 0
  const defectLog: DefectLogEntry[] = []
  const timeline: TimelineEvent[] = []
  const pendingTimeouts: ReturnType<typeof setTimeout>[] = []
  let mainTimeoutId: ReturnType<typeof setTimeout>

  function tick() {
    if (!configRef.current.isPaused) {
      frameCount++
      const isNG = Math.random() < configRef.current.ngRate
      if (isNG) ngCount++

      const frame = generateFrame(isNG)

      if (isNG && frame.boundingBoxes.length > 0) {
        const bb = frame.boundingBoxes[0]
        const entry: DefectLogEntry = {
          id: uid(),
          timestamp: frame.timestamp,
          defectType: bb.defectType,
          confidence: bb.confidence,
          frameId: frame.id,
        }
        defectLog.unshift(entry)
        if (defectLog.length > 20) defectLog.pop()

        timeline.unshift({
          id: uid(),
          timestamp: frame.timestamp,
          type: 'detect',
          label: `NG 감지: ${bb.defectType}`,
          state: 'ng',
        })

        const tid = setTimeout(() => {
          pendingTimeouts.splice(pendingTimeouts.indexOf(tid), 1)
          timeline.unshift({
            id: uid(),
            timestamp: Date.now(),
            type: 'reject',
            label: '불량 배출 신호',
            state: 'warn',
          })
          if (timeline.length > 50) timeline.length = 50
        }, 200)
        pendingTimeouts.push(tid)
      }

      if (timeline.length > 50) timeline.length = 50

      const kpi: KPIState = {
        totalCount: frameCount,
        okCount: frameCount - ngCount,
        ngCount,
        yieldRate: frameCount > 0 ? ((frameCount - ngCount) / frameCount) * 100 : 100,
        topDefectType: getMostFrequent(defectLog),
      }

      callback({
        frame,
        kpi,
        defectLog: [...defectLog],
        timeline: [...timeline],
      })
    }

    mainTimeoutId = setTimeout(tick, configRef.current.intervalMs)
  }

  mainTimeoutId = setTimeout(tick, configRef.current.intervalMs)

  return () => {
    clearTimeout(mainTimeoutId)
    for (const tid of pendingTimeouts) clearTimeout(tid)
  }
}
