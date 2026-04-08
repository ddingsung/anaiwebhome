'use client'

import type { Field } from '@idp/lib/types'
import { AiLabel } from './AiLabel'

interface ExtractedFieldProps {
  field: Field
  onEdit?: (key: string, value: string) => void
  onFocus?: (key: string) => void
}

export function ExtractedField({ field, onEdit, onFocus }: ExtractedFieldProps) {
  const isReview = field.status === 'review_needed'
  const isEdited = field.status === 'edited'

  return (
    <div
      className={`relative pl-3 py-2 pr-2 rounded-button transition-colors ${
        isReview
          ? 'border-l-2 border-warning bg-amber-50 ring-1 ring-amber-200'
          : 'border-l-2 border-transparent'
      }`}
      onMouseEnter={() => onFocus?.(field.key)}
      onMouseLeave={() => onFocus?.('')}
    >
      <div className="flex items-center justify-between mb-0.5">
        <div className="flex items-center gap-1.5">
          <label className="text-xs font-medium text-text-secondary">{field.label}</label>
          {isReview && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold bg-warning text-white rounded-badge">
              ⚠ 검수 필요
            </span>
          )}
        </div>
        <AiLabel confidence={field.confidence} reviewNote={field.reviewNote} />
      </div>

      {isEdited && field.originalValue && (
        <div className="text-[10px] text-text-tertiary mb-0.5 line-through">{field.originalValue}</div>
      )}

      <div className="flex items-center gap-2">
        <input
          className={`flex-1 text-sm bg-transparent border-0 border-b border-transparent focus:border-accent focus:outline-none py-0.5 font-numeric ${
            isReview ? 'text-warning' : 'text-text-primary'
          }`}
          value={field.value}
          onChange={(e) => onEdit?.(field.key, e.target.value)}
          readOnly={!onEdit}
        />
        {isEdited && (
          <span className="flex-shrink-0 text-[10px] px-1.5 py-0.5 bg-success-light text-success border border-green-200 rounded-badge">
            수정됨
          </span>
        )}
      </div>

      {isReview && field.reviewNote && (
        <p className="text-[10px] text-warning mt-1 leading-relaxed">{field.reviewNote}</p>
      )}
    </div>
  )
}
