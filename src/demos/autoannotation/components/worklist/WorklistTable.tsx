'use client'

import { WorklistRow } from './WorklistRow'
import type { Task } from '@aa/lib/types/task'

interface WorklistTableProps {
  tasks: Task[]
  selectedId: string | null
  checkedIds: string[]
  onSelect: (id: string) => void
  onCheck: (id: string) => void
  onCheckAll: () => void
}

export function WorklistTable({
  tasks, selectedId, checkedIds, onSelect, onCheck, onCheckAll,
}: WorklistTableProps) {
  const allChecked = tasks.length > 0 && tasks.every(t => checkedIds.includes(t.id))
  const someChecked = tasks.some(t => checkedIds.includes(t.id))

  return (
    <div role="table" className="flex flex-col overflow-y-auto">
      <div className="grid grid-cols-[20px_1fr_90px_70px_40px_72px] border-b border-border-default px-3 py-1.5">
        <input
          type="checkbox"
          checked={allChecked}
          ref={el => { if (el) el.indeterminate = someChecked && !allChecked }}
          onChange={onCheckAll}
          className="h-3.5 w-3.5 cursor-pointer accent-accent-domain"
        />
        {['파일명', '상태', '신뢰도', '수정', '처리 시각'].map((col, i) => (
          <span key={i} className="text-[11px] uppercase tracking-wide text-text-muted">
            {col}
          </span>
        ))}
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-1 items-center justify-center py-16 text-[13px] text-text-muted">
          항목이 없습니다
        </div>
      ) : (
        tasks.map(task => (
          <WorklistRow
            key={task.id}
            task={task}
            isSelected={selectedId === task.id}
            isChecked={checkedIds.includes(task.id)}
            onClick={() => onSelect(task.id)}
            onCheck={() => onCheck(task.id)}
          />
        ))
      )}
    </div>
  )
}
