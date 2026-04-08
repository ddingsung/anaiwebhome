interface PanelHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: React.ReactNode;
  variant?: 'default' | 'compact';
}

export default function PanelHeader({
  icon,
  title,
  description,
  badge,
  variant = 'default',
}: PanelHeaderProps) {
  if (variant === 'compact') {
    return (
      <div
        className="flex items-center gap-2 px-3 shrink-0"
        style={{
          height: '36px',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
          {icon}
        </span>
        <span className="text-[10px] font-semibold" style={{ color: 'var(--text-secondary)' }}>
          {title}
        </span>
        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
          {description}
        </span>
        {badge && <span className="ml-auto">{badge}</span>}
      </div>
    );
  }

  return (
    <div
      className="px-4 pt-3.5 pb-3 shrink-0"
      style={{ borderBottom: '1px solid var(--border-subtle)' }}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
            {icon}
          </span>
          <span className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
            {title}
          </span>
        </div>
        {badge && <span>{badge}</span>}
      </div>
      <p className="text-[11px] pl-5" style={{ color: 'var(--text-muted)' }}>
        {description}
      </p>
    </div>
  );
}
