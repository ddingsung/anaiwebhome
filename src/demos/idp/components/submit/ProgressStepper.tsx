'use client'

import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'

const STEPS = ['데이터 검증', '형식 정규화', '시스템 전송', '반영 완료']

export function ProgressStepper({ onComplete }: { onComplete: () => void }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (current >= STEPS.length) {
      onComplete()
      return
    }
    const timer = setTimeout(() => setCurrent((c) => c + 1), 900)
    return () => clearTimeout(timer)
  }, [current, onComplete])

  return (
    <div className="flex items-center justify-center gap-0 my-8">
      {STEPS.map((step, i) => {
        const done = i < current
        const active = i === current
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  done
                    ? 'bg-accent border-accent text-white'
                    : active
                    ? 'border-accent text-accent animate-pulse'
                    : 'border-border text-text-tertiary'
                }`}
              >
                {done ? <Check size={16} /> : <span className="text-xs font-bold">{i + 1}</span>}
              </div>
              <span className={`text-xs font-medium whitespace-nowrap ${done || active ? 'text-text-primary' : 'text-text-tertiary'}`}>
                {step}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-16 h-0.5 mx-2 mb-5 transition-all duration-500 ${
                  i < current ? 'bg-accent' : 'bg-border'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
