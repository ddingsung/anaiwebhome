'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, CheckCircle2, Loader2, ChevronRight, Sparkles, BrainCircuit } from 'lucide-react'
import { useTaskStore } from '@aa/store/taskStore'
import { addAnnotationsForTask } from '@aa/lib/mock/annotations'
import { DEMO_POOL, ROBOFLOW_ANNOTATIONS } from '@aa/lib/mock/roboflow'
import { cn } from '@aa/lib/utils'

const TOTAL_DATASET = 962

export default function AutoAnnotatePage() {
  const router = useRouter()
  const { addAITask } = useTaskStore()
  const [stage, setStage] = useState<'idle' | 'loaded' | 'processing' | 'done'>('idle')
  const [trainingDone, setTrainingDone] = useState(false)
  useEffect(() => { setTrainingDone(!!localStorage.getItem('training-done')) }, [])
  const [processedCount, setProcessedCount] = useState(0)
  const [doneItems, setDoneItems] = useState<Set<string>>(new Set())
  const counterRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // 드롭존 클릭 → 데모 데이터 로드
  const handleLoad = () => {
    if (stage !== 'idle') return
    setStage('loaded')
  }

  // AI 처리 시작
  const handleStart = async () => {
    setStage('processing')
    setProcessedCount(0)

    // 전체 카운터 애니메이션 (0 → TOTAL_DATASET, 3초)
    const start = Date.now()
    const duration = 3000
    counterRef.current = setInterval(() => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setProcessedCount(Math.round(eased * TOTAL_DATASET))
      if (progress >= 1) clearInterval(counterRef.current!)
    }, 30)

    // 각 데모 태스크를 순차 처리
    for (let i = 0; i < DEMO_POOL.length; i++) {
      await new Promise(r => setTimeout(r, (3000 / DEMO_POOL.length) + Math.random() * 100))
      const task = DEMO_POOL[i]
      addAITask(task)
      const ann = ROBOFLOW_ANNOTATIONS[task.id]
      if (ann) addAnnotationsForTask(ann)
      setDoneItems(prev => new Set([...prev, task.id]))
    }

    setProcessedCount(TOTAL_DATASET)
    setStage('done')
  }

  useEffect(() => {
    return () => { if (counterRef.current) clearInterval(counterRef.current) }
  }, [])

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex-shrink-0 border-b border-border-default px-4 py-3">
        <h1 className="text-[14px] font-semibold text-text-primary">AI 자동 어노테이션</h1>
        <p className="text-[11px] text-text-muted">이미지를 업로드하면 학습된 AI 모델이 자동으로 병변을 감지합니다</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-2xl space-y-4">

          {/* 학습 미완료 안내 */}
          {!trainingDone && (
            <div className="flex items-start gap-3 rounded-lg border border-yellow-500/30 bg-yellow-500/5 px-4 py-3">
              <BrainCircuit size={16} className="mt-0.5 flex-shrink-0 text-yellow-500" />
              <div className="flex-1">
                <p className="text-[12px] font-medium text-yellow-400">모델 학습이 완료되지 않았습니다</p>
                <p className="mt-0.5 text-[11px] text-text-muted">AI 어노테이션을 사용하려면 먼저 라벨링 데이터로 모델을 학습시켜야 합니다.</p>
              </div>
              <button
                onClick={() => router.push('/demo/autoannotation/training')}
                className="flex-shrink-0 rounded border border-yellow-500/40 px-3 py-1 text-[11px] text-yellow-400 hover:bg-yellow-500/10"
              >
                학습 페이지로 이동
              </button>
            </div>
          )}

          {/* 드롭존 */}
          {stage === 'idle' && (
            <div
              onClick={handleLoad}
              className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border-strong px-6 py-16 transition-colors hover:border-accent-domain hover:bg-bg-surface"
            >
              <Upload size={28} className="mb-3 text-text-muted" />
              <p className="text-[13px] font-medium text-text-secondary">이미지를 드래그하거나 클릭해서 선택</p>
              <p className="mt-1 text-[11px] text-text-muted">JPG, PNG, WEBP 지원</p>
            </div>
          )}

          {/* 로드된 데이터셋 미리보기 */}
          {(stage === 'loaded' || stage === 'processing' || stage === 'done') && (
            <div className="rounded-lg border border-border-default overflow-hidden">
              <div className="border-b border-border-default bg-bg-surface px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-text-secondary">여드름 피부 데이터셋</span>
                  <span className="rounded-full bg-bg-overlay px-2 py-0.5 text-[10px] text-text-muted">{TOTAL_DATASET}장</span>
                </div>
                {stage === 'processing' && (
                  <span className="text-[11px] text-text-muted tabular-nums">
                    {processedCount.toLocaleString()} / {TOTAL_DATASET.toLocaleString()} 처리 중
                  </span>
                )}
                {stage === 'done' && (
                  <span className="text-[11px] text-status-approved">{TOTAL_DATASET.toLocaleString()}장 완료</span>
                )}
              </div>

              {/* 썸네일 그리드 */}
              <div className="grid grid-cols-5 gap-0.5 bg-bg-base p-0.5">
                {DEMO_POOL.map((task) => (
                  <div key={task.id} className="relative aspect-square overflow-hidden bg-bg-surface">
                    <img
                      src={task.imageUrl}
                      alt={task.filename}
                      className="h-full w-full object-cover"
                    />
                    {doneItems.has(task.id) && (
                      <div className="absolute inset-0 flex items-center justify-center bg-status-approved/20">
                        <CheckCircle2 size={16} className="text-status-approved drop-shadow" />
                      </div>
                    )}
                    {stage === 'processing' && !doneItems.has(task.id) && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <Loader2 size={14} className="animate-spin text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* 프로그레스 바 */}
              {stage === 'processing' && (
                <div className="px-4 py-3">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-overlay">
                    <div
                      className="h-full rounded-full bg-accent-domain transition-all duration-100"
                      style={{ width: `${(processedCount / TOTAL_DATASET) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 액션 버튼 */}
          {stage === 'loaded' && (
            <button
              onClick={handleStart}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent-domain py-3 text-[13px] font-medium text-white transition-colors hover:bg-blue-600"
            >
              <Sparkles size={15} />
              AI 어노테이션 시작
            </button>
          )}

          {stage === 'processing' && (
            <div className="flex items-center justify-center gap-2 py-2 text-[12px] text-text-muted">
              <Loader2 size={14} className="animate-spin text-accent-domain-text" />
              AI 모델이 병변을 감지하고 있습니다…
            </div>
          )}

          {stage === 'done' && (
            <div className="flex items-center justify-between rounded-lg border border-status-approved/30 bg-status-approved/5 px-4 py-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-status-approved" />
                <span className="text-[12px] font-medium text-status-approved">
                  {TOTAL_DATASET.toLocaleString()}장 분석 완료 — {DEMO_POOL.length}개 검토 대기 중
                </span>
              </div>
              <button
                onClick={() => router.push('/demo/autoannotation/worklist')}
                className="flex items-center gap-1 text-[12px] text-accent-domain-text hover:underline"
              >
                검토 작업함에서 확인 <ChevronRight size={13} />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
