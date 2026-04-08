'use client'

import { useState, useMemo } from 'react'
import { Download, CheckCircle2, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTaskStore } from '@aa/store/taskStore'
import { useDownloadStore } from '@aa/store/downloadStore'
import { ROBOFLOW_TASKS } from '@aa/lib/mock/roboflow'
import { StatusBadge } from '@aa/components/worklist/StatusBadge'
import { ConfidenceBadge } from '@aa/components/worklist/ConfidenceBadge'
import { formatRelativeTime, formatDuration } from '@aa/lib/format'
import { formatBytes } from '@aa/lib/mock/downloads'
import { cn } from '@aa/lib/utils'
import type { Task } from '@aa/lib/types/task'

const TABS = [
  { key: 'approved', label: '승인 목록' },
  { key: 'export',   label: '데이터셋 내보내기' },
] as const

type TabKey = typeof TABS[number]['key']

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).replace(/\. /g, '.').replace(/\.$/, '')
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="w-28 flex-shrink-0 text-[11px] text-text-muted">{label}</span>
      <span className="text-[12px] text-text-secondary">{value}</span>
    </div>
  )
}

function DownloadButton({ label }: { label: string }) {
  return (
    <button
      onClick={() => alert(`${label} 다운로드는 실제 API 연결 후 제공됩니다.`)}
      className="flex items-center gap-1.5 rounded border border-border-strong px-3 py-1.5 text-[11px] text-text-secondary transition-colors hover:border-accent-domain hover:text-accent-domain-text"
    >
      <Download size={12} />
      다운로드
    </button>
  )
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded border border-border-default px-4 py-8 text-center text-[12px] text-text-muted">
      {label}
    </div>
  )
}

