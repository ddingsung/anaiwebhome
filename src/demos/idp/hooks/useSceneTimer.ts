'use client'

import { useEffect, useRef, useState } from 'react'

export type PausePoint = { at: number; duration: number; text: string }

/** 각 씬의 지속 시간 (ms). 인덱스 = 씬 번호 (0–4) */
export const SCENE_DURATIONS = [2000, 2500, 4000, 2500, 3000] as const
export const SCENE_COUNT = SCENE_DURATIONS.length // 5

/** 씬 내 일시정지 포인트 */
export const SCENE_PAUSES: Partial<Record<number, PausePoint[]>> = {
  2: [{ at: 100, duration: 2000, text: 'AI가 문서를 읽고 핵심 필드를 자동으로 추출합니다' }],
  3: [{ at: 100, duration: 2000, text: '검토 후 클릭 한 번으로 ERP에 바로 반영됩니다' }],
  4: [{ at: 100, duration: 2000, text: 'AI가 이상 징후와 다음 할 일을 자동으로 분석합니다' }],
}

export function useSceneTimer() {
  const [scene, setScene] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [activePause, setActivePause] = useState<PausePoint | null>(null)

  // 모든 내부 상태를 ref로 관리 → React re-render와 무관하게 단일 인터벌로 제어
  const ref = useRef({
    scene: 0,
    elapsed: 0,
    paused: false,
    advanced: false,
    triggeredPauses: new Set<number>(),
  })

  useEffect(() => {
    const r = ref.current

    const tick = setInterval(() => {
      if (r.paused || r.advanced) return

      r.elapsed += 50
      setElapsed(r.elapsed)

      // 일시정지 포인트 체크
      const pauses = SCENE_PAUSES[r.scene] ?? []
      for (const pause of pauses) {
        if (r.elapsed >= pause.at && !r.triggeredPauses.has(pause.at)) {
          r.triggeredPauses.add(pause.at)
          r.paused = true
          setActivePause(pause)
          setTimeout(() => {
            r.paused = false
            setActivePause(null)
          }, pause.duration)
          return
        }
      }

      // 씬 전환 체크
      if (r.elapsed >= SCENE_DURATIONS[r.scene]) {
        r.advanced = true
        const next = (r.scene + 1) % SCENE_COUNT
        r.scene = next
        r.elapsed = 0
        r.paused = false
        r.advanced = false
        r.triggeredPauses = new Set()
        setScene(next)
        setElapsed(0)
        setActivePause(null)
      }
    }, 50)

    return () => clearInterval(tick)
  }, []) // 마운트 시 한 번만 실행

  return { scene, elapsed, activePause }
}
