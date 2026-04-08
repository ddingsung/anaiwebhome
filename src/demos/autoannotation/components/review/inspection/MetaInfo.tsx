import { formatRelativeTime } from '@aa/lib/format'
import type { Task } from '@aa/lib/types/task'

interface MetaInfoProps {
  task: Task
}

export function MetaInfo({ task }: MetaInfoProps) {
  const rows = [
    { label: '파일명',   value: task.filename },
    { label: '담당자',   value: task.assignee ?? '미지정' },
    { label: '처리 시각', value: formatRelativeTime(task.processedAt) },
    { label: '수정 횟수', value: `${task.revisionCount}회` },
  ]

  return (
    <div className="space-y-1.5">
      {rows.map(({ label, value }) => (
        <div key={label} className="flex justify-between text-[11px]">
          <span className="text-text-muted">{label}</span>
          <span className="max-w-[160px] truncate text-right text-text-secondary">{value}</span>
        </div>
      ))}
    </div>
  )
}
