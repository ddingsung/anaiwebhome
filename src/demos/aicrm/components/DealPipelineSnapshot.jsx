import { TrendingUp, ChevronRight } from 'lucide-react'
import { Card, CardHeader, CardContent } from '@crm/components/ui/card'

const STAGE_CONFIG = {
  'Final Proposal': { color: 'text-indigo-600', bg: 'bg-indigo-50' },
  'Legal Review': { color: 'text-amber-600', bg: 'bg-amber-50' },
  'Contract Review': { color: 'text-emerald-600', bg: 'bg-emerald-50' },
  'Technical Evaluation': { color: 'text-gray-600', bg: 'bg-gray-100' },
  'Proposal Sent': { color: 'text-sky-600', bg: 'bg-sky-50' },
}

const PROB_COLOR = (p) => {
  if (p >= 75) return 'text-emerald-600'
  if (p >= 55) return 'text-amber-500'
  return 'text-red-500'
}

const fmtVal = (n) => n >= 1000000 ? `$${(n / 1000000).toFixed(1)}M` : `$${(n / 1000).toFixed(0)}K`

export default function DealPipelineSnapshot({ accounts, deals, onAccountSelect, effectiveScores }) {
  const sorted = [...deals].sort((a, b) => {
    const scoreA = effectiveScores?.[a.accountId] ?? accounts.find(ac => ac.id === a.accountId)?.urgencyScore ?? 0
    const scoreB = effectiveScores?.[b.accountId] ?? accounts.find(ac => ac.id === b.accountId)?.urgencyScore ?? 0
    return scoreB - scoreA
  })

  const totalValue = deals.reduce((sum, d) => sum + d.value, 0)
  const weightedProb = Math.round(deals.reduce((sum, d) => sum + d.value * d.probability / 100, 0))

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pipeline Snapshot</h3>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">{fmtVal(totalValue)}</p>
            <p className="text-[10px] text-gray-400">총 파이프라인</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary row */}
        <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg mb-3">
          <div className="text-center">
            <p className="text-sm font-semibold text-emerald-600">{fmtVal(weightedProb)}</p>
            <p className="text-[10px] text-gray-400">가중 예상값</p>
          </div>
          <div className="w-px h-6 bg-gray-200" />
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-900">{deals.length}</p>
            <p className="text-[10px] text-gray-400">Active Deals</p>
          </div>
          <div className="w-px h-6 bg-gray-200" />
          <div className="text-center">
            <p className="text-sm font-semibold text-amber-500">
              {deals.filter(d => d.riskLevel === 'critical' || d.riskLevel === 'high').length}
            </p>
            <p className="text-[10px] text-gray-400">High Risk</p>
          </div>
        </div>

        {/* Deal list */}
        <div className="space-y-1">
          {sorted.map((deal) => {
            const stage = STAGE_CONFIG[deal.stage] || { color: 'text-gray-500', bg: 'bg-gray-100' }
            const account = accounts.find(a => a.id === deal.accountId)
            return (
              <button
                key={deal.id}
                onClick={() => onAccountSelect && onAccountSelect(deal.accountId)}
                className="w-full text-left flex items-center gap-3 px-2.5 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">{account?.name}</p>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${stage.bg} ${stage.color} flex-shrink-0`}>
                      {deal.stage}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-500">{fmtVal(deal.value)}</span>
                    <span className="text-gray-300">·</span>
                    <span className={`text-xs font-medium ${PROB_COLOR(deal.probability)}`}>{deal.probability}%</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-xs text-gray-400">{deal.daysInStage}d in stage</span>
                  </div>
                </div>
                {deal.competitors.length > 0 && (
                  <span className="text-[10px] text-red-500 bg-red-50 px-1.5 py-0.5 rounded flex-shrink-0">vs {deal.competitors[0]}</span>
                )}
                <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
