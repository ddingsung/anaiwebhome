import { motion } from 'framer-motion'
import { X, Target } from 'lucide-react'
import { deals, accounts } from '@crm/data/mockData'

const STAGE_ORDER = ['Proposal Sent', 'Technical Evaluation', 'Legal Review', 'Final Proposal', 'Contract Review']
const STAGE_COLOR = {
  'Proposal Sent':         { dot: 'bg-sky-500',     text: 'text-sky-600',     bg: 'bg-sky-50',     border: 'border-sky-200' },
  'Technical Evaluation':  { dot: 'bg-gray-400',    text: 'text-gray-600',    bg: 'bg-gray-50',    border: 'border-gray-200' },
  'Legal Review':          { dot: 'bg-amber-500',   text: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-200' },
  'Final Proposal':        { dot: 'bg-indigo-500',  text: 'text-indigo-600',  bg: 'bg-indigo-50',  border: 'border-indigo-200' },
  'Contract Review':       { dot: 'bg-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
}
const PROB_COLOR = (p) => p >= 75 ? 'text-emerald-600' : p >= 55 ? 'text-amber-500' : 'text-red-500'
const fmtVal = (n) => n >= 1000000 ? `$${(n / 1000000).toFixed(1)}M` : `$${(n / 1000).toFixed(0)}K`

export default function PipelinePanel({ onClose, onAccountSelect }) {
  const totalValue = deals.reduce((s, d) => s + d.value, 0)
  const weightedValue = Math.round(deals.reduce((s, d) => s + d.value * d.probability / 100, 0))

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-40"
      />
      <motion.div
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
        className="fixed top-0 right-0 h-screen w-[560px] bg-white border-l border-gray-200 z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex-shrink-0 px-5 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-600" />
              <h2 className="text-base font-semibold text-gray-900">Pipeline</h2>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-gray-50 rounded-xl text-center">
              <p className="text-sm font-bold text-gray-900">{fmtVal(totalValue)}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">총 파이프라인</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl text-center">
              <p className="text-sm font-bold text-emerald-600">{fmtVal(weightedValue)}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">가중 예상값</p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-xl text-center">
              <p className="text-sm font-bold text-indigo-600">{deals.length}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Active Deals</p>
            </div>
          </div>
        </div>

        {/* Stages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {STAGE_ORDER.map(stage => {
            const stageDeals = deals.filter(d => d.stage === stage)
            if (stageDeals.length === 0) return null
            const sc = STAGE_COLOR[stage]
            return (
              <div key={stage}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${sc.dot}`} />
                  <p className={`text-xs font-bold ${sc.text}`}>{stage}</p>
                  <span className="text-[10px] text-gray-400">{stageDeals.length}건</span>
                </div>
                <div className="space-y-2">
                  {stageDeals.map(deal => {
                    const account = accounts.find(a => a.id === deal.accountId)
                    return (
                      <button key={deal.id} onClick={() => onAccountSelect?.(deal.accountId)} className={`w-full text-left p-3 rounded-xl border ${sc.bg} ${sc.border} hover:brightness-95 transition-all`}>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="text-sm font-semibold text-gray-900">{account?.name}</p>
                          <span className={`text-xs font-bold tabular-nums ${PROB_COLOR(deal.probability)}`}>{deal.probability}%</span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-gray-500">
                          <span className="font-medium text-gray-700">{fmtVal(deal.value)}</span>
                          <span>{deal.daysInStage}d in stage</span>
                          {deal.competitors.length > 0 && (
                            <span className="text-red-500 font-medium">vs {deal.competitors[0]}</span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>
    </>
  )
}
