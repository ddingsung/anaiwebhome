'use client'

import { useState, useEffect, useRef } from 'react'
import { Sparkles } from 'lucide-react'

interface AiLabelProps {
  confidence?: number
  reviewNote?: string
}

export function AiLabel({ confidence, reviewNote }: AiLabelProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const pct = confidence !== undefined ? Math.round(confidence * 100) : null
  const color = pct === null ? 'text-ai-label' : pct >= 90 ? 'text-ai-label' : pct >= 70 ? 'text-warning' : 'text-error'

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-0.5 text-[10px] font-medium ${color} hover:opacity-80 transition-opacity`}
      >
        <Sparkles size={10} />
        AI{pct !== null && ` ${pct}%`}
      </button>
      {open && (
        <div className="absolute bottom-full left-0 mb-1 z-50 w-56 bg-gray-900 text-white rounded-button p-2.5 text-[10px] leading-relaxed shadow-modal">
          <div className="font-medium mb-1">AI 추출 근거</div>
          {pct !== null && (
            <div className="mb-1">신뢰도: <span className="font-numeric">{pct}%</span></div>
          )}
          {reviewNote && (
            <div className="text-amber-300">{reviewNote}</div>
          )}
          {!reviewNote && <div className="text-gray-300">정상 추출됨</div>}
        </div>
      )}
    </div>
  )
}
