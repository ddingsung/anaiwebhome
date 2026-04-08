import { SKIN_LABELS } from '@aa/lib/mock/labels'

interface LabelSelectorProps {
  value: string
  onChange: (label: string) => void
}

export function LabelSelector({ value, onChange }: LabelSelectorProps) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full rounded border border-border-strong bg-bg-surface px-2 py-1.5 text-[12px] text-text-primary focus:border-accent-domain focus:outline-none"
    >
      {SKIN_LABELS.map(label => (
        <option key={label.id} value={label.id}>
          {label.name}
        </option>
      ))}
    </select>
  )
}
