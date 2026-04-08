'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { ObjectList } from './ObjectList'
import { LabelSelector } from './LabelSelector'
import { RejectionForm } from './RejectionForm'
import { MetaInfo } from './MetaInfo'
import { ConfidenceBadge } from '@aa/components/worklist/ConfidenceBadge'
import { useReviewStore } from '@aa/store/reviewStore'
import type { Task, RejectionReason } from '@aa/lib/types/task'
import type { TaskAnnotations } from '@aa/lib/types/annotation'

interface InspectionPanelProps {
  task: Task
  taskAnnotations: TaskAnnotations
  onReject: (reasons: RejectionReason[], note: string) => void
  onLabelChange: (annId: string, label: string) => void
}

function Section({ title, children, defaultOpen = true }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-border-muted">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between px-3 py-2 text-[11px] font-medium uppercase tracking-wide text-text-muted"
      >
        {title}
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
      </button>
      {open && <div className="px-3 pb-3">{children}</div>}
    </div>
  )
}

export function InspectionPanel({
  task, taskAnnotations, onReject, onLabelChange
}: InspectionPanelProps) {
  const { selectedAnnotationId, isRejectionFormOpen, selectAnnotation, openRejectionForm, closeRejectionForm, markAnnotationModified } = useReviewStore()

  const selectedAnnotation = taskAnnotations.annotations.find(a => a.id === selectedAnnotationId)

  return (
    <div className="flex h-full flex-col overflow-hidden border-l border-border-default bg-bg-panel">
      {selectedAnnotation && (
        <div className="flex-shrink-0 border-b border-border-default bg-bg-overlay p-3 space-y-2">
          <p className="text-[11px] font-medium text-text-secondary">라벨 수정</p>
          <LabelSelector
            value={selectedAnnotation.label}
            onChange={(label) => {
              markAnnotationModified()
              onLabelChange(selectedAnnotation.id, label)
            }}
          />
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-text-muted">신뢰도</span>
            <ConfidenceBadge value={selectedAnnotation.confidence} />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <Section title="객체 목록">
          <ObjectList
            annotations={taskAnnotations.annotations}
            selectedId={selectedAnnotationId}
            onSelect={selectAnnotation}
          />
        </Section>

        <Section title="파일 정보" defaultOpen={false}>
          <MetaInfo task={task} />
        </Section>

        {isRejectionFormOpen && (
          <div className="p-3">
            <RejectionForm
              onSubmit={(reasons, note) => {
                onReject(reasons, note)
                closeRejectionForm()
              }}
              onCancel={closeRejectionForm}
            />
          </div>
        )}
      </div>

    </div>
  )
}
