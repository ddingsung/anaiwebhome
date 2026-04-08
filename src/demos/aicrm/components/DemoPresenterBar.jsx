import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, MonitorPlay } from 'lucide-react'

export const ONBOARDING_STEPS = [
  {
    id: 'ob-intro',
    target: 'onboarding-header',
    eyebrow: 'AI Playbook 설정',
    title: '5가지 답변이 AI를 우리 팀에 맞춥니다',
    body: '지금 선택하는 우선순위·딜 방식·스타일이 Action Required 순위와 추천 가이던스에 직접 반영됩니다. 답변할수록 AI가 우리 팀의 영업 패턴을 학습합니다.',
    hint: '완료 후 언제든 Settings에서 변경할 수 있습니다',
  },
]

export const DEMO_STEPS = [
  {
    id: 'overview',
    target: 'header',
    eyebrow: 'Intelligence Hub',
    title: '방금 설정한 Playbook이 여기에 바로 반영됩니다',
    body: '오른쪽 배지들이 방금 고르신 전략입니다. AI는 이 설정을 기반으로 수십 개 계정의 신호를 실시간으로 분석해, 오늘 가장 먼저 움직여야 할 계정을 아래에 뽑아두었습니다.',
    hint: '상단 배지와 Confidence % 수치를 확인해보세요',
  },
  {
    id: 'top3',
    target: 'action-section',
    eyebrow: '오늘의 Action Required',
    title: '오늘 연락해야 할 계정 3개, 이유까지 준비됐습니다',
    body: 'Urgency Score · 리스크 신호 · Playbook 가중치를 합산해 자동 선별됩니다. 각 카드에는 지금 해야 할 액션과 데드라인이 명시되어 있어, 아침에 열면 오늘 일정이 결정됩니다.',
    hint: '카드 우상단 순위 숫자와 하단 Action 텍스트를 확인하세요',
  },
  {
    id: 'feedback',
    target: 'action-section',
    eyebrow: 'AI 피드백',
    title: '"이 추천은 맞지 않아" — 그 판단이 AI를 바꿉니다',
    body: '카드 하단 ✓ 또는 ✗ 버튼으로 동의·거절하면 AI가 즉시 가중치를 재조정하고 순위를 다시 계산합니다. 팀원 모두의 판단이 누적될수록 추천 정확도가 올라갑니다.',
    hint: '✓ 또는 ✗ 버튼을 눌러보면 순위가 실시간으로 바뀝니다',
  },
  {
    id: 'detail',
    target: 'action-section',
    eyebrow: '계정 상세 패널',
    title: '클릭 한 번으로 미팅 준비 끝',
    body: '카드를 클릭하면 신호 타임라인, 이메일 초안, 콜 스크립트, 예상 반박까지 한 화면에 펼쳐집니다. 미팅 10분 전에 CRM을 뒤지거나 팀에 물어볼 필요가 없어집니다.',
    hint: '카드를 클릭해 오른쪽에서 슬라이드되는 상세 패널을 확인하세요',
  },
  {
    id: 'pipeline',
    target: 'risk-pipeline',
    eyebrow: 'Risk & Pipeline',
    title: '지금 터질 것 같은 딜, AI가 먼저 알려줍니다',
    body: 'Risk Alerts는 챔피언 이탈·예산 동결·경쟁사 개입 같은 위험 신호를 실시간으로 감지합니다. Pipeline Snapshot은 전체 딜의 진행 상황을 스테이지별로 보여주어 따로 리포트를 뽑을 필요가 없습니다.',
    hint: 'Risk Alerts 항목을 클릭하면 해당 계정 상세로 바로 이동합니다',
  },
  {
    id: 'marketing',
    target: 'marketing-section',
    eyebrow: 'Marketing Intelligence',
    title: '어느 채널 예산을 올려야 할지 AI가 계산해줍니다',
    body: '채널별 전환율과 ROI를 비교해 Increase / Hold / Reduce 방향을 제시합니다. "AI 예산 최적화 적용" 버튼을 누르면 배분이 즉시 바뀌고 예상 Pipeline ROI 변화가 표시됩니다.',
    hint: '하단 AI 예산 최적화 적용 버튼을 눌러 변화를 확인해보세요',
  },
  {
    id: 'team',
    target: 'team-section',
    eyebrow: 'Team Activity',
    title: '팀이 지금 무엇을 하고 있는지 한눈에',
    body: '팀원들의 미팅·이메일·데모 활동이 실시간으로 피드에 올라옵니다. 누가 어떤 계정을 터치했는지 알 수 있어, 중복 연락이나 빠진 팔로업을 즉시 파악할 수 있습니다.',
    hint: '활동 항목을 클릭하면 해당 계정 상세로 이동합니다',
  },
  {
    id: 'learning',
    target: 'learning-panel',
    eyebrow: 'Active Learning',
    title: '팀의 판단이 쌓일수록 AI가 우리 팀 스타일을 배웁니다',
    body: '승인·거절 피드백마다 Active Weights가 갱신되고 Confidence가 올라갑니다. 한 달이 지나면 AI가 우리 팀이 어떤 신호를 중요하게 보는지 스스로 파악해, 추천 품질이 눈에 띄게 달라집니다.',
    hint: 'Feedback 횟수와 Confidence % 변화를 확인해보세요',
  },
]

