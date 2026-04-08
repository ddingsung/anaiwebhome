import { Zap, CheckCircle2, XCircle, Edit2, Send, AlertTriangle, Brain, RefreshCw, ArrowRight } from 'lucide-react'
import { teamActivities } from '../data/mockData'
import { Card, CardHeader, CardContent } from '@crm/components/ui/card'

const TYPE_CONFIG = {
  signal: { icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
  approval: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  rejection: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
  update: { icon: Edit2, color: 'text-sky-600', bg: 'bg-sky-50' },
  outreach: { icon: Send, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  alert: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
  learning: { icon: Brain, color: 'text-violet-600', bg: 'bg-violet-50' },
}

export default function TeamActivityFeed({ onAccountSelect }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-semibold text-gray-900">Team Activity</h3>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-emerald-600 font-medium">Live</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-0.5">
          {teamActivities.map((item) => {
            const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.update
            const Icon = cfg.icon
            const isClickable = !!item.accountId && !!onAccountSelect

            return (
              <div
                key={item.id}
                onClick={isClickable ? () => onAccountSelect(item.accountId) : undefined}
                className={[
                  'flex items-start gap-2.5 px-1 py-2 rounded-lg transition-colors group',
                  isClickable ? 'cursor-pointer hover:bg-gray-50' : '',
                ].join(' ')}
              >
                <div className={`w-6 h-6 rounded-md ${cfg.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <Icon className={`w-3 h-3 ${cfg.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-600 leading-snug">
                    <span className="font-medium text-gray-800">{item.actor}</span>
                    {' — '}
                    {item.action}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
                  <span className="text-[10px] text-gray-400">{item.time}</span>
                  {isClickable && (
                    <ArrowRight className="w-3 h-3 text-gray-300 group-hover:text-indigo-400 transition-colors" />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
