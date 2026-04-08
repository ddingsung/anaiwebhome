import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Onboarding from './components/Onboarding'
import Sidebar from './components/Sidebar'
import IntelligenceHub from './components/IntelligenceHub'
import AccountDetailPanel from './components/AccountDetailPanel'
import DemoPresenterBar, { DEMO_STEPS } from './components/DemoPresenterBar'
import AccountsPanel from './components/panels/AccountsPanel'
import PipelinePanel from './components/panels/PipelinePanel'
import MarketingPanel from './components/panels/MarketingPanel'
import CoachingPanel from './components/panels/CoachingPanel'
import SettingsPanel from './components/panels/SettingsPanel'
import {
  accounts, deals, contacts, activities, signals,
  aiRecommendations, coachingFeedback, learningMetrics as initMetrics,
} from './data/mockData'

// Human-readable learning update messages
const LEARNING_UPDATES = {
  approved: (_, type) => ({
    urgent_action: '챔피언 리스크 긴급도 가중치 +12% · 경쟁사 데드라인 스코어링 상향',
    risk_mitigation: '법무 블로커 우선도 상향 · 근거 기반 접근 패턴 강화됨',
    re_engagement: '응답 지연 신호 우선도 강화 · 재접촉 케이던스 가중치 상향',
    close_assist: '클로징 지원 패턴 강화 · 법무 가속화 가중치 상향',
    technical_acceleration: '보안 검토 긴급도 상향 · 기술 블로커 가중치 강화됨',
  })[type] || '유사 패턴 강화됨 · 스코어링 상향',
  rejected: (_, type) => ({
    urgent_action: '검증 우선 행동 패턴 적용 · 공격적 아웃리치 케이던스 하향',
    risk_mitigation: '가격 저항 신호 가중치 상향 · 유연 할인 접근 우선도 하향',
    re_engagement: '직접 접촉 가중치 상향 · 레퍼런스 선행 케이던스 하향',
    close_assist: '클로징 지원 스코어링 재조정 · 법무 긴급도 임계값 상향',
    technical_acceleration: '기술 블로커 가중치 재보정',
  })[type] || '전략 가중치 조정 · 플레이북 재보정 중',
  edited: () => '맞춤 가이던스 학습됨 · 운영 스타일 선호도 저장됨',
}

// Structured weight changes per action/type — drives Active Weights display
const WEIGHT_CHANGES = {
  approved: {
    urgent_action: [
      { label: '챔피언 리스크 긴급도', delta: '+12%', direction: 'up' },
      { label: '경쟁사 데드라인 스코어', delta: '+8%', direction: 'up' },
    ],
    risk_mitigation: [
      { label: '법무 블로커 우선도', delta: '+10%', direction: 'up' },
      { label: '근거 기반 접근 패턴', delta: '+6%', direction: 'up' },
    ],
    re_engagement: [
      { label: '응답 지연 신호 가중치', delta: '+9%', direction: 'up' },
      { label: '재접촉 케이던스 점수', delta: '+7%', direction: 'up' },
    ],
    close_assist: [
      { label: '클로징 지원 패턴', delta: '+11%', direction: 'up' },
      { label: '법무 가속화 가중치', delta: '+8%', direction: 'up' },
    ],
    technical_acceleration: [
      { label: '보안 검토 긴급도', delta: '+10%', direction: 'up' },
      { label: '기술 블로커 가중치', delta: '+7%', direction: 'up' },
    ],
  },
  rejected: {
    urgent_action: [
      { label: '공격적 아웃리치 케이던스', delta: '-8%', direction: 'down' },
      { label: '검증 우선 행동 패턴', delta: '+5%', direction: 'up' },
    ],
    risk_mitigation: [
      { label: '유연 할인 접근 우선도', delta: '-6%', direction: 'down' },
      { label: '가격 저항 신호 가중치', delta: '+9%', direction: 'up' },
    ],
    re_engagement: [
      { label: '레퍼런스 선행 케이던스', delta: '-5%', direction: 'down' },
      { label: '직접 접촉 가중치', delta: '+8%', direction: 'up' },
    ],
    close_assist: [
      { label: '클로징 지원 스코어', delta: '-4%', direction: 'down' },
      { label: '법무 긴급도 임계값', delta: '+7%', direction: 'up' },
    ],
    technical_acceleration: [
      { label: '기술 블로커 가중치', delta: '-6%', direction: 'down' },
    ],
  },
  edited: {
    default: [
      { label: '운영 스타일 선호도', delta: '+5%', direction: 'up' },
      { label: '맞춤 가이던스 패턴', delta: '+3%', direction: 'up' },
    ],
  },
}

