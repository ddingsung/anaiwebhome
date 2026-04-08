import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, CheckCircle2, XCircle, Edit2, Mail, Phone, Copy, ChevronDown, ChevronRight,
  Target, Zap, MessageSquare, FileText,
} from 'lucide-react'

// ─── Helpers ──────────────────────────────────────────────────────────────────
const RISK_LABEL = { critical: 'CRITICAL', high: 'HIGH', medium: 'MEDIUM', low: 'LOW' }
const RISK_COLOR = {
  critical: { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  high: { text: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
  medium: { text: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  low: { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
}
const STATUS_CONFIG = {
  champion: { label: 'Champion', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  at_risk: { label: 'At Risk', color: 'text-red-500', bg: 'bg-red-50' },
  new: { label: 'New DM', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  active: { label: 'Active', color: 'text-sky-600', bg: 'bg-sky-50' },
  cold: { label: 'Cold', color: 'text-gray-500', bg: 'bg-gray-100' },
}
const AI_TAG_CONFIG = {
  competitor_mention: { label: '⚠ Competitor 언급', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  champion_risk: { label: '⚠ Champion 이탈 리스크', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  buying_signal: { label: '✓ Buying Signal', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  legal_review_delay: { label: '⏱ Legal Review 지연', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  internal_discussion: { label: '↔ 내부 논의 감지', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  high_engagement: { label: '↑ High Engagement', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  milestone: { label: '◆ Milestone', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  executive_disengagement: { label: '↓ Exec 이탈 감지', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  close_signal: { label: '✓ Close Signal', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  executive_buy_in: { label: '✓ Exec 지지 확인', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  security_concern: { label: '⚠ Security 우려', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  technical_validation: { label: '✓ Technical 검증 완료', color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-200' },
  follow_up_required: { label: '! Follow-up 필요', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  response_delay: { label: '↓ 응답 지연', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  budget_deprioritization: { label: '↓ 예산 우선순위 하락', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  evaluation_delay: { label: '⏱ 평가 기간 초과', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  proposal_view_spike: { label: '↑ 제안서 View 급증', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  competitor_evaluation: { label: '⚠ Competitor 검토 중', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
}
const TYPE_ICON = {
  email: { Icon: Mail, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  call: { Icon: Phone, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  meeting: { Icon: MessageSquare, color: 'text-sky-600', bg: 'bg-sky-50' },
}
const SEVERITY_CONFIG = {
  critical: { dot: 'bg-red-500', text: 'text-red-600', bg: 'bg-red-50' },
  high: { dot: 'bg-amber-500', text: 'text-amber-500', bg: 'bg-amber-50' },
  medium: { dot: 'bg-yellow-400', text: 'text-yellow-500', bg: 'bg-yellow-50' },
  low: { dot: 'bg-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50' },
}

const tempLabel = (t) => {
  if (t >= 80) return { label: 'Hot', color: 'text-red-500' }
  if (t >= 65) return { label: 'Warm', color: 'text-amber-500' }
  if (t >= 50) return { label: 'Cooling', color: 'text-yellow-500' }
  return { label: 'Cold', color: 'text-sky-500' }
}

const fmtVal = (n) => n >= 1000000 ? `$${(n / 1000000).toFixed(1)}M` : `$${(n / 1000).toFixed(0)}K`

const fmtDate = (ts) => {
  const d = new Date(ts)
  return d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
}

const closeDate = (ds) => {
  const d = new Date(ds)
  const diff = Math.ceil((d - new Date()) / 86400000)
  if (diff < 0) return { label: `D+${Math.abs(diff)}`, color: 'text-red-500' }
  if (diff <= 7) return { label: `D-${diff}`, color: 'text-red-500' }
  if (diff <= 30) return { label: `D-${diff}`, color: 'text-amber-500' }
  return { label: `D-${diff}`, color: 'text-gray-500' }
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-600 transition-colors px-2 py-1 rounded hover:bg-gray-100"
    >
      <Copy className="w-3 h-3" />
      {copied ? '복사됨' : '복사'}
    </button>
  )
}

function TimelineItem({ activity }) {
  const [expanded, setExpanded] = useState(false)
  const cfg = TYPE_ICON[activity.type] || TYPE_ICON.email
  const Icon = cfg.Icon
  const tag = AI_TAG_CONFIG[activity.aiTag]

  return (
    <div
      className="flex gap-3 cursor-pointer group rounded-lg transition-colors hover:bg-gray-50"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex flex-col items-center gap-1 pt-1">
        <div className={`w-6 h-6 rounded-md ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-3 h-3 ${cfg.color}`} />
        </div>
        <div className="w-px flex-1 bg-gray-200 min-h-[12px]" />
      </div>
      <div className="min-w-0 flex-1 pb-3 pt-0.5">
        {/* AI Signal tag — primary label */}
        {tag && (
          <div className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] font-semibold mb-1.5 ${tag.bg} ${tag.color} ${tag.border || 'border-transparent'}`}>
            {tag.label}
          </div>
        )}
        {/* Activity summary */}
        <p className="text-xs font-medium text-gray-800 leading-snug mb-0.5">{activity.summary}</p>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-400">{activity.actor}</span>
          <span className="text-gray-300">·</span>
          <span className="text-[10px] text-gray-400">{fmtDate(activity.timestamp)}</span>
          <ChevronDown className={`w-3 h-3 text-gray-300 ml-auto transition-transform group-hover:text-gray-500 ${expanded ? 'rotate-180' : ''}`} />
        </div>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <p className="text-xs text-gray-600 mt-2 leading-relaxed p-2.5 bg-gray-50 rounded-lg border border-gray-200">
                {activity.details}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function AIPlaybookTab({ recommendation, onFeedback }) {
  const [feedbackMode, setFeedbackMode] = useState(null) // null | 'reject' | 'edit'
  const [note, setNote] = useState('')
  const [editContent, setEditContent] = useState(recommendation?.emailDraft?.body || '')
  const [submitted, setSubmitted] = useState(recommendation?.status !== 'pending')
  const [flash, setFlash] = useState(null)

  const handleAction = (action) => {
    if (action === 'approved') {
      onFeedback(recommendation.id, 'approved', null)
      setSubmitted(true)
      setFlash('approved')
      setTimeout(() => setFlash(null), 2500)
    } else if (action === 'rejected') {
      if (feedbackMode === 'reject') {
        onFeedback(recommendation.id, 'rejected', note)
        setSubmitted(true)
        setFlash('rejected')
        setFeedbackMode(null)
        setTimeout(() => setFlash(null), 2500)
      } else {
        setFeedbackMode('reject')
      }
    } else if (action === 'edited') {
      if (feedbackMode === 'edit') {
        onFeedback(recommendation.id, 'edited', editContent)
        setSubmitted(true)
        setFlash('edited')
        setFeedbackMode(null)
        setTimeout(() => setFlash(null), 2500)
      } else {
        setFeedbackMode('edit')
      }
    }
  }

  if (!recommendation) return <p className="text-sm text-gray-400 text-center py-8">추천 데이터 없음</p>

  const statusLabel = { approved: '승인됨 ✓', rejected: '거절됨', edited: '수정됨 ✓', pending: null }

  return (
    <div className="space-y-4">
      {/* Recommended Action Card */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Recommended Next Action</p>
        <p className="text-sm font-semibold text-gray-900 mb-3">{recommendation.title}</p>

        <div className="space-y-1.5 mb-4">
          {recommendation.rationale.map((r, i) => (
            <div key={i} className="flex items-start gap-2">
              <ChevronRight className="w-3 h-3 text-indigo-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-500">{r}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
          <Target className="w-3 h-3" />
          <span>신뢰도 {recommendation.confidence}%</span>
          <span className="text-gray-200">·</span>
          <Zap className="w-3 h-3 text-amber-500" />
          <span className="text-amber-500 font-medium">긴급도 {recommendation.urgency}</span>
        </div>

        {/* Feedback buttons */}
        <AnimatePresence mode="wait">
          {flash ? (
            <motion.div
              key="flash"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className={`flex items-center gap-2 py-2 px-3 rounded-lg text-sm font-medium ${
                flash === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                flash === 'rejected' ? 'bg-red-50 text-red-500' :
                'bg-amber-50 text-amber-500'
              }`}
            >
              {flash === 'approved' && <><CheckCircle2 className="w-4 h-4" /> 승인됨 — 학습 반영 중</>}
              {flash === 'rejected' && <><XCircle className="w-4 h-4" /> 거절됨 — 전략 가중치 조정 중</>}
              {flash === 'edited' && <><Edit2 className="w-4 h-4" /> 수정 내용 학습 중</>}
            </motion.div>
          ) : submitted ? (
            <div className="text-xs text-gray-400 italic">
              {statusLabel[recommendation.status] || '피드백 반영 완료'}
            </div>
          ) : feedbackMode === 'reject' ? (
            <motion.div key="reject-form" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="거절 이유 (선택 사항)"
                className="w-full text-xs bg-white border border-gray-200 rounded-lg p-2.5 text-gray-700 placeholder-gray-400 resize-none h-16 focus:outline-none focus:border-indigo-400"
              />
              <div className="flex gap-2">
                <button onClick={() => handleAction('rejected')} className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium rounded-lg transition-colors">확인 — 거절</button>
                <button onClick={() => setFeedbackMode(null)} className="px-3 py-1.5 text-gray-400 hover:text-gray-600 text-xs transition-colors">취소</button>
              </div>
            </motion.div>
          ) : feedbackMode === 'edit' ? (
            <motion.div key="edit-form" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
              <textarea
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                className="w-full text-xs bg-white border border-gray-200 rounded-lg p-2.5 text-gray-700 resize-none h-20 focus:outline-none focus:border-indigo-400 font-mono"
              />
              <div className="flex gap-2">
                <button onClick={() => handleAction('edited')} className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 text-xs font-medium rounded-lg transition-colors">수정 완료 — 학습</button>
                <button onClick={() => setFeedbackMode(null)} className="px-3 py-1.5 text-gray-400 hover:text-gray-600 text-xs transition-colors">취소</button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="buttons" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
              <button
                onClick={() => handleAction('approved')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-xs font-semibold rounded-lg transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Approve
              </button>
              <button
                onClick={() => handleAction('rejected')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-500 text-xs font-medium rounded-lg transition-colors border border-gray-200"
              >
                <XCircle className="w-3.5 h-3.5" /> Reject
              </button>
              <button
                onClick={() => handleAction('edited')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-500 text-xs font-medium rounded-lg transition-colors border border-gray-200"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Email Draft */}
      {recommendation.emailDraft && (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-xs font-semibold text-gray-700">Email Draft</span>
            </div>
            <CopyButton text={`Subject: ${recommendation.emailDraft.subject}\n\n${recommendation.emailDraft.body}`} />
          </div>
          <div className="px-4 py-3 space-y-2">
            <div className="flex gap-2">
              <span className="text-[10px] text-gray-400 flex-shrink-0 mt-0.5">Subject</span>
              <p className="text-xs font-semibold text-gray-800">{recommendation.emailDraft.subject}</p>
            </div>
            <div className="border-t border-gray-200 pt-2">
              <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line font-mono">{recommendation.emailDraft.body}</p>
            </div>
          </div>
        </div>
      )}

      {/* Call Script */}
      {recommendation.callScript && (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-200">
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs font-semibold text-gray-700">Call Script</span>
          </div>
          <div className="px-4 py-3 space-y-3">
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Opening</p>
              <p className="text-xs text-gray-500 italic leading-relaxed">"{recommendation.callScript.opening}"</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Key Points</p>
              <div className="space-y-1">
                {recommendation.callScript.keyPoints.map((p, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-[10px] text-gray-400 mt-0.5 flex-shrink-0">{i + 1}.</span>
                    <p className="text-xs text-gray-500 leading-relaxed">{p}</p>
                  </div>
                ))}
              </div>
            </div>
            {recommendation.callScript.objections && Object.keys(recommendation.callScript.objections).length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Objection Handling</p>
                {Object.entries(recommendation.callScript.objections).map(([obj, resp]) => (
                  <div key={obj} className="mb-2 p-2.5 bg-gray-50 rounded-lg">
                    <p className="text-[11px] font-medium text-gray-600 mb-1">"{obj}"</p>
                    <p className="text-[11px] text-gray-500 italic leading-relaxed">→ {resp}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Proposal Talking Points */}
      {recommendation.proposalPoints && (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-200">
            <FileText className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-semibold text-gray-700">Proposal Talking Points</span>
          </div>
          <div className="px-4 py-3 space-y-2">
            {recommendation.proposalPoints.map((p, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="text-[10px] font-bold text-indigo-600 mt-0.5 flex-shrink-0">0{i + 1}</span>
                <p className="text-xs text-gray-700 leading-relaxed">{p}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AccountDetailPanel({
  account, deal, contacts, activities, signals, recommendation, onClose, onFeedback,
}) {
  const [activeTab, setActiveTab] = useState('overview')
  const [expandedSignal, setExpandedSignal] = useState(null)

  const rc = RISK_COLOR[account.riskLevel]
  const temp = tempLabel(account.relationshipTemp)
  const cd = deal ? closeDate(deal.closeDate) : null

  const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'timeline', label: `Timeline (${activities.length})` },
    { id: 'playbook', label: 'AI Playbook' },
  ]

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-40"
      />

      {/* Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
        className="fixed top-0 right-0 h-screen w-[580px] bg-white border-l border-gray-200 z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex-shrink-0 px-5 py-4 border-b border-gray-100">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-base font-semibold text-gray-900">{account.name}</h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${rc.bg} ${rc.text} border ${rc.border}`}>
                  ● {RISK_LABEL[account.riskLevel]}
                </span>
              </div>
              <p className="text-xs text-gray-500">{account.industry} · {account.location}</p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick metrics */}
          <div className={`grid ${cd ? 'grid-cols-4' : 'grid-cols-3'} gap-2`}>
            <div className="p-2 bg-gray-50 rounded-lg text-center">
              <p className={`text-sm font-bold ${account.successProbability >= 60 ? 'text-emerald-600' : account.successProbability >= 40 ? 'text-amber-500' : 'text-red-500'}`}>
                {account.successProbability}%
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">성공 확률</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg text-center">
              <p className={`text-sm font-bold ${rc.text}`}>{account.urgencyScore}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">긴급도</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg text-center">
              <p className={`text-sm font-bold ${temp.color}`}>{account.relationshipTemp}°</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{temp.label}</p>
            </div>
            {cd && (
              <div className="p-2 bg-gray-50 rounded-lg text-center">
                <p className={`text-sm font-bold ${cd.color}`}>{cd.label}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Close</p>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex-shrink-0 flex border-b border-gray-200">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={[
                'flex-1 py-2.5 text-xs font-medium transition-colors',
                activeTab === tab.id
                  ? 'text-gray-900 border-b-2 border-indigo-600'
                  : 'text-gray-400 hover:text-gray-700',
              ].join(' ')}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >

              {/* ─── OVERVIEW TAB ──────────────────────────────── */}
              {activeTab === 'overview' && (
                <div className="space-y-5">
                  {/* Active Signals */}
                  <div>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Active Signals ({signals.length})
                    </p>
                    {signals.length === 0 && (
                      <p className="text-xs text-gray-400 py-2">감지된 신호 없음</p>
                    )}
                    <div className="space-y-2">
                      {signals.map((sig) => {
                        const sc = SEVERITY_CONFIG[sig.severity]
                        const isExpanded = expandedSignal === sig.id
                        return (
                          <div
                            key={sig.id}
                            className="p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors"
                            onClick={() => setExpandedSignal(isExpanded ? null : sig.id)}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${sc.dot} flex-shrink-0`} />
                                <p className="text-xs font-semibold text-gray-800">{sig.label}</p>
                                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${sc.bg} ${sc.text}`}>
                                  {sig.severity.toUpperCase()}
                                </span>
                              </div>
                              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                            </div>
                            <p className="text-xs text-gray-500 mt-1.5 ml-4 leading-relaxed">{sig.summary}</p>
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <p className="text-[11px] text-gray-500 mt-2 ml-4 p-2 bg-gray-100 rounded leading-relaxed border-l-2 border-gray-300">
                                    {sig.evidence}
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Contacts */}
                  <div>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Contacts ({contacts.length})
                    </p>
                    {contacts.length === 0 && (
                      <p className="text-xs text-gray-400 py-2">등록된 연락처 없음</p>
                    )}
                    <div className="space-y-2">
                      {contacts.map((c) => {
                        const sc = STATUS_CONFIG[c.status] || STATUS_CONFIG.active
                        return (
                          <div key={c.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 text-xs font-semibold text-gray-600">
                              {c.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-sm font-medium text-gray-900">{c.name}</p>
                                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${sc.bg} ${sc.color}`}>
                                  {sc.label}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5">{c.role}</p>
                              <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{c.note}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-[10px] text-gray-400">마지막 연락</p>
                              <p className={`text-[11px] font-medium ${c.lastContact === '미접촉' ? 'text-red-500' : 'text-gray-500'}`}>
                                {c.lastContact}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Deal Info */}
                  <div>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Deal Details</p>
                    {deal ? (
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500">계약 가치</p>
                          <p className="text-sm font-semibold text-gray-800">{fmtVal(deal.value)}/yr</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500">Stage</p>
                          <p className="text-xs font-medium text-gray-700">{deal.stage} ({deal.daysInStage}일)</p>
                        </div>
                        {deal.competitors.length > 0 && (
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500">경쟁사</p>
                            <p className="text-xs text-red-500">{deal.competitors.join(', ')}</p>
                          </div>
                        )}
                        <div className="pt-2 border-t border-gray-200">
                          <p className="text-[10px] text-gray-400 mb-1">Next Step</p>
                          <p className="text-xs text-gray-700 leading-relaxed">{deal.nextStep}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-center">
                        <p className="text-xs text-gray-400">등록된 딜 없음</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ─── TIMELINE TAB ──────────────────────────────── */}
              {activeTab === 'timeline' && (
                <div>
                  {/* Why system elevated this account */}
                  <div className="mb-4 p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">이 계정이 상위에 오른 이유 · Why Elevated</p>
                    <p className="text-xs text-gray-700 leading-relaxed mb-2">{account.summary}</p>
                    {account.rankDrivers && (
                      <div className="flex flex-wrap gap-1.5">
                        {account.rankDrivers.map((driver, i) => (
                          <span key={i} className="text-[10px] font-medium px-2 py-0.5 bg-gray-100 border border-gray-200 text-gray-600 rounded-full">
                            {driver}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Activity Timeline · AI 신호 태그
                  </p>
                  <div className="space-y-0">
                    {activities.map((act) => (
                      <TimelineItem key={act.id} activity={act} />
                    ))}
                  </div>
                </div>
              )}

              {/* ─── AI PLAYBOOK TAB ────────────────────────────── */}
              {activeTab === 'playbook' && recommendation && (
                <AIPlaybookTab recommendation={recommendation} onFeedback={onFeedback} />
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  )
}
