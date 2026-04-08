'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { BrainCircuit, ChevronRight, CheckCircle2, Loader2 } from 'lucide-react'
import { useLabelingStore } from '@aa/store/labelingStore'
import { cn } from '@aa/lib/utils'

interface EpochLog {
  epoch: number
  loss: number
  valLoss: number
  mAP: number
}

function seeded(seed: number, min: number, max: number) {
  const x = Math.sin(seed) * 10000
  return min + (x - Math.floor(x)) * (max - min)
}

const TOTAL_EPOCHS = 20

export default function TrainingPage() {
  const router = useRouter()
  const { images } = useLabelingStore()
  const [stage, setStage] = useState<'idle' | 'training' | 'done'>('idle')
  const [logs, setLogs] = useState<EpochLog[]>([])
  const [currentEpoch, setCurrentEpoch] = useState(0)
  const logEndRef = useRef<HTMLDivElement>(null)

  const labeledImages = images.filter(i => i.status === 'labeled')
  const totalAnnotations = labeledImages.reduce((s, i) => s + i.annotations.length, 0)

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  const handleStart = async () => {
    setStage('training')
    setLogs([])
    setCurrentEpoch(0)

    for (let ep = 1; ep <= TOTAL_EPOCHS; ep++) {
      await new Promise(r => setTimeout(r, 300 + Math.random() * 200))
      const progress = ep / TOTAL_EPOCHS
      const log: EpochLog = {
        epoch: ep,
        loss:    parseFloat((seeded(ep * 3,    0.05, 0.8) * (1 - progress * 0.85)).toFixed(4)),
        valLoss: parseFloat((seeded(ep * 7,    0.08, 0.9) * (1 - progress * 0.80)).toFixed(4)),
        mAP:     parseFloat((seeded(ep * 11,  50, 70) + progress * 25).toFixed(1)),
      }
      setCurrentEpoch(ep)
      setLogs(prev => [...prev, log])
    }

    setStage('done')
    localStorage.setItem('training-done', '1')
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex-shrink-0 border-b border-border-default px-4 py-3">
        <h1 className="text-[14px] font-semibold text-text-primary">모델 학습</h1>
        <p className="text-[11px] text-text-muted">라벨링된 데이터로 AI 탐지 모델을 학습합니다</p>
      </div>

      <div className="flex flex-1 gap-0 overflow-hidden">

        {/* 왼쪽: 데이터셋 요약 + 액션 */}
        <div className="flex w-64 flex-shrink-0 flex-col gap-4 border-r border-border-default p-4">
          <div className="rounded-lg border border-border-default p-3 space-y-2">
            <p className="text-[11px] font-medium text-text-muted uppercase tracking-wide">학습 데이터</p>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-[11px] text-text-muted">전체 이미지</span>
                <span className="text-[11px] text-text-primary">{images.length}장</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[11px] text-text-muted">라벨링 완료</span>
                <span className={cn('text-[11px]', labeledImages.length > 0 ? 'text-status-approved' : 'text-text-muted')}>
                  {labeledImages.length}장
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[11px] text-text-muted">어노테이션 수</span>
                <span className="text-[11px] text-text-primary">{totalAnnotations}개</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border-default p-3 space-y-2">
            <p className="text-[11px] font-medium text-text-muted uppercase tracking-wide">학습 설정</p>
            <div className="space-y-1">
              {[
                ['모델',   'YOLOv8n'],
                ['Epochs', String(TOTAL_EPOCHS)],
                ['Batch',  '16'],
                ['입력 크기', '640×640'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-[11px] text-text-muted">{k}</span>
                  <span className="text-[11px] text-text-primary font-mono">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {stage === 'idle' && (
            <button
              onClick={handleStart}
              disabled={labeledImages.length === 0}
              className="flex items-center justify-center gap-2 rounded-lg bg-accent-domain py-2.5 text-[12px] font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <BrainCircuit size={14} />
              학습 시작
            </button>
          )}

          {stage === 'training' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-text-muted">진행</span>
                <span className="text-[11px] tabular-nums text-text-secondary">
                  {currentEpoch} / {TOTAL_EPOCHS}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-overlay">
                <div
                  className="h-full rounded-full bg-accent-domain transition-all duration-300"
                  style={{ width: `${(currentEpoch / TOTAL_EPOCHS) * 100}%` }}
                />
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                <Loader2 size={11} className="animate-spin" />
                Epoch {currentEpoch} 학습 중…
              </div>
            </div>
          )}

          {stage === 'done' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 rounded border border-status-approved/30 bg-status-approved/5 px-3 py-2">
                <CheckCircle2 size={13} className="text-status-approved" />
                <span className="text-[11px] text-status-approved font-medium">학습 완료</span>
              </div>
              <button
                onClick={() => router.push('/demo/autoannotation/autoannotate')}
                className="flex w-full items-center justify-center gap-1.5 rounded border border-accent-domain px-3 py-2 text-[12px] text-accent-domain-text transition-colors hover:bg-accent-domain-muted"
              >
                AI 어노테이션으로 이동 <ChevronRight size={13} />
              </button>
            </div>
          )}
        </div>

        {/* 오른쪽: 학습 로그 */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="border-b border-border-default px-4 py-2">
            <div className="grid grid-cols-[60px_1fr_1fr_1fr] text-[10px] uppercase tracking-wide text-text-muted">
              <span>Epoch</span>
              <span>Train Loss</span>
              <span>Val Loss</span>
              <span>mAP@50</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto font-mono">
            {logs.length === 0 && stage === 'idle' && (
              <div className="flex h-full items-center justify-center text-[11px] text-text-muted">
                학습 시작 버튼을 누르면 로그가 표시됩니다
              </div>
            )}
            {logs.map(log => (
              <div
                key={log.epoch}
                className={cn(
                  'grid grid-cols-[60px_1fr_1fr_1fr] border-b border-border-muted px-4 py-1.5 text-[11px]',
                  log.epoch === currentEpoch && stage === 'training' ? 'bg-accent-domain-muted' : ''
                )}
              >
                <span className="text-text-muted">{log.epoch}</span>
                <span className="text-status-revision">{log.loss}</span>
                <span className="text-yellow-500">{log.valLoss}</span>
                <span className="text-status-approved">{log.mAP}%</span>
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        </div>

      </div>
    </div>
  )
}