// Score change per feedback action/type (used for ranking impact display)
const SCORE_DELTA = {
  approved: { urgent_action: 5, risk_mitigation: 4, re_engagement: 3, close_assist: 4, technical_acceleration: 3 },
  rejected: { urgent_action: -3, risk_mitigation: -2, re_engagement: -2, close_assist: -2, technical_acceleration: -2 },
}

export default function App() {
  const [view, setView] = useState('onboarding')
  const [playbook, setPlaybook] = useState(null)
  const [selectedAccountId, setSelectedAccountId] = useState(null)
  // coachingFeedback과 동기화: 기존 피드백이 있으면 recommendation 상태에 반영
  const initRecommendations = aiRecommendations.map(rec => {
    const existing = coachingFeedback.find(f => f.recommendationId === rec.id)
    return existing ? { ...rec, status: existing.action } : rec
  })
  const [recommendations, setRecommendations] = useState(initRecommendations)
  const [feedbackHistory, setFeedbackHistory] = useState(coachingFeedback)
  const [metrics, setMetrics] = useState({
    ...initMetrics,
    totalFeedbacks: coachingFeedback.length,
    approvalRate: coachingFeedback.length === 0 ? 0
      : Math.round(coachingFeedback.filter(f => f.action === 'approved').length / coachingFeedback.length * 100),
  })

  const [feedbackScores, setFeedbackScores] = useState({})
  const [activeNav, setActiveNav] = useState('intelligence')
  const [demoMode, setDemoMode] = useState(false)
  const [demoStep, setDemoStep] = useState(0)

  const handlePlaybookComplete = (pb) => {
    setPlaybook(pb)
    setView('app')
    setDemoStep(0)
    setDemoMode(true)
  }

  const handleDemoNext = () => {
    if (demoStep < DEMO_STEPS.length - 1) setDemoStep(s => s + 1)
    else setDemoMode(false)
  }
  const handleDemoPrev = () => setDemoStep(s => Math.max(0, s - 1))
  const handleDemoClose = () => setDemoMode(false)

  const handleAccountSelect = (accountId) => {
    setSelectedAccountId(accountId)
  }

  const handleCloseDetail = () => {
    setSelectedAccountId(null)
  }

  const handleNavChange = (nav) => {
    if (nav !== 'intelligence') setSelectedAccountId(null)
    setActiveNav(nav)
  }

  const handleAccountSelectFromPanel = (accountId) => {
    setSelectedAccountId(accountId)
    setActiveNav('intelligence')
  }

  const handleFeedback = (recId, action, note) => {
    const rec = recommendations.find(r => r.id === recId)
    if (!rec) return

    setRecommendations(prev =>
      prev.map(r => r.id === recId ? { ...r, status: action } : r)
    )

    const accountId = accounts.find(a => a.recommendationId === recId)?.id
    if (accountId) {
      setFeedbackScores(prev => ({
        ...prev,
        [accountId]: (prev[accountId] || 0) + (action === 'approved' ? 12 : action === 'rejected' ? -20 : 0),
      }))
    }

    // Compute ranking impact for this feedback
    const impactedAccount = accounts.find(a => a.recommendationId === recId)
    const scoreDelta = action === 'edited' ? 0
      : (SCORE_DELTA[action]?.[rec.type] ?? (action === 'approved' ? 3 : -2))

    setFeedbackHistory(prev => [{
      id: `fb_${Date.now()}`,
      recommendationId: recId,
      action,
      timestamp: new Date().toISOString(),
      userNote: note || null,
      learningUpdate: LEARNING_UPDATES[action](rec.title, rec.type),
      rankingImpact: impactedAccount && scoreDelta !== 0 ? {
        accountName: impactedAccount.name,
        scoreDelta,
        direction: scoreDelta > 0 ? 'up' : 'down',
      } : null,
    }, ...prev])

    setMetrics(prev => {
      // Merge new weight changes into adaptations, deduplicate by label
      const newWeights = WEIGHT_CHANGES[action]?.[rec.type]
        ?? WEIGHT_CHANGES[action]?.default
        ?? []
      const merged = [...newWeights, ...prev.adaptations]
        .filter((w, i, self) => self.findIndex(t => t.label === w.label) === i)
        .slice(0, 6)

      const newTotal = prev.totalFeedbacks + 1
      const prevApproved = Math.round(prev.approvalRate * prev.totalFeedbacks / 100)
      const newApproved = prevApproved + (action === 'approved' ? 1 : 0)
      return {
        ...prev,
        adaptations: merged,
        totalFeedbacks: newTotal,
        approvalRate: Math.round(newApproved / newTotal * 100),
        systemConfidence: Math.min(99, parseFloat((prev.systemConfidence + (action === 'approved' ? 0.4 : 0.2)).toFixed(1))),
        lastUpdated: 'just now',
      }
    })
  }

  // Derived data for selected account
  const selectedAccount = accounts.find(a => a.id === selectedAccountId)
  const selectedDeal = selectedAccount ? deals.find(d => d.id === selectedAccount.dealId) : null
  const selectedContacts = selectedAccount ? contacts.filter(c => selectedAccount.contactIds.includes(c.id)) : []
  const selectedActivities = selectedAccount ? activities.filter(a => a.accountId === selectedAccountId).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) : []
  const selectedSignals = selectedAccount ? signals.filter(s => selectedAccount.signalIds.includes(s.id)) : []
  const selectedRec = selectedAccount ? recommendations.find(r => r.id === selectedAccount.recommendationId) : null

  if (view === 'onboarding') {
    return <Onboarding onComplete={handlePlaybookComplete} />
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar activeNav={activeNav} onNavChange={handleNavChange} demoMode={demoMode} onDemoStart={() => { setDemoStep(0); setDemoMode(true); setActiveNav('intelligence'); setSelectedAccountId(null) }} />
      <div className="flex-1 min-w-0 overflow-hidden relative">
        <IntelligenceHub
          playbook={playbook}
          accounts={accounts}
          deals={deals}
          recommendations={recommendations}
          feedbackHistory={feedbackHistory}
          metrics={metrics}
          feedbackScores={feedbackScores}
          onAccountSelect={handleAccountSelect}
          onFeedback={handleFeedback}
          selectedAccountId={selectedAccountId}
          demoMode={demoMode}
          demoTarget={demoMode ? DEMO_STEPS[demoStep].target : null}
        />
        <AnimatePresence>
          {activeNav === 'intelligence' && selectedAccountId && selectedAccount && (
            <AccountDetailPanel
              key={selectedAccountId}
              account={selectedAccount}
              deal={selectedDeal}
              contacts={selectedContacts}
              activities={selectedActivities}
              signals={selectedSignals}
              recommendation={selectedRec}
              onClose={handleCloseDetail}
              onFeedback={handleFeedback}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {activeNav === 'accounts'  && <AccountsPanel  onClose={() => handleNavChange('intelligence')} onAccountSelect={handleAccountSelectFromPanel} />}
          {activeNav === 'pipeline'  && <PipelinePanel  onClose={() => handleNavChange('intelligence')} onAccountSelect={handleAccountSelectFromPanel} />}
          {activeNav === 'marketing' && <MarketingPanel onClose={() => handleNavChange('intelligence')} />}
          {activeNav === 'coaching'  && <CoachingPanel  onClose={() => handleNavChange('intelligence')} metrics={metrics} />}
          {activeNav === 'settings'  && <SettingsPanel  onClose={() => handleNavChange('intelligence')} playbook={playbook} onPlaybookChange={setPlaybook} onRestartOnboarding={() => {
            setView('onboarding')
            setPlaybook(null)
            setSelectedAccountId(null)
            setActiveNav('intelligence')
            setDemoMode(false)
            setDemoStep(0)
            setRecommendations(aiRecommendations.map(rec => ({ ...rec, status: undefined })))
            setFeedbackHistory([])
            setFeedbackScores({})
            setMetrics({ ...initMetrics, totalFeedbacks: 0, approvalRate: 0 })
          }} />}
        </AnimatePresence>
        <AnimatePresence>
          {demoMode && (
            <DemoPresenterBar
              step={demoStep}
              onPrev={handleDemoPrev}
              onNext={handleDemoNext}
              onClose={handleDemoClose}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
