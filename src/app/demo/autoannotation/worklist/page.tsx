'use client'

import { useMemo, useState } from 'react'
import { Search, CheckCheck, XCircle, X } from 'lucide-react'
import { useTaskStore } from '@aa/store/taskStore'
import { WorklistTable } from '@aa/components/worklist/WorklistTable'
import { PreviewPanel } from '@aa/components/worklist/PreviewPanel'
import { useWorklistStore } from '@aa/store/worklistStore'
import { cn } from '@aa/lib/utils'
import { REJECTION_REASON_LABELS, type RejectionReason } from '@aa/lib/types/task'

const TABS = [
  { key: 'pending',  label: '대기 중' },
  { key: 'priority', label: '우선순위' },
  { key: 'all',      label: '전체' },
] as const

const REJECTION_REASONS = Object.entries(REJECTION_REASON_LABELS) as [RejectionReason, string][]

export default function WorklistPage() {
  const { activeTab, selectedTaskId, searchQuery, selectedIds,
    setActiveTab, setSelectedTaskId, setSearchQuery,
    toggleSelect, selectAll, clearSelection } = useWorklistStore()

  const { tasks, approveTask, rejectTask } = useTaskStore()

  const [batchRejectOpen, setBatchRejectOpen] = useState(false)
  const [batchReasons, setBatchReasons] = useState<RejectionReason[]>([])

  const filteredTasks = useMemo(() => {
    let result = tasks
    if (activeTab === 'pending')       result = result.filter(t => t.status === 'pending' || t.status === 'ai_done')
    else if (activeTab === 'priority') result = result.filter(t => t.confidence < 80)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(t => t.filename.toLowerCase().includes(q))
    }
    return result
  }, [tasks, activeTab, searchQuery])

  const tabCounts = useMemo(() => ({
    pending:  tasks.filter(t => t.status === 'pending' || t.status === 'ai_done').length,
    priority: tasks.filter(t => t.confidence < 80).length,
    all:      tasks.length,
  }), [tasks])

  const selectedTask = useMemo(
    () => tasks.find(t => t.id === selectedTaskId) ?? null,
    [tasks, selectedTaskId]
  )

  const handleCheckAll = () => {
    const allChecked = filteredTasks.every(t => selectedIds.includes(t.id))
    if (allChecked) clearSelection()
    else selectAll(filteredTasks.map(t => t.id))
  }

  const handleBatchApprove = () => {
    selectedIds.forEach(id => approveTask(id))
    clearSelection()
  }

  const handleBatchReject = () => {
    if (batchReasons.length === 0) return
    selectedIds.forEach(id => rejectTask(id, batchReasons))
    clearSelection()
    setBatchRejectOpen(false)
    setBatchReasons([])
  }

  const toggleBatchReason = (reason: RejectionReason) => {
    setBatchReasons(prev =>
      prev.includes(reason) ? prev.filter(r => r !== reason) : [...prev, reason]
    )
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex flex-shrink-0 items-center justify-between border-b border-border-default px-4 py-3">
        <div>
          <h1 className="text-[14px] font-semibold text-text-primary">검토 작업함</h1>
          <p className="text-[11px] text-text-muted">AI가 생성한 어노테이션을 검토하고 승인 또는 반려합니다</p>
        </div>
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="파일명 검색"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="h-7 rounded border border-border-strong bg-bg-surface pl-7 pr-3 text-[12px] text-text-primary placeholder:text-text-muted focus:border-accent-domain focus:outline-none w-44"
          />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden border-r border-border-default">
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
                <span className={cn(
                  'ml-1.5 rounded-full px-1.5 py-0.5 text-[10px]',
                  activeTab === tab.key
                    ? 'bg-accent-domain-muted text-accent-domain-text'
                    : 'bg-bg-surface text-text-muted'
                )}>
                  {tabCounts[tab.key]}
                </span>
              </button>
            ))}
          </div>

          {/* 배치 액션 바 */}
          {selectedIds.length > 0 && (
            <div className="flex-shrink-0 border-b border-border-default bg-bg-overlay px-3 py-2 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-text-secondary">{selectedIds.length}개 선택됨</span>
                <button
                  onClick={handleBatchApprove}
                  className="flex items-center gap-1 rounded border border-status-approved/40 px-2 py-1 text-[11px] text-status-approved transition-colors hover:bg-status-approved/10"
                >
                  <CheckCheck size={12} /> 일괄 승인
                </button>
                <button
                  onClick={() => { setBatchRejectOpen(o => !o); setBatchReasons([]) }}
                  className="flex items-center gap-1 rounded border border-status-rejected/40 px-2 py-1 text-[11px] text-status-rejected transition-colors hover:bg-[#1a0808]"
                >
                  <XCircle size={12} /> 일괄 반려
                </button>
                <button
                  onClick={clearSelection}
                  className="ml-auto flex items-center gap-1 text-[11px] text-text-muted transition-colors hover:text-text-secondary"
                >
                  <X size={12} /> 선택 해제
                </button>
              </div>

              {batchRejectOpen && (
                <div className="rounded border border-status-rejected/20 bg-[#150808] p-2 space-y-2">
                  <p className="text-[11px] text-text-muted">반려 사유 선택 (필수)</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {REJECTION_REASONS.map(([key, label]) => (
                      <label key={key} className="flex cursor-pointer items-center gap-1.5">
                        <input
                          type="checkbox"
                          checked={batchReasons.includes(key)}
                          onChange={() => toggleBatchReason(key)}
                          className="accent-status-rejected"
                        />
                        <span className="text-[11px] text-text-secondary">{label}</span>
                      </label>
                    ))}
                  </div>
                  <button
                    onClick={handleBatchReject}
                    disabled={batchReasons.length === 0}
                    className="rounded bg-status-rejected px-3 py-1 text-[11px] font-medium text-white disabled:opacity-40"
                  >
                    반려 확정
                  </button>
                </div>
              )}
            </div>
          )}

          <WorklistTable
            tasks={filteredTasks}
            selectedId={selectedTaskId}
            checkedIds={selectedIds}
            onSelect={setSelectedTaskId}
            onCheck={toggleSelect}
            onCheckAll={handleCheckAll}
          />
        </div>

        <div className="w-72 flex-shrink-0 overflow-hidden bg-bg-panel">
          <PreviewPanel task={selectedTask} />
        </div>
      </div>
    </div>
  )
}
