'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  RiDashboard3Line,
  RiTruckLine,
  RiGitBranchLine,
  RiFlashlightLine,
  RiTestTubeLine,
} from 'react-icons/ri';
import { clsx } from 'clsx';

const PREFIX = '/demo/smartlog';

const NAV_ITEMS = [
  { href: `${PREFIX}/command`, icon: RiDashboard3Line, label: 'Command' },
  { href: `${PREFIX}/dock`, icon: RiTruckLine, label: 'Dock' },
  { href: `${PREFIX}/conveyor`, icon: RiGitBranchLine, label: 'Conveyor' },
  { href: `${PREFIX}/actions`, icon: RiFlashlightLine, label: 'Actions' },
  { href: `${PREFIX}/twin`, icon: RiTestTubeLine, label: 'Twin' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="flex flex-col items-center w-[60px] border-r py-4 gap-1 shrink-0"
      style={{
        background: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      {/* 로고 */}
      <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-4 shrink-0"
        style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)' }}>
        <span className="text-white text-xs font-bold">SL</span>
      </div>

      {/* 네비게이션 */}
      <nav className="flex flex-col gap-1 w-full px-2 flex-1">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={clsx(
                'flex items-center justify-center w-full h-10 rounded-md transition-colors relative group',
                isActive
                  ? 'text-cyan-400'
                  : 'text-white/30 hover:text-white/70 hover:bg-white/5'
              )}
              style={isActive ? { background: 'rgba(6,182,212,0.1)' } : {}}
            >
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r"
                  style={{ background: '#06b6d4' }}
                />
              )}
              <Icon size={18} />

              {/* 툴팁 */}
              <span className="absolute left-full ml-2 px-2 py-1 text-xs rounded whitespace-nowrap
                opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
                style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-default)' }}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

    </aside>
  );
}
