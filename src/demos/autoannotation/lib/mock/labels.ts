export interface Label {
  id: string
  name: string
  color: string   // hex
}

export const SKIN_LABELS: Label[] = [
  { id: 'blackheads',  name: '블랙헤드',    color: '#1f2937' },
  { id: 'dark_spot',   name: '색소침착',    color: '#92400e' },
  { id: 'nodules',     name: '결절',        color: '#ef4444' },
  { id: 'papules',     name: '구진',        color: '#f97316' },
  { id: 'pustules',    name: '농포',        color: '#eab308' },
  { id: 'whiteheads',  name: '화이트헤드',  color: '#6b7280' },
]

export function getLabelById(id: string): Label | undefined {
  return SKIN_LABELS.find(l => l.id === id)
}

export function getLabelColor(id: string): string {
  return getLabelById(id)?.color ?? '#6b7280'
}
