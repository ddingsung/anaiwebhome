import { Zap, LayoutDashboard, Building2, Target, BarChart3, BookOpen, Settings, MonitorPlay } from 'lucide-react'

const NAV = [
  { key: 'intelligence', icon: LayoutDashboard, label: 'Intelligence Hub' },
  { key: 'accounts', icon: Building2, label: 'Accounts' },
  { key: 'pipeline', icon: Target, label: 'Pipeline' },
  { key: 'marketing', icon: BarChart3, label: 'Marketing' },
  { key: 'coaching', icon: BookOpen, label: 'Coaching Lab' },
]

export default function Sidebar({ activeNav, onNavChange, onDemoStart, demoMode }) {
  return (
    <div className="w-14 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col items-center py-4 gap-1">
      {/* Logo */}
      <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center mb-4">
        <Zap className="w-4 h-4 text-indigo-600" />
      </div>

      <div className="w-full px-2 space-y-0.5">
        {NAV.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            title={label}
            onClick={() => onNavChange(key)}
            className={[
              'w-full flex items-center justify-center h-9 rounded-lg transition-colors',
              activeNav === key
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100',
            ].join(' ')}
          >
            <Icon className="w-4 h-4" />
          </button>
        ))}
      </div>

      <div className="mt-auto px-2 space-y-0.5">
        <button
          title="데모 다시보기"
          onClick={onDemoStart}
          className={[
            'w-full flex items-center justify-center h-9 rounded-lg transition-colors',
            demoMode
              ? 'bg-indigo-50 text-indigo-600'
              : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50',
          ].join(' ')}
        >
          <MonitorPlay className="w-4 h-4" />
        </button>
        <button
          title="Settings"
          onClick={() => onNavChange('settings')}
          className={[
            'w-full flex items-center justify-center h-9 rounded-lg transition-colors',
            activeNav === 'settings'
              ? 'bg-indigo-50 text-indigo-600'
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100',
          ].join(' ')}
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
