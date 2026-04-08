// components/viewer/InspectionViewer.tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import type { InspectionFrame, ViewerMode } from '@sq/lib/types/inspection'
import { PCBSubstrate } from './PCBSubstrate'
import { BoundingBoxOverlay } from './BoundingBoxOverlay'

interface Props {
  frame: InspectionFrame
}

const MODES: ViewerMode[] = ['ai', 'raw', 'split']

export function InspectionViewer({ frame }: Props) {
  const [mode, setMode] = useState<ViewerMode>('ai')
  const [flash, setFlash] = useState(false)
  const prevIdRef = useRef(frame.id)

  useEffect(() => {
    if (frame.id !== prevIdRef.current && frame.isNG) {
      setFlash(true)
      const t = setTimeout(() => setFlash(false), 300)
      prevIdRef.current = frame.id
      return () => clearTimeout(t)
    }
    prevIdRef.current = frame.id
  }, [frame.id, frame.isNG])

  return (
    <div className="w-full h-full flex flex-col">
      {/* Mode toggle */}
      <div className="flex-none flex justify-end px-3 py-2 gap-1.5 border-b border-border">
        {MODES.map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1 text-xs font-medium uppercase tracking-widest rounded transition-colors ${
              mode === m
                ? 'bg-border text-text-primary'
                : 'text-text-muted hover:text-text-secondary hover:bg-border/40'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Viewer */}
      <div className="flex-1 flex items-center justify-center p-3 min-h-0 gap-2 relative">
        {flash && (
          <div className="absolute inset-0 border-2 border-state-ng pointer-events-none z-10 transition-opacity" />
        )}
        {mode === 'split' ? (
          <>
            {/* RAW 패널 */}
            <div className="flex flex-col items-center flex-1 min-w-0 max-h-full">
              <div
                className="relative w-full overflow-hidden"
                style={{ aspectRatio: '800 / 560' }}
              >
                <PCBSubstrate isNG={frame.isNG} />
              </div>
              <span className="text-xs text-text-muted mt-1.5 uppercase tracking-widest font-medium">RAW</span>
            </div>
            {/* AI 패널 */}
            <div className="flex flex-col items-center flex-1 min-w-0 max-h-full">
              <div
                className="relative w-full overflow-hidden"
                style={{ aspectRatio: '800 / 560' }}
              >
                <PCBSubstrate isNG={frame.isNG} />
                <BoundingBoxOverlay boundingBoxes={frame.boundingBoxes} />
              </div>
              <span className="text-xs text-text-muted mt-1.5 uppercase tracking-widest font-medium">AI</span>
            </div>
          </>
        ) : (
          <div
            className="relative w-full max-h-full overflow-hidden"
            style={{ aspectRatio: '800 / 560' }}
          >
            <PCBSubstrate isNG={frame.isNG} />
            {mode === 'ai' && (
              <BoundingBoxOverlay boundingBoxes={frame.boundingBoxes} />
            )}
          </div>
        )}
      </div>

      {/* Status badge */}
      <div className="flex-none px-3 py-2 flex items-center gap-3 border-t border-border">
        <span
          className={`text-sm font-bold uppercase tracking-wider ${
            frame.isNG ? 'text-state-ng' : 'text-state-normal'
          }`}
        >
          {frame.isNG ? '⚠ NG' : '● NORMAL'}
        </span>
        <span className="text-xs text-text-muted font-mono">{frame.id}</span>
      </div>
    </div>
  )
}
