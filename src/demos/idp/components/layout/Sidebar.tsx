'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  Plug,
  ClipboardList,
  Settings,
  User,
} from 'lucide-react'

const PREFIX = '/demo/idp';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: '대시보드', href: `${PREFIX}/dashboard`, active: true },
  { icon: FileText, label: '문서 목록', href: `${PREFIX}/documents`, active: true },
  { icon: Plug, label: '연동 설정', href: '#', active: false },
  { icon: ClipboardList, label: '감사 로그', href: '#', active: false },
]

export function Sidebar() {
  const pathname = usePathname()
  const [settingsClicked, setSettingsClicked] = useState(false)

  const handleSettingsClick = () => {
    setSettingsClicked(true)
    setTimeout(() => setSettingsClicked(false), 1500)
  }

  if (pathname.startsWith('/demo/idp/demo')) return null

  return (
    <aside className="fixed left-0 top-0 h-screen w-16 bg-bg-surface border-r border-border flex flex-col items-center py-4 z-40">
      {/* Logo */}
      <div className="w-9 h-9 bg-accent rounded-button flex items-center justify-center mb-6">
        <span className="text-white font-bold text-sm">IDP</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col items-center gap-1">
        {NAV_ITEMS.map(({ icon: Icon, label, href, active }) => {
          const isCurrentSection =
            pathname === href || (href === `${PREFIX}/dashboard` && pathname.startsWith(`${PREFIX}/document`))
          return (
            <Link
              key={label}
              href={href}
              title={label}
              className={`group relative w-10 h-10 flex items-center justify-center rounded-button transition-colors ${
                active
                  ? isCurrentSection
                    ? 'bg-accent-light text-accent'
                    : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary'
                  : 'text-text-tertiary cursor-not-allowed opacity-50'
              }`}
              onClick={(e) => !active && e.preventDefault()}
            >
              <Icon size={18} />
              {/* Tooltip */}
              <span className="absolute left-14 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {active ? label : `${label} (준비 중)`}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="flex flex-col items-center gap-2">
        <button
          title="설정"
          onClick={handleSettingsClick}
          className="group relative w-10 h-10 flex items-center justify-center rounded-button text-text-secondary hover:bg-gray-100 transition-colors"
        >
          <Settings size={18} />
          {settingsClicked && (
            <span className="absolute left-14 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap pointer-events-none">
              설정 (준비 중)
            </span>
          )}
        </button>
        <div title="사용자" className="w-8 h-8 bg-accent-light rounded-full flex items-center justify-center">
          <User size={14} className="text-accent" />
        </div>
      </div>
    </aside>
  )
}
