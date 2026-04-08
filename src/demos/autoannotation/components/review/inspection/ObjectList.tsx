import { ObjectListItem } from './ObjectListItem'
import type { Annotation } from '@aa/lib/types/annotation'

interface ObjectListProps {
  annotations: Annotation[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function ObjectList({ annotations, selectedId, onSelect }: ObjectListProps) {
  return (
    <div className="space-y-0.5">
      {annotations.map(ann => (
        <ObjectListItem
          key={ann.id}
          annotation={ann}
          isSelected={selectedId === ann.id}
          onClick={() => onSelect(ann.id)}
        />
      ))}
      {annotations.length === 0 && (
        <p className="py-4 text-center text-[11px] text-text-muted">객체 없음</p>
      )}
    </div>
  )
}
