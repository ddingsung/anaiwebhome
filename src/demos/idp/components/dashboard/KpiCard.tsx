interface KpiCardProps {
  label: string
  value: string | number
  sub?: string
  accent?: boolean
}

export function KpiCard({ label, value, sub, accent }: KpiCardProps) {
  return (
    <div className="bg-bg-surface rounded-card shadow-card p-5 flex flex-col gap-1">
      <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">{label}</span>
      <span
        className={`font-numeric text-3xl font-bold leading-tight ${
          accent ? 'text-accent' : 'text-text-primary'
        }`}
      >
        {value}
      </span>
      {sub && <span className="text-xs text-text-tertiary">{sub}</span>}
    </div>
  )
}
