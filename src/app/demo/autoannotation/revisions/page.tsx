'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { RotateCcw, RefreshCw } from 'lucide-react'
import { useTaskStore } from '@aa/store/taskStore'
import { StatusBadge } from '@aa/components/worklist/StatusBadge'
import { ConfidenceBadge } from '@aa/components/worklist/ConfidenceBadge'
import { PreviewPanel } from '@aa/components/worklist/PreviewPanel'
import { RevisionReasonTag } from '@aa/components/revisions/RevisionReasonTag'
import { formatRelativeTime } from '@aa/lib/format'
import { cn } from '@aa/lib/utils'
import type { RejectionReason, Task } from '@aa/lib/types/task'

const TABS = [
  { key: 'revision', label: '수정 필요' },
  { key: 'rejected', label: '반려됨' },
  { key: 'all',      label: '전체' },
] as const

type TabKey = typeof TABS[number]['key']

export default function RevisionsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { tasks, sendBackToPending } = useTaskStore()

  const allTasks = useMemo(() =>
    tasks.filter(t => t.status === 'revision' || t.status === 'rejected')
  , [tasks])

  const filteredTasks = useMemo(() => {
    if (activeTab === 'revision') return allTasks.filter(t => t.status === 'revision')
    if (activeTab === 'rejected') return allTasks.filter(t => t.status === 'rejected')
    return allTasks
  }, [activeTab, allTasks])

  const tabCounts = useMemo(() => ({
    revision: allTasks.filter(t => t.status === 'revision').length,
    rejected: allTasks.filter(t => t.status === 'rejected').length,
    all:      allTasks.length,
  }), [allTasks])

  const selectedTask = useMemo(
    () => allTasks.find(t => t.id === selectedId) ?? null,
    [allTasks, selectedId]
  )

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex-shrink-0 border-b border-border-default px-4 py-3">
        <h1 className="text-[14px] font-semibold text-text-primary">반려 목록</h1>
        <p className="text-[11px] text-text-muted">수정이 필요하거나 반려된 항목을 확인하고 검토 작업실로 재진입합니다</p>
      </div>
      <div className="flex flex-shrink-0 border-b border-border-default px-4">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={cn(
              'border-b-2 px-3 py-2 text-[11px] transition-colors',
              activeTab === t.key
                ? 'border-accent-domain text-accent-domain-text'
                : 'border-transparent text-text-muted hover:text-text-secondary'
            )}
          >
            {t.label}
            <span className={cn(
              'ml-1.5 rounded-full px-1.5 py-0.5 text-[10px]',
              activeTab === t.key
                ? 'bg-accent-domain-muted text-accent-domain-text'
                : 'bg-bg-surface text-text-muted'
            )}>
              {tabCounts[t.key]}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden border-r border-border-default">
          <div className="grid grid-cols-[1fr_90px_70px_160px_100px_80px] border-b border-border-default px-4 py-1.5">
            {['파일명', '상태', '신뢰도', '반려 사유', '', ''].map((col, i) => (
              <span key={i} className="text-[11px] uppercase tracking-wide text-text-muted">{col}</span>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredTasks.map(task => (
              <div
                key={task.id}
                onClick={() => setSelectedId(task.id)}
                className={cn(
                  'grid grid-cols-[1fr_90px_70px_160px_100px_80px] cursor-pointer items-center border-b border-border-muted px-4 py-2 transition-colors',
                  selectedId === task.id ? 'bg-accent-domain-muted' : 'hover:bg-bg-surface'
                )}
              >
                <div>
                  <p className="text-[12px] text-text-primary">{task.filename}</p>
                  <p className="text-[10px] text-text-muted">{formatRelativeTime(task.processedAt)}</p>
                </div>
                <StatusBadge status={task.status} />
                <ConfidenceBadge value={task.confidence} />
                <div className="flex flex-wrap gap-1">
                  {(task.rejectionReasons ?? []).map(reason => (
                    <RevisionReasonTag key={reason} reason={reason as RejectionReason} />
                  ))}
                  {!task.rejectionReasons?.length && (
                    <span className="text-[10px] text-text-muted">—</span>
                  )}
                </div>
                <button
                  onClick={e => { e.stopPropagation(); sendBackToPending(task.id) }}
                  className="flex items-center gap-1 rounded border border-status-approved/40 px-2 py-1 text-[11px] text-status-approved transition-colors hover:bg-status-approved/10"
                >
                  <RefreshCw size={11} /> 수정 완료
                </button>
                <Link
                  href={`/demo/autoannotation/review/${task.id}`}
                  onClick={e => e.stopPropagation()}
                  className="flex items-center gap-1 rounded border border-border-strong px-2 py-1 text-[11px] text-text-muted transition-colors hover:text-text-primary"
                >
                  <RotateCcw size={11} /> 다시 열기
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="w-72 flex-shrink-0 overflow-hidden bg-bg-panel">
          <PreviewPanel task={selectedTask} showAction={false} />
        </div>
      </div>
    </div>
  )
}