export default function DemoPresenterBar({ steps = DEMO_STEPS, step, onPrev, onNext, onClose }) {
  const current = steps[step]
  const total = steps.length
  const bubbleRef = useRef(null)
  const [bubbleStyle, setBubbleStyle] = useState({ right: 24, bottom: 24 })

  useEffect(() => {
    const el = document.getElementById(`demo-${current.target}`)
    if (!el || !bubbleRef.current) {
      setBubbleStyle({ right: 24, bottom: 24 })
      return
    }

    const rect = el.getBoundingClientRect()
    const bubbleH = bubbleRef.current.offsetHeight || 280
    const vh = window.innerHeight

    let top = rect.top + rect.height / 2 - bubbleH / 2
    top = Math.max(16, Math.min(vh - bubbleH - 16, top))

    setBubbleStyle({ right: 24, top })
  }, [step, current.target])

  return (
    <motion.div
      ref={bubbleRef}
      key="demo-bubble"
      className="fixed z-50 w-[360px] rounded-2xl overflow-hidden shadow-[0_12px_48px_rgba(0,0,0,0.2)] border border-indigo-100"
      style={bubbleStyle}
      initial={{ opacity: 0, x: 32, scale: 0.92 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 32, scale: 0.92 }}
      transition={{ type: 'spring', damping: 22, stiffness: 280 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-indigo-600">
        <div className="flex items-center gap-2">
          <MonitorPlay className="w-3.5 h-3.5 text-indigo-200" />
          <span className="text-xs font-bold text-white uppercase tracking-widest">Demo</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  i === step
                    ? 'w-3.5 h-1.5 bg-white'
                    : i < step
                    ? 'w-1.5 h-1.5 bg-indigo-300'
                    : 'w-1.5 h-1.5 bg-indigo-500'
                }`}
              />
            ))}
          </div>
          <button
            onClick={onClose}
            className="text-indigo-300 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="bg-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            transition={{ duration: 0.18 }}
          >
            <div className="px-4 pt-4 pb-3">
              <span className="inline-block text-[11px] font-bold text-indigo-600 uppercase tracking-widest mb-2">
                {current.eyebrow}
              </span>
              <p className="text-sm font-bold text-gray-900 leading-snug mb-2.5">
                {current.title}
              </p>
              <p className="text-xs text-gray-500 leading-relaxed">
                {current.body}
              </p>
            </div>

            <div className="px-4 pb-4">
              <div className="flex items-start gap-2 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl">
                <span className="text-amber-500 flex-shrink-0 mt-0.5 text-xs">💡</span>
                <span className="text-xs text-amber-700 leading-snug">{current.hint}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <button
            onClick={onPrev}
            disabled={step === 0}
            className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-gray-700 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            이전
          </button>

          <span className="text-[11px] text-gray-300 tabular-nums">{step + 1} / {total}</span>

          <button
            onClick={onNext}
            className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            {step === total - 1 ? '데모 종료' : '다음'}
            {step < total - 1 && <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
