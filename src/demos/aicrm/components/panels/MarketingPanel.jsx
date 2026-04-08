import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, BarChart3, TrendingUp, TrendingDown, Minus, ArrowUpRight, Sparkles, CheckCircle2 } from 'lucide-react'
import { channelPerformance } from '@crm/data/mockData'

const fmtCurrency = (n) => `$${(n / 1000).toFixed(0)}K`

const PRIORITY_CONFIG = {
  increase: { label: 'Increase', color: 'text-emerald-600', bg: 'bg-emerald-50', bar: 'bg-emerald-500' },
  maintain: { label: 'Hold',     color: 'text-gray-500',    bg: 'bg-gray-100',   bar: 'bg-sky-400' },
  decrease: { label: 'Reduce',   color: 'text-red-500',     bg: 'bg-red-50',     bar: 'bg-red-400' },
}

const getOptimizedSpend = (ch) => {
  if (ch.priority === 'increase') return Math.round(ch.spend * 1.4)
  if (ch.priority === 'decrease') return Math.round(ch.spend * 0.7)
  return ch.spend
}

export default function MarketingPanel({ onClose }) {
  const [applied, setApplied] = useState(false)

  const sorted = [...channelPerformance].sort((a, b) => b.conversionRate - a.conversionRate)
  const maxRate = sorted[0].conversionRate

  const totalSpend = channelPerformance.reduce((s, c) => s + c.spend, 0)
  const totalLeads = channelPerformance.reduce((s, c) => s + c.leads, 0)
  const totalConversions = channelPerformance.reduce((s, c) => s + c.conversions, 0)
  const avgConversion = ((totalConversions / totalLeads) * 100).toFixed(1)
  const topChannel = sorted[0]

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
        className="fixed top-0 right-0 h-screen w-[520px] bg-white border-l border-gray-200 z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex-shrink-0 px-5 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <h2 className="text-base font-semibold text-gray-900">Marketing Intelligence</h2>
              <div className="flex items-center gap-1 px-2 py-0.5 bg-violet-50 border border-violet-200 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                <span className="text-[11px] font-semibold text-violet-600">AI Active</span>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: '총 예산',    value: fmtCurrency(totalSpend),  color: 'text-gray-900' },
              { label: '총 리드',    value: totalLeads,               color: 'text-indigo-600' },
              { label: '총 전환',    value: totalConversions,         color: 'text-emerald-600' },
              { label: '평균 전환율', value: `${avgConversion}%`,     color: 'text-amber-500' },
            ].map(s => (
              <div key={s.label} className="p-2.5 bg-gray-50 rounded-xl text-center">
                <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Optimization applied banner */}
        <AnimatePresence>
          {applied && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="flex-shrink-0 overflow-hidden"
            >
              <div className="flex items-center gap-2.5 px-5 py-3 bg-emerald-50 border-b border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-emerald-800">AI 예산 최적화 적용됨</p>
                  <p className="text-[11px] text-emerald-600">예상 Pipeline ROI +23% · 이번 분기 전환 +8건 예측</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top channel banner (hides after apply) */}
        <AnimatePresence>
          {!applied && topChannel && (
            <motion.div
              initial={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex-shrink-0 overflow-hidden"
            >
              <div className="px-5 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2 px-3 py-2.5 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <ArrowUpRight className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                  <p className="text-xs font-medium text-indigo-800">
                    {topChannel.channel} 예산 집중 권장 — 이번 분기 Pipeline ROI 최고 경로
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Channel list */}
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">채널별 성과</p>
          <div className="space-y-2">
            {sorted.map((ch, i) => {
              const pc = PRIORITY_CONFIG[ch.priority]
              const optimized = getOptimizedSpend(ch)
              const spendChanged = applied && ch.priority !== 'maintain'

              return (
                <motion.div
                  key={ch.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="p-3 bg-gray-50 border border-gray-200 rounded-xl"
                >
                  {/* Top row */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">{ch.channel}</p>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${pc.bg} ${pc.color}`}>
                        {pc.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {ch.trend === 'up' && <TrendingUp className="w-3 h-3 text-emerald-600" />}
                      {ch.trend === 'down' && <TrendingDown className="w-3 h-3 text-red-500" />}
                      {(ch.trend === 'stable' || ch.trend === 'flat') && <Minus className="w-3 h-3 text-gray-400" />}
                      <span className={`text-xs font-bold tabular-nums ${
                        ch.trend === 'up' ? 'text-emerald-600' : ch.trend === 'down' ? 'text-red-500' : 'text-gray-400'
                      }`}>{ch.conversionRate}%</span>
                      <span className="text-[10px] text-gray-400">{ch.trendDelta}</span>
                    </div>
                  </div>

                  {/* Conversion rate bar */}
                  <div className="h-1.5 bg-gray-200 rounded-full mb-2.5 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${pc.bar}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(ch.conversionRate / maxRate) * 100}%` }}
                      transition={{ delay: 0.15 + i * 0.06, duration: 0.55, ease: 'easeOut' }}
                    />
                  </div>

                  {/* Stats + spend */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3 text-[11px] text-gray-500">
                      <span>{ch.leads} leads</span>
                      <span>{ch.conversions} 전환</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-gray-400">예산</span>
                      <motion.span
                        key={String(applied)}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-[11px] font-semibold tabular-nums ${
                          spendChanged
                            ? ch.priority === 'increase' ? 'text-emerald-600' : 'text-red-500'
                            : 'text-gray-700'
                        }`}
                      >
                        {fmtCurrency(applied ? optimized : ch.spend)}
                      </motion.span>
                      {spendChanged && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`text-[10px] font-bold ${
                            ch.priority === 'increase' ? 'text-emerald-600' : 'text-red-500'
                          }`}
                        >
                          {ch.priority === 'increase' ? '▲+40%' : '▼-30%'}
                        </motion.span>
                      )}
                    </div>
                  </div>

                  {/* Recommendation */}
                  <p className="text-[11px] text-gray-500 pt-2 border-t border-gray-200 leading-relaxed">
                    {ch.recommendation}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-5 py-4 border-t border-gray-100">
          <button
            onClick={() => setApplied(true)}
            disabled={applied}
            className={`w-full py-2.5 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
              applied
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {applied
              ? <><CheckCircle2 className="w-4 h-4" />최적화 적용 완료</>
              : <><Sparkles className="w-4 h-4" />AI 예산 최적화 적용</>
            }
          </button>
        </div>
      </motion.div>
    </>
  )
}
