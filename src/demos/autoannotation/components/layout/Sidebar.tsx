'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Tag, BrainCircuit, Sparkles, ClipboardCheck, XCircle, CheckSquare } from 'lucide-react'
import { cn } from '@aa/lib/utils'

const PREFIX = '/demo/autoannotation'

const NAV_ITEMS = [
  { href: `${PREFIX}`,               icon: LayoutDashboard, label: '현황' },
  { href: `${PREFIX}/baseline`,       icon: Tag,             label: '라벨링' },
  { href: `${PREFIX}/training`,       icon: BrainCircuit,    label: '모델 학습' },
  { href: `${PREFIX}/autoannotate`,   icon: Sparkles,        label: 'AI 어노테이션' },
  { href: `${PREFIX}/worklist`,       icon: ClipboardCheck,  label: '검토' },
  { href: `${PREFIX}/revisions`, icon: XCircle,         label: '반려 목록' },
  { href: `${PREFIX}/completed`, icon: CheckSquare,     label: '완료 & 내보내기' },
]

interface NavItemProps {
  href: string
  icon: React.ElementType
  label: string
  active: boolean
}

function NavItem({ href, icon: Icon, label, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex w-full items-center gap-3 rounded px-3 py-2 text-[12px] transition-colors',
        active
          ? 'bg-accent-domain-muted text-accent-domain-text'
          : 'text-text-muted hover:bg-bg-surface hover:text-text-secondary'
      )}
    >
      <Icon size={16} strokeWidth={1.75} />
      {label}
    </Link>
  )
}

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === PREFIX) return pathname === PREFIX
    if (href === `${PREFIX}/worklist`) return pathname === `${PREFIX}/worklist` || pathname.startsWith(`${PREFIX}/review`)
    return pathname.startsWith(href)
  }

  return (
    <aside className="flex h-screen w-48 flex-shrink-0 flex-col border-r border-border-default bg-bg-sidebar px-2 py-3">
      <div className="mb-4 flex items-center gap-2 px-1">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded bg-accent-domain">
          <span className="text-[10px] font-bold text-white">AR</span>
        </div>
        <span className="text-[13px] font-semibold text-text-primary">AutoReview</span>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5">
        {NAV_ITEMS.map(item => (
          <NavItem key={item.href} {...item} active={isActive(item.href)} />
        ))}
      </nav>
    </aside>
  )
}
