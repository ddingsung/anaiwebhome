// src/components/demo/scenes/Scene2Upload.tsx
'use client'

import { useEffect, useState } from 'react'
import type { CursorState } from '../FakeCursor'

interface Scene2Props { elapsed: number; onCursorUpdate: (s: CursorState) => void }

export function Scene2Upload({ elapsed, onCursorUpdate }: Scene2Props) {
  const [phase, setPhase] = useState<'idle' | 'dragging' | 'dropped' | 'progress'>('idle')
  const [progress, setProgress] = useState(0)

  // 커서 + 페이즈 제어
  useEffect(() => {
    if (elapsed < 400) {
      setPhase('idle')
      onCursorUpdate({ x: 72, y: 62, clicking: false, visible: true })
    } else if (elapsed < 1200) {
      setPhase('dragging')
      onCursorUpdate({ x: 50, y: 48, clicking: false, visible: true })
    } else if (elapsed < 1400) {
      onCursorUpdate({ x: 50, y: 48, clicking: true, visible: true })
    } else if (elapsed < 1600) {
      setPhase('dropped')
      onCursorUpdate({ x: 50, y: 48, clicking: false, visible: true })
    } else {
      setPhase('progress')
      onCursorUpdate({ x: 50, y: 48, clicking: false, visible: false })
    }
  }, [elapsed, onCursorUpdate])

  // 진행바
  useEffect(() => {
    if (phase === 'progress') {
      const remaining = Math.max(0, (elapsed - 1600) / 900) // 0→1 in 900ms
      setProgress(Math.min(100, Math.round(remaining * 100)))
    }
  }, [phase, elapsed])

  return (
    <div className="w-full h-full bg-base flex flex-col items-center justify-center gap-8 animate-in fade-in duration-300">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-2">문서 업로드</h2>
        <p className="text-base text-text-secondary">PDF, 이미지 파일을 업로드하면 AI가 자동 처리합니다</p>
      </div>

      {/* 업로드 존 */}
      <div
        className={`w-[480px] h-56 rounded-card border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-all duration-300 ${
          phase === 'dragging' ? 'border-accent bg-accent-light/20 scale-[1.02]' :
          phase === 'dropped' || phase === 'progress' ? 'border-accent bg-accent-light/10' :
          'border-border bg-surface'
        }`}
      >
        {phase === 'idle' || phase === 'dragging' ? (
          <>
            <div className="text-5xl">📄</div>
            <p className="text-lg text-text-secondary">파일을 여기에 드롭하세요</p>
            <p className="text-sm text-text-tertiary">PDF, PNG, JPG 지원</p>
          </>
        ) : phase === 'dropped' ? (
          <>
            <div className="text-5xl animate-in zoom-in duration-200">✓</div>
            <p className="text-base font-medium text-accent">(주)한국물산_세금계산서.pdf</p>
          </>
        ) : (
          <div className="w-full px-10">
            <div className="flex justify-between text-sm text-text-secondary mb-2">
              <span>(주)한국물산_세금계산서.pdf</span>
              <span>{progress}%</span>
            </div>
            <div className="h-3 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-accent mt-3 text-center">AI 분석 중...</p>
          </div>
        )}
      </div>

      {/* 드래그 중인 파일 아이콘 (커서 근처에 표시) */}
      {phase === 'dragging' && (
        <div
          style={{
            position: 'fixed',
            left: `calc(50% + 10px)`,
            top: `calc(48% + 10px)`,
            pointerEvents: 'none',
            zIndex: 9998,
          }}
          className="bg-white border border-border rounded px-2 py-1 shadow-modal text-xs text-text-secondary flex items-center gap-1"
        >
          📄 세금계산서.pdf
        </div>
      )}
    </div>
  )
}
