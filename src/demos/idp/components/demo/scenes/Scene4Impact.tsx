'use client'

import { useEffect, useState } from 'react'
import type { CursorState } from '../FakeCursor'

interface Scene4Props { elapsed: number; onCursorUpdate: (s: CursorState) => void }

export function Scene4Impact({ elapsed, onCursorUpdate }: Scene4Props) {
  const [countUp, setCountUp] = useState(0)

  useEffect(() => {
    onCursorUpdate({ x: 50, y: 50, clicking: false, visible: false })
  }, [onCursorUpdate])

  // 1000ms부터 카운트업: 45초까지 800ms 동안
  useEffect(() => {
    if (elapsed >= 1000) {
      const progress = Math.min(1, (elapsed - 1000) / 800)
      setCountUp(Math.round(progress * 45))
    }
  }, [elapsed])

  const showBefore = elapsed >= 200
  const showArrow  = elapsed >= 700
  const showAfter  = elapsed >= 1000

  return (
    <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center gap-6 animate-in fade-in duration-500">
      <p className="text-slate-400 text-sm tracking-widest uppercase">처리 시간 비교</p>

      <div className="flex items-center gap-8">
        {/* Before */}
        <div
          className={`text-center transition-all duration-500 ${showBefore ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <div className="text-slate-500 text-xs mb-2">수작업</div>
          <div className="relative">
            <span className="text-6xl font-black text-red-400">20</span>
            <span className="text-2xl text-red-400 ml-1">분</span>
            {/* 취소선 */}
            <div
              className={`absolute top-1/2 left-0 h-1 bg-red-400 rounded transition-all duration-500 ${showArrow ? 'w-full' : 'w-0'}`}
              style={{ transform: 'translateY(-50%) rotate(-8deg)' }}
            />
          </div>
        </div>

        {/* Arrow */}
        <div
          className={`text-4xl text-slate-500 transition-all duration-500 ${showArrow ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
        >
          →
        </div>

        {/* After */}
        <div
          className={`text-center transition-all duration-500 ${showAfter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <div className="text-emerald-400 text-xs mb-2">AI 자동 처리</div>
          <div>
            <span className="text-6xl font-black text-emerald-400">{countUp}</span>
            <span className="text-2xl text-emerald-400 ml-1">초</span>
          </div>
        </div>
      </div>

      <p className="text-slate-500 text-xs mt-2">세금계산서 기준 · 필드 추출 + ERP 전송 포함</p>
    </div>
  )
}
