import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, CheckCircle2, XCircle, Edit2,
  TrendingUp, TrendingDown, Zap, ArrowUp, ArrowDown,
  MessageSquare, SlidersHorizontal, BarChart3,
} from 'lucide-react'
import { Card, CardHeader, CardContent } from '@crm/components/ui/card'
import { Separator } from '@crm/components/ui/separator'

const ACTION_CONFIG = {
  approved: { label: '승인', Icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', dot: 'bg-emerald-500' },
  rejected: { label: '거절', Icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', dot: 'bg-red-400' },
  edited: { label: '수정', Icon: Edit2, color: 'text-amber-500', bg: 'bg-amber-50', dot: 'bg-amber-400' },
}

const CYCLE_STEPS = [
  { key: 'input',   Icon: MessageSquare,    label: 'Input',         sub: '피드백 수집' },
  { key: 'process', Icon: SlidersHorizontal, label: 'Weight Update', sub: '가중치 조정' },
  { key: 'output',  Icon: BarChart3,         label: 'Ranking Output', sub: '랭킹 재계산' },
]

const fmtTime = (ts) => {
  const diff = Math.floor((Date.now() - new Date(ts)) / 60000)
  if (diff < 1) return 'just now'
  if (diff < 60) return `${diff}m ago`
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`
  return `${Math.floor(diff / 1440)}d ago`
}

export default function ActiveLearningPanel({ feedbackHistory, metrics }) {
  const prevLengthRef = useRef(feedbackHistory.length)
  const [isAdapting, setIsAdapting] = useState(false)
  const [latestAdaptation, setLatestAdaptation] = useState(null)
  const [confidenceDelta, setConfidenceDelta] = useState(null)
  const [cycleStep, setCycleStep] = useState(-1) // -1 = idle, 0/1/2 = animating

  useEffect(() => {
    if (feedbackHistory.length > prevLengthRef.current) {
      const newest = feedbackHistory[0]
      setLatestAdaptation(newest)
      setIsAdapting(true)
      setConfidenceDelta(newest.action === 'approved' ? '+0.4' : '+0.2')

      // Animate cycle steps: 0 → 1 → 2 → complete
      setCycleStep(0)
      const t1 = setTimeout(() => setCycleStep(1), 600)
      const t2 = setTimeout(() => setCycleStep(2), 1200)
      const t3 = setTimeout(() => { setIsAdapting(false); setCycleStep(-1) }, 2200)
      const t4 = setTimeout(() => setConfidenceDelta(null), 3000)

      prevLengthRef.current = feedbackHistory.length
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
    }
  }, [feedbackHistory])

  const recent = feedbackHistory.slice(0, 3)
  const latestImpact = feedbackHistory[0]?.rankingImpact ?? null

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-violet-600" />
            <h3 className="text-sm font-semibold text-gray-900">Active Learning</h3>
          </div>
          <div className="flex items-center gap-2">
            <AnimatePresence mode="wait">
              {isAdapting ? (
                <motion.div
                  key="adapting"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-1.5 px-2 py-0.5 bg-violet-50 border border-violet-200 rounded-full"
                >
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-violet-500"
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ repeat: Infinity, duration: 0.7 }}
                  />
                  <span className="text-[11px] font-semibold text-violet-600">Recalibrating...</span>
                </motion.div>
              ) : (
                <motion.div
                  key="stable"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                  <span className="text-xs font-semibold text-violet-600">
                    {metrics.systemConfidence}% confidence
                    {confidenceDelta && (
                      <motion.span
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-emerald-600 ml-1"
                      >
                        {confidenceDelta}
                      </motion.span>
                    )}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Learning Cycle */}
        <div className="px-1 py-2 bg-gray-50 rounded-lg">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5 px-1">Learning Cycle</p>
          <div className="flex items-center gap-1">
            {CYCLE_STEPS.map((step, i) => {
              const done = cycleStep > i
              const active = cycleStep === i
              const completedAll = cycleStep >= 3

              return (
                <div key={step.key} className="flex items-center gap-1 flex-1">
                  <motion.div
                    animate={{
                      opacity: completedAll || done || active ? 1 : 0.35,
                      scale: active ? 1.03 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className={[
                      'flex-1 rounded-lg p-2 border transition-colors duration-300 text-center',
                      completedAll || done || active
                        ? 'bg-violet-50 border-violet-200'
                        : 'bg-white border-gray-200',
                    ].join(' ')}
                  >
                    <step.Icon
                      className={`w-3.5 h-3.5 mx-auto mb-1 transition-colors duration-300 ${
                        completedAll || done || active ? 'text-violet-600' : 'text-gray-300'
                      }`}
                    />
                    <p className={`text-[10px] font-semibold leading-none mb-0.5 ${
                      completedAll || done || active ? 'text-violet-700' : 'text-gray-400'
                    }`}>{step.label}</p>
                    <p className={`text-[9px] leading-none ${
                      completedAll || done || active ? 'text-gray-500' : 'text-gray-300'
                    }`}>{step.sub}</p>
                  </motion.div>
                  {i < CYCLE_STEPS.length - 1 && (
                    <motion.div
                      animate={{ opacity: (done || completedAll) ? 1 : 0.2 }}
                      transition={{ duration: 0.3 }}
                      className="text-gray-400 text-[10px] flex-shrink-0"
                    >
                      →
                    </motion.div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* System Adapting flash */}
        <AnimatePresence>
          {isAdapting && latestAdaptation && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="px-3 py-2.5 bg-violet-50 border border-violet-200 rounded-lg"
            >
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-3 h-3 text-violet-600" />
                <span className="text-[11px] font-bold text-violet-700 uppercase tracking-wider">System Adapting</span>
              </div>
              <p className="text-xs font-medium text-violet-700 leading-relaxed">
                {latestAdaptation.learningUpdate}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Weights */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Active Weights</p>
          {metrics.adaptations.length === 0 ? (
            <p className="text-xs text-gray-400 py-1">
              추천을 승인/거절하면 가중치 변화가 여기에 표시됩니다.
            </p>
          ) : (
            metrics.adaptations.map((a, i) => (
              <motion.div
                key={a.label}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center justify-between gap-2"
              >
                <p className="text-xs text-gray-600 truncate">{a.label}</p>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {a.direction === 'up'
                    ? <TrendingUp className="w-3 h-3 text-emerald-600" />
                    : <TrendingDown className="w-3 h-3 text-red-500" />
                  }
                  <span className={`text-[11px] font-semibold tabular-nums ${
                    a.direction === 'up' ? 'text-emerald-600' : 'text-red-500'
                  }`}>
                    {a.delta}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>

        <Separator />

        {/* Ranking Impact */}
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Ranking Impact</p>
          <AnimatePresence mode="wait">
            {latestImpact ? (
              <motion.div
                key={feedbackHistory[0]?.id}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', damping: 22, stiffness: 260 }}
                className="flex items-center justify-between px-2.5 py-2 bg-gray-50 rounded-lg"
              >
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate">{latestImpact.accountName}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Urgency Score 변화</p>
                </div>
                <div className={`flex items-center gap-1 flex-shrink-0 px-2 py-1 rounded-md ${
                  latestImpact.direction === 'up'
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-red-50 text-red-500'
                }`}>
                  {latestImpact.direction === 'up'
                    ? <ArrowUp className="w-3 h-3" />
                    : <ArrowDown className="w-3 h-3" />
                  }
                  <span className="text-xs font-bold tabular-nums">
                    {latestImpact.direction === 'up' ? '+' : ''}{latestImpact.scoreDelta}pts
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.p
                key="empty-impact"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-gray-400 py-1"
              >
                피드백을 주면 계정 Urgency Score 변화가 표시됩니다.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <Separator />

        {/* Recent Feedback */}
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Recent Feedback</p>
          <div className="space-y-1.5">
            <AnimatePresence initial={false}>
              {recent.map((fb, idx) => {
                const cfg = ACTION_CONFIG[fb.action]
                const Icon = cfg?.Icon || CheckCircle2
                const isNewest = idx === 0 && latestAdaptation?.id === fb.id

                return (
                  <motion.div
                    key={fb.id}
                    initial={{ opacity: 0, y: -10, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: 'spring', damping: 22, stiffness: 260 }}
                    className={[
                      'p-2.5 rounded-lg transition-colors',
                      isNewest ? 'bg-gray-50 border border-gray-200' : 'bg-gray-50',
                    ].join(' ')}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className={`flex items-center gap-1.5 text-[10px] font-semibold ${cfg?.color}`}>
                        <Icon className="w-3 h-3" />
                        {cfg?.label}
                      </div>
                      <span className="text-[10px] text-gray-400">{fmtTime(fb.timestamp)}</span>
                    </div>
                    {fb.learningUpdate && (
                      <p className="text-[11px] text-violet-700 leading-relaxed">{fb.learningUpdate}</p>
                    )}
                  </motion.div>
                )
              })}
            </AnimatePresence>

            {recent.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-3">
                추천을 승인/거절하면 여기에 표시됩니다.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-[10px] text-gray-400">
          <span>
            {metrics.totalFeedbacks === 0
              ? '아직 피드백 없음'
              : `총 ${metrics.totalFeedbacks}개 피드백 · 승인율 ${metrics.approvalRate}%`}
          </span>
          <span>Updated {metrics.lastUpdated}</span>
        </div>
      </CardContent>
    </Card>
  )
}
