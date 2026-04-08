'use client'

import { useEffect, useState } from 'react'
import type { CursorState } from '../FakeCursor'

const STEPS = ['데이터 검증', '형식 정규화', '시스템 전송', '반영 완료']

interface Scene5Props { elapsed: number; onCursorUpdate: (s: CursorState) => void }

export function Scene5Submit({ elapsed, onCursorUpdate }: Scene5Props) {
  const [clicked, setClicked] = useState(false)
  const [stepsDone, setStepsDone] = useState(0)

  useEffect(() => {
    if (elapsed < 300) {
      onCursorUpdate({ x: 50, y: 75, clicking: false, visible: true })
    } else if (elapsed < 500) {
      onCursorUpdate({ x: 50, y: 75, clicking: true, visible: true })
    } else {
      setClicked(true)
      onCursorUpdate({ x: 50, y: 75, clicking: false, visible: false })
    }
  }, [elapsed, onCursorUpdate])

  // 스텝 진행: 500ms 후 시작, 350ms 간격
  useEffect(() => {
    if (elapsed >= 500) {
      const done = Math.min(STEPS.length, Math.floor((elapsed - 500) / 350) + 1)
      setStepsDone(done)
    }
  }, [elapsed])

  return (
    <div className="w-full h-full bg-base flex flex-col items-center justify-center gap-6 animate-in fade-in duration-300">
      <p className="text-base text-text-secondary">(주)한국물산_세금계산서_2026-03-28.pdf</p>

      {!clicked ? (
        /* 전송 전: 버튼 */
        <button className="px-10 py-4 bg-accent text-white rounded-button font-semibold text-lg shadow-card">
          ERP 시스템에 전송
        </button>
      ) : (
        /* 전송 중/완료: 스텝퍼 */
        <div className="flex items-center gap-0">
          {STEPS.map((step, i) => {
            const done   = i < stepsDone
            const active = i === stepsDone - 1 && stepsDone < STEPS.length
            const allDone = stepsDone >= STEPS.length
            return (
              <div key={step} className="flex items-center">
                <div className="flex flex-col items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      allDone || done
                        ? 'bg-accent border-accent text-white'
                        : active
                        ? 'border-accent text-accent animate-pulse'
                        : 'border-border text-text-tertiary'
                    }`}
                  >
                    {done || allDone ? (
                      <svg width="20" height="20" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    ) : (
                      <span className="text-sm font-bold">{i + 1}</span>
                    )}
                  </div>
                  <span className={`text-sm font-medium whitespace-nowrap ${done || active || allDone ? 'text-text-primary' : 'text-text-tertiary'}`}>
                    {step}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-16 h-0.5 mb-8 transition-all duration-300 ${i < stepsDone ? 'bg-accent' : 'bg-border'}`} />
                )}
              </div>
            )
          })}
        </div>
      )}

      {stepsDone >= STEPS.length && (
        <p className="text-success text-base font-medium animate-in fade-in duration-300">✓ ERP 시스템에 성공적으로 반영되었습니다</p>
      )}
    </div>
  )
}