function CompletedDetailPanel({ task }: { task: Task | null }) {
  if (!task) {
    return (
      <div className="flex h-full items-center justify-center text-[13px] text-text-muted">
        항목을 선택하면 상세 정보가 표시됩니다
      </div>
    )
  }
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border-default p-3">
        <p className="text-[12px] font-medium text-text-primary">{task.filename}</p>
        <div className="mt-1 flex items-center gap-2">
          <StatusBadge status={task.status} />
          <ConfidenceBadge value={task.confidence} />
        </div>
      </div>
      <div className="relative bg-[#0d0d0d]" style={{ height: '200px' }}>
        <img
          src={task.thumbnailUrl}
          alt={task.filename}
          className="h-full w-full object-contain"
        />
      </div>
      <div className="flex-1 p-3 space-y-1.5">
        <p className="text-[11px] font-medium uppercase tracking-wide text-text-muted">승인 정보</p>
        {[
          { label: '승인자',         value: task.approvedBy ?? '—' },
          { label: '승인 시각',      value: task.approvedAt ? formatRelativeTime(task.approvedAt) : '—' },
          { label: '검토 소요 시간', value: task.reviewDurationSeconds ? formatDuration(task.reviewDurationSeconds) : '—' },
          { label: '수정 횟수',      value: `${task.revisionCount}회` },
          { label: '객체 수',        value: `${task.annotationCount}개` },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between text-[11px]">
            <span className="text-text-muted">{label}</span>
            <span className="text-text-secondary">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const EXPORT_FORMATS = ['YOLO', 'COCO'] as const
type ExportFormat = typeof EXPORT_FORMATS[number]

function ApprovedTab() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [format, setFormat] = useState<ExportFormat>('YOLO')
  const { tasks } = useTaskStore()
  const { exportDataset } = useDownloadStore()

  const approvedTasks = useMemo(() => {
    const userApproved = tasks.filter(t => t.status === 'approved')
    const userIds = new Set(userApproved.map(t => t.id))
    const baseData = ROBOFLOW_TASKS.filter(t => !userIds.has(t.id))
    return [...userApproved, ...baseData]
  }, [tasks])

  const selectedTask = useMemo(
    () => approvedTasks.find(t => t.id === selectedId) ?? null,
    [selectedId, approvedTasks]
  )

  const handleExport = () => {
    if (approvedTasks.length === 0) return
    exportDataset(approvedTasks, format)
    alert('데이터셋이 생성되었습니다. 데이터셋 내보내기 탭에서 확인하세요.')
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex flex-shrink-0 items-center justify-between border-b border-border-default px-4 py-2">
        <span className="text-[11px] text-text-muted">승인된 항목 {approvedTasks.length}건</span>
        <div className="flex items-center gap-2">
          <div className="flex rounded border border-border-strong overflow-hidden">
            {EXPORT_FORMATS.map(f => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={cn(
                  'px-2.5 py-1 text-[11px] transition-colors',
                  format === f
                    ? 'bg-accent-domain text-white'
                    : 'text-text-muted hover:text-text-secondary'
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <button
            onClick={handleExport}
            disabled={approvedTasks.length === 0}
            className="flex items-center gap-1.5 rounded border border-border-strong px-3 py-1.5 text-[11px] text-text-secondary transition-colors hover:border-accent-domain hover:text-accent-domain-text disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download size={12} />
            내보내기
          </button>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden border-r border-border-default">
          <div className="grid grid-cols-[1fr_80px_70px_80px_80px] border-b border-border-default px-4 py-1.5">
            {['파일명', '승인자', '신뢰도', '소요 시간', '승인 시각'].map((col, i) => (
              <span key={i} className="text-[11px] uppercase tracking-wide text-text-muted">{col}</span>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto">
            {approvedTasks.map(task => (
              <div
                key={task.id}
                onClick={() => setSelectedId(task.id)}
                className={cn(
                  'grid grid-cols-[1fr_80px_70px_80px_80px] cursor-pointer items-center',
                  'border-b border-border-muted px-4 py-2 transition-colors',
                  selectedId === task.id ? 'bg-accent-domain-muted' : 'hover:bg-bg-surface'
                )}
              >
                <div>
                  <p className="text-[12px] text-text-primary">{task.filename}</p>
                  <p className="text-[10px] text-text-muted">객체 {task.annotationCount}개</p>
                </div>
                <span className="text-[11px] text-text-secondary">{task.approvedBy ?? '—'}</span>
                <ConfidenceBadge value={task.confidence} />
                <span className="text-[11px] text-text-secondary">
                  {task.reviewDurationSeconds ? formatDuration(task.reviewDurationSeconds) : '—'}
                </span>
                <span className="text-[10px] text-text-muted">
                  {task.approvedAt ? formatRelativeTime(task.approvedAt) : '—'}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="w-72 flex-shrink-0 overflow-hidden bg-bg-panel">
          <CompletedDetailPanel task={selectedTask} />
        </div>
      </div>
    </div>
  )
}

function ExportTab() {
  const { generatedDatasets, generatedModels } = useDownloadStore()

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="space-y-8 px-6 py-6">
        <section>
          <h2 className="mb-3 text-[12px] font-semibold text-text-secondary">데이터셋</h2>
          {generatedDatasets.length === 0 ? (
            <EmptyState label="아직 생성된 데이터셋이 없습니다. 승인 목록 탭에서 데이터셋을 내보내세요." />
          ) : (
            <div className="divide-y divide-border-muted rounded border border-border-default">
              {generatedDatasets.map(ds => (
                <div key={ds.id} className="flex items-start justify-between px-4 py-4">
                  <div className="space-y-1.5">
                    <p className="text-[13px] font-medium text-text-primary">{ds.name}</p>
                    <div className="space-y-0.5">
                      <MetaRow label="생성일" value={formatDate(ds.createdAt)} />
                      <MetaRow label="이미지 수" value={`${ds.imageCount.toLocaleString()}장`} />
                      <MetaRow label="어노테이션 수" value={`${ds.annotationCount.toLocaleString()}개`} />
                      <MetaRow label="포맷" value={ds.format} />
                      <MetaRow label="파일 크기" value={formatBytes(ds.sizeBytes)} />
                    </div>
                  </div>
                  <DownloadButton label={ds.name} />
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-[12px] font-semibold text-text-secondary">모델</h2>
          {generatedModels.length === 0 ? (
            <EmptyState label="아직 생성된 모델이 없습니다." />
          ) : (
            <div className="divide-y divide-border-muted rounded border border-border-default">
              {generatedModels.map(mdl => (
                <div key={mdl.id} className="flex items-start justify-between px-4 py-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <p className="text-[13px] font-medium text-text-primary">{mdl.name}</p>
                      <span className="rounded bg-bg-surface px-1.5 py-0.5 text-[10px] text-text-muted">{mdl.format}</span>
                    </div>
                    <div className="space-y-0.5">
                      <MetaRow label="학습일" value={formatDate(mdl.trainedAt)} />
                      <MetaRow label="사용 데이터셋" value={mdl.datasetName} />
                      <MetaRow label="파일 형식" value={mdl.format} />
                      <MetaRow label="검증 결과" value={mdl.validationSummary} />
                      <MetaRow label="파일 크기" value={formatBytes(mdl.sizeBytes)} />
                    </div>
                  </div>
                  <DownloadButton label={`${mdl.name} (${mdl.format})`} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default function CompletedPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('approved')
  const { tasks } = useTaskStore()
  const router = useRouter()
  const approvedCount = useMemo(() => {
    const userApproved = tasks.filter(t => t.status === 'approved')
    const userIds = new Set(userApproved.map(t => t.id))
    return userApproved.length + ROBOFLOW_TASKS.filter(t => !userIds.has(t.id)).length
  }, [tasks])

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex-shrink-0 border-b border-border-default px-4 py-3">
        <h1 className="text-[14px] font-semibold text-text-primary">완료 & 내보내기</h1>
        <p className="text-[11px] text-text-muted">승인된 어노테이션을 데이터셋으로 내보내거나 모델 학습에 활용합니다</p>
      </div>
      <div className="flex flex-shrink-0 border-b border-border-default px-4">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'border-b-2 px-3 py-2 text-[11px] transition-colors',
              activeTab === tab.key
                ? 'border-accent-domain text-accent-domain-text'
                : 'border-transparent text-text-muted hover:text-text-secondary'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {approvedCount === 0 && (
        <div className="mx-6 mt-4 flex items-start gap-3 rounded-lg border border-yellow-500/30 bg-yellow-500/5 px-4 py-3">
          <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-yellow-500" />
          <div className="flex-1">
            <p className="text-[12px] font-medium text-yellow-400">승인된 항목이 없습니다</p>
            <p className="mt-0.5 text-[11px] text-text-muted">검토 작업함에서 AI 어노테이션 결과를 검토하고 승인해야 내보내기가 가능합니다.</p>
          </div>
          <button
            onClick={() => router.push('/demo/autoannotation/worklist')}
            className="flex flex-shrink-0 items-center gap-1 rounded border border-yellow-500/40 px-3 py-1 text-[11px] text-yellow-400 hover:bg-yellow-500/10"
          >
            검토 작업함으로 이동 <ChevronRight size={11} />
          </button>
        </div>
      )}

      {activeTab === 'approved' ? <ApprovedTab /> : <ExportTab />}
    </div>
  )
}
