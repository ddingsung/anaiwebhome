import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Brain, AlertCircle } from 'lucide-react'
import ActionCard from './ActionCard'
import RiskAlerts from './RiskAlerts'
import DealPipelineSnapshot from './DealPipelineSnapshot'
import MarketingIntelligence from './MarketingIntelligence'
import TeamActivityFeed from './TeamActivityFeed'
import ActiveLearningPanel from './ActiveLearningPanel'
import { Badge } from '@crm/components/ui/badge'

// ─── Playbook badge labels (new question keys) ──────────────────────────────
const PLAYBOOK_LABELS = {
  churnSensitivity: { pipeline: 'Pipeline Focus', retention: 'Retention First' },
  dealMotion: { enterprise: 'Enterprise', volume: 'Mid-Market' },
  dealBlocker: { decisions: 'Decision Blocker', pricing: 'Pricing Blocker', legal: 'Legal Blocker', priority: 'Priority Blocker' },
  recStyle: { fast: 'Action-First', evidence: 'Evidence-First' },
  pricingStance: { flexible: 'Flexible Terms', strict: 'Price Defense' },
}

// ─── Playbook bonus score per account ────────────────────────────────────────
function getPlaybookBonus(account, deal, playbook) {
  if (!playbook) return 0
  let bonus = 0

  if (playbook.churnSensitivity === 'retention') {
    if (account.riskLevel === 'critical') bonus += 6
    else if (account.riskLevel === 'high') bonus += 3
  }
  if (playbook.churnSensitivity === 'pipeline') {
    if (deal && deal.value >= 500000) bonus += 8
    else if (deal && deal.value >= 300000) bonus += 4
  }

  if (playbook.dealMotion === 'enterprise') {
    if (account.arr >= 500000) bonus += 7
    else if (account.arr >= 300000) bonus += 3
  }
  if (playbook.dealMotion === 'volume') {
    if (account.arr < 200000) bonus += 7
  }

  if (playbook.dealBlocker === 'legal') {
    if (deal && (deal.stage === 'Legal Review' || deal.stage === 'Contract Review')) bonus += 7
    if (account.tags?.some(t => /legal/i.test(t))) bonus += 2
  }
  if (playbook.dealBlocker === 'decisions') {
    if (account.tags?.some(t => /response|decision|slow/i.test(t))) bonus += 10
  }
  if (playbook.dealBlocker === 'pricing') {
    if (account.tags?.some(t => /budget|pricing/i.test(t))) bonus += 10
  }
  if (playbook.dealBlocker === 'priority') {
    if (account.tags?.some(t => /q2|risk|shift/i.test(t))) bonus += 8
  }

  if (playbook.recStyle === 'fast') {
    if (account.tags?.some(t => /hot|ready|close/i.test(t))) bonus += 8
    if (deal && deal.stage === 'Contract Review') bonus += 5
  }
  if (playbook.recStyle === 'evidence') {
    if (deal && deal.probability >= 70) bonus += 5
  }

  if (playbook.pricingStance === 'strict') {
    if (deal && deal.probability < 50 && deal.value >= 300000) bonus += 6
  }
  if (playbook.pricingStance === 'flexible') {
    if (deal && deal.probability >= 75) bonus += 7
  }

  return bonus
}

// ─── Which playbook settings are driving this ranking ───────────────────────
function getRankingRationale(playbook) {
  if (!playbook) return null
  const parts = []
  if (playbook.churnSensitivity === 'retention') parts.push('Retention 민감도 반영')
  if (playbook.churnSensitivity === 'pipeline') parts.push('Pipeline 집중 반영')
  if (playbook.dealBlocker === 'legal') parts.push('Legal Blocker 가중치')
  if (playbook.dealBlocker === 'decisions') parts.push('의사결정 속도 우선')
  if (playbook.dealBlocker === 'pricing') parts.push('Pricing 저항 신호 강조')
  if (playbook.dealBlocker === 'priority') parts.push('내부 Priority 저하 감지')
  if (playbook.recStyle === 'fast') parts.push('Action-First 스코어링')
  if (playbook.pricingStance === 'strict') parts.push('Price Defense 가중치')
  return parts.slice(0, 3).join(' · ')
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 24, stiffness: 200 } } }

// Returns highlight ring classes when demo is active and target matches
function demoRing(demoTarget, myTarget) {
  if (demoTarget !== myTarget) return ''
  return 'ring-2 ring-indigo-500/50 ring-offset-2 ring-offset-gray-50 rounded-xl transition-all duration-300'
}

