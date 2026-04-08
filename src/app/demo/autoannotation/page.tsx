'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, CheckCircle2, Circle, Loader2 } from 'lucide-react'
import { useTaskStore } from '@aa/store/taskStore'
import { useLabelingStore } from '@aa/store/labelingStore'
import { cn } from '@aa/lib/utils'

interface StepProps {
  step: number
  label: string
  sublabel: string
  count?: number | string
  status: 'completed' | 'active' | 'idle'
  href: string
}

function PipelineStep({ step, label, sublabel, count, status, href }: StepProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center justify-between rounded-lg border px-5 py-4 transition-colors',
        status === 'completed' && 'border-status-approved/30 hover:bg-status-approved/5',
        status === 'active'    && 'border-accent-domain/50 bg-accent-domain/5 hover:bg-accent-domain/10',
        status === 'idle'      && 'border-border-default hover:bg-bg-surface',
      )}
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold',
          status === 'completed' && 'bg-status-approved/20 text-status-approved',
          status === 'active'    && 'bg-accent-domain text-white',
          status === 'idle'      && 'bg-bg-surface text-text-muted',
        )}>
          {status === 'completed' ? <CheckCircle2 size={16} /> : step}
        </div>
        <div>
          <p className={cn(
            'text-[13px] font-medium',
            status === 'idle' ? 'text-text-muted' : 'text-text-primary'
          )}>{label}</p>
          <p className="text-[11px] text-text-muted">{sublabel}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {count !== undefined && (
          <span className={cn(
            'text-[20px] font-semibold tabular-nums',
            status === 'completed' && 'text-status-approved',
            status === 'active'    && 'text-accent-domain-text',
            status === 'idle'      && 'text-text-muted',
          )}>{count}</span>
        )}
        <ChevronRight size={14} className="text-text-muted" />
      </div>
    </Link>
  )
}

function Arrow() {
  return (
    <div className="flex items-center justify-center py-1">
      <div className="h-5 w-px bg-border-strong" />
    </div>
  )
}

export default function DashboardPage() {
  const { tasks } = useTaskStore()
  const { images } = useLabelingStore()

  const labeledCount    = images.filter(i => i.status === 'labeled').length
  const [trainingDone, setTrainingDone] = useState(false)
  useEffect(() => {
    const done = !!localStorage.getItem('training-done')
    setTrainingDone(done && labeledCount > 0)
  }, [labeledCount])
  const aiDoneCount     = tasks.filter(t => t.status === 'ai_done').length
  const pendingCount    = tasks.filter(t => t.status === 'pending' || t.status === 'ai_done').length
  const revisionCount   = tasks.filter(t => t.status === 'revision' || t.status === 'rejected').length
  const approvedCount   = tasks.filter(t => t.status === 'approved').length

  const reviewTotal = pendingCount + revisionCount

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="flex-shrink-0 border-b border-border-default px-6 py-4">
        <h1 className="text-[14px] font-semibold text-text-primary">파이프라인 현황</h1>
        <p className="text-[11px] text-text-muted mt-0.5">전체 자동화 흐름을 한눈에 확인하세요</p>
      </div>

      <div className="flex-1 px-6 py-6 max-w-xl">
        <PipelineStep
          step={1}
          label="라벨링"
          sublabel="AI 학습용 초기 데이터 수동 어노테이션"
          count={labeledCount}
          status={labeledCount > 0 ? 'completed' : 'active'}
          href="/demo/autoannotation/baseline"
        />
        <Arrow />
        <PipelineStep
          step={2}
          label="모델 학습"
          sublabel="라벨링 데이터 기반 AI 모델 학습"
          count={trainingDone ? '완료' : undefined}
          status={trainingDone ? 'completed' : labeledCount > 0 ? 'active' : 'idle'}
          href="/demo/autoannotation/training"
        />
        <Arrow />
        <PipelineStep
          step={3}
          label="AI 자동 어노테이션"
          sublabel="학습된 모델이 새 이미지를 자동 처리"
          count={aiDoneCount}
          status={aiDoneCount > 0 ? 'completed' : trainingDone ? 'active' : 'idle'}
          href="/demo/autoannotation/autoannotate"
        />
        <Arrow />
        <PipelineStep
          step={4}
          label="검토"
          sublabel="AI 결과를 사람이 확인하고 승인 또는 반려"
          count={reviewTotal}
          status={reviewTotal > 0 ? 'active' : 'idle'}
          href="/demo/autoannotation/worklist"
        />
        <Arrow />
        <PipelineStep
          step={5}
          label="완료 & 내보내기"
          sublabel="승인된 데이터셋 다운로드"
          count={approvedCount}
          status={approvedCount > 0 ? 'completed' : 'idle'}
          href="/demo/autoannotation/completed"
        />
      </div>
    </div>
  )
}
