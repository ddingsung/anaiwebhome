import { AlertTriangle, ChevronRight } from 'lucide-react'
import { Card, CardHeader, CardContent } from '@crm/components/ui/card'
import { Badge } from '@crm/components/ui/badge'

const RISK_CONFIG = {
  critical: { dot: 'bg-red-500', text: 'text-red-600', border: 'border-l-red-500', label: 'CRITICAL' },
  high: { dot: 'bg-amber-500', text: 'text-amber-500', border: 'border-l-amber-500', label: 'HIGH' },
  medium: { dot: 'bg-yellow-400', text: 'text-yellow-500', border: 'border-l-yellow-400', label: 'MEDIUM' },
  low: { dot: 'bg-emerald-500', text: 'text-emerald-600', border: 'border-l-emerald-500', label: 'LOW' },
}

export default function RiskAlerts({ accounts, onAccountSelect, effectiveScores }) {
  const sorted = [...accounts].sort((a, b) => (effectiveScores?.[b.id] ?? b.urgencyScore) - (effectiveScores?.[a.id] ?? a.urgencyScore))
  const counts = accounts.reduce((acc, a) => { acc[a.riskLevel] = (acc[a.riskLevel] || 0) + 1; return acc }, {})

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Risk Alerts</h3>
          </div>
          <div className="flex items-center gap-1.5">
            {counts.critical && <Badge variant="destructive">CRITICAL ×{counts.critical}</Badge>}
            {counts.high && <Badge variant="warning">HIGH ×{counts.high}</Badge>}
            {counts.medium && <Badge variant="secondary">MED ×{counts.medium}</Badge>}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1.5">
          {sorted.map((account) => {
            const cfg = RISK_CONFIG[account.riskLevel]
            return (
              <button
                key={account.id}
                onClick={() => onAccountSelect(account.id)}
                className={`w-full text-left flex items-start gap-3 p-2.5 rounded-lg border-l-2 ${cfg.border} bg-gray-50 hover:bg-gray-100 transition-colors group`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot} mt-1.5 flex-shrink-0`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">{account.name}</p>
                    <span className={`text-[10px] font-bold ${cfg.text} flex-shrink-0`}>{effectiveScores?.[account.id] ?? account.urgencyScore}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">{account.summary}</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition-colors mt-1 flex-shrink-0" />
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
