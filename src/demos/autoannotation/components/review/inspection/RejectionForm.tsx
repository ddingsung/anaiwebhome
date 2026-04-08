'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { REJECTION_REASON_LABELS, type RejectionReason } from '@aa/lib/types/task'

const REASONS = Object.entries(REJECTION_REASON_LABELS) as [RejectionReason, string][]

interface RejectionFormProps {
  onSubmit: (reasons: RejectionReason[], note: string) => void
  onCancel: () => void
}

export function RejectionForm({ onSubmit, onCancel }: RejectionFormProps) {
  const [selectedReasons, setSelectedReasons] = useState<RejectionReason[]>([])
  const [note, setNote] = useState('')

  const toggleReason = (reason: RejectionReason) => {
    setSelectedReasons(prev =>
      prev.includes(reason) ? prev.filter(r => r !== reason) : [...prev, reason]
    )
  }

  const handleSubmit = () => {
    if (selectedReasons.length === 0) return
    onSubmit(selectedReasons, note)
  }

  return (
    <div className="rounded border border-status-rejected/30 bg-[#1a0808] p-3 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-medium text-status-rejected">반려 사유</p>
        <button onClick={onCancel} className="text-text-muted hover:text-text-secondary">
          <X size={14} />
        </button>
      </div>

      <div className="space-y-1">
        {REASONS.map(([key, label]) => (
          <label key={key} className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={selectedReasons.includes(key)}
              onChange={() => toggleReason(key)}
              className="accent-status-rejected"
            />
            <span className="text-[11px] text-text-secondary">{label}</span>
          </label>
        ))}
      </div>

      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="추가 메모 (선택)"
        rows={2}
        className="w-full resize-none rounded border border-border-strong bg-bg-surface px-2 py-1.5 text-[11px] text-text-primary placeholder:text-text-muted focus:border-accent-domain focus:outline-none"
      />

      <button
        onClick={handleSubmit}
        disabled={selectedReasons.length === 0}
        className="w-full rounded bg-status-rejected px-3 py-1.5 text-[12px] font-medium text-white disabled:opacity-40"
      >
        반려 확정
      </button>
    </div>
  )
}