export default function IntelligenceHub({
  playbook, accounts, deals, recommendations, feedbackHistory, metrics,
  feedbackScores, onAccountSelect, onFeedback, selectedAccountId,
  demoMode, demoTarget,
}) {
  const now = new Date()
  const dateStr = `${WEEKDAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}`

  const effectiveScores = Object.fromEntries(
    accounts.map(a => [
      a.id,
      a.urgencyScore + getPlaybookBonus(a, deals.find(d => d.id === a.dealId), playbook) + (feedbackScores?.[a.id] || 0),
    ])
  )

  const topAccounts = [...accounts]
    .sort((a, b) => effectiveScores[b.id] - effectiveScores[a.id])
    .slice(0, 3)

  const playbookBadges = playbook
    ? Object.entries(PLAYBOOK_LABELS)
        .map(([key, vals]) => playbook[key] ? { label: vals[playbook[key]], key } : null)
        .filter(Boolean)
    : []

  const rankingRationale = getRankingRationale(playbook)

  const criticalCount = accounts.filter(a => a.riskLevel === 'critical').length
  const highCount = accounts.filter(a => a.riskLevel === 'high').length

  const prevTopIdsRef = useRef([])
  const [rankingFlash, setRankingFlash] = useState(false)

  useEffect(() => {
    const prev = prevTopIdsRef.current.join(',')
    const curr = topAccounts.map(a => a.id).join(',')
    if (prev && prev !== curr) {
      setRankingFlash(true)
      const t = setTimeout(() => setRankingFlash(false), 2500)
      return () => clearTimeout(t)
    }
    prevTopIdsRef.current = topAccounts.map(a => a.id)
  }, [topAccounts])

  useEffect(() => {
    if (!demoTarget) return
    const el = document.getElementById(`demo-${demoTarget}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [demoTarget])

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className={`max-w-[1280px] mx-auto px-6 py-5 ${demoMode ? 'pb-20' : ''}`}>

        {/* ─── Header ──────────────────────────────────────────────── */}
        <motion.div
          id="demo-header"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-lg font-semibold text-gray-900">Intelligence Hub</h1>
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-indigo-50 border border-indigo-200 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  <span className="text-[11px] font-semibold text-indigo-600">AI Active</span>
                </div>
              </div>
              <p className="text-xs text-gray-400">{dateStr}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {playbookBadges.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap justify-end">
                {playbookBadges.map(b => (
                  <Badge key={b.key} variant="default">{b.label}</Badge>
                ))}
                <div className="flex items-center gap-1.5 pl-2 border-l border-gray-200">
                  <Brain className="w-3 h-3 text-violet-600" />
                  <span className="text-xs text-violet-600 font-semibold">{metrics.systemConfidence}%</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* ─── ACTION REQUIRED — Top Priority Section ──────────────── */}
        <section id="demo-action-section" className={`mb-6 ${demoRing(demoTarget, 'action-section')}`}>
          {/* Section heading — dominant */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 border border-red-200 rounded-full">
                <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                <span className="text-xs font-bold text-red-600 uppercase tracking-wide">Action Required</span>
              </div>
              {(criticalCount > 0 || highCount > 0) && (
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  {criticalCount > 0 && <span className="text-red-600 font-semibold">Critical {criticalCount}건</span>}
                  {criticalCount > 0 && highCount > 0 && <span>·</span>}
                  {highCount > 0 && <span className="text-amber-500 font-semibold">High Risk {highCount}건</span>}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <AnimatePresence>
                {rankingFlash && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center gap-1.5 px-2 py-1 bg-violet-50 border border-violet-200 rounded-full"
                  >
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-violet-500"
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ repeat: Infinity, duration: 0.7 }}
                    />
                    <span className="text-[11px] font-semibold text-violet-600">AI 재랭킹 완료</span>
                  </motion.div>
                )}
              </AnimatePresence>
              <Zap className="w-3 h-3 text-amber-500" />
              <span className="text-xs text-gray-400">AI 우선순위 · 매일 재계산됨</span>
            </div>
          </div>

          {/* Top 3 Cards */}
          <div className="grid grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {topAccounts.map((account, index) => (
                <motion.div
                  key={account.id}
                  layout
                  initial={{ opacity: 0, y: 16, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.18 } }}
                  transition={{ type: 'spring', damping: 22, stiffness: 200 }}
                >
                  <ActionCard
                    account={account}
                    recommendation={recommendations.find(r => r.id === account.recommendationId)}
                    onSelect={onAccountSelect}
                    isSelected={selectedAccountId === account.id}
                    rank={index + 1}
                    onFeedback={onFeedback}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Playbook → Ranking connection */}
          {rankingRationale && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 mt-3 px-1"
            >
              <Brain className="w-3 h-3 text-violet-600 flex-shrink-0" />
              <p className="text-xs text-gray-400">
                <span className="text-gray-500">Playbook 기반 랭킹:</span>
                {' '}
                <span className="text-violet-600 font-medium">{rankingRationale}</span>
              </p>
            </motion.div>
          )}
        </section>

        {/* ─── Risk Alerts + Pipeline (secondary context) ──────────── */}
        <motion.div
          id="demo-risk-pipeline"
          variants={container}
          initial="hidden"
          animate="show"
          className={`grid grid-cols-2 gap-4 mb-4 ${demoRing(demoTarget, 'risk-pipeline')}`}
        >
          <motion.div variants={item}>
            <RiskAlerts accounts={accounts} onAccountSelect={onAccountSelect} effectiveScores={effectiveScores} />
          </motion.div>
          <motion.div variants={item}>
            <DealPipelineSnapshot accounts={accounts} deals={deals} onAccountSelect={onAccountSelect} effectiveScores={effectiveScores} />
          </motion.div>
        </motion.div>

        {/* ─── Marketing Intelligence ───────────────────────────────── */}
        <motion.div
          id="demo-marketing-section"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.35 }}
          className={`mb-4 ${demoRing(demoTarget, 'marketing-section')}`}
        >
          <MarketingIntelligence />
        </motion.div>

        {/* ─── Team Activity + Active Learning ─────────────────────── */}
        <motion.div
          id="demo-team-section"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.35 }}
          className={`grid grid-cols-2 gap-4 pb-6 ${demoRing(demoTarget, 'team-section')}`}
        >
          <TeamActivityFeed onAccountSelect={onAccountSelect} />
          <div id="demo-learning-panel" className={demoRing(demoTarget, 'learning-panel')}>
            <ActiveLearningPanel
              feedbackHistory={feedbackHistory}
              metrics={metrics}
              onFeedback={onFeedback}
            />
          </div>
        </motion.div>

      </div>
    </div>
  )
}
