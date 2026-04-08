'use client'

import { useEffect } from 'react'
import type { DefectLogEntry, DefectType } from '@sq/lib/types/inspection'

const DEFECT_COLOR: Record<DefectType, string> = {
  SCRATCH: '#e8a820',
  VOID:    '#d94040',
  OPEN:    '#4f86cc',
  CRACK:   '#d94040',
  BRIDGE:  '#e07830',
  FOREIGN: '#8a8a8a',
}

function formatTimestamp(ts: number): string {
  const d = new Date(ts)
  const hms = d.toLocaleTimeString('ko-KR', { hour12: false })
  const ms = String(d.getMilliseconds()).padStart(3, '0')
  return `${hms}.${ms}`
}

interface Props {
  defect: DefectLogEntry
  onClose: () => void
  onAcknowledge: (id: string) => void
}

export function DefectModal({ defect, onClose, onAcknowledge }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={onClose}
    >
      <div
        className="bg-panel border border-border rounded-lg p-5 w-72 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-sm font-semibold text-text-primary mb-4">결함 상세</h2>

        {/* 결함 타입 */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-3 h-3 rounded-sm flex-none"
            style={{ background: DEFECT_COLOR[defect.defectType] }}
          />
          <span className="text-sm font-medium text-text-primary">{defect.defectType}</span>
        </div>

        {/* 상세 정보 */}
        <div className="space-y-1.5 mb-4">
          <div className="flex justify-between text-xs">
            <span className="text-text-muted">신뢰도</span>
            <span className="text-text-secondary num">{(defect.confidence * 100).toFixed(1)}%</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-text-muted">시각</span>
            <span className="text-text-secondary num">{formatTimestamp(defect.timestamp)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-text-muted">Frame ID</span>
            <span className="text-text-muted num font-mono">{defect.frameId.slice(0, 8)}</span>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-2">
          <button
            className="flex-1 px-3 py-1.5 text-xs rounded border border-border text-text-secondary hover:bg-border/40 transition-colors"
            onClick={onClose}
          >
            닫기
          </button>
          <button
            className="flex-1 px-3 py-1.5 text-xs rounded bg-state-normal text-bg font-medium hover:opacity-90 transition-opacity"
            onClick={() => onAcknowledge(defect.id)}
          >
            ✓ 확인 처리
          </button>
        </div>
      </div>
    </div>
  )
}
