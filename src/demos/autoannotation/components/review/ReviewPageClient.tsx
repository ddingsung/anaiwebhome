'use client'

import { useMemo, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTaskStore } from '@aa/store/taskStore'
import { useReviewStore } from '@aa/store/reviewStore'
import { getAnnotationsForTask } from '@aa/lib/mock/annotations'
import { ReviewLayout } from '@aa/components/review/ReviewLayout'
import { ReviewToolbar } from '@aa/components/review/ReviewToolbar'
import { TaskListPanel } from '@aa/components/review/TaskListPanel'
import { AnnotationCanvas } from '@aa/components/review/canvas/AnnotationCanvas'
import { InspectionPanel } from '@aa/components/review/inspection/InspectionPanel'
import type { Annotation, TaskAnnotations } from '@aa/lib/types/annotation'
import type { RejectionReason } from '@aa/lib/types/task'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function ReviewPageClient() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { tasks, approveTask, rejectTask, sendToRevision } = useTaskStore()
  const { resetModifiedAnnotations, markAnnotationModified } = useReviewStore()

  const task = useMemo(() => tasks.find(t => t.id === id) ?? null, [tasks, id])
  const baseAnnotations = useMemo(() => getAnnotationsForTask(id), [id])

  const [localAnnotations, setLocalAnnotations] = useState<Annotation[]>(
    baseAnnotations?.annotations ?? []
  )

  useEffect(() => {
    const anns = baseAnnotations?.annotations ?? []
    setLocalAnnotations(anns)
    resetModifiedAnnotations()
    if (anns.some(a => a.isModified)) markAnnotationModified()
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  const activeTaskAnnotations: TaskAnnotations | null = useMemo(() => {
    if (!baseAnnotations) return null
    return { ...baseAnnotations, annotations: localAnnotations }
  }, [baseAnnotations, localAnnotations])

  const handleLabelChange = (annId: string, label: string) => {
    setLocalAnnotations(prev =>
      prev.map(a => a.id === annId ? { ...a, label, isModified: true } : a)
    )
  }

  const reviewableTasks = useMemo(
    () => tasks.filter(t => t.status === 'pending' || t.status === 'revision' || t.status === 'ai_done'),
    [tasks]
  )

  const currentIndex = reviewableTasks.findIndex(t => t.id === id)
  const nextTask = reviewableTasks[currentIndex + 1]

  const navigateAfterAction = () => {
    if (nextTask) router.push(`/demo/autoannotation/review/${nextTask.id}`)
    else router.push('/demo/autoannotation')
  }

  if (!task) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <p className="text-[13px] text-text-secondary">항목을 찾을 수 없습니다</p>
        <Link href="/demo/autoannotation" className="flex items-center gap-1.5 text-[12px] text-accent-domain-text">
          <ArrowLeft size={13} /> 작업함으로
        </Link>
      </div>
    )
  }

  if (!activeTaskAnnotations) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <p className="text-[13px] text-text-secondary">이 항목의 어노테이션 데이터가 없습니다</p>
        <Link href="/demo/autoannotation" className="flex items-center gap-1.5 text-[12px] text-accent-domain-text">
          <ArrowLeft size={13} /> 작업함으로
        </Link>
      </div>
    )
  }

  const handleApprove = () => {
    approveTask(task.id)
    navigateAfterAction()
  }

  const handleApproveWithEdit = () => {
    approveTask(task.id)
    navigateAfterAction()
  }

  const handleSendToRevision = () => {
    sendToRevision(task.id)
    navigateAfterAction()
  }

  const handleReject = (reasons: RejectionReason[], note: string) => {
    rejectTask(task.id, reasons, note)
    navigateAfterAction()
  }

  return (
    <ReviewLayout
      toolbar={
        <ReviewToolbar
          task={task}
          nextTaskId={nextTask?.id}
          onApprove={handleApprove}
          onApproveWithEdit={handleApproveWithEdit}
          onSendToRevision={handleSendToRevision}
        />
      }
      taskList={
        <TaskListPanel tasks={reviewableTasks} currentTaskId={id} />
      }
      canvas={
        <AnnotationCanvas taskAnnotations={activeTaskAnnotations} />
      }
      inspection={
        <InspectionPanel
          task={task}
          taskAnnotations={activeTaskAnnotations}
          onReject={handleReject}
          onLabelChange={handleLabelChange}
        />
      }
    />
  )
}
