import { motion } from 'framer-motion'
import { X, BookOpen, Trophy, AlertTriangle, Activity, Clock, TrendingUp } from 'lucide-react'
import { coachingInsights } from '@crm/data/mockData'

const INSIGHT_ICON = {
  win_pattern:  Trophy,
  risk_pattern: AlertTriangle,
  engagement:   Activity,
  timing:       Clock,
}
const IMPACT_CONFIG = {
  high:   { color: 'text-red-600',    bg: 'bg-red-50',    label: 'High Impact' },
  medium: { color: 'text-amber-500',  bg: 'bg-amber-50',  label: 'Medium' },
}
const EFFECTIVENESS = [
  { label: '챔피언 조기 확보', score: 78 },
  { label: '멀티스레딩',       score: 62 },
  { label: '법무 킥오프 속도', score: 45 },
  { label: '경쟁사 대응 속도', score: 88 },
]

export default function CoachingPanel({ onClose, metrics }) {
  const approved = Math.round(((metrics?.approvalRate ?? 0) / 100) * (metrics?.totalFeedbacks ?? 0))
  const winRate = Math.min(85, 64 + approved * 1.5)
  const winDelta = approved > 0 ? `+${(approved * 1.5).toFixed(0)}%` : '+0%'
  const avgDeal = 343 + approved * 8
  const dealDelta = approved > 0 ? `+${approved * 8}K` : '+0K'
  const avgCycle = Math.max(35, 47 - Math.floor(approved * 0.8))
  const cycleDelta = approved > 0 ? `-${Math.floor(approved * 0.8)}일` : '+0일'

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
        className="fixed top-0 right-0 h-screen w-[480px] bg-white border-l border-gray-200 z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex-shrink-0 px-5 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <h2 className="text-base font-semibold text-gray-900">Coaching Lab</h2>
              <div className="flex items-center gap-1 px-2 py-0.5 bg-violet-50 border border-violet-200 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                <span className="text-[11px] font-semibold text-violet-600">AI Active</span>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Win Rate',      value: `${winRate.toFixed(0)}%`,                           delta: winDelta },
              { label: 'Avg Deal Size', value: `$${avgDeal}K`,                                    delta: dealDelta },
              { label: 'Avg Cycle',     value: `${avgCycle}일`,                                   delta: cycleDelta },
              { label: 'AI 신뢰도',     value: `${metrics?.systemConfidence ?? 72}%`,              delta: `+${((metrics?.totalFeedbacks ?? 0) * 0.3).toFixed(1)}%` },
            ].map(k => (
              <div key={k.label} className="p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-gray-900">{k.value}</p>
                  <span className={`text-[11px] font-semibold flex items-center gap-0.5 ${approved > 0 ? 'text-emerald-600' : 'text-gray-400'}`}>
                    <TrendingUp className="w-3 h-3" />{k.delta}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">{k.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Insights */}
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">AI 코칭 인사이트</p>
            <div className="space-y-3">
              {coachingInsights.map(insight => {
                const Icon = INSIGHT_ICON[insight.type] || Activity
                const ic = IMPACT_CONFIG[insight.impact]
                return (
                  <div key={insight.id} className="p-4 bg-white border border-gray-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold text-gray-900">{insight.title}</p>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md flex-shrink-0 ${ic.bg} ${ic.color}`}>
                            {ic.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">{insight.body}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Playbook effectiveness */}
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">플레이북 효과 점수</p>
            <div className="space-y-3">
              {EFFECTIVENESS.map(item => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs text-gray-600">{item.label}</p>
                    <span className="text-xs font-semibold text-gray-700">{item.score}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.score}%` }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                      className={`h-full rounded-full ${
                        item.score >= 75 ? 'bg-emerald-500' : item.score >= 50 ? 'bg-amber-400' : 'bg-red-400'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}
