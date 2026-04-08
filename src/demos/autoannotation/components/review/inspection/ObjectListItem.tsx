import { cn } from '@aa/lib/utils'
import { getLabelById } from '@aa/lib/mock/labels'
import type { Annotation } from '@aa/lib/types/annotation'

interface ObjectListItemProps {
  annotation: Annotation
  isSelected: boolean
  onClick: () => void
}

export function ObjectListItem({ annotation, isSelected, onClick }: ObjectListItemProps) {
  const labelInfo = getLabelById(annotation.label)

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 transition-colors',
        isSelected ? 'bg-accent-domain-muted' : 'hover:bg-bg-surface'
      )}
    >
      <span
        className="h-2 w-2 flex-shrink-0 rounded-full"
        style={{ background: labelInfo?.color ?? '#6b7280' }}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] text-text-primary">
          {labelInfo?.name ?? annotation.label}
        </p>
        <p className="text-[10px] text-text-muted">
          {annotation.type === 'bbox' ? '바운딩박스' : '폴리곤'}
          {annotation.isModified && <span className="ml-1 text-status-revision">· 수정됨</span>}
        </p>
      </div>
      <span className={cn(
        'flex-shrink-0 font-mono text-[10px]',
        annotation.confidence >= 90 ? 'text-conf-high' :
        annotation.confidence >= 70 ? 'text-conf-mid' : 'text-conf-low'
      )}>
        {annotation.confidence.toFixed(0)}%
      </span>
    </div>
  )
}
