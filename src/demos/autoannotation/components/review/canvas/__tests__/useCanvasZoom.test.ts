import { describe, it, expect } from 'vitest'
import { calculateFitZoom, screenToCanvas } from '../useCanvasZoom'

describe('calculateFitZoom', () => {
  it('이미지가 컨테이너보다 크면 축소 비율을 반환한다', () => {
    const zoom = calculateFitZoom(
      { width: 500, height: 400 },
      { width: 1000, height: 800 }
    )
    expect(zoom).toBe(0.5)
  })

  it('이미지가 컨테이너보다 작으면 확대 비율을 반환한다', () => {
    const zoom = calculateFitZoom(
      { width: 800, height: 600 },
      { width: 400, height: 300 }
    )
    expect(zoom).toBe(2)
  })

  it('가로세로 비율이 다를 때 더 제한적인 방향 기준으로 계산한다', () => {
    const zoom = calculateFitZoom(
      { width: 800, height: 600 },
      { width: 1000, height: 400 }
    )
    // 가로: 800/1000=0.8, 세로: 600/400=1.5 → 작은 쪽인 0.8
    expect(zoom).toBeCloseTo(0.8)
  })
})

describe('screenToCanvas', () => {
  it('줌과 오프셋을 고려한 캔버스 좌표를 반환한다', () => {
    const result = screenToCanvas(
      { x: 110, y: 60 },
      { x: 10, y: 10 },
      2
    )
    expect(result).toEqual({ x: 50, y: 25 })
  })
})
