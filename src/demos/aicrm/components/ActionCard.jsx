import { motion } from 'framer-motion'
import { ArrowRight, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { Badge } from '@crm/components/ui/badge'

const RANK_STYLE = {
  1: { num: 'text-red-600', bg: 'bg-red-50', ring: 'ring-red-200', urgencyColor: 'text-red-600' },
  2: { num: 'text-amber-500', bg: 'bg-amber-50', ring: 'ring-amber-200', urgencyColor: 'text-amber-500' },
  3: { num: 'text-yellow-500', bg: 'bg-yellow-50', ring: 'ring-yellow-200', urgencyColor: 'text-yellow-500' },
}

const URGENCY_COLOR = (score) => {
  if (score >= 90) return 'text-red-600'
  if (score >= 70) return 'text-amber-500'
  return 'text-yellow-500'
}

const RISK_VARIANT = {
  critical: 'destructive',
  high: 'warning',
  medium: 'secondary',
  low: 'success',
}
const RISK_LABEL = { critical: 'CRITICAL', high: 'HIGH', medium: 'MED', low: 'LOW' }
const formatARR = (n) => n >= 1000000 ? `$${(n / 1000000).toFixed(1)}M` : `$${(n / 1000).toFixed(0)}K`

const DEADLINE_BG = {
  1: 'bg-red-50 border-red-200',
  2: 'bg-amber-50 border-amber-200',
  3: 'bg-yellow-50 border-yellow-200',
}

export default function ActionCard({ account, recommendation, onSelect, isSelected, rank, onFeedback }) {
  const rs = RANK_STYLE[rank] || RANK_STYLE[3]
  const urgencyColor = URGENCY_COLOR(account.urgencyScore)

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.012, y: -2 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: 'spring', damping: 22, stiffness: 300 }}
      onClick={() => onSelect(account.id)}
      className={[
        'relative bg-white border rounded-xl p-4 cursor-pointer flex flex-col gap-0 transition-all duration-200 overflow-hidden',
        isSelected
          ? 'border-indigo-500 shadow-[0_0_0_2px_rgba(99,102,241,0.12),0_4px_16px_rgba(0,0,0,0.08)]'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]',
      ].join(' ')}
    >
      {/* Top context row */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-6 h-6 rounded-md ${rs.bg} ring-1 ${rs.ring} flex items-center justify-center flex-shrink-0`}>
            <span className={`text-xs font-bold ${rs.num}`}>{rank}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate leading-tight">{account.name}</p>
            <p className="text-[11px] text-gray-500 truncate">{formatARR(account.arr)} · {account.industry}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Badge variant={RISK_VARIANT[account.riskLevel]}>{RISK_LABEL[account.riskLevel]}</Badge>
          <span className={`text-sm font-bold tabular-nums ${urgencyColor}`}>{account.urgencyScore}</span>
        </div>
      </div>

      {/* THE COMMAND */}
      {recommendation && (
        <div className="mb-3">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Next Action</p>
          <p className="text-[15px] font-bold text-gray-900 leading-snug">{recommendation.title}</p>
        </div>
      )}

      {/* Why now — urgency deadline */}
      {account.urgencyDeadline && (
        <div className={`flex items-start gap-2 px-2.5 py-2 rounded-lg border mb-3 ${DEADLINE_BG[rank] || 'bg-gray-50 border-gray-200'}`}>
          <Clock className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs font-medium text-gray-600 leading-snug">{account.urgencyDeadline}</p>
        </div>
      )}

      {/* 2 supporting signals */}
      {recommendation && recommendation.rationale.length > 0 && (
        <div className="space-y-1.5 mb-3">
          {recommendation.rationale.slice(0, 2).map((r, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-gray-300 mt-1.5 flex-shrink-0" />
              <p className="text-xs text-gray-500 leading-relaxed">{r}</p>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-auto">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-400">{account.lastActivity}</span>
          {account.trend === 'declining' && (
            <span className="text-[10px] text-red-500 font-medium">↓ declining</span>
          )}
          {account.trend === 'improving' && (
            <span className="text-[10px] text-emerald-600 font-medium">↑ improving</span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {recommendation && onFeedback && recommendation.status === 'approved' && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" /> 승인됨
            </span>
          )}
          {recommendation && onFeedback && recommendation.status === 'rejected' && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-red-500">
              <XCircle className="w-3.5 h-3.5" /> 거절됨
            </span>
          )}
          {recommendation && onFeedback && !recommendation.status && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); onFeedback(recommendation.id, 'approved') }}
                className="p-1 rounded-md hover:bg-emerald-50 text-gray-300 hover:text-emerald-600 transition-colors"
                title="승인"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onFeedback(recommendation.id, 'rejected') }}
                className="p-1 rounded-md hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors"
                title="거절"
              >
                <XCircle className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(account.id) }}
            className="flex items-center gap-1 text-xs text-indigo-600 font-semibold hover:text-indigo-500 transition-colors"
          >
            지금 실행
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
